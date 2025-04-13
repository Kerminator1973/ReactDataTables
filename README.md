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
