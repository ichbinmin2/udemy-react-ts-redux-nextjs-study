# React State & Working With Events

## 목차

- [Listening to Events & Working with Event Handlers](#이벤트-리스닝-및-이벤트-핸들러-수행하기)
- [How Component Functions Are Executed](#컴포넌트-기능이-실행되는-방법)
- [Working with "State"](#State와-함께-일하기)

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

- 이벤트 핸들러 `props`는 함수를 값으로 필요로 하며, `onClick`을 값으로 pass하는 함수를 포함한 모든 ` on``props `는 그 이벤트가 발생하면 실행되는 방식으로 이뤄진다.
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
