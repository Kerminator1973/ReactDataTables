## Operational Guidelines for React‑SPCD

### 🧩 Setup and Workflow Conventions

- **Scripts:** All primary commands are defined in `package.json` scripts.
  - **Development:** Use `npm run dev` to start the development server/HMR.
  - **Building:** The full build sequence is `tsc -b && vite build`.  
    Note that TypeScript compilation (`tsc -b`) must complete before Vite bundling can occur.
  - **Linting:** Linting is executed with `npm run lint` (using `oxlint`).
  - **Testing:** Unit tests are written and executed using **Vitest**.
    - Use `npm run test` to run all unit tests in watch mode during development.
    - Use `npm run test:run` (or `vitest run`) to execute tests once in CI or non-interactive scenarios.
    - Place test files alongside source files using the `.test.ts` / `.test.tsx` naming convention (co-located tests).
    - Leverage Vitest's native compatibility with Vite configuration — no separate test configuration is required unless project-specific overrides are needed.
    - Prefer Vitest's built-in assertion library, mocking utilities (`vi.mock`, `vi.fn`), and snapshot testing capabilities over external dependencies.
    - Ensure that all new features and bug fixes are accompanied by corresponding unit tests before merging.

- **Shell:** Always use Microsoft Windows **Command Prompt (cmd.exe)**, not PowerShell.  
  This ensures consistent behaviour with the project's script runners and avoids compatibility issues with PowerShell‑specific syntax or execution policies.
  - **PowerShell Fallback:** If PowerShell must be used (e.g., due to environment constraints or CI runner defaults), always execute the following command **before** running any project scripts:
    ```powershell
    Set-ExecutionPolicy Bypass -Scope Process
    ```
    This temporarily relaxes the execution policy for the current PowerShell session only, allowing npm/dotnet scripts to run without being blocked by policy restrictions. **Never** set a system-wide or user-scoped bypass as a permanent solution.

### Windows Command Line Usage Features

**Usage Recommendations:**

* When navigating through directories, use `cd` instead of `ls`
* Always specify the full path or be in the required directory when executing scripts
* When working with npm/dotnet, use single quotes for parameters

**Additional Notes:**
* Be mindful of case sensitivity in commands (though Windows is generally case-insensitive)
* Use forward slashes (`/`) or backslashes (`\\`) consistently in paths
* Avoid spaces in directory/file names to prevent path issues
* Use quotes around paths containing spaces
* Verify that all necessary permissions are granted before running commands

---

### 🔄 Asynchronous Code Standards

**Async/Await Preference:** In the client-side TypeScript code, **async/await** should be the primary method for handling asynchronous operations. This approach provides:

* More readable and maintainable code
* Clearer error handling with try/catch blocks
* Better stack traces for debugging
* Consistent syntax across the codebase

**Promises Usage:** While Promises are still valid in JavaScript/TypeScript, they should only be used in the following cases:

* When integrating with legacy codebases
* In very specific performance-critical scenarios
* When chaining multiple asynchronous operations where `.then()` syntax is more appropriate

**Code Examples:**

```typescript
// Recommended approach using async/await
async function fetchData(): Promise<void> {
  try {
    const response = await fetch('api/data');
    const data = await response.json();
    // Process data
  } catch (error) {
    handleError(error);
  }
}
```

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