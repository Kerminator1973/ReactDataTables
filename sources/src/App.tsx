import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ExperimentalDataTable from './ExperimentalDataTable';
import EmployeeModal from './EmployeeModal';
import './App.css';


function App() {

    // Определяем состояние "активатор модального окна"
  const [isModalOpen, setModalShow] = useState(false);

  // Функция-обработчик нажатия кнопки добавления нового сотрудника
  const handleShow = () => setModalShow(true);

  return (
    <>
      {/* Кнопка для активации модального окна */}
      <Button variant="primary" onClick={handleShow}>
          Добавить нового сотрудника
      </Button>

      {/* Таблица с сотрудниками компании */}
      <ExperimentalDataTable />

      {/* Модальный диалог для добавления нового сотрудника */}
      <EmployeeModal isOpen={isModalOpen} setModalShow={setModalShow} />
    </>
  )
}

export default App
