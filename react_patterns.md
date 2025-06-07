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
