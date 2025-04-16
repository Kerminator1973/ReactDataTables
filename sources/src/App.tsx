import { useState, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import DataTable, { DataTableRef } from 'datatables.net-react';
import DT, { Api, ApiRowsMethods } from 'datatables.net-bs5';
import 'datatables.net-select-bs5';
import 'datatables.net-responsive-bs5';

import './App.css';

// Определяем тип для описания данных строки таблицы
type TableRow = [number, string, string];


function App() {

  DataTable.use(DT);

  const table = useRef<DataTableRef>(null);

  const [tableData, setDataTable] = useState<TableRow[]>([
    [ 1, 'Tiger Nixon', 'System Architect' ],
    [ 2, 'Garrett Winters', 'Accountant' ],
    [ 3, 'Maxim Rozhkov', 'Head of a departament' ],
    [ 4, 'Ivan Ivanov', 'Software Developer' ],
    [ 5, 'Angela Kapranova', 'Front-End Developer' ],
    [ 6, 'Michail Novikov', 'Leading Developer' ],
  ]);


  const handleClick = () => {

    const api : Api | null = table.current!.dt();
    const selected : ApiRowsMethods<TableRow> = api!.rows({ selected: true });
    const id = selected.data()[0][0];

    // Находим индекс элемента с выбранным id
    const index = tableData.findIndex(row => row[0] === id);
    console.log(index);

    // Заменяем строку таблицы на другую
    const updatedTable : TableRow[] = [
      ...tableData.slice(0, index),
      ...tableData.slice(index + 1),
       [id, 'Roman Rusakov', 'Blazor Developer']];

    // Обновляем контент таблицы
    setDataTable(updatedTable);

    // Почитать статью, которая решает схожую с моей задачу:
    // https://datatables.net/forums/discussion/66731/react-best-way-to-render-rows-based-on-state
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <DataTable data={tableData} ref={table} options={{
                select: true,
                responsive: true
            }} className="table table-sm table-striped table-hover table-bordered">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Position</th>
                </tr>
            </thead>
      </DataTable>

      <div className="container mt-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleClick}
        >
        Change a person
        </button>
      </div>          
    </>
  )
}

export default App
