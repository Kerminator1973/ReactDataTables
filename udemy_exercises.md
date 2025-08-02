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
    setEditing(!isEditing);
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
