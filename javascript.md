# JavaScript - любимые трюки

Мы можем добавить элемент в массив, используя функцию push():

```js
const fruits = ['apple', 'banana'];
fruits.push('orange');
console.log(fruits);
```

Заметим, что мы можем добавлять в const массив новые элементы, но не можем присвоить новый массив.

## spread-оператор

Пример использования spread-оператора (он же rest-оператор) для объединения двух массивов в один новый массив:

```js
let fruits = ['apple', 'banana'];
let moreFruits = ['orange', 'grape'];

// Объединение двух массивов в новый массив
let combinedFruits = [...fruits, ...moreFruits];
console.log(combinedFruits);

// Включение дополнительного элемента в середину нового массива
let evenMoreFruits = [...fruits, 'mango', ...moreFruits];
console.log(evenMoreFruits);
```

Чисто формально, вот если мы не используем spread-оператор, то JavaScript создаст массив из двух массивов:

```js
let combinedFruits = [fruits, moreFruits];
```

Мы можем использовать spread-оператор для для объединения элементов объектов:

```js
const person = {
    name: 'John',
    age: 30
};

const address = {
    city: 'New York',
    country: 'USA'
};

// Объединяем два объекта используя spread-оператор
const mergedObject = { ...person, ...address };
console.log(mergedObject);

// Мы также можем перезаписать предыдущее свойство другим значением
const extendedObject = { 
    ...person, 
    job: 'Developer', 
    age: 35  // Эта строка перепишет предыдущее значение поля age
};

console.log(extendedObject);
```
