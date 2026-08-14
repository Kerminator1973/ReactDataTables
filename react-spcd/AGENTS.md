## Operational Guidelines for React‑SPCD

### 🧩 Setup and Workflow Conventions

- **Scripts:** All primary commands are defined in `package.json` scripts.
  - **Development:** Use `npm run dev` to start the development server/HMR.
  - **Building:** The full build sequence is `tsc -b && vite build`.  
    Note that TypeScript compilation (`tsc -b`) must complete before Vite bundling can occur.
  - **Linting:** Linting is executed with `npm run lint` (using `oxlint`).

- **Shell:** When running commands on Windows, always use **Command Prompt (cmd.exe)**, not PowerShell.  
  This ensures consistent behaviour with the project's script runners and avoids compatibility issues with PowerShell‑specific syntax or execution policies.

---

### 🏢 Backend Architecture

The backend is implemented in C# using **ASP.NET Core 10** with **Minimal API** pattern and **SQLite** database.

#### Project Structure

- **Backend Folder:** Located in the `backend` directory
- **API Layer:** Uses Minimal API approach for lightweight and efficient endpoints
- **Database:** SQLite for local development and testing

---

### 🔌 Backend Setup

#### Prerequisites

- **Dotnet SDK:** Ensure .NET SDK 10.x is installed
- **SQLite:** Install SQLite tools if needed for database management

#### Running Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Start the development server:
```bash
dotnet run
```

---

### 🗄️ Database Configuration

- **SQLite Usage:** The backend uses SQLite for local development
- **Migrations:** Database schema is managed via code-first approach
- **Connection String:** Configured in `appsettings.json`

---

### 🔗 API Documentation

- **Endpoint Documentation:** Refer to `backend/Endpoints.md` for detailed API descriptions
- **Versioning:** API follows semantic versioning conventions
- **Error Handling:** Standardized error responses with HTTP status codes

---

### 🛠️ Testing Backend

- **Unit Tests:** Located in `backend/Tests` directory
- **Test Coverage:** Use `dotnet test` to run tests
- **Environment:** Ensure `appsettings.Test.json` is configured for testing

---

### 🎨 Styling

- **Tailwind CSS** is the designated utility‑first framework for all styling within the application.  
  - Use Tailwind utility classes for layout, spacing, typography, colours, and responsive design.  
  - Avoid inline styles or custom CSS files unless absolutely necessary and approved.  
  - Follow the project's Tailwind configuration (see `tailwind.config` if present) for theme tokens, custom breakpoints, and any extended utilities.

---

### ⚙️ Linter / Type Checking Quirks

- The system uses **Oxlint** for linting.  
  For enhanced, type‑aware checks in production environments, the `.oxlintrc.json` must be configured to include the `react`, `typescript`, and `oxc` plugins with `"typeAware": true`.  
  This setup is crucial for accurate rule enforcement.

---

### 📚 Architectural Context

- The project supports React/TypeScript via Vite and utilizes specific compilation layers:
  - The current development flow can use either `@vitejs/plugin-react` (Oxc) or `@vitejs/plugin-react-swc` (SWC).
  - Always respect the compiler used in existing plugins when making changes.

Please refer to `package.json` for all standard commands and `README.md` for deep technical details on tooling like Oxlint.