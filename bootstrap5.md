# Использование Bootstrap 5 в React-приложении

Для стилистического оформления пользовательского интерфейса в стиле Boostrap 5, совместно с DataTables.NET была установлена оригинальная библиотека. Однако для React существует специализированная Bootstrap-библиотека - [React Bootstrap](https://react-bootstrap.netlify.app/).

Различия в библиотеках драматические. Так, например, в случае использования с React традиционного Bootstrap 5 модальное окно может быть создано следующим образом:

```ts
import { useState } from 'react';
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
```

Однако при использовании [React Bootstrap верстка](https://react-bootstrap.netlify.app/docs/components/modal/) выглядит совсем по другому:

```ts
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Example() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch static backdrop modal
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Do not even try to press
          escape key.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example;
```

Верстка от React Bootstrap кажется гораздо более разумной, а поведение - более соответствующим правилам Bootstrap 5.

TODO: необходимо проверить, совместима ли DataTables.NET с React Bootstrap.

Ещё один вопрос - React Bootstrap находится в состоянии "beta", а не "production". Репозитарий проекта живой, в него осуществляются commit-ы, но его развивает, по сути, только один человек - kyletsang из Канады. Причём, в основном, он поддерживает версию 2, которая ориентирована на использование Bootstrap 4. Т.е. переход кажется достаточно не однозначным.

Мнение ChatGPT: Bootstrap 5 является совместимым с React 18, но пока ещё не полностью совместим с React 19. Рекомендация - использовать либо только CSS часть от Bootstrap 5, либо использовать сторонние библиотеки, например: [React-Bootstrap](https://react-bootstrap.github.io/).

Следуя рекомендациям основной документации, не нужно отказываться в проекте от "Vanilla" Bootstrap, а нужно лишь добавить:

```shell
npm install react-bootstrap
```

В результате, в файле "package.json" появилась строка:

```json
"react-bootstrap": "^2.10.9",
```

После добавления зависимости и изменения верстки, появилась динамика и удалось сделать окно действительно сделать модальным, но при этом стилистическое оформление не развалилось. Т.е. пока можно ориентироваться именно на использование библиотеки React-Bootstrap.
