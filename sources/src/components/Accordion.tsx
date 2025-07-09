import { createContext, useContext, useState } from 'react';

// Определяем интерфейс элемента массива, данные которого используются при
// формировании списка (Accordion)
export interface AccordionItemType {
  label: string;        // Заголовок элемента
  content: string;      // Информационная часть, связанная с элементом
  id?: string | number; // Идентификатор элемента
}

// Определяем интерфейс контекста Accordion. Заметим, что это целочисленный state
type AccordionContextType = {
  activeItemIndex: number;
  setActiveItemIndex: (index: number) => void;
}

// Создаём элемент AccordionContext.Provider и общий контекст для Accordion и AccordionItem
const AccordionContext = createContext<AccordionContextType>({
    activeItemIndex: 0,
    setActiveItemIndex: () => 0,
});

// Определяем родительский элемент. children - особенное зарезервированное свойство,
// JSX-верстка дочерних элементов.
// Следует обратить внимание, что для Accordion и AccordionItem не создавались
// отдельные интерфейсы - описание типов было включено непосредственно в их определение
export const Accordion = ({ children } : { children: React.ReactNode }) => {
    const [activeItemIndex, setActiveItemIndex] = useState(0);

    return (
        <AccordionContext.Provider value={{ activeItemIndex, setActiveItemIndex }}>
            <ul>{children}</ul>
        </AccordionContext.Provider>
    );
};

export const AccordionItem = ({ item, index } : { item: AccordionItemType, index: number }) => {
    const { activeItemIndex, setActiveItemIndex } = useContext(AccordionContext);

    return (
        <li onClick={() => setActiveItemIndex(index)} key={item.id ?? index}>
            <strong>{item.label}</strong>&nbsp;
            {activeItemIndex === index && (
                <div>{item.content}</div>
            )}
        </li>
    );
};
