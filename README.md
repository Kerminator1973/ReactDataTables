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

## Обеспечить выбор только одного элемента

Если мы хотим, чтобы в таблице можно было выбирать несколько элементов, мы можем использовать следующую опцию:

```js
<DataTable data={tableData} ref={table} options={{
        select: true,
```

Когда нам нужен только один элемент, опция выглядит так:

```js
<DataTable data={tableData} ref={table} options={{
        select: {
            style: 'single'
        },
```

## Изменить цвет фона строки при перемещении над ней курсора мыши

Для выполнения задачи необходимо добавить в стиль компонента следующую строку:

```css
table.table.dataTable.table-hover > tbody > tr:hover > * {
    box-shadow: inset 0 0 0 9999px rgba(42, 216, 26, 0.675) !important;
}
```

Селектор был скопировать из файла "\node_modules\datatables.net-bs5\css\dataTables.bootstrap5.css".

Стиль не применяется без использования модификатора `!important`

TODO: необходимо понять, как можно повысить селективность без использования `!important`

## Настройка отображения колонок, а также установка их идентификаторов в ajax-режиме

Если мы не используем AJAX-режим, то через свойство "columns" компонента таблицы мы можем настроить свойства отображения колонок. Например:

```ts
const columns = [
    { searchable: false },          // Не ищем данные в этой колонке
    { className: "dt-body-center" },  // Выравнивание по центру
    { className: "dt-body-left" }     // Выравнивание по левой границе
];

return (
    <>
        <DataTable data={tableData} columns={columns}
```

В AJAX-режиме мы также можем задать идентификаторы колонок, например:

```ts
const columns = [
    {
        data: "id",
        className: "dt-body-center",
        searchable: false
    },
    { data: "type" },
    { data: "user" },
    { data: "date", className: "dt-body-center" },
    { data: "addr", className: "dt-body-center" },
    { data: "msg" },
    { data: "l", className: "dt-body-center" }
];
```

## Загрузка данных таблицы в JSON-формате

С целью снижения когнитивной нагрузки описание типа данных отображаемых строкой в таблице, выделено в отдельный файл (например, "dataTable.ts"):

```ts
// Определяем тип для описания данных строки таблицы
export type TableRow = {
  id: number, 
  name: string, 
  position: string;
};

export const employeesData: TableRow[] = [
  { id: 1, name: "Tiger Nixon", position: "System Architect"},
  { id: 2, name: "Garrett Winters", position: "Accountant"},
];
```

В компоненте управления таблицей импортируем так тип данных, так и сами данные:

```ts
import { employeesData, TableRow } from './tableData.ts';
```

Определение состояния для работы с данными таблицы не изменяется, но в описании колонок появляется ещё один обязательный параметр - data, значением которого является имя поля в JSON-файле (см. определение employeesData выше по коду):

```ts
// Данные для таблицы находятся в отдельном файле - "tableData.ts"
const [tableData, setDataTable] = useState<TableRow[]>(employeesData);

// Настройка отображения колонок и их идентификаторов в ajax-режиме
const columns = [
  { title: '№', data: 'id', searchable: false },                        // Не ищем данные в этой колонке
  { title: 'ФИО', data: 'name', className: "dt-body-center" },          // Выравнивание по центру
  { title: 'Должность', data: 'position', className: "dt-body-left" },  // Выравнивание по левой границе
];
```

Везде, где мы работаем с DataTables.NET API для получения доступа к элементам строки (row) следует использовать уже не индекс элемента в массиве, а имя этого элемента, что значительно улучает читаемость и надёжность кода:

```ts
const data: TableRow = currentEmployee;
const index = tableData.findIndex((row: TableRow) => row.id === data.id);
```

## Динамическое изменение содержимого ячейки

С целью динамического изменения содержимого ячейки следует использовать свойство **slots**. В приведённом ниже примере для второй ячейки строки (индекс - 1), вместо текста добавляется ссылка с указанным текстом:

```ts
<DataTable data={tableData}
    slots={{
        1: (data, row) => (
            <a href="https://rbc.ru">{data}</a>
        )
    }}
```

Параметр data - это значение конкретной ячейки до модификации, а row позволяет получить доступ к другим полям строки.

В качестве отображения мы можем использовать JSX-синтаксис, т.к. вставлять любые React-компоненты внутри ячейки.

Может быть использована более сложная форма, в которой используется TypeScript-код и возможны дополнительные вычисления:

```ts
slots={{
    1: (data: string, row) => {
        return (
            <a href="https://rbc.ru">{data}</a>
        )
    }
}}
```       

В случае использования JSON для заполнения таблицы, указать тип параметра row можно следующим образом:

```ts
slots={{
  1: (data: string, row: TableRow) => {
    return <a href="https://rbc.ru">{row.name}</a>;
  },
}}
```

Рекомендуется ознакомиться с примером приложения на [StackBlitz](
https://stackblitz.com/edit/datatables-net-react-components?file=src%2FApp.tsx,src%2FApp.css&terminal=dev)

## Обеспечить вызов функции (метода) из родительского компонента

Предположим, что на уровне родительского компонента в приложении реализован модальный диалог, в котором вводится информация о новом сотруднике компании. Нам требуется вызвать функцию дочернего компонента, посредством которой дочерний компонент добавит информацию об этом сотруднике в свою таблицу (DataTables.NET). 

Чтобы сделать это, в родительском компоненте необходимо получить описание типа экспортируемых функций и связать его с конкретным дочерним элементом:

```ts
import { useRef } from 'react';
import { ExperimentalDataTableRef } from './ExperimentalDataTable';

function ParentComponent() {

  // Определяем ссылку на экспортируемые функции компонента,
  // с интерфейсом ExperimentalDataTableRef
  const childRef = useRef<ExperimentalDataTableRef>(null);

  const handleClick = () => {
    if (childRef.current) {
      // Вызываем функцию конкретного экземпляра дочернего компонента
      childRef.current.replaceEmpoyee("Surname", "Position");
    }    
  };

  return (
    <>
      {/* Таблица с сотрудниками компании */}
      <ExperimentalDataTable ref={childRef} />
    </>
  )
}
```

В дочернем компоненте от нас требуется определить тип с экспортируемы функциями и сделать его доступным для родителей (expose to parent). Сделать это можно следующим образом:

```ts
import { forwardRef, useImperativeHandle, Ref } from "react";

// Определяем тип, который компонент будет предоставлять внешнему коду
export type ExperimentalDataTableRef = {
  replaceEmpoyee: (name: string, position: string) => void;
};

// Определяем список props данного компонента
interface ExperimentalDataTableProps extends Record<string, unknown> {}

const ExperimentalDataTable = forwardRef(
  (props: ExperimentalDataTableProps, ref: Ref<ExperimentalDataTableRef>) => {

    // Определяем реализацию метода, доступного родительскому элементу
    const replaceEmpoyee = () => {
      console.log("Обрабатываем вызов функции из родительского элемента");
    };

    // Используем useImperativeHandle, чтобы предоставить родительскому элементу
    // доступ к методам дочерних элементов
    useImperativeHandle(ref, () => ({
      replaceEmpoyee,
    }));
```

Поскольку в конкретном примере, у дочернего компонента отсуствуют props, то приходится определять пустой список свойств:

```ts
interface ExperimentalDataTableProps extends Record<string, unknown> {}
```

Этот пустой список вполне успешно скомпилируется, но Linter будет сообщать о наличии ошибке в коде. Чтобы избежать сообщений об ошибках мы можем вообще убрать определением ExperimentalDataTableProps, а в параметрах forwardRef() указать _props первым параметров, что означает - "никаких props-ов нет":

```ts
const ExperimentalDataTable = forwardRef(
  (_props, ref: Ref<ExperimentalDataTableRef>) => {
    //...
  }
)
```

## Установка полей модального диалога

Наиболее простой способ взаимодействия между основной формой и модальным диалогом - вынести свойства, связанные со значениями полей из модального окна в родительскую форму.

В модальном окне определяем свойства (props):

```tsx
type ModalComponentProps = {
    isOpen: boolean;
    setModalShow: (state: boolean) => void;
    surnameField: string;
    setSurnameField: React.Dispatch<React.SetStateAction<string>>;
    positionField: string;
    setPositionField: React.Dispatch<React.SetStateAction<string>>;
    onSubmit: () => void;
};

const EmployeeModal: React.FC<ModalComponentProps> = ({ 
    isOpen, setModalShow, surnameField, setSurnameField, positionField, setPositionField, onSubmit,
}) => {
```

В верстке используем имеено эти свойства:

```tsx
<Modal.Body>
    <div className="mb-3">
    <label htmlFor="surnameField" className="form-label">Имя сотрудника:</label>
    <input type="text" id="surnameField" className="form-control"
        value={surnameField} onChange={(e) => setSurnameField(e.target.value)}
    />
    </div>
    <div className="mb-3">
    <label htmlFor="positionField" className="form-label">Должность:</label>
    <input type="text" id="positionField" className="form-control"
        value={positionField} onChange={(e) => setPositionField(e.target.value)}
    />
    </div>
</Modal.Body>
```
