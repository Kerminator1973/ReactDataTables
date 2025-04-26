
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function EmployeeModal() {

  // Определяем состояние "активатор модального окна"
  const [show, setShow] = useState(false);

  // Функции, позволяющие отобразить, или скрыть модальное окно
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Определяем состояния полей для ввода ФИО и должности
  const [surnameField, setSurnameField] = useState<string>('');
  const [positionField, setPositionField] = useState<string>('');

  // Обработчик нажатия кнопки "Submit"
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Предотвращаем попытку отправки данных на сервер
    event.preventDefault();

    // Фиксируем результаты ввода в консоли
    console.log('Surname:', surnameField);
    console.log('Position:', positionField);

    // Сбрасываем поля для повторного использования
    setSurnameField('');
    setPositionField('');

    // Закрываем модальное окно
    setShow(false);
  };

  return (
    <>
        {/* Кнопка для добавления модального окна */}
        <Button variant="primary" onClick={handleShow}>
            Запуск модального окна
        </Button>

        {/* Модальный диалог для добавления нового сотрудника */}
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
            <Modal.Title>Новый сотрудник</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
            <Modal.Body>
                <div className="mb-3">
                <label htmlFor="surnameField" className="form-label">Имя сотрудника:</label>
                <input type="text" id="surnameField" className="form-control"
                    value={surnameField} onChange={(e) => setSurnameField(e.target.value)}
                />
                </div>
                <div className="mb-3">
                <label htmlFor="positionField" className="form-label">Должность:</label>
                <input type="text" id="positionField" className="form-control"
                    value={positionField} onChange={(e) => setPositionField(e.target.value)}
                />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Закрыть</Button>
                <Button type="submit" variant="primary" onClick={handleClose}>
                Сохранить изменения
                </Button>
            </Modal.Footer>
            </form>
        </Modal>    
    </>
    )
}

export default EmployeeModal