import React from 'react';

const Header: React.FC = () => {

  const handleThemeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    alert('Тема изменена! (в реальном приложении здесь будет логика смены темы)');
    console.log('Кнопка Theme нажата');
  };

  return (
    <button
      onClick={handleThemeClick}
      type="button"
      aria-label="Кнопка смены темы"
    >
      Поменять тему
    </button>
  );
};

export default Header;