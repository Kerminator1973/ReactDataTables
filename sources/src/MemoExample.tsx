import { useMemo } from 'react';
import { Accordion, AccordionItem, AccordionItemType } from "./components/Accordion";

const ACCORDION_ITEMS  : AccordionItemType[] = [
  {label: "One", content: "lorem ipsum for more, see http://one.com"},
  {label: "Two", content: "lorem ipsum for more, see http://two.com"},
  {label: "Three", content: "lorem ipsum for more, see http://three.com"},
  {label: "Four", content: "lorem ipsum for more, see http://four.com"},
];

const MemoExample = () => {

    // Выполняется мемоизация данные Accordion. TODO: проверить эффективность
    const memoizedAccordionItems = useMemo(() => 
    ACCORDION_ITEMS .map((item: AccordionItemType, index: number) => (
        <AccordionItem key={index} item={item} index={index} />
    )), []
    );
    
  return (
    <>
      {/* Аккордион, иллюстрирующий использование Context API */}
      <Accordion>
        {memoizedAccordionItems}
      </Accordion>
    </>
  )   
}

export default MemoExample;