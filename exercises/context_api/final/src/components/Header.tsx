import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {

  const { toggleTheme } = useTheme();

  const handleThemeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggleTheme();
    console.log('Кнопка Theme нажата');
  };

  return (
    <button onClick={handleThemeClick} type="button" aria-label="Кнопка смены темы">
      Поменять тему
    </button>
  );
};

export default Header;