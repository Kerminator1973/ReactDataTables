import { useState, useRef } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import DataTable, { DataTableRef } from 'datatables.net-react';
import DT, { Api, ApiRowsMethods } from 'datatables.net-bs5';
import 'datatables.net-select-bs5';
import 'datatables.net-responsive-bs5';

import './ExperimentalDataTable.css';

// Определяем тип для описания данных строки таблицы
type TableRow = [number, string, string];

function ExperimentalDataTable() {

    DataTable.use(DT);

    // Ссылка на DOM-элемент, реализующий функционал таблицы. Используется
    // в обработчиках событий, внешних по отношению к компоненту "таблица"
    const table = useRef<DataTableRef>(null);
  
    const [tableData, setDataTable] = useState<TableRow[]>([
      [ 1, 'Tiger Nixon', 'System Architect' ],
      [ 2, 'Garrett Winters', 'Accountant' ],
      [ 3, 'Maxim Rozhkov', 'Head of a departament' ],
      [ 4, 'Ivan Ivanov', 'Software Developer' ],
      [ 5, 'Angela Kapranova', 'Front-End Developer' ],
      [ 6, 'Alexey Buhteev', 'Quality Assurance Engineer' ],
      [ 7, 'Igor Golubev', 'Hardware Expert' ],
      [ 8, 'Natasha Mityaeva', 'Leading Quality Assurance Engineer' ],
      [ 9, 'Svetlana Kolganova', 'Linux Expert' ],
      [ 10, 'Konstantin Bobrov', 'Backend Developer' ],
      [ 11, 'Ekaterina Svekolnikova', 'Frontend Developer' ],
      [ 12, 'Sergei Volobuev', 'Crypto-expert' ],
      [ 13, 'Sergei Ivanenko', 'System Analyst' ],
      [ 14, 'Olesya Bolshova', 'Communication Manager' ],
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
          <DataTable data={tableData} ref={table} options={{
                    select: {
                      style: 'single'
                    },
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

export default ExperimentalDataTable
