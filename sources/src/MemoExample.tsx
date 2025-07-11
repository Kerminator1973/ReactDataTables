import { useMemo } from 'react';
import { Accordion, AccordionItem, AccordionItemType } from "./components/Accordion";

const ACCORDION_ITEMS  : AccordionItemType[] = [
  {label: "One", content: "lorem ipsum for more, see http://one.com"},
  {label: "Two", content: "lorem ipsum for more, see http://two.com"},
  {label: "Three", content: "lorem ipsum for more, see http://three.com"},
  {label: "Four", content: "lorem ipsum for more, see http://four.com"},
];

const MemoExample = () => {

    // Выполняется мемоизация дочерних элементов Accordion
    const memoizedAccordionItems = useMemo(() => {
        console.log("Current high-resolution tick: " + performance.now());
        return ACCORDION_ITEMS .map((item: AccordionItemType, index: number) => (
            <AccordionItem key={index} item={item} index={index} />
        ))
    }, []);
    
    return (
        <>
            <Accordion>
                {memoizedAccordionItems}
            </Accordion>

            {/* Странное дело, но количество записей об ре-рендере с мемоизацией и без - одинаковое
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
            */}
        </>
    )   
}

export default MemoExample;