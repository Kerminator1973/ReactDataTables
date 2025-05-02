// Определяем тип для описания данных строки таблицы
export type TableRow = {
  id: number, 
  name: string, 
  position: string;
};

export const employeesData: TableRow[] = [
  { id: 1, name: "Tiger Nixon", position: "System Architect"},
  { id: 2, name: "Garrett Winters", position: "Accountant"},
  { id: 3, name: "Maxim Rozhkov", position: "Head of a department"},
  { id: 4, name: "Ivan Ivanov", position: "Software Developer"},
  { id: 5, name: "Angela Kapranova", position: "Front-End Developer"},
  { id: 6, name: "Alexey Buhteev", position: "Quality Assurance Engineer"},
  { id: 7, name: "Igor Golubev", position: "Hardware Expert"},
  { id: 8, name: "Natasha Mityaeva", position: "Leading Quality Assurance Engineer"},
  { id: 9, name: "Svetlana Kolganova", position: "Linux Expert"},
  { id: 10, name: "Roman Rusakov", position: "Blazor Expert"},
  { id: 11, name: "Ekaterina Svekolnikova", position: "Frontend Developer"},
  { id: 12, name: "Sergei Volobuev", position: "Crypto-expert"},
  { id: 13, name: "Sergei Ivanenko", position: "System Analyst"},
  { id: 14, name: "Olesya Bolshova", position: "Communication Manager"},
  { id: 15, name: "Konstantin Bobrov", position: "Backend Developer"},
];
