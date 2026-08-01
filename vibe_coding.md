# Попытка разработки приложения посредством OpenCode

Задача - сгенерировать React-приложение без программирования с помощью локальной LLM Gemma 4, используя агента OpenCode.

Генерация базового приложения (_scaffolding_) осуществляется командой:

```shell
npm create vite@latest sources -- --template react-spcd
```

Исходные файлы создаются в текущей папке в подкаталоге "sources".

Запуск приложения на исполнение:

```shell
cd sources
npm install
npm run dev
```

## Создание AGENTS.md

Команда запуска агента OpenCode выглядит следующим образом:

```shell
ollama launch opencode
```

В терминале OpenCode следует выполнить команду `/init` для генерации файла "AGENTS.md". Был сгененрирован следующий файл:

```
### Workflow & Conventions ⚙️

This project follows a structured development loop primarily defined by the `package.json` scripts. When setting up or running changes, agents must be aware of this sequential process:

*   **Linting:** Always run `npm run lint` (`oxlint`) first to check for stylistic and basic code errors.
*   **Building/Type Checking:** The full build command, `npm run build`, executes these steps *in sequence*:
    1.  Compile TypeScript: `tsc -b` (This enforces type checking).
    2.  Build Assets: `vite build`.

### Command Shortcuts 🚀

| Goal | Command | Notes |
| :--- | :--- | :--- |
| Development Server | `npm run dev` | Starts the local development environment using Vite's hot module replacement (HMR). |
| Production Build | `npm run build` | Generates optimized production assets. Running this implicitly runs type checking (`tsc`) first. |
| Preview | `npm run preview` | Serves the built assets for a final verification check. |

### Technology Stack ⚛️
*   **Framework:** React (using hooks and function components).
*   **Bundler/Toolchain:** Vite / Rollup
*   **Language:** TypeScript (Strict typing is enforced via `tsconfig.*.json` files).
```

По мере развития приложения, этот файл можно либо перегенерировать, либо изменять вручную.

## Проверка мультимодальности

Gemma 4 не очень хорошо работает с иностранными языками. Для ускорения работы можно использовать переводчик.

Поскольку Gemma 4 является мультимодальной LLM, я скопировать форму с каталогом сайта SPCD и добавил следующий промпт: "_The image shows a product catalog from an online store. Products are arranged in rows of three. There can be many items nearby. Each product listing includes an image and text underneath it. Update the app by adding a catalog of six products to the main screen._"

Gemma 4 не смогла обработать картинку: "_I cannot analyze visual information directly for dynamic layout updates like adding a new product catalog. Please provide the list of products (e.g., as JSON or component code structure) so I can update the main screen accordingly_".

Переписал промпт: "_Analyze the document at the following link: https://dors-service.ru/DeviceCatalogPage/Default. This document contains a product catalog from an online store. Products are arranged in rows of three. There can be many rows. Each product listing includes an image and text underneath it. Update the app by adding a catalog of six products to the main screen_".

Gemma 4 всё равно не хочет выполнить задачу: "_Please provide the product catalog document by copying its contents or linking to an accessible file path so I can analyze it and update the application_".

Хорошо, попробую без мультимодальности: "_Update the app by adding a catalog of six products to the main screen. Products are arranged in rows of three. Each product listing includes an image and text underneath it. In total, you need to add six products: a counter, a counting and sorting machine, a viewing detector, an automatic detector, a vacuum packer, and a deposit machine. Use any images for each of the products_".

Gemma 4 сгенерировал карточку товара "src\components\ProductCard.tsx":

```jsx
import React from 'react';

// Define TypeScript interface for product data
interface Product {
    id: string;
    name: string;
    description: string;
    imageSrc: string; // Placeholder URL or local asset path
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      {/* Image container */}
      <div className="product-image">
        {/* Using a placeholder since no specific images are provided */}
        <img 
          src={product.imageSrc} 
          alt={`Image of ${product.name}`} 
          style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
        />
      </div>
      {/* Text content underneath image */}
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductCard;
```

Однако он не смог изменить главную страницу: "_Edit src\App.tsx 
Could not find oldString in the file. It must match exactly, including whitespace, indentation, and line endings_".
