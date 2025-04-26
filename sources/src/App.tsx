import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import ExperimentalDataTable from './ExperimentalDataTable';
import './App.css';


function App() {

  const [showModal, setShowModal] = useState(false);

  // Функция создаёт модальное окно динамически
  const openModal = () => {
    setShowModal(true);
  };

  // Функция изменяет верстку, исключая из него модальное окно
  const closeModal = () => {
    setShowModal(false);
  };

  // Блокирует закрытие модального окна при щелчке на нём
  const preventPropagation = (event) => {
    event.stopPropagation();
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

      <ExperimentalDataTable />

      <div className="container mt-5">
        <button className="btn btn-primary" onClick={openModal}>
          Open Modal
        </button>

        {showModal && (
          // Описываем модельное окно, а также кнопку для его отображения
          <div 
            className="modal fade show" 
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={closeModal}
          >
            <div 
              className="modal-dialog"
              onClick={preventPropagation}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Modal Title</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <p>This is an example modal built with React and Bootstrap 5.3.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}      
      </div>
    </>
  )
}

export default App
