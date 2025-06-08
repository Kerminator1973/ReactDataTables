# Шаблоны проектирования в React

## Presentational/Container Components

Суть шаблона состоит в разделение компонента на две части: представление и контейнер. Один из них отвечает за отображение компонента (верстка), а второй за хранение данных.

Пример реализации:

```ts
const PresentationalCounter = (props) => {
    return (
        <section>
            <button onClick={props.increment}>+</button>
            <button onClick={props.decrement}>-</button>
            <button onClick={props.reset}>Reset</button>
            <h1>Current Count: {props.count}</h1>
        </section>
    );
}

const ContainerCounter = () => {
    const [count, setCount] => useState(0);
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count + -);
    const reset = () => setCount(0);

    return (
        <PresentationalCounter
            count={count}
            increment={increment}
            decrement={decrement}
            reset={reset}
        />
    );
}
```

Этот шаблон проектирования реализует общий принцип **single responsibility**, в соответствии с которым PresentationalCounter отвечает только за отображение данных, которые получает через props, а ContainerCounter - только за управление состоянием компонента.

## Higher Order Components (HOC)

В математической и компьютерных науках, функция высшего порядка это функция, которые принимает одну, или несколько функций в качестве входных параметров (аргуметов) и возвращает функцию в качестве результата работы.

В контексте JSX, HOC это компонент, которые принимает другой компонент в качестве входного значения и возвращает композитный компонент. Практический пример: web-приложение осуществляет отправку асинхронных запросов на сервер. Поскольку запрос асинхронный, необходимо реализовать состояния **Loading** и **error**. Эти состояния можно реализовывать в каждом компоненте, который работает с сервером, но гораздо ценнее разработать повторно используемых компонент, который будет реализовывать эти состояния.

Мы можем решить проблему разработав функцию withAsync:

```js
const withAsync = (Component) => (props) => {
    if (props.loading) {
        return "Loading...";
    }

    if (props.error) {
        return error.message;
    }

    return (
        <Component {...props} />
    );
}
```

Соответственно, использовать функцию withAsync() можно следующим образом:

```js
const TodoList = withAsync(BasicTodoList);

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState([]);

    useEffect(() => {
        fetch("https://mytodolist.com/items")
            .then((res) => res.json())
            .then((data) => {
                setIsLoading(false);
                setData(data);
            })
            .catch(setError);
    }, []);

    return <TodoList loading={isLoading} error={error} data={data} />
};
```

Благодаря функции withAsync() мы добавляем в каждый задействованный компонент часть верстки с типовыми условиями и, таким образом, обеспечиваем повторное использование кода, а также делаем код более защищённым от ошибок программиста.
