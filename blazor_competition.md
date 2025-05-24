# Сравнение React с Blazor WebAssembly

Не секрет, что при работе React-приложений, значительные вычислительные ресурсы расходуются впустую. Это обусловлено следующими факторами:

- языковыми особенностями JavaScript и Runtime V8
- построением RenderTree каждый раз при изменении состояния
- сравнение текущего и предыдущего RenderTree c "отбрасыванием" части результатов вычислений

Для оптимизации работы приложения в React используются различные трюки, связанные с кэшированием (мемоизация).

Blazor WebAssembly, потенциально, может быть лишен части из этих недостатков:

- wasm обеспечивает почти нативную производительность
- возможно, используется другая модель реагирования на изменения состояний

Цель данного исследования - выяснить, действительно ли есть существенные преимущества при использовании wasm (и Blazor, как компилятора в wasm). Также важным является сравнение вычислительной нагрузки, используемой для достижения схожих целей в React-приложениях и Blazor-приложениях.

Для сравнение, скорее всего, разумно использовать встроенные в Chrome метрики производительности приложения.

## Создание базового приложения Blazor WebAssembly

[Официальный сайт](https://mudblazor.com/) MudBlazor содержит, в том числе, инструкцию по установке библиотеки.

Установить шаблоны приложений MudBlazor можно следующим образом:

```shell
dotnet new install MudBlazor.Templates
```

Пакет с MudBlazor находится в репозитарии NuGet и называется **MudBlazor**.

Сгенерировать проект с поддержкой Blazor WebAssembly можно командой:

```shell
dotnet new mudblazor --interactivity WebAssembly --name MyApplication --all-interactive
```

Запуск приложения:

```shell
dotnet run
```

Доступ к библиотекам MudBlazor осуществляется через одноименный сервис, который активируется в файле "Program.cs":

```csharp
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

// Добавляем сервисы MudBlazor
builder.Services.AddMudServices();

await builder.Build().RunAsync();
```

Из файла "index.html" в папке "wwwroot" загрузка стилей MudBlazor осуществляется следующим образом:

```html
<link href="_content/MudBlazor/MudBlazor.min.css" rel="stylesheet" />
```

Важно заметить, что ссылка "_content/MudBlazor" является виртуальной - это не папка на физическом диске, а запрос к сервису, для предоставления контента сервиса.

После этого можно начинать использовать стили MudBlazor, например, добавить кнопку:

```csharp
<MudButton Color="Color.Primary" Variant="Variant.Filled">Submit</MudButton>
```

Следует заметить, что для MudBlazor есть специализированный [Playground](https://try.mudblazor.com/), который позволяет проверять элементы дизайна и код online.

## MudTable и DataGrid

В MudBlazor есть два разных органа управления, используемых для представления табличных данных: DataGrid и MudTable.

В DataGrid можно добавлять слева отдельное поле для выбора конкретной строки таблицы. Соответственно, инструмент предоставляет возможность выполнения групповых операций.

Table поддерживает возможность выбора строки таблицы для выполнения дальнейших операций с ней. Для этого необходимо создать ссылку на выбранный элемент (приватный член-класса) и осуществить связывание с ним:

```csharp
<MudTable Items="forecasts" Hover="true" SortLabel="Sort By" Elevation="0" AllowUnsorted="false"
            @bind-SelectedItem="selectedItem">
    ...
</MudTable>
<MudSpacer />
<MudText Class="align-self-center d-inline">Selected: @selectedItem?.Summary</MudText>

@code {
    private WeatherForecast? selectedItem = null;
}
```

В приведённом выше примере, мы выводим информацию из поля "Summary" текущего выбранного элемента.

## Модальные диалоги - MudBlazor

Предположим, что нам необходимо добавить в приложение модальный диалог. Для этого мы создаём файл "WeatherInfo.Razor" и реализуем в нём диалог:

```csharp
<MudDialog>
    <TitleContent>
        Dialog Title
    </TitleContent>
    <DialogContent>
        Dialog Content
    </DialogContent>
    <DialogActions>
        <MudButton OnClick="Cancel">Cancel</MudButton>
        <MudButton Color="Color.Primary" OnClick="Submit">Ok</MudButton>
    </DialogActions>
</MudDialog>
@code {
    [CascadingParameter]
    private IMudDialogInstance MudDialog { get; set; }

    private void Submit() => MudDialog.Close(DialogResult.Ok(true));

    private void Cancel() => MudDialog.Cancel();
}
```

Далее на форме, которая должна содержать диалог добавляет сервис DialogService, кнопку для активации диалога и функцию для его отображения:

```csharp
@inject IDialogService DialogService

<MudButton @onclick="OpenDialogAsync" Variant="Variant.Filled" Color="Color.Primary">
    Open Simple Dialog
</MudButton>
@code {

    private Task OpenDialogAsync()
    {
        var options = new DialogOptions { CloseOnEscapeKey = true };

        return DialogService.ShowAsync<DialogUsageExample_Dialog>("Simple Dialog", options);
    }
}
```

Если компонент размещён в отдельной папке (например, "Components"), то может потребоваться добавить директиву `@using`:

```csharp
@using MudBlazorApp.Client.Components
```

## Добавление в модальный диалог полей

Достаточно добавить описание поля в верстку, создать атрибуты в компоненте и добавить Binding.

Верстка с Binding-ом:

```csharp
<DialogContent>
    <MudContainer Style="max-height: 300px; overflow-y: scroll">
        <MudTextField @bind-Value="Field1Value"
                        Label="Field 1"
                        Variant="Variant.Outlined"
                        Margin="Margin.Dense" />
        <MudTextField @bind-Value="Field2Value"
                        Label="Field 2"
                        Variant="Variant.Outlined"
                        Margin="Margin.Dense" />
    </MudContainer>
</DialogContent>
```

Определяем дополнительные поля, а также, при выполнении Submit, возвращаем введённые значения посредством вспомогательной модели `DialogResultModel`:

```csharp
@code {
    [CascadingParameter]
    private IMudDialogInstance MudDialog { get; set; }

    [Parameter]
    public string Field1Value { get; set; } = string.Empty;

    [Parameter]
    public string Field2Value { get; set; } = string.Empty;

    private void Submit()
    {
        var result = new DialogResultModel
        {
            Field1 = Field1Value,
            Field2 = Field2Value
        };

        MudDialog.Close(DialogResult.Ok(result));
    }

    private void Cancel() => MudDialog.Cancel();
}
```

Модель может быть определена, например, в классе DialogResultModel:

```csharp
public class DialogResultModel
{
    public string Field1 { get; set; } = string.Empty;
    public string Field2 { get; set; } = string.Empty;
}
```

### Вызов диалога из родительского класса

Для целей отладки, можно добавить в родительский элемент два поля для отображения результатов работы модельного диалога. Это временная мера.

Добавляем поля в верстку:

```csharp
<MudSpacer />
<MudText Typo="Typo.body1">Field 1 Result: @field1Result</MudText>
<MudText Typo="Typo.body1">Field 2 Result: @field2Result</MudText>
```

Также добавляет атрибуты в код:

```csharp
@code {
    // Поля для отображения на экране введённых параметров
    private string field1Result = string.Empty;
    private string field2Result = string.Empty;
```

Если нам нужно передать данные в модельный диалог при его открытии, то нам нужно использовать контейнер `DialogParameters`.

Предыдущий код выглядел так:

```csharp
private Task OpenDialogAsync()
{
    var options = new DialogOptions { CloseOnEscapeKey = true };

    return DialogService.ShowAsync<DialogUsageExample_Dialog>("Simple Dialog", options);
}
```

Код с передачей параметров и обработкой результатов выглядит так:

```csharp
private async Task OpenModalAsync()
{
    var options = new DialogOptions { CloseOnEscapeKey = true };

    var parameters = new DialogParameters
    {
        ["Field1Value"] = "Initial Value 1",
        ["Field2Value"] = "Initial Value 2"
    };

    // Отображаем диалог
    var dialog = await DialogService.ShowAsync<WeatherInfo>("Simple Dialog", parameters, options);
    var result = await dialog.Result;

    // В случае, если пользователь подтвердил введённые значения, сохраняем их
    if (!result.Canceled && result.Data is DialogResultModel data)
    {
        field1Result = data.Field1;
        field2Result = data.Field2;

        // Выполняем Re-rendering экрана
        StateHasChanged();
    }
}
```

## Чем модель Blazor лучше модели React

## Ограничения MudBlazor

Библиотека не хранит свои файлы с описанием стилей на локальном жёстком диске в человеко-читаемом виде. Т.е. для исследования MudBlazor потребуется скачать исходные файлы из репозитария на GitHub и изучать исходники. Это сложнее, чем например, исследовать стили Bootstrap 5 в приложении на React 19.
