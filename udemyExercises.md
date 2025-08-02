# Решение задач курса "React - The Complete Guide 2025" by Maximilian Schwarzmuller (Academind)

Курс был куплен на Udemy в 2021 году.

## Редактирование поля при нажатии кнопки "Редактировать"

Моё решение выглядит следующим образом

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