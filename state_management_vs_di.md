# Dependancy Injection вместо State Management

Dependency Injection в Blazor довольно часто используют для решения задач, которые в React закрывают специализированными инструментами управления состоянием. Это не одно и то же, но для управления общим состоянием приложения, DI в Blazor берёт на себя похожую роль.

В React для передачи данных на глубину дерева компонентов без пропсов используют **Context API**. Вы создаёте контекст, предоставляете его значение через `<Context.Provider>`, а компоненты подписываются на него через **useContext**. Это позволяет делиться данными (например, темой оформления, данными аутентификации) между несвязанными напрямую компонентами.

В Blazor похожий сценарий решают через **Dependency Injection**. Вы создаёте сервис (класс), который хранит состояние (например, AppState с полем UserName), регистрируете его в контейнере DI (с подходящим временем жизни — Singleton для глобального состояния или Scoped для состояния, привязанного к сессии пользователя). А затем в компонентах просто внедряете этот сервис с помощью директивы @inject и работаете с данными.
 
>Следует заметить, что "классический" state management в Blazor всё-таки тоже есть, см.: [Fluxor](https://github.com/mrpmorris/fluxor). Также следует сказать о том, что Fluxor интегрирован с Redux DevTools Extension, что позволяет разработчикам в реальном времени отслеживать историю изменения состояния, просматривать экшены и "путешествовать во времени" (time-travel debugging) для удобного поиска ошибок в интерфейсе.

Важные нюансы:

- Используй **AddSingleton**, а не AddScoped для такого сервиса: в Blazor Server Scoped привязан к соединению, в WASM — к HTTP-запросу, и подписчики могут не увидеть событие
- Всегда оборачивайте вызов StateHasChanged() в InvokeAsync, чтобы обновление UI происходило в правильном контексте синхронизации Blazor
- Обязательно отписывайтесь от события в Dispose, иначе будет утечка памяти.

Пример сервиса:

```csharp
public interface IEventService
{
    event Action OnSomethingHappened;
    void Publish();
}

public class EventService : IEventService
{
    public event Action OnSomethingHappened;

    public void Publish()
    {
        OnSomethingHappened?.Invoke();
    }
}
```

Регистрация сервиса:

```csharp
builder.Services.AddSingleton<IEventService, EventService>();
```

Подписка в компоненте:

```csharp
@inject IEventService EventService
@implements IDisposable

<p>Статус: @status</p>

@code {
    private string status = "Ожидание события";

    protected override void OnInitialized()
    {
        EventService.OnSomethingHappened += HandleEvent;
    }

    private void HandleEvent()
    {
        // Важно: всегда вызывай StateHasChanged через InvokeAsync
        _ = InvokeAsync(() =>
        {
            status = "Событие получено!";
            StateHasChanged();
        });
    }

    public void Dispose()
    {
        EventService.OnSomethingHappened -= HandleEvent;
    }
}
```

Публикация из любого места (например, из другого компонента или сервиса):

```csharp
EventService.Publish();
```
