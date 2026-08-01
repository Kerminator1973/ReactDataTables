# Создание проекта на React/TypeScript с Tailwind

Создать приложение на React с TypeScript и Vite можно используя шаблон:

```shell
npm create vite@latest react-spcd -- --template react-ts
```

Если нужно загрузить зависимости, следует выполнить команду:

```shell
cd react-spcd
npm install
```

Установка Tailwind:

```shell
npm install -D tailwindcss @tailwindcss/vite
```

В файле "vite.config.ts" необходимо  убедиться, что подключается plugin tailwindcss():

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

В файле "src/index.css" должна быть только строка:

```css
@import "tailwindcss";
```

>Есть генераторы boilerplate-кода, в которых всё настроено из коробки. Например:
>
>```shell
>npx degit https://github.com/joaopaulomoraes/reactjs-vite-tailwindcss-boilerplate my-app
>```

Запуск на компиляцию:

```
npm run build
```

По факту будет использоваться Vite, поскольку он прописан в "package.json":

```json
scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
```

Проверка работоспособности - необходимо добавить верстку со стилями Tailwind в "App.tsx":

```tsx
import './App.css'

function App() {

  return (
    <>
      <section id="center">
		<h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
		  Tailwind работает!
		</h1>
	  </section>
    </>
  )
}

export default App
```

Запуск приложения: `npm run dev`
