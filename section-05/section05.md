# Rendering Lists & Conditional Content

## 목차

- [Rendering Lists of Data](#데이터의-렌더링-목록)
- [Using Stateful Lists](#State-저장-목록-사용하기)

## 데이터의 렌더링 목록

- 지금까지는 `expense` 데이터 리스트를 받아왔지만, 이를 정적으로 렌더링했을 뿐 동적으로 렌더링하지는 못했다.
- 예시를 보자. 현재의 `Expense.js` 파일에서는 `App`에서 props로 받아온 `expenses` 데이터(`props.items`)를 하드코딩으로 현재 지출 목록을 렌더링 하고 있다. 그리고 JSX 코드에 개별적으로 `expenses` 데이터 내부의 요소들을 하나하나 추가해야만 했다. (정적 렌더링)

```js
<ExpenseItem
    title={props.items[0].title}
    amount={props.items[0].amount}
    date={props.items[0].date}
/>
<ExpenseItem
    title={props.items[1].title}
    amount={props.items[1].amount}
    date={props.items[1].date}
/>
```

- 사실 대부분의 웹앱에서는 얼마나 많은 데이터 아이템을 렌더링할 것인지 미리 알 수 없을 것이다. 예를 들면, 사용자가 얼마나 많은 지출을 추가할지도 알 수 없고 필터로 추가한 연도에서 특정 연도가 선택됐을 때 얼마나 많은 데이터 아이템이 필터링되어 나타날지 미리 알 수 없다는 이야기다. 이런 한계를 극복하기 위해 우리는 데이터를 동적으로 렌더링해야만 한다.

### 동적 렌더링

- 동적 렌더링은 많은 프로젝트와 어플리케이션에서 사용하는 방법이며, React를 사용하면서 더욱 간단해진다.
- 우리가 작성한 `Expense.js`의 JSX 코드 내에서 `expenses` 데이터(`props.items`)를 정적으로 렌더링한 부분을 다시 동적으로 렌더링할 수 있도록 해보자.

```js
<Expense items={expenses} />
```

- 우리는 `App.js` 파일에서 `expenses` 데이터를 `items` 라는 이름으로 `Expense` 컴포넌트에 pass down 해주었다. `Expense` 컴포넌트 내에서 이 `expenses` 데이터 목록을 props를 통해 얻을 수 있다는 이야기다.

```js
<ExpenseItem
    title={props.items[0].title}
    amount={props.items[0].amount}
    date={props.items[0].date}
/>
<ExpenseItem
    title={props.items[1].title}
    amount={props.items[1].amount}
    date={props.items[1].date}
/>
```

- 여기서 하드 코딩으로 렌더링해주었던 이 JSX 코드를 배열 메소드를 통해 동적으로 렌더링해주자. 배열에 있는 한 요소 당 하나의 `ExpenseItem` 컴포넌트를 렌더링할 것이다.

```js
{
  props.items;
}
```

- 먼저 `ExpenseItem` 컴포넌트가 들어갔던 위치에 단일 중괄호를 사용해서 JavaScript 코드를 작성할 수 있도록 해주자. `expenses` 데이터(`props.items`) 배열에 도달하면 여기서 모든 요소에 `ExpenseItem`를 생성하고자 한다. 이를 위해 props 아이템에 접근할 수 있게 된다.

```js
{
  props.items.map(() => );
}
```

- 그리고 `expenses` 데이터(`props.items`) 배열을 이용해서 기본 JavaScript에 내장된 Array 메소드인 `map()`을 사용해준다. `map()`은 원본 배열을 기반해서 새로운 배열을 생성하고 이 새로운 배열 안에 원본 배열에 기반한 요소들을 변환하여 넣어주는 메소드이다.
- [MDN 문서 참조: Array.prototype.map()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```js
{
  props.items.map((expense) => <ExpenseItem />);
}
```

- JSX 요소 배열을 JSX 코드의 일부로 갖게 됐을 떄 React는 이런 요소들을 자동으로 나란히 렌더링해준다. 원본 배열인 `props.items` 데이터를 기반으로 `expense` 라는 이름의 요소를 인자로 받아 새로운 배열과 그 내부 요소를 사용할 `<ExpenseItem />` 컴포넌트를 추가했다. 이제 원본 배열 요소의 갯수에 따라 `<ExpenseItem />`가 생성될 것이다.

```js
{
  props.items.map((expense) => (
    <ExpenseItem
      title={expense.title}
      amount={expense.amount}
      date={expense.date}
    />
  ));
}
```

- `props.items`에서 각각 받던 `expenses` 데이터의 요소들을 `map()` 메소드로 분해하고 `expense`라는 이름의 새로운 배열의 요소(인자)를 사용하여 사용할 원본 데이터를 추출한뒤 `title`과 `amount`, `date`에 props down 해준다. 다시 저장하고 라이브 서버를 확인해보면 이전에 하드코딩했던 것과 동일한 화면을 출력하는 것을 확인할 수 있다.

</br>

## State 저장 목록 사용하기

- `ExpenseForm`에서 입력한 값들을 submit 할 때 기존의 `expense` 데이터 목록에 어떻게 이 값들을 추가할 수 있을까?
- 먼저 원본 데이터를 가지고 있는 `App.js` 파일로 가서 원본 데이터인 `expenses` 배열의 이름을 임의로 변경해준다. 그리고 `App.js` 파일에서 원본 데이터인 `DUMMY_EXPENSES`를 추출할 것이기에 `App` 컴포넌트 함수 밖으로 빼준다. 이 원본 데이터는 우리가 추가할 상태(state)를 초기화하는데 사용되는 더미 데이터가 될 것이다.

```js
const DUMMY_EXPENSES = [{...원본 데이터 목록}];

function App() {
  const [expenses, setExpenses] = useState(DUMMY_EXPENSES);
  ...
}
```

- 앞서 학습했던 것처럼 `DUMMY_EXPENSES`라는 변수로 저장된 원본 데이터는 React가 동적으로 변화시킬 수 없기 때문에 상태(state)를 사용해야 한다. 그리고 `expenses` 라는 상태(state)는 원본 배열인 `DUMMY_EXPENSES`를 초기값으로 받게 된다.
- 우리에게는 `App.js`에서는 `ExpenseForm`에서 입력했던 데이터들을 pass up 해서 받아온 `addExpenseHandler` 함수도 있다.

```js
const addExpenseHandler = (expense) => {
  console.log(expense);
};
```

- 이제 원본 데이터인 `DUMMY_EXPENSES`를 상태(state)로써 초기화한 `expenses`와 새로 입력한 데이터 값들을 받아오는 `addExpenseHandler` 함수를 이용해서 동적으로 데이터를 추가해보자.

```js
const addExpenseHandler = (expense) => {
  setExpenses([...prevState, expense]);
};
```

- 상태(state) 업데이트 함수인 `setExpenses` 안에 새로운 배열을 생성하고, 이 안에 "spread operator"를 이용하여 `expenses` 라는 상태(state)값을 복사해서 넣어준 뒤 `ExpenseForm`에서 입력한 값이자 인자인 `expense`를 새로운 배열의 아이템으로 넣어주었다.
- 하지만, 상태(state)를 앞서 작성한 방식으로 업데이트하게 되면 안정적으로 값을 받아올 수 없을 가능성이 높다. 이전 상태(state)에 의존 하거나, 이 상태(state)의 이전 snapshot에 의존하여 상태(state)를 업데이트 해야 한다면, 앞서 사용한 방법 대신에 상태(state) 업데이트 함수로 특별한 함수 폼을 사용해야 한다. 즉, 상태(state) 업데이트 함수를 직접적으로 넣어주는 대신 상태(state) 업데이트 함수에서 함수를 인수로서 pass 하면 그 함수가 자동으로 가장 최신 상태의 snapshot을 받을 수 있는 방법(특별한 함수 폼)을 사용해야 한다는 의미이다. 이 방법을 사용하면 React에 의해 자동으로 이전의 상태(state) 즉 원본 데이터인 `expenses` 값을 얻을 수 있고 새로운 배열도 return할 수 있게 된다.

```js
const addExpenseHandler = (expense) => {
  setExpenses((prevState) => {
    return [...prevState, expense];
  });
};
```

- 이것이 바로, 이전의 snapshot에 기반을 두면서도 안정적으로 상태(state)를 업데이트하는 방법이다.
- 이렇게 `addExpenseHandler` 함수 내부에서 `expenses` 라는 상태(state)를 이용하여 데이터를 보다 안전하게 업데이트 해주었다. 이제 업데이트된 `expenses` 데이터를 기반으로 지출 목록을 렌더링해주는 `<Expense>` 컴포넌트에 pass down 해준다.

```js
<Expense items={expenses} />
```

- 이제 `ExpenseForm`에서 입력한 값들을 submit 하면 동적으로 지출 목록이 추가되며 업데이트되는 것을 확인할 수 있다. 이것이 진정으로 데이터를 동적으로 출력하는 방법이다.

</br>
