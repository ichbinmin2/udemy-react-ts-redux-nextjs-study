# Working with Forms & User Input

## 목차

- [What's So Complex About Forms?](#무엇이-폼을-복잡하게-하는가)
- [Dealing With Form Submission & Getting User Input Values](#양식-제출-처리-및-사용자-입력-값-가져오기)
- [Adding Basic Validation](#기본-검증-추가하기)
- [Providing Validation Feedback](#검증-피드백-제공하기)
- [Handling the "was touched" State](#was-touched-State-처리하기)
- [React To Lost Focus](#포커스를-잃은-리액트)
- [Refactoring & Deriving States](#리팩토링-및-State-파생)
- [Managing The Overall Form Validity](#전체-양식-유효성-관리하기)
- [Time to Practice: Forms](#폼-연습하기)
- [Adding A Custom Input Hook](#사용자-지정-입력-훅-추가하기)
- [Re-Using The Custom Hook](#사용자-정의-훅-재사용하기)
- [A Challenge For You!](#당신을-위한-도전)
- [Applying Our Hook & Knowledge To A New Form](#우리의-훅와-지식을-새로운-형태에-적용하기)
- [Summary](#요약)

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

  setEnteredName("");
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
  setEnteredName("");
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
  setEnteredName("");
};
```

![ezgif com-gif-maker (94)](https://user-images.githubusercontent.com/53133662/173329341-4a7dd29f-cbba-4687-b513-a39a082ebbbb.gif)

- 저장하고 아무런 것도 입력하지 않고 Submit 버튼을 눌러보면 에러 메세지가 출력 되며, 메세지를 입력하고 다시 Submit 버튼을 누르면 콘솔 창에 "Name Input Is valid!"가 출력되는 것을 확인할 수 있다.

### 정리

- 분명 코드의 길이는 길어졌을지 몰라도, 조금 더 나은 코드 또 깔끔한 코드가 된 것을 알 수 있다. 또한 이런 리팩토링을 통하여 더 많은 유스 케이스를 다룰 수 있게 되었고, 동시에 이전의 눈 속임수에 가까운 부정확한 방법으로 초기 값을 작성한 것이 아니라, 정확한 값을 작성하여 정상적으로 작동될 수 있게 되었다.

</br>

## 포커스를 잃은 리액트

- 우리는 지금까지 form 이 제출되었을 때만 유효성을 검증하는 방식을 사용했다. 아직 입력창이 포커스 아웃 될 때나 키 입력이 될 때마다 유효성을 검증하지 않았다는 의미이다. 이미 form 을 제출하면서 유효성을 검증하는 방식 만으로 괜찮을 수 있다는 걸 알았다. 하지만 이제는 조금 더 다양한 관점에서 또 다른 방식으로 유효성 검증이 작동해야 하는지에 대해서 알아볼 필요가 있다.

```js
const [enteredName, setEnteredName] = useState("");
const [enteredNameIsValid, setEnteredNameIsValie] = useState(false);
const [enteredNameTouched, setEnteredNameTouched] = useState(false);
```

- 지금까지 세 가지의 상태(state) 를 추가하여 유효성 검증에 사용했다. 하지만 이러한 작동 방식이 아직은 사용자 경험 측면에서 효율적이라고 할 수는 없다. form 이 제출되었을 때 에러 메세지를 띄우는 것은 꽤 괜찮은 방법이지만, 만약 사용자가 입력창에 클릭만 했다면 그러니까 입력창을 건드리기만 했다면 에러 메세지는 뜨지 않는다. 그리고 무언가를 입력하고 다시 지운 후 입력창 바깥을 클릭했을 때 비어있는 입력은 허용되지 않기에 유효하지 않은 값이지만 이 역시 에러 메세지는 뜨지 않는다. 오로지 사용자가 form 을 제출하는 버튼을 눌렀을 때에만 이것이 유효한 값인지에 대해 체크할 수 있게 되고, 이는 사용자에게 느린 피드백을 주며 최적의 사용자 경험을 제공할 수 없다는 뜻이 된다.

### 입력 창이 포커스 아웃 될 때 에러 메세지를 띄우기

- 여기서 더 나은 사용자 경험을 제공하기 위해서는 사용자가 입력 창에 어떤 값을 입력할 수 있을 때에 에러 메세지를 보여준다면 더 빠른 피드백을 줄 수 있다. 또 입력 창을 빈칸으로 둔 채로 바깥을 클릭한다면 이러한 값은 허용되지 않는다는 메세지 역시 띄울 수도 있다. 왜냐하면 이때 사용자는 입력할 수 있었음에도 그렇게 하지 않았기 때문에 입력 칸에 무언가를 반드시 입력해야 한다고 피드백을 줘야 하기 때문이다. 따라서 우리는 블러라는 것이 되었을 때에도 유효성 검사를 할 수 있도록 작업해줄 요량이다.

### onBlur 사용하기

- 블러는 input 요소가 포커스 아웃 되었다는 의미로, 사실 그렇게 어려운 개념은 아니다.

```js
<input
  ref={nameInputRef}
  type="text"
  id="name"
  onChange={nameInputChangeHandler}
  onBlur={}
  value={enteredName}
/>
```

- `<input>` 태그 속성에 `onBlur`를 추가한다. 이는 자바스크립트 이벤트 속성으로 input 요소가 포커스 아웃 되는 이벤트가 발생했을 시에 사용할 수 있다.

```js
const nameInputBlurHandler = (event) => {};
```

- `onBlur` 에 바인딩할 함수 `nameInputBlurHandler`를 작성한다. 이제 이 함수에서는 두 가지를 할 것인데,

```js
const nameInputBlurHandler = (event) => {
  setEnteredNameTouched(true);
};
```

- 첫 번째로는 `setEnteredNameTouched`를 사용해서 true 로 업데이트 해줄 것이다. 입력창에서 포커스 아웃 되었다는 의미는 직전에 사용자가 입력창을 건드렸기 때문에 발생할 수 있는 이벤트이기 때문이다. 즉, 입력할 기회가 있었다는 뜻이다.

```js
const nameInputBlurHandler = (event) => {
  setEnteredNameTouched(true);

  if (enteredName.trim() === "") {
    setEnteredNameIsValie(false);
    return;
  }
};
```

- 두 번째로 해줄 일은 함수 내부에서 유효성 검증을 하는 것이다. 이를 위해서 아래의 `formSubmitssionHandler`에서 추가해주었던 유효성 검증 로직을 긁어와 그대로 붙여넣기 해준다. 이 역시 `enteredName`가 공백이 없는 상태에서 빈 문자열인지를 확인하고, 이 값이 만약 빈 문자열이라면 `enteredNameIsValid`를 false 로 바꿔준다. 이렇게 하면 코드가 중복되지만 이후에 리팩토링을 할 예정이니 미리 걱정하지 말자.

![ezgif com-gif-maker (95)](https://user-images.githubusercontent.com/53133662/173338433-3b2be6de-7600-47a9-9be3-8e12212cc5a7.gif)

- 입력창을 클릭하고 다시 입력창 바깥을 클릭하면 경고 메세지가 출력되는 걸 알 수 있다. 이는 결과적으로 이전보다는 더 나은 사용자 경험을 주는 것처럼 보인다.

### 정리

- 이제 이러한 오류를 고칠 기회를 사용자에게 줘야한다. 여기에 무언가를 입력하기 시작하는 순간에 에러 메세지가 사라진다면 어떨까? 훨씬 나은 사용자 경험을 제공할 수 있을 것이다. 이렇게 피드백을 실시간으로 전달한다면 사용자가 유효하지 않은 값을 입력했을 때 이를 즉시 인지할 수 있게 해주고 잘못된 입력을 멈출 수 있다. 이와 같은 경우에는 키 입력마다 유효성을 검증하는 방식이 좋을 것이다. 그리고 이는 이전에 우리가 추가한 다른 검증 절차와 조합해서 사용되어야 할 것이다. 왜냐하면 키 입력마다 유효성을 검증하는 방식만 사용한다면, 사용자가 유효한 값을 입력할 기회조차 주지 않고 에러를 출력할지도 모르기 때문이다. 반면 우리가 앞서 사용한 방식들을 조합하게 되면 입력 창이 포커스 아웃되거나 폼이 제출되는 것을 확인해서 사용자가 유효한 값을 제출할 기회를 줄 수 있게 될 것이다.

</br>

## 리팩토링 및 State 파생

- 이번에는 키를 입력할 때마다 유효성을 검증해볼 것이다.

```js
const nameInputChangeHandler = (event) => {
  setEnteredName(event.target.value);
};
```

- input의 입력 값을 실시간으로 받아오는 `nameInputChangeHandler` 함수에 우리가 유효성 검사를 했던 로직을 그대로 복사해서 가져온다.

```js
const nameInputChangeHandler = (event) => {
  setEnteredName(event.target.value);

  if (enteredName.trim() === "") {
    setEnteredNameIsValie(false);
    return;
  }
};
```

- 사실 이 방법은 부정확한 방법이다. 이 방법은 값이 유효하지 않은지를 확인해서 그때 `setEnteredNameIsValie`을 false 로 업데이트하기 때문이다. 하지만 키를 입력할 때마다 값이 유효한지를 확인하기 위해서는 최대한 빠르게 유효하지 않았을 때 출력되는 에러를 제거해야 한다. 따라서 여기에서는 약간의 로직을 수정해야 할 필요가 있다.

```js
const nameInputChangeHandler = (event) => {
  setEnteredName(event.target.value);

  if (enteredName.trim() !== "") {
    setEnteredNameIsValie(true);
  }
};
```

- 이 로직에서는 `===`를 `!==`로 바꾸고, `enteredName.trim()`이 빈 값이 아닐 때에 `setEnteredNameIsValie`이 true 가 될 수 있도록 수정해주었다. 이렇게 되면 조건문 뒤에 실행할 코드가 없기에 return 은 필요 없어지므로 제거 한다.

```js
const nameInputBlurHandler = (event) => {
  setEnteredNameTouched(true);

  if (enteredName.trim() === "") {
    setEnteredNameIsValie(false);
  }
};
```

- 위의 사례와 동일하기에 `nameInputBlurHandler` 함수 내부의 로직도 return 을 제거할 수 있게 된다.

```js
const nameInputChangeHandler = (event) => {
  setEnteredName(event.target.value);

  if (enteredName.trim() !== "") {
    setEnteredNameIsValie(true);
  }
};
```

- 이제, `nameInputChangeHandler` 함수에서 입력 값을 검증하게 되었다. 여기에서 참고할 점은 우리가 폼을 제출할 때 사용했던 것처럼 `enteredName` 상태(state)값을 이용해서 유효성을 검증하는 것이 아니라, `event.target.value`를 이용해야 한다는 점이다.

```js
const nameInputChangeHandler = (event) => {
  setEnteredName(event.target.value);

  if (event.target.value.trim() !== "") {
    setEnteredNameIsValie(true);
  }
};
```

- 왜냐하면 `nameInputChangeHandler` 함수에서 `setEnteredName`를 통해서 업데이트해주고 있긴 하지만 이전에 배웠던 것처럼 이러한 상태(state)들은 리액트에서 비동기적으로 처리되기 때문에 즉각적으로 반영되지 않기 때문이다. `setEnteredName` 에서 `event.target.value`를 통해서 `enteredName`을 업데이트하고 있지만 다음 줄이 실행될 때에 이 `enteredName`를 사용한다면 최신의 상태(state)를 반영하지 못하고, 이전의 상태(state)를 참고하게 된다. 따라서 `nameInputChangeHandler` 함수 내부에서 상태를 업데이트 하는데에 사용된 `event.target.value`를 사용해야만 한다.

### 코드의 문제점

- 이제 포커스를 잃는 순간이나 폼을 제출하는 순간 값의 유효성을 검증하여 유효하지 않다면 에러 메세지를 띄우며, 사용자는 즉각적인 피드백을 얻게 되고 동시에 키 입력에 따라 에러를 고칠 수 있게 되었다. 사용자 경험 측면에서 분명히 많은 것들이 좋아졌지만 input 요소 하나에 엄청나게 많은 코드들이 중복되어 사용되고 있다는 점에서 분명 좋은 코드라고 말하기는 어려울 것이다.

### 중복된 코드를 정리하기

- 해당 코드의 문제점은 무엇일까? 먼저 반복되는 코드 로직이 많다는 것이다. 유효성 검증에 따른 코드만으로도 이미 많은 줄을 차지하게 되었는데, 보통의 어플리케이션이라면 이보다 더 많은 로직들이 추가될 것이니 확실히 지금까지는 좋은 코드라 말하긴 힘들 것이다. 그러니 중복된 코드를 제거하고 불필요하게 길어진 코드들을 정리할 필요가 있다. 최종적으로 우리가 해야하는 것은 입력 값이 유효한지를 확인하고 사용자가 입력창을 건드렸는지 또한 확인하며 값이 유효하지 않은 상태로 입력창을 건드렸을 때 사용자에게 에러를 보여주거나 보여주지 않는 등의 일일 것이다. 그리고 이러한 목표를 위해서 우리는 굳이 `enteredNameIsValid`를 사용할 필욘 없다.

```js
const [enteredName, setEnteredName] = useState("");
const [enteredNameIsValid, setEnteredNameIsValie] = useState(false);
const [enteredNameTouched, setEnteredNameTouched] = useState(false);
```

- 먼저 이제는 필요하지 않은 `useEffect` 함수부터 지워주자.

```js
// useEffect(() => {
//   if (enteredNameIsValid) {
//     // true 일 때
//     console.log("Name Input Is valid!"); // 콘솔에 출력한다
//   }
// }, [enteredNameIsValid]);
```

- 대신 `enteredNameIsValid` 상태를 제거하고, 동일한 이름의 상수를 추가한다.

```js
const [enteredName, setEnteredName] = useState("");
const [enteredNameTouched, setEnteredNameTouched] = useState(false);

const enteredNameIsValid;
```

- 이제 우리는 `enteredName`와 `enteredNameTouched` 상태만 사용한다. 왜냐하면 `enteredNameIsValid` 는 어쨌든 `enteredName` 라는 상태로부터 얻어낼 수 있는 값이기 때문이며, 새로운 값이 입력될 때마다 이 전체 컴포넌트가 다시 실행되기 때문에 `enteredNameIsValid`의 값은 가장 최신의 `enteredName`와 가장 최신의 `setEnteredNameTouched` 상태를 반영하게 되기 떄문이다. 어쨌든 이 두 상태 중 하나라도 업데이트 된다면, 해당 컴포넌트는 리렌더링 될 것이다.

```js
const [enteredName, setEnteredName] = useState("");
const [enteredNameTouched, setEnteredNameTouched] = useState(false);

const enteredNameIsValid = enteredName.trim() !== "";
```

- 상수 `enteredNameIsValid`의 값에는 `enteredName` 상태 값에 공백을 제거한 값이 빈 문자열이 아닐 때 true 일 수 있게끔 작성해준다. `enteredNameIsValid`의 조건식 값이 true 라면 `enteredNameIsValid`도 true인 셈이다. 그리고 이제 더이상 `enteredNameIsValid`를 상태로 관리해주지 않고 있기 때문에 `setEnteredNameIsValid`가 사용된 모든 코드를 지울 수 있게 된다.

```js
const enteredNameIsValid = enteredName.trim() !== "";

const nameInputChangeHandler = (event) => {
  setEnteredName(event.target.value);
};
```

- 왜냐하면 이 값을 이미 존재하는 상태(state)로 부터 얻어내기에 충분하기 때문이다.

```js
const nameInputChangeHandler = (event) => {
  setEnteredName(event.target.value);

  if (event.target.value.trim() !== "") {
    setEnteredNameIsValie(true);
  }
};
```

- `nameInputBlurHandler` 함수는 어떨까? 여기에서도 결국엔 유효성 검증이 필요 없으니, 이 부분을 삭제할 수 있게 된다.

```js
const enteredNameIsValid = enteredName.trim() !== "";
const nameInputIsInvalid = !enteredNameIsValid && enteredNameTouched;

const nameInputBlurHandler = (event) => {
  setEnteredNameTouched(true);
};
```

- 대신 `enteredName` 상태(state)를 통해서 얻은 `enteredNameIsValid`과 논리연산을 통해 얻은 `nameInputIsInvalid`를 사용하면 되기 때문이다.

```js
const [enteredName, setEnteredName] = useState("");
const [enteredNameTouched, setEnteredNameTouched] = useState(false);

const enteredNameIsValid = enteredName.trim() !== "";
const nameInputIsInvalid = !enteredNameIsValid && enteredNameTouched;
```

- 이렇게 아래 두 줄은 함께 작동한다. 먼저 `enteredName`이 유효한지를 확인하고(`enteredNameIsValid`) 유효하지 않다면, `enteredNameTouched`와 조합(`nameInputIsInvalid`) 한다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();
  setEnteredNameTouched(true);

  if (enteredName.trim() === "") {
    setEnteredNameIsValie(false);
    return;
  }

  setEnteredNameIsValie(true);
  setEnteredName("");
};
```

- 이제 `enteredNameIsValid`라는 상태(state)는 사라졌다. 폼을 제출하는 함수인 `formSubmitssionHandler` 역시 수정할 필요가 있을 것이다. 하지만 입력 값이 유효하지 않을 때 해당 함수를 중단해야 하기 때문에 조건문은 유지해야 한다. 그렇기에 유효성을 바꿔주는 대신에 사라진 상태 업데이트 값인 `setEnteredNameIsValie`를 사용한 로직은 모두 지워주고, 조건식에 `enteredNameIsValid`가 false 인지만 확인하면 된다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();
  setEnteredNameTouched(true);

  if (!enteredNameIsValid) {
    return;
  }

  setEnteredName("");
};
```

- 이제 `enteredNameIsValid`가 false 라면, 해당 함수가 중단될 수 있도록 return 해주었다. `formSubmitssionHandler` 함수는 컴포넌트가 리렌더링 될 때마다 다시 생성되며, 따라서 `formSubmitssionHandler`은 매번 `enteredNameIsValid`의 최신 값을 가져오게 된다.

![ezgif com-gif-maker (96)](https://user-images.githubusercontent.com/53133662/173348724-71214c32-8d0a-4368-b019-521e6ad91275.gif)

- 저장하고, 새로고침 한 뒤에 값을 적어 Submit 버튼으로 폼을 제출하고 나면 제대로 된 값을 제출했음에도 에러 메세지가 뜨는 걸 확인할 수 있다. 이는 버그가 아니라, 우리가 작성한 코드의 결과일 뿐이니 수정이 필요하다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();
  setEnteredNameTouched(true);

  if (!enteredNameIsValid) {
    return;
  }

  setEnteredName("");
};
```

- 폼을 제출하는 `formSubmitssionHandler` 함수를 보면, 유효성 검증이 끝난 후로 그러니까 유효성 검증에서 true가 되었을 때 값은 제출되면서 `setEnteredName` 를 통해 빈 값으로 초기화 해주었다. 그러니까 유효성 검사에서 빈 값일 때 에러 메세지가 출력되도록 우리가 지정해놓았기에 발생한 문제이다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();
  setEnteredNameTouched(true);

  if (!enteredNameIsValid) {
    return;
  }

  setEnteredName("");
  setEnteredNameTouched(false);
};
```

- 이를 해결하기 위해서는 폼이 제출되고 난 후로 `setEnteredNameTouched` 를 통해서 값을 false 로 초기화해주면 된다. `setEnteredName`을 통해 폼이 제출되고 빈 문자열이 만들어지면, 그 다음에 바로 `setEnteredNameTouched`로 초기화를 하는 것이다. 폼이 제출되고 난 뒤에는 새로운 폼으로 돌아가서 사용자가 건드리지 않은 가장 최초의 상태와 같이 작동해야만 하기 때문이다.

![ezgif com-gif-maker (97)](https://user-images.githubusercontent.com/53133662/173349637-a15be5f6-fef3-4f43-a6b1-c2bc0445b6f1.gif)

- 저장 후 새로고침해보면 폼을 제출해도 더이상 에러 메세지가 뜨지 않는 걸 볼 수 있다.

### 정리

- 지금까지 작성한 코드를 보면 확실히 이전보다 코드가 간단해져서 훨씬 더 읽기 쉽고 관리하기 쉬운 코드가 된 것을 알 수 있다. 여러 상태(state)를 이용하는 것을 두 개의 상태로 줄이고, 반복되는 로직 역시 논리 연산자를 통해 작성한 상수를 이용해서 유효성을 도출할 수 있게 되었다.

</br>

## 전체 양식 유효성 관리하기

- 우리가 지금까지 유효성 검증을 위한 로직들을 작성했고, 꽤나 만족스럽게 로직이 정상적으로 작동되는 것까지 확인했다. 하지만 우리가 잊지 말아야 할 사실이 있다. 우리가 작성한 것은 겨우 전체 폼 중에 하나의 input 값의 유효성 검증이라는 사실이다. 지금 우리의 어플리케이션은 하나의 input 창으로 하나의 입력 값을 받고 있지만 많은 경우에는 폼에서 다양한 입력 값을 받아야 한다.

![image](https://user-images.githubusercontent.com/53133662/173364856-25f9e08b-548d-410f-b993-5a199b18d890.png)

- 일단 먼저 지금 우리가 보고 있는 `SimpleInput` 컴포넌트를 살펴보면, 여기에서 전체 폼이 유효한지 아닌지를 확인할 수 있으면 더 좋을 것 이다.

### 전체 폼의 유효성 검증하기

- 입력 값이 하나만 있을 때는 하나만 유효하다면 전체 폼이 유효한 것이지만, 만약 여러 입력 값이 있고 이에 대한 유효성 검증이 저마다 다르다면 전체 폼은 유효하지 않을 것이다. 왜냐하면 전체 폼이 유효하기 위해서는 모든 입력 값이 유효해야 하기 때문이다. 따라서 하나의 입력 값이라도 유효하지 않은 순간 전체 폼은 유효하지 않도록 처리해줘야 한다.

```js
const [formIsValid, setFormIsValid] = useState(false);
```

- 한가지 방법은 `formIsValid` 상태(state)를 추가하는 것이다. 초기 값은 false로 지정해놓고, `formIsValid` 상태의 값을 폼에 있는 input 값이 변화할 때마다 업데이트 되도록 해준다. 그리고 이를 위해서 다시 `useEffect`를 사용할 것이다.

```js
const enteredNameIsValid = enteredName.trim() !== "";

useEffect(() => {
  if (enteredNameIsValid) {
  }
}, [enteredNameIsValid]);
```

- `useEffect`를 호출해서 전체 폼의 유효성을 설정한다. 이를 위해서는 폼의 입력 값의 유효성이 필요하므로, 폼에 있는 모든 입력 값의 유효성을 의존성 배열에 추가하도록 한다.

```js
useEffect(() => {
  if (enteredNameIsValid) {
    setFormIsValid(true);
  } else {
    setFormIsValid(false);
  }
}, [enteredNameIsValid]);
```

- `enteredNameIsValid` 와 `if` 문을 사용해서 추가한다. 만약 폼 안에 입력 값이 두개라면 의존성 배열과 if 문 안에서 또 다른 상수 값을 추가하면 될 것이다. 앞서 배웠던 대로 의존성 배열에 들어가는 값이 바뀔 때마다 `useEffect`는 다시 실행될 것이다. 따라서 `useEffect` 호출에서는 모든 의존성 값들을 합친 뒤에 이 값이 모두 유효한지를 확인하고, 만약 입력 값 모두가 유효하다면 전체 폼 또한 유효하다(`setFormIsValid(true)`)고 설정해준다. 그리고 하나라도 유효하지 않다면, 전체 폼 또한 유효하지 않다(`setFormIsValid(false)`)고 설정해준다.

### `formIsValid` 상태(state)를 이용한 버튼 비활성화

- 이제 `formIsValid` 상태를 사용할 수 있게 되었다. 예를 들면, 버튼을 `formIsValid`의 상태 값에 따라 비활성화할 수도 있을 것이다.

```js
<button disabled={!formIsValid}>Submit</button>
```

- 만약 `formIsValid`이 false 라면(폼이 유효하지 않다면), 버튼 태그에 `disabled` 라는 속성이 작동될 수 있도록 한다.

#### index.css

```css
button:disabled,
button:disabled:hover,
button:disabled:active {
  background-color: #ccc;
  color: #292929;
  border-color: #ccc;
  cursor: not-allowed;
}
```

- 이를 가시화해주기 위해서 버튼이 `disabled` 되었을 때의 스타일링도 설정해준다.

![ezgif com-gif-maker (98)](https://user-images.githubusercontent.com/53133662/173369220-ddc4ab2e-222f-4ae6-a4c5-800231487cea.gif)

- 이제 시작할 때 버튼이 비활성화 되어 있는 걸 확인할 수 있다. 빈칸으로만 두어도 비활성화 되어 있지만 유효한 글자를 하나라도 입력하면 다시 버튼이 활성화되고, 글자를 모두 지우고 빈칸으로 두면 다시 버튼은 비활성화 된다.

### 값이 유효하지 않으면 폼이 제출될 수도 없다.

- 이제는 값이 유효하지 않으면, 폼을 제출할 수도 없게 되었다. 이런 경우 버튼의 비활성화 여부는 선택에 달려있다. 이 시점에 대해 의견이 분분하며, 어떤 사람들은 사용자가 무엇을 입력해야할 지도 모르는 상태에서 유효하지 않은 값이라도 제출할 수 있도록 해야 한다고 주장하기도 하기 때문이다. 다만 이것은 선택의 문제이며, 언제든 목적과 요구에 따라 이 시점은 변경할 수 있다.

### `useEffect`를 꼭 사용해야만 할까?

```js
useEffect(() => {
  if (enteredNameIsValid) {
    setFormIsValid(true);
  } else {
    setFormIsValid(false);
  }
}, [enteredNameIsValid]);
```

- 사실 이 로직을 조금만 더 살펴보면 이는 어떠한 효과(`effect`)도 없기 때문에 `useEffect`를 사용할 필요가 없다는 걸 알 수 있다. 또한 `useEffect` 없이도 그 어떤 문제도 발생하지 않는다는 사실도 말이다.

```js
const enteredNameIsValid = enteredName.trim() !== "";
const nameInputIsInvalid = !enteredNameIsValid && enteredNameTouched;
```

- 따지고보면 `useEffect` 내부에서 실행하고 있는 현 로직들은 위의 `enteredNameIsValid` 나 `nameInputIsInvalid`와 거의 동일한 방법으로 값을 얻고 있다. 즉 완전히 같은 작업이라 말할 수도 있는데, 다만 `useEffect` 내부의 로직들은 폼 전체에 대한 로직이라는 차이가 있을 뿐이다. 결론적으로 지금 `useEffect`를 사용할 수는 있지만 이득은 없으며, 재평가를 할 때 추가적인 컴포넌트만 생길 뿐이다. 그리고 이는 확실히 손해이다. 이렇게 하는 대신 우리는 다른 방법으로 접근할 수 있다.

```js
const [formIsValid, setFormIsValid] = useState(false);

useEffect(() => {
  if (enteredNameIsValid) {
    setFormIsValid(true);
  } else {
    setFormIsValid(false);
  }
}, [enteredNameIsValid]);
```

- `formIsValid` 상태(state)와 `useEffect`를 제거하고,

```js
let formIsValid = false;

if (enteredNameIsValid) {
  formIsValid = true;
} else {
  formIsValid = false;
}
```

- 단순히 `formIsValid` 이라는 동일한 이름의 변수를 추가해서 기본값을 false로 둔 뒤, `if` 문 내부에 단순하게 조건문이 참이면 true로 할당하고, 조건문이 거짓이면 false 로 할당하도록 작업해주었다.

```js
let formIsValid = false;

if (enteredNameIsValid) {
  formIsValid = true;
}
```

- 사실 `else` 문도 필요 없다. 모든 값이 true 일 때에만 `formIsValid` 변수가 true 이기만 하면 되기 때문이다. 이제 코드는 동일한 기능을 수행하지만 이전 보다 간결해졌고 `useEffect`를 통한 쓸데 없는 낭비가 사라지며 한결 가벼워졌다.

</br>

## 사용자 지정 입력 훅 추가하기

#### SimpleInput.js

```js
const [enteredName, setEnteredName] = useState("");
const [enteredNameTouched, setEnteredNameTouched] = useState(false);

const [enteredEmail, setEnteredEmail] = useState("");
const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);

const enteredNameIsValid = enteredName.trim() !== "";
const nameInputIsInvalid = !enteredNameIsValid && enteredNameTouched;

const enteredEmailIsValid =
  enteredEmail.trim() !== "" && enteredEmail.includes("@");
const emailInputIsInvalid = !enteredEmailIsValid && enteredEmailTouched;

let formIsValid = false;

if (enteredNameIsValid && enteredEmailIsValid) {
  formIsValid = true;
} else {
  formIsValid = false;
}

const nameInputChangeHandler = (event) => {
  setEnteredName(event.target.value);
};

const emailInputChangeHandler = (event) => {
  setEnteredEmail(event.target.value);
};

const nameInputBlurHandler = () => {
  setEnteredNameTouched(true);
};

const emailInputBlurHandler = () => {
  setEnteredEmailTouched(true);
};

const formSubmitssionHandler = (event) => {
  event.preventDefault();
  setEnteredNameTouched(true);
  setEnteredEmailTouched(true);

  if (!enteredNameIsValid || !enteredEmailIsValid) {
    return;
  }

  setEnteredName("");
  setEnteredNameTouched(false);

  setEnteredEmail("");
  setEnteredEmailTouched(false);
};

const nameInputClasses = nameInputIsInvalid // true 이면,
  ? "form-control invalid" // 경고 css
  : "form-control";

const emailInputClasses = emailInputIsInvalid // true 이면,
  ? "form-control invalid" // 경고 css
  : "form-control";
```

- 현재 `SimpleInput` 컴포넌트 코드를 보면, 정상적으로 작동이 되고 있지만 중복되는 로직이 많은 걸 알 수가 있다. 물론 상수 이름과, 로직의 디테일은 다르지만 전반적인 로직의 구조는 사실상 완전히 같은 것이나 다름 없기 때문이다. 만약 최소 세개의 input이 있을 때 최종적으로는 똑같은 구조를 가진 코드를 세 번이나 반복해야만 할 것이다. 그렇다면, 이런 중복된 코드들을 어떻게 하면 줄일 수 있을까? 물론, input 에 대한 컴포넌트를 만들어서 관련된 로직들을 그 컴포넌트로 분리해서 사용할 수 있을 것이다. 그리고 그 컴포넌트 마다 유효성 검증 로직과 상태(state)를 따로 관리해서 사용하면 꽤 괜찮을지도 모른다. 하지만 이것도 컴포넌트를 분리했을 뿐이지, 복잡한 전체적인 폼을 관리하기에는 어딘가 석연치 않다.

### 전체 폼의 유효성을 관리하는 것이 해결책이다

- 우리의 해결 포인트는 전체 폼의 유효성을 관리하는 것에 있다. 전체 폼의 유효성을 관리하는 것이 까다로운 이유는 모든 입력을 개별적인 것으로 다루는데 각각의 입력에 대한 유효성을 체크하면서도 전체 폼이 유효한지 알 수 있는 방법이 필요하기 때문이다. 만약 컴포넌트로 분리해서 관리한다면, 이는 prop을 통해 컴포넌트에서 호출하는 방식을 사용하면 해결될 것이다. 하지만 이보다 더 나은 방식이 있다. 그것은 바로 커스텀 훅을 사용하는 것이다.

### 커스텀 훅을 이용해서 상태에 관련된 모든 로직을 관리하자

- 우리가 앞서 커스텀 훅을 학습했을 때를 기억해보자. 커스텀 훅을 이용한다면, 상태에 관련된 로직을 아웃소싱 해서 커스텀 훅을 import 해서 사용하는 컴포넌트 로직은 훨씬 간결하게 사용할 수 있다.

### 커스텀 훅 생성하기

#### use-input.js

```js
const useInput = () => {};

export default useInput;
```

- 먼저 `hooks` 폴더를 만들고, `use-input.js`라는 파일을 생성한다. 이 `use-input.js` 파일은 상태(state)를 다루는 훅과 input에 대한 로직을 담을 것이다. 파일 안에 `useInput` 이라는 훅을 만들고, 외부에서 import 해올 수 있도록 export 도 해준다. `useInput` 이라는 커스텀 훅을 이용해서 input 값과 input 창이 touched 되었는지에 대한 상태를 다룰 것이다. 그리고 이 둘을 조합해 유효성 또한 검증할 것이다. 해당 커스텀 훅은 유연하게 작동할 수 있어야 하기 때문에, 외부에서 정확한 검증 로직을 커스텀 훅에서 전달 받을 수 있도록 해야만 한다.

```js
import { useState } from "react";

const useInput = () => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredNameTouched, setEnteredNameTouched] = useState(false);
};
```

- 먼저, `SimpleInput` 컴포넌트에서 `name`에 대한 input 상태(state)를 관리해주던 상태들을 복사해서 긁어온다. 그리고 이 상태들은 유연하게 작동되어야 하기 때문에 조금 더 포괄적이고 일반적인 이름으로 수정해준다.

```js
const useInput = () => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  // const enteredNameIsValid = enteredName.trim() !== "";
  // const nameInputIsInvalid = !enteredNameIsValid && enteredNameTouched;
  const valueIsValid = enteredName.trim() !== "";
  const hasError = !valueIsValid && isTouched;
};
```

- 유효성에 대한 값들인 `enteredNameIsValid`와 `nameInputIsInvalid`도 `SimpleInput` 컴포넌트에서 긁어와 이전의 방식처럼 일반적인 이름으로 수정해준다.

```js
const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  // const valueIsValid = enteredName.trim() !== "";
  const valueIsValid = validateValue();
  const hasError = !valueIsValid && isTouched;
};
```

- `valueIsValid` 같은 검증 로직의 경우 하드 코딩을 지양해야 하고(외부의 컴포넌트에서 유효성 검증에 대한 정확한 로직을 받아와야 하기 때문에.) 훅이 사용되는 곳에서 어떤 검증 로직을 사용할지 가져와야하기 때문에 `useInput` 커스텀 훅에서 `validateValue` 이라는 매개변수(함수가 될 것이다)를 받아와 호출하도록 한다.

```js
const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(validateValue);
  const hasError = !valueIsValid && isTouched;
};
```

- 그리고 외부의 컴포넌트로부터 받는 매개변수 `validateValue` 함수 안에 `enteredValue`를 입력해 실행한 값이 될 수 있도록 작성해준다.

```js
const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;

  return {
    value: enteredValue,
    hasError: hasError, // hasError 하나만 써도 된다.
  };
};
```

- 이제 `useInput` 커스텀 훅은 무언가를 return(반환) 해줘야 하는데, 이는 객체가 될 수도 배열이 될 수도 있음을 기억하자. 어쨌든 현재는 하나 이상의 값을 커스텀 훅에서 반환해야 하기 때문에 객체로 반환하도록 하고, 여기서 반환하는 객체 안에는 반환해야 하는 것들의 이름을 키, 반환하는 값들을 값으로 넣고 외부에서 그 키 값으로 접근할 수 있도록 한다. 물론, 같은 이름을 키와 값으로 사용한다면 모던 자바스크립트의 문법으로 한 번만 사용해도 동일한 작동원리로 반환된다. 이제 외부의 컴포넌트에서 해당 커스텀 훅의 `setEnteredValue`와 `setIsTouched`를 사용할 방법이 필요하다.

```js
import { useState } from "react";

const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;

  // const nameInputChangeHandler = (event) => {
  //   setEnteredName(event.target.value);
  // };
  const valueChangeHandler = (event) => {
    setEnteredValue(event.target.value);
  };

  // const nameInputBlurHandler = () => {
  //   setEnteredNameTouched(true);
  // };
  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  return {
    value: enteredValue,
    hasError: hasError,
  };
};
```

- 이를 위해서, `SimpleInput` 컴포넌트에서 사용하던 `nameInputChangeHandler`와 `nameInputBlurHandler` 함수를 그대로 긁어와 붙여 넣어준다. `SimpleInput` 컴포넌트에서 사용하던 상태 업데이트 함수의 이름은 커스텀 훅에서 변경되었기에 이 부분도 수정해준다. 그리고 이전처럼 조금 더 일반적인 이름 `valueChangeHandler`, `inputBlurHandler` 으로 수정한다.

```js
return {
  value: enteredValue,
  hasError: hasError,
  valueChangeHandler: valueChangeHandler,
  inputBlurHandler: inputBlurHandler,
};
```

- 물론, 외부 컴포넌트에서 해당 커스텀 훅의 함수를 사용하기 위해서는 반환(return)하는 것을 잊으면 안될 것이다. 이렇게 커스텀 훅에서 정의된 함수들은 커스텀 훅을 사용하는 컴포넌트에서 호출할 수 있게 되었다.

### 커스텀 훅 사용하기

- `useInput` 커스텀 훅을 사용할 컴포넌트인 `SimpleInput` 컴포넌트로 이동하여, import 해준다.

```js
import useInput from "../hooks/use-input";

const SimpleInput = (props) => {
  const {} = useInput();
  ...
};
```

- `useInput`를 호출하고, 이제 객체 구조 분해 할당을 사용해서 해당 커스텀 훅에서 객체 형식으로 반환된 값들을 추출한다.

```js
const SimpleInput = (props) => {
    const {
    value: enteredName,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput();
  ...
};
```

- `value`란 이름으로 반환한 값에 `enteredName`을 할당한다. 그리고 `hasError`는 `nameInputHasError`라는 이름으로 할당한다. (여기서 값으로 들어가는 이름은 우리가 사용하는 컴포넌트 내부에서 사용하는 것이니, 직관적으로 보여지도록 작성해주면 더 좋다.) 나머지 반환하는 함수들인 `valueChangeHandler`와 `inputBlurHandler`도 각각의 사용할 이름을 지어서 입력해준다.

```js
const SimpleInput = (props) => {
    const {
    value: enteredName,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput();
  ...
};
```

- 이제 우리가 뭘 해야 할까? 이전에 우리가 `useInput` 커스텀 훅에서 받아오기로 한 매개변수를 기억할 것이다. 외부 컴포넌트에서 해당 커스텀 훅을 사용할 때 어떤 매개변수를 넘겨주기로 약속했으니, 이를 작성해보자.

#### use-input.js

```js
const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;
...
}
```

### 커스텀 훅에 전달하는 매개변수로 인라인 함수를 정의하기

- 우리는 `useInput()` 커스텀 훅을 호출하면서 매개변수를 넘겨주기로 했다. 그리고 이를 위해서 우리는 인라인 함수를 정의할 수 있다.

#### SimpleInput.js

```js
const SimpleInput = (props) => {
    const {
    value: enteredName,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput((value) => value.trim() !== "");
  ...
};
```

- `useInput` 커스텀 훅에 넘겨주는 매개변수에 `value`를 입력 받아 빈 문자열을 비교한 결과를 출력하는 `value.trim() !== ""` 을 정의하자. 이는 화살표 함수를 사용해서 매개변수로 넘겨준 것인데, 이 컴포넌트에서는 인라인 함수로 정의만 되고 실행되지 않으며 그저 `useInput`에 전달할 뿐이다. 이는 커스텀 훅인 `useInput`에서 전달 받기로 한 `validateValue` 매개변수로 전해지고,

```js
import { useState } from "react";

const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  ...
  const valueIsValid = validateValue(enteredValue);
  ...
};
```

- `useInput` 커스텀 훅의 내부인 `valueIsValid` 라는 변수의 값으로 할당한 `validateValue()`가 호출 되었을 때 비로소 인라인 함수가 실행된다는 의미이다. 그리고 `enteredValue` 상태(state)는 해당 커스텀 훅에서 다루는 상태이기 때문에 `validateValue()` 가 호출되었을 때 `value` 가 되어 실행된다.

  > 여기서 의미하는 `value` 는 `useInput((value) => value.trim() !== "")` 에서 인라인 함수가 전달받아 처리하는 `value`를 의미하는 것이다.

- 이는 결국 함수를 다른 함수의 입력 값으로 넣는 자바스크립트의 문법일 뿐이다. 이를 통해서 해당 커스텀 훅이 필요한 컴포넌트가 유효성 검증 로직을 바꾸고 그 검증 로직을 커스텀 훅 안에서 실행될 수가 있는 것이다. 유효성에 대한 정보 또한 외부 컴포넌트에서 사용되어야 하기 때문에 이 역시 반환해주도록 한다.

```js
const useInput = (validateValue) => {
  ...

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;

  ...

  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError: hasError,
    valueChangeHandler: valueChangeHandler,
    inputBlurHandler: inputBlurHandler,
  };
};
```

- 입력 값이 유효한지에 대한 값 `valueIsValid`를 `isValid`라는 이름으로 반환하고,

#### SimpleInput.js

```js
const SimpleInput = (props) => {
  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInput((value) => value.trim() !== "");

  // 상태 로직
  // const [enteredName, setEnteredName] = useState("");
  // const [enteredNameTouched, setEnteredNameTouched] = useState(false);

  // 유효성 검증 로직
  // const enteredNameIsValid = enteredName.trim() !== "";
  // const nameInputIsInvalid = !enteredNameIsValid && enteredNameTouched;

  let formIsValid = false;

  if (enteredNameIsValid && enteredEmailIsValid) {
    formIsValid = true;
  } else {
    formIsValid = false;
  }

  // const nameInputChangeHandler = (event) => {
  //   setEnteredName(event.target.value);
  // };

  // const nameInputBlurHandler = () => {
  //   setEnteredNameTouched(true);
  // };
};
```

- 다시 `SimpleInput` 컴포넌트로 돌아와서, `isValid`를 추출하여 `enteredNameIsValid` 라는 이름으로 할당한다. 이렇게 수정을 해주면, 현재 컴포넌트에서 name 에 대한 상태(state)를 관리하던 로직을 전부 지워도 전체 폼의 유효성을 검사하는 아래의 로직에서 `enteredNameIsValid`를 사용할 수 있게 된다. 물론 나머지 `nameInputChangeHandler`와 `nameInputBlurHandler` 함수도 커스텀 훅에서 처리하는 로직이기 때문에 모두 지워준다.

```js
<input
  type="text"
  id="name"
  // onChange={nameInputChangeHandler}
  // onBlur={nameInputBlurHandler}
  onChange={nameChangeHandler}
  onBlur={nameBlurHandler}
  value={enteredName}
/>
```

- 그리고 지워진 해당 함수를 사용하던 `input` 태그 속성에 우리가 커스텀 훅에서 반환한 함수들을 추출하면서 이름으로 지정해주었던 `nameChangeHandler`와 `nameBlurHandler` 함수를 각각의 이벤트 값으로 할당하고, `value`도 `enteredName`으로 할당한다.

```js
// {
//   nameInputIsInvalid && <p className="error-text">Name must not be empty.</p>;
// }

{
  nameInputHasError && <p className="error-text">Name must not be empty.</p>;
}
```

- 그리고 아래의 경고 메세지를 띄우는 로직에 사용하던 `nameInputIsInvalid` 대신 우리가 커스텀 훅에서 추출한 `nameInputHasError`를 대신 넣어준다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();
  // setEnteredNameTouched(true);
  // setEnteredEmailTouched(true);

  if (!enteredNameIsValid || !enteredEmailIsValid) {
    return;
  }

  setEnteredName("");
  setEnteredNameTouched(false);

  setEnteredEmail("");
  setEnteredEmailTouched(false);
};
```

- 폼을 제출하는 함수인 `formSubmitssionHandler` 또한 수정이 필요하다. 해당 함수에서는 상태(state)를 변경해주고, 폼을 초기화 해주고 있다. 먼저, 입력 값이 유효하지 않다면 제출 조차 되지 않도록 우리가 설정해주었기 때문에 `setEnteredNameTouched(true)`나 `setEnteredEmailTouched(true)`처럼 input 창을 사용자가 건드렸는지에 대한 여부를 체크할 필요가 없기에 삭제해준다. 그리고 아래의 폼을 초기화해주는 로직 역시 반복되고 있으므로 이 부분도 커스텀 훅에 아웃소싱 해주는 게 좋겠다.

```js
const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  ...
  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
  value: enteredValue,
  isValid: valueIsValid,
  hasError: hasError,
  valueChangeHandler: valueChangeHandler,
  inputBlurHandler: inputBlurHandler,
  reset: reset,
  };
};
```

- `useInput` 커스텀 훅으로 돌아와, 세 번째 함수 `reset()`을 추가하고 `enteredValue`와 `isTouched`를 초기화 해준 뒤, 해당 함수도 동일한 이름으로 반환해준다.

```js
const SimpleInput = (props) => {
  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    // ⚡️
    reset: resetNameInput,
    // ⚡️
  } = useInput((value) => value.trim() !== "");
  ...


    const formSubmitssionHandler = (event) => {
    event.preventDefault();
    if (!enteredNameIsValid || !enteredEmailIsValid) {
      return;
    }
    // ⚡️
    resetNameInput();
    // ⚡️
    setEnteredEmail("");
    setEnteredEmailTouched(false);
  };
};
```

- `SimpleInput` 컴포넌트에서 역시나 이전과 마찬가지로 해당 커스텀 훅에서 반환한 `reset` 함수를 `resetNameInput`라는 이름으로 할당하고 `formSubmitssionHandler` 폼 제출 함수 내부에서 `resetNameInput()`를 호출해서 초기화해줄 수 있도록 한다.

```js
const nameInputClasses = nameInputHasError // true 이면,
  ? "form-control invalid" // 경고 css
  : "form-control";
```

- 마지막으로, input 창의 css 클래스를 정하는 곳에서 `nameInputIsInvalid` 대신 커스텀 훅에서 가져온 `nameInputHasError`를 대체하여 수정해준다.

![ezgif com-gif-maker (100)](https://user-images.githubusercontent.com/53133662/174330102-a694e171-8ea5-4b85-bed3-af23e74b4ee6.gif)

- 저장하고 새로고침하면, name input 창은 이전과 같은 방식으로 작동하고, 전체 폼에 대한 유효성 검증 역시 전과 동일한 것을 알 수 있다.

  </br>

## 사용자 정의 훅 재사용하기

- `name`에 Input에 대해서 `use-input` 커스텀 훅을 이용한 것처럼, 동일하게 복사해서 해당 `useInput` 커스텀 훅을 가져오고, `name`에 적용한 것처럼 커스텀 훅에서 반환한 값들의 이름을 `email` 전용으로 수정해준다.

```js
// name
const {
  value: enteredName,
  isValid: enteredNameIsValid,
  hasError: nameInputHasError,
  valueChangeHandler: nameChangeHandler,
  inputBlurHandler: nameBlurHandler,
  reset: resetNameInput,
} = useInput((value) => value.trim() !== "");

// e-mail
const {
  value: enteredEmail,
  isValid: enteredEmailIsValid,
  hasError: emailInputHasError,
  valueChangeHandler: eamilChangeHandler,
  inputBlurHandler: eamilBlurHandler,
  reset: resetEmailInput,
} = useInput((value) => value.trim() !== "" && value.includes("@"));
```

- 그리고 더이상 사용하지 않는 `useState`로 작성했던 값과 해당 컴포넌트 내에서만 사용했던 전용 함수들을 모두 지워준다.

```js
// const [enteredEmail, setEnteredEmail] = useState("");
// const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);

// const enteredEmailIsValid =
//   enteredEmail.trim() !== "" && enteredEmail.includes("@");
// const emailInputIsInvalid = !enteredEmailIsValid && enteredEmailTouched;
```

- 폼을 제출할 때에 유효성을 검증하고, input 창을 리셋해주는 `formSubmitssionHandler` 함수에도 useState를 사용해서 리셋해주었던 부분을 지우고, 커스텀 훅의 리셋 함수인 `resetEmailInput`(`reset`)을 호출해 준다.

```js
const formSubmitssionHandler = (event) => {
  event.preventDefault();

  if (!enteredNameIsValid || !enteredEmailIsValid) {
    return;
  }

  resetNameInput();

  // setEnteredEmail("");
  // setEnteredEmailTouched(false);
  resetEmailInput();
};
```

- `useInput` 커스텀 훅에서 사용하는 `hasError` 변수를 기반으로 삼항연산자를 사용한 class 설정 또한 커스텀 훅에서 가져온 `emailInputHasError`으로 수정해준다.

```js
const emailInputClasses = emailInputHasError // true 이면,
  ? "form-control invalid" // 경고 css
  : "form-control";
```

- `email`을 입력하는 input 태그에 포인터 해주었던 함수도 `useInput` 커스텀 훅의 함수들로 대체해준다. 아래의 삼항연산자를 이용한 부분도 `emailInputHasError`로 수정해준다.

```js
<input
  type="email"
  id="email"
  onChange={eamilChangeHandler}
  onBlur={eamilBlurHandler}
  value={enteredEmail}
/>;
{
  emailInputHasError && <p className="error-text">Email must not be empty.</p>;
}
```

### 정리

- 저장하고 확인해보면 이전과 동일하게 작동되고 있음을 알 수 있다. 둘다 이전과 동일하게 작동하고 있지만 현재의 코드와 비교하여 알수 있는 것은 현재의 코드가 훨씬 간결하고 중복된 코드가 적어졌다는 사실이다.

</br>

## 당신을 위한 도전

- 지금까지 배운 내용을 바탕으로 `SimpleInput` 컴포넌트 대신, `BasicForm` 컴포넌트를 이용해서 이전처럼 커스텀 훅을 이용한 유효성 검증에 도전해볼 것이다.

```js
// import SimpleInput from "./components/SimpleInput";
import BasicForm from "./components/BasicForm";

function App() {
  return (
    <div className="app">
      {/* <SimpleInput /> */}
      <BasicForm />
    </div>
  );
}

export default App;
```

- 가장 먼저, `App` 컴포넌트 내부에 `SimpleInput` 컴포넌트 대신 `BasicForm` 컴포넌트로 대체한다.

#### BasicForm.js

**before**

```js
const BasicForm = (props) => {
  return (
    <form>
      <div className="control-group">
        <div className="form-control">
          <label htmlFor="name">First Name</label>
          <input type="text" id="name" />
        </div>
        <div className="form-control">
          <label htmlFor="name">Last Name</label>
          <input type="text" id="name" />
        </div>
      </div>
      <div className="form-control">
        <label htmlFor="name">E-Mail Address</label>
        <input type="text" id="name" />
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
  );
};

export default BasicForm;
```

**after**

```js
import useInput from "../hooks/use-input";

const BasicForm = (props) => {
  // First Name
  const {
    value: enteredFirstName,
    isValid: enteredFirstNameIsValid,
    hasError: firstNameInputHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameInputBlurHandler,
    reset: resetFirstName,
  } = useInput((value) => value.trim() !== "");

  // Last Name
  const {
    value: enteredLastName,
    isValid: enteredLastNameIsValid,
    hasError: lastNameInputHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameInputBlurHandler,
    reset: resetLastName,
  } = useInput((value) => value.trim() !== "");

  // email
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailInputBlurHandler,
    reset: resetEmail,
  } = useInput((value) => value.trim() !== "" && value.includes("@"));

  let formIsValid = false;

  if (
    enteredFirstNameIsValid &&
    enteredLastNameIsValid &&
    enteredEmailIsValid
  ) {
    formIsValid = true;
  } else {
    formIsValid = false;
  }

  const formSubmitssionHandler = (e) => {
    e.preventDefault();

    if (
      !enteredFirstNameIsValid ||
      !enteredLastNameIsValid ||
      !enteredEmailIsValid
    ) {
      return;
    }

    resetFirstName();
    resetLastName();
    resetEmail();
  };

  const firstNameInputClasses = firstNameInputHasError
    ? "form-control invalid"
    : "form-control";

  const lastNameInputClasses = lastNameInputHasError
    ? "form-control invalid"
    : "form-control";

  const emailInputClasses = emailInputHasError
    ? "form-control invalid"
    : "form-control";

  return (
    <form onSubmit={formSubmitssionHandler}>
      <div className="control-group">
        <div className={firstNameInputClasses}>
          <label htmlFor="name">First Name</label>
          <input
            type="text"
            id="name"
            value={enteredFirstName}
            onChange={firstNameChangeHandler}
            onBlur={firstNameInputBlurHandler}
          />
          {firstNameInputHasError ? (
            <p className="error-text">First Name 이 비어있습니다.</p>
          ) : (
            ""
          )}
        </div>
        <div className={lastNameInputClasses}>
          <label htmlFor="name">Last Name</label>
          <input
            type="text"
            id="name"
            value={enteredLastName}
            onChange={lastNameChangeHandler}
            onBlur={lastNameInputBlurHandler}
          />

          {lastNameInputHasError ? (
            <p className="error-text">Last Name 이 비어있습니다.</p>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={emailInputClasses}>
        <label htmlFor="name">E-Mail Address</label>
        <input
          type="text"
          id="email"
          value={enteredEmail}
          onChange={emailChangeHandler}
          onBlur={emailInputBlurHandler}
        />
        {emailInputHasError ? (
          <p className="error-text">E-Mail 주소가 다릅니다.</p>
        ) : (
          ""
        )}
      </div>
      <div className="form-actions">
        <button disabled={!formIsValid}>Submit</button>
      </div>
    </form>
  );
};

export default BasicForm;
```

</br>

## 우리의 훅와 지식을 새로운 형태에 적용하기

### 추가적으로 수정한 부분

- `useInput`에 전달하는 함수 로직 따로 전역 변수로 빼기.

```js
const isNotEmpty = (value) => value.trim() !== "";
const isEmail = (value) => value.includes("@") && isNotEmpty;

// Name
const {
  value: enteredLastName,
  isValid: enteredLastNameIsValid,
  hasError: lastNameInputHasError,
  valueChangeHandler: lastNameChangeHandler,
  inputBlurHandler: lastNameInputBlurHandler,
  reset: resetLastName,
} = useInput(isNotEmpty);

// email
const {
  value: enteredEmail,
  isValid: enteredEmailIsValid,
  hasError: emailInputHasError,
  valueChangeHandler: emailChangeHandler,
  inputBlurHandler: emailInputBlurHandler,
  reset: resetEmail,
} = useInput(isEmail);
```

- 삼항 연산자가 아니라 `&&`로 로직 간결하게 줄이기

```js
// {
//   firstNameInputHasError ? (
//     <p className="error-text">First Name 이 비어있습니다.</p>
//   ) : (
//     ""
//   );
// }

{
  firstNameInputHasError && (
    <p className="error-text">First Name 이 비어있습니다.</p>
  );
}
```

- 각각의 유효성 값으로 검사하기 보다는 변수 `formIsValid` 값 하나로 검사할 수 있다. `formIsValid`를 이용해서 버튼을 비활성화 했기 때문에 버튼을 비활성화한 상태에서는 애초에 폼을 제출할 수 없기 때문이다.

```js
let formIsValid = false;

if (
  enteredFirstNameIsValid &&
  enteredLastNameIsValid &&
  enteredEmailIsValid
) {
  formIsValid = true;
} else {
  formIsValid = false;
}
...

const formSubmitssionHandler = (e) => {
  e.preventDefault();

  if (
    // !enteredFirstNameIsValid ||
    // !enteredLastNameIsValid ||
    // !enteredEmailIsValid
    !formIsValid
  ) {
    return;
  }

  // first name reset
  resetFirstName();
  // last name reset
  resetLastName();
  // email reset
  resetEmail();
};
```

- 저장하고 확인해보면, `SimpleInput`과 동일한 방식으로 작동하는 걸 알 수 있다.

![ezgif com-gif-maker - 2022-06-23T184410 080](https://user-images.githubusercontent.com/53133662/175269769-c8b5fb91-e86b-47f7-8664-008478432db3.gif)

</br>

## 요약

### Reference

- [A Custom Hook for Managing Forms in React](https://academind.com/tutorials/reactjs-a-custom-useform-hook)

</br>
