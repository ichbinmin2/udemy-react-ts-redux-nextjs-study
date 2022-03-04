# React State & Working With Events

## 목차

- [Listening to Events & Working with Event Handlers](#이벤트-리스닝-및-이벤트-핸들러-수행하기)
- [How Component Functions Are Executed](#컴포넌트-기능이-실행되는-방법)
- [Working with "State"](#State와-함께-일하기)
- [A Closer Look at the "useState" Hook](#useState-hook-자세히-살펴보기)
- [Practice | Adding Form Inputs](#양식-입력-추가하기)
- [Practice | Listening to User Input](#사용자-입력-리스닝)
- [Practice | Working with Multiple States](#여러-State-다루기)
- [Practice | Using One State Instead (And What's Better)](#State-대신-사용하기-그리고-더-나은-방법을-찾기)
- [Practice | Updating State That Depends On The Previous State](#이전-State에-의존하는-State-업데이트)
- [Practice | Handling Form Submission](#양식-제출-처리하기)
- [Practice | Adding Two-Way Binding](#양방향-바인딩-추가하기)
- [Practice | Child-to-Parent Component Communication(Bottom-up)](#자식-대-부모-컴포넌트-상향식-통신)

</br>

## 이벤트 리스닝 및 이벤트 핸들러 수행하기

- [MDN 문서 참조: HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement)
- [MDN 문서 참조: Element](https://developer.mozilla.org/ko/docs/Web/API/Element)
- `div`, `h2`, `button` 등과 같은 전체 내장 HTML 요소에는 listen 할 수 있는 모든 네이티브 DOM Event에 모두 접근할 수 있다.
- React는 모든 Event에 `on`으로 시작하는 `prop`으로 노출된다.

```js
<button onClick={}>Change Title</button>
```

- `onClick` 이벤트는 `button`을 클릭할 때 이벤트 listener를 추가해주는 역할을 한다.
- `onClick` 이벤트의 값은 매우 중요하며, click이 발생할 때 실행되는 코드여야 한다.

```js
<button
  onClick={() => {
    console.log("clicked!");
  }}
>
  Change Title
</button>
```

- 이벤트 핸들러 `props`는 함수를 값으로 필요로 하며, `onClick`을 값으로 pass하는 함수를 포함한 모든 `on`+`props `는 그 이벤트가 발생하면 실행되는 방식으로 이뤄진다.
- `onClick` 이벤트의 값으로 즉시 실행 함수를 넣어도 되지만, 보통 JSX 블록 즉 JSX 코드 안에 코드를 많이 작성하는 것은 그다지 좋은 방법이 아니다.
- `onClick` 이벤트의 값으로 즉시 실행 함수를 넣어주는 대신 return 하기 전에 동일한 실행 결과를 얻는 함수를 정의해주고,

```js
const clickHandler = () => {
  console.log("Clicked!");
};
```

- `onClick` 이벤트의 값으로 해당 함수를 지정(point)하는 방식을 취하는 게 좋다.

```js
<button onClick={clickHandler}>Change Title</button>
```

- `onClick` 이벤트의 값으로 함수를 지정(point)하면서 `()`를 덧붙이지 않은 이유는 만약 `clickHandler()`로 괄호를 덧붙인다면 `onClick` 이벤트가 실행되지 않았음에도 해당 코드들이 parse 됐을 때 JavaScript가 이것을 바로 실행하기 때문이다.
- 몇개의 element는 특정 이벤트만 실행할 수 있지만 어쨌든 모든 element의 이벤트는 기본 DOM 방식을 기반으로 한다. 그리고 element가 이벤트를 지원할 때 React와 함께 listener를 추가할 수 있게 된다.

</br>

## 컴포넌트 기능이 실행되는 방법

- 버튼을 클릭했 을 떄, `title`이 바뀌도록 해보자.

```js
let title = props.title;
```

- let으로 변수를 하나 생성하여, props로 찾은 title을 값으로 할당해주었다.

```js
<h2>{title}</h2>
```

- 그리고 JSX 코드에 이 title 변수를 사용해서 title을 출력하도록 했다. 물론, 이렇게 수정했을 때에도 화면의 결과는 같을 것이다. 다만, title은 변수이기 때문에 기존의 `onClick` 이벤트 함수인 `clickHandler` 함수를 이용하여 이 이벤트 함수가 실행될 때마다 변경할 수 있다. 이를 이용하여 `clickHandler` 함수 내부에서 title 변수를 변경해보자.

```js
const clickHandler = () => {
  title = "Update!";
};
```

- 하지만 버튼을 아무리 `onClick`해봐도 화면의 title은 바뀌지 않는다. 실제로 `clickHandler` 함수는 정상적으로 작동되고 있고, 또한 title 값도 바뀌었으나 DOM에 반영이 되지 않고 있다. 왜 그럴까?

### 컴포넌트는 함수가 아니다.

- 컴포넌트는 그저 규칙적인 함수일 뿐이며, 이 함수의 특별한 점 중에 하나는 바로 JSX에 return 된다는 사실이다. 그리고 이때 이 함수는 불러와야 하는 함수가 된다. 하지만 우리는 절대 컴포넌트 함수를 불러오지 않았으며, 대신에 HTML 요소와 같은 함수를 JSX 코드 내에서 사용하기만 했음을 알 수 있다.

```js
<ExpenseItem
  title={props.items[2].title}
  amount={props.items[2].amount}
  date={props.items[2].date}
/>
```

- 사실 속을 들여다보면 이처럼 컴포넌트를 가져와 사용하는 것은 함수 불러오기와 거의 비슷하다. JSX 코드 내에서 컴포넌트를 가져와 사용함으로써 React가 컴포넌트 함수를 인지하도록 해줬기 때문이다. 또한, React가 JSX 코드를 evaluate 할 때마다 위의 예시처럼 `ExpenseItem` 함수가 불러와진다. 그리고 이 `ExpenseItem` 함수는 JSX 코드를 return 할 것이다. (더이상 evaluate할 JSX 코드가 없을 때까지 전부 evaluate 된 채로.) 따라서, React는 JSX 에서 만나는 아무 컴포넌트 함수를 계속 불러오게 되고 어떤 함수를 불러왔을 때 그 함수들이 return 될 수도 있다. 즉, 이러한 컴포넌트들이 JSX 코드 내에서 아마 사용했었을 요소들은 더 이상 그 어떤 함수도 남지 않을 때까지 사용될 것이다.

```js
const Expense = (props) => {
  return (
    ...
    <ExpenseItem
      title={props.items[0].title}
      amount={props.items[0].amount}
      date={props.items[0].date}
    />
    ...
  );
};
```

- 이 `expense.js` 의 경우를 보면, React가 `ExpenseItem` 함수를 불러오고

```js
const ExpenseItem = (props) => {
  ...
  return (
    <Card className="expense-item">
      <ExpenseDate date={props.date} />
     ...
    </Card>
  );
};
```

- `ExpenseItem` 함수 안에서 모든 코드를 실행하여 JSX 코드를 만나고 이 `Card` 함수와 `ExpenseDate` 함수를 불러올 것이다. 그리고 마찬가지로 `Card`와 `ExpenseDate` 안에서 모든 코드를 실행하여 JSX 코드를 return하게 된다. 이 과정은 불러와서 실행할 컴포넌트 코드가 더 이상 남아있지 않을 때까지 반복된다. 이 과정이 모두 끝나면, 전반적인 결과를 다시 evaluate 할 것이다. 그리고 이것을 DOM 명령어로 번역하면 화면에 무언가를 렌더링하게 된다. 이것이 바로 React가 작동하는 방법이다.

### 결론

- 이것이 바로 React가 모든 컴포넌트를 지나서 모든 컴포넌트 함수를 행하고, 화면에 무언가를 그려내는 방법이다. 여기서 단 하나 문제가 있다면 React는 이 과정을 절대 반복하지 않는다. 즉, React는 앱이 초기에 렌더링 되었을 때 이 모든 과정을 실행하고, 이 과정이 끝나면 반복하지 않는다는 의미이다.
  하지만, 현대의 어플리케이션에서는 화면에 렌더링 되는 것을 한 번이 아니라 여러번 업데이트해야 할 때가 많을 것이다. 해당 React 프로젝트를 예를 들자면, 이전에 시도했던 방법처럼 버튼을 눌러 `onClick` 이벤트를 실행하는 함수를 작동시키고, 이 함수를 통해 title을 변경하여 출력하고 싶을 때처럼 말이다.
  따라서 React가 무언가를 바꾸고 특정 컴포넌트가 재 evaluate 되었다는 걸 알려줄 방법이 필요하다. 이때 React는 `상태(state)`라는 특별한 개념을 도입하게 된다.

</br>

## State와 함께 일하기

- `상태(state)`는 React에서 중요한 개념이다.

```js
let title = props.title;

const clickHandler = () => {
  title = "Update!";
  console.log(title);
};
```

- 이전에 `onClick` 이벤트를 실행하는 함수를 작동시키고, 이 함수를 통해 title을 업데이트하여 출력시키고자 했지만 화면에는 변화가 없었다. 사실상 이 시도는 해당 컴포넌트가 재 evaluate 되게 하는 데이터이자 title 데이터가 바뀌어서 변화가 생기면 화면에 다시 그려지도록 하는 데이터로 기능하는 목적이었다. 그러나, 이러한(`let title = props.title;`)와 같은 일반적인 변수들은 재 evaluate를 촉발시키지 않는다. 앞서 설명했던 것처럼 코드는 정상적으로 실행이 되지만, 컴포넌트 함수에 변수가 있다면 그 변수가 변화해도 React는 무시하기 때문에 다시 실행되거나 하지 않는다. 그리고 만약 다시 컴포넌트가 리렌더링 하더라도 `title`, 즉 변수는 재생성되고 다시 `props` 값으로 초기화 될 뿐이다. 왜냐하면 컴포넌트 함수의 한 부분으로서 title 변수를 생성했기 때문이다. 따라서, 원하는 동작을 실행하기 위해서는 React가 다시 리렌더링하도록 코드를 작성해야하고, 이를 위해서 React의 `상태(state)` 개념을 이용해야 한다.

### useState()

- state를 이용하기 위해서는 먼저 React에서 `useState` 라는 함수를 import 해온다.

```js
import React, { useState } from "react";
```

- `useState()`는 React 라이브러리가 제공하는 함수이며, 값을 상태(state)로 정의할 수 있도록 해주는 역할을 한다.
  > `useState()`는 이른바 React hook 이라고 부른다. React hooks는 React 컴포넌트 함수 내에서만 불러올 수 있다.
- `useState()`는 기본 상태(state) 값이다. useState 함수는 특별한 종류의 변수를 생성할 수 있다. 그리고 이 변수가 변화하면서 `useState()`를 생성한 해당 컴포넌트 함수가 다시 리렌더링 된다. 이때 이 특별한 변수에 초기 값도 할당할 수 있다.

```js
useState(props.title);
```

- 먼저 우리가 `title` 변수 값으로 할당해주었던 `props.title`을 `useState()` 함수의 초기값으로 할당해주었다. 이렇게 초기값을 할당해주면 초기 렌더링 때 state의 값이 동일하게 초기화되도록 설정해줄 수 있게 된다.

```js
= useState(props.title);
```

- `useState()` 같은 특별 변수에 접근하고 새로운 값으로 업데이트하기 위해서 `=`를 사용하여 선언해주자. (이것이 바로 상태 변수가 작동하는 방법이다.) 그리고 이것이 제대로 작동하기 위해서 `useState`는 배열을 return 한다.

```js
const [변수 자체(값 자체), 업데이트된 함수] = useState(props.title);

```

- 이렇게 배열을 생성해서 `useState()` 를 할당하는 배열 구조 분해를 통해 두 가지의 요소를 독립된 변수나 상수에서 저장할 수 있게 된다. `useState()` 에서는 상수를 사용했다.

```js
const [title, setTitle] = useState(props.title);
```

- 배열의 첫번째 요소인 title은 앞서 설명한 것과 같이 `useState()` 에서 초기값으로 넣어준 `props.title` 값을 point 하고 있으며, 두번째 요소인 `setTitle`은 새로운 title을 설정하기 위해 불러오게 될 함수이다.
  > `useState`라는 hook은 언제나 정확히 두 가지의 요소를 가진 배열을 return 한다.

```js
const [title, setTitle] = useState(props.title);

const clickHandler = () => {
  setTitle("Update!");
  console.log(title);
};
```

- 다시, `onClick` 이벤트를 실행하는 함수를 작동시키고, 이 함수를 통해 title을 업데이트하여 출력시키기 위해 `setTitle` 라는 상태(state) 업데이트 함수를 불러오고 업데이트 할 값을 인수로 할당해준다. 이제 `onClick` 이벤트를 실행하는 함수가 작동되면, 상태 업데이트 함수가 실행되고 React가 리렌더링 할 수 있게 된다. 즉, React를 다시 실행시켜서 업데이트할 수 있게 되는 것이다.

### 정리

- 상태(state) 업데이트 함수를 불러왔을 떄 상태에 새로운 값을 할당하고자 한다고 React에 전달하게 되며, 해당 `useState` 함수가 등록되어 있는 컴포넌트에서 컴포넌트를 재 evaluate 하게끔 전달하게 된다. React는 더 나아가 해당 컴포넌트 함수를 리렌더링하고 JSX 코드를 다시 evaluate 해준다. 이렇게 되면 어떤 변화든지 React가 감지하고 리렌더링 되어 화면에 변화를 일으키게 된다. 이것이 바로 React에서 `useState`가 동작하는 방식이다.
  상태(state)는 React 에서 중요한 개념이다. 만약 변화할 가능성이 있는 데이터가 있다면, 그 데이터의 변화는 사용자 인터페이스에 반영이 되어야 하기 때문에 `state`라는 개념이 필요한 것이다.

> `setTitle` 함수를 실행시키고 난 뒤에 `console.log()`로 업데이트 되기 전의 `title`을 출력하고자 했을 때 `console`에 정상적으로 출력되는 이유는 상태 업데이트 함수를 불러왔을 떄 값을 바로 업데이트 해주는 것이 아니라, 상태(state)가 업데이트 되도록 계획하기 때문이다. 때문에, `setTitle` 함수를 실행시키고 난 다음에 `console.log()`를 출력해도 업데이트 된 새로운 `title` 값이 적용되지 않는 것이다.

</br>

## useState hook 자세히 살펴보기

- 상태(state)는 컴포넌트 인스턴스 기반 단위로 적용된다. 즉, 하나 이상의 컴포넌트를 생성하더라도 그 해당 컴포넌트에서 사용하고 있는 상태(state)는 개별적으로 작동된다.
- `useState`는 새로운 값을 할당하면서 왜 상수를 사용할까?
  - `useState` 를 불러옴으로써 우리를 위해 값을 manage 해야 한다고 React에게 전달할 뿐 절대로 변수 그 자체를 보지 않기 때문이다. 그렇다면, 가장 최신의 업데이트 값은 어떻게 얻을 수 있을까? 이는 상태(state)가 업데이트 되면 컴포넌트 함수도 리렌더링 되는 것을 기억해야 할 것이다. 이때 당연하게도 `useState`로 할당된 업데이트 값 역시 리렌더링 되면서 기본 값이 업데이트 된 값으로 할당되는 것이다. 즉, 컴포넌트 함수가 리렌더링 되면 항상 상태(state)의 가장 최신의 새로운 snapshot을 얻게 된다.
- 특정 컴포넌트 인스턴스 내에서 처음으로 `useState`를 불러왔을 때 이것을 React가 기록하게 된다. 그리고 처음으로 이것을 불러오면 초기값으로 `useState`의 인수를 받게 된다. 하지만 만약 컴포넌트가 리렌더링 된다면 (예를 들어, 상태(state)가 변화하였다면) React는 상태(state)를 다시 한번 재 초기화 해주지 않을 것이다. 대신 과거에 이 상태(state)가 초기화되었을 때를 추적해서 최신 상태로 가져가게 된다. 바로 상태 업데이트에 기반을 둔 것으로 말이다. 그리고 이 상태(state)를 대신 제공해주게 된다. 다시 한번 말하자면, `useState`에 할당된 초기값은 해당 컴포넌트 함수가 처음으로 실행되었을 때만 특정 컴포넌트 인스턴스를 고려해서 할당되게 된다.

### 정리

- `useState`로 상태(state)를 등록하면 항상 두 가지 값(값 자체, 업데이트 함수)을 돌려 받는다. 그리고 업데이트 함수가 불려지며 상태값을 사용할 때마다 첫 번째 요소를 사용하게 된다. JSX 코드에서 이를 출력하는 것처럼 말이다. 그런 후에는 React가 나머지를 알아서 처리해준다. React는 상태(state)가 변할 때마다 컴포넌트 함수를 리렌더링 시키고, JSX 코드도 재실행 한다.
- 상태(state)가 컴포넌트 함수 내부에서 어떻게 작동하는지를 이해하는 것이 정말 중요하다. 이를 이해하지 못했을 경우 더 복잡한 React 어플리케이션에서 상태(state) 값을 통제하지 못하고 어플리케이션을 실시간으로 업데이트 하는데 어려움을 겪을 수 있기 때문이다.
- 상태(state)는 어플리케이션에 reactivity를 더하며, 이 상태(state)가 없다면 사용자 인터페이스는 절대로 변하지 않을 것이며, 화면에 시각적인 변화도 없을 것이다. 따라서 상태(state)는 매우 중요한 개념이다.

</br>

## 여러 State 다루기

- 기본적으로 `input`에 대한 change 이벤트를 수신할 때마다 `input` element의 값을 읽는다면 그건 언제나 늘 문자열이 된다. 숫자 값을 저장한다고 해도 문자열로서 숫자를 저장하는 것이고, 날짜의 경우에도 동일하다.
- 컴포넌트는 각각의 state를 가질 수 있으며, 동시에 이것들을 모두 각각 업데이트하고 관리할 수 있다. 이것은 React의 state 에서 가장 중요한 개념에 속한다.

</br>

## State 대신 사용하기 그리고 더 나은 방법을 찾기

```js
const [enteredTitle, setEnteredTitle] = useState("");
const [enteredAmount, setEnteredAmount] = useState("");
const [enteredDate, setEnteredDate] = useState("");
```

- 세가지의 상태(state)가 각각 따로 관리되고 있다. 이는 같은 개념이 세 번 반복된 것이나 다름 없다. 따라서 세가지로 관리하지 않고, 하나의 상태(state)로 관리하는 방법을 고려해볼 수 있을 것이다.

```js
const [userInput, setUserInput] = useState({
  enteredTitle: "",
  enteredAmount: "",
  enteredDate: "",
});
```

- 세가지의 상태(state) 대신 하나의 상태(state)로 관리해주기 위해서 `useState`를 하나만 불러오고 값으로 객체를 넣어준다. 이 객체 안에는 key와 value 형식으로 지정될 텐데, key는 앞서 설정했던 각각의 state 이름을 넣어주고 value 값으로는 초기화 했던 빈 문자열을 넣어주었다.
- 이 두가지 방식에서의 차이점은 하나의 상태(state)로 관리할 경우, 이 상태(state)를 업데이트할 때 하나의 `property`가 아니라 세 개의 `property`를 모두 업데이트 해야한다는 특이점이 있다.

```js
const titleChangeHandler = (event) => {
  const values = event.target.value;
  setUserInput({ enteredTitle: values });
};
```

- 만약 `setUserInput`에 `enteredTitle: event.target.value`를 업데이트 한다면, 나머지 두개의 `property` 역시 잃어버리지 않도록 보장해야 한다. 왜냐하면 이러한 방식으로 객체에 새로운 상태(state)를 설정한다면 다른 key 들은 버려지는데, 상태(state)를 업데이트 했을 때 React가 예전 상태와 병합하지 않기 때문이다.(단순히 예전 상태(state)를 새것으로 대체하기만 할 뿐이다.) 만약 새것이 하나의 key 값 페어를 가진 객체라면 예전 상태(state)는 대체되기만 하고 다른 두 가지 key 값 페어는 사라지게 된다. 따라서 하나의 상태(state) 접근을 사용해서 객체를 관리해야 한다면, 다른 데이터가 사라지지 않도록 이 나머지 key 값 페어를 책임져야 한다. 그러기 위해서는 업데이트하지 않는 다른 값들을 수동으로 복사해주어야 한다.

```js
const titleChangeHandler = (event) => {
  const values = event.target.value;
  setUserInput({ ...userInput, enteredTitle: values });
};
```

- 이때 사용하는 것이 바로 `Spread operator` 이다. `Spread operator`를 사용해서 업데이트하지 않는 나머지 값을 포함한 "모든 key 값의 페어"를 빼내고, 업데이트할 key의 값을 따로 할당하여 새로운 객체에 추가한다. 이로써 업데이트 되지 않는 다른 값들이 버려지지 않도록 안전하게 보호하고 동시에 새로운 상태(state)의 부분도 같이 가져갈 수 있게 된다.

### 결론

- 세가지의 상태(state)를 각각 관리하는 것과 하나의 상태(state)로 관리하는 것 모두 궁국적으로는 괜찮은 방법이니, 선택적으로 사용하면 될 것이다.

</br>

## 이전 State에 의존하는 State 업데이트

```js
const [userInput, setUserInput] = useState({
  enteredTitle: "",
  enteredAmount: "",
  enteredDate: "",
});

cost titleChangeHandler = (event) => {
  const values = event.target.value;
  setUserInput({ ...userInput, enteredTitle: values });
};
```

- 앞서 `Spread operator` 를 사용해서 이전 상태(state)를 안전하게 복사하고 업데이트 될 상태(state)를 가져와 새로운 객체로 업데이트하는 방법으로 상태(state)를 관리했다. 하지만 이런 방식으로 업데이트를 하는 것은 그다지 썩 좋은 방법은 아니다. 이전 상태(state)에 의지해서 상태(state)를 업데이트 하고 있기 때문이다. (즉, 이전 상태의 snapshot에 의존해서 기본 값에 복사하고 새로운 값으로 값을 겹쳐 쓰고 있는 방식이다.) 이러한 방식은 상태(state)를 '업데이트할 때마다' 이전 상태에 의존해야 한다는 단점이 있다. 이런 단점을 보완하기 위해 우리는 다른 방법을 사용할 수 있다.

```js
const [userInput, setUserInput] = useState({
  enteredTitle: "",
  enteredAmount: "",
  enteredDate: "",
});

const titleChangeHandler = (event) => {
  const values = event.target.value;

  setUserInput((prev) => {
    return { ...prev, enteredTitle: values };
  });
};
```

- 동일하게 `setUserInput`를 불러오되 함수를 다시 pass 하는 방식을 취하고 있다. 이때 `setUserInput`으로 pass 한 함수는 React에 의해 '자동'으로 실행되게 된다. 그리고 업데이트 함수를 불러온 상태(state)의 이전 상태 snapshot을 받게 된다. (지금의 경우에는 객체의 상태(state)를 의미) 이전 상태 snapshot을 받은 뒤에, 새로운 상태 snapshot을 return 한다. 즉, 상태(state) 업데이트 함수를 pass 한 함수 대신에 새로운 상태(state)를 return 하는 것이다.

### 왜 이런 방식을 사용해야 할까?

- 실은 두가지 방법 다 모두 잘 작동된다. 하지만 언급했듯이 React는 상태(state) 업데이트를 계획하는 경우가 있으며, 이것은 즉시 실행되지 않는다. 그렇다면 첫번째 코드의 예시의 경우처럼 이론적으로 동시에 많은 상태(state) 업데이트를 React가 계획하고 있다면 오래된 상태(state)이거나, 잘못된 상태(state)인 snapshot에 의존할 수 있는 가능성이 있다. 대신 두번째 코드의 예시를 사용한다면 해당 inner function(내부 함수) 내에서 제공하는 상태(state) snapshot이 항상 최신 상태의 snapshot이라는 것을 React가 보장할 수 있게 된다. 앞서 말했듯 React는 계획이 되어있는 모든 상태(state) 업데이트를 전부 기억하고 있기 때문이다.

### 결론

- 이 방법은 항상 최신의 상태(state) snapshot에 기반해서 실행한다는 전제를 보장받을 수 있기 때문에 조금 더 안전하다. 따라서 이전 상태(state)에 따라 상태가 업데이트할 때마다 이런 형식의 함수 구문을 사용해야 한다.

```js
setState((prevState) => {
  return { ...prevState, updateState: updateValue };
});
```

- 이전 상태에 따라 상태(state)가 업데이트 된다면 위의 함수 구문을 사용해야 한다는 것을 잊지 말아야 할 것이다.

</br>

## 양식 제출 처리하기

```js
<button type="submit" onClick={submitHandler}>

```

- 해당 `<form>` 태그 내에서 작성한 `<button>` 의 listener로 이벤트를 처리할 수도 있지만, 그다지 좋은 방법은 아니다. 브라우저에 내장된 기본 동작이 있고 웹페이지에 내장된 `form` 이 있기 때문이다. 만약, `<button>`이 `submit`을 typing 했을 때 `form` 대신에 클릭 된다면 전체 `form` 요소가 우리가 listen 할 수 있는 event를 emit 해줄 것이다.

```js
<form onSubmit={}>
```

- `<button>` 대신에 `<form>` 태그에 onSubmit 이벤트를 처리할 수 있도록 해주고, onSubmit을 처리해줄 이벤트 함수인 `submitHandler`를 할당해준다.

```js
const submitHandler = () => {};
```

- 그러나 기본 브라우저 동작에서는 form 이 제출되면 자동으로 서버에 다시 요청을 보내게 되기 때문에, 이를 방지하기 위해서 `event.preventDefault()`를 사용할 수 있다.

```js
const submitHandler = (event) => {
  event.preventDefault();
};
```

- `event.preventDefault()`는 자바스크립트에 내장된 것으로 구체적으로 React 하지 않게 만들어준다. `event.preventDefault()`를 사용함으로써 기본 브라우저 동작에서 form 이 제출될 때 자동으로 서버에 다시 요청을 보낼 수 없게 방지해주는 것이다.

### 객체로 데이터 결합하기

```js
const submitHandler = (event) => {
  event.preventDefault();

  const expenseData = {
    title: enteredTitle,
    amount: enteredAmount,
    date: new Date(enteredDate),
  };
};
```

- 세가지의 상태(state)를 객체 내부의 `property`의 value 값으로 지정하고 각각의 `property` 이름을 설정해준다. `date` 의 경우, `new Date()` 를 사용해서 날짜를 구축했다. 이는 `enteredDate`를 pass 해서 날짜 문자열을 parse 한 뒤, 날짜 객체로 변환되게 만든 것이다.
- 이제 `<button>` 을 click 하면 `<form>`에서 `expenseData` 이라는 이벤트 함수가 자동으로 실행되면서 `expenseData` 객체 내부에 세가지의 상태(state)가 `property`로 저장되는 것을 확인할 수 있다.

</br>

## 양방향 바인딩 추가하기

- 우리는 양방향 바인딩을 사용할 수 있다. 간단히 말하자면 입력값에서 업데이트되는 것만 listen 하는 것이 아니라, 입력값으로 돌아오는 새로운 값도 pass 할 수 있다는 뜻이다. 따라서 재시작하거나 입력값을 프로그램에 따라 변화시킬 수 있다.

```js
<input type="text" onChange={titleChangeHandler} value="" />
```

- `<input>` 태그에 기본 속성인 `value`를 추가한다. 이는 `<input>` 요소가 가진 내부 값 property를 설정해주는 것이다.

```js
<input type="text" onChange={titleChangeHandler} value={enteredTitle} />
```

- 그리고 이 `value` 값으로 해당 상태(state)인 `enteredTitle`로 bind 해준다. 이것이 바로 "양방향 바인딩"이다. `<input>`에서 단순히 변화만 listen 하고 상태(state)를 업데이트 하는 것이 아니라 상태(state)를 `<input>`으로 다시 피드백해주기 때문이다. 따라서 상태(state)를 변화할 때 `<input>`도 변화시키게 된다.

```js
const submitHandler = (event) => {
  event.preventDefault();

  const expenseData = {
    title: enteredTitle,
    amount: enteredAmount,
    data: new Date(enteredDate),
  };

  console.log(expenseData);

  // 초기화
  setEnteredTitle("");
  setEnteredAmount("");
  setEnteredDate("");
};
```

- `<form>`이 제출되면 `expenseData` 객체로 데이터가 수집되어 저장되고 그 이후로 `<input>` 값들이 초기화될 수 있도록 상태(state) 업데이트 함수에 빈 배열을 넣어주었다. 이렇게 하면 `<form>`의 데이터가 제공되고 나서 사용자가 입력한 값을 빈 배열로 덮어쓰게 된다. 그렇게 `<input>`의 `value`를 초기화시킬 수 있는 것이다.

</br>

## 자식 대 부모 컴포넌트 상향식 통신

- 결국 우리의 목표는 사용자가 입력한 `NewExpense`를 기존 `Expense` 목록에 추가하고 `id`로 조금 더 풍부하게 관리하고자 하는 것이다. 따라서 `ExpenseForm`에서 생성하고 수집하는 데이터를 `App.js` 컴포넌트로 pass 해야 한다. 즉, 지금까지는 부모에서 자식으로 데이터를 물려주는 방법만 사용했다면, 자식에서 부모로 데이터를 상향식으로 통신하는 방법이 필요하다는 이야기다.

```js
const expenseData = {
  title: enteredTitle,
  amount: enteredAmount,
  data: new Date(enteredDate),
};
```

- 먼저 `ExpenseForm` 컴포넌트 내에서 수집한 `expenseData`를 `NewExpense` 컴포넌트로 pass 해보자. 컴포넌트를 중간 컴포넌트를 뛰어넘을 수는 없기 때문에 `ExpenseForm`의 바로 위 부모 컴포넌트인 `NewExpense` 컴포넌트부터 시작할 것이다. 이는 궁극적으로는 `App` 컴포넌트에 해당 데이터가 도달해야 하는 것을 목적으로 둔 시도이다.

```js
const NewExpense = () => {
  ...
  return (
  ...
    <ExpenseForm onSaveExpenseData={} />
  ...
  );
}
```

- 먼저 `ExpenseForm`에 전달할 함수를 담을 props를 추가한다.

> 보통 props 이름이 `on~`으로 시작하는 경우 해당 props가 함수이며, 컴포넌트 내에서 어떤 일이 일어날 때 결국 어떤 값을 촉발하는 함수임을 알려주기 위한 것이다. 이것은 보통의 컨벤션을 따른 것이며, 선택적으로 작명을 해도 무방하다.

```js
const NewExpense = () => {
  const onSaveExpenseDataHandler = (enteredExpenseData) => {};

  return (
    ...
      <ExpenseForm onSaveExpenseData={onSaveExpenseDataHandler} />
    ...
  );
};
```

- `NewExpense`에서 `onSaveExpenseData`라는 이름으로 props를 내려줄 함수(`onSaveExpenseDataHandler`)를 작성한다. 이때 이 함수는 매개변수로 `enteredExpenseData` 라는 값을 받는데, `ExpenseForm`에서 수집한 data를 해당 함수에서 받을 것이라는 것을 예측할 수 있는 네이밍으로 작성했다.

```js
const onSaveExpenseDataHandler = (enteredExpenseData) => {
  const expenseData = {
    ...enteredExpenseData,
    id: Math.random().toString(),
  };

  console.log(expenseData);
};
```

- `onSaveExpenseDataHandler` 함수 내에서는 또 다른 객체인 `expenseData`를 생성하고 `ExpenseForm`에서 수집한 data를 매개변수로 받은 `enteredExpenseData`를 복사해서 넣어준다. 데이터를 더 용이하게 관리할 수 있도록 id도 `Math.random().toString()`로 추가하고 문자열로 변환하여 넣어주었다. 또한 마지막으로 `console.log(expenseData)`로 정상적으로 `ExpenseForm`에서 데이터를 받아오고 있는지 확인 할 수 있도록 했다.

```js
const ExpenseForm = (props) => {};
```

- 이제 `NewExpense`에서 props로 내려준 함수 `onSaveExpenseData`를 `ExpenseForm`에서 받을 수 있도록 props를 매개변수로 설정했다. 이제 `onSaveExpenseData`에 수집한 데이터를 넣어줄 차례다.

```js
const submitHandler = (event) => {
  ...
  const expenseData = {
    title: enteredTitle,
    amount: enteredAmount,
    data: new Date(enteredDate),
  };

  props.onSaveExpenseData(expenseData);
  ...
};
```

- 데이터를 수집하는 `submitHandler` 함수에서 props로 `onSaveExpenseData` 함수를 불러오고, 매개변수로 데이터를 수집한 객체인 `expenseData`를 넣어주면 된다. 이로써 `ExpenseForm`에서 수집한 데이터를 `NewExpense`에서 받아와 관리할 수 있는 상향식 통신이 가능해졌다. 이것이 바로 컴포넌트 사이에서 소통하는 방법이자, 상향식으로 소통하는 방법이다. 이제 `NewExpense` 컴포넌트의 바로 위 부모 컴포넌트인 `App` 컴포넌트에도 동일한 작업을 해주자.

```js
const addExpenseHandler = (expense) => {
  console.log("In App.js");
  console.log(expense);
};

return (
  ...
    <NewExpense onAddExpense={addExpenseHandler} />
  ...
);
```

- `NewExpense` 컴포넌트에서도 앞서 했던 방식으로 props를 받아와 데이터를 `App` 컴포넌트로 pass 할 수 있도록 처리해주자.

```js
const NewExpense = (props) => {
  const onSaveExpenseDataHandler = (enteredExpenseData) => {
    const expenseData = {
      ...enteredExpenseData,
      id: Math.random().toString(),
    };

    props.onAddExpense(expenseData);
  };
};
```

![console](https://user-images.githubusercontent.com/53133662/156762928-37d97d71-9fe2-4503-b4e2-6d16272e8c29.png)

-`console`을 확인해보면 `App` 컴포넌트에서 정상적으로 데이터를 받아오고 있음을 확인할 수 있다.

- 우리가 의도하여 상향식 통신의 순서(`ExpenseForm` => `NewExpense` => `App`)대로 처리되었으며, 최종적으로 `ExpenseForm`에서 수집한 데이터를 `App` 컴포넌트에서 관리할 수 있게 되었다.

</br>


