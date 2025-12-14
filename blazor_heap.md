# Как посмотреть метрики heap-памяти

В папке "wwwroot/js/" добавляем файл "memoryHelper.js", который получает метрики heap-памяти виртуальной машины:

```js
window.memoryHelper = {
    getHeapSize: function() {
        if (performance.memory) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }
};
```

В файле "index.html" подключаем этот JavaScript-код:

```html
<script src="js/memoryHelper.js"></script>
```

Это можно сделать, например, после подключения "blazor.webassembly.js":

```js
<script src="_framework/blazor.webassembly.js"></script>
<script src="js/memoryHelper.js"></script>
```

Добавить реализацию сервиса на C#, который запрашивает информацию через JSInterop:

```csharp
using Microsoft.JSInterop;

public class MemoryService
{
    private readonly IJSRuntime _jsRuntime;

    public MemoryService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public async Task<MemoryInfo?> GetMemoryInfoAsync()
    {
        try
        {
            var memInfo = await _jsRuntime.InvokeAsync<MemoryInfo?>("memoryHelper.getHeapSize");
            return memInfo;
        }
        catch
        {
            return null;
        }
    }
}

public class MemoryInfo
{
    public long UsedJSHeapSize { get; set; }
    public long TotalJSHeapSize { get; set; }
    public long JsHeapSizeLimit { get; set; }
}
```

В "Program.cs" добавляем сервис, чтобы его можно было использовать для встраивания в компоненты через механизм Dependency Injection:

```csharp
builder.Services.AddScoped<MemoryService>();
```

Встраиваем код в компонент, который мы будет использовать для просмотра информации о heap-памяти:

```csharp
@page "/memory"
@inject MemoryService MemoryService

<h3>Memory Information</h3>

@if (memoryInfo != null)
{
    <p>Used Heap: @FormatBytes(memoryInfo.UsedJSHeapSize)</p>
    <p>Total Heap: @FormatBytes(memoryInfo.TotalJSHeapSize)</p>
    <p>Heap Limit: @FormatBytes(memoryInfo.JsHeapSizeLimit)</p>
}

<button @onclick="RefreshMemory">Refresh Memory Info</button>

@code {
    private MemoryInfo? memoryInfo;

    protected override async Task OnInitializedAsync()
    {
        await RefreshMemory();
    }

    private async Task RefreshMemory()
    {
        memoryInfo = await MemoryService.GetMemoryInfoAsync();
        StateHasChanged();
    }

    private string FormatBytes(long bytes)
    {
        string[] sizes = { "B", "KB", "MB", "GB" };
        double len = bytes;
        int order = 0;
        while (len >= 1024 && order < sizes.Length - 1)
        {
            order++;
            len = len / 1024;
        }
        return $"{len:0.##} {sizes[order]}";
    }
}
```
