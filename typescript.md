# Заметки о TypeScript

[Официальный сайт](https://www.typescriptlang.org/) языка программирования TypeScript.

[Дорожная карта](https://github.com/Microsoft/TypeScript/wiki/Roadmap) развития TypeScript.

[Предложения по развитию](https://github.com/tc39/proposals) новых возможностей ECMAScript. В TypeScript предложения по развитию ECMAScript появляются на несколько лет раньше, чем в стандарте JavaScript.

Компилятор TypeScript называется **tsc**.

Вот, что уже есть в TypeScript:

- типы
- интерфейсы
- декораторы
- переменные членов классов (поля)
- обобщённые типы
- перечисления
- ключевые слова: public, protected, private
- async/await

Online-среда для проверки кода, называется REPL (Real-Evaluate-Print-Loop) и доступна на [официальной сайте языка](https://www.typescriptlang.org/play/).

>Оценочное мнение о TypeScript: результатом компиляции является JavaScript, в котором можно сделать всё, что угодно и это даёт гибкость и лютейшую опасность. TypeScript сфокусирован исключительно на том, чтобы развивать свойства, которые минимизируют опасность за счёт строгого синтаксиса, но при этом гибкость не снижается. Больше всего TypeScript похож на очень строгий Linter, который требует от программиста явных подсказок, что улучшает читаемость и надёжность кода.

## Установка и конфигурирование компилятора (транспайлера)

Установить компилятор TypeScript можно командой (в Windows необходимо запускать приложение с правами администратора):

```shell
npm install -g typescript
```

Узнать версию установленного компилятора можно командой:

```shell
tsc -v
```

Для настройки компилятора используется файл "tsconfig.json", в котором могут насходится следущие настройки:

```json
{
    "compilerOptions": {
        "noEmitOnError": true,
        "target": "es5",
        "watch": true
    }
}
```

Сгенерировать файл настроек можно командой: `tsc --init`

Параметр "noEmitOnError" установленный в значение true, означает, что компилятор не должен генерировать JavaScript-файл в случае, если есть какие-то ошибки в коде. По умолчанию, даже не смотря на наличие ошибок, компилятор может генерировать JavaScript-код, который является существенно менее строгим, чем TypeScript.

Параметр "target" позволяет выбрать целевую версию JavaScript при генерации JavaScript-кода. В приведённом выше примере, будет генерироваться ECMAScript 5.

Параметр "watch", в значении true, означает, что компилятор не должен завершаться и будет контролировать изменение файлов, чтобы выполнить компиляцию автоматически (developer mode).

## Базовые аннотации типов

Пример аннотации:

```ts
let firstName: string;
```

Более сложный пример аннотации типов:

```ts
function calcTac(state: string, incode: number, dependents: number) : number {
    return income * 0.06 - dependents * 500;
}
```

Примитивные типы:

- string
- boolean
- number
- symbol - уникальное значение, создаваемое вызовом конструктора Symbol
- any - переменная способна содержать значения разных типов
- unknown - нельзя выполнять никаких действий до определение конкретного типа
- never - для представления новозможного кода. Использовать имеет смысл для указания возвращаемого значения функции, в которой выполняется бесконечный цикл
- void - отсутствие значение

Примитивный тип symbol появился в ECMAScript 2015. Этот тип всегда уникален и неизменен. Пример определения:

```ts
const sym1 = Symbol("orderID");
const sym2 = Symbol("orderID");
```

Следует обратить внимание, что отсутствует ключевое слово new. В скобках указывается описание переменной ("orderID"). Обычно тип используется для создания уникальных ключей свойств объектов.

Также TypeScript имеет два специальных значения: undefined и null. null - намеренное отсутствие значения, а undefined - переменная, которой не было присвоено значение (не проинициализированная).

Переменная может иметь несколько типов - они указываются через символ "pipe":

```ts
function getName(): string | null {
    // ...
}
```

Если указывается несколько допустимых типов переменной, или возвращаемого значения, это называется "объединенный тип". Пример:

```ts
let padding: string | number;
```

## Как определить в коде тип переменной

Для примитивных типов следует использовать **typeof**, а для сложных типов - **instanceof**.

Попытка применить условные инструкции для уточнения типа переменной называются сужением типа. Пример:

```ts
if (typeof padding === "string") {
    return padding + value;
}
```

## Определение типов и классов

Определить псевдоним типа можно так:

```ts
type Foot = number;
```

Определить тип можно следующим образом:

```ts
type Patient = {
    name: string;
    height: Foot;
    age?: number;
}
```

Поле age в примере выше является не обязательным. Создать экземпляр можно так:

```ts
let patient: Patient = {
    name: 'Joe Smith',
    height: 5
}
```

Типовое определение класса и его инициализация:

```ts
class Person {
    firtsName: string;
    lastName: string;
    age: number;
}

const p = new Person();
p.firstName = "John";
p.secondName = "Smith";
p.age = 25;
```

Используя конструктор мы можем задачать члены класса, а также использовать модификаторы доступа:

```ts
class Block {
    readonly nonce: number;
    readonly hash: string;

    constructor (
        readonly index: number;
        readonly previousHash: string;
        readonly timestamp: number;
        readonly data: string
    ) {
        const { nonce, hash } = this.mine();    // Используем destructuring
        this.nonce = nonce;
        this.hash = hash;
    }
}
```

Ключевое слово **interface** позволяет определять структуры данных, которые используются в проверке типов при компиляции, но не переносятся в JavaScript-код (это ключевое полезное свойство интерфейса). Пример использования:

```ts
interface Person {
    firtsName: string;
    lastName: string;
    age: number;
}

function savePerson (person: Person) : void {
    console.log('Saving ', person);
}

const p : Person {
    firstName = "John",
    secondName = "Smith",
    age = 25;
};
```

На практике, interface часто используется для того, чтобы передать несколько полей в качестве результата выполнения функции.

Заметим, что для интерфейса нельзя использовать ключевое слово **new** и мы не может получить тип интерфейса, используя **instanceof**.

На первый взгляд ключевые слова type и interface очень похожи.

## Структурная система типов vs номинальная система типов

В Java, который использует номинальную систему типов, два типа одинаковы, если имеют одинаковые имена, объявленные в одном и том же пространстве имён.

TypeScript использует структурную систему типов, т.е. два класса считаются одинаковыми, если у них одинаковая структура, даже если у них разное имя. Классы с одинаковой структурой можно присваивать друг другу.

## Пользовательские объединения типов

Распространенный подход - объединять несколько типов через перечисление, как возвращаемое значение и возвращать один из этих типов в зависимости от результатов выполнения операции. Предположим, что у нас есть вот такой код:

```ts
export class SearchAction {
    actionType = "SEARCH";

    constructor (readonly payload: {searchQuery: string}) {}
}

export class SearchSuccessAction {
    actionType = "SEARCH_SUCCESS";

    constructor (readonly payload: {searchResults: string[]}) {}
}

export class SearchFailedAction {
    actionType = "SEARCH_FAILED";
}

export type SearchActions = SearchAction | SearchSuccessAction | SearchFailedAction;
```

Определение `type SearchActions` и есть объединение типа.

Ещё один интересный термин - **размеченное объединение**. Подобные объединения имеют общее свойство - _дискриминант_. В зависимости от значения дискриминанта, вы можете выбрать выполнение разных действий. В приведённом выше примере, дискриминант - это actionType.

## Проверка наличия конкретного свойства в интерфейсе

Предположим, что у нас есть два интерфейса:

```ts
interface A { a: number };
interface B { b: string };
```

Мы моем проверить наличие поля в переданном значении:

```ts
function foo (x: A|B) {
    if ("a" in x) {
        return x.a;
    }
    return x.b;
}
```

## Зачем нужно ключевое слово unknown

Ключевое слово `unknown` имеет, приблизительно, такой же смысл, как и `any`, но требует проверки типа перед использованием переменной.

Ниже приведён пример, сгенерированный ChatGPT:

```ts
function processValue(value: unknown) {
    // You cannot directly use `value` without type checking
    // console.log(value.toFixed(2)); // Error: Object is of type 'unknown'

    if (typeof value === "number") {
        console.log(value.toFixed(2)); // This is safe
    } else if (typeof value === "string") {
        console.log(value.toUpperCase()); // This is also safe
    } else {
        console.log("Value is neither a number nor a string.");
    }
}

processValue(42);        // Outputs: "42.00"
processValue("hello");   // Outputs: "HELLO"
processValue(true);      // Outputs: "Value is neither a number nor a string."
```

При использовании `any` никаких проверок не требуется и такой код более опасный.

## Наследование классов

Указать на наследование от некоторого класса можно используя ключевое слово **extends**:

```ts
class Person {
    firtsName: string;
    lastName: string;
    age: number;
}

class Eployee extends Person {
    departament = '';
}
```

## static

В TypeScript может быть использовано ключевое слово **static**:

```ts
class Gangsta {
    static totalBullets = 100;
```

## Ограничение области видимости

В TypeScript используются директивы ограничения области видимости в стиле C\#.

Ниже приведена реализация singeton-а на TypeScript:

```ts
class AppState {
    counter = 0;
    private static instanceRef: AppState;
        
    private constructor() {}

    static getInstance: AppState {
        if (AppState.instanceRef === undefined) {
            AppState.instanceRef = new AppState();
        }

        return AppState.instanceRef;
    }
}
```

## Метод super() и ключевое слово super

Метод super() вызывается из конструктора производного класса (см. constructor()) для того, чтобы вызвать конструктор базового класса.

Ключевое слово super используется для вызова метода базового класса из метода производного класса. Потребность в этом возникает в случае наличия одноменного метода в базовом и производных классах.

## Абстрактные классы

TypeScript допускает создание абстрактных классов с частичной реализацией методов.

Допустим, мы хотим определить абстрактный класс Person:

```ts
abstract class Person {
    constructor(public name: string) {};

    changeAddress(newAddress: string) {
        console.log(`Changing address to ${new Address}`);
    }

    abstract increasePay(percent: number): void;
}
```

В приведённом выше примере, у класса Person есть реализованный конструктор и реализованный метод changeAddress(), но мы не сможем создать экземпляр этого класса, поскольку отсутствует реализация абстрактого метода increasePay().

Для того, чтобы создать объект, мы должны определить производный класс и определить у него метод increasePay():

```ts
class Employee extends Person {
    increasePay(percent: number) {
        console.log(`Increasing the salary of ${this.name} by ${percent}%`);
    }
}
```

Терминологически, про класс Person можно сказать, что он более **обобщён**, а о классе Employee, что он более **конкретен**.

Теперь мы можем создать экземпляр класса Employee.

## Перегрузка методов

В TypeScript поддерживается перегрузка методов, но поскольку в JavaScript такая возможность отсутствует, все перегрузки транспилируются в одну JavaScript-функцию, которая проверяет фактический набор параметров.

В целом, в приложениях на TypeScript довольно редко используется перегрузка методов.

Если мы хотим, что IntelliSense корректно показывал перегруженные методы класса, рекомендуется определять их в TypeScript с избыточностью. Например:

```ts
class ProductService {
    getProducts(): void;
    getProducts(id:number) void;
    getProducts(id?:number) {
        if (typeof id === 'number') {
            // ...
        }
        else
        {
            // ...
        }
    }
}
```

## Интерфейсы

"Если вам нужен пользовательский тип, включающий конструктор, используйте класс; в противном случае используйте интерфейс".

Пример определения интерфейсов:

```ts
interface Flyable {
    fly (howHigh: number);
    land();
}

interface Swimmable {
    swim(howFar: number);
}
```

Пример использования:

```ts
class Car implements MotorVehicle, Flyable, Swimmable {
    // Реализация функций всех интерфейсов
}
```

Обычно, однако, происходит расширение класса с использованием новых интерфейсов. Например:

```ts
class SecretServiceCar extends Car implements Flyable, Swimmable {
    // Реализация функций интерфейсов Flyable, Swimmable
}
```

Также мы можем расширить один интерфейс другим:

```ts
interface Flyable extends MotorVehicle {
    fly (howHigh: number);
    land();
}
```

Разработчики, практикующие объектно-ориентированный подход: "_Программируйсте через интерфейсы, а не через реализации_".

## Приватный конструктор

Приватный конструктор позволяет создать экземпляр класса, но не позволяет использовать этот класс в качестве базового, т.е. выполнять наследование из него.

## Использование enums

Парадигма использования такая же, как и в C++.

Однако можно использовать строчные перечисления:

```ts
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}
```

На такой enum похож пользовательский тип:

```ts
type Direction = 'Up' | 'Down' | 'Left' | 'Right';
```

В TypeScript существует различие между `enum` и `const enum`. При использовании ключевого слова const вместе с enum, в JavaScript-коде не сохраняется никакой информации об enum, т.е. код выглядит так, как будто используются "магические" константные значение, т.е. это усложнит чтение JavaScript-кода, хотя он станет компактнее и будет более эффективным. Если не предполагается, что программисты будут читать транспилированный код с TypeScript в JavaScript, то использование `const enum` кажется интересным решением.

## Обобщённый код на TypeScript

Пример использования обобщённого типа:

```ts
let lotteryNumbers: Array<number>;
```

Рекомендуется к прочтению [статья о структурной подтипизации](https://www.typescriptlang.org/docs/handbook/type-compatibility.html) в JavaScript. Это важно для понимания совместимости типов, которые могут быть использовании в обобщённых контейнерах данных. 

В качестве специализации мы можем указывать несколько разных типов, например:

```ts
const values: Array<string | number> = ["Joe", 123, 456];
```

Определить интерфейс с указанием специализации можно так:

```ts
interface Comparator<T> {
    compareTo(value: T): number;
}
```

Использование приведённого выше интерфейса:

```ts
class Rectangle implements Comparator<Rectangle> {
    compareTo(value: Rectangle): number {
        // Реализация алгоритма сравнения прямоугольников
    }
}

class Triangle implements Comparator<Triangle> {
    compareTo(value: Triangle): number {
        // Реализация алгоритма сравнения треугольников
    }
}
```

Можно выполнять наследование от обобщённого класса:

```ts
class A<T = any> {
    value: T;
}

class B extends A {
    // Никаких ошибок компилятора - всё легально
}
```

Альтернатива:

```ts
class A<T> {
    value: T;
}

class B extends A<any> {
    // Компилируется
}
```

В приведённом выше коде всё же лучше указывать на any, а конкретные типы, применимые в реализации конкретного производного класса.

## Лучшие Plug-Ins для Visual Studio Code

- ESLint
- Prettier
- Path Intellisense

Отличный onlne-редактор кода: [StackBlitz](https://stackblitz.com/)

## Портирование TypeScript с Node.js на Go

Чтобы избежать необходимости в сложных настройках окружения разработчика, на ранних стадиях жизненного цикла TypeScript, Microsoft использовался npm для установки компилятора TypeScript. Это означает, что TypeScript сам написан на JavaScript. Установка компилятора выглядела таким образом:

```shell
npm install -g typescript
tsc --version
```

Однако за прошедшие года TypeScript стал популярным языком программирования, на нём появилось много приложений и скорости компиляции стало не хватать для промышленных приложений. С целью устранить эту проблему, Microsoft переписывает компилятор TypeScript на Go (выпуск в 2025 году), что даст кратный рост производительности (до порядка).

## Что нравится в экспериментальном проекте

После добавления типизации, гораздо лучше стал работать IntelliSence и появилась возможность перейти на определение метода/функции по кнопке F12. Благодаря подробным комментариям, исследовать библиотеки гораздо проще, чем раньше.