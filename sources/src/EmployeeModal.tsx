import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


type ModalComponentProps = {
    isOpen: boolean;
    isEditMode: boolean;
    setModalShow: (state: boolean) => void;
    surnameField: string;
    setSurnameField: React.Dispatch<React.SetStateAction<string>>;
    positionField: string;
    setPositionField: React.Dispatch<React.SetStateAction<string>>;
    onSubmit: () => void;
};

const EmployeeModal: React.FC<ModalComponentProps> = ({ 
    isOpen, isEditMode, setModalShow, surnameField, setSurnameField, positionField, setPositionField, onSubmit,
}) => {

  // Функция, позволяющая скрыть/закрыть модальное окно
  const handleClose = () => setModalShow(false);

  // Обработчик нажатия кнопки "Submit"
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    // Предотвращаем попытку отправки данных на сервер
    event.preventDefault();

    // Сбрасываем поля для повторного использования
    setSurnameField('');
    setPositionField('');

    // Закрываем модальное окно
    setModalShow(false);

    // Информируем родительский компонент о завершении ввода
    onSubmit();
  };

  return (
    <>
        {/* Модальный диалог для редактирования данных сотрудника */}
        <Modal show={isOpen} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
            <Modal.Title>
                {isEditMode === false && (
                    <>Добавление нового сотрудника</>
                )}
                {isEditMode === true && (
                    <>Редактирование сотрудника</>
                )}
            </Modal.Title>
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
                {isEditMode === false && (
                    <>Добавить сотрудника</>
                )}
                {isEditMode === true && (
                    <>Сохранить изменения</>
                )}
                </Button>
            </Modal.Footer>
            </form>
        </Modal>    
    </>
    )
}

export default EmployeeModal