import React from 'react';
import Header from './Header';

interface PageProps {
  // При необходимости можно добавить пропсы для компонента
}

const Page: React.FC<PageProps> = () => {
  return (
    <div id="app">
      <Header />
      <article>
        <h2>React Course</h2>
        <p>
          A course that teaches you React from the ground up and in great depth!
        </p>
      </article>
    </div>
  );
};

export default Page;