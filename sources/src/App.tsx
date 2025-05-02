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

  // Функция-обработчик нажатия кнопки добавления нового сотрудника
  const handleShow = () => setModalShow(true);

  const handleClick = () => {
    if (childRef.current) {
      // Вызываем функцию конкретного экземпляра дочернего компонента
      childRef.current.replaceEmpoyee("1", "2");
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
      <EmployeeModal isOpen={isModalOpen} setModalShow={setModalShow} />
    </>
  )
}

export default App
