import { createContext, useContext, useState } from 'react';

const AccordionContext = createContext({
    activeItemIndex: 0,
    setActiveItemIndex: () => 0,
});

export const Accordion = ({items, children}) => {
    const [activeItemIndex, setActiveItemIndex] = useState(0);

    return (
        <AccordionContext.Provider value={{ activeItemIndex, setActiveItemIndex }}>
            <ul>{children}</ul>
        </AccordionContext.Provider>
    );
};

export const AccordionItem = ({item, index}) => {
    const { activeItemIndex, setActiveItemIndex } = useContext(AccordionContext);

    return (
        <li onClick={() => setActiveItemIndex(index)} key={item.id}>
            <strong>{item.label}</strong>
            {index === activeItemIndex && item.content}
        </li>
    );
};
