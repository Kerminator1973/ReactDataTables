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

  // Определяем состояния полей для ввода ФИО и должности
  const [surname, setSurname] = useState<string>('');
  const [position, setPosition] = useState<string>('');

  // Функция-обработчик нажатия кнопки добавления нового сотрудника
  const handleShow = () => {

    if (childRef.current) {
      // Вызываем функцию конкретного экземпляра дочернего компонента
      const currentEmployee = childRef.current.getCurrentEmployee();
      if (currentEmployee !== null) {
        setSurname(currentEmployee.name);
        setPosition(currentEmployee.position);
        setModalShow(true);
      }
    }    
  };

  const handleClick = () => {
    if (childRef.current) {
      // Вызываем функцию таблицы, указывая новые ФИО и должность сотрудника
      // в текущем выбранном элементе
      childRef.current.replaceEmployee(surname, position);
    }    
  };

  return (
    <>
      <div className="container mt-3">
        {/* Кнопка для активации модального окна */}
        <Button variant="primary" onClick={handleShow}>
          Добавить нового сотрудника
        </Button>

        <Button variant="primary" onClick={handleClick}>
          Заменить сотрудника
        </Button>
      </div>          

      {/* Таблица с сотрудниками компании */}
      <EmployeeDataTable ref={childRef} />

      {/* Модальный диалог для добавления нового сотрудника */}
      <EmployeeModal 
        isOpen={isModalOpen}
        setModalShow={setModalShow}
        surnameField={surname} 
        setSurnameField={setSurname} 
        positionField={position} 
        setPositionField={setPosition} />
    </>
  )
}

export default App
