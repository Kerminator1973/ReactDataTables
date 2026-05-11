import React, { createContext, useContext } from "react";

type Theme = "light" | "dark";  // Определяем тип Theme

interface ThemeContextValue {   // Определяем интерфейс контекста
  theme: Theme;
  toggleTheme: () => void;
}

// Создаём контекста
const ThemeContext = createContext<ThemeContextValue | null>(null);

// При определении провайдера, описываем интерфейс Props, поскольку
// через него передаются дочерние компоненты, а также тема интерфейса
// "по умолчанию"
interface ThemeContextProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export class ThemeContextProvider 
  extends React.Component<ThemeContextProviderProps, { theme: Theme }>
{
  constructor(props: ThemeContextProviderProps) {
    super(props);
    this.state = {
      theme: props.defaultTheme ?? "light",
    };
  }

  toggleTheme = () => {
    this.setState((prev) => ({
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  render() {
    // Значение оборачивается в объект вручную, без useMemo (класс-компонент)
    const contextValue: ThemeContextValue = {
      theme: this.state.theme,
      toggleTheme: this.toggleTheme,
    };

    return (
      <ThemeContext.Provider value={contextValue}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

// Опционально: hook для удобного доступа к контексту
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
}
