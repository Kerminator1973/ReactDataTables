import { useState, forwardRef, useImperativeHandle, Ref, useRef } from "react";
import DataTable, { DataTableRef } from "datatables.net-react";
import DT, { Api, ApiRowsMethods } from "datatables.net-bs5";

import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-select-bs5";
import "datatables.net-responsive-bs5";
import "./EmployeeDataTable.css";

import { employeesData, TableRow } from './tableData.ts';


// Определяем тип, содержащий публичные метода компонента, которые может
// использовать внешний код
export type EmployeeDataTableRef = {
  addNewEmployee: (name: string, position: string) => void;
  replaceEmployee: (name: string, position: string) => void;
  getCurrentEmployee: () => TableRow | null;
};

const EmployeeDataTable = forwardRef(
  (_props, ref: Ref<EmployeeDataTableRef>) => {

    // Функция добавления нового сотрудника в таблицу
    const addNewEmployee = (name: string, position: string) => {

      // Добавляем в таблицу новую запись, идентификатор которой
      // больше максимального id в таблице
      const maxId = Math.max(...tableData.map(employee => employee.id));
      const updatedTable: TableRow[] = [...tableData, 
        {id: maxId + 1, name: name, position: position}];

      // Обновляем контент таблицы
      setDataTable(updatedTable);
    };

    // Функция изменения параметров текущей записи таблицы
    const replaceEmployee = (name: string, position: string) => {

      // Ищем текущего выбранного сотрудника компании
      const currentEmployee: TableRow | null = getCurrentEmployee();
      if (currentEmployee !== null) {

        // Находим в таблице строку, которая связана с выбранным сотрудником
        const data: TableRow = currentEmployee;
        const index = tableData.findIndex((row: TableRow) => row.id === data.id);

        // Заменяем строку таблицы на другую
        const updatedTable: TableRow[] = [
          ...tableData.slice(0, index),
          ...tableData.slice(index + 1),
          {id: data.id, name: name, position: position},
        ];

        setDataTable(updatedTable); // Обновляем контент таблицы
      }

      // Почитать статью, которая решает схожую с моей задачу:
      // https://datatables.net/forums/discussion/66731/react-best-way-to-render-rows-based-on-state
    };

    // Определяем реализацию метода, который возвращает текущего выбранного сотрудника
    const getCurrentEmployee = () => {

      const api: Api | null = table.current!.dt();
      const selected: ApiRowsMethods<TableRow> = api!.rows({ selected: true });

      // Если не было выбрано ни одного элемента, то возвращаем null
      if (selected.data().length == 0) {
        return null;
      }

      // Возвращаем текущий выбранный элемент
      return selected.data()[0];
    };

    // Используем useImperativeHandle, чтобы предоставить родительскому элементу
    // доступ к методам дочерних элементов
    useImperativeHandle(ref, () => ({
      addNewEmployee,
      replaceEmployee,
      getCurrentEmployee,
    }));

    // Выполняем настройку таблицы DataTables.NET
    DataTable.use(DT);

    // Ссылка на DOM-элемент, реализующий функционал таблицы. Используется
    // в обработчиках событий, внешних по отношению к компоненту "таблица"
    const table = useRef<DataTableRef>(null);

    // Данные для таблицы находятся в отдельном файле - "tableData.ts"
    const [tableData, setDataTable] = useState<TableRow[]>(employeesData);

    // Настройка отображения колонок и их идентификаторов в ajax-режиме.
    // TODO: Может вынести за пределы компонента, или сделать константными
    const columns = [
      { title: '№', data: 'id', searchable: false },                        // Не ищем данные в этой колонке
      { title: 'ФИО', data: 'name', className: "dt-body-center" },          // Выравнивание по центру
      { title: 'Должность', data: 'position', className: "dt-body-left" },  // Выравнивание по левой границе
    ];

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
            language: {
              lengthMenu: "Выводить по _MENU_ записей",
              zeroRecords: "Данные не найдены",
              info: "Отображается страница _PAGE_ из _PAGES_",
              infoEmpty: "Записи отсутствуют",
              infoFiltered: "(всего имеется _MAX_ записей)",
              emptyTable: "Данные в таблице отсутствуют",
              loadingRecords: "Загрузка...",
              processing: "Обработка...",
              search: "Поиск:",
              paginate: {
                  first: "Первая",
                  last: "Последняя",
                  next: ">>",
                  previous: "<<"
              },
            },
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
