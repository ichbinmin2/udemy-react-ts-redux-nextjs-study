# Working with Forms & User Input

## 목차

- [What's So Complex About Forms?](#무엇이-폼을-복잡하게-하는가)
- [Dealing With Form Submission & Getting User Input Values](#양식-제출-처리-및-사용자-입력-값-가져오기)
- [Adding Basic Validation](#기본-검증-추가하기)
- [Providing Validation Feedback](#검증-피드백-제공하기)
- [Handling the "was touched" State](#was-touched-State-처리하기)

</br>

## 무엇이 폼을 복잡하게 하는가

- 언뜻 보기에 form 은 단순해 보이지만 실상은 그렇지 않다. 적어도 개발자의 시각에서 바라본다면 말이다. 폼과 input 값은 다양한 상태(state)를 나타낼 수 있기에 상당히 복잡한 구조를 띄고 있다.

### 폼이 고려해야만 하는 수 많은 가능성에 대하여

- 하나 이상의 입력 값이 모두 유효하지 않을 수도 있고, 모두 유효할 수 있다. 또 서버로 리퀘스트를 보낸 뒤에 특정 값이 사용 가능한지 확인해야 하는 비동기 유효성 검사를 이용해야 할 때 상태(state)를 알 수 없을 때도 있다. (ex. 이메일 주소가 유효한지 확인해야 할 때) 따라서 폼은 우리가 생각하는 것보다 훨씬 복잡할 수 있다. 우리가 잠깐 생각해보기만 한 가능성만 해도 벌써 두가지 상태(state)인데, 실제로는 하나의 폼이 유효한지 아닌지만 따지는 것이 아니라 폼에 있는 '모든 입력 값'에 대해서도 유효성을 고려해야 한다고 생각해보라. 그리고 각각의 입력 값의 상태(state)가 모여서 전체 폼의 상태(state)를 결정해야만 한다.

### 폼과 입력 값이 유효하지 않을 때와 유효할 때

- 폼과 폼 내부의 input(입력) 값이 유효하지 않을 때 특정한 입력 값에 대해서 에러 메세지를 출력하고 문제가 되는 입력 값을 강조해야 한다. 또 하나 이상의 입력 값이 유효하지 않다면, 이 입력 값이 제출되거나 저장되지 않도록 해야만 한다. 반면 폼과 폼 내부의 input(입력) 값이 유효하다면 이 입력 값이 확실하게 제출되고 저장되도록 처리해 주어야 한다. 거기다 에러 메세지를 출력하고 유효하지 않은 입력 값을 강조하는 부분 또한 처리해주어야 하는데, 이렇게 되면 사용자 입력 값의 유효성을 언제 확인해야 할지를 고려해야 하기 때문에 훨씬 더 복잡해질 것이다.

### 어느 시기에 사용자 입력 값의 유효성을 확인해야 할까?

- 사용자의 입력 값의 유효성을 언제 확인해야 할까? 시기는 크게 세 가지로 나눠볼 수 있을 것이다.

#### 사용자 입력 값 확인 1. 폼이 완전히 제출 되었을 때

- 먼저 폼이 완전하게 제출되었을 때 사용자 입력 값의 유효성을 검증할 수 있을 것이다.

- 장점 : 폼이 완전하게 제출된 뒤에 유효성 검증을 할 때에는 사용자가 유효한 값을 입력하게 할 수 있다. 다시 말하자면 사용자가 이메일 입력 칸을 입력하는 중에 완전히 입력하지도 않았는데 경고 메세지를 받지 않을 수 있다는 이야기다. 사용자가 입력을 마칠 때까지 충분히 기다린 뒤에 폼을 제출 하고 에러를 보여주게 되므로 불필요한 경고를 줄일 수 있어서 꽤 괜찮은 방법이라 할 수 있다.

- 단점 : 단점은 사용자가 값을 입력 후 폼을 제출하고 난 뒤에 문제가 있는 부분을 알려주게 된다면 사용자는 잘못된 입력 값이 있는 시기로 돌아가서 값을 다시 입력해야만 한다는 것이다. 이것은 엄청난 문제는 아니지만 최종적으로 제공하고자 하는 사용자 경험 또한 아닐 것이다.

#### 사용자 입력 값 확인 2. 사용자가 값을 입력하고, input 요소에서 포커스 아웃 되었을 때

- 사용자가 값을 입력하고 난 뒤에 input 요소에서 포커스를 잃었을 때 사용자가 무엇을 입력했는지를 확인하고 유효성을 검증할 수 있을 것이다.

- 장점 : input 요소에서 포커스를 잃었을 때 입력 값의 유효성을 검증하는 경우, 전체 폼이 제출되고 경고 메세지를 보내기 전에 사용자가 유효한 값을 입력할 수 있다. 혹은 사용자가 특정 입력을 끝내자마자 바로 그 시점에 바로 경고 메세지를 보낼 수 있다. 즉, 전체 폼이 제출되기 전까지 기다리는 것이 아니라, 하나의 특정한 입력을 마칠 때 까지만 기다리는 것이다. 이 방법은 사용자가 입력 값을 작성하지 않았을 때 매우 유용하다.

- 단점 : input 요소에서 포커스를 잃었을 때 입력 값의 유효성을 검증하는 경우, 사용자가 그 전에 유효하지 않은 값을 입력하고 나서 고치는 중에도 사용자의 입력 값이 유효한지 아닌지를 실시간으로 알려줄 수 없다는 것이다.

#### 사용자 입력 값 확인 3. 사용자가 키를 한 번씩 칠 때마다 검증하는 방법.

- 사용자가 input 요소 안에서 키를 한 번씩 칠 때마다 검증하는 방법이나 input 요소가 변경될 때마다 검증할 수 있을 것이다.

- 장점 : input 요소 안에서 키를 한 번씩 칠 때마다 사용자가 입력한 값의 유효성에 대해 바로 피드백을 주는 방식이기 때문에 실시간으로 사용자의 입력 값이 유효한지 아닌지를 알려줄 수 있다.

- 단점 : input 요소 안에서 키를 한 번씩 칠 때마다 사용자가 입력한 값의 유효성에 대해 바로 피드백을 주는 방식이기 때문에 사용자가 유효한 값을 입력하기도 전에 경고 메세지를 보내게 된다. 즉, 키를 한 번씩 칠 때마다 유효성을 검사한다면 사용자가 해당 폼에 아무런 것도 입력하지 않은 상태임에도 그 상태에서는 모든 값이 유효하지 않은데다가 사용자는 아직 새로운 값을 입력할 기회조차 받지 못했으므로 수 많은 에러들을 마주하게 된다.

### 정리

- 지금까지 폼이 복잡해진 이유와 입력 값의 유효성 검사에 대한 시기를 살펴보았다. 앞서 사용자의 입력 값을 확인하는 시기에 대해서는 저마다 장/단점이 있기 때문에 여러 조건들을 고려해서 방법을 다양하게 사용하는 방식으로 접근해야 할 것이다. 예를 들어, 입력 값이 유효하지 않게 되었을 때 키 입력마다 유효성 검증을 한다면 피드백을 실시간으로 전달하기 때문에 입력이 유효해진 순간 사용자에게 알릴 수 있다면 어떨까? 보다 나은 사용자 경험을 제공할 수 있을 것이다.

  </br>

## 양식 제출 처리 및 사용자 입력 값 가져오기

- 간단한 입력 값을 받는 폼 양식이 있는 `SimpleInput` 컴포넌트를 사용해서, 사용자의 입력을 받고 그 입력 값에 대한 유효성을 검증하여 에러 메세지를 띄워볼 것이다.

```js
const SimpleInput = (props) => {
  return (
    <form>
      <div className="form-control">
        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" />
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
  );
};
```

### 사용자의 입력 값 가져오기

- 사용자의 입력 값을 가져오는 방법에는 두가지가 있다. 첫 번째로 `useState`를 사용해서 모든 키 입력 마다 확인하고 해당 입력 값을 어떤 상태(state) 변수에 저장하는 방법이 있다. 두 번째로는 `useRef`를 사용해서 사용자가 값을 모두 입력했을 때 사용자의 입력 값을 가져올 수 있는 방법이다.

### 사용자의 입력 값 가져오기 1. `useState`

- 먼저, `useState`를 사용해서 사용자의 입력 값을 가져오는 방법이다.

```js
import { useState } from "react";

const SimpleInput = (props) => {
  const [enteredName, setEnteredName] = useState("");
  ...
}
```

- `useState`를 import 하고 컴포넌트 내부에서 호출한다. 해당 상태(state)의 이름은 `enteredName`으로 지정했다. 해당 상태는 문자열로 받을 것이기에 초기값을 ""로 설정한다.

```js
const nameInputChangeHandler = (event) => {
  setEnteredName(event.target.value);
};
```

- 이제 `enteredName` 상태를 업데이트해줄 수 있도록 `nameInputChangeHandler` 이벤트 트리거 함수를 받고, 상태 업데이트 함수(`setEnteredName`)에 `target.value` 값으로 받아올 수 있도록 한다.
  > `nameInputChangeHandler` 함수의 `event` 매개변수는 `event` 객체로 받는 것이다. 이것은 자바스크립트가 브라우저에서 작동하는 방식임을 기억하자. `nameInputChangeHandler` 함수를 input 요소의 `onChange`에 연결해주고 나면 자동적으로 이벤트를 설명하는 `event` 객체를 얻을 수 있으며, 이 `event` 객체를 통해서 입력된 값에 접근할 수 있게 되는 것이다. 즉, `event.target.value` 는 리액트가 아닌 자바스크립트 문법이며 연결된 input 요소에 이벤트가 발생하면 `event.taget` 으로ㄹ 접근하여 `value` 값을 얻을 수 있도록 한다.

```js
<input type="text" id="name" onChange={nameInputChangeHandler} />
```

- 그리고 입력 값을 받아온 input 요소에 `onChange` 이벤트로 `nameInputChangeHandler` 함수를 포인터 해준다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();
};
```

- 다음으로, 두 번째 함수인 `formSubmitssionHandler` 을 추가한다. 이 함수는 폼이 제출될 때 작동하는 함수가 될 것이다. 이 함수도 이벤트 객체로 만들 것이기 때문에 매개변수로 `event` 객체를 받을 수 있도록 작성해준다.

```js
<form onSubmit={formSubmitssionHandler}>...</form>
```

- 그리고 `form` 요소에 `onSubmit` 이벤트로 해당 함수를 연결해준다.

### 폼에서 `event.preventDafult()` 를 추가해야 하는 이유

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();
};
```

- `form` 양식을 제출(`onSubmit`)하는 함수에서 `event.preventDafult()`를 왜 추가해야만 하는 걸까? 왜냐하면 여기서는 브라우저에서 작동하는 바닐라 자바스크립트를 다루고 있기 때문이다. 기본적으로 브라우저는 폼 안에 있는 버튼을 통해서 폼 양식을 제출(`onSubmit`)하게 되면, 웹사이트를 제공하는 서버로 HTTP 요청을 보내게 된다. 이 과정은 모두 자동적으로 이루어지는 것이기에 실제로 현 시점에서 우리의 어플리케이션에서는 HTTP 요청을 처리할 서버가 없는 상태이고 HTML과 자바스크립트만 전송하는 정적 서버만 있는 상태이면 이 자동화 과정은 큰 문제가 된다. 따라서 이 문제가 발생되기 전에 `event.preventDafult()`를 통해서 자동적으로 요청이 보내지지 않도록 해야한다.

- 결론적으로, `event.preventDafult()`가 필요한 이유는 이를 사용하지 않고 폼을 제출하게 되면 자동적으로 브라우저에서 HTTP 요청이 보내게 되면서 결국 페이지가 새로고침 될 것이고, 이는 리액트 어플리케이션이 전부 재시작된다는 것에 있다. 리액트 어플리케이션이 재시작 되면서 우리가 넣어둔 상태(state)들은 초기화될 것이고, 원하는 대로 작동하지 않을 확률이 높다. 그렇기 때문에 폼 양식을 제출할 때에는 `event.preventDafult()`를 통해서 브라우저의 기본 과정인 HTTP 요청을 보내지 않도록 명령해줘야 한다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();

  console.log(enteredName);
};
```

- 저장하고, 버튼을 눌러 폼을 제출해보면

![ezgif com-gif-maker (87)](https://user-images.githubusercontent.com/53133662/172587545-c8ef033c-09d9-4b4f-8394-d34584f7aede.gif)

- 내가 input 요소에 입력한 값이 그대로 콘솔에 출력되고 있음을 확인할 수 있다.

### 사용자의 입력 값 가져오기 2. `useRef`

- 사용자의 입력 값을 가져오는 또 다른 방법에는 input 요소에 `ref`를 설정함으로써 필요할 때 input 요소로부터 값을 '읽어'오는 것이다.

```js
import { useState, useRef } from "react";

const SimpleInput = (props) => {
  const nameInputRef = useRef();
};
```

- 동일하게 `useRef`를 import 해온 후, `nameInputRef`라는 이름으로 `useRef`를 호출한다.

```js
<input
  ref={nameInputRef}
  type="text"
  id="name"
  onChange={nameInputChangeHandler}
  value={enteredName}
/>
```

- 값을 읽어올 input 요소에 `ref`prop을 작성하고 `nameInputRef`를 포인터해준다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();
  console.log("useState :", enteredName);

  const enteredValue = nameInputRef.current.value;
  console.log("useRef :", enteredValue);
};
```

- 폼이 제출(`onSubmit`)되면 이 입력된 값(`value`)을 `nameInputRef`의 `current` 속성으로 접근하여 가져올 수 있게 되었다. `ref`는 항상 `current` 속성을 갖는 '객체' 이기 때문에 리액트에서 `ref`는 언제나 `current` 속성으로 `value` 값에 접근할 수 있다.

> 자바스크립트에서 input 요소는 자바스크립트의 객체처럼 작동하며, input 요소는 항상 value 라는 속성을 가지고 있다.

- 저장하고, input 창에 무언가를 입력한 뒤 버튼을 눌러 폼 양식을 제출해보면

![ezgif com-gif-maker (88)](https://user-images.githubusercontent.com/53133662/172590988-386a7740-0470-40b8-b162-61fe90313f3c.gif)

- 콘솔에서 각각의 방법으로 입력 값을 받아오는 값들이 출력되고 있음을 확인할 수 있다.

### 결론

- 실제로는 앞서 이 두가지 방법은 동시에 사용하지 않으며, 둘 중에 하나만 선택해서 사용하게 될 것이다. 그렇다면 둘 중에 어떤 것을 사용해야만 할까? 이는 입력된 값으로 어떤 일을 처리할 것인지에 달려있다. 만약 입력 값이 폼이 제출되었을 때 딱 한 번만 필요하다면 모든 키 입력마다 상태(state) 값을 업데이트하기엔 조금 지나칠 것이기에 `ref`를 사용하는 게 더 나을지도 모른다. 반면 즉각적으로 유효성 검증을 해야만 한다면, 그러니까 키 입력 마다 입력 값이 필요하다면 `ref` 로는 해당 작업을 할 수 없기 때문에 상태(state)를 이용하는 게 더 나을 것이다. 또한 입력된 값을 초기화 할 때도

#### `ref`

```js
nameInputRef.current.value = "";
```

#### `useState`

```js
setEnteredName("");
```

- 상태(state)를 이용한다면 상태 업데이트 함수를 사용해서 간단하게 빈 문자열로 초기화시켜줄 수 있다. 물론 `ref`도 이와 동일하게 출력할 수 있는 방법이 있지만 바람직한 방법은 아니다. 직접적으로 `DOM`을 조작하는 방식이고 자바스크립트 코드를 이용해서 `DOM`을 직접 조작하는 것은 지양해야하는 방식이기 때문이다. 우리는 리액트로만 `DOM`을 조작해야 하고, `ref`를 통해서 입력 값을 초기화하는 방식은 결코 좋은 방법이라 할 수 없을 것이다.

</br>

## 기본 검증 추가하기

- 이제 폼의 입력 값에 대한 유효성 검증을 추가하고자 한다. 예를 들자면, 입력 란이 비어있을 때 폼을 제출하지 못하도록 하는 식이다. 지금까지는 콘솔 출력만 될 뿐이지 많은 경우에는 빈 데이터를 서버로 전송하게 된다. 그리고 빈 데이터를 굳이 서버로 전송할 필요는 없을 것이다.

### 유효성 검사는 보안 메커니즘이 아니다

- 실제 웹사이트, 웹 앱에서 이렇게 브라우저에서 사용자 입력 값의 유효성을 검증하는 방식은 사용자 경험 측면에서 빠른 피드백이 가능하므로 굉장히 좋은 방식이다. 하지만 이런 입력 값들은 서버에서도 검증이 되어야 하는데, 그 이유는 브라우저에 있는 코드는 사용자에 의해 얼마든지 편집될 가능성이 있기 때문이다. 따라서 이런 유효성 검사는 사용자 경험을 위한 장치일 뿐이며, 보안 메커니즘이 아님을 명심해야 한다.

### 사용자 입력란이 공란일 때 추가할 수 있는 유효성 검사

- 어떻게 해야 사용자 입력란이 비어있는 채로 폼을 제출했을 때 콘솔에 출력하지 않고 에러를 띄울 수 있을까?

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();

  if (enteredName.trim() === "") {
  }

  console.log("useState :", enteredName);
};
```

- 폼을 제출하는 트리거 함수인 `formSubmitssionHandler` 안에서 `if` 문을 추가하고, 사용자 입력 값을 상태(state)로 관리해주고 있는 `enteredName`에 `trim()`을 사용해서 공백을 없앤 상태가 비어있을 때를 가정해보자.

  > 이때 유효성 검증에 사용되는 조건들은 어떤 입력 값을 받느냐에 달라질 것이다. 단순히 이름이라면 입력란이 비어있는지만 확인하면 될 것이고, 이메일 주소라면 유효한 이메일 주소인지 검증해야 할 것이다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();

  if (enteredName.trim() === "") {
    return;
  }

  console.log("useState :", enteredName);
};
```

- 그리고 만약 `enteredName`이 비어있다면, 해당 코드의 다음으로 진행되지 않도록 return 을 해준다. 이렇게 하는 이유는 입력된 값을 사용해서 무언가를 해야 하는데, 값이 비어있다면 이후의 작업들을 할 필요도 없기 때문이다. 지금의 경우라면 입력된 값이 비어있다면 콘솔에 해당 `enteredName`을 출력되지 않을 것이다.

![ezgif com-gif-maker (89)](https://user-images.githubusercontent.com/53133662/172601433-85233f5a-25df-4e26-8240-4b976e677c3d.gif)

- 저장하고 초기화 한 뒤, 입력창이 비어있는 채로 제출을 해도 콘솔 창에 그 어떤 것도 출력되지 않는 걸 볼 수 있다. 반면, 입력창에 무언가를 입력하고 제출을 하면 콘솔 창에 입력한 값이 그대로 출력되고 있다.

</br>

## 검증 피드백 제공하기

- 기본적인 유효성 검증을 위해서 더 많은 상태(state)들을 추가할 수 있다.

```js
const [enteredNameIsValid, setEnteredNameIsValie] = useState(true);
```

- `enteredNameIsValid`는 boolean 으로 처리되는 `enteredName`의 유효성의 상태를 관리해주는 상태(stete)가 될 것이다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();

  if (enteredName.trim() === "") {
    setEnteredNameIsValie(false);
    return;
  }

  setEnteredNameIsValie(true);
  console.log("useState :", enteredName);
};
```

- 그리고 기존에 작성한 유효성을 판단하는 `if` 문 내부에 return 하여 해당 함수가 종료되기 전에 `setEnteredNameIsValid`를 `false`로 업데이트 해주고, 유효성 검사가 true 가 되었을 때는 `setEnteredNameIsValid`를 `true`로 업데이트 해준다.

```js
<input
  ref={nameInputRef}
  type="text"
  id="name"
  onChange={nameInputChangeHandler}
  value={enteredName}
/>;
{
  !enteredNameIsValid && <p className="error-text">Name must not be empty.</p>;
}
```

- 그리고 input 창 아래에 `{}`를 추가하고, `enteredNameIsValid`가 false 일 때 어떤 경고 메세지를 띄울 수 있도록 `<p>` 태그를 사용하여 마크업을 작성해준다.

```js
<div className="form-control">
  <label htmlFor="name">Your Name</label>
  <input
    ref={nameInputRef}
    type="text"
    id="name"
    onChange={nameInputChangeHandler}
    value={enteredName}
  />

  {!enteredNameIsValid && <p className="error-text">Name must not be empty.</p>}
</div>
```

- 빈 값으로 제출하면 input 창이 빨간색으로 스타일링되어 사용자에게 확보하기 쉬운 경고를 보여주도록 `<div>` 태그의 className 을 변수로 작성해준다.

```js
const nameInputClasses = enteredNameIsValid
  ? "form-control"
  : "form-control invalid";

return (
  <form onSubmit={formSubmitssionHandler}>
    <div className={nameInputClasses}>...</div>
  </form>
);
```

- 이를 저장하고 확인해보면, 입력창이 비어있는 채로 폼을 제출했을 때 input 창의 컬러가 변하고, 아래에 경고 메세지도 함께 출력되는 걸 알 수 있다.

![ezgif com-gif-maker (90)](https://user-images.githubusercontent.com/53133662/172604274-6e44c8ff-2c50-48b8-aa52-1c6070fc45f1.gif)

</br>

## was touched State 처리하기

- 지금까지 우리가 추가한 유효성 검증 방식에는 단점이 하나 있다.

```js
const [enteredNameIsValid, setEnteredNameIsValie] = useState(true);
```

- 이 `enteredNameIsValid`라는 상태(state)는 초기 값의 true 로, 처음에 입력을 유효하다고 취급한다는 의미이며 유효하지 않으면 false로 변하도록 했다. 이는 단지 유효성 검사에서 우리가 설정한 에러를 초반에 띄우지 않기 위한 목적으로 설정된 것이며, 일종에 속임수에 더 가깝다. 그리고 이 `enteredNameIsValid` 상태 값은 유효성을 출력할 때를 제외하고는 사실 필요하지 않기에 목적에만 부합하되 부정확한 방식으로 처리를 해주었다. 그리고 이는 어떤 문제를 일으킬 가능성을 내포하고 있다는 뜻이다.

### `enteredNameIsValid`의 상태 값이 문제가 되는 이유

```js
const [enteredNameIsValid, setEnteredNameIsValie] = useState(true);
```

- 이 상태(state) 값이 왜 문제가 되는지 예시를 들어보자.

```js
useEffect(() => {
  if (enteredNameIsValid) {
    // true 일 때
    console.log("Name Input Is valid!"); // 콘솔에 출력한다
  }
}, [enteredNameIsValid]);
```

- 여기에서 `useEffect`를 통해 `enteredNameIsValid`가 true 일 때마다 실제 앱의 콘솔 창에서 어떤 텍스트를 출력하도록 해보자.

![ezgif com-gif-maker (92)](https://user-images.githubusercontent.com/53133662/173320599-fd578b0a-a7d7-4cba-9866-04293cd13e45.gif)

- 저장하고 콘솔창을 확인해보면, 그 어떤 것도 실행되지 않은 상태임에도 불구하고 처음부터 우리가 입력한 "Name Input Is valid!" 텍스트가 출력되고 있음을 알 수 있다. 앞서 설명한대로 `enteredNameIsValid` 상태를 true로 약간은 부정확하게 설정했기 때문에 발생하는 문제인데, 이는 시작할 때 이 값이 유효하다는 뜻이 아니며, 다만 옳지 않은 것이라는 이야기다. 그리고 이는 단지 에러에 대한 피드백을 주기 위한 임시방편일 뿐이다. 만약 `useEffect`가 없었다면 이렇게 편법을 이용했더라도 실질적인 손해가 없으니 만족할지 모른다. 하지만 그렇다고 하더라도 이 코드가 좋은 코드라는 의미는 아닐 것이다.

```js
const [enteredNameIsValid, setEnteredNameIsValie] = useState(false);
```

- `enteredNameIsValid` 가 처음부터 true 일리는 없기 때문이다. 오히려 이 상태(state)의 초기 값은 false 여야 더 자연스러워 보인다. 따라서 우리는 세 번째 상태(state)를 추가하고자 한다.

### 세 번째 상태(state) 값 추가하기

```js
const [enteredNameTouched, setEnteredNameTouched] = useState(false);
```

- `enteredNameTouched` 상태는 기본적으로 사용자가 입력 창에 입력해서 `enteredName`이 있는지를 확인하기 위한 목적으로 추가하였다. 그리고 이 값의 초기 값은 어플리케이션이 시작됐을 즉시 사용자가 입력창을 건드리지 않았을 것이기 때문에 false 로 지정한다.

### `enteredNameIsValid`와 `enteredNameTouched`를 조합하여 유효성 검증 코드 업데이트 하기

- 먼저 `enteredNameIsValid`와 `enteredNameTouched`를 조합하여 에러 메세지를 출력하는 목적으로 사용하고, 이를 통해서 `invalid` 클래스를 더해줄 수 있도록 한다. 이제 `enteredNameTouched` 상태를 통해서 입력 값이 유효한지를 체크함과 동시에 사용자가 입력 창을 건드렸는지에 대한 여부도 체크할 수 있기 때문이다. 그리고 만약 사용자가 입력창을 건드릴 기회조차 없었다면, 에러 메세지를 띄울 이유가 없을 것이다.

```js
const nameInputIsInvalid = !enteredNameIsValid && enteredNameTouched;
```

- 이 두가지의 상태(state)를 조합해서 사용하기 위해서 상수 `nameInputIsInvalid`를 추가하고, `enteredNameIsValid`는 false 이고, `enteredNameTouched`는 true 일 때 true 값이 될 수 있도록 작성한다. 사용자가 입력창을 건드리기 시작하면서 값이 유효하지 않을 때만 유효성 검증을 하기 위해서다.

```js
{
  !enteredNameIsValid && <p className="error-text">Name must not be empty.</p>;
}
```

- 우리가 `!enteredNameIsValid` 상태와 `&&`을 통해서 에러 메세지를 띄우도록 설정하였는데, 이제 `nameInputIsInvalid` 으로 조건문을 대체해줄 수 있게 되었다.

```js
{
  nameInputIsInvalid && <p className="error-text">Name must not be empty.</p>;
}
```

- `nameInputIsInvalid` 일 때만 에러 메세지를 띄우도록 조건문을 작성한다. `nameInputIsInvalid` 상수는 우리가 위에서 작성한 것처럼 `enteredNameIsValid`는 false 이면서 동시에 `enteredNameTouched`는 true 일 때를 의미할 것이다.

```js
const nameInputClasses = enteredNameIsValid // true 이면,
  ? "form-control"
  : "form-control invalid"; // 경고 css
```

- 그리고 `enteredNameIsValid` 상태를 이용해서 클래스명을 조건문으로 할당한 것 역시 `nameInputIsInvalid`으로 수정해준다.

```js
const nameInputClasses = nameInputIsInvalid // true 이면,
  ? "form-control invalid" // 경고 css
  : "form-control";
```

- 여기서 주의할 점은, `nameInputIsInvalid`가 true 일 때는 유효성 검증에서 false 라는 뜻이므로 `invalid` 클래스 명을 `nameInputIsInvalid`가 true 일 때 가져갈 수 있도록 수정해야한다는 것이다.

![ezgif com-gif-maker (93)](https://user-images.githubusercontent.com/53133662/173327906-1facd14d-7618-48da-9e44-3025845cedde.gif)

- 저장하고 새로고침 해보면 `enteredNameIsValid`의 초기값을 false로 설정해두었음에도 처음에 에러 메세지가 출력되지 않으면서 콘솔에도 아무런 메세지가 출력되지 않는 걸 알 수 있다. 하지만 문제는 Submit 버튼을 클릭해도 이전처럼 아무런 변화가 일어나지 않는다. 왜 일까?

### `enteredNameTouched` 상태 업데이트하기

- Submit 버튼을 눌러도 그대로인 이유는 `enteredNameTouched` 상태를 업데이트한 적이 없기 때문이다. 물론 이 부분을 어떻게 할지는 각자의 선택에 달려있다. 만약 폼이 제출 되었다면 당연히 `enteredNameTouched`는 업데이트 되어야 한다. 폼이 제출된 상태라면 사용자가 아무런 텍스트도 입력하지 않았더라도 전체 폼을 제출한 것이고 이는 사용자가 전체 폼을 확인했다는 의미이기도 하기 때문에 모든 입력창은 사용자가 건드렸음을 전제로 여겨져야 할지도 모른다. 따라서 이런 경우에는 사용자가 모든 입력창을 건드린 것을 전제로 `enteredNameTouched`을 업데이트 하고자 한다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();

  if (enteredName.trim() === "") {
    setEnteredNameIsValie(false);
    return;
  }

  setEnteredNameIsValie(true);
};
```

- 우리가 `enteredName`와 `if` 문을 통해서 유효성을 검증하기 전에 폼이 제출된 그 순간 `setEnteredNameTouched`을 업데이트하도록 해야 한다. 왜냐하면 여기서 폼이 제출되는 순간 모든 입력 창을 사용자가 확인했다고 볼 수도 있기 때문이다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();
  setEnteredNameTouched(true);

  if (enteredName.trim() === "") {
    setEnteredNameIsValie(false);
    return;
  }

  setEnteredNameIsValie(true);
};
```

![ezgif com-gif-maker (94)](https://user-images.githubusercontent.com/53133662/173329341-4a7dd29f-cbba-4687-b513-a39a082ebbbb.gif)

- 저장하고 아무런 것도 입력하지 않고 Submit 버튼을 눌러보면 에러 메세지가 출력 되며, 메세지를 입력하고 다시 Submit 버튼을 누르면 콘솔 창에 "Name Input Is valid!"가 출력되는 것을 확인할 수 있다.

### 정리

- 분명 코드의 길이는 길어졌을지 몰라도, 조금 더 나은 코드 또 깔끔한 코드가 된 것을 알 수 있다. 또한 이런 리팩토링을 통하여 더 많은 유스 케이스를 다룰 수 있게 되었고, 동시에 이전의 눈 속임수에 가까운 부정확한 방법으로 초기 값을 작성한 것이 아니라, 정확한 값을 작성하여 정상적으로 작동될 수 있게 되었다.

</br>
