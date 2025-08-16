# Создание React-приложения для Internet Explorer 11 (ПроАТМ)

Генерация базового приложения (scaffolding) осуществляется командой:

```shell
npm create vite@latest react_ie11 -- --template react-ts
```

Запуск приложения на исполнение:

```shell
cd react_ie11
npm install
npm run dev
```

Затем добавляем пакет **react-router-dom** для управления переходами между страницами:

```shell
npm install react-router-dom
```

Далее следует добавить две тестовые страницы в файлах "Home.tsx" и "About.tsx".

Пример содержимого файла "Home.tsx":

```tsx
import React from 'react';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <p>Welcome to the Home Page!</p>
        </div>
    );
};

export default Home;
```

Пример содержимого файла "About.tsx":

```tsx
import React from 'react';

const About: React.FC = () => {
    return (
        <div>
            <h1>About Page</h1>
            <p>This is the About Page!</p>
        </div>
    );
};

export default About;
```

Далее следует настроить навигационную логику на главной форме "App.tsx".

Пример содержимого файла "About.tsx":

```tsx
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';

function App() {
  return (
    <Router>
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
        </nav>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
        </Routes>
    </Router>
  );
}

export default App
```

## Обеспечение работы приложения в Internet Explorer 11

Чтобы обеспечить возможность работы приложения в браузере Internet Explorer 11 необходимо использовать polyfills.

Сначала следует установить дополнительные пакеты в приложение:

```shell
npm install core-js regenerator-runtime
```

Затем нужно включить polyfills в файл "main.tsx". Полифилы выглядят следующим образом:

```tsx
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

Файл "main.tsx":

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

В конфигурационном файле "tsconfig.ts" следует добавить настройки для сборки в режиме ES5:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  }
}
```

Команда сборки выглядит следующим образом:

```shell
npm run build
```

Как результат, в папке "dist" должны появиться файл "index.html", а также папка "assets" с ".css" и ".js" файлами.
