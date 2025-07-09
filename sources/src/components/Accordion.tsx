import { createContext, useContext, useState } from 'react';

// Определяем интерфейс элемента массива, данные которого используются при
// формировании списка (Accordion)
export interface AccordionItemType {
  label: string;
  content: string;
  id?: string | number;
}

interface AccordionContextType {
  activeItemIndex: number;
  setActiveItemIndex: (index: number) => void;
}

const AccordionContext = createContext<AccordionContextType>({
    activeItemIndex: 0,
    setActiveItemIndex: () => 0,
});

export const Accordion = ({ children }: { children: React.ReactNode }) => {
    const [activeItemIndex, setActiveItemIndex] = useState(0);

    return (
        <AccordionContext.Provider value={{ activeItemIndex, setActiveItemIndex }}>
            <ul>{children}</ul>
        </AccordionContext.Provider>
    );
};

interface AccordionItemProps {
  item: AccordionItemType;
  index: number;
}

export const AccordionItem : React.FC<AccordionItemProps> = ({item, index}) => {
    const { activeItemIndex, setActiveItemIndex } = useContext(AccordionContext);

    return (
        <li onClick={() => setActiveItemIndex(index)} key={item.id || index}>
            <strong>{item.label}</strong>&nbsp;
            {index === activeItemIndex && item.content}
        </li>
    );
};
