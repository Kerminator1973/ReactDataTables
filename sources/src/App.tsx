import { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import EmployeeDataTable, { EmployeeDataTableRef } from './EmployeeDataTable';
import EmployeeModal from './EmployeeModal';
import { EmployeeData } from './types';
import { Accordion, AccordionItem, AccordionItemType } from "./components/Accordion";
import './App.css';

// TODO: может вынести за пределы компонента, или сделать константными
const items : AccordionItemType[] = [
  {label: "One", content: "lorem ipsum for more, see http://one.com"},
  {label: "Two", content: "lorem ipsum for more, see http://two.com"},
  {label: "Three", content: "lorem ipsum for more, see http://three.com"}
];

function App() {

  // Определяем ссылку на экспортируемые функции компонента,
  // с интерфейсом EmployeeDataTableRef
  const childRef = useRef<EmployeeDataTableRef>(null);

  // Определяем состояние "активатор модального окна"
  const [isModalOpen, setModalShow] = useState(false);

  // Определяем режим работы модального окна
  const [isEditMode, setEditMode] = useState(false);

  // Определяем состояния полей для ввода ФИО и должности
  const [editingEmployee, setEditingEmployee] = useState<EmployeeData | undefined>(undefined);

  // Функция-обработчик нажатия кнопки добавления нового сотрудника
  const handleAddNewEmployee = () => {
    setEditingEmployee(undefined); // Явно указываем, что при добавлении никаких входных данных нет
    setEditMode(false)    // Активируем режим добавления нового сотрудника
    setModalShow(true);
  };

  const handleEditEmployee = () => {

    if (childRef.current) {
      // Вызываем функцию конкретного экземпляра дочернего компонента
      const currentEmployee = childRef.current.getCurrentEmployee();
      if (currentEmployee !== null) {

        // Передаём в компонент не отдельное поле, а объект
        setEditingEmployee({
          surname: currentEmployee.name, 
          position: currentEmployee.position
        });

        setEditMode(true);  // Активируем режим редактирования
        setModalShow(true);
      }
    }    
  };
 
  const handleSubmit = (data: EmployeeData) => {
    if (childRef.current) {
      if (isEditMode === false) {
        childRef.current.addNewEmployee(data.surname, data.position);
      } else {
        // Вызываем функцию таблицы, указывая новые ФИО и должность сотрудника
        // в текущем выбранном элементе
        childRef.current.replaceEmployee(data.surname, data.position);
      }
    }
  };

  // Решение о закрытии модального компонента принимает родительский компонент.
  // Это позволяет, например, не закрывать модальное окно, если данные не прошли валидацию
  const handleModalClose = () => {
    setModalShow(false);
  };
  
  return (
    <>
      <div className="container mt-3">
        {/* Кнопка добавления нового сотрудника */}
        <Button variant="primary" onClick={handleAddNewEmployee}>
          Добавить нового сотрудника
        </Button>

        {/* Кнопка редактирования существующего сотрудника */}
        <Button variant="primary" onClick={handleEditEmployee} className='ms-2'>
          Изменить инфу сотрудника
        </Button>
      </div>          

      {/* Таблица с сотрудниками компании */}
      <EmployeeDataTable ref={childRef} />

      {/* Аккордион, иллюстрирующий использованием Context API */}
      <Accordion>
          {items.map((item, index) => (
              <AccordionItem key={index} item={item} index={index} />
          ))} 
      </Accordion>

      {/* Модальный диалог для добавления нового сотрудника */}
      <EmployeeModal 
        show={isModalOpen}
        isEditMode={isEditMode}
        initialData={editingEmployee}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default App
