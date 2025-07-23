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

## Render Props

Суть шаблона состоит в том, что мы можем использовать свойство для передачи в компонент функции, которая возвращает JSX-верстку. Например, в коде ниже мы передаём JSX-верстку через свойство render:

```tsx
<WindowSize render={({width, height}) => (
        <div>
            Your window is {width} x {height} px
        </div>
    )}
/>
```

Мы можем определить WindowSize компонент, в котором будет некоторая логика (подписка на событие "resize"), но не будет никакого пользовательского интерфейса:

```tsx
const WindowSize = (props) => {
    const [size, setSize] = useState({width: -1, height: -1});
    useEffect(() => {

        // При изменении размера окна, будет изменяться состояние (см. useState())
        const handleResize = () => {
            setSize({width: window.innerWidth, height: window.innerHeight});
        };

        // После формирования DOM, подписываемся на события изменения размера окна браузера
        window.addEventListener("resize", handleResize);

        // Возвращаем функцию, которая будет вызвана при удалении эффекта - она удалит занятый ресурс
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return props.render(size);
}
```

В данном примере верстка полностью отделена от логики и её можно повторно использовать для разных компонентов, реализующих именно верстку. Ценность подхода состоит в том, что мы не дублируем useEffect() множество раз в коде.

## Передача параметров в компонент с помощью spread-оператор

Предположим, что у нас есть React-компонент, который ожидает несколько параметров: name, age, email, isActive. Мы могли бы определить такой компонент следующим образом:

```js
function ChildComponent({ name, age, email, isActive }) {
  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      <p>Active Status: {isActive ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

Однако такой вариант не очень гибкий и он может перегружать код. Вместо этого мы можем использовать _spread operator_:

```js
function ChildComponent({ ...props }) {
  return (
    <div>
      <h1>User Details</h1>
      {Object.entries(props).map(([key, value]) => (
        <p key={key}>{key}: {value.toString()}</p>
      ))}
    </div>
  );
}
```

Мы можем извлекать некоторые параметры явным образом, а оставшиеся помещать в список (otherProps):

```js
function ChildComponent({ name, ...otherProps }) {
  return ( {/*...*/} );
}
```

Этот список можно прокидывать другим дочерним элементам:

```js
function ChildComponent({ name, ...otherProps }) {
  return ( 
    <>
        <Section {...otherProps}>
            <p>{name}</p>
        <Section />
    </>
   );
}
```
