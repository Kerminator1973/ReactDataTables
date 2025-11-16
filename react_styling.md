# Стилистическое оформление в React

Существуют множество разных подходов для стилистического оформления пользовательского интерфейса в React-приложениях. Один из наиболее распространённых - использовать css-файлы.

Css-файлы включаются в проект (см. "index.css") и они ничем не отличаются от css-файлов традиционных web-приложений. Однако для того, чтобы использовать их необходимо явным образом включить их в компоненте, например:

```js
import './index.css'
```

При этом система сборки (в частности - Vite) встроит стилистическое оформление (_inject_) в js-файл, используя тэги `<Style>...</Style>`. Кажется, что такой подход может приводить к избыточному размеры bundle-ов React-приложения.

Ключевая особенность использования Vanilla CSS в React состоит в том, что этот подход не обеспечивает инкапсуляцию стилей внутри компонента, т.е. они не попадают в scope-компонента когда используется директива import. По всей видимости, причина состоит в том, что при выполнении bundling-а, React объединяет css в отдельный файл/файлы. Т.е. не смотря на то, что Vanilla CSS очень удобен для программистов которые недавно перешли на CSS, этот подход провоцирует возникновении ошибок пересечения стилистического оформления.

## Inline Styling

Для решения части проблем Vanilla CSS можно было бы использовать React Inline Styling, например:

```js
<p style={{
    backgroundColor: '#f0f0f0',
    textAlign: 'left',
}}>This is an example of inline styling in React.</p>
```

В приведённом выше примере есть две особенности:

1. Двойные фигурные скобки не являются каким-то специфическим синтаксисом. Первая пара скобок указывает, что внутри находится не строка, а JavaScript-выражение. Вторая пара - что используется JSON-объект
2. Поскольку мы не можем использовать традиционные имена CSS-атрибутов (background-color и text-align) в JavaScript-коде, мы должны заменить их на CamelCase-имена, соответственно на backgroundColor и textAlign

Однако такой способ использования inline styling создаёт больше проблем, чем решений, т.к. стилистическое оформление встраивается прямо в код, что нарушает базовые принципы разделение семантики, оформления и кода в web-разработке.

Чуть лучший вариант - вынести стилистическое оформление в отдельную переменную `style`, в которой можно создать отдельные разделы для разных стилей:

```js
import React from 'react';

const InlineStyleExample = () => {
  const style = {
    container: {
      backgroundColor: '#f0f0f0',
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center',
    },
    heading: {
      color: '#333',
      fontSize: '24px',
    },
    paragraph: {
      color: '#555',
      fontSize: '16px',
    },
  };

  return (
    <div style={style.container}>
      <h1 style={style.heading}>Hello, World!</h1>
      <p style={style.paragraph}>This is an example of inline styling in React.</p>
    </div>
  );
};

export default InlineStyleExample;
```

### Выполненное тестовое задание в курсе "React - The Complete Guide 2025 (incl. Next.js, Redux)" на Udemy.com

В рамках задачи нужно было поменять стилистическое оформление h1 в момент нажатия одной из кнопок. При этом при нажатие кнопки должно было установливать определённый цвет h1:

```js
import React from 'react';
import { useState } from 'react';
import './index.css'

function App() {
    
    const [currColor, setCurrColor] = useState({
        color: "white"
    });
    
    const setGreenColor = () => {
        setCurrColor({
            color: "green"
        });
    };    
    
    const setRedColor = () => {
        setCurrColor({
            color: "red"
        });
    };    

    return (
    <div id="app">
      <h1 style={currColor}>CSS is great!</h1>
      <menu>
        <li>
          <button onClick={setGreenColor}>Yes</button>
        </li>
        <li>
          <button onClick={setRedColor}>No</button>
        </li>
      </menu>
    </div>
  );
}

export default App;
```

Ниже приведён оптимизированное решение схожей задачи с изменением стиля элемента:

```js
import React from 'react';
import { useState } from 'react';
import './index.css'

function App() {
  const [highlight, setHighlight] = useState('');

  const handleClick = (color) => {
    setHighlight(color);
  };

  return (
    <div id="app">
      <h1 className={highlight}>CSS is great!</h1>
      <menu>
        <li>
          <button onClick={() => handleClick("highlight-green")}>Yes</button>
        </li>
        <li>
          <button onClick={() => handleClick("highlight-red")}>No</button>
        </li>
      </menu>
    </div>
  );
}

export default App;
```

## CSS Modules

Один из способов решения проблемы коллизии имен стилей разных React-компонентов состоит в использовании модели **CSS Modules**. Стоит заметить, что она не изменяет, а дополняет Vanilla CSS в React, т.е. эти два подхода можно вполне успешно комбинировать.

Суть состоит в том, что к имени файла со стилистическим оформлением добавляется специфический суффикс. Например, есть файл со стилями компонента в Vanilla CSS назывался "Header.css", то его необходимо переименовать в "Header.module.css". Также нужно изменить то, как импортируется стиль в компоненте. В CSS Modules директива импорта стилей может выглядеть следующим образом:

```js
import classes from './Header.module.css';
```

Слово **classes** - любое, удобное в контексте компонента. Например, можно использовать **styles**, **design** - что угодно. Применить стиль можно используя эти слово:

```js
<p className={classes.paragraph}>...</p>
```

Если мы посмотрим как будет выглядеть документ после его трансляции в js, то мы увидим, что имя класса измениться с "paragraph", на "_pargaraph_какая-то-лютейшая-дичь", что обеспечит уникальности конкретного стиля для компонента, не смотря на то, что все файлы web-приложения будут находится в одном bundle. Т.е. система сборки React-приложения понимает, что при использовании суффикса имени файла ".module" необходимо применять специфические правила наименования. Таким образом, подход позволяет реализовывать _scoped css styles_, т.е. привязку конкретных стилей к конкретному компоненту.

Следует заметить, что мы можем использовать наше ключевое слово (например, classes) в тернарных операторах:

```js
<p className={1 === 1 ? classes.paragraph : undefined}>
```

или:

```js
<p className={`${classes.paragraph}`}>
```

## Styled Components

Достаточно популярным решением при разработке React-приложений является использование библиотеки [Styled Components](https://styled-components.com/).

Добавить библиотеку в проект можно командой:

```shell
npm install styled-components
```

Для использования Styled Components нам достаточно импортировать библиотеку в нашем компоненте и создать стиль, используя испортированное имя `styled`:

```js
import styled from 'styled-components'

const ControlContainer = styled.button``
```

Приведённая выше конструкция `styled.button` с парой апострофов называется **Tagged Templates** и является стандартной конструкцией JavaScript.

>важно помнить, что после слова _styled_ должно идти html-тэг: label, button, div, и т.д.

Внутри пары обратных апострофов мы можем использовать любое стандартное стилистическое оформление, например:

```js
const ControlContainer = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid #BF4F74;
  color: #BF4F74;
  margin: 0 1em;
  padding: 0.25em 1em;
`
```

Приведённая выше конструкция создаст React-компонент, который будет применять определённые внутри него стили к своим дочерним элементам:

```js
<ControlContainer>
    <Button>Normal Button</Button>
    <p>Some text</p>
</ControlContainer>
```

Мы так же можем использовать различные атрибуты в компоненте-обёртке и они будут прекрасно работать:

```js
<Button Click={onClick}>Press Me</Button>
```

Однако этот подход не будет работать для className в привычном стиле, т.к. используемые нами стили определяются и изменяются непосредственно в компоненте-обёртке, а не в стандартном html-тэге. Чтобы решить проблему, необходимо определить динамически изменяемое свойство компонента:

```js
const emailNotValid = submitted && !enteredEmail.includes('@');
...
<Button invalid={emailNotValid}>Email</Button>
```

А также добавить динамически генерируемые стили в определение styled-компонента:

```js
const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid #BF4F74;
  color: ${(props) => ... };
`
```

Внутри taggeg templates мы можем использовать props:

```js
${(props) => props.invalid ? '#f87171' : '#6b7280'}
```

Или мы можем использовать destructuring:

```js
${({invalid}) => invalid ? '#f87171' : '#6b7280'}
```

Важно помнить о том, что можно непреднамеренно попасть в конфликтную ситуацию из-за совпадения имени динамически изменяемого свойства с именем стандартного атрибута HTML-элемента. Например, в приведённом выше примере, возникнет ошибка из-за имени свойства _invalid_, которое совпадает со стандартным атрибутом _invalid_. Чтобы избежать проблемы, нам достаточно добавить специальный символ к имени динамического свойства, например, заменить его на `$invalid`.

## Использование вложенных стилей (nested rules), @media, псевдо-стилей (pseudo selectors)

Это тоже можно сделать в Styled Components.

Например, нам нужно использовать правила 'header', 'header img' и 'header h1'. В действительности нам достаточно добавить амперсанд перед определением вложенных (nested) стилей, например:

```css
const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;

  & img {
    object-fit: contain;
    margin-bottom: 2rem;
    width: 11rem;
    height: 11rem;
  }

  & h1 {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.4em;
    text-align: center;
    text-transform: uppercase;
    ...
  }
`
```

С `@media` мы можем сделать следующую вещь:

```css
@media (min-width: 768px) {
  margin-bottom: 4rem;

  & h1 {
    font-size: 2.25rem;
  }
}
```

### Общие рекомендации по декомпозиции компонентов

Допустим, что мы разработали компонент, реализующий форму ввода. Можно предположить, что на этой форме есть элементы label и input, которые были оформлены с использованием styled-components. Можно предположить, что приложение должно будет выглядеть стилистически целостным и компоненты Label и Input, являющиеся wrapper-ами для label и input, с добавлением styled components могут использоваться и в других формах. По этой причине, кажется разумным выделить их в отдельные компонент (например, CustomInput) использовав именно в этом компоненте стили как для label, так и для input. Для полноценной работы компонентов, в частности, для динамических стилей, такой компонент будет необходимо параметризироваться с использованием props.

При разработке крупного приложения нужно будет внимательно следать за тем, чтобы оно не превратилось в огромную массу маленьких компонентов wrapper-ов. Если так произойдёт, то приложение будет сложно сопровождать в дальнейшем.
