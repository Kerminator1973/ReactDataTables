//import { useMemo } from 'react';
import { Accordion, AccordionItem, AccordionItemType } from "./components/Accordion";

const ACCORDION_ITEMS  : AccordionItemType[] = [
  {label: "One", content: "lorem ipsum for more, see http://one.com"},
  {label: "Two", content: "lorem ipsum for more, see http://two.com"},
  {label: "Three", content: "lorem ipsum for more, see http://three.com"},
  {label: "Four", content: "lorem ipsum for more, see http://four.com"},
];

const MemoExample = () => {

    // Целью данного компонента является экспериментальное исследование
    // особенностей механизма re-rendering в React 19.
    // Основной вывод состоит в следующем: в случае изменения состояния дочерних
    // элементов re-rendering родительского состояния не осуществляется.
    // В данном примере, React не будет вызывать компонент MemoExample при
    // изменении состояния activeItemIndex посредством setActiveItemIndex()
    // в JSX-компонент Accordion. По этой причине, мемоизация в компоненте
    // MemoExample будет избыточной и вредной

    /*    
    const memoizedAccordionItems = useMemo(() => {
        console.log("Current high-resolution tick: " + performance.now());
        return ACCORDION_ITEMS .map((item: AccordionItemType, index: number) => (
            <AccordionItem key={index} item={item} index={index} />
        ))
    }, []);
    */
    
    return (
        <>
            {/*
            <Accordion>
                {memoizedAccordionItems}
            </Accordion>
            */}

            <Accordion>
            {
                (() => {
                    console.log("Re-render (without memoization): " + performance.now());
                    return ACCORDION_ITEMS.map((item: AccordionItemType, index: number) => (
                        <AccordionItem key={index} item={item} index={index} />
                    ))
                })()
            } 
            </Accordion>   
        </>
    )   
}

export default MemoExample;