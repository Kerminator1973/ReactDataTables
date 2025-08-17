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

Если попытаться загрузить эти файлы статически с локального диска, браузер выведет сообщение об ошибке (приблизительно):

```
Access to script at 'file:///D:/assets/index-LvPpn8IH.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-extension, chrome-untrusted, data, http, https, isolated-app.
```

Это означает, что для запуска приложения необходимо настроить CORS, что проще всего сделать используя сервер статических сайтов, например, Node.js.

## Запуск статического сайта с React-приложением

Создание базового Node.js-приложения с Express.js:

```shell
npm init
```

```shell
npm install express
```

```shell
npm install
```

Далее следует создать файл "server.js", в который следует добавить логику обработки запросов статических файлов:

```js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Статические файлы находятся в папке "build"
app.use(express.static(path.join(__dirname, 'build')));

// Если имя файла не будет указано, то будет возвращён файл "index.html"
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

Файлы React-приложения следует скопировать в папку "build".

Следует заметить, что **Express 5** использует **router 2**, который использует **path-to-regexp 8**, что изменяет правила указания масок файлов в app.get() и других командах. Теперь это не просто маска, а регулярное выражение. Т.е. если раньше мы писали:

```js
app.get('*', (req, res) => {
```

то теперь необходимо явно указывать, что используется регулярное выражение:

```js
app.get(/(.*)/, (req, res) => {
```

>В Express 5 было внесено [множество изменений](https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/), в том числе - обработка _wildcard routes_ была изменена. Чтобы избежать неоднозначной обработки routes, необходимо явно заменять wildcard `*` на конструкцию вида `(.*)`. Это сделано с целью большей предсказуемостью кода и его ясностью (_clarity_).
>
>Подробно эта тема рассмотрена в статье [How to Setup Regex for ExpressJS Router URL in Node.js ?](https://www.geeksforgeeks.org/node-js/how-to-setup-regex-for-expressjs-router-url-in-node-js/)

Запуск приложения осуществляется командой:

```shell
node server.js
```

## Запуск приложения на машине с Windows 7

Последняя версия Node.js, которая может быть запущена на Windows 7 - Node.js 12.

Последняя совместимая с Windows 7 версия Express.js - 4.16. Добавить её в проект можно командой:

```shell
npm install express@4.16.x
```

Файл "package.json" в это случае выглядит следующим образом:

```json
{
  "name": "statserv",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.16.4"
  }
}
```

Однако, при попытке запуска приложения в Internet Explorer 11 в Windows 7, браузер отображает чёрный экран без ошибок в Developer Console. При этом, в браузере Chrome версии 109.0.5414.120 приложение работает вполне корректно.

Vite does not natively support Internet Explorer 11

Необходимо установить специализированный модуль совместимости с legacy-браузерами:

```shell
npm install @vitejs/plugin-legacy -D
```

Затем нужно изменить настройки компиляции для Vite. Для этого необходимо в файле "vite.config.js" указать параметры сборки проекта:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: [
        'core-js/stable',
        'regenerator-runtime/runtime'
      ]
    })
  ]
})
```

В процессе сборки будут транспилированы используемые библиотеки, 