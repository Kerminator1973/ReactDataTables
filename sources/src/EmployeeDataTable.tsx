import { useState, forwardRef, useImperativeHandle, Ref, useRef } from "react";
import DataTable, { DataTableRef } from "datatables.net-react";
import DT, { Api, ApiRowsMethods } from "datatables.net-bs5";

import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-select-bs5";
import "datatables.net-responsive-bs5";
import "./EmployeeDataTable.css";

import { employeesData, TableRow } from './tableData.ts';

// Определяем тип, который компонент будет предоставлять внешнему коду
export type EmployeeDataTableRef = {
  replaceEmpoyee: (name: string, position: string) => void;
};

const EmployeeDataTable = forwardRef(
  (_props, ref: Ref<EmployeeDataTableRef>) => {

    // Определяем реализацию метода, доступного родительскому элементу
    const replaceEmpoyee = () => {
      console.log("Child component submission logic executed");
      handleClick();
    };

    // Используем useImperativeHandle, чтобы предоставить родительскому элементу
    // доступ к методам дочерних элементов
    useImperativeHandle(ref, () => ({
      replaceEmpoyee,
    }));

    // Выполняем настройку таблицы DataTables.NET
    DataTable.use(DT);

    // Ссылка на DOM-элемент, реализующий функционал таблицы. Используется
    // в обработчиках событий, внешних по отношению к компоненту "таблица"
    const table = useRef<DataTableRef>(null);

    // Данные для таблицы находятся в отдельном файле - "tableData.ts"
    const [tableData, setDataTable] = useState<TableRow[]>(employeesData);

    // Настройка отображения колонок и их идентификаторов в ajax-режиме
    const columns = [
      { title: '№', data: 'id', searchable: false },                        // Не ищем данные в этой колонке
      { title: 'ФИО', data: 'name', className: "dt-body-center" },          // Выравнивание по центру
      { title: 'Должность', data: 'position', className: "dt-body-left" },  // Выравнивание по левой границе
    ];

    const handleClick = () => {
      const api: Api | null = table.current!.dt();
      const selected: ApiRowsMethods<TableRow> = api!.rows({ selected: true });

      // Если не было выбрано ни одного элемента, то ничего не делаем
      if (selected.data().length == 0) {
        return;
      }

      // Находим индекс элемента с выбранным id
      const data: TableRow = selected.data()[0]
      const index = tableData.findIndex((row: TableRow) => row.id === data.id);

      // Заменяем строку таблицы на другую
      const updatedTable: TableRow[] = [
        ...tableData.slice(0, index),
        ...tableData.slice(index + 1),
        {id: data.id, name: "Roman Rusakov", position: "Blazor Developer"},
      ];

      // Обновляем контент таблицы
      setDataTable(updatedTable);

      // Почитать статью, которая решает схожую с моей задачу:
      // https://datatables.net/forums/discussion/66731/react-best-way-to-render-rows-based-on-state
    };

    return (
      <>
        <DataTable
          data={tableData}
          ref={table}
          columns={columns}
          slots={{
            1: (data: string) => {
              return <a href="https://rbc.ru">{data}</a>;
            },
          }}
          options={{
            select: {
              style: "single",
            },
            responsive: true,
          }}
          className="table table-sm table-striped table-hover table-bordered"
        >
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Position</th>
            </tr>
          </thead>
        </DataTable>
      </>
    );
  }
);

export default EmployeeDataTable;
