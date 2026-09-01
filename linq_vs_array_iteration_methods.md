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

Т.е. в этой части, как будто бы, паритет между Blazor и React.
