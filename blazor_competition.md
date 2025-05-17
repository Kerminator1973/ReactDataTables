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
