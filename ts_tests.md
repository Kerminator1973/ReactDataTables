# Тестовые упражнения из книги

Решение из книги:

```ts
class Dog {
    constructor(readonly name: string) {};

    sayHello() : string {
        return 'Dog says hello!';
    }
}

class Fish {
    constructor(readonly name: string) {};

    dive(howDeep: number) : string {
        return `Diving ${howDeep} feet`;
    }
}

type Pet = Dog | Fish;

function talkToPet(pet: Pet) : string | undefined {
    // Осуществляет защиту типа
    if (pet instanceof Dog) {
        return pet.sayHello();
    } else if (pet instanceof Fish) {
        return 'Fish cannot talk, sorry';
    }
}

const myDog = new Dog('Sammy');
const myFish = new Fish('Marry');

console.log(talkToPet(myDog));
console.log(talkToPet(myFish));
```

Если вызвать команду tsc передав в качестве параметра имя ts-файла, то будет успешно сгенерирован JavaScript-файл, в котором не будет использоваться ключевое слово **class**, но будут применен механизм prototype из JavaScript.
