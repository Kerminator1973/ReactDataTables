# Решение задач курса "React - The Complete Guide 2025" by Maximilian Schwarzmuller (Academind)

Курс был куплен на Udemy в 2021 году.

## Редактирование поля при нажатии кнопки "Редактировать"

Моё решение выглядит следующим образом:

```js
import { useState } from 'react'

function App() {

  const [isEditing, setEditing] = useState(false);
  const [name, setName] = useState("Player 1");

  const toggleEditing = () => {
    setEditing((isEditing) => !isEditing);
  };

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  return (
    <>
      {!isEditing && (<span>{name}</span>)}
      {isEditing && (<input type="text" value={name} onChange={handleInputChange}/>)}
      <button onClick={toggleEditing}>Edit</button>
    </>
  )
}

export default App
```

В решении автора используется атрибут **reqiured** в описании input-а.

Для того, чтобы упростить решение, Максимилиан использует базовую инициализацию верстки поля с описанием пользователя, которую он переопределяет, если система находится в состоянии редактирования. Он это делает для упрощения кода, но этот вариант создаёт более сложное синтаксическое дерево и создаёт большую вычислительную нагрузку, чем мой код. Хотя и мой код не идеальный - оптимальнее было бы использовать тернарный оператор.

И ещё решение автора курса более глубокое, чем моё - он изменяет текст на кнопке (а я - нет). Также он более выраженно управляет состоянием компонента.

Ещё один крайне важный момент состоит в том, что при изменении состояния, основывающегося на старом состоянии нам необходимо использовать следующую конструкцию:

```js
setEditing(isEditing => !isEditing);
```

Кажущаяся очевидной конструкция является НЕ КОРРЕКТНОЙ:

```js
setEditing(!isEditing);
```

Причина состоит в том, что операция выполняемая функцией, возвращаемой useState() не исполняется сразу, а планируется к выполнению. Более "очевидный" вариант может приводить к различным негативным side-effect-ам.

## Результирующий тест по секции "Dynamic Styles"

Мой тест, успешно прошедший проверку unit-тестами:

```js
import React from 'react';
import { useState } from 'react';

export default function App() {
    
    const [currColor, setCurrColor] = useState({
        color: "white"
    });
    
    const toggleColor = () => {
            setCurrColor({
                color: currColor.color === "white" ? "red" : "white"
            });
    };    

    return (
        <div>
            <p style={currColor}>Style me!</p>
            <button onClick={toggleColor}>Toggle style</button>
        </div>
    );
}
```

Потребовалась отладка кода в offline-проекте на моей машине. Для запуска теста нужно было загрузить зависимости и скомпилировать приложение:

```shell
npm install
npm run dev
```

## Упражнения по использованию Refs

В упражнении необходимо запустить операцию загрузки файла по нажатию некоторой кнопки формы. Мой зачтённый вариант решения:

```js
import { useRef } from 'react';

function App() {
    
  const inputFile = useRef();
  
  const handleClick = () => {inputFile.current.click()};
    
  return (
    <div id="app">
      <p>Please select an image</p>
      <p>
        <input ref={inputFile} data-testid="file-picker" type="file" accept="image/*" />
        <button onClick={handleClick}>Pick Image</button>
      </p>
    </div>
  );
}

export default App;
```

В следующем упражнении Refs используется для работы с таймерами - запуску таймеру и его остановки посреством вызова функции `clearTimeout()`:

```js
import { useRef } from 'react';

export default function Workout({ title, description, time, onComplete }) {
  const timer = useRef();  
    
  function handleStartWorkout() {
    timer.current = setTimeout(() => {
        onComplete();
    }, time);
  }

  function handleStopWorkout() {
    clearTimeout(timer.current);
    onComplete();
  }

  return (
    <article className="workout">
      <h3>{title}</h3>
      <p>{description}</p>
      <p>{time}</p>
      <p>
        <button onClick={handleStartWorkout}>Start</button>
        <button onClick={handleStopWorkout}>Stop</button>
      </p>
    </article>
  );
}
```

### Упражнения с использованием forwardRef 

Код компонента Input:

```js
import { forwardRef } from 'react';

const Input = forwardRef(function Input({label, ...props}, ref) {
  return (
    <p className="control">
      <label>{label}</label>
      <input ref={ref} {...props} />
    </p>
  );
});

export default Input;
```

Код формы, на которой используется два компонента Input:

```js
import Input from './Input';
import { useRef } from 'react';

export const userData = {
  name: '',
  email: '',
};

export function App() {
    
    const _name = useRef();
    const _email = useRef();
    
  function handleSaveData() {
    userData.name = _name.current.value;
    userData.email = _email.current.value;

    console.log(userData);
  }

  return (
    <div id="app">
      <Input ref={_name} type="text" label="Your Name" />
      <Input ref={_email} type="email" label="Your E-Mail" />
      <p id="actions">
        <button onClick={handleSaveData}>Save Data</button>
      </p>
    </div>
  );
}
```
