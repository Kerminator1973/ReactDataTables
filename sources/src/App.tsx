import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ExperimentalDataTable from './ExperimentalDataTable';
import './App.css';


function App() {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <ExperimentalDataTable />

      <Button variant="primary" onClick={handleShow}>
        Запуск модального окна
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Заголовок модального окна</Modal.Title>
        </Modal.Header>
        <Modal.Body>В этой области можно размещать различный контент окна...</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Сохранить изменения
          </Button>
        </Modal.Footer>
      </Modal>    
    </>
  )
}

export default App
