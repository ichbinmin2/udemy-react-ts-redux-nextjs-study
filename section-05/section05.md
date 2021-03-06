# Rendering Lists & Conditional Content

## 목차

- [Rendering Lists of Data](#데이터의-렌더링-목록)
- [Using Stateful Lists](#State-저장-목록-사용하기)
- [Understanding "Keys"](#keys-이해하기)
- [Practice | Working with Lists](#Lists-다루기)
- [Outputting Conditional Content](#조건부-내용-출력하기)
- [Adding Conditional Return Statements](#조건-명령문-반환-추가하기)
- [Practice | Conditional Content](#조건부-내용-다루기)
- [Demo App: Adding a Chart](#데모앱-차트-추가하기)
- [Adding Dynamic Styles](#동적-스타일-추가하기)
- [Wrap Up & Next Steps](#마무리-및-다음-단계)

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

## keys 이해하기

- 지금까지 `Expense` 컴포넌트에서 우리가 받아온 `props.items`를 이용하여 `ExpenseItem`를 매핑해줬다. 하지만 우리는 console에서 이런 경고문을 마주하게 된다.

![console-warning](https://user-images.githubusercontent.com/53133662/157028547-e43b5646-8d77-425d-8611-77f43c5de4ef.png)

### 제대로 작동하고 있음에도 왜 이런 `key` 경고문을 받은 것일까?

- 우리는 현재 `ExpenseForm` 컴포넌트에서 입력한 값을 토대로 `ExpenseItem`을 추가할 수 있도록 작성했다. 여기서 만약 하나의 아이템을 새로 추가하면 React는 새로운 아이템을 기존 데이터 목록의 마지막으로 렌더링하고 모든 아이템을 업데이트한 뒤 그 콘텐츠를 대체하며 이때 또 다시 나의 데이터 배열 안에 있는 아이템 순서와 짝지어 주는 순서로 진행된다. 이런 현상이 일어나는 이유는 React 에서는 모든 아이템들이 특별할 것 없이 전부 다 비슷해보이기 때문이다. 물론 결과만 봤을 때엔 정상적으로 작동하는 것은 맞으나, 모든 아이템을 다시 찾아서 업데이트해야 하기 때문에 성능 면에서는 확실히 떨어진다고 볼 수 있을 것이다. 그리고 이러한 잠재적인 성능 이슈로 인하여 버그로 이어질 가능성이 높아진다.
- React는 데이터 목록을 렌더링 할 때 특별한 개념을 가진다. 이 개념을 통해 React가 데이터 목록을 효과적으로 업데이트하고 렌더링할 수 있으며, 혹여나 발생할 수 있는 성능 손실의 가능성이나 버그의 가능성으로부터 안전하게 보호받을 수 있도록 해준다. 그리고 우리가 `key` 경고문을 받은데에는 이런 개념을 위한 규칙을 지켜주지 않았기 때문이다.
- React는 현재 배열의 길이를 확인하고 이미 렌더링한 아이템의 갯수를 확인한다. 즉, React에서는 개별 아이템이 전부 다 똑같아 보인다는 이야기다. 따라서 새로운 아이템이 추가되어도 React에서는 이를 따로 판별하지 못하게 되는 것이다. 그리고 현재까지 우리는 새로운 아이템을 추가했을 때 React에 어떤 방법을 통해서도 새로운 아이템이 추가되었다고 알려주지 않았기 때문에 이런 `key` 경고문을 받게 된 것이다.

```js
props.items.map((expense) => (
  <ExpenseItem
    title={expense.title}
    amount={expense.amount}
    date={expense.date}
  />
));
```

- 이를 해결하기 위해서는 기존의 아이템 목록을 매핑하여 출력하던 위치에서 작업해주면 된다. `ExpenseItem`에 특별한 prop(`key prop`) 을 더해주자. 이를 위해서는 데이터 목록 아이템 당 개별 값을 설정해줘야 한다.
  > `key prop`은 어떤 컴포넌트에나 추가할 수 있는 prop 이며, HTML 요소에 추가할 수도 있다. 이런 `key prop`을 추가하면서 React가 개별 아이템을 식별할 수 있게 된다.

```js
props.items.map((expense) => (
  <ExpenseItem
    key={expense.id}
    title={expense.title}
    amount={expense.amount}
    date={expense.date}
  />
));
```

- `<ExpenseItem>` 아이템에 `key prop`을 추가함으로써 이제 우리는 더이상 `key` 관련 경고문을 받지 않게 되었다. 또한, React는 더이상 데이터 목록 배열의 길이만을 보는 것이 아니라, 아이템의 '위치'까지 고려할 것이다. 이렇게 우리가 가지고 있는 데이터 배열에는 각각의 아이템이 개별 `id` 값이 있으므로, 이것을 이용하여 React에 개별 아이템을 식별할 수 있도록 도와주도록 하자.

### 만약 사용해야 하는 데이터 목록에 `id` 값이 없을 땐 어떻게 해야할까?

- `map()` 메소드에서 두 번째 인수를 사용할 수도 있다.
  > arr.map(callback(currentValue[, index[, array]])[, thisArg])

```js
{
  props.items.map((expense, index) => (
    <ExpenseItem
      key={index}
      title={expense.title}
      amount={expense.amount}
      date={expense.date}
    />
  ));
}
```

- 하지만 `index`를 사용하는 것은 그다지 권장되지 않는다. 왜냐하면 특정 아이템의 `index`는 항상 동일하며, 배열 아이템 콘텐츠에 직접적으로 첨부되지 않기 때문이다. 이 때문에 자치 잘못하면 버그를 만날 가능성이 높아질 수 밖에 없게 된다.

### 결론

- 데이터 아이템 목록을 `map()` 할 때는 항상 `key`를 추가해야 한다. `key prop`를 추가하면서 React는 더이상 데이터 목록 배열의 길이만을 보는 것이 아니라, 아이템의 '위치'까지 고려하도록 도와줄 수 있으며, 이를 통해 데이터 아이템 목록을 효과적으로 업데이트하고 렌더링하며 또 혹여나 발생할 수 있는 성능 손실의 가능성이나 버그의 가능성으로부터 안전하게 보호받을 수 있게 된다.

</br>

## Lists 다루기

- 그간 우리는 `<Expense>` 컴포넌트 함수 내에서 `props.items`로 가져온 값에 따라 `<ExpenseItem>`을 매핑해주어 화면에 출력할 수 있도록 하였다. 이제는 `<ExpensesFilter>`에서 옵션으로 선택하여 가져온 `filteredYear` 상태(state)에 따라 `expense`(`props.items`) 값을 가져올 수 있도록 필터링 해주고자 한다.

```js
const filteredExpenses = props.items.filter((expense) => {});
```

- 먼저 `props.items`를 이용하여 필터링 해줄 수 있는 함수식 `filteredExpenses`을 작성했다. `filter()` 메소드로 어떤 조건에 맞는 값만 반환할 수 있도록 할 예정이다.

```js
const filteredExpenses = props.items.filter((expense) => {
  return expense.date.getFullYear().toString();
});
```

- 날짜를 불러오는 객체에서는 `getFullYear()` 메소드를 사용하여 이 날짜 객체 안에서 '연도'만 불러올 수 있다. 연도는 number 타입으로 반환되기 떄문에 문자열로 사용하기 위해 `toString` 메소드로 문자열로 변환하는 작업이 추가적으로 필요했다.

```js
const filteredExpenses = props.items.filter((expense) => {
  return expense.date.getFullYear().toString() === filteredYear;
});
```

- `<ExpensesFilter>`에서 가져온 `filteredYear` 상태(state)와 비교하여 해당 상태(state)와 동일한 `props.items`(`expense`)만 반환해주도록 작업해주었다.

```js
{
  filteredExpenses.map((expense) => (
    <ExpenseItem
      key={expense.id}
      title={expense.title}
      amount={expense.amount}
      date={expense.date}
    />
  ));
}
```

- 마지막으로, 필터링한 `filteredExpenses`으로 매핑해주면 `filteredYear` 상태(state)에 해당하는 `ExpenseItem`만 출력된다.
- [MDN 문서 참조: Date.prototype.getFullYear()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear)
- [MDN 문서 참조: Object.prototype.toString()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

</br>

## 조건부 내용 출력하기

- 조건부 컨텐츠란 다른 조건 하에 다른 출력값을 렌더링하는 것이다. 예를 들자면, A나 B나 C 중에 조건에 맞는 것만 렌더링할 수 있는 것을 말한다.

```js
{
  filteredExpenses.map((expense) => (
    <ExpenseItem
      key={expense.id}
      title={expense.title}
      amount={expense.amount}
      date={expense.date}
    />
}
```

- 앞서, `filteredYear`를 선택할 때마다 `filteredYear` 상태(state)에 해당하는`ExpenseItem`만 출력되도록 작업해주었다. 지금까지 `ExpenseItem` 목록을 렌더링 하면서 만약 필터링 된 `expense` 가 공백이라면, 아무 것도 렌더링하지 않도록 한 것이다. 만약 `filteredYear` 상태(state)에 해당하는 `ExpenseItem`이 없을 때에 어떤 렌더링 대신 우리가 선택한 필터에서 item이 없다는 메세지를 사용자에게 전달하고 싶다면 어떻게 해야할까?

### 조건부 렌더링 : 삼항 연산자를 사용하기

```js
{
  filteredExpenses.length === 0 ? (
    <p>No Expense Found</p>
  ) : (
    filteredExpenses.map((expense) => (
      <ExpenseItem
        key={expense.id}
        title={expense.title}
        amount={expense.amount}
        date={expense.date}
      />
    ))
  );
}
```

- [MDN 문서 참조: 삼항 조건 연산자](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
- 조건부 렌더링을 위해 간단하게 삼항 연산자를 사용했다. `length`를 이용해서 필터링된 데이터 배열인 `filteredExpenses`의 길이를 구하고, 0과 같을 때(값이 없을 때)는 `<p>No Expense Found</p>`를 출력하고 아닐 때는 기존의 데이터 아이템을 렌더링하도록 해주었다. 이제 우리가 선택한 필터에 데이터 아이템이 없을 때마다 "No Expense Found"라는 메세지를 출력할 수 있게 되었다.

  > JSX 코드의 `{}` 안에서는 `if` 문이나, `for`문 같은 긴 statement가 허용되지 않는다.

- 물론 길게 작성되어 가독성이 떨어지는 삼항연산자 보다 가독성 있게 작성할 수도 있다.

### 조건부 렌더링 : AND Operator(&&)

```js
{
  filteredExpenses.length === 0 && <p>No Expense Found</p>;
}
{
  filteredExpenses.length > 0 &&
    filteredExpenses.map((expense) => (
      <ExpenseItem
        key={expense.id}
        title={expense.title}
        amount={expense.amount}
        date={expense.date}
      />
    ));
}
```

- [MDN 문서 참조: Logical AND (&&)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)
- AND Operator(&&)를 사용하여 조건이 만족했을 때만 렌더링 되도록 해주었다. 기본적으로 AND Operator(&&)에서 바로 뒤에 오는 값은 AND Operator(&&) 앞에서 작성한 조건이 만족했을 때(true일 때) 보여주고 싶은 결과의 값으로 설정한다. 이 또한, `length`를 이용해서 필터링된 데이터 배열인 `filteredExpenses`의 길이를 구하고, 0과 같을 때(값이 없을 때)는 `<p>No Expense Found</p>`가 오도록 설정해주었다. 그리고 한번 더 `{}`를 다시 사용해서 앞서 삼항연산자를 사용했을 때처럼 0보다 클 때(값이 있을 때) 역시 기존의 필터링 된 데이터 아이템을 렌더링하도록 작성해주었다.
- 이처럼 길이가 긴 삼항연산자 대신 AND Operator(&&)를 사용하여 두개의 독립 수식으로 나눠 가독성을 높이는 방법을 사용할 수 있다. 물론, 두개의 독립 수식으로 나눈다고 해서 삼항연산자보다 성능이 떨어지거나 하지는 않는다.

### JSX 코드 내에서 사용되는 조건식 렌더링의 대안

- 하지만 이런 식조차도 JSX 코드 내에서는 과한 로직일 수도 있을 것이다. 물론, JSX 코드 내에서 조건식 렌더링을 사용하지 않고도 동일한 역할을 수행하는 다른 대안도 있기 마련이다.

```js
let expensesContent = <p>No Expense Found</p>;

return (
    ...
    {filteredExpenses.length === 0 && expensesContent}
)
```

- 이렇게 변수를 설정하고 기본 값(메세지)를 할당한뒤 JSX 컨텐츠를 변수 안에 저장함으로써 JSX 코드 내의 로직을 조금 더 간단하게 작성할 수도 있다. 또한, 반환도 가능하다. 이런 방식은 값을 다루는 곳이라면 어디서든 사용할 수 있다. 즉, JSX 콘텐츠를 return 전에 변수 내에 저장할 수 있다는 이야기다. 이렇게 미리 변수에 기본 값을 할당해놓고 사용한다면, 해당 컴포넌트 함수가 return 하기 전에 미리 편집하여 사용할 수도 있다.

```js
let expensesContent = <p>No Expense Found</p>;

if (filteredExpenses.length > 0) {
  expensesContent = filteredExpenses.map((expense) => (
    <ExpenseItem
      key={expense.id}
      title={expense.title}
      amount={expense.amount}
      date={expense.date}
    />
  ));
}
```

- 기존에 JSX 코드 내에서 AND Operator(&&)를 사용하여 작성했던 로직을 모두 return 전에 변수 값으로 할당하였다. 만약 `filteredExpenses.length`가 0보다 크다면 `filteredExpenses`으로 매핑한 `ExpenseItem` 컴포넌트가 렌더링되어 `expensesContent`로 저장될 수 있도록 해주었다.

```js

return (
  ...
      {expensesContent}
  ...
);

```

- AND Operator(&&)를 사용하여 작성했던 로직을 모두 지워주고, `expensesContent` 값만 point 해주었다.
- 이 `expensesContent` 변수는 `<p>No Expense Found</p>`나 JSX 요소 배열(`filteredExpenses.length > 0`을 만족시켰을 때 렌더링 되는 JSX 코드 로직) 전부 렌더링 가능하므로 JSX 코드 내에서 모두 쓰일 수 있게 된다. 이로써 return 되는 JSX 코드 내에서 작성했을 때보다 가독성이 높아졌음을 확인할 수 있다.

</br>

## 조건 명령문 반환 추가하기

```js
let expensesContent = <p>No Expense Found</p>;
if (filteredExpenses.length > 0) {
  expensesContent = filteredExpenses.map((expense) => (
    <ExpenseItem
      key={expense.id}
      title={expense.title}
      amount={expense.amount}
      date={expense.date}
    />
  ));
}

return (
  ...
      {expensesContent}
  ...
);
```

- 앞에서 작성한 로직은 `<Expense>` 컴포넌트에서 모두 작업해주었지만, `expensesContent` 구현 부분을 새로운 컴포넌트로 분리하고 `<Expense>` 컴포넌트의 길이를 조금 더 간결하게 작성하고자 한다.
- 조건식 렌더링으로 구현한 `expensesContent` 로직들을 전부 복사해서 새로운 컴포넌트인 `<ExpensesList>`로 옮겨준다.

```js
import ExpenseItem from "./ExpenseItem";

const ExpensesList = (props) => {
  let expensesContent = <p>No Expense Found</p>;

  if (filteredExpenses.length > 0) {
    expensesContent = filteredExpenses.map((expense) => (
      <ExpenseItem
        key={expense.id}
        title={expense.title}
        amount={expense.amount}
        date={expense.date}
      />
    ));
  }

  return <></>;
};
```

- `filteredExpenses` 상태(state)는 `<Expense>` 컴포넌트에서 관리되고 있으므로, `<Expense>` 컴포넌트에서 `props`로 직접 받아올 수 있도록 할 예정이다. 여기서 `<ExpenseItem>` 컴포넌트도 출력되므로 import 해온다.

```js
<ExpensesList items={filteredExpenses} />
```

- `<Expense>` 컴포넌트에서 `<ExpensesList>` 컴포넌트를 출력하도록 import하고 `filteredExpenses` 상태(state)를 `items`이란 이름의 `props`으로 pass down 해준다.

```js
if (props.items.length > 0) {
  expensesContent = props.items.map((expense) => (
    <ExpenseItem
      key={expense.id}
      title={expense.title}
      amount={expense.amount}
      date={expense.date}
    />
  ));
}
```

- 기존에 `filteredExpenses`로 받아왔던 값을 전부 `props.items`로 수정해준다.

```js
return (
  <ul className="expenses-list">
    {props.items.map((expense) => (
      <ExpenseItem
        key={expense.id}
        title={expense.title}
        amount={expense.amount}
        date={expense.date}
      />
    ))}
  </ul>
);
```

- `if check`를 해주기 위해 `props.items`으로 매핑한 JSX 코드 로직을 렌더링할 수 있도록 return 값에 그대로 넣어주었다.

```js
if (props.items.length === 0) {
  return;
}
```

- 만약 데이터 아이템이 없을 떄(0과 같을 때) 특정한 JSX 코드를 반환하도록 설정해주었다. (왜냐하면 아직까진 그것이 조건부 콘텐츠를 다루는 또 다른 방법이기 때문이다.) 만약 컴포넌트 return 값이 다른 조건을 기준으로 아예 달라진다면 이러한 접근법을 사용할 수 있다.
- 이러한 `if check` 방식은, 혹여나 데이터가 손실되었을 때 전체 JSX 콘텐츠가 변한다면 다른 JSX 코드 블록을 반환하도록 설정할 수 있게 된다.

```js
if (props.items.length === 0) {
  return <h2 className="expenses-list__fallback">Found no expenses.</h2>;
}
```

- 만약(`if`) `ExpensesList`가 `props.items`이 없을 때 `<h2>` 태그로 "Found no expenses."을 렌더링할 수 있도록 설정해주었다. 이제 이전과 동일한 과정에 따라 데이터 리스트가 없을 때마다 "Found no expenses."이 출력되는 것을 확인할 수 있다.

### 추가 수정사항

```js
<ul className="expenses-list">
  {props.items.map((expense) => (
    <ExpenseItem
      key={expense.id}
      title={expense.title}
      amount={expense.amount}
      date={expense.date}
    />
  ))}
</ul>
```

- `ExpensesList` 컴포넌트 JSX 로직 내에서 `ExpenseItem` 컴포넌트를 감싸고 있는 태그가 `<ul>`이므로 `ExpenseItem` 컴포넌트를 `<li>` 태그로 감싸줄 수 있도록 `ExpenseItem` 컴포넌트의 JSX 로직을 수정한다.

```js
<li>
  <Card className="expense-item">
    <ExpenseDate date={props.date} />
    ...
  </Card>
</li>
```

- 이로써 의미론적인(Semantics) 코드를 작성할 수 있게 되었다.
- [MDN 문서 참조: Semantics](https://developer.mozilla.org/ko/docs/Glossary/Semantics)

</br>

## 데모앱 차트 추가하기

- chart 기능을 추가하기 위해 `Chart`와 `ChartBar` 컴포넌트를 추가했다. `Chart`에서는 `ChatBar`를 import 하여 JSX 블록에서 렌더링해줄 것이다.

```js
import ChartBar from "./ChartBar";

const Chart = (props) => {
  return <div className="chart"></div>;
};

export default Chart;
```

- 만약 `Chart` 컴포넌트가 어플리케이션 내부 어딘가에서 사용된다고 할 때, `Chart` 컴포넌트는 어떤 데이터를 point 할 예정이기 때문에, `props`로 `ChatBar`의 요소들을 렌더링하기 위한 준비를 한다. 그리고 `Chart` 컴포넌트에서 얼마나 많은 데이터를 point 사용할지 또 어떤 값을 렌더링할 것인지 결정할 수 있기 때문에, point 될 데이터의 배열을 가지고 모든 데이터를 `ChatBar` 컴포넌트에 매핑하여 출력할 것이다.

```js
<div className="chart">
  {props.dataPoints.map((dataPoint) => (
    <ChartBar />
  ))}
</div>
```

- 아직 `Chart` 컴포넌트에서 사용할 데이터가 존재하지 않기 때문에, 임의로 이름을 설정하여 `map()`으로 `ChartBar` 컴포넌트를 출력하는 로직을 작성했다. 모든 개별 데이터를 `dataPoint`로 명명하고 이것을 이용하여 `ChartBar` 컴포넌트 내부로 맵핑할 것이다. 이제 `ChartBar` 컴포넌트는 point되는 데이터(`props.dataPoints`) 갯수와 동일한 갯수로 생성할 수 있게 되었다. 또한, 우리는 데이터를 `ChartBar`로 pass 해서 어떻게 렌더링될 것인지(어떤 데이터 추출 값이 렌더링 될 것인지)를 컨트롤할 수 있게 되었다.

```js
{
  props.dataPoints.map((dataPoint) => (
    <ChartBar
      key={dataPoint.label}
      value={dataPoint.value}
      maxValue={null}
      label={dataPoint.label}
    />
  ));
}
```

- `ChartBar` 컴포넌트 내부에서 필요한 데이터 요소들을 추출하여 하나하나 설정해주었다. 먼저, React가 고유식별자를 통해서 데이터 목록의 순서를 확인하고 효과적으로 렌더링할 수 있도록 `key` 값으로 `dataPoint.label`을 달아주었다. 해당 point되는 데이터에 `id` 값이 있다면 이것으로 사용해도 되지만, `dataPoint.label`이 고유의 값을 가졌다면 이것을 사용해도 되기에 `key` 값으로 `dataPoint.label`을 설정해주었다. 그리고 모든 `ChartBar`는 `value`를 구상하며 이는 전체 `Chart`의 최대값과 관련이 있기 때문에 `maxValue`를 설정해준다. `maxValue`는 고유값이며 point된 데이터에서 가져온 요소가 아니기 때문에 임의로 `null` 값으로 지정하여 비워주었다.

</br>

## 동적 스타일 추가하기

- 이제 `ChartBar` 컴포넌트에 동적으로 스타일을 추가하고자 한다. 먼저 미리 JSX 코드를 마크업한 `ChartBar` 컴포넌트를 확인해보자.

```js
<div className="chart-bar">
  <div className="chart-bar__inner">
    <div className="chart-bar__fill"></div>
  </div>
  <div className="chart-bar__label">{props.label}</div>
</div>
```

- `chart-bar__fill`라는 className을 가진 `div`는 차트 바가 채워지려면 얼마나 필요한지 알려주는 데 필요한 요소이다.

```CSS
.chart-bar__fill {
  background-color: #4826b9;
  width: 100%;
  transition: all 0.3s ease-out;
}
```

- `.chart-bar__fill`가 가진 스타일 값을 확인해보면 배경색을 정의하고 있다. 하지만 앞서 이야기한 스타일(차트 바가 채워지려면 얼마나 필요한지)을 구현하기 위해서는 중요한 한가지 요소가 빠져있다. 바로 "채워진 차트 바의 높이" 값이다.

```CSS
.chart-bar__inner {
  height: 100%;
  ...;
}
```

- 전체 차트 바의 스타일을 담당하고 있는 `.chart-bar__inner`를 확인해보면 부모 컨테이너(`Chart.js`)의 "10rem"에 따른 높이 값("100%")으로 설정되어 있다.
- 하지만 바를 얼마나 채울 수 있는지는 우리가 받는 데이터에 따라 달라져야 할 것이다. 즉, 데이터 값(여기서는 prop으로 받은 `value`)에 따라 영향을 받는다는 의미이다. 왜냐하면 우리는 앞서 `ChartBar` 컴포넌트에 데이터 요소들을 추출해서 넣어줄 때 최대값(여기서는 prop으로 받은 `maxValue`)과 관련이 있는 값을 넣어서 채워주기로 목표했기 때문이다. 따라서 만약 전체 Chart의 최대값(`maxValue`)이 100이고 특정 `ChartBar`의 값(`value`)이 50이라면 `ChartBar`의 높이를 50%까지 채울 수 있게 되는 것이다.
- 그러므로, `ChartBar` 컴포넌트에서 `ChartBar`가 얼마나 채워질 것인지를 계산해야 하는 로직이 필요하다.

### `ChartBar`의 높이 계산하기

```js
let barFillHeight = "0%";

if (props.maxValue > 0) {
}
```

- 먼저, `barFillHeight` 라는 변수를 설정하고 "0%"로 값을 할당해주었다. 나중에 CSS 형식으로 할당될 것이기 때문에 문자열로 넣어준 것이다.
- `barFillHeight`를 이용하여 `if` 문을 작성해준다. 이 로직은 만약 0보다 큰 최대값`props.maxValue`을 얻게됐을 떄를 가정하여 결과값을 반환해줄 것이다. 만약 expense가 없는 달을 고를 때와 같은 특정 데이터에서는 0이 나올 수도 있기 때문이다.

```js
if (props.maxValue > 0) {
  barFillHeight = Math.round((props.value / props.maxValue) * 100) + "%";
}
```

- [MDN 문서 참조: Math.round()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Math/round)

  > Math.round() 함수는 입력값을 반올림한 수와 가장 가까운 정수 값을 반환합니다.

- 변수 `barFillHeight`에 `Math.round()`를 사용하여 정수값을 반환할 수 있도록 하고 그 안에 계산식을 넣어준다. 최대값(`props.maxValue`)에서 값(`props.value`)을 나누고 여기에 100을 곱하도록 한다. 이는 해당 `ChartBar`가 어느 정도까지 높게 채워질 것인지를 0부터 100 사이의 퍼센트(%)로 계산해줄 것이다. 그리고 마지막에 변수 `barFillHeight`이 CSS 형식으로 할당될 수 있도록 문자열 `"%"`를 더해주었다.
- 정리하자면, 지금까지 작성한 로직들을 통해 `ChartBar`의 높이를 설정하고자 하는 것이다. 즉, `chart-bar__fill`라는 className을 가진 `div`의 높이를 CSS 형식으로 설정해준 것이다. 마지막으로 이 높이 값을 style로 적용하기 위해서 이 `div`에 `style` 요소를 추가하자.

### `ChartBar`의 높이 칠해주기

```js
<div className="chart-bar__fill" style={{}}></div>
```

- `barFillHeight`을 사용하여 계산된 높이 값은 동적일 것이다. 단일 `{}`를 사용해서 style에 값으로 할당해주면 동적으로 무언가를 출력할 수 있게 되고, 그러면 동적인 값이 JavaScript 객체가 되며 이 또한, `{}`로 생성된다. 그래서 전체적으로는 `{{}}` 이중 중괄호를 사용하게 된다. 물론, 특별하지 않은 문법이지만 하나 특이한 점이 있다면 바로 style이 JavaScript 객체를 값으로 필요로 한다는 것이다.

```js
<div className="chart-bar__fill" style={{}}></div>
```

- 그러면 이 객체는 CSS 속성의 이름을 `key name`, 즉 Property로 지정하고 Property의 `value`는 `value`가 된다. 예를 들어보면, "background-color"를 `key name`으로 사용하여 `value` 값으로 "red"로 설정하여 배경색을 지정할 수도 있고,

```js
<div className="chart-bar__fill" style={{ "background-color": "red" }} >
```

- `ChartBar`의 높이가 필요한 우리의 경우에는 높이(`height`)를 `barFillHeight` 으로 설정할 수 있다.

```js
<div className="chart-bar__fill" style={{ height: barFillHeight }}></div>
```

### CSS property name 작성하기

- 만약, CSS property name(`key name`) 을 대쉬(`-`)를 사용하여 작성할 때는 반드시 따옴표(`" "`)를 써서 작성해야 한다. 만약 따옴표(`" "`)로 감싸지 않는다면 유효하지 않은 property name이 되기 때문이다.

```js
<div className="chart-bar__fill" style={{ "background-color": "red" }} >
```

- "Camel case"로 작성한다면, style 객체의 property name(`key name`)에 `" "` 따옴표로 감싸지 않아도 된다.

```js
<div className="chart-bar__fill" style={{ backgroundColor : "red" }} >
```

</br>

## 마무리 및 다음 단계

- `Chart`를 사용하기 위해서 앞서 임의로 설정한 `dataPoints` 데이터를 작성해주고 `Chart`에 전달해야 할 것이다. 이 데이터를 전달하기 위한 목적으로 `ExpensesChart` 컴포넌트를 생성해주었다. 이 `ExpensesChart` 컴포넌트는 데이터를 전체적으로 `Chart` 컴포넌트에 전달하는 기능을 담당할 것이다.

```js
import Chart from "../Chart/Chart";

const ExpensesChart = (props) => {
  return <Chart dataPoints={} />;
};
```

- `Chart` 컴포넌트에서 사용할 데이터인 `dataPoints`를 pass down 하도록 설정한다. 이제 `dataPoints` 데이터를 정의하도록 하자. `ExpensesChart` 컴포넌트에서 `dataPoints`를 설정하려면 새로운 상수이자 배열이 필요할 것이다. 그리고 이 배열에 여러 객체를 넣어준다. `dataPoints`를 맵핑해서 데이터 요소에 접근하려면 객체여야 하기 때문이다.

```js
const chartDataPoints = [
  { label: "Jan", value: 0 },
  { label: "Feb", value: 0 },
  { label: "Mar", value: 0 },
  { label: "Apr", value: 0 },
  { label: "May", value: 0 },
  { label: "Jun", value: 0 },
  { label: "Jul", value: 0 },
  { label: "Aug", value: 0 },
  { label: "Sep", value: 0 },
  { label: "Oct", value: 0 },
  { label: "Nov", value: 0 },
  { label: "Dec", value: 0 },
];
```

- `dataPoints` 배열 내부에 배열로 우리가 필요한 `label` 과 `value` 값을 넣어주는데, 이 `value`는 전부 0으로 초기화를 해준다. 이 초기값을 베이스로 필터링된 expense를 살펴보고 선택한 연도의 모든 expense까지 검토한 다음에 매달의 비용(amount)을 합산하여 다시 `value` 값으로 재할당 해줄 것이다.

```js
const filteredExpenses = props.items.filter((expense) => {
  return expense.date.getFullYear().toString() === filteredYear;
});

  return (
    ...
    <ExpensesChart expenses={filteredExpenses} />;
    ...
  )
```

- 먼저, `Expenses` 컴포넌트에서 연도를 필터링한 값인 `filteredExpenses`를 `ExpensesChart` 컴포넌트에 `expenses`라는 이름으로 `filteredExpenses`를 pass down 해준다.

```js
for (const expense of props.expenses) {
}
```

- 그리고 `ExpensesChard` 컴포넌트 내부에서 `Expenses` 컴포넌트에서 `props`으로 전달받은 `expenses`를 가지고 for of loop 를 사용하여 모든 `expense`를 살펴본 후, 해당 `expense`의 달을 얻어서 `expense` 금액에 따라 적절한 데이터 `value` 값을 계산해준 뒤 업데이트할 것이다.

```js
for (const expense of props.expenses) {
  const expenseMount = expense.date.getMonth(); // 0에서 시작
}
```

- `expenseMount`를 통해서 for of loop 내부의 `expense`의 달(Month)을 얻을 수 있도록 날짜 객체의 달(Month)를 반환하는 `getMonth()` 메소드를 사용하여 해당 `expense(지출).date(날짜)`의 Month만을 구한다. 여기에서 `expense.date.getMonth()`를 살펴봄으로써 for of loop 내부의 `expense`(지출) 달(Month)을 얻을 수 있다. `expense`의 `value`는 0으로부터 시작하기 때문에 1(Jan)월은 0이 되도록 설정한다. 그리고 이 `expenseMount`는 알맞은 `dataPoint`를 고르는 데 사용된다. 1(Jan)월은 `chartDataPoints` 배열에서도 index가 0이기 때문이다.
- [MDN 문서 참조: Date.prototype.getMonth()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth)
  > getMonth() 메서드는 Date 객체의 월 값을 현지 시간에 맞춰 반환합니다. 월은 0부터 시작합니다.

```js
for (const expense of props.expenses) {
  const expenseMount = expense.date.getMonth(); // 0에서 시작
  chartDataPoints[expenseMount].value += expense.amount;
}
```

- `expenseMount`는 0에서 시작하고 11에서 끝난다. 이는 `dataPoints`의 index로 정확히 적용되기 때문에 `chartDataPoints`에서 `expenseMount`로 찾아온 달(Month)을 index로 사용한다. 그리고 `+=` 연산자로 `chartDataPoints[expenseMount].value` 에 지출 비용인 `expense.amount`를 더해준다. `expense.amount`를 사용하여 주어진 달의 값을 증가시키는 것이다.
- 이 for of loop는 모든 비용을 검토하고 각 달의 모든 비용을 합산해준다. 그리고 알맞은 달, 알맞은 `dataPoints`에 값을 할당해주고 있다. 이 for of loop가 끝나면 여전히 `chartDataPoints`은 그대로 있지만 `value` 값은 더이상 0이 아닐 것이다. 다만 각 달의 비용에 대해 합산된 값을 가질 것이다. 이제 `Chart`에 props으로 `dataPoints`를 pass down 해줌으로써 `Chart`에서 `dataPoints`를 기반으로 작동될 수 있도록 했다.

```js
const ExpensesChart = (props) => {
  return <Chart dataPoints={chartDataPoints} />;
};
```

- `Chart` 컴포넌트로 돌아와 전달받은 `dataPoints`을 이용해서 `maxValue`를 구할 수 있도록 계산해줄 것이다. 이제 모든 달을 살펴보고 (연도마다) 전체 달 중에서 가장 큰 값을 찾아야 한다. 그것이 `Chart`에 표시되어야 하는 최대값(`maxValue`)이기 때문이다.

```js
const Chart = (props) => {
  const totalMaxinum = Math.max();
  ...
};
```

- [MDN 문서 참조: Math.max()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Math/max)
  > Math.max()함수는 입력값으로 받은 0개 이상의 숫자 중 가장 큰 숫자를 반환합니다.
- 새로운 상수인 `totalMaxinum`를 추가했다. 이 상수는 `Math.max()` 메소드를 사용하여 최대값을 찾을 것이다. `max()`는 숫자 타입의 인자를 받아 가장 큰 숫자로 반환하는 메소드이다. 하지만 우리가 사용해야 하는 인자는 객체로 된 배열이므로 해당 객체의 특정 property만 사용해서 `max()` 메소드에 인자로 전달하도록 해야 한다.

```js
const dataPointValues = props.dataPoints.map((dataPoint) => dataPoint.value);
```

- `dataPointValues`라는 상수에 `props.dataPoints.map`을 할당하여 `map()` 메서드로 배열 요소(`dataPoints`)를 살피게끔 한뒤 객체에서 특정 property이자 숫자 타입인 `value` 값으로 반환하도록 했다. 이제 `dataPointValues`는 숫자 타입으로 된 배열이 되었다.

```js
const dataPointValues = props.dataPoints.map((dataPoint) => dataPoint.value);
const totalMaxinum = Math.max(...dataPointValues);
```

- 그러나, `dataPointValues`는 숫자 "배열"이다. `Math.max()` 안에 숫자를 인자로 넣어줘야 하기 때문에 spread operator를 사용하여 모든 배열의 element를 가져와 `max()` 메서드에 독립형 인자로 추가하도록 했다. 이제 `max()` 메소드는 12개의 `dataPointValues` 인자를 받게 되었다.

```js
{
  props.dataPoints.map((dataPoint) => (
    <ChartBar
      key={dataPoint.label}
      value={dataPoint.value}
      maxValue={totalMaxinum}
      label={dataPoint.label}
    />
  ));
}
```

- 마지막으로 `props.dataPoints`를 매핑하는 곳에서 `maxValue`의 값을 `totalMaxinum`으로 지정해주면 완벽하게 업데이트 된다.

</br>
