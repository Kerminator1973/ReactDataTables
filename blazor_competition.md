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

## Сильная и слабая стороны React

В видео под названием "React победил в битве frontend-фреймворков. Он с нами навсегда" Миши Ларченко высказывается мнение о том, что React занял доминирующее положение в разработке frontend-приложений и благодаря ИИ эту позицию у React уже невозможно отнять. Михаил ссылается на результаты различных исследований, в которых около 70% SPA используют React, и около 20% за Angular (в основном, корпоративный мир). Есть ещё Vue.js и Svelte, а также огромное количество попыток переосмысления React (Preact, Solid, и т.д.). Однако их доля на уровне статистической погрешности.

В условиях лавинообразного развития ИИ, новые разработчики, задавая вопрос ChatGPT, какой фреймворк следует использовать, будут гарантированно получать рекомендацию - React. Точно такой же результат будут получать программисты, которые интересуются размером community. Это приведёт к тому, что во временем, доминирование React станет близким к 100%.

Миша Ларченко высказывает мнение, что с одной стороны это здорово, т.к. появляется индустриальный стандарт - все делают похожую работу одним и тем же способом. С другой стороны, доминирование означает смерть инновациям и глубокую стагнацию. Что будет заводить индустрию в тупик.

Я эту позицию разделяю на 100%.

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

Далее на форме, которая должна содержать диалог, добавляем: сервис DialogService, кнопку для активации диалога и функцию для его отображения:

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

### Что можно было бы сделать по другому?

Мы могли бы не создавать модель DialogResultModel, а определить её динамически. Т.е. при выполнении функции Submit мы могли бы просто вернуть анонимный объект:

```csharp
private void Submit()
{
    var result = new { Field1 = Field1Value, Field2 = Field2Value };
    MudDialog.Close(DialogResult.Ok(result));
}
```

Соответственно, мы может обработать динамический объект в родительском компоненте, вручную:

```csharp
var result = await dialog.Result;

if (!result.Canceled && result.Data != null)
{
    dynamic data = result.Data;
    field1Result = data.Field1;
    field2Result = data.Field2;
    StateHasChanged();
}
```

Приведённая выше альтернатива уменьшает количество кода, но делает код более хрупким - не рекомендуется к использованию.

### Можно изменять данные таблицы через ссылку

В нашем примере есть ссылка на текущую выбранную строку таблицы:

```csharp
private WeatherForecast? selectedItem = null;
```

Мы можем использовать её для изменения данных в таблице:

```csharp
if (!result.Canceled && result.Data is DialogResultModel data)
{
    // Сохраняем данные в таблице через ссылку на элемент (selectedItem)
    if( Int32.TryParse(data.Field1, out var value))
    {
        selectedItem.TemperatureC = value;
    }

    selectedItem.Summary = data.Field2;

    // Выполняем Re-rendering экрана
    StateHasChanged();
}
```

## Изменяемый список

Если у нас есть потребность добавлять в таблицу данные динамически, мы можем использовать не обычный массив, а список:

```csharp
private List<WeatherForecast> forecasts = new();
```

Производительность List<> ниже, чем у обычного массива, но для большинства задач это не будет иметь значимого негативного эффекта.

Добавить новый элемент в таблицу можно так:

```csharp
forecasts.Add(new WeatherForecast
{
    Date = DateOnly.FromDateTime(DateTime.Now),
    TemperatureC = tempearature,
    Summary = data.Field2
});

StateHasChanged();
```

Следует заметить, что при вызове StateHasChanged() из асинхронного кода, или отдельного потока, необходимо оборачивать его в InvokeAsync():

```csharp
await InvokeAsync(StateHasChanged);
```

## Чем модель Blazor лучше модели React

Работа с модальными диалогами гораздо более очевидная и простая, чем в React.

В React мы определяем атрибуты в родительском элементе и передаём их через props, т.е. связь между вызывающим кодом и модальным диалогом, явным образом, описывается версткой. Это декларативный подход, но он создаёт сцепленность, "жесткую связь".

В Blazor вызывающий код и MudDialog обмениваются объектами (моделями) и этот код никак на верстке не сказывается. Этот подход больше похож на императивный, более понятный и не создаёт жёсткую связь верстки двух компонентов.

Изменение данных в таблице осуществляется наиболее естественным образом - через ссылку, которая автоматически настраивается через _binding_. Также можно очень эффективно добавлять новые элементы в таблицу, буквально, вставляя новые элементы в массив. В JavaScript тоже позволяет сформировывать новый массив, но синтаксическая конструкция получается более сложной и ресурсозатратной.

Однако, следует обратить внимание, что Blazor требует выполнения Re-rendering-а вручную, см.: `StateHasChanged()`. Вызов StateHasChanged() форсирует перерисовку пользовательского интерфейса. С другой стороны, в React мы так же должны вызвать wrapper-функцию, сгенерированную React, чтобы вызвать re-rendering. Для примера ниже приведён код на TypeScript:

```ts
const [tableData, setDataTable] = useState<TableRow[]>(employeesData);
...
setDataTable(updatedTable);
```

В этом коде вызов setDataTable(), который является wrapper-функцией, сгенерированной React сделает две вещи:

- изменить переменную в области React, хранящую tableData
- не явным образом вызовет re-render

В определённом смысле, вызов `StateHasChanged()`, или `await InvokeAsync(StateHasChanged)` является более очевидным.

## Особенности эко-системы Blazor

В отличие от раннего FluentUI, MudBlazor реализует компоненты посредством стандартных HTML-элементов. Это однозначный плюс.

Для работы с таблицами, без использования FluentUI и MudBlazor, Microsoft предлагает open-source библиотеку [QuickGrid](https://aspnet.github.io/quickgridsamples/). Библиотека является высокопроизводительной, простой в использовании и хорошо кастомизируемой. В частности, в библиотеке есть поддержка режима виртуализации данных, в котором данные представляется бесконечным списком, но с реальным рендерингом только тех данных, которые попали окно на экране.

Создать таблицу, используя QuickGrid можно добавив в проект Package `Microsoft.AspNetCore.Components.QuickGrid`. Это можно сделать командой:

```shell
dotnet add package Microsoft.AspNetCore.Components.QuickGrid
```

В официальном примере достаточно определить колонки таблицы, а в коде создать источник данных (`IQueryable<Person>`):

```csharp
<QuickGrid Items="@people">
    <PropertyColumn Property="@(p => p.PersonId)" Sortable="true" />
    <PropertyColumn Property="@(p => p.Name)" Sortable="true" />
    <PropertyColumn Property="@(p => p.BirthDate)" Format="yyyy-MM-dd" Sortable="true" />
</QuickGrid>

@code {
    record Person(int PersonId, string Name, DateOnly BirthDate);

    IQueryable<Person> people = new[]
    {
        new Person(10895, "Jean Martin", new DateOnly(1985, 3, 16)),
        new Person(10944, "António Langa", new DateOnly(1991, 12, 1)),
        new Person(11203, "Julie Smith", new DateOnly(1958, 10, 10)),
        new Person(11205, "Nur Sari", new DateOnly(1922, 4, 27)),
        new Person(11898, "Jose Hernandez", new DateOnly(2011, 5, 3)),
        new Person(12130, "Kenji Sato", new DateOnly(2004, 1, 9)),
    }.AsQueryable();
}
```

В приложении, сгенерированном с использованием MudBlazor, потребуется разрешить коллизии:

```csharp
@using Microsoft.AspNetCore.Components.QuickGrid

<!-- Названия компонентов MudBlazor и QuickGrid совпадают -->
<QuickGrid Items="@people">
    <Microsoft.AspNetCore.Components.QuickGrid.PropertyColumn Property="@(p => p.PersonId)" Sortable="true" />
    <Microsoft.AspNetCore.Components.QuickGrid.PropertyColumn Property="@(p => p.Name)" Sortable="true" />
    <Microsoft.AspNetCore.Components.QuickGrid.PropertyColumn Property="@(p => p.BirthDate)" Format="yyyy-MM-dd" Sortable="true" />
</QuickGrid>
```

## Профилирование приложений Blazor

На начало лета 2025 года, для профилирования Blazor приложения рекомендуется либо использовать System.Diagnostics.Stopwatch для вычисления времени рендеринга компонента вручную, либо использовать профилировщик, встроенный в браузер.

Под встроенным в браузер профилировщиком подразумевается применение инструментов `Developer Console (F12)` и, в частности, закладки `Performance Tab` в Chrome. На этой закладке разположен инструмент, который позволяет перезапустить страницу запустим профилировщик, либо вручную запускать и останавливать его. Браузер предоставляет дерево вызовов с различными инструментами визуализации. Ближе всего к инструментам React DevTools, по возможностям анализа выполнения ре-рендеринга, находится `Event Log`, который позволяет фильтровать информацию профилировщика по событиям системы. В частности, кажется полезным анализ событий `Event: click`, которое часто связано с выполнением ре-рендеринга. События этого типа имеют чёткую продолжительности дйствия в миллисекундах. Однако расшифровка происходящего сложная и не однозначная. Так, например, можно увидеть, что функция dispatchGlobalEventToAllElements вызывает ряд других функций: R, D, anonymous, и т.д. Заканчивается это дерево вызовов информацией о работе нескольких wasm-function. Всё это не даёт четкой информации о том, что нужно оптимизировать. На данный момент, кажется, что эта информация может быть полезной только косвенно, например, при сравнении количества вызовов и их продолжительность до изменения кода и после его оптимизации.

## Ограничения и странности MudBlazor

Библиотека не хранит свои файлы с описанием стилей на локальном жёстком диске в человеко-читаемом виде. Т.е. для исследования MudBlazor потребуется скачать исходные файлы из репозитария на GitHub и изучать исходники. Это сложнее, чем например, исследовать стили Bootstrap 5 в приложении на React 19.

Механизм использования CascadingParameters/CascadingValue далеко не всегда очевидный. В примере MudBlazorApp вообще не очень чётко понятно, откуда появляется MudDialog:

```csharp
[CascadingParameter]
private IMudDialogInstance MudDialog { get; set; }
```

Т.е. он, вероятно, "сбрасывается" родительским элементом через _injection_:

```csharp
@inject IDialogService DialogService
```

Но это не очевидно, т.к. нужно знать, сложно вывести логически. Наверное, это одно из слабых мест Blazor.
