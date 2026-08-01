## Operational Guidelines for React‑SPCD

### 🧩 Setup and Workflow Conventions

- **Scripts:** All primary commands are defined in `package.json` scripts.
  - **Development:** Use `npm run dev` to start the development server/HMR.
  - **Building:** The full build sequence is `tsc -b && vite build`.  
    Note that TypeScript compilation (`tsc -b`) must complete before Vite bundling can occur.
  - **Linting:** Linting is executed with `npm run lint` (using `oxlint`).

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
