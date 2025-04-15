# Приложение на React 19 с использованием DataTables.NET

Решаемая задача - попытаться использовать таблицу, управляемую библиотекой [DataTables.NET](https://datatables.net/) в SPA-приложении на React 19.

Генерация базового приложения (scaffolding) осуществляется командой:

```shell
npm create vite@latest sources -- --template react-ts
```

Запуск приложения на исполнение:

```shell
cd sources
npm install
npm run dev
```

Сразу же замечание: можно было бы использовать не npm, yarn:

```shell
yarn create vite sources --template react-ts
```

Yarn даёт трёхкратное ускорение операции работы с репозитарием пакетов. Однако для маленького исследовательского проекта скорость не является важным критерием.

## Подключение DataTables.NET

Инструкция по подключению библиотеки к React-приложения доступна [здесь](https://datatables.net/manual/react)

Достаточно добавить зависимости:

```shell
npm install --save datatables.net-react datatables.net-dt
```

>Зависимость datatables.net-dt содержит стилистическое оформление "классический DataTables.net". Если мы хотим использовать другую библиотеку стилистического оформления, например, Bootstrap 5, следует использовать суффикс на сигнатуру библиотеки, например, для Bootstrap 5 следует использовать `datatables.net-bs5`

Далее добавляем директивы импорта в React-компонент и настраиваем `DataTable.use()`:

```ts
import './App.css'

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';

function App() {
  const [count, setCount] = useState(0)

  DataTable.use(DT);
```

В приведённом выше примере встравание осуществляется в основную форму, но встраивать можно в любой компонент.

После этого мы можем определить таблицу непосредственно в верстке:

```ts
<DataTable>
    <thead>
    <tr>
        <th>Name</th>
        <th>Location</th>
    </tr>
    </thead>
</DataTable>
```

Однако это не даст нам данных и стилистического оформления.

Чтобы добавить статические данные, их нужно определить в коде и передать в компонент через параметр:

```ts
function App() {

  DataTable.use(DT);

  const [tableData, setTableData] = useState([
    [ 'Tiger Nixon', 'System Architect' ],
    [ 'Garrett Winters', 'Accountant' ]
  ]);
```

```ts
<DataTable data={tableData} className="display">
    <thead>
        <tr>
            <th>Name</th>
            <th>Position</th>
        </tr>
    </thead>
</DataTable>
```

Для загрузки через AJSX-запрос, следует использовать параметр `ajax`:

```ts
function App() {
    const columns = [
        { data: 'name' },
        { data: 'position' },
        { data: 'office' },
        { data: 'extn' },
        { data: 'start_date' },
        { data: 'salary' },
    ];
 
    return (
        <DataTable ajax="/data.json" columns={columns} className="display">
```

## Стилистическое оформление

Добавить поддержку Bootstrap 5 и соответствующего оформления в DataTables.NET можно установив соответствующие компоненты:

```shell
npm install bootstrap
npm install datatables.net-bs5
```

Добавление включаемых файлов:

```ts
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

Также нужно заменить стилистическую библиотеку для DataTables.NET. Было:

```ts
import DT from 'datatables.net-dt';
```

Нужно установить:

```ts
import DT from 'datatables.net-bs5';
```

Как результат, мы получаем традиционное табличное представление DataTables.NET в React-приложении.

>Сразу можно заметить, что если мы принимаем решение использовать стилистическое оформление из Bootstrap 5, то можно не устанавливать пакет "datatables.net-dt".

Ключевой пример по стилистическому оформлению доступен на [StackBlitz](https://stackblitz.com/edit/datatables-net-react-extensions?file=src%2FApp.tsx&terminal=dev)

## Расширения

Для обеспечения привычного поведения таблиц, может потребоваться установка расширений.

```shell
npm install --save datatables.net-select-dt
```

```ts
import 'datatables.net-select-dt';
```

>Расширение "datatables.net-responsive-dt" обеспечивает подстройку таблицы под изменение ширины главного окна браузера.

Также нужно загрузить дополнения расширений:

```shell
npm install --save datatables.net-select-bs5 datatables.net-responsive-bs5
```

Включить их в импорт:

```ts
import 'datatables.net-select-bs5';
import 'datatables.net-responsive-bs5';
```

А также добавить в стилистический файл (в моем случае - "App.css") в самое начало файла:

```css
@import 'datatables.net-bs5';
@import 'datatables.net-responsive-bs5';
@import 'datatables.net-select-bs5';
```

### Решение проблемы со стилистическим оформлением таблицы

Если указать везде использование стилей -dt, а не -bs5, то таблицы прекрасно отображаются стандартным образом.

```css
@import 'datatables.net-dt';
@import 'datatables.net-responsive-dt';
@import 'datatables.net-select-dt';
```

```ts
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
```

Если в TypeScript сделать импорт для -bs5, а стили оставить -dt, то часть внешнего оформления начнёт использовать стили Bootstrap 5, а часть стандартные стили DataTables.

Эксперименты показывают, что при замене импорта стилей в css:

```css
@import 'datatables.net-dt';
```

на:

```css
@import 'datatables.net-bs5';
```

Нарушается оформление внутреннего содержимого страниц.

Для дальнейшего изучения было решено использовать страницу загрузки [datatables.net-bs5](https://www.npmjs.com/package/datatables.net-bs5), но это ровным счётом ничего не дало.

### Попытки решить проблемы с дизайном таблицы

Из файла "package.json" были удалены ссылки на "-dt" компоненты.

Попутно вызов `DataTable.use(DT)` внесён внутри определения функции App(), чтобы устранить предупреждение Linter-а.

Также был сокращён список переменных при использовании useState():

```ts
const [tableData] = useState([...]);
```

Мы можем собрать дополнительную информацию с помощью React Developer Tools - см. закладки "Components" и "Profiler" в Developer Console (F12).

Мы можем попробовать следующие идеи:

- сравнить, чем отличаются 'datatables.net-bs5' и 'datatables.net-dt'
- можно попробовать выкачать все зависимости в одном файле, через конфигуратор загрузки в DataTables.NET

Сревнивая файлы, можно увидеть, что в 'datatables.net-dt' есть большой блок, который описывает стили table.dataTable.stripe в которых определено стилистическое оформление строк, но в 'datatables.net-bs5' их нет.

Идея, которая привела к положительному результату - посмотреть, как черезстрочное выделение строк работало в обычном DataTables.NET. И вот решение - для получения нужного функционала следует указать соответствующие стили в атрибуте "className" (в обычном js - "class"):

```ts
<DataTable data={tableData} className="table table-sm table-striped table-hover table-bordered">
```

## Дополнительные цели

Вот, что необходимо сделать:

- динамически изменять содержимое ячеек таблицы (по кнопке)
- динамически добавлять и удалять строки
- получать список выбранных элементов
- изменять содержимое ячейки перед началом рендеринга
- advanced: управлять режимом загрузки данных: частичный, либо полный
- добавить модульный диалог, использующий Bootstrap 5

### Динамическое изменение содержимого ячейки

Достаточно легко изменять данные, на основании которых изменяются данные, используя приблизительно такой код:

```shell
const [tableData, setDataTable] = useState([
[ 'Tiger Nixon', 'System Architect' ],
[ 'Garrett Winters', 'Accountant' ],
[ 'Ivan Ivanov', 'Software Developer' ],
[ 'Michail Novikov', 'Leading Developer' ],
]);

const handleClick = () => {

// Заменяем второй элемент таблицы на другую запись
const nextHistory = [
    ...tableData.slice(0, 1),
    ...tableData.slice(2),
    ['Roman Rusakov', 'Blazor Developer']];

setDataTable(nextHistory);
};
```

Однако это приводит к ре-рендерингу таблицы, т.е. применению сортировки и потере текущей страницы в pagination. К тому же в этом примере никак не используется текущий selection в таблице.

Более правильный подход - использование ref и доступ к таблице через API.

Чтобы получить ссылку на таблицу, следует использовать **useRef**:

```ts
import { useState, useRef } from 'react';

// ...
const table = useRef<DataTableRef>(null);

// ...
<DataTable data={tableData} ref={table} options={{
```

Соответственно, в обработчике нажатия экранной кнопки мы можем получить актуальную информацию из таблицы, например, список выбранных элементов таблицы:

```js
const api = table.current!.dt();
const selected = api?.rows({ selected: true });

if ( selected?.any() ) {
    selected?.each(function (this: any) {
    let _d = this.data();
    console.log(_d[0]);
    });
}
```

TODO: необходимо переписать код в парадигме TypeScript, с использованием строгой типизации.

TODO: пока не получилось установить элементы таблицы посредством функции data() и перерисовать элемент.
