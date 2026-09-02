# Linq vs array iteration methods

Одной из типовых задач программирования является преобразование данных из одной структуры данных в другую, более удобную для алгоритмической обработки. Предположим, что мы получили по сети JSON:

```json
"accounts": [
    {
        "key": "632",
        "customer": "1000299",
        "attributes": [
            {
                "key": "number",
                "value": "40702810738000083367"
            }
        ]
    },
    {
        "key": "633",
        "customer": "1000299",
        "attributes": [
            {
                "key": "number",
                "value": "40702810338000083369"
            }
        ]
    }
]
```

Для синхронизации полученных данных с данными из СУБД, может потребоваться использовать эту структуру таким образом, чтобы на верхнем уровне существовал список идентификаторов компаний (customer), к каждому элементу которого был бы привязан список кортежей (например), в которых идентификатор счёт (accounts.key) хранился бы вместе с номером счёта (value).

Написать такое предобразование на LINQ можно, например, так:

```csharp
var restruct = accounts
    .GroupBy(x => x.customer)
    .Select(g => new CustomerGroup(
        CustomerId: g.Key,
        Accounts: g
            .SelectMany(item =>
                item.attributes
                    .Where(attr => attr.key == "number")
                    .Select(attr => new CustomerAccount(
                        AccountKey: item.key,
                        Value: attr.value
                    ))
            )
            .ToList()
    ))
    .ToList();
```

В JavaScript есть **методы массивов**, которые также называют **функциями высшего порядка для работы с массивами**, которые могут помочь решить подобную задачу. Я имею ввиду функции: map(), filter(), reduce(), groupBy(), find(), и т.д.

```javascript
const restruct = Array.from(
  accounts.groupBy(x => x.customer)
).map(([customerId, group]) => ({
  CustomerId: customerId,
  Accounts: group
    .flatMap(item =>
      item.attributes
        .filter(attr => attr.key === 'number')
        .map(attr => ({
          AccountKey: item.key,
          Value: attr.value
        }))
    )
}));
```

Т.е. в этой части, как будто бы, паритет между Blazor и React. Хотя небольшое преимущество всё-таки и C#, за счёт того, что LINQ более зрелая технология и более универсальная - запросы можно формировать не только к контейнерам, но и к СУБД.

Статические методы Object.groupBy() и Map.groupBy(), которые решают задачу группировки, появились в ECMAScript 2024. До этого использовался reduce().

## Как работает GroupBy() в LINQ

Метод разбивает исходную коллекцию на группы так, что в одну группу попадают элементы с одинаковым значением ключа группировки. У каждой группы есть:

- Key — значение, по которому сгруппировали
- сама группа — это перечислимая коллекция элементов (IEnumerable<TElement>), которую можно перебирать в цикле

Синтаксис:

```csharp
var groups = source.GroupBy(x => x.Property);
```

В Query Syntax запрос может быть написан следующим образом (группировка по полю "Company"):

```csharp
var companies = from p in people
                group p by p.Company into g
                select g;
```

В оригинальном коде используется следующее преобразование:

```csharp
var restruct = accounts
    .GroupBy(x => x.customer)
    .Select(g => new CustomerGroup(
        CustomerId: g.Key,
        Accounts: g.....
    ))
    .ToList();
```

Результатом группировки будет набор записей типа CustomerGroup:

```csharp
public record CustomerAccount(string AccountKey, string Value);
public record CustomerGroup(string CustomerId, List<CustomerAccount> Accounts);
```

Для формирования списка счётов (`List<CustomerAccount>`) используется конструкция:

```csharp
g.SelectMany(item =>
    item.attributes
        .Where(attr => attr.key == "number")
        .Select(attr => new CustomerAccount(
            AccountKey: item.key,
            Value: attr.value
        ))
)
.ToList()
```

В этой конструкции будут отобраны блоки "attributes" в которых будут отобраны только те пары key/value, в которых "key" будет равен значению "number":

```json
"attributes": [
    {
        "key": "number",
        "value": "40702810738000083367"
    }
]
```

Из найденных записей будут созданы записи типа CustomerAccount, у которого значение поля "AccountKey" будет соответствовать accounts.key (а не attributes.key), а значение поля "Value" будет соответствовать attributes.value. Т.е. в одной записи мы может объединить данные из разных уровней JSON-документа.
