import ExperimentalDataTable from './ExperimentalDataTable';
import './App.css';
import EmployeeModal from './EmployeeModal';


function App() {
  return (
    <>
      {/* Таблица с сотрудниками компании */}
      <ExperimentalDataTable />

      {/* Модальный диалог для добавления нового сотрудника */}
      <EmployeeModal />
    </>
  )
}

export default App
