import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { EmployeeData } from './types';


// Определяем список свойств (props), которые передаются в модальный диалог
type EmployeeModalProps = {
    // Состояние модального окна
    show: boolean;
    // Добавляется ли новый сотрудник, или редактируются параметры существующего
    isEditMode: boolean;
    // Объект с данными пользователя является опциональным и передаётся только в режиме редактирования
    initialData?: EmployeeData;
    // При закрытии окна, обрабатывать это событие может родительный элемент
    onClose: () => void;
    // При нажатии кнопки "Submit" вызывается callback-функция родительского компонента
    onSubmit: (data: EmployeeData) => void;
};

const EmployeeModal: React.FC<EmployeeModalProps> = ({
    show, isEditMode, initialData, onClose, onSubmit,
}) => {

    // Состояние текущего объекта - это не отдельное поле, а объект, который
    // инициализируется пустым значением
    const [formData, setFormData] = useState<EmployeeData>({
        surname: '',
        position: '',
    });

    // Хук useEffect() используется для того, чтобы проинициализировать данные
    // когда модальный диалог открывается в режиме редактирования
    useEffect(() => {
        if (isEditMode && initialData && show) {
            setFormData(initialData);
        } else {
            // Сбрасываем данные в фореме, если она открывается в режиме добавления
            // нового сотрудника, или модальное окно закрывается
            setFormData({ surname: '', position: '' });
        }
    }, [isEditMode, initialData, show]);

    // При каждом изменении полей ввода, обновляется состояние модального диалога (formData)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        // Передаём собранные данные родительскому компоненту
        onSubmit(formData);

        // Решение о закрытии модального окна делегируем родительскому компоненту. Он может
        // принять решение о том, что форму закрывать нельзя, если, например, валидация данные
        // не была успешной
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    // Модальный диалог для редактирования данных сотрудника
    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                {isEditMode ? 'Редактирование сотрудника' : 'Добавление нового сотрудника'}
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="surname" className="form-label">Имя сотрудника:</label>
                        <input
                        type="text"
                        id="surname" // Идентификатор соответствует имени ключа в объекте состояния
                        className="form-control"
                        value={formData.surname}
                        onChange={handleInputChange}
                        required // Данные должны быть введены
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="position" className="form-label">Должность:</label>
                        <input
                        type="text"
                        id="position"
                        className="form-control"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Закрыть
                    </Button>
                    <Button type="submit" variant="primary">
                        {isEditMode ? 'Сохранить изменения' : 'Добавить сотрудника'}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default EmployeeModal
