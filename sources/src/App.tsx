import { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import EmployeeDataTable, { EmployeeDataTableRef } from './EmployeeDataTable';
import EmployeeModal from './EmployeeModal';
import './App.css';


function App() {

  // Определяем ссылку на экспортируемые функции компонента,
  // с интерфейсом EmployeeDataTableRef
  const childRef = useRef<EmployeeDataTableRef>(null);

  // Определяем состояние "активатор модального окна"
  const [isModalOpen, setModalShow] = useState(false);

  // Определяем режим работы модального окна
  const [isEditMode, setEditMode] = useState(false);

  // Определяем состояния полей для ввода ФИО и должности
  const [surname, setSurname] = useState<string>('');
  const [position, setPosition] = useState<string>('');

  // Функция-обработчик нажатия кнопки добавления нового сотрудника
  const handleAddNewEmployee = () => {
    setSurname('');
    setPosition('');
    setEditMode(false)    // Активируем режим добавления нового сотрудника
    setModalShow(true);
  };

  const handleEditEmployee = () => {

    if (childRef.current) {
      // Вызываем функцию конкретного экземпляра дочернего компонента
      const currentEmployee = childRef.current.getCurrentEmployee();
      if (currentEmployee !== null) {
        setSurname(currentEmployee.name);
        setPosition(currentEmployee.position);
        setEditMode(true);  // Активируем режим редактирования
        setModalShow(true);
      }
    }    
  };

  const handleSubmit = () => {
    if (childRef.current) {
      if (isEditMode === false) {
        childRef.current.addNewEmployee(surname, position);
      } else {
        // Вызываем функцию таблицы, указывая новые ФИО и должность сотрудника
        // в текущем выбранном элементе
        childRef.current.replaceEmployee(surname, position);
      }
    }
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

      {/* Модальный диалог для добавления нового сотрудника */}
      <EmployeeModal 
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        setModalShow={setModalShow}
        surnameField={surname} 
        setSurnameField={setSurname} 
        positionField={position} 
        setPositionField={setPosition}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default App
