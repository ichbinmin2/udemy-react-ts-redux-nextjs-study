# Advanced: Handling Side Effects, Using Reducers & Using the Context API

## 목차

- [What are "Side Effects" & Introducing useEffect](#Side-Effects-와-useEffect)
- [Using the useEffect() Hook](#useEffect-훅-사용하기)
- [useEffect & Dependencies](#useEffect와-종속성)
- [What to add & Not to add as Dependencies](#종속성으로-추가할-항목-및-추가하지-않을-항목)
- [Using the useEffect Cleanup Function](#useEffect에서-Cleanup-함수-사용하기)
- [useEffect Summary](#useEffect-요약)
- [Introducing useReducer & Reducers In General](#useReducer-및-Reducers의-개요)
- [Using the useReducer() Hook](#useReducer-훅-사용해보기)
- [useReducer & useEffect](#useReducer-&-useEffect)
- [Adding Nested Properties As Dependencies To useEffect](#중첩-속성을-useEffect에-종속성으로-추가하기)
- [useReducer vs useState for State Management](#State-관리를-위한-useReducer-VS-useState)
- [Introducing React Context (Context API)](#리액트-Context-API-소개)
- [Using the React Context API](#리액트-컨텍스트-API-사용하기)
- [Tapping Into Context with the useContext Hook](#useContext-훅으로-컨텍스트에-탭핑하기)
- [Making Context Dynamic](#컨텍스트를-동적으로-만들기)
- [Building & Using a Custom Context Provider Component](#사용자-정의-컨텍스트-제공자-구성요소-빌드-및-사용)
- [React Context Limitations](#리액트-컨텍스트-제한)
- [Learning the "Rules of Hooks"](#Hooks의-규칙-배우기)
- [Refactoring an Input Component](#입력-컴포넌트-리팩토링)
- [Diving into "Forward Refs"](#Forward-Refs에-대해-알아보기)

## Side Effects 와 useEffect

- 지금까지 살펴본 React 앱의 컴포넌트들과 React 앱 전체와 React 라이브러리 그 자체의 주요 역할은 UI를 렌더링하는 것에 있었다. 유저의 input에 반응하거나 필요할 때 UI를 다시 렌더링하는 등의 일을 포함해서 말이다. 지금까지 배운 상태(state)와 이벤트 등의 주요 목적은 무언가를 스크린으로 가져와서 유저가 그 무언가와 상호작용할 수 있게 만드는 것이었다. 이를테면 버튼을 클릭한다던가 입력한 텍스트 등을 받아오는 작업을 통해 화면에 나타난 무언가를 특정 이벤트에 따라 바꿀 수 있게 만들어주었다. 그리고 이런 작업은 지금까지의 React와 어플리케이션이 주로 해왔던 일이었다. JSX 코드와 `DOM`을 평가하고 렌더링하고 또 상태(state)와 prop을 관리해서 모든 컴포넌트에 필요한 데이터를 제공하고 그 데이터를 토대로 정확하게 화면에 반영하던 일 말이다. 현재의 React 컴포넌트를 한 번 살펴보자.

### App.js

```js
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginHandler = (email, password) =>
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
  };

  return (
    <React.Fragment>
      <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
    </React.Fragment>
  );
};
```

- `App` 컴포넌트는 함수형 컴포넌트이다. 위에서 아래까지 실행되고 있으며, 상태(state)와 prop 그리고 트리거 함수를 사용하여 해당 함수 안의 모든 것들은 화면으로 가져오는 일에 관여하고 있음을 알 수 있다.

### Side Effect

- 그럼 Side Effects(Effect) 란 무엇일까? 사이드 이펙트(Side Effect)는 어플리케이션에서 벌어지는 모든 일들을 총칭하는 용어이다. 예를 들자면 HTTP 리퀘스트를 보내거나 브라우저 스토리지(or 로컬 스토리지)에 무언가를 저장하는 일 등이 바로 사이드 이펙트에 해당한다. 물론 코드 내에서 세팅하는 타이머나 interval 역시 사이드 이펙트라고 말할 수 있을 것이다. 앞서 거론한 이러한 작업들은 모두 어플리케이션 내부에서 고려되어야 하는 사항이다. HTTP 리퀘스트를 백엔드 서버로 보내야 하는 경우를 생각해보자. (당연히 어플리케이션의 시나리오에 따라 다르겠지만) 어떤 어플리케이션에서는 이런 리퀘스트가 셀 수도 없이 많을지도 모른다. 하지만 놀랍게도 이런 어플리케이션 내부에서 고려되어야 하는 작업들은 모두 화면에 무언가를 가져오거나 그려내는 것과는 관련이 없다. (적어도 직접적으로는 말이다.) 물론 HTTP 리퀘스트를 백엔드 서버에 전송해서 응답을 받을 때마다 화면에 무언가를 그려낼 수도 있겠으나 HTTP 리퀘스트를 전송하는 행위 그 자체는 관련이 없다. HTTP 리퀘스트나 잠재적 error를 관리하는 등등의 일들은 적어도 React가 필요한 일이 아니기 때문이다. (이러한 일들은 보통 React가 관심을 두거나 고려하는 사항도 아니며, 애초에 React의 역할도 아니다.)
- 사이드 이펙트(Side Effect)와 관련된 일들은 일반적인 컴포넌트의 평가 밖에서 일어나야만 한다. 즉 일반적인 컴포넌트 함수 바깥에서 일어날 수 있도록 해야한다는 이야기이다. 여기서 잊지 말아야할 사항 중에 하나는 컴포넌트는 해당 함수 내에서 사용하는 상태(state)가 변할 때마다 React에 의해 자동으로 재실행 된다는 사실이다.

```js
const [isLoggedIn, setIsLoggedIn] = useState(false);
```

- 예시를 살펴보자. 위의 `isLoggedIn` 상태는 변화할 때 마다 혹은 업데이트 될 때마다 `App` 컴포넌트 함수가 재실행될 것이다. React는 상태(state)에 의해서 새로워진 JSX 코드를 살펴보고 이전의 결과와 비교하여 실제 `DOM`으로 보낸 뒤 변경사항을 반영하는 방식으로 매번 재실행하기 때문이다. 즉, 상태(state)가 변화할 때마다 이전의 `DOM`과 비교하여 실질적으로 변화한 부분이 있을 때마다 해당 함수가 자동으로 재실행된다.
- 만약 `App` 컴포넌트에서 HTTP 리퀘스트를 보낸다고 생각해보자. 그러면 `App` 컴포넌트 함수가 상태(state)가 업데이트되어 재실행될 때마다 리퀘스트를 다시 보내게 될 것이다. 물론 이러한 방식을 의도하여 사용할 때도 있지만 재실행 될 때마다 리퀘스트를 매번 다시 보내고 싶지 않을 때도 있을 것이다. 또한 HTTP 리퀘스트에 대한 응답으로 특정한 상태(state)를 바꾸거나 무한 루프를 만들 수도 있을 것이다. 그렇기 때문에 사이드 이펙트(Side Effect)는 컴포넌트 함수에 직접적으로 들어가서 실행되면 안될 것이다. 컴포넌트가 재실행될 때마다 사이드 이펙트 역시 재실행될 것이기 때문이며, 이로 인한 버그가 생기거나 무한 루프로 인해 벌어지는 과도한 HTTP 리퀘스트 때문에 아주 곤란해지도 모른다. 그러므로 우리는 앞서 거론한 문제들을 사전에 방지하고, 사이드 이펙트를 다루기 위한 적절한 도구가 필요하다. 바로 여기서 특별한 React hook이 등장하게 되는데, 우리는 이것을 `useEffect` 라고 부른다.

### `useEffect`

- `useEffect`는 또다른 내장 hook일 뿐이다. 컴포넌트 함수 내에서 실행할 수 있는 또 다른 함수이며 특수한 역할을 수행한다.

```js
useEffect(() => { ... }, [ dependencies ]);
```

`useEffect`는 2개의 인수, 2개의 파라미터와 함께 호출 된다. 첫 번째 인수는 지정된 의존성 배열(`dependencies`)이 변화했을 경우 모든 컴포넌트를 렌더링한 후에 실행되는 함수이다. 그리고 두 번째 인수는 바로 첫 번째 인수에게 지정된 의존성 배열인 `dependencies` 이다. 디펜던시로 가득한 이 배열을 기반하여 일부 디펜던시에 변화가 생기면 첫 번째 인수인 함수가 재실행되는 형태이다. 그러니 첫 번째 함수에는 어떤 사이드 이펙트(Side Effect) 코드를 넣어도 된다. 이 코드는 의존성 배열에 변화가 생겼을 때에만 실행될 것이기에 컴포넌트가 다시 렌더링 되더라도 실행되지 않기 때문이다. 오직 의존성 배열인 `dependencies`가 변할 때에만 실행되는 함수이다.

</br>

## useEffect 훅 사용하기

- 라이브 서버를 열면 더미 앱이 실행된다.

![main login page](https://user-images.githubusercontent.com/53133662/159119675-cd58b8dc-3396-409e-af3b-dfb12f79a712.png)

- 간단하게 아무 사용자 정보를 입력하고 Login 버튼을 누르면, 환영 메세지와 함께 더미 페이지가 나타난다.

![ezgif com-gif-maker (12)](https://user-images.githubusercontent.com/53133662/159119825-3aa66bea-b121-45d6-959f-c3c69b5fd5a3.gif)

- 이 앱은 Login을 하면 메인페이지로 이동하며, 다시 Logout 버튼을 누르면 로그인 페이지로 넘어오는 간단한 로그인/로그아웃 더미 앱이다. 그러나 Logout 버튼을 누르지 않아도 새로고침을 하면 로그인 상태가 소실되고, 다시 로그인 페이지로 넘어오는 것을 확인할 수 있다. 물론, 제대로 된 인증 로그인 서비스가 구현되었다면 실제로 로그인 했을 때 백엔드 서버에 리퀘스트를 보낼 것이고 로그인 데이터(해당 사용자가 인증됐음을 나타내는 토큰 같은 것)를 돌려받는 등의 프로세스를 처리할 것이다. 어쨌든 유저가 인증된 상태라면 새로고침을 하더라도 로그인 상태가 유지되어야 할 것이다.

### user의 인증 상태가 소실되는 이유는 무엇일까?

- 현재 상황에서 유저의 인증 상태가 소실되는 이유는 무엇일까? 바로 `isLoggedIn` 상태(state)를 관리하는 `App.js` 파일에서 유저의 인증 상태가 그저 React 상태(state)로 관리되고 있기 때문이다. 이 문제를 해결하기 위해 먼저 코드를 살펴보고자 한다.

```js
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginHandler = (email, password) => {
    // We should of course check email and password
    // But it's just a dummy/ demo anyways
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    // localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };
  ...
}
```

- 유저의 인증 상태가 React 상태(state)로 관리되고 있다는 말은 무슨 뜻일까? 유저의 인증 정보는 단지 React에 의해서 JavaScript 변수의 일종으로 관리되고 있다는 이야기다. 이런 경우에 어플리케이션을 리로드하게 되면 React 스크립트가 다시 시작하게 되며, 이전 실행에서의 모든 변수는 리셋되며 사라지게 된다. 이것은 React의 작동 방식의 문제가 아니며 그저 웹, 스크립트, 브라우저의 작동 방식 자체가 그렇기 때문에 발생하는 문제이다.

- 이렇듯 새로고침을 하게 되면 이전의 데이터를 모두 소실하는데, 그전에 미리 어딘가(리로딩의 영향을 받지 않는 곳)에 저장해두면 데이터를 잃지 않을 수 있을 것이다. 또한 어플리케이션이 시작될 때, 데이터가 소실되지 않고 유지되고 있는지를 체크하여 만약 유지되고 있다면 유저를 자동으로 로그인되도록 하여 재차 로그인을 할 필요가 없도록 만들 수도 있을 것이다. 그리고 이때 우리는 `useEffect`를 활용할 수 있다.

### 로컬 스토리지를 이용하여 데이터 저장하기

- 먼저, useEffect를 활용하기 전 데이터를 저장해보자.

```js
const loginHandler = (email, password) => {
  setIsLoggedIn(true);
};
```

- `loginHandler` 함수를 살펴보면, `isLoggedIn`을 true로 설정한 것을 볼 수 있다. 이것은 브라우저 스토리지의 이 위치에 정보를 저장하려는 시도일 것이다.
- 브라우저에는 활용 가능한 스토리지가 많으며, 이번에 사용하고자 하는 기능을 구현할 때는 보편적으로 '쿠키' 혹은 '로컬 스토리지'를 가장 많이 사용하기 때문에 그중 '로컬 스토리지'를 골라서 데이터를 저장해볼 것이다.
  > 이러한 스토리지 메터니즘은 브라우저에 내장되어 있으며, React로부터 완전히 독립적이다.

```js
const loginHandler = (email, password) => {
  localStorage.setItem("isLoggedIn", "1");
  setIsLoggedIn(true);
};
```

- `loginHandler` 함수에서 `isLoggedIn`을 true로 설정하기 전에 `localStorage.setItem()`를 통해서 '로컬 스토리지'를 설정한다. ('로컬 스토리지'는 전역 객체이며 브라우저에서 제공하는 것이다.)

#### `setItem()`

```js
storage.setItem(keyName, keyValue);
```

> [MDN 문서 참조: Storage.setItem()](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem)

- `setItem()`에 들어가는 두개의 인수 중 첫번째는 식별자이며, 문자열 "isLoggedIn(식별자)"로 간단하게 설정해주었다. `setItem()`의 두번째 인수는 저장하는 정보에 대한 문자열이어야 한다. 여기서는 "1(값)"로 설정했다. 예를 들어, "1"은 유저가 로그인 되어 있다는 시그널이 될 것이며, "0"은 로그인이 되어있지 않다는 시그널이 될 것이다.

- 이제 모든 걸 저장하고 다시 로그인을 해보자. 개발자 도구를 열어, Application 탭을 확인해보면 "Local Storage"에 해당 정보가 저장되어 있음을 알 수 있다.

![localStorage.setItem("isLoggedIn", "1")](https://user-images.githubusercontent.com/53133662/159119611-ea8daf45-8c9a-42c1-a54d-d79ad5e07f85.png)

- 데이터는 이렇게 "로컬 스토리지"를 이용해서 간단하게 저장할 수 있다. 이를 함수 안에서 처리하는 이유는 유저가 로그인 버튼을 클릭했을 때에만 실행되는 함수이기 때문이다. 즉, 우리는 이런 경우에만 데이터가 저장이 되길 원하고 있기 때문이다.

- 지금까지의 유스 케이스에서는 꼭 `useEffect`가 필요하지 않을 수도 있다. 하지만 어플리케이션이 새로고침을 하게 되는 시나리오에서라면 어떨까? 우리는 어플리케이션이 리로딩 될 때마다 "로컬 스토리지" 안에 `key`와 `value` 값이 쌍으로 존재하고 있는지를 매번 확인해야 할 것이다.

```js
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

  if (storedUserLoggedInInformation === "1") {
    setIsLoggedIn(true);
  }

  const loginHandler = (email, password) => {
  localStorage.setItem("isLoggedIn", "1");
  setIsLoggedIn(true);
};
  ...

```

- `localStorage`의 `getItem()`을 사용해서 기존의 `setItem()`으로 저장했던 "isLoggedIn" 라는 `key`를 찾고, 만약 이 `key`의 값이 "1" 이라면, `isLoggedIn` 상태가 true로 업데이트해주는 방식을 취했다. 이렇게 로직을 작성하게 되면, 이후에 로그인 버튼 함수(`loginHandler()`)가 트리거 되지 않더라도 로컬 스토리지에 저장된 유저 정보를 찾아서 유저가 로그인 상태를 유지할 수 있도록 해준다. 이런 방식의 가장 큰 단점은 무한 루프를 발생시킨다는 점에 있다. 유저의 정보가 저장되었는지를 확인한 후에 저장이 되어 있다면 `isLoggedIn` 상태를 true로 만들어주면서 유저의 로그인 상태가 유지될 수 있도록 하고 있는데, 이렇게 상태 설정 함수(`setIsLoggedIn()`)를 매번 호출할 때마다 `App` 컴포넌트가 재실행된다. `App` 컴포넌트가 재실행되면 당연히, 이전의 로그인 상태를 유지시키기 위해 설정해주었던 로직들 또한 다시 실행되며 모든 과정은 끊임없이 무한으로 반복하게 된다. 그래서 우리는 이러한 무한루프를 방지하고, 우리가 원하던 기능인 유저 인증 정보를 저장하고 확인하기 위해 `useEffect`가 필요한 것이다.

### `useEffect`를 이용하여 유저 인증 정보를 저장하기

```js
import React, { useEffect, useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginHandler = (email, password) => {
    localStorage.setItem("isLoggedIn", "1");
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
  };

  useEffect(() => {}, []);
  ...
```

- 먼저, "react" 에서 `useEffect`를 import 해오고, 트리거 함수 가장 마지막 줄에 `useEffect` 식을 작성해준다. `useEffect`는 두개의 인수를 받는데, 첫번째 인수는 함수이고, 두번째 인수는 의존성 배열이다.

```js
import React, { useEffect, useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginHandler = (email, password) => {
    localStorage.setItem("isLoggedIn", "1");
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);
  ...
```

- 그리고, 유저 인증 정보를 확인하기 위해서 작성해주었던 식을 모두 긁어와 `useEffect` 안에 붙여넣기 해준다. 이제 이 로직은 `useEffect`의 첫번째 인수인 함수 안에서 실행할 수 있게 되었다.

#### `useEffect`로 무한루프를 방지하기

- `useEffect`로 실행되는 함수는 이제 React에 의해서 기억될 것이며, 컴포넌트 렌더링 이후에 실행될 것이다. 그리고 실행되면서, 상태(state) 값이 업데이트 되었으므로 여기서 다시 컴포넌트가 리렌더링 될 것이다. 하지만 컴포넌트 렌더링 후에 매번 이 함수가 실행되는 것을 막을 수 있다. `useEffect`의 두번째 인수인 "의존성 배열"로 인해서 말이다. 어플리케이션이 처음으로 구동되는 순간 역시 "의존성 배열"에 해당한다. 어플리케이션이 처음으로 시작되고 이 컴포넌트 함수가 처음으로 렌더링 되는 순간이라면, `useEffect`의 의존성 배열이 변경된 것으로 간주될 것이다.

```js
useEffect(() => {
  const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

  if (storedUserLoggedInInformation === "1") {
    setIsLoggedIn(true);
  }
}, []);
```

- 현재 의존성 배열은 빈 배열 값으로 설정해놓았다. 의존할 만한 값이 아무 것도 없다는 뜻이다. 그리고 첫 렌더링이 발생하고 `useEffect`를 실행했을 때를 생각해보면, 처음부터 의존할 만한 값이 비어있기 때문에 첫 번째 렌더링 사이클과 비교해도 의존성 배열 값은 변화 없이 동일할 것이다. 그러니, 앞서 빈 배열 값으로 설정한 `useEffect`의 의존성 배열로 인해서 `useEffect`는 앱이 실행되고 나서 단 한번만 함수를 실행시킬 수 있게 된다.

### 로컬 스토리지에 저장된 사용자 인증 정보 지우기

```js
const logoutHandler = () => {
  localStorage.removeItem("isLoggedIn");
  setIsLoggedIn(false);
};
```

- 마지막으로 로그아웃 버튼을 눌렀을 때 실행되는 로그아웃 트리거 함수(`logoutHandler()`) 안에 로컬 스토리지에 저장한 유저 인증 정보를 삭제해주기 위한 로직을 넣어준다. `localStorage`의 `removeItem()` 을 이용하여 로그아웃 트리거 함수(`logoutHandler()`)가 실행될 때마다 유저 인증 정보를 삭제해주었다.

### 정리

- 어플리케이션이 시작되면 `useEffect` 함수가 실행될 것이고, 상태(state)를 업데이트 한다. 상태(state)가 업데이트되면 컴포넌트 함수를 다시 재실행시키며, 컴포넌트 함수 내부의 전제가 다시 실행되고 JSX 코드를 평가하고 그에 따라서 DOM 이 업데이트 된다. 그러나 이 과정 이후에 `effect`가 다시 실행되도록 하는 건 오직 "의존성 배열" 안의 의존성 값이 변경되었을 때 뿐이다.

### `useEffect` 더 알아보기 [(React 공식문서 참조)](https://ko.reactjs.org/docs/hooks-effect.html)

#### useEffect가 하는 일은 무엇일까요?

> useEffect Hook을 이용하여 우리는 React에게 컴포넌트가 렌더링 이후에 어떤 일을 수행해야하는 지를 말합니다. React는 우리가 넘긴 함수를 기억했다가(이 함수를 ‘effect’라고 부릅니다) DOM 업데이트를 수행한 이후에 불러낼 것입니다. 위의 경우에는 effect를 통해 문서 타이틀을 지정하지만, 이 외에도 데이터를 가져오거나 다른 명령형(imperative) API를 불러내는 일도 할 수 있습니다.

#### useEffect를 컴포넌트 안에서 불러내는 이유는 무엇일까요?

> useEffect를 컴포넌트 내부에 둠으로써 effect를 통해 count state 변수(또는 그 어떤 prop에도)에 접근할 수 있게 됩니다. 함수 범위 안에 존재하기 때문에 특별한 API 없이도 값을 얻을 수 있는 것입니다. Hook은 자바스크립트의 클로저를 이용하여 React에 한정된 API를 고안하는 것보다 자바스크립트가 이미 가지고 있는 방법을 이용하여 문제를 해결합니다.

#### useEffect는 렌더링 이후에 매번 수행되는 걸까요?

> 네, 기본적으로 첫번째 렌더링과 이후의 모든 업데이트에서 수행됩니다.(나중에 effect를 필요에 맞게 수정하는 방법에 대해 다룰 것입니다.) 마운팅과 업데이트라는 방식으로 생각하는 대신 effect를 렌더링 이후에 발생하는 것으로 생각하는 것이 더 쉬울 것입니다. React는 effect가 수행되는 시점에 이미 DOM이 업데이트되었음을 보장합니다.

</br>

## useEffect와 종속성

- 지금까지 `useEffect`에 대해서 알아보았다. `useEffect`를 이용하면, `useEffect`의 "의존성 배열" 인자에 의해서 무한 루프가 발생하지 않는다는 사실도 알게 되었다. 하지만 때로는 어플리케이션이 실행되고, `useEffect` 내부 함수가 실행되는 것이 단 한번만이 아니라 특정 시기에만 다시 실행되어야 하는 시나리오 또한 고려할 때가 많을 것이다. (대신 "의존성 배열" 내부의 특정 의존성이 변화할 때마다 모든 컴포넌트가 다시 평가되고 재실행된다는 것을 잊으면 안된다.)

### 의존성 배열

- `Login` 컴포넌트에서 예시를 살펴보자. 해당 컴포넌트는 form을 렌더하고 있다. input 창 내부를 클릭한 뒤 input 바깥 쪽을 클릭하면 빨간색으로 배경색이 변화하는 것을 확인할 수 있다. 그리고 email과 password를 각각 입력하는 두개의 input 창에 유효한 값을 입력해야만 로그인 버튼이 활성화되는 것 역시 알 수 있다.

#### Login.js

```js
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  ...
  const [formIsValid, setFormIsValid] = useState(false);

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);

    setFormIsValid(
      event.target.value.includes("@") && enteredPassword.trim().length > 6
    );
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);

    setFormIsValid(
      event.target.value.trim().length > 6 && enteredEmail.includes("@")
    );
  };
```

- `emailChangeHandler()` 함수와 `passwordChangeHandler()` 를 살펴보자. 두개의 함수는 해당하는 필드(email, password)의 모든 키 스트로크 마다 각각의 상태(state) 값을 변화시키는 핸들러가 작동하고 있다. 그리고 유효성 체크를 통해서 로그인 `<button/>`의 `disabled` 속성을 처리하는 `formIsValid` 상태(state) 값을 업데이트 해주고 있다. 그렇다면, `useEffect`는 어디서 어떻게 사용해야 할까?

```js
setFormIsValid(
  event.target.value.includes("@") && enteredPassword.trim().length > 6
);
```

- `emailChangeHandler()` 함수와 `passwordChangeHandler()` 함수에서 같은 용도(form이 유효한지 아닌지를 체크하는)로 사용하는 상태 업데이트 함수 `setFormIsValid()`은 굳이 트리거 핸들러 함수 안에서 각각 사용할 필요가 없을 것이다. `useEffect`를 통해서 사용할 수 있도록 수정해보자.

```js
useEffect(() => {
  setFormIsValid(
    enteredEmail.includes("@") && enteredPassword.trim().length > 6
  );
}, []);

const emailChangeHandler = (event) => {
  setEnteredEmail(event.target.value);
};

const passwordChangeHandler = (event) => {
  setEnteredPassword(event.target.value);
};
```

- `setFormIsValid`가 업데이트하는 로직을 살펴보면, `enteredEmail`와 `enteredPassword`에 의존하고 있음을 알 수 있다. 즉, email 이나 password 가 바뀔 때마다 트리거가 발생하고 `setFormIsValid` 상태 업데이트 함수가 실행된다는 의미이다. 그리고 우리는 여기서 "의존성 배열" 을 사용할 수 있다.

```js
useEffect(() => {
  setFormIsValid(
    enteredEmail.includes("@") && enteredPassword.trim().length > 6
  );
}, [enteredEmail, enteredPassword]);
```

- `useEffect` 에는 규칙이 있다. `Side Effect` 에서 사용하는 것을 토대로 의존성을 추가하는 것이다. 그것이 바로 `setFormIsValid` 상태 업데이트 함수가 의존하고 있는 상태(state) 값인 `enteredEmail`와 `enteredPassword`를 의존성 배열에 추가해야만 하는 이유다.

### 정리

- `useEffect` 는 한 장소에 코드 하나만 가질 수 있도록 해준다. `useEffect` 는 컴포넌트가 처음으로 렌더링 됐을 뿐만 아니라, 상태(state)나 prop 과 같은 데이터가 바뀔 때마다 로직을 재실행할 수 있도록 하는 게 보편적인 사용 방법이다.
  `useEffect` 의 주요 업무는 `Side Effect` 를 처리하는 것이다. 이메일이나 비밀번호 필드에서 키 스트로크의 응답으로 form 의 유효성을 체크하고 업데이트하는 것도 `Side Effect`를 일으킬 수 있다는 이야기다. (데이터를 입력하는 사용자의 `Side Effect` 이다.) `useEffect`는 뭔가의 응답으로 실행되는 코드를 처리하게 해준다.

</br>

## 종속성으로 추가할 항목 및 추가하지 않을 항목

- 지금까지 `effect` 함수에서 사용하는 "모든 것"을 토대로 종속성으로 추가해야 함을 배웠다. 즉, `effect` 함수에서 사용하는 모든 상태(state)변수와 함수를 종속성에 포함한다는 이야기다. 물론 맞는 말이지만 여기서 몇 가지 예외가 있다.

### 상태(state) 업데이트 함수를 종속성으로 추가해야 할까?

- 상태(state) 업데이트 함수를 종속성에 추가할 필요가 없다. React는 해당 함수가 절대 변경되지 않도록 보장하므로 종속성으로 추가할 필요가 없기 때문이다.

### "내장" API 또는 함수를 종속성으로 추가해야 할까?

- "내장" API 또는 함수를 종속성에 추가할 필요가 없다. 예시로 `fetch()`나 "localStorage" 같은 종류(브라우저에 내장된 함수 및 기능, 따라서 전역적으로 사용 가능한 것)를 생각해보면 될 것이다. 브라우저 API/전역 기능은 React 구성 요소 렌더링 주기와 관련이 없으며 변경되지 않기 때문이다.

### 변수와 함수를 종속성으로 추가해야 할까?

- 변수나 함수를 종속성에 추가할 필요가 없다. 구성 요소 외부에서 정의했을 것이기 때문이다. (ex. 별도의 파일에 새 도우미 함수를 만드는 경우) 이러한 함수 또는 변수도 구성 요소 함수 내부에서 생성되지 않으므로 변경해도 구성 요소에 영향을 주지 않는다. (해당 변수가 변경되는 경우, 또는 그 반대의 경우에도 구성 요소는 재평가되지 않기 때문이다.)

### 정리

- 간단히 말해서 `effect` 함수에서 사용하는 모든 "것들"을 추가해야 한다. 구성 요소(또는 일부 상위 구성 요소)가 다시 렌더링 되어 이러한 "것들"이 변경될 수 있는 경우, 그렇기 때문에 컴포넌트 함수에 정의된 변수나 상태, 컴포넌트 함수에 정의된 props 또는 함수는 종속성으로 추가되어야 한다.

### 예시

- 다음은 위에서 언급한 시나리오를 더 명확히 하기 위해 구성된 예시이다. 하나씩 살펴보면서, 종속성으로 추가해야 될 것과 추가하지 않아도 될 것을 구분해보자.

```js
import { useEffect, useState } from "react";

let myTimer;
const MyComponent = (props) => {
  const [timerIsActive, setTimerIsActive] = useState(false);
  const { timerDuration } = props;
  // using destructuring to pull out specific props values

  useEffect(() => {
    if (!timerIsActive) {
      setTimerIsActive(true);
      myTimer = setTimeout(() => {
        setTimerIsActive(false);
      }, timerDuration);
    }
  }, [timerIsActive, timerDuration]);
};
```

- `timerIsActive` 는 종속성으로 추가되었다. 왜냐하면 구성 요소가 변경될 때 변경될 수 있는 구성 요소 상태이기 때문이다. (`setTimerIsActive`로 상태(state)가 업데이트되었기 때문에)
- `timerDuration` 은 종속성으로 추가되었다. 왜냐하면 `timerDuration`은 해당 컴포넌트에서 받아온 prop 값이기 때문에 상위 컴포넌트에서 해당 값을 변경하면 변경될 수 있음을 고려해줘야 하기 때문이다. (이 `MyComponent` 도 다시 렌더링되도록 함).
- `setTimerIsActive` 는 종속성으로 추가되지 않았다. (왜냐하면 앞서 거론한 예외 조건이기 때문이다.) 상태(state) 업데이트 기능을 종속성에 추가할 수는 있지만 React는 기능 자체가 절대 변경되지 않음을 보장하므로 굳이 추가할 필요가 없다.
- `myTimer` 는 종속성으로 추가되지 않았다. 왜냐하면 그것은 `MyComponent` 컴포넌트 내부의 변수가 아니기 때문이다. (즉, 어떤 상태(satte)나 prop 값이 아님) 컴포넌트 요소 외부에서 정의되고 이를 변경하기 때문에(어디에서든) `MyComponent` 컴포넌트 요소가 다시 평가되도록 하지 않는다.
- `setTimeout` 은 종속성으로 추가되지 않았다. 왜냐하면 그것은 "내장 API"이기 때문이다. 이는 React 및 구성 요소와 독립적이며 변경되지 않는다.

</br>

## useEffect에서 Cleanup 함수 사용하기

- 우리는 때때로 Clean up 작업이 필요한 `Effect`를 사용할 때도 있을 것이다. 물론 이는 너무 추상적인 이야기이기 때문에 예시를 통해 알아보는 것이 좋겠다.

```js
useEffect(() => {
  console.log("Checking from validity!");
  setFormIsValid(
    enteredEmail.includes("@") && enteredPassword.trim().length > 6
  );
}, [enteredEmail, enteredPassword]);
```

- 우리는 그간 스트로크 마다 필수적으로 `useEffect` 내부의 함수를 실행시켰다. 이것을 확인해보기 위해 `setFormIsValid()` 함수를 업데이트하기 전에 `console.log("Checking from validity!")`를 작성하여 출력해볼 것이다.

![](https://user-images.githubusercontent.com/53133662/160779756-2a5908db-6ea1-44cb-88c2-57b933a8c310.gif)

- 출력 결과를 확인해보면, 키 스트로크 마다 "Checking from validity!" 가 출력되고 있음을 알 수 있다. 그동안 우리는 `useEffect` 내부의 함수에서 상태(state)를 업데이트 해왔다. 상태(state) 업데이트가 제대로 작동하고 있지만, 어쩌면 이것이 이상적인 코드 작성법이라고 말할 수는 없을지도 모른다. 만약 조금 더 복잡한 일을 처리해야한다고 생각해보자. 예를 들어, 사용자 이름이 이미 사용되고 있는지에 대한 유효성 체크를 백엔드에 HTTP 요청을 보내서 체크해야 한다면 어떨까? 이전의 방법대로라면 키 스트로크마다 HTTP 요청을 수십번 보내야 할지도 모른다. 또한 이 때문에 불필요한 네트워크 트래픽이 생길 수도 있을 것이다. 결론적으로 모든 키 스트로크마다 상태(state)를 업데이트를 해야하는 것이 얼마나 비효율적인 로직인지 알 수 있다.
- 우리가 원하는 건 특정한 양의 키 스트로크를 모으는 것이다. 혹은 키 스트로크 다음에 일정시간을 기다리는 것도 괜찮을 것이다. 다만 이 멈춰있는 일정시간이 충분히 길어야지만 우리가 원하는 작업들을 진행할 수 있을 것이다.
- 사용자가 input 창에서 무언가를 입력하고 있을 때 email이 유효한지를 확인하지 않을 것이다. 사용자가 input 창에서 입력을 모두 마치고(입력을 멈추고) 난 후 500밀리초나 그 이상 지났을 때 비로소 유효성을 체크해야만 한다. 우리는 이때 '디바운싱' 이라는 기술을 이용해서 앞서 이야기한 방법대로 구현해볼 수 있다.

```js
useEffect(() => {
  setTimeout(() => {
    console.log("Checking from validity!");
    setFormIsValid(
      enteredEmail.includes("@") && enteredPassword.trim().length > 6
    );
  }, 500);
}, [enteredEmail, enteredPassword]);
```

- [MDN 참조 : setTimeout()](https://developer.mozilla.org/ko/docs/Web/API/setTimeout)

  > 전역 setTimeout() 메서드는 만료된 후 함수나 지정한 코드 조각을 실행하는 타이머를 설정한다. 이는 브라우저에 내장된 함수이므로, `Effect`나 React와는 관련이 없다.

- 사용자 입력을 "디바운스"해서 사용자가 입력을 하는 도중의 키 스트로크마다 상태(state)를 업데이트 하지 않도록 했다. 그 대신 사용자가 입력하는 동안 500밀리초라는 시간을 기다릴 수 있게 `setTimeout()`를 사용해서 `setFormIsValid()` 식을 감싸주었다. 이제 `setTimeout()`로 지정한 500밀리초가 지난 후에 form 유효성을 검사하는 `setFormIsValid()`가 실행될 것이다.

![ezgif com-gif-maker (17)](https://user-images.githubusercontent.com/53133662/161028362-50235d80-69b5-412c-b5cb-17a1ab3fb8e2.gif)

- 이전과 다른 것은 console에 출력한 결과를 즉시 볼 수 없다는 것이다. 모든 키 스트로크마다 타이머가 실행될 것이기 때문에 입력할 때마다 500밀리초의 지연이 발생하게 된다. 여기서 속임수는 타이머를 저장했다는 것인데, 이 다음의 키 스트로크에서는 클리어하게 된다. 따라서 한 번에 하나의 타이머만 실행되며, 사용자가 키를 입력하는 동안 다른 타이머는 모두 클리어할 것이다. 오직 마지막 타이머만 완료할 뿐이다. 시간이 지연되는 이유는 타이머를 클리어하려면 새로운 스트로크를 만들어야 하기 때문이다. 이는 언뜻 보기엔 복잡한 과정 같지만, `useEffect`가 이러한 과정을 아주 쉽게 처리해줄 수 있다.

### useEffect에서 return 하기

- `useEffect`의 첫번째 인수로 실행되는 함수에서 이전에는 해본 적 없는 것을 해볼 것이다. 뭔가를 return 하는 일 말이다.

```js
useEffect(() => {
  setTimeout(() => {
    console.log("Checking from validity!");
    setFormIsValid(
      enteredEmail.includes("@") && enteredPassword.trim().length > 6
    );
  }, 500);

  return () => {};
}, [enteredEmail, enteredPassword]);
```

- `useEffect`의 함수에서 return 하는 것은 조금 더 특별하다. return 하는 것이 함수 자체일 필요성이 있기 때문이다. (지금은 익명 함수로 처리해줬지만 이름이 있는 함수로 처리해줘도 된다.) 그리고 `useEffect` 함수 내부에서 return으로 처리하는 함수를 "클린 업" 함수라고 한다. "클린 업" 함수는 `useEffect`가 이 함수를 다음 순번으로 실행하기 전까지 클린 업 과정으로 작동할 에정이다.

### "클린 업" 함수의 작동 원리

- (첫번째 순번으로 작동하는 함수를 제외하고) `useEffect` 함수가 작동할 때마다 또 작동하기 전마다 "클린 업" 함수가 돌아갈 것이다. 그리고 `DOM` 에서부터 특정한 컴포넌트가 작동할 때마다 "클린 업" 함수가 작동할 것이다. 따라서 "클린 업" 함수는 새로운 `Side Effect` 함수 모두가 실행되고, 컴포넌트가 제거되기 전에 작동될 것이다.

```js
useEffect(() => {
  const identifier = setTimeout(() => {
  setTimeout(() => {
    console.log("Checking from validity!");
    setFormIsValid(
      enteredEmail.includes("@") && enteredPassword.trim().length > 6
    );
  }, 500);

  return () => {
    console.log("CLEANUP");
  };

}, [enteredEmail, enteredPassword]);
```

- 따라서 위의 식은 `useEffect`의 첫 번째 `Side Effect` 함수가 실행되기 전에는 작동하지 않는다. 그리고 모든 `Side Effect` 함수가 실행되기 전에 작동할 것이다. "클린 업" 함수 안에 `console.log("CLEANUP")` 를 출력해보자.

![ezgif com-gif-maker (18)](https://user-images.githubusercontent.com/53133662/161033016-d96a96ce-44f8-4e9d-9d02-6ee60154c3dc.gif)

- 페이지를 리로드 할 때마다 "Checking from validity!" 가 출력되고 있는 걸 확인할 수 있다. `setFormIsValid()` 내부의 코드 즉 메인 `Side Effect` 함수의 코드는 제대로 작동하고 있는 것이다. 하지만 "클린 업" 함수 안에 출력하고자 했던 식(`console.log("CLEANUP")`)은 출력되지 않는다. 왜냐하면 앞서 설명했듯이 첫번째 `Side Effect`가 실행되기 전에는 "클린 업" 함수는 작동되지 않기 때문이다.

![ezgif com-gif-maker (19)](https://user-images.githubusercontent.com/53133662/161033952-fea2e158-105a-4c4a-8842-952e26590d89.gif)

- 결과 화면에서처럼 사용자가 input에 단 한글자만 입력해도 "클린 업" 함수 안에 출력하고자 했던 식(`console.log("CLEANUP")`)이 출력되고 있음을 알 수 있다. 첫번째 `Side Effect`가 실행되자마자 "클린 업" 함수가 즉시 실행되고 있는 것이다. 이렇듯, "클린 업" 함수는 (첫번째 `Side Effect` 실행 후) 새로운 `Side Effect` 함수 모두가 실행되기 전에 작동한다.

### "클린 업" 함수를 사용하여 타이머를 클리어하기

- `setTimeout()`으로 설정된 타이머를 클리어해보자.

```js
useEffect(() => {
  const identifier = setTimeout(() => {
  setTimeout(() => {
    console.log("Checking from validity!");
    setFormIsValid(
      enteredEmail.includes("@") && enteredPassword.trim().length > 6
    );
  }, 500);

  return () => {
    console.log("CLEANUP");
    clearTimeout(identifier);
  };
}, [enteredEmail, enteredPassword]);
```

- [MDN 참조 : clearTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout)

  > 전역 clearTimeout()메서드는 이전에 setTimeout()으로 설정된 시간을 취소해준다. 이는 브라우저에 내장된 함수이므로, `Effect`나 React와는 관련이 없다.

- "클린 업" 함수 내부에 빌트인 `clearTimeout()` 함수를 실행해줄 수 있도록 했다. (`clearTimeout()`는 이전에 설정한 타이머를 클리어해주는 함수이다.) 타이머를 설정해주었던 로직을 식별자(`identifier`)로 생성해준 뒤, "클린 업" 함수 내부의 `clearTimeout()`에 인자로 전달해줄 수 있도록 했다. 이렇게 해주면, "클린 업" 함수가 작동될 때마다 "클린 업" 함수가 작동되기 전에 설정한 타이머를 클리어해줄 수 있다. 그러니까 마지막 `Side Effect` 함수가 실행되면 다음 `Side Effect`가 실행될 때마다 새롭게 타이머를 설정할 수 있게 되는 것이다. 따라서, 새로운 것을 설정하기 전에 마지막 타이머를 클리어하도록 해주었다.

### 정리

![ezgif com-gif-maker (20)](https://user-images.githubusercontent.com/53133662/161037252-3098c283-4d6d-4619-8adb-8c89741f0138.gif)

- 페이지를 리로드하면 자동으로 console에 "Checking from validity!" 라고 뜬다. 그리고 사용자가 input 창에 무언가를 입력할 때마다 "클린 업" 함수 내부에서 설정한 문자열 "CLEANUP" 가 출력되고, 다시 "Checking from validity!" 도 출력된다. 그런데 input 창에 무언가를 아주 빠르게 입력하게 되면 "CLEANUP" 이 빠르게 축적되어 출력되고, "Checking from validity!" 는 한 번만 출력되는 것을 알 수 있다. 그 말인 즉슨, "클린 업" 함수 전에 실행되던 `setTimeout()` 함수는 "모든 키 스트로크"마다 딱 한 번만 실행된다는 뜻이다.
- 앞서 초반에 `useEffect`를 이용한 HTTP 요청에 대한 질문의 답이 바로 여기있다. 만약 `useEffect`를 통해 HTTP 요청을 보내고 싶다면 (키 스트로크마다 HTTP 요청을 수십번 보내거나 또한 이 때문에 불필요한 네트워크 트래픽이 생기는 대신) "클린 업" 함수를 통해 요청을 중지하면서 단 한번만 HTTP 요청을 할 수 있을 것이다.

</br>

## useEffect 요약

- `useEffect`는 (`useState`를 제외하고) React에서 가장 중요한 hook 이다. 그렇기에 어느 "시점"에 `useEffect`가 실행되고, `useEffect`의 어느 "부분"이 먼저 혹은 나중에 실행되는지를 이해하는 것은 무엇보다도 중요하다.

```js
useEffect(() => {
  console.log("Effect Running");
});
```

- 현재 (`Login` 컴포넌트에 임의로 추가한) `useEffect`는 의존성 배열을 제외하고, 첫번째 인자만 받아와서 실행하고 있다. (하지만 당연히 의존성 배열 없이 `useEffect`를 사용하는 일은 거의 없을 것이다.)

![ezgif com-gif-maker (21)](https://user-images.githubusercontent.com/53133662/161381533-f18f43bd-fee6-4f6f-81b7-ed8da43d9c96.gif)

- 브라우저를 리로드하고 개발자 도구의 콘솔을 살펴보면, 컴포넌트가 첫 번째로 마운트 됐을 때 작동하는 걸 확인할 수 있다. 따라서 `Login` 컴포넌트가 처음으로 render 되면 모든 상태(state)가 업데이트될 것이다.

![ezgif com-gif-maker (22)](https://user-images.githubusercontent.com/53133662/161381887-1be34a5e-ca11-4907-906f-6355ee02fd87.gif)

- input 창의 안쪽을 클릭하고 바깥을 클릭하거나, input 창에 무언가를 입력하면 모든 키 스트로크마다 상태가 변화하고 있으므로 그때마다 콘솔에 "Effect Running"라고 출력이 된다. 모든 키 스트로크마다 해당 `effect` 가 작동되고 있는 것이며 다른 말로는 컴포넌트 함수가 재렌더되고 작동되는 모든 순간마다 `effect`가 작동한다는 의미가 된다. (`useEffect` 함수는 모든 컴포넌트 렌더 사이클 마다 작동하기 때문이다. 그리고 그 시점은 모든 컴포넌트가 렌더하기 전도 아니고, 그 중간도 아니며, 렌더한 "이후"에 작동한다. 컴포넌트가 마운트되는 첫 순간을 포함해서.)

```js
useEffect(() => {
  console.log("Effect Running");
}, []);
```

- `useEffect` 함수에 의존성 배열을 추가했다. 빈 배열을 추가했기 때문에, 해당 `useEffect`는 컴포넌트가 처음으로 마운트되고 렌더될 때만 실행될 것이다. 그리고 이후에 발생하는 리렌더 사이클에서는 작동하지 않을 것이다.

![ezgif com-gif-maker (23)](https://user-images.githubusercontent.com/53133662/161384184-26c56d1d-6206-4fa0-9ff6-d74daee35733.gif)

- 처음 컴포넌트가 렌더되었을 때만 콘솔에 "Effect Running"라고 출력되는 것을 알 수 있다. 키 스트로크를 입력해도 "Effect Running" 는 출력되지 않는다. 이렇듯 빈 배열의 의존성 배열은 컴포넌트가 처음으로 마운트되고 렌더될 때만 실행된다.

```js
useEffect(() => {
  console.log("Effect Running");
}, [enteredEmail, enteredPassword]);
```

- 이제 의존성 배열에 의존성 값을 추가했다. 이제 `useEffect`는 컴포넌트가 재렌더 될 때마다 혹은 의존성 배열에 추가한 상태 값인 `enteredEmail` 과 `enteredPassword` 가 변화할 때마다 실행될 것이다.

![ezgif com-gif-maker (24)](https://user-images.githubusercontent.com/53133662/161384388-96385997-4f99-4568-b659-ed0541d236f4.gif)

- 컴포넌트가 처음 렌더될 때 그리고 `enteredEmail` 과 `enteredPassword` 에 키 스트로크가 입력될 때마다 콘솔에 "Effect Running"라고 출력되는 것을 확인할 수 있다.

```js
useEffect(() => {
  console.log("Effect Running");

  return () => {
    console.log("Effect CleanUp");
  };
}, [enteredPassword]);
```

- 이번에 추가한 "클린 업" 함수는 상태(state) 함수 전체가 작동하기 전에 작동한다. (하지만 최초로 `useEffect`가 작동하기 전에는 작동하지 않는다는 특징이 있다.)
  > "클린 업" 함수의 작동 순서를 명확하게 하기 위해서 의존성 배열에 `enteredPassword` 상태 값만 추가했다.

![ezgif com-gif-maker (26)](https://user-images.githubusercontent.com/53133662/161384819-22681972-8d6d-4fbf-9226-89f6737cb42f.gif)

- 컴포넌트가 처음 렌더될 때는 "Effect Running"만 출력된다. (최초의 렌더 사이클에서는 "클린 업" 함수가 실행되지 않는다.) 그리고 `enteredPassword` 에 키 스트로크를 입력하자마자 즉시 콘솔에 "Effect CleanUp"가 출력되는 것을 확인할 수 있다. (`effect` 함수가 작동하기 전에 트리거 되기 때문이다.)

```js
useEffect(() => {
  console.log("Effect Running");

  return () => {
    console.log("Effect CleanUp");
  };
}, []);
```

- 만약 의존성 배열이 빈 배열이라면 "Effect Running"을 단 한번만 볼 수 있다. 그리고 "클린 업" 함수는 해당 컴포넌트가 제거되면 실행될 것이다.

![ezgif com-gif-maker (27)](https://user-images.githubusercontent.com/53133662/161385012-120faa24-f68d-44fc-87ed-ed5c4122df76.gif)

- 로그인을 위한 값을 입력하고 로그인을 하면, `Login` 컴포넌트가 `DOM`에서 제거되면서 "클린 업" 함수가 실행된다. 로그인을 하자마자 콘솔에 "Effect CleanUp"가 출력되는 것을 확인할 수 있다.

</br>

## useReducer 및 Reducers의 개요

- `useReducer`는 또 다른 React의 빌트인 hook 이며, 상태(state) 관리를 도와줄 것이다. `useReducer`는 상태(state) 관리 측면에서라면 `useState`와 비슷해보이지만 능력이 더 많으며, 더 복잡한 상태(state)를 관리해야 할 때 훨씬 유용하다는 차이점이 있다.

### 복잡한 상태(state)를 다룬다는 것

- 우리는 그동안 `useState`를 사용하면서 상태(state)를 관리해왔다. 하지만 더 복잡한 상태(state)를 관리해야 한다면 어떨까? 예를 들어, 여러 곳에서 관리하는 상태(state)이지만 관점만 다르거나 동시에 업데이트하면서 서로 관련이 있는 멀티플 상태(state)를 생각해보자. 이런 경우에는 `useState`와 거기서 얻는 상태(state)가 에러를 일으킬 가능성이 높다. 기본적으로 효율적지 않으며, 잠재적으로 버그를 발생시킬지도 모른다. (이는 분명 우리가 원하는 상황일리가 없다.) 그리고 `useReducer`는 이런 상황일 때 `useState`의 대안이 될 수 있다.

> 물론 언제나 `useReducer`를 사용할 필요는 없다. 더 강력하다고 완벽할리는 없기 때문이다. 강력한 만큼 사용하기에는 더 복잡할 것이고, 당연히 설정할 것도 많아질 것이다. 따라서 대부분의 경우에는 `useState`를 사용하는 게 더 적합할 수 있다.

### 더 강력한 상태(state) 관리가 필요한 이유

```js
const [enteredEmail, setEnteredEmail] = useState("");
const [enteredPassword, setEnteredPassword] = useState("");
const [emailIsValid, setEmailIsValid] = useState();
const [passwordIsValid, setPasswordIsValid] = useState();
const [formIsValid, setFormIsValid] = useState(false);
```

- 우리는 현재 `Login` 컴포넌트에서 여러 개의 상태(state)를 관리해주고 있다. `enteredEmail`과 `enteredPassword`를 관리해주고 있고, 각각의 유효성을 검사하는 `emailIsValid`와 `passwordIsValid`도 관리하고 있다. 마지막으로 form 전체의 유효성을 관리하는 `formIsValid`도 있다. 이것들은 전체적으로 하나의 거대한 상태(state)라고 볼 수도 있을 것이다. 이 모든 상태(state)는 전반적으로 form 상태(state)를 설명하고 있기 때문이다. 반면 이 모든 상태(state)를 최소한의 관점으로 쪼개면 두가지로 나눌 수도 있다. 바로 사용자가 입력한 값과 입력의 유효성이다.

```js
useEffect(() => {
  const identifier = setTimeout(() => {
    setFormIsValid(
      enteredEmail.includes("@") && enteredPassword.trim().length > 6
    );
  }, 500);

  return () => {
    clearTimeout(identifier);
  };
}, [enteredEmail, enteredPassword]);

const validateEmailHandler = () => {
  setEmailIsValid(enteredEmail.includes("@"));
};

const validatePasswordHandler = () => {
  setPasswordIsValid(enteredPassword.trim().length > 6);
```

- 위의 로직을 살펴보면 `useEffect` 내부 함수에서 이메일과 비밀번호의 유효성을 확인해서 form의 전반적인 유효성을 설정하고, 각각의 유효성을 체크하는 두개의 핸들러 함수에도 동일한 작업(중복되는 로직)을 하고 있음을 확인할 수 있다. 우리는 이제 이 중복되는 로직을 기반으로 다양한 방법을 사용해서 상태(state) 관리를 할 수 있게 된 것이다. 예를 들면, `useEffect`에서는 `emailIsValid`과 `passwordIsValid`의 상태(state)를 확인하는데 사용할 수 있다. (form이 전반적으로 유효한지, 또 작동하고 있는지에 대해서 확인할 수 있다는 이야기다.) `enteredEmail`과 `emailIsValid`는 어떨까? 이것들은 확실히 같은 범위 안에 속하는 것으로 보여진다. 따라서 함께 관리할 수 있을 것이다.

```js
// useEffect(() => {
//   const identifier = setTimeout(() => {
//     setFormIsValid(
//       enteredEmail.includes("@") && enteredPassword.trim().length > 6
//     );
//   }, 500);

//   return () => {
//     clearTimeout(identifier);
//   };
// }, [enteredEmail, enteredPassword]);

const emailChangeHandler = (event) => {
  setEnteredEmail(event.target.value);

  setFormIsValid(
    event.target.value.includes("@") && enteredPassword.trim().length > 6
  );
};

const passwordChangeHandler = (event) => {
  setEnteredPassword(event.target.value);

  setFormIsValid(
    enteredEmail.includes("@") && event.target.value.trim().length > 6
  );
};
```

- `useEffect`를 주석 처리하고 이전에 `emailChangeHandler`와 `passwordChangeHandler`에서 관리해주었던 form 유효성 체크 로직을 다시 살려놓는다. 이 방법은 이전에도 말했다시피 작동은 하지만, 코드를 여러번 재사용하는 좋지 않은 코드이다. (그래서 우리는 `useEffect`를 사용했을 것이다.) 하지만 어떤 이유에서인지 라우트를 `useEffect`에 가져오고 싶지 않다고 가정해보자. 그리고 이때 우리는 어떤 문제를 맞딱뜨리게 된다.

```js
const passwordChangeHandler = (event) => {
  ...
  setFormIsValid(
    enteredEmail.includes("@") && event.target.value.trim().length > 6
  );
};
```

- 여기 예시가 있다. 우리는 `passwordChangeHandler` 핸들러 함수에서 form의 유효성을 체크하고 업데이트하고 있다. 다른 두 개(이메일, 패스워드)의 상태(state)에 근거해서 말이다. 떠올려보면, 우리는 예전 상태(state)를 기반으로 상태를 업데이트하는 (함수 폼을 사용한)방법을 배웠고 이것을 사용할 수 있지 않을까 고민할 수도 있을 것이다. 하지만 안타깝게도 이 로직에서는 상태(state)를 업데이트하는 함수 폼을 사용할 수 없다. 함수 폼은 (같은 상태의 이전 상태 스냅 샷에 따라서) 다음 상태(state)를 업데이트할 때만 참(true)이기 때문이다. 반면 이 로직에서는 두 개의 다른 상태(state) 스냅 샷에 기반하고 있고 이는 `formIsValid`의 마지막 상태 스냅 샷이 아닐 것이다.

### 가장 최신의 상태(state)를 받아오지 않을 가능성

- 또한, React가 상태를 업데이트하는 방법 때문에 해당 상태 업데이트 코드는 작동하게 되지만 올바른 상태를 받아오지 않을 가능성이 높다. 그러니까 이메일 `enteredEmail` 상태 업데이트가 진행되기 전이라도 `setFormIsValid()` 코드는 작동될 가능성이 있다는 뜻이다. 따라서 사용자가 입력한 이메일이 해당 `setFormIsValid()` 코드가 실행될 때 `enteredEmail`의 가장 마지막 스냅 샷(가장 최근의 `enteredEmail`)을 포함하지 않을 수 있다. 그래서 그동안 우리는 함수 폼을 이용해서 최신의 상태를 기반으로 업데이트 했었지만, 이번 경우에는 함수 폼을 사용할 수 없었기 때문에 이러한 리스크를 안고서도 해당 로직을 작성했던 것이다. 그리고 우리는 이런 상황에서 바로 `useReducer`를 사용할 수 있다.

## `useState`의 대체제 `useReducer`

- `enteredEmail`이나 `emailIsValid` 처럼, 같은 범위에 속하는 상태(state)가 있다면 혹은 여러 상태(state)를 기반으로 상태(state)를 업데이트해야 한다면 `useState`의 대체제로 `useReducer`를 사용할 수 있을 것이다. 그리고 `useReducer`를 사용한다면 리스크를 안고 (함수 폼 대신) `formIsValid`를 업데이트했던 코드 역시 더이상 사용하지 않아도 된다.

```js
const validateEmailHandler = () => {
  setEmailIsValid(enteredEmail.includes("@"));
};

const validatePasswordHandler = () => {
  setPasswordIsValid(enteredPassword.trim().length > 6);
};
```

- 우리는 `validateEmailHandler`와 `validatePasswordHandler` 같은 핸들러 함수를 이용해서 두개의 상태(`emailIsValid`, `passwordIsValid`)를 업데이트 했다. 그리고 이 업데이트를 위해서는 두개의 상태(`emailIsValid`, `passwordIsValid`)가 있어야 할 것이며, 이 두개의 상태는 각각 `enteredEmail`과 `enteredPassword`이라는 상태를 살펴보고 메소드를 호출해서 유효성을 체크한 뒤에 업데이트하고 있다. 우리는 그동안 입력 값을 상태로 관리해주는 상태(`emailIsValid`, `passwordIsValid`)와 이 입력 값의 유효성을 상태로 관리해주는 상태(`enteredEmail`, `enteredPassword`)를 따로 따로 관리해주고 있었다. 이 두개의 종류는 모두 사용자가 무엇을 입력하느냐에 따라 달라지지만 이 두가지는 엄연히 말하자면 다른 상태이고 다른 변수일 것이다. 그렇기에 유효성을 체크한 뒤 업데이트해주는 상태를 추출할 때 "다른 상태를 기반"으로 업데이트를 해주는 것은 어찌됐건 큰 리스크가 될 것이다.

- 대부분의 경우에는 해당 방법이 정상적으로 작동할 수는 있으나, 특정 경우에는 작동하지 않을 가능성이 높다. 예를 들어보면 가끔 `validateEmailHandler` 핸들러 함수에서 `setEmailIsValid`로 업데이트할 때 기반으로 사용하는 `enteredEmail` 상태(state)는 제때 작동되지 않을 수 있다. 그럼에도 `setEmailIsValid`는 가장 최신의 스냅 샷이 아닌 `enteredEmail` 상태를 기반으로 업데이트되기도 한다.
  > 따라서 우리는 상태를 업데이트할 때 함수 폼을 이용하지만 `setFormIsValid` 만으로는 불가능하다. 상태(state) 업데이트 함수의 함수 폼이 `validateEmailHandler`와 `validatePasswordHandler` 같은 핸들러 함수 내부에 있기 때문이다. 그리고 만약 두개의 핸들러 내부에 함수 폼을 사용해서 상태를 업데이트하게 된다면, `setFormIsValid`는 가장 최신의 `enteredEmail`나 `enteredPassword`가 아니라, `emailIsValid`와 `passwordIsValid`의 최신 상태만 받을 것이다. 그렇기 때문에 이것은 옵션으로 고려할 수 없다.

### 정리

- 우리가 앞서 보여준 예시들은 모두 다 복잡한 상태(state)를 왜 `useState`가 아닌 `useReducer`로 관리해야 하는지에 대한 이유를 알 수 있도록 해주었다. 다른 상태에 의존하고 있는 상태를 업데이트해야 하는 상황이라면, 하나의 상태로 합치는 게 좋은 선택일 수 있다는 사실 역시 말이다. 그리고 어쩌면 이러한 옵션을 고려하게 될 때 굳이 `useReducer`를 사용하지 않고 `useState`로 관리해줄 수도 있지만 여기서 분명한 것은 `useState`로 대체하게 된다면 상태는 훨씬 더 복잡해지고 커질 것이다. 또 무엇보다도 여러 개의 상태를 결합해야하는 상황이라면 확실히 `useState` 보다 `useReducer`가 더 나은 선택이라고 말할 수 있다.

</br>

## useReducer 훅 사용해보기

- 이제 우리는 왜 `useReducer`를 사용하는지 또 언제 `useReducer`를 사용하는게 더 좋은지에 대해 알고 있다. 하지만 어떻게 `useReducer`를 써야하는지에 대해서는 아는 바가 없다. `useReducer`를 어떻게 사용하는지에 대해 배우기 전에 먼저 `useReducer`가 어떻게 생겼는지에 대해서 알아볼 필요가 있을 것이다.

### `useReducer`를 이론적 측면으로 접근해보기

> [React 공식문서 참조 : useReducer](https://ko.reactjs.org/docs/hooks-reference.html#usereducer)

```js
const [state, dispatchFn] = useReducer(reducerFn, initialState, initFn);
```

- `useReducer`는 `useState`와 마찬가지로 항상 2개의 값이 있는 배열을 반환한다. 따라서 `useState`처럼 '배열의 구조 분해 할당'를 통해 이 값들을 모두 끄집어내서 서로 다른 상수에 저장할 수 있게 된다. `useReducer`에서 반환되는 2개의 값은 `useState`처럼 상태 관리 매커니즘에 따른다.

#### `state`

- `useReducer`에서 반환되는 2개의 값 중 첫 번째는 최신 상태(state)를 보관하는 `state` 이다.

#### `dispatchFn`

- `useReducer`에서는 최신 상태(state)를 보관하는 `state` 뿐만 아니라 상태(state) '스냅 샷'을 업데이트 해주는 함수(`useReducer`가 반환하는 2개의 값 중 두번째 값)도 반환될 것이다. 보다시피 `useState`의 매커니즘과 매우 유사한 것을 알 수 있다. 그러나, 이 `dispatchFn`는 `useState`의 상태 업데이트 함수(`setState`) 와는 작동 방식에서 '다소' 차이가 있다.

- `dispatchFn`는 `setState`처럼 새로운 상태 값을 설정하는 대신에 하나의 'action' 을 디스패치하고 있기 때문이다. 그리고 이 'action'은 `useReducer`로 전달한 첫번째 인수인 `reducerFn`에서 사용하게 된다.

#### `useReducer`의 첫번째 인수 `reducerFn`

```js
(prevState, action) => newState;
```

- `reducerFn`는 최신 상태 스냅 샷을 자동으로 가져오는 함수이다. (이는 React에 의해서 호출될 함수이기 때문이다.) 그리고 `reducerFn`은 `dispatchFn`에서 디스패치 된 'action'을 가져오게 된다. 왜냐하면 새로운 'action'이 디스패치 될 때마다 React가 `reducerFn`를 호출하기 때문이다. 그러면 React가 관리하는 최신 상태(state) 스냅 샷을 자동으로 가져오게 되고, 디스패치 된 'action'을 가져오며 이는 다시 `reducerFn` 실행을 트리거하게 된다.
- 그리고 `reducerFn`는 또 다른 중요한 임무를 맡고 있다. 바로, 새로 업데이트 된 상태를 반환하는 것이다. 이는 `useState` hook에서 최신의 스냅 샷을 받아와 이전의 상태를 최신의 상태로 업데이트할 때 사용하던 함수 업데이트 방식과 유사하다. 하지만 `reducerFn`는 'action'을 이용한다는 점에서 이보다는 더 확장된 방식일 것이다.

#### `useReducer`의 두번째 인수 `initialState`

- `initialState`로 초기 상태를 설정할 수 있다.

#### `useReducer`의 세번째 인수 `initFn`

- `initFn`로 초기 함수도 설정할 수 있다. 이 함수를 통해서 초기 상태가 설정된다. `initFn`는 초기 상태가 다소 복잡한 경우에 대비해서 사용하거나 HTTP 리퀘스트 등의 결과를 대비할 때 사용한다.

### `useReducer`를 사용해보기

- 현재의 `Login` 컴포넌트를 살펴보면 여러 개의 상태(state)를 `useState`로 관리해주고 있다.

```js
const [enteredEmail, setEnteredEmail] = useState("");
const [emailIsValid, setEmailIsValid] = useState();
const [enteredPassword, setEnteredPassword] = useState("");
const [passwordIsValid, setPasswordIsValid] = useState();
const [formIsValid, setFormIsValid] = useState(false);
```

- 이제 우리는 `useReducer`를 통해서 사용자가 입력한 값과 이 값의 유효성 체크의 상태들을 결합하여 사용해보려고 한다. 또한 form 의 전반적인 상태(state)를 관리할 수 있도록 해볼 것이다. 즉 모든 상태를 포함하는 하나의 거대한 form 의 상태를 관리하거나, 아니면 여러 개의 작은 상태들을 관리할 수 있다는 뜻이다. (물론 어느 쪽을 선택해도 무방하다.) 하지만 일을 조금 더 간단하게 처리해주기 위해서 먼저 `useReducer`를 통한 "user email 상태 관리" 부터 시작해볼 것이다.

### user email의 상태 관리

- 여기서의 목표는 '입력 값'과 '유효성 체크' 상태를 결합해서 `useReducer`가 관리하는 하나의 상태(state)로 만드는 것이다. 먼저 `Login` 컴포넌트 내에 `useReducer`를 import 해오자.

```js
import React, { useState, useEffect, useReducer } from "react";

const Login = (props) => {
  ...
const [emailState, dispatchEmail] = useReducer();
  ...
}
```

- `useReducer`를 호출한 뒤, '배열 구조 할당 분해'로 두 요소를 갖는 배열 안에서 반환했다. 앞에서 살펴보았듯이, `useReducer`가 반환하는 배열 안의 첫번째 요소는 `emailState`라는 최신 상태(state)를 관리하는 값이며, 두번째는 이 상태 값을 디스패치하는 `dispatchEmail` 함수이다. 그리고 `useReducer`는 첫 번째 인수로 디스패치된 'action'을 받는 어떤 함수(reducerFn)를 취할 것이다.

```js
const [emailState, dispatchEmail] = useReducer(() => {});
```

- 물론 `useReducer`의 첫번째 인수로 사용하는 함수를 익명의 함수가 아닌, 별개의 함수로 아웃소싱할 수도 있다.

```js
const emailReducer = () => {};

const Login = (props) => {
  ...
const [emailState, dispatchEmail] = useReducer(emailReducer);
...
}
```

- 먼저, `Login` 컴포넌트 함수 밖에서 `emailReducer`라는 이름의 함수를 선언한다. 우리는 이 `emailReducer` 함수는 컴포넌트 함수 밖에서 만들었다는 것에 주목해야 한다. 이 `emailReducer`라는 리듀서 함수가 컴포넌트 밖에서 만들어진 이유는 이 리듀서 함수 안에서는 `Login` 컴포넌트 함수 내부에서 만들어진 "데이터"는 필요하지 않기 때문이다. 따라서, 이 리듀서 함수(`emailReducer`)는 `Login` 컴포넌트 함수 범위 밖에서 만들어졌다. (그러면 컴포넌트 함수 내부의 것들과 상호작용할 필요가 없어진다.) 또한 리듀서 함수(`emailReducer`)는 함수 안에서 요청되거나 활용될 모든 데이터는 `emailReducer` 라는 이름의 함수로 전달될 것이다. 그리고 당연하게도 이는 React에 의해서 자동으로 실행된다.

```js
const emailReducer = (state, action) => {};
```

- 이 리듀서 함수(`emailReducer`)는 2개의 인수, 2개의 parameter를 갖는다. 바로 최신 상태 스냅 샷(state)와 디스패치 된 액션(action)이다.

```js
const emailReducer = (state, action) => {
  return { value: "", isValid: false };
};
```

- 그리고, 리듀서 함수(`emailReducer`)는 새로운 상태(state)를 반환한다. 여기서 반환되는 새로운 상태(state)는 값(value)을 담은 객체일 수 있다. 먼저, value 의 초기 값인 빈 문자열을 할당한 뒤, isValid 필드의 초기값인 false 도 추가한다. state와 action에 상관없이, 반환을 해야하기 때문에 초기값을 먼저 설정하도록 하는 것이다.

```js
const emailReducer = (state, action) => {
  return { value: "", isValid: false };
};

const Login = (props) => {
  ...
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
  });
  ...
}
```

- `useReducer`가 받는 두번째 인자인 `initialState`는 초기 상태를 설정할 수 있다. 먼저, 우리가 설정하고자 하는 초기 상태(value, isValid)를 추가해주었다. 이 초기 상태는 우리가 리듀서 함수(`emailReducer`)의 `emailState`에서 설정한 초기 상태이다. 여기까지 마치면 이제 우리는 최신 상태(state) 스냅 샷인 `emailState`를 코드 내에서 사용할 수 있게 된다.

### 최신 상태 값 `emailState` 사용해보기

```js
const passwordChangeHandler = (event) => {
  setEnteredPassword(event.target.value);

  setFormIsValid(
    enteredEmail.includes("@") && event.target.value.trim().length > 6
  );
};
```

- 먼저 기존의 `passwordChangeHandler` 핸들러 함수에서 `setFormIsValid`를 업데이트할 때 사용하던 `enteredEmail` 상태(state)를 `emailState`로 바꿔서 설정해보자. 물론 `emailState`의 `value` 값으로 접근해서 value 값의 유효성을 체크해야 할 것이다.

```js
const passwordChangeHandler = (event) => {
  setEnteredPassword(event.target.value);

  setFormIsValid(
    emailState.value.includes("@") && event.target.value.trim().length > 6
  );
};
```

- email 입력 값의 유효성을 체크하던 `validateEmailHandler` 핸들러 함수에서도 기존의 `useState`를 이용하던 것들을 모두 `useReducer`로 대체하여 수정할 생각이다.

```js
const validateEmailHandler = () => {
  setEmailIsValid(emailState.value.includes("@"));
};
```

- (`validateEmailHandler` 함수 내부에서 `enteredEmail`로 email의 유효성을 체크하던)`setEmailIsValid`라는 업데이트 함수 내에서도 `emailState`로 수정하여 `value` 값으로 접근해서 사용했다. 여기서 알아둬야 할 점은 리듀서 함수(`emailReducer`) 에서 반환하는 객체 값에는 isValid 도 있다는 사실이다.

```js
const passwordChangeHandler = (event) => {
  setEnteredPassword(event.target.value);

  setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
};
```

- 방금 전에 `emailState.value.includes("@")`로 수정했던 부분을 지우고, `emailState.isValid`로 수정하면서 간단하게 유효성 체크, true 인지 false 인지를 체크할 수 있게 되었다. 좀 전에 수정한 유효성 체크 핸들러 함수도 isValud를 사용해서 간단하게 수정해보자.

```js
const validateEmailHandler = () => {
  setEmailIsValid(emailState.isValid);
};
```

- `emailState.value.includes("@")`를 `emailState.isValid`로 간단하게 접근하여 수정했다. 리듀서에서 관리하는 `emailState`를 이용해서 기존의 `useState`로 관리해주던 상태들을 계속 수정해보자.

```js
const submitHandler = (event) => {
  event.preventDefault();
  props.onLogin(enteredEmail, enteredPassword);
};
```

- `submitHandler` 함수에서 `props.onLogin`의 첫번째 인자로 보내주었던 `enteredEmail` 상태 값을,

```js
const submitHandler = (event) => {
  event.preventDefault();
  props.onLogin(emailState.value, enteredPassword);
};
```

- `emailState.value`로 변경해주었다. 다음은 JSX 코드 내에서 사용하던 user의 email 과 관련한 state 값들을 전부 리듀서에서 관리하는 `emailState`를 이용해서 수정해보자.

#### before

```js
<div
  className={`${classes.control} ${
      emailIsValid === false ? classes.invalid : ""
  }`}
>
...
<input
  type="email"
  id="email"
  value={enteredEmail}
  onChange={emailChangeHandler}
  onBlur={validateEmailHandler}
/>
```

#### after

```js
<div
  className={`${classes.control} ${
      emailState.isValid === false ? classes.invalid : ""
  }`}
>
...
<input
  type="email"
  id="email"
  value={emailState.value}
  onChange={emailChangeHandler}
  onBlur={validateEmailHandler}
/>
```

- 이제 기존에 `useState`로 관리하던 `enteredEmail`과 `emailIsValid`는 사용할 필요가 없어졌으니 주석처리를 하도록 하자.

```js
// const [enteredEmail, setEnteredEmail] = useState("");
// const [emailIsValid, setEmailIsValid] = useState();
```

- 주석처리를 해보면, 기존에 사용하던 `setEmailIsValid`과 `setEnteredEmail`를 대체하지 않은 상태에서 주석처리를 했기 때문에 당연히 error가 발생할 것이다. 이때 아직 남아있는 리듀서의 함수 작업, 즉 'action'을 디스패치 해줘야 한다.

### 'action'을 디스패치 해보기

```js
const emailChangeHandler = (event) => {
  setEnteredEmail(event.target.value);
  ...
};
```

- 먼저, 사용자 email 입력 값을 처리해주는 `emailChangeHandler` 함수부터 수정해보자. `setEnteredEmail`로 상태를 업데이트해주고 있었지만 우리가 설정한 리듀서 상태 업데이트 함수인 `dispatchEmail`를 이용해서 상태(state)를 업데이트할 수 있을 것이다.

```js
const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
});

...

const emailChangeHandler = (event) => {
  dispatchEmail();
  ...
};
```

- 이제 `dispatchEmail`에 'action' 을 보내야 한다. 이 'action'을 정하는 건 각자의 몫이기 때문에 원하는 대로 문자열 식별자로 하거나 숫자로도 지정할 수 있을 것이다. 하지만 보통은 'action'을 객체로 자주 사용한다. 생성자를 품고 있는 필드를 갖는 객체 말이다.

```js
dispatchEmail({ type: "USER_INPUT" });
```

- 필드의 이름은 주로 type 으로 쓴다. 값은 "USER_INPUT" 로 설정했다. 이 값은 대문자로만 이루어진 문자열이지만 관례적으로 대문자를 사용하기 때문에 대문자로만 이루어진 문자열을 사용하는 게 더 좋을지도 모른다. 문자열을 모두 대문자로 채워서 알아보기 쉬운 식별자로 만드는 것이다.

```js
dispatchEmail({ type: "USER_INPUT", val: event.target.value });
```

- 'action'에 추가적인 페이로드를 추가할 수 있다. 추가할 수 있다고 말하는 이유는 보통은 선택사항이기 때문이다. 우리는 유저가 입력한 값을 저장하길 원하기 때문에 이 페이로드를 추가하기로 선택했다. 바로 val 이란 필드를 추가하고, 여기에 유저가 입력한 값인 `event.target.value`을 담을 수 있도록 한다.
- 이것이 바로 'action'이다. 이는 객체로서 type 이란 필드를 가지며 이는 일어난 일을 설명해주고, 추가적인 페이로드인 val 이란 필드로 유저가 입력한 값을 갖는다. 이제 `dispatchEmail()`은 `useReducer`가 보낸 리듀서 함수인 `emailReducer` 이란 이름의 함수를 실행시킬 수 있게 되었다.

```js
const emailReducer = (state, action) => {
  return { value: "", isValid: false };
};
```

- 이제 `emailReducer`은 `dispatchEmail()`으로부터 받은 객체 타입의 'action'을 사용할 수 있게 되었다.

```js
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
  }
  return { value: "", isValid: false };
};
```

- if 문을 추가한 뒤, `dispatchEmail()`으로부터 받은 'action'의 type 으로 접근하여 "USER_INPUT" 과 같은지를 체크해볼 수 있을 것이다. 그리고 'action'으로 디스패치한 것은 객체일 것이다.

```js
dispatchEmail({ type: "USER_INPUT", val: event.target.value });
```

> 우리가 `dispatchEmail` 함수에서 'action' 을 보낼 때 이렇게 객체 타입으로 보냈기 때문이다. 그리고 해당 객체는 type과 val 이란 필드를 가지고 있기 때문에 `action.type`이나 `action.val`로 접근할 수 있게 된다.

- 그리고 만약 `action.type`의 값이 "USER_INPUT" 와 일치한다면, default 값으로 설정했던 것처럼 텅빈 스냅 샷을 반환하는 것이 아니라, user email 에 대한 스냅 샷을 반환하게 할 수 있을 것이다.

```js
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  return { value: "", isValid: false };
};
```

- value 는 `action.val`(우리가 'action'에 추가한 페이로드)을 지정하고 isValid는 `action.val`로 접근하여 유효성을 체크(true/false)한 값으로 넣어준다. value 와 isValid 값 모두 최신 스냅 샷으로 업데이트를 해준다. 유저 input과 관련한 'action'을 받았을 때 단지 value 값 뿐만 아니라 isValid도 함께 업데이트할 수 있는 것이다.

> 만약 `emailReducer`에 닿을 수 없는 다른 'action'에 대해서는 당연히 default 값으로 설정한 `return { value: "", isValid: false }`가 반환될 것이다.

- 남은 로직들도 이어서 수정을 진행해보자.

```js
const validateEmailHandler = () => {
  setEmailIsValid(emailState.isValid);
};
```

- `useState`로 상태를 업데이트 해주었던 `setEmailIsValid`를 지우고, 'action' 을 디스패치 해줄 것이다.

```js
const validateEmailHandler = () => {
  dispatchEmail({});
};
```

- `dispatchEmail()` 함수를 불러오고, 디스패치 할 'action'을 담을 객체를 설정해준다. 또 다시 객체를 설정하는 이유는 '일관성' 때문이며, 'action'은 항상 동일한 스트럭쳐를 가져야 하기 때문이다. (그래야 type 속성 등에 접근할 때 실패하지 않을 것이다.) 한 번 'action'의 스트럭쳐를 결정했다면, 일관되게 그 스트럭쳐의 형태를 따라야만 한다.

```js
const validateEmailHandler = () => {
  dispatchEmail({ type: "INPUT_BLUR" });
};
```

- (type 필드를 통해 객체를 디스패치할 것이기 때문에) type 필드를 설정한 뒤 "INPUT_BLUR" 이라는 문자열을 할당한다. ("INPUT_BLUR"라는 문자열을 할당한 것은 input이 포커스를 잃어서 흐려졌기 때문에 이것을 설명하고자 작성했다.) 그 뒤의 val 값은 꼭 추가하지 않아도 된다. 우리가 여기에서 관심 있는 것은 단지 "Input 이 포커스를 잃었다는 것" 뿐이기 때문이다. 그리고 추가되어야 하는 추가 데이터도 없을테니, 해당 디스패치 되는 'action'은 이전보다 단순한 걸 알 수 있다. 여전히 객체이고 type 속성을 가지고 있으나 val 이란 값이 없을 뿐이다. 그리고 val 이 없다는 사실은 문제가 되지 않는다. 왜냐하면 val 에 접근하려고 했던 부분은 "INPUT_BLUR" type의 'action' 에서는 실행되지 않기 때문이다. 그리고 val 에 접근하는 것은 action 유형이 "USER_INPUT" 일 때만 실행될 것이다.

```js
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
  }
  return { value: "", isValid: false };
};
```

- 이제 리듀서 함수(`emailReducer`)에서 해당 action 을 받아 type이 "INPUT_BLUR" 인지를 체크해줄 것이다. 만약 type이 "INPUT_BLUR" 라면 또 다른 새로운 스냅 샷(`emailState`에 대한 새로운 상태 값)을 반환해줘야 한다.

```js
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: , isValid:  };
  }
  return { value: "", isValid: false };
};
```

- value 필드와 isValid 필드는 이전에 있었던 상태(state) 값이어야 할 것이다. 텅 빈 상태로 리셋할 수는 없기 때문이다. 유저가 input 에 무언가를 입력한 후에야 input이 흐려질 수 있기 때문이다.

```js
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state, isValid: state };
  }
  return { value: "", isValid: false };
};
```

- value 값으로는 새로운 스냅 샷(이전에 최신 상태 값)을 받아온다. 그리고 이것은 확실히 '최종' 상태 스냅 샷일 것이다. React는 상태(state) 스냅 샷을 제공하고, 최신 스냅 샷만을 제공하기 때문이다.

```js
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};
```

- value 값은 state(상태)의 value로 안전하게 접근할 수 있다. 즉, email에 입력된 최신 값에 접근하는 것이다. isValid 역시 state(상태)를 이용해서 alue로 안전하게 접근한 뒤, 이 값이 타당한지를 체크할 수 있다. (물론 이 유효성 검사를 함수로 리팩터할 수도 있지만, 지금은 넘어가도록 하자)

![ezgif com-gif-maker (28)](https://user-images.githubusercontent.com/53133662/161487294-189e65cd-7ea5-4c74-b731-7c1c7bb32cf4.gif)

- 로그아웃을 해보면, email input 창이 흐려져 있는 걸 알 수 있다. 왜그럴까?

```js
const [emailState, dispatchEmail] = useReducer(emailReducer, {
  value: "",
  isValid: false,
});
```

- 우리가 초반에 설정한 isValid 의 초기값이 false 이기 때문이다. 만약 우리가 false가 아니라 undefined 나 null 로 설정한 뒤 동일하게 로그아웃을 해보면,

```js
const [emailState, dispatchEmail] = useReducer(emailReducer, {
  value: "",
  isValid: null,
});
```

![ezgif com-gif-maker (29)](https://user-images.githubusercontent.com/53133662/161487707-1b37af5c-d3bc-4476-b8fa-cacb3c903604.gif)

- email input 창이 아무런 변화가 없다는 걸 확인할 수 있다. 즉, 처음부터 blur 된 것처럼 취급되지 않는 것이다. 다시 로그인을 실행해보면,

![ezgif com-gif-maker (30)](https://user-images.githubusercontent.com/53133662/161488160-5addb260-3f34-4a30-bc80-40c82342d454.gif)

- `useReducer`를 사용하기 전과 동일하게 작동되고 있음을 확인할 수 있다. `useReducer`를 사용하게 되면서 emailState를 하나로 묶어서 하나의 장소에서 관리할 수 있었고, `Login` 컴포넌트 내부에서의 코드가 보다 간결해질 수 있었다.

</br>

## useReducer & useEffect

### user password의 상태관리

- `useReducer` 호출 한뒤 reducer 함수 생성하고 초기값 전달

```js
const passwordReducer = (state, action) => {
  return { value: "", isValid: false };
};

const Login = (props) => {
  ...
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });
  ...
}
```

- `useState`로 관리되었던 상태(state) 값 모두 `useReducer`의 상태(state) 값으로 수정

```js
const emailChangeHandler = (event) => {
  dispatchEmail({ type: "USER_INPUT", val: event.target.value });

  setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
};

const submitHandler = (event) => {
  event.preventDefault();
  props.onLogin(emailState.value, passwordState.value);
};
```

```js
<div
  className={`${classes.control} ${
    passwordState.isValid === false ? classes.invalid : ""
  }`}
>
  <label htmlFor="password">Password</label>
  <input
    type="password"
    id="password"
    value={passwordState.value}
    onChange={passwordChangeHandler}
    onBlur={validatePasswordHandler}
  />
</div>
```

- `useState`로 관리해주던 상태 값 모두 주석처리

```js
// const [enteredPassword, setEnteredPassword] = useState("");
// const [passwordIsValid, setPasswordIsValid] = useState();
```

- 리듀서 함수(`passwordReducer`)에 `dispatchPassword` 함수로 디스패치 된 'action' 전달

```js
const passwordChangeHandler = (event) => {
  dispatchPassword({ type: "USER_INPUT", val: event.target.value });

  setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
};

const validatePasswordHandler = () => {
  dispatchPassword({ type: "INPUT_BLUR" });
};
```

- 리듀서 함수(`passwordReducer`)에 type에 맞는 새로운 객체 값 반환

```js
const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};
```

- 저장하고, 실행해보면

![ezgif com-gif-maker (32)](https://user-images.githubusercontent.com/53133662/161529354-04db1ba4-d7d1-4a8d-bfba-e64612ebe075.gif)

- user password input 도 정상적으로 작동하는 것을 확인할 수 있다.

```js
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};
```

- 지금까지 우리는 리듀서 함수를 하나만 사용해왔다. `emailReducer`와 `passwordReducer`는 유효성 검사 로직을 제외하고 거의 동일한 방식으로 이루어졌기 때문이다. (이는 분명 리팩터를 할 수 있는 부분이곘지만 여기에선 조금 복잡하기 때문에 일단 넘어가도록 하자.) 하지만 이것보다도 지금의 우리에겐 큰 문제가 남아있다. 바로 `formIsValid`의 상태관리이다.

### `formIsValid` 의 상태관리

```js
const [formIsValid, setFormIsValid] = useState(false);
```

- `useState`로 관리해주고 있는 `formIsValid` 라는 상태(state)는 input의 IsValid 와 약간은 관련이 있음을 알 수 있다. input은 전체적인 form 의 일부이기 때문이다. 따라서 우리가 그동안 `formIsValid` 라는 상태(state)로 관리해주던 로직들은 (어쩌면) 최적의 코드라고 말할 수 없을지도 모른다.

```js
const emailChangeHandler = (event) => {
  dispatchEmail({ type: "USER_INPUT", val: event.target.value });

  setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
};

const passwordChangeHandler = (event) => {
  dispatchPassword({ type: "USER_INPUT", val: event.target.value });

  setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
};
```

- 위의 로직들을 살펴보면, 우리는 여전히 `formIsValid` 를 다른 상태(state)들에 기반해서 업데이트해주고 있기 때문이다. 앞서 이야기했듯 이것은 분명 우리가 원하는 방식은 아니다. (React의 상태 업데이트 스케줄링을 생각해보자.) 우리는 아직도 최종 상태(state)가 아닌 상태를 기반하여 업데이트를 할지도 모른다는 위험성을 안고 있는 것이다.

```js
setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
```

- 물론 기술적으로 동일하게 속해있다고 해도 이렇게 쪼개져 있는 상태(state)를 가지고 있다는 건 좋은 방법일리도 또 최적의 상태(state)일리도 없다. 그래서 우리는 새로운 방법을 사용하고자 한다.

### `useEffect` 사용하기

```js
useEffect(() => {
  const identifier = setTimeout(() => {
    console.log("Checking form validity!");
    setFormIsValid(
      enteredEmail.includes("@") && enteredPassword.trim().length > 6
    );
  }, 500);

  return () => {
    console.log("CLEANUP");
    clearTimeout(identifier);
  };
}, [enteredEmail, enteredPassword]);
```

- 이전에 편의를 위해 주석처리를 해줬던 `useEffect` 로직을 다시 살려놓는다. 그리고 우리는 `useReducer`의 최적의 상태(state)를 기반으로 이 `useEffect` 내부에 있는 `formIsValid` 상태(state)를 업데이트해줄 것이다.

```js
useEffect(() => {
  ...
    setFormIsValid(emailState.isValid && passwordState.isValid);
  ...
}, [enteredEmail, enteredPassword]);
```

- 먼저, `setFormIsValid` 함수에서 `useState` 상태 기반이었던 로직인 `enteredEmail.includes("@")`와 `enteredPassword.trim().length > 6` 를 지우고, 그 자리를 리듀서 상태(state) 값인 `emailState`와 `passwordState`로 수정해준다. 그리고 각 상태(state) 값의 isValid 필드로 접근하여 간단하게 true/false 값으로 처리해준다.

```js
useEffect(() => {
  ...
    setFormIsValid(emailState.isValid && passwordState.isValid);
  ...
}, [emailState, passwordState]);
```

- 그리고 종속성 배열 안에 넣어주었던 `useState` 상태 기반이었던 `enteredEmail`와 `enteredPassword` 를 지워주고, 그 자리를 `useReducer` 상태 값인 `emailState`와 `passwordState`로 수정해준다. 이것은 `setFormIsValid` 를 요청하는 좋은 방법이다. 왜냐하면, `effect` 안에 있고, 상태(state) 최신 값을 적용하고 있기 때문이다. 하지만 이 `effect`는 종속성 배열에 추가한 `emailState`와 `passwordState`가 변경되면 언제든 다시 실행될 것이고, 따라서 결국은 가장 최근의 상태(state) 값을 기반으로 작동하게 될 것이다. 따라서,

```js
setFormIsValid(emailState.isValid && passwordState.isValid);
```

- 이런 방식은 다른 상태(state)를 기반으로 상태(state) 업데이트 하는 좋은 방법일 수 있다. `useEffect`로는 이것이 모든 상태 업데이트를 하는 React 수행에서 작동한다는 보장이 있으며, 이는 분명 수정하기 전과는 다른 경우이기 때문이다. 이전에는 코드가 너무 빨리 작동을 하거나 `useEffect`가 상태 업데이트 후에만 작동했을 수도 있었다. 이제 정상적으로 작동이 되는지 확인해보자.

![ezgif com-gif-maker (33)](https://user-images.githubusercontent.com/53133662/161533468-b742d9e8-4d23-431a-8855-eedc01230f4b.gif)

- 정상적으로 작동이 되는 걸 확인할 수 있다. 그러나 콘솔을 보면, 여기에 작은 문제가 여전히 존재하고 있음을 알 수 있다. 우리가 가동시킨 `effect`가 너무 자주 작동된다는 점이다. 우리가 `effect`의 종속성 값을 설정할 때, `emailState`와 `passwordState`로 지정했기 때문에 이 값들이 변경되면 언제든 다시 `effect`가 실행되고 있는 것이다. 당연히 우리는 `effect`가 이렇게 매번 다시 실행되는 상황을 원치 않을 것이다. 그리고 사실 우리는 `effect`에서 user 가 입력한 각 input 값의 isValid(유효성)만 신경쓰면 된다. 우리는 이 isValid 상태(state)를 업데이트할 때 value 값을 기반으로 업데이트 해왔음을 잊으면 안될 것이다.

```js
const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};
```

- 또한, 만약에 각각의 input의 유효성이 보장(유효성을 체크하는 로직이 true 가)되는 순간부터, 그리고 이 input 값에 다른 문자를 추가해도 isValid(유효성) 여부는 변하지 않을 것이다. 하지만 우리가 현재 설정한 `effect`는 isValid 값이 변하지 않음에도 불구하고 계속해서 `effect`를 다시 실행시키고 있다. 왜냐하면, 우리가 설정한 의존성 값(`emailState`와 `passwordState`)은 실제로 `effect` 내부에서 신경 써야만 하는 isValid 값이 아니기 때문이다. 그리고 이는 분명 좋은 방법이 아닐 것이다. 그럼 의존성 값을 어떻게 수정해야 할까? 먼저 새로운 테크닉을 사용해서 조금 더 편리하게 코드를 작성해볼 것이다.

### 객체 구조 분해 할당

```js
const {} = emailState;
```

- 객체 구조 분해 할당은 이전에도 배운 적 있는 기술이다. 우리는 이 기술을 이용해서 조금 더 쉽게 isValid 에 접근할 수 있도록 할 수 있다. 객체 구조 분해 할당은 객체의 어떤 값을 이끌어내는 기술이며, 이 기술을 사용해서 `emailState` 라는 상태(state)에서 isValid 를 추출할 수 있을 것이다. 그리고 추출한 isValid를 새로운 이름으로 할당할 수도 있다.

```js
const { isValid: emailValid } = emailState;
const { isValid: passwordValid } = passwordState;
```

- 각 상태(state) 마다 isValid 의 속성을 추출하고, 각각의 이름(`emailValid`, `passwordValid`)을 지정해주었다. 객체 구조 분해 할당을 통해 객체로부터 추출한 값에 새로운 이름을 매기는 것은 값을 할당하는 것이 아니라 추출한 값을 가리킬 새로운 이름이라고 보면 된다. 그리고 이것은 구조 분해 할당에서 자동으로 사용하는 문법 중에 하나이다. 이제 우리는 이 `emailValid`와 `passwordValid`를 사용해서 `effect`의 의존성 값을 수정할 것이다.

```js
const { isValid: emailValid } = emailState;
const { isValid: passwordValid } = passwordState;

useEffect(() => {
  const identifier = setTimeout(() => {
    console.log("Checking form validity!");
    setFormIsValid(emailState.isValid && passwordState.isValid);
  }, 500);

  return () => {
    console.log("CLEANUP");
    clearTimeout(identifier);
  };
}, [emailValid, passwordValid]);
```

- 그리고 `effect`는 더이상 `emailState`나 `passwordState`로 isValid 에 접근해서 사용할 수 없기 때문에 `emailValid`와 `passwordValid`로 수정해준다.

```js
const { isValid: emailValid } = emailState;
const { isValid: passwordValid } = passwordState;

useEffect(() => {
  const identifier = setTimeout(() => {
    console.log("Checking form validity!");
    setFormIsValid(emailValid && passwordValid);
  }, 500);

  return () => {
    console.log("CLEANUP");
    clearTimeout(identifier);
  };
}, [emailValid, passwordValid]);
```

- 지금까지 각각의 상태(state)의 isValid 상태(state)를 객체 구조 분해 할당 문법을 통해 값을 끌어낸 뒤 이것을 기반으로 `effect`를 수정했다. 이제 `effect`는 우리가 원하지 않을 때 재작동되지 않을 것이다. 실행 결과를 확인해보자.

![ezgif com-gif-maker (34)](https://user-images.githubusercontent.com/53133662/161537810-6aef651f-15ce-44fa-8839-1f82587df043.gif)

- 시작할 때 input 창에 무언가를 쓰기 시작하면 `effect`가 작동을 시작한 뒤, 각각의 `emailValid`와 `passwordValid`가 한 번 작동하게 됐을 때 이 상태에서 새로운 문자가 추가되어도 `effect`가 재실행되지 않는 걸 알 수 있다. 이것은 isValid(유효성)가 한 번 작동된 이후부터는 변하지 않기 때문이다. (물론, 짧게 입력하거나 유효성에 맞지 않게 입력하면 isValid가 false가 되므로, 다시 `effect`가 작동될 것이다.)

### 정리

- 지금까지 `useReducer`를 이용해서 `useEffect`를 최적화하는 방법에 대해서 배워보았다. 이는 최적화에서 중요한 개념이며, 불필요한 `effect`의 수행을 방지하기 위한 일이기 때문에 반드시 이해하고 넘어가야 한다. (만약 `effect`의 의존성 값으로 props를 가지게 되었을 때 앞에서 배운 개념을 사용해서 최적화할 수도 있을 것이다.)

</br>

## 중첩 속성을 useEffect에 종속성으로 추가하기

- 이전 강의에서 우리는 `useEffect`에 객체 속성을 종속성으로 추가하기 위해서 '구조 분해 할당'이라는 개념을 이용했다.

- [MDN 문서 참조 : Destructuring assignment ](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [모던 자바스크립트 문서 참조 : 구조 분해 할당 ](https://ko.javascript.info/destructuring-assignment)

```js
const { someProperty } = someObject;

useEffect(() => {
  // code that only uses someProperty ...
}, [someProperty]);
```

- 이것은 매우 일반적인 패턴 및 접근 방식이다. 핵심은 우리가 '구조 분해 할당'을 사용한다는 것이 아니라, 전체 개체 대신 특정 속성을 종속성으로 전달한다는 것에 있다. 우리는 아래와 같이 코드를 작성할 수도 있으며 이는 위의 코드와 같은 방식으로 작동한다.

```js
useEffect(() => {
  // code that only uses someProperty ...
}, [someObject.someProperty]);
```

- 반면 우리는 아래의 코드같은 방식은 절대적으로 지양해야 한다.

```js
useEffect(() => {
  // code that only uses someProperty ...
}, [someObject]);
```

- 왜냐하면 `effect` 함수는 `someObject` 가 변경될 때마다 재실행될 것이기 때문이며, `someObject`는 단일 속성이 아니기 때문이다.

</br>

## State 관리를 위한 useReducer VS useState

- 지금까지 우리는 `useState`와 `useReducer`는 언제, 어떻게 사용해야 하는지에 대해서 배웠다. 특히나 `useReducer`는 언제 `useState`를 대체해서 사용해야 하는지(물론 항상 적용되는 법칙은 아니겠지만)에 대해서도 충분히 배웠을 것이라 생각한다.

### `useState`

1.  `useState`는 주로 사용하는 상태 관리 방법이다. 대부분의 사람들은 보통 `useState`로 시작할 것이고, 대체로 `useState`만으로도 그럭저럭 가능할 때도 많다.
2.  상태(state)와 데이터의 독립된 부분을 다루기 좋으며, 간단한 상태(state)를 관리할 때 사용한다.
3.  상태(state) 업데이트가 쉽고, 업데이트 종류가 적게 제한되어 있다면 `useState`를 사용하는 게 좋다. 특히나, 상태(state)를 변경하는 케이스가 적거나, 상태(state)가 복잡한 객체 형식으로 이루어지지 않았을 때 `useState`를 사용하면 된다.

### `useReducer`

1. 상태(state)가 객체이거나, 그보다 더 복잡한 경우일 때 `useReducer`를 사용한다. 왜냐하면 보통 `useReducer`는 `useState`보다 더 많은 기능과 힘이 있기 때문이다. 추가로 설명하자면, `useReducer`는 더 복잡한 상태(state) 업데이트 로직을 포함할 수 있는 리듀서 함수를 사용할 수 있다는 뜻이며, 이 리듀서 함수를 사용함으로써 항상 최근의 상태(state)의 스냅 샷 작업이 보장된다는 뜻이다. 또한, 잠재적으로는 더 복잡한 로직을 컴포넌트 함수 body 에서 별개의 리듀서 함수로 아웃소싱하여 옮길 수도 있게 된다.
2. 우리가 처리할 데이터가 관련된 여러 상태(state)를 기반으로 한 상태(state) 데이터일 때 `useReducer`를 사용한다. 예를 들면, form input 상태(state)일 때를 생각해보자. 일반적으로 `useReducer`는 상태(state)가 복잡할 때나 다른 케이스, 다른 액션을 기반으로 상태(state) 혹은 케이스를 변경할 일이 있을 때 도움이 된다. 여러 곳에서 관리하는 상태(state)이지만 관점만 다르거나 동시에 업데이트하면서 서로 관련이 있는 멀티플 상태(state)를 다룰 때 `useReducer`는 좋은 옵션이다.

### 결론

- `useState`와 `useReducer`의 사용여부를 따져서 사용하는데에는 사실 어려운 규칙이란 건 없으며, (프로그래밍에서 늘 그렇듯) 확실히 뭐가 더 낫고 옳고 그른 것도 없을 것이다. 우리는 분명 `useState`와 함께 `useReducer`를 사용해서 케이스를 다룰 것이고, 특히 `useEffect`와 결합하면 이전보다는 훨씬 더 좋은 코드를 작성할 수 있게 될 뿐이다. 하지만 때로는 `useReducer`가 더 멋있고 간단해보일 때도 있다. 물론, 이러한 이유로 언제나 `useState` 대신 `useReducer`를 사용하는 건 지양해야 할 것이다. 왜냐하면 `useReducer`를 선택하는 게 성능의 효율성보다 훨씬 과할 때가 많기 때문이다. 상태(state)가 단지 두 개의 다른 값을 변화시키만 하는 것에 목적이 있다면 확실히 `useReducer`를 대신 사용하는 것은 과한 선택일 수도 있을 것이다.

</br>

## 리액트 Context API 소개

- `useReducer`을 사용하면서 접할 수도 있는 문제를 살펴보자. 물론 흔하게 마주치는 문제는 아니며, 지금보다 훨씬 더 큰 React 어플리케이션에서 발생할 수 있는 문제라고 보면 될 것이다. 그리고 지금부터 조금 더 세련된 방식으로 이 문제를 해결하고자 한다.

### 우리가 마주치는 문제

- 많은 컴포넌트들 사이를 props로 경유하여 지나가는 데이터들을 생각해보자. `App` 컴포넌트의 `isLoggedIn` 상태(state)와 `login`과 관련된 함수들이 좋은 예가 될 것이다.

```js
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = (email, password) => {
    localStorage.setItem("isLoggedIn", "1");
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <React.Fragment>
      <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
    </React.Fragment>
  );
}
```

- 위의 `App` 컴포넌트 함수를 살펴보면 `login`과 관련한 상태(state)를 `App` 컴포넌트에서 관리해주고 있는 걸 알 수 있다. 그렇기에 `isLoggedIn` 이라는 상태(state)를 변경하고 업데이트를 하기 위해서는 해당 상태와 `isLoggedIn` 의 상태를 업데이트해주는 함수가 현재 이 어플리케이션의 모든 곳에서 필요하다고 보면 될 것이다.

```js
<React.Fragment>
  <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
  <main>
    {!isLoggedIn && <Login onLogin={loginHandler} />}
    {isLoggedIn && <Home onLogout={logoutHandler} />}
  </main>
</React.Fragment>
```

- `App` 컴포넌트 함수에서는 `MainHaeder` 컴포넌트에 `isLoggedIn` 상태(state)를 `isAuthenticated` 이라는 prop으로 넘겨주고 있다. 그리고 onLogout 을 위한 함수 `logoutHandler`도 prop으로 포인터를 이동시켜주었다.

```js
<main>
  {!isLoggedIn && <Login onLogin={loginHandler} />}
  {isLoggedIn && <Home onLogout={logoutHandler} />}
</main>
```

- 또한 `isLoggedIn` 상태(state)는 다른 컴포넌트(`Login`, `Home`) 콘텐츠를 렌더하는 데도 사용되고 있다. 그리고 이 컴포넌트들은 각각 `loginHandler` 이나 `logoutHandler` 같은 `isLoggedIn` 상태(state)를 업데이트해주는 트리거 함수를 props로 받고 있다.

#### Home.js

```js
const Home = (props) => {
  return (
    <Card className={classes.home}>
      <h1>Welcome back!</h1>
    </Card>
  );
};
```

![image](https://user-images.githubusercontent.com/53133662/161989027-28f693ab-2db7-4363-a074-653b34fca533.png)

- `App` 컴포넌트에서 props로 내려준 `logoutHandler` 함수는 `Home` 컴포넌트에서 받아오고 있는데, 이렇게 함으로써 우리가 버튼 컴포넌트를 추가하여 사용자가 로그아웃을 할 수 있게 된다.

```js
const Home = (props) => {
  return (
    <Card className={classes.home}>
      <h1>Welcome back!</h1>
      <Button onClick={props.onLogout}>Logout</Button>
    </Card>
  );
};
```

![ezgif com-gif-maker (35)](https://user-images.githubusercontent.com/53133662/161989529-5d65fa45-e149-4a5d-8462-68e2801731a6.gif)

- 요약하자면, 우리는 이 `isLoggedIn` 상태(state)가 어플리케이션의 각기 다른 장소에서 필요하고 사용되어야 한다는 뜻이다. 물론 이 데모 어플리케이션은 아주 단순하고 간단한 어플리케이션이기 때문에 이런 식으로 상태(state)가 여러 컴포넌트 사이를 지나다니는 것은 큰 문제가 아닐 수도 있다. 그리고 데이터가 prop을 통과해서 다른 컴포넌트로 전달하여 사용되는 건 흔한 일이다. 하지만 상태(state)가 다수의 컴포넌트를 통과하는 건 분명 문제가 될 수 있다. 따라서 props를 효율적으로 잘 이용해서 데이터를 다른 컴포넌트에 전달해야 한다.

```js
<React.Fragment>
  <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
  <main>
    {!isLoggedIn && <Login onLogin={loginHandler} />}
    {isLoggedIn && <Home onLogout={logoutHandler} />}
  </main>
</React.Fragment>
```

- 다시 현재 `App` 컴포넌트를 살펴보자. 해당 컴포넌트에서는 `isLoggedIn` 상태(state)가 `isAuthenticated` prop을 통과하여 `MainHeader` 컴포넌트로 가게 하고, 또 `logoutHandler`는 `onLogout` prop을 통과하여 똑같이 `MainHeader` 컴포넌트로 가도록 한 것을 알 수 있다.

#### MainHeader.js

```js
const MainHeader = (props) => {
  return (
    <header className={classes["main-header"]}>
      <h1>A Typical Page</h1>
      <Navigation
        isLoggedIn={props.isAuthenticated}
        onLogout={props.onLogout}
      />
    </header>
  );
};
```

- 그렇지만 `MainHeader` 컴포넌트 내부에서는 `App` 컴포넌트에서 전달받은 두개의 props 모두 사용하지 않는 걸 볼 수 있다. 그저 props 들을 다시 `Navigation` 컴포넌트로 prop 하고 있을 뿐이다.

#### Navigation.js

```js
const Navigation = (props) => {
  return (
    <nav className={classes.nav}>
      <ul>
        {props.isLoggedIn && (
          <li>
            <a href="/">Users</a>
          </li>
        )}
        {props.isLoggedIn && (
          <li>
            <a href="/">Admin</a>
          </li>
        )}
        {props.isLoggedIn && (
          <li>
            <button onClick={props.onLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};
```

- `Navigation` 컴포넌트에서 `isLoggedIn` data는 다른 링크를 렌더하는데 필요하고, 또한 button에서 `App` 컴포넌트의 `logoutHandler` 함수를 실행시켜 사용자를 로그아웃 시키기 위해서는 `onLogout` prop data가 필요하다. 그리고 `MainHeader` 컴포넌트는 그저 중간에서 `Navigation` 컴포넌트에 props 데이터를 대신 전달하기 위해 존재한다. 물론 이런 방법이 꼭 문제가 되는 것은 아니다. 다만 지금보다 큰 어플리케이션에서는 이런 prop 체이닝을 사용하면 점점 길어지고 복잡해질 가능성이 높아질 뿐이다.

- 어떤 컴포넌트는 parent 컴포넌트로부터 데이터가 필요하지만 이 데이터를 parent 에 전달하지는 않는데 심지어 parent는 데이터를 관리하지도 않고 필요하지 않을 수도 있다. 그래서 우리는 Component-wide "behind the scenes" State Storage를 생성한다. 앞으로 소개할 React Context 라는 개념에서는 Component-wide State Storage 에서 액션을 촉발할 수 있기 때문에 이전과 같은 prop chain 을 생성하지 않아도 컴포넌트로 직접 데이터를 전달할 수 있게 된다. 그리고 우리는 이 개념을 토대로 좀 더 세련된 방법으로 문제를 해결할 수 있다.

  </br>

## 리액트 컨텍스트 API 사용하기

- `React Context`의 개념에서 우리는 어떤 컴포넌트에서든지 prop 체인을 만들지 않고도 직접 상태(state)를 전달하거나 이를 통해서 관리할 수 있다. 지금부터 실전을 통해 `React Context`의 개념을 이해하도록 해보자.

### 리액트 컨텍스트 API 실전편

- 먼저 `src` 폴더에 `store` 폴더를 새로 생성해보자.

![image](https://user-images.githubusercontent.com/53133662/162215811-25819938-d035-409a-bf69-7d025ab3c771.png)

- React Context 를 사용할 폴더를 생성할 때 보통은 `store`나 `context` 혹은 `state`로 이름을 짓는다. 그리고 이 폴더 안에 (우리는 authentication 상태(state)를 다룰 것이므로) `auth_context`라는 이름의 js 파일을 생성한다. `AuthContext`처럼 PascalCase 로 이름을 지어도 되지만 이것이 내포할 수 있는 의미는 컴포넌트에 가까우므로, 이번에는 kebab-case로 작성해주었다. 이제 `auth_context.js`는 다중 Context를 앱의 다중 전역 상태(state)에서 가질 수 있을 것이며, 하나의 context를 더 큰 상태(state)에서도 가질 수도 있을 것이다. 하지만 context가 작동하는 방법을 먼저 알아보는 게 좋을 것이다.

### 리액트 컨텍스트 작동원리

#### auth_context.js

```js
import React from "react";

React.createContext();
```

- 먼저 React를 import 해온 뒤, React에 내장 API 인 `createContext()`를 불러온다. `createContext`는 default Context를 가지는데, 이 default Context는 `App` 컴포넌트나 다른 컴포넌트의 Wide 상태(state)가 될 것이다. 따라서 이 wide 상태(state)를 정하는 건 온전히 내 몫이다.

```js
import React from "react";

React.createContext("simple string state");
```

- 이 default Context는 문자열처럼 단순한 상태(state)여도 괜찮다. 만약 `App` 컴포넌트나 다른 컴포넌트의 wide 상태(state)여야 하는 게 단순히 문자 몇 개라면 말이다.

```js
import React from "react";

React.createContext({
  isLoggedIn: false,
});
```

- 이 default Context는 객체가 될 수도 있다. 현재의 데모 어플리케이션에 대입해보자면 이 객체는 `isLoggedIn` 상태(state)를 관리할 객체가 될 것이다. 당연히 `isLoggedIn` 상태(state)의 초기값도 함께 설정해준다.

```js
import React from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
});

export default AuthContext;
```

- Context에 `AuthContext` 라는 이름을 짓고 다른 컴포넌트에서 해당 Context를 사용할 수 있도록 export default 를 써서 밖으로 내보내도록 한다. 이제 우리는 이 `AuthContext` 라는 이름을 통해 Context 객체를 불러올 수 있게 되었으며, 다른 컴포넌트에서 해당 Context를 사용할 수 있는 자격이 주어지게 되었다. 물론 이 Context를 어플리케이션 모든 곳에서 사용하기 위해서는 최상위 컴포넌트인 `App` 에서 warpping을 해주는 작업이 필요할 것이다.

### 리액트 컨텍스트의 공급자 `Provider`

- 리액트 컨텍스트에서 공급이란 JSX 코드를 warp 해주는 것을 뜻한다. warp 된 모든 컴포넌트는 Context 내부를 탭할 수 있어야 할 것이고, 그래서 Context를 리스닝할 수 있어야 할 것이다. 이말인 즉슨, 리액트 컨텍스트로 warp 되지 않은 컴포넌트는 리액트 컨텍스트를 리스닝할 수 없다는 이야기이다.

#### Before : App.js

```js
<React.Fragment>
  <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
  <main>
    {!isLoggedIn && <Login onLogin={loginHandler} />}
    {isLoggedIn && <Home onLogout={logoutHandler} />}
  </main>
</React.Fragment>
```

#### After : App.js

```js
import AuthContext from "./store/auth-context";

...
<React.Fragment>
  <AuthContext.Provider>
    <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
    <main>
      {!isLoggedIn && <Login onLogin={loginHandler} />}
      {isLoggedIn && <Home onLogout={logoutHandler} />}
    </main>
  </AuthContext.Provider>
</React.Fragment>
```

- `App` 컴포넌트가 렌더하는 모든 컴포넌트들에서 해당 Context 가 필요하므로, `AuthContext`로 감싸준다. 그리고 `AuthContext` 컴포넌트에서 `.`을 찍으면 `AuthContext` 객체 상의 특징을 볼 수 있는데, 개중 `.Provider`를 불러올 수 있도록 한다. `.Provider`는 공급자의 역할을 하고 `AuthContext.Provider`는 컴포넌트로, JSX 코드 내에서만 사용할 수 있으며, 다른 컴포넌트를 warpping 해줄 수도 있다. 이렇게 warp 해주면 처음 감싸운 컴포넌트들의 자식 컴포넌트, 또 그 자식의 자식 컴포넌트 같은 후대의 컴포넌트들까지 Context 에 접근할 수 있다.

```js
<AuthContext.Provider>
  <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
  <main>
    {!isLoggedIn && <Login onLogin={loginHandler} />}
    {isLoggedIn && <Home onLogout={logoutHandler} />}
  </main>
</AuthContext.Provider>
```

- `AuthContext.Provider` 는 전체 JSX 코드를 감싸는 root 레벨의 컴포넌트 역할도 하기 때문에, `React.Fragment` 태그도 지워준다. 이제 `AuthContext.Provider`로 warp 해준 컴포넌트들 그리고 그 컴포넌트들의 자식 컴포넌트는 `AuthContext`에 접근할 수 있을 것이다.

### 리액트 컨텍스트를 듣는 `Consumer`

```js
const AuthContext = React.createContext({
  isLoggedIn: false,
});
```

- `AuthContext`의 default context 값은 계속 default 값일 것이며, 절대 변하지 않을 것이다. 우리는 어쨌든 이 value 값에 접근하려면 리액트 컨텍스트를 리스닝해야하고, 이 리스닝하는 방법에는 두 가지 방법이 있다. 우리는 두 가지 방법 중에 먼저 `Consumer`를 살펴보려고 한다.

#### Navigation.js

```js
<nav className={classes.nav}>
  <ul>
    {props.isLoggedIn && (
      <li>
        <a href="/">Users</a>
      </li>
    )}
    {props.isLoggedIn && (
      <li>
        <a href="/">Admin</a>
      </li>
    )}
    {props.isLoggedIn && (
      <li>
        <button onClick={props.onLogout}>Logout</button>
      </li>
    )}
  </ul>
</nav>
```

- 기존의 `Navigation` 컴포넌트에서 사용자의 로그인 인증 문제가 중요한 부분이라고 생각해보자. 이 `Navigation` 컴포넌트에서도 당연히 `AuthContext`를 사용할 수 있으며, 이 `Consumer`가 가르키고 있는 데이터가 필요한 모든 곳을 warp 해줄 수 있다. 예를 들어, `AuthContext` 의 값이 필요한 `Navigation`의 전체 태그들을 `AuthContext.Consumer`로 warp 할 수 있다는 이야기다.

```js
import AuthContext from "../../store/auth-context";
...
<AuthContext.Consumer>
  <nav className={classes.nav}>
    <ul>
      {props.isLoggedIn && (
        <li>
          <a href="/">Users</a>
        </li>
      )}
      {props.isLoggedIn && (
        <li>
          <a href="/">Admin</a>
        </li>
      )}
      {props.isLoggedIn && (
        <li>
          <button onClick={props.onLogout}>Logout</button>
        </li>
      )}
    </ul>
  </nav>
</AuthContext.Consumer>
```

- `Consumer`는 `Provider`와는 조금 다르게 작용한다. `Consumer`는 `{}` 사이에 함수가 있는 형태의 자식이 있다. 그리고 이 자식 함수의 전달인자로는 Context data가 전달된다. 지금의 경우에는 이전에 설정한 `AuthContext`의 default 값인 객체를 전달인자로 갖게 된다는 의미일 것이다.

```js
<AuthContext.Consumer>{(context의 데이터값, 우리는 AuthContext 객체 값일 것이다) => {}}</AuthContext.Consumer>
```

- 그리고 이 자식 함수에서는 JSX 코드를 return 해야 하는데, 이 JSX 코드는 Context 데이터에 접근하고 있어야 한다.

```js
<AuthContext.Consumer>
  {(ctx) => {
    return (
      <nav className={classes.nav}>
        <ul>
          {ctx.isLoggedIn && (
            <li>
              <a href="/">Users</a>
            </li>
          )}
          {props.isLoggedIn && (
            <li>
              <a href="/">Admin</a>
            </li>
          )}
          {props.isLoggedIn && (
            <li>
              <button onClick={props.onLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    );
  }}
</AuthContext.Consumer>
```

- 그동안 props 로 받은 데이터들을 전부 함수의 매개변수로 설정한 ctx(`AuthContext`이라는 객체값)로 접근하여 `isLoggedIn` 을 받아올 수 있도록 수정해준다. 이제 저장하고 라이브 서버를 열어보자.

![스크린샷 2022-04-08 오후 4 09 18](https://user-images.githubusercontent.com/53133662/162383146-dd1b682a-8931-4bc7-a71c-480d8899126a.png)

- 라이브 서버를 열어보면 어떤 에러로 인해 충돌이 났음을 알 수 있다. 충돌이 난 이유는 우리에겐 `AuthContext` 이라는 default Context 값이 있는데 이 default 값이 사용되는 건 오직 `Provider` 없이 `Consumer` 했을 때 뿐이기 때문이다.

#### default Context

```js
const AuthContext = React.createContext({
  isLoggedIn: false,
});
export default AuthContext;
```

#### `Provider` 없이 `Consumer` 한 Navigation.js

```js
<AuthContext.Consumer>
  {(ctx) => {
    return (
      <nav className={classes.nav}>
        <ul>
          {ctx.isLoggedIn && (
            <li>
              <a href="/">Users</a>
            </li>
          )}
          {props.isLoggedIn && (
            <li>
              <a href="/">Admin</a>
            </li>
          )}
          {props.isLoggedIn && (
            <li>
              <button onClick={props.onLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    );
  }}
</AuthContext.Consumer>
```

- 따지고 보면, `Provider`는 필요가 없다. 하지만 이 패턴을 기억해야 한다. 앞서 설명했듯이 `Provider`가 필요한 곳에는 default 값이 있으면 사실상 `Provider`가 필요 없다는 것을 말이다. 하지만 사실 우리는 Context를 변경할 수 있는 value 값을 갖기 위해 사용할 것이고, 그것은 `Provider`가 있을 때만 가능하다. 따라서 충돌이 일어나지 않게 하려면, `Provider`를 사용한 지점으로 돌아가서 살펴봐야 한다.

### `Provider`의 default 값을 설정하기

```js
<AuthContext.Provider>...</AuthContext.Provider>
```

- 먼저, `App` 컴포넌트의 JSX 코드에서 `AuthContext.Provider` 컴포넌트로 warp 해주었던 지점으로 돌아가 value 값을 설정해주기로 한다.

```js
<AuthContext.Provider value={}>...</AuthContext.Provider>
```

- value prop을 추가해주는데 이 value는 이름이 있는 value 여야 한다. 왜냐하면 이것은 우리가 만든 컴포넌트가 아니기 때문이고 이름을 설정해주려면 우리의 default 값 즉, `isLoggedIn` 상태를 담은 default 객체를 통과시켜야 한다. 따라서 이 경우에는 우리의 default 객체만 반복할 것이다.

```js
<AuthContext.Provider
  value={{
    isLoggedIn: false,
  }}
></AuthContext.Provider>
```

- 하지만 객체의 값을 변경할 수도 있다. 예를 들어, 상태(state)와 `App` 컴포넌트를 통해서 말이다. 그리고 변경할 때는 어제든지 새로운 value 값이 아래의 모든 consuming 컴포넌트를 지나야 할 것이다.

```js
<AuthContext.Provider
  value={{
    isLoggedIn: false,
  }}
>
  <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
  <main>
    {!isLoggedIn && <Login onLogin={loginHandler} />}
    {isLoggedIn && <Home onLogout={logoutHandler} />}
  </main>
</AuthContext.Provider>
```

- 이제 저장하고 라이브 서버를 열면, 충돌 없이 정상적으로 동작하고 있음을 알 수 있다. 당연히 로그인을 하면,

![ezgif com-gif-maker (37)](https://user-images.githubusercontent.com/53133662/162388426-58048799-0cba-4880-9c93-bbc5be00c1f1.gif)

- 링크가 하나만 있는 것이 보이고, 첫 번째 링크 즉 User 링크가 사라졌음을 알 수 있다. 왜 그럴까?

```js
{
  ctx.isLoggedIn && (
    <li>
      <a href="/">Users</a>
    </li>
  );
}
{
  props.isLoggedIn && (
    <li>
      <a href="/">Admin</a>
    </li>
  );
}
{
  props.isLoggedIn && (
    <li>
      <button onClick={props.onLogout}>Logout</button>
    </li>
  );
}
```

- User 의 링크만 `AuthContext`에서 데이터를 끌어왔기 때문이고, 이 `ctx.isLoggedIn`는 아직 초기 default 인 상태로 절대 바뀌지 않고 있기 때문이다.

```js
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  ...
  <AuthContext.Provider
    value={{
      isLoggedIn: false,
    }}
  >
   <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
  </AuthContext.Provider>
}
```

- 우리가 `App` 컴포넌트의 `Provider`에서 설정한 value 의 값, 즉 객체 안의 `isLoggedIn`이 false 로 설정되어 있는 걸 알 수 있다. 그리고 우리는 `App` 컴포넌트 내부에서 `isLoggedIn` 상태(state) 값을 처리하고 있다. 따라서, `isLoggedIn` value를 힘들게 하드코딩하는 대신에 `App` 컴포넌트 내부에서 `isLoggedIn` 상태(state)를 대신 설정해줄 수 있을 것이다.

```js
<AuthContext.Provider
  value={{
    isLoggedIn: isLoggedIn,
  }}
>
  <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
  <main>
    {!isLoggedIn && <Login onLogin={loginHandler} />}
    {isLoggedIn && <Home onLogout={logoutHandler} />}
  </main>
</AuthContext.Provider>
```

- 이렇게 하면 이 value 객체(`{ isLoggedIn: isLoggedIn }`)는 `isLoggedIn` 상태(state)가 변경이 될 때면 React가 자동으로 이 value 객체의 isLoggedIn 를 업데이트해줄 것이다. 그리고 새 객체인 Context 객체는 모든 리스닝 컴포넌트에게 이 업데이트된 Context 값을 전달할 것이며, 이 Context에서 Consumer하는 모든 컴포넌트로 전달될 것이다.

####

- 리액트 컨텍스트를 사용하기 이전과 다른 점은 우리가 상태(state) 데이터를 전달하기 위해 prop을 이용하지 않아도 된다는 점일 것이다. 대신에 데이터를 전달받을 컴포넌트들을 `Provider` 안에 감싸주기만 하면 되고, 그러면 이 `Provider` 안에 있는 child 컴포넌트들은 이 Context를 들을 수 있게 된다.

```js
<MainHeader onLogout={logoutHandler} />
```

- 우리는 이제 prop으로 데이터를 전달할 필요가 없게 되었으므로, `MainHeader` 컴포넌트에 prop으로 전달해주던 `isAuthenticated={isLoggedIn}` 를 제거할 수 있다.

#### MainHeader.js

```js
<header className={classes["main-header"]}>
  <h1>A Typical Page</h1>
  <Navigation isLoggedIn={props.isAuthenticated} onLogout={props.onLogout} />
</header>
```

- 그럼 `MainHeader` 컴포넌트에서 `Navigation` 컴포넌트로 데이터를 prop으로 전달한 `isLoggedIn={props.isAuthenticated}`도 제거해줄 수 있게 된다.

#### Navigation.js

```js
<AuthContext.Consumer>
  {(ctx) => {
    return (
      <nav className={classes.nav}>
        <ul>
          {ctx.isLoggedIn && (
            <li>
              <a href="/">Users</a>
            </li>
          )}
          {ctx.isLoggedIn && (
            <li>
              <a href="/">Admin</a>
            </li>
          )}
          {ctx.isLoggedIn && (
            <li>
              <button onClick={props.onLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    );
  }}
</AuthContext.Consumer>
```

- `Navigation` 컴포넌트도 마찬가지다. `Navigation`에서는 `ctx.isLoggedIn`을 `isLoggedIn`의 데이터가 필요한 모든 곳에서 사용할 수 있다. prop으로 받아오던 상태(state) 데이터를 모두 `ctx.isLoggedIn`으로 변경해준다.

### 정리

- 우리는 그동안 `MainHeader` 컴포넌트에서 상태 데이터를 prop을 받아온 후 사용하지도 않으면서 `Navigation`에 전달하는데에만 목적이 있었고, 이는 확실히 오직 데이터 전송만을 위한 기술이었다. 그러나, 이제는 Context 를 이용하게 되면서 `MainHeader` 컴포넌트에서 필요 없는 데이터 전송을 멈출 수 있게 된 것이다.
- 물론, Consumer는 Context를 리스닝하는 방법의 하나일 뿐이다. 그럭저럭 괜찮은 방법이긴 하지만, 가지고 있던 함수를 다시 코드로 되돌리는 이 문법은 어쩐지 세련된 방법이라 보긴 어렵다. 앞으로 배울 Context Hook 에서는 지금보다 더 세련된 솔루션을 구현할 수 있을 것이다.

  </br>

## useContext 훅으로 컨텍스트에 탭핑하기

#### Navigation.js

```js
<AuthContext.Consumer>
  {(ctx) => {
    return (
      <nav className={classes.nav}>
        <ul>
          {ctx.isLoggedIn && (
            <li>
              <a href="/">Users</a>
            </li>
          )}
          {ctx.isLoggedIn && (
            <li>
              <a href="/">Admin</a>
            </li>
          )}
          {ctx.isLoggedIn && (
            <li>
              <button onClick={props.onLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    );
  }}
</AuthContext.Consumer>
```

- 먼저, `Navigation` 컴포넌트에서 사용하던 `AuthContext.Consumer` 태그와 자식 함수들을 모두 지워준다.

```js
<nav className={classes.nav}>
  <ul>
    {ctx.isLoggedIn && (
      <li>
        <a href="/">Users</a>
      </li>
    )}
    {ctx.isLoggedIn && (
      <li>
        <a href="/">Admin</a>
      </li>
    )}
    {ctx.isLoggedIn && (
      <li>
        <button onClick={props.onLogout}>Logout</button>
      </li>
    )}
  </ul>
</nav>
```

- 이제 `Navigation` 컴포넌트에서 `ctx` 객체는 유효하지 않으므로, error가 발생할 것이다. 일단 그대로 놔두고, `useContext` hook을 사용하기 위해서 React에서 `useContext` hook을 import 해온다.

```js
import React, { useContext } from "react";
import AuthContext from "../../store/auth-context";

const Navigation = (props) => {
  useContext();
};
```

- `useContext()`은 이름이 의미하는 대로 이 hook으로 특정 Context를 가져다 사용할 수 있으며 사용법이 매우 간단하다. 먼저 `useContext()` hook에 받아올 인자로 사용고자 하는 Context 즉, 우리의 `AuthContext`을 넣어준다. 이렇게 `useContext` 인자로 `AuthContext`를 넣어주면 `AuthContext`의 값이 출력될 것이다. 물론 `Navigation` 컴포넌트 내부에서 이 Context를 사용할 수 있도록 생성자도 설정한다. 우리는 그간 ctx로 `.isLoggedIn`을 받아왔으므로 이 생성자를 ctx로 설정했다.

```js
import React, { useContext } from "react";
import AuthContext from "../../store/auth-context";

const Navigation = (props) => {
  const ctx = useContext(AuthContext);

  return (
    <nav className={classes.nav}>
      <ul>
        {ctx.isLoggedIn && (
          <li>
            <a href="/">Users</a>
          </li>
        )}
        {ctx.isLoggedIn && (
          <li>
            <a href="/">Admin</a>
          </li>
        )}
        {ctx.isLoggedIn && (
          <li>
            <button onClick={props.onLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};
```

- 코드를 저장하고 라이브서버를 확인해보면 정상적으로 작동하는 것을 확인할 수 있다. 물론 Context를 사용하면서 말이다. `useContext` hook은 확실히 Consumer 코드 보다 간단하고, 편리하다. 물론 원한다면 이전의 방법대로 Consumer 코드를 사용할 수도 있을 것이다. 두 가지의 방법 모두 틀리지 않았지만 그저 `useContext` hook을 사용하면 조금 더 간결하고 편리하게 사용할 수 있을 뿐이다.

</br>

## 컨텍스트를 동적으로 만들기

- 현재 `onLogout` props 와 `logoutHandler` 함수는 아직 포워딩하고 있는 중이지만 이상적인 방식이라고 말할 수는 없다.

#### App.js

```js
<MainHeader onLogout={logoutHandler} />
```

#### MainHeader.js

```js
<Navigation isLoggedIn={props.isAuthenticated} onLogout={props.onLogout} />
```

#### Navigation.js

```js
{
  ctx.isLoggedIn && (
    <li>
      <button onClick={props.onLogout}>Logout</button>
    </li>
  );
}
```

- `MainHeader` 컴포넌트에 데이터를 넣지 않으면

#### App.js

```js
<MainHeader />
```

#### MainHeader.js

```js
<Navigation />
```

-`onLogout`을 포워딩할 필요가 없다는 장점이 있지만, 지금은 작동하지 않는다. `App` 에서 `MainHeader` 컴포넌트에 prop으로 보내주던 `onLogout`을 지워버리면 현재는 로그아웃을 할 수 없다는 이야기다. 로그아웃 버튼을 눌러도 아무 일도 일어나지 않는다.

### Dynamic Context를 설정하기

- Dynamic Context를 설정해서 컴포넌트 뿐 아니라 함수에도 데이터를 생략할 수 있게 된다. 이제 우리가 할 일은 로그아웃이 동작할 수 있도록 `AuthContext.Provider`의 value 에 `onLogout`의 값을 추가하는 것이다.

```js
 <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
      }}
    >
```

- 이렇게 설정하면, `AuthContext`의 영향을 받는 모든 컴포넌트가 `logoutHandler` 함수를 이용할 수 있게 된다. 물론, `onLogout`이란 이름의 Context 를 통해서 말이다. 이제 `Navigation` 컴포넌트로 돌아가서,

```js
{
  ctx.isLoggedIn && (
    <li>
      <button onClick={ctx.onLogout}>Logout</button>
    </li>
  );
}
```

- `props.onLogout` 으로 들어가있던 데이터 값을 `ctx.onLogout` 으로 변경해준다. 우리는 `Navigation` 컴포넌트에서 ctx 라는 이름의 Context 객체에 `onLogout` 이라는 값에 접근할 수 있기 때문이다. 저장하면 로그아웃 버튼이 동작하면서 로그아웃이 실행되는 걸 알 수 있다.

- 우리는 `App` 혹은 다른 컴포넌트에서 Context 객체를 통해 일반 코드와 함수를 관리할 수 있게 되었다. 그렇기에 `Navigation` 컴포넌트에 인자로 받아왔던 `props`는 필요 없어지게 된다.

```js
const Navigation = () => {...}
```

- 지금까지는 Context를 사용할 만한 좋은 예시를 통해 Context를 사용해봤다. 하지만 다른 경우라면 어떨까? 그때도 Context를 사용해야만 할까? 예시를 들어보자. `App` 컴포넌트에서 사용하고 있는 두개의 컴포넌트를 보면 알 수 있다.

```js
<main>
  {!isLoggedIn && <Login onLogin={loginHandler} />}
  {isLoggedIn && <Home onLogout={logoutHandler} />}
</main>
```

- `Home` 컴포넌트에서는 `logoutHandler`를 pass 하고 `Login` 컴포넌트에서는 `loginHandler`를 pass 했는데, 이것들은 각각의 컴포넌트에서 직접 사용하는 함수들이다.

#### Login.js

```js
const submitHandler = (event) => {
  event.preventDefault();
  props.onLogin(emailState.value, passwordState.value);
};
```

#### Home.js

```js
<Button onClick={props.onLogout}>Logout</Button>
```

- `Login` 컴포넌트에서는 `props.onLogin`을 refer 했다. 포워딩을 하지 않고 `Login` 컴포넌트 내부에서 사용한 것이다. `Home` 컴포넌트의 경우도 마찬가지다. (`<Button>` 컴포넌트에 포워딩하긴 하지만 이것은 UI 를 위한 컴포넌트기 때문에 포워딩의 개념으로 치지 않는다.) 어쨌든 `Home` 컴포넌트에서 `onLogout`을 직접 사용하고 있는 걸 알 수 있다.

### Button에 Context를 사용하지 않는 이유

- 우리는 `<Button>` 컴포넌트를 `onLogout`과 엮기 위해서 Context를 사용하지 않을 것이다. Context를 사용하면 `onLogout`이 제거되기 때문이다. 이게 무슨 의미냐면, `<Button>` 에 Context를 사용하면서 `onLogout`이 제거된다면 버튼을 클릭할 때마다 항상 유저를 로그아웃 시키게 된다는 뜻이다.

### 정리

- 지금까지 props와 context를 써야만 하는 상황을 살펴보았다. 보통은 props로 데이터를 컴포넌트에 pass 한다. props로 컴포넌트를 설정하고 재활용할 수 있기 때문이다. 그런데 props를 이용해서 많은 컴포넌트들을 거쳐 포워딩을 할 때나 컴포넌트에 포워딩을 할 때는 특수한 경우가 생기기 마련이다. 앞서 `Navigation` 컴포넌트 내부에서 Button을 이용하여 사용자를 로그아웃시키는 것처럼 말이다. 그럴 때는 Context를 사용하는 게 조금 더 세련된 솔루션이 될 수 있다.

#### Navigation.js

```js
{
  ctx.isLoggedIn && (
    <li>
      <button onClick={ctx.onLogout}>Logout</button>
    </li>
  );
}
```

- 물론 원한다면 prop chain 기술을 사용해도 무방하다. 그러나 prop chain 대신 Context를 사용함으로써 코드를 줄이고, 또한 `App` 컴포넌트와 관련된 코드를 관리하기가 쉬워지는 것은 사실이다.

</br>

## 사용자 정의 컨텍스트 제공자 구성요소 빌드 및 사용

### Context 사용 첫번째 팁 : 자동 완성 기능 사용하기

- `AuthContext` 에 몇 가지를 더 추가해보자.

```js
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout:
});

export default AuthContext;
```

- 먼저 `onLogout` 함수를 `AuthContext`에 추가한다. context 를 만들 때 default로 설정하는 게 좋다.

```js
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout:,
});
```

- 그리고, `onLogout`에 더미 함수를 값으로 넣어준다. 이는 자동 완성을 위해서 작성한 것이다. 만약 더미 함수를 default 값으로 넣어주지 않으면, `Navigation` 컴포넌트에서 `onLogout`을 호출할 때,

![image](https://user-images.githubusercontent.com/53133662/162455210-6319a355-0f91-4374-aad8-08d9682c353c.png)

- 자동 완성으로 `onLogout`이 뜨지 않기 때문이다. Context에서 `onLogout`의 존재를 모르는 것이다. `isLoggedIn`은 자동 완성으로 뜨는 이유가 React와 vscode 가 default Context 객체를 찾아서 접근할 수 있는 Context가 있는지 살펴보고 찾아내기 때문이다. 더 나은 자동 완성을 위해서는 `onLogout`을 default Context 객체 안에 더미 함수로 추가해야 할 것이다. 더미 함수를 넣는 이유는 어차피 `AuthContext`에서 `onLogout` 함수는 Context의 default 값으로만 작동될 것이고, 사용하지는 않을 것이기 때문이다.

```js
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {}, // 자동 완성을 위해서 더미 함수 설정
});
```

- `onLogout`의 값으로 더미 함수를 설정하고 나면,

![image](https://user-images.githubusercontent.com/53133662/162456491-4dd5e169-58f7-4dfe-80ec-a4fa6ec62c86.png)

- `Navigation` 컴포넌트에서 `onLogout`을 호출할 때, 자동 완성으로 `onLogout`이 뜨는 것을 확인할 수 있다. 이것은 꽤나 유용한 팁이다.

### Context 사용 두번째 팁 : Custom Context Provider 컴포넌트 사용하기

- 사용 가능 여부는 우리가 만든 어플리케이션의 구조와 데이터 관리에 달렸다. 예를 들어, `App` 컴포넌트에서 로직을 꺼내서 Context로 관리해주는 컴포넌트를 별개로 만들어줄 수도 있다는 이야기다.

#### auth-context.js

```js
import React from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
});

const AuthContextProvider = (props) => {
  return <AuthContext.Provider>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
```

- 먼저, `auth-context.js` 로 이동하여 `AuthContextProvider` 컴포넌트를 만들고 `{props.childrem}`을 받아오는 `<AuthContext.Provider>`를 return 해준다.

```js
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
});

export const AuthContextProvider = (props) => {
  return <AuthContext.Provider>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
```

- 그리고, `AuthContext` 와 함께 `AuthContextProvider` 컴포넌트도 내보낼 수 있도록 export 해준다. 그래야 `auth-context.js` 파일에 `useState`를 import 해올 수 있을 뿐만 아니라 `AuthContextProvider` 컴포넌트 내부에서 `isLoggedIn` 이라는 상태(state)를 `useState`로 관리해줄 수 있기 때문이다.

```js
export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return <AuthContext.Provider>{props.children}</AuthContext.Provider>;
};
```

- `isLoggedIn` 상태(state)를 `useState`로 설정하고 `isLoggedIn`의 상태 초기값인 false 도 설정해준다.

```js
import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {}, // 자동 완성을 위해서 더미 함수 설정
  onLogin: (email, password) => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = (email, password) => {
    localStorage.setItem("isLoggedIn", "1");
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return <AuthContext.Provider>{props.children}</AuthContext.Provider>;
};
```

- `useEffect`와 `loginHandler` 함수 그리고 `logoutHandler` 함수도 추가해서, `App` 컴포넌트에서 실행해주었던 해당 함수들의 로직들을 모두 복사해서 붙여넣어준다. 이렇듯 인증문 전체를 Provider 컴포넌트 즉, `AuthContextProvider` 컴포넌트에서 관리해줄 수 있도록 한다.

```js
return (
  <AuthContext.Provider
    value={{
      isLoggedIn: isLoggedIn,
      onLogout: logoutHandler,
    }}
  >
    {props.children}
  </AuthContext.Provider>
);
```

- `AuthContext.Provider`의 value 값도 `App` 컴포넌트에서 설정해주었던 것과 동일하게 Context 객체 값인 `isLoggedIn`과 `onLogout`을 설정해준다.

```js
return (
  <AuthContext.Provider
    value={{
      isLoggedIn: isLoggedIn,
      onLogout: logoutHandler,
      onLogin: loginHandler,
    }}
  >
    {props.children}
  </AuthContext.Provider>
);
```

- 마지막으로 `onLogin`을 `loginHandler` 함수로 설정해준다. 이렇게 추가한 것들을 다시 default Context인 `onLogin`의 더미함수로 넣어준다.

```js
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (email, password) => {},
});
```

- 정확성을 위해서 `onLogin`의 더미 함수의 인자로 `loginHandler` 함수와 동일하게 email과 password를 넣어준다. 이제 이 `auth-context.js` 파일 하나만으로 로그인 관련 코드를 관리할 수 있게 되었다. `AuthContextProvider` 컴포넌트로 말이다. 그리고 Context도 설정해주었다. 이는 팁이 될 만한 장점이 있는 기능이지만 물론 필수 사항의 기능은 아니다. 이렇게 사용할지 말지는 어플리케이션의 상황이나 시나리오 어플리케이션의 규모 등을 고려해서 선택하면 되는 것이다. 하지만 이러한 커스텀 컨텍스트 컴포넌트를 사용함으로써 `App`의 컴포넌트의 코드를 확연히 줄일 수가 있는 건 사실이다.

#### App.js

```js
function App() {
  return (
    <React.Fragment>
      <MainHeader />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
    </React.Fragment>
  );
}
```

> `AuthContext.Provider` 컴포넌트를 사용할 필요가 없기 때문에 지워주고, 다시 root 레벨의 컴포넌트를 사용하기 위해서 `<React.Fragment>` 를 가져왔다.

- `AuthContextProvider`으로 사용자 인증 로직들을 모두 관리해주면서, 이렇게 `App` 컴포넌트의 코드는 간결하게 작성할 수 있다.

### `AuthContextProvider` 컴포넌트를 사용하기

#### index.js

```js
ReactDOM.render(<App />, document.getElementById("root"));
```

- 이제 `AuthContextProvider`를 적용하기 위해서는 `App` 컴포넌트를 render 해주고 있는 `index.js`로 이동해야 한다.

```js
import { AuthContextProvider } from "./store/auth-context";

ReactDOM.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  document.getElementById("root")
);
```

- `index.js`에서 `AuthContextProvider` 컴포넌트를 import 해온 뒤, `App` 컴포넌트를 감싸준다. 드디어 코드를 관리할 수 있는 매니저 파일이 마련된 것이다. 이때 매니저 파일은 이제 `App`이 아니라, `AuthContextProvider` 와 Context 파일이 된다. 이런 식으로 하면 코드가 한데 모아지고, `App`이 가벼워지는 장점이 있다.

```js
function App() {
  return (
    <React.Fragment>
      <MainHeader />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
    </React.Fragment>
  );
}
```

- `App` 컴포넌트에는 `isLoggedIn`이 있기 때문에 Context 정보가 필요할 것이다. `useContext`를 import 하고 `AuthContext` 객체를 받아오도록 설정하자. 이름은 ctx로 적어준다.

```js
import React, { useContext } from "react";

function App() {
  const ctx = useContext(AuthContext);
}
```

- 이제 Context 정보를 받아올 수 있으니, `isLoggedIn`에도 접근할 수 있다.

```js
<React.Fragment>
  <MainHeader />
  <main>
    {!ctx.isLoggedIn && <Login onLogin={loginHandler} />}
    {ctx.isLoggedIn && <Home onLogout={logoutHandler} />}
  </main>
</React.Fragment>
```

- 그리고 `onLogin` 뿐만 아니라 `onLogout` props도 필요 없어진다.

```js
<React.Fragment>
  <MainHeader />
  <main>
    {!ctx.isLoggedIn && <Login />}
    {ctx.isLoggedIn && <Home />}
  </main>
</React.Fragment>
```

- 더이상 `loginHandler`나 `logoutHandler`를 `App`에서 관리해주지 않고 있기 때문이다. 이제 `Home`과 `Login` 컴포넌트에서도 동일하게 Context 정보를 받아올 수 있도록 `useContext`를 import 하고 `AuthContext` 객체를 받아오도록 설정한다.

### before

#### Home.js

```js
const Home = (props) => {
  return (
    <Card className={classes.home}>
      <h1>Welcome back!</h1>
      <Button onClick={props.onLogout}>Logout</Button>
    </Card>
  );
};
```

#### Login.js

```js
const Login = (props) => {
  ...
  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };
}
```

### after

#### Home.js

```js
import React, { useContext } from "react";
import AuthContext from "../../store/auth-context";

const Home = (props) => {
  const authCtx = useContext(AuthContext);
  return (
    <Card className={classes.home}>
      <h1>Welcome back!</h1>
      <Button onClick={authCtx.onLogout}>Logout</Button>
    </Card>
  );
};
```

#### Login.js

```js
import React, { useState, useEffect, useReducer, useContext } from "react";
import AuthContext from "../../store/auth-context";

const Login = (props) => {
  const authCtx = useContext(AuthContext);
  ...
  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };
}
```

- 수정을 마치고 라이브 서버를 열어보면, 어플리케이션이 정상적으로 작동될 것이다.

### 정리

- 이번 챕터에서의 모든 과정은 필수 사항은 아니지만 `App`이 가벼워진다는 장점이 있다는 걸 확인했다. `App`에서 `AuthContext.Provider`를 JSX 안에서 return 하는 것보다 가독성도 높다. 또한 코드 관리와 auth-context 관리를 한 파일에서 끝낼 수 있다. 무엇보다도 많은 개발자들이 파일을 별개로 관리하기보다 이런 방법을 선호한다. 한 컴포넌트에 여러 개가 아니라 하나의 작업만 할당하는 방식 말이다. React 개발자로서 성장하기 위해서는 이런 패턴을 이해하고 사용할 수 있어야 할 것이다.

</br>

## 리액트 컨텍스트 제한

- 리액트 컨텍스트는 훌륭한 기능이지만 항상 사용할 수는 없다. `App`이나 여러 컴포넌트에 영향을 미치는 상태(state)에서는 사용해도 괜찮지만 configuration 컴포넌트에는 사용할 수 없기 때문이다. 이것의 한 예시로 UI 폴더에 있는 `Button` 컴포넌트를 살펴보자.

#### Button.js

```js
const Button = (props) => {
  return (
    <button
      type={props.type || "button"}
      className={`${classes.button} ${props.className}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};
```

- `Button` 컴포넌트는 여러 곳에서 재활용해야 한다. 그러나 `Button` 컴포넌트에 Context를 사용한다면, 우리가 유저를 로그아웃 시키기 위해 Context를 사용할 때도 있지만 유저를 로그아웃시키는 것과는 다른 의도로 `Button`을 사용하고자 할 때는 반드시 문제가 생길 것이다. `Button` 컴포넌트의 기능이 (우리의 의도와는 다르게) 유저 로그아웃으로 한정될 것이기 때문이다. 그래서 `Button` 컴포넌트에 Context를 사용하면 안된다는 것이다. 이렇게 여러 곳에서 재활용해야 하는 UI 컴포넌트인 `Button`과 같은 컴포넌트들은 Context 가 아닌 props를 사용해야 한다. Context는 전체 `App` 상태(state) 관리에만 사용하는 게 좋다.

### 리액트 컨텍스트의 단점

- 리액트 컨텍스트에는 단점이 있는데, 그것은 바로 리액트 컨텍스트가 자주 바뀌는 상태(state)에 맞는 기능이 아니라는 것이다. 예를 들어, 초마다 계속 바뀌는 상태(state)가 있다고 치자. 이런 상태(state)에는 리액트 컨텍스트가 정답이 아니다. 만약 이렇게 계속 바뀌는 상태(state)가 있을 때는 Context가 아니라, Redux 를 사용하면 된다. (리덕스는 강의 후반부에 나오는 전역상태관리 툴이다) 어쨌든 Context로 모든 컴포넌트와 props를 대체하지 말아야 한다. 컴포넌트 설정에 있어서 props 는 중요한 요소이고, 이런 중요한 요소인 props를 context로 대체하기 보다는 특정한 상황(길이가 긴 prop chain)일 때에만 선택하여 context를 사용하길 권장한다.

</br>

## Hooks의 규칙 배우기

### React Hook의 규칙 첫 번째

- React Hook 은 React 함수에서만 사용 가능하다. React Hook은 React 함수 그리고 Custom Hook 에서만 사용할 수 있다.

### React Hook의 규칙 두 번째

- React Hook 은 React 컴포넌트 함수나 Custom Hook 함수의 "Top Level" 에서만 사용할 수 있다. nested 함수나 block 문에서는 Hook을 사용할 수 없다.

```js
useEffect(() => {
  console.log("EFFECT RUNNING");

  useState(); // error 발생!
  return () => {
    console.log("EFFECT CLEANUP");
  };
}, []);
```

- 이 `useEffect` 함수 내에 `useContext` 나 `useState` 등의 Hook을 넣을 수 없다. 만약 넣는다해도 반드시 오류가 발생한다.

```js
if (true) {
  useState(); // error 발생!
}
```

- if 문 안에서도 hook을 호출할 수 없다.

### React Hook의 규칙 세 번째 : `useEffect` 규칙

- 컴포넌트 함수 내에 있는 데이터를 이용해서 `useEffect` 를 쓸 때, 이 데이터를 반드시 의존성 배열에 추가해야 한다.

```js
useEffect(() => {
  const identifier = setTimeout(() => {
    console.log("Checking form validity!");
    setFormIsValid(emailValid && passwordValid);
  }, 500);

  return () => {
    console.log("CLEANUP");
    clearTimeout(identifier);
  };
}, [emailValid, passwordValid]);
```

- `useEffect` 의 첫번째 인자인 함수 내부에서 사용하고 있는 `emailValid`와 `passwordValid`는 확실히 컴포넌트에서 받은 데이터다. 즉, 컴포넌트 상태(state)의 일부이다. (혹은 컴포넌트의 props 이거나) 위의 `useEffect`의 경우에는 의존성 배열 값으로 `emailValid`와 `passwordValid`을 추가해야 한다.

#### setFormIsValid 를 의존성 배열에 추가하지 않는 이유

- 기술적으로는 `useEffect` 함수 내부에서 `setFormIsValid`를 사용하고 있기 때문에 의존성 배열에 추가해야만 한다. 하지만 이런 경우에는 예외로 둘 수 있다. `useReducer`, `useState`의 영향을 받는 함수는 React가 절대로 바꾸지 않기 때문이다. 그렇기에 의존성 배열에 추가를 해도 되지만, 굳이 추가를 하지 않아도 된다. 그러니까 '생략'이 가능하다는 이야기다. 이렇듯 상태(state)를 업데이트하는 함수(`setFormIsValid`와 같은), 브라우저 그리고 컴포넌트 함수를 통하지 않는 데이터는 예외로 치며 생략이 가능하다.

</br>

## 입력 컴포넌트 리팩토링

- `Login` 컴포넌트 내부에서 사용하고 있는 input 태그들은 모두 반복되고 있는 걸 확인할 수 있다. 이를 `Button` 컴포넌트처럼 UI 컴포넌트화 하여 재활용할 수 있도록 리팩토링할 예정이다.

#### Login.js 의 input 부분

```js
<div
  className={`${classes.control} ${
    emailState.isValid === false ? classes.invalid : ""
  }`}
>
  <label htmlFor="email">E-Mail</label>
  <input
    type="email"
    id="email"
    value={emailState.value}
    onChange={emailChangeHandler}
    onBlur={validateEmailHandler}
  />
</div>
<div
  className={`${classes.control} ${
    passwordState.isValid === false ? classes.invali : ""
  }`}
>
  <label htmlFor="password">Password</label>
  <input
    type="password"
    id="password"
    value={passwordState.value}
    onChange={passwordChangeHandler}
    onBlur={validatePasswordHandler}
  />
</div>
```

- 먼저, UI 폴더에 `Input` 폴더를 생성하고, `Input.js` 파일을 만들어준다.

#### Input.js

```js
const Input = (props) => {
  return (
    <div
      className={`${classes.control} ${
        emailState.isValid === false ? classes.invalid : ""
      }`}
    >
      <label htmlFor="email">E-Mail</label>
      <input
        type="email"
        id="email"
        value={emailState.value}
        onChange={emailChangeHandler}
        onBlur={validateEmailHandler}
      />
    </div>
  );
};
```

- `Login` 컴포넌트 내부에서 사용해주었던 값들을 모두 props로 받아올 수 있도록 할 것이다. email과 password 에서 각각 설정해주었던 태그 속성과 상태(state) 값들을 전부 prop으로 수정해 준다.

```js
import classes from "./Input.module.css";

const Input = (props) => {
  return (
    <div
      className={`${classes.control} ${
        props.isValid === false ? classes.invalid : ""
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
};
```

- 물론, `Login` 컴포넌트에서 설정해주었던 스타일 값도 `Input.module.css`에 그대로 가져와서 `Input` 컴포넌트 내부의 스타일로 사용할 수 있도록 한다.

#### Login.js 에서의 Input 컴포넌트 사용

- 이제 `Login` 컴포넌트에서 `Input` 컴포넌트를 import 해오고, `Input` 컴포넌트에서 필요한 데이터들을 props 해줄 수 있도록 추가해야 한다.

```js
import Input from "../UI/Input/Input";

...
<Input
  label="E-Mail"
  id="email"
  type="email"
  value={emailState.value}
  onChange={emailChangeHandler}
  onBlur={validateEmailHandler}
/>

<Input
  label="Password"
  id="password"
  type="password"
  value={passwordState.value}
  onChange={passwordChangeHandler}
  onBlur={validatePasswordHandler}
/>
```

- 각각의 isValid 값을 `Input` 컴포넌트에 props 해줘야 하므로, `emailState` 에서 구조분해할당을 이용하여 가져온 isValid 값 `emailValid`와 `passwordState` 에서 구조분해할당을 이용하여 가져온 isValid 값 `passwordValid`를 사용하여

```js
const { isValid: emailValid } = emailState;
const { isValid: passwordValid } = passwordState;
```

- `Input` 컴포넌트에 각각의 용도에 맞는 `isValid`로 prop pass 해준다.

```js
<Input
  label="E-Mail"
  id="email"
  type="email"
  value={emailState.value}
  isValid={emailValid} // emailState 에서 구조분해할당을 이용하여 가져온 isValid 값
  onChange={emailChangeHandler}
  onBlur={validateEmailHandler}
/>

<Input
  label="Password"
  id="password"
  type="password"
  value={passwordState.value}
  isValid={passwordValid} // passwordState 에서 구조분해할당을 이용하여 가져온 isValid 값
  onChange={passwordChangeHandler}
  onBlur={validatePasswordHandler}
/>
```

- 이전과 동일하게 정상적으로 작동하는 걸 확인해볼 수 있다.

</br>

## Forward Refs에 대해 알아보기

- 이번 챕터에서 배울 hook은 명령을 통해 input 컴포넌트들끼리 상호작용을 할 수 있게 만들어준다. 즉 state 를 전달해서 컴포넌트 내에서 무언가가 변경되는 방식이 아니라, 컴포넌트 안으로 함수를 불러오는 방식이라는 뜻이다. 물론 지금부터 소개될 이 기능은 전형적인 React 패턴이라고 할 수 없기 때문에 자주 사용할 일은 별로 없을 것이고, 또 자주 사용해서도 안되기 때문에 때때로 마주칠 어떤 특정한 이슈를 해결하려면 이런 유용한 솔루션이 있다는 정도만 기억하면 좋을 것이다.

#### Login.js

```js
<form onSubmit={submitHandler}>
  ...
  <Button type="submit" className={classes.btn} disabled={!formIsValid}>
    Login
  </Button>
  ...
</form>
```

- 특정한 시나리오를 예시로 보여주기 위해서 먼저 `Login` 컴포넌트에서 사용하고 있는 `Button` 컴포넌트의 `disabled` 속성을 지워주자. 이 버튼 기능을 비활성화하는 것이 아니라 우리가 앞으로 작업할 Input 포커싱을 위해서 항상 버튼을 클릭할 수 있도록 사전 작업을 해주는 용도이다.

```js
<Button type="submit" className={classes.btn}>
  Login
</Button>
```

- 그리고 `submitHandler` 함수로 돌아가 어떤 조건식을 추가해줘야 한다.

```js
const submitHandler = (event) => {
  event.preventDefault();
  authCtx.onLogin(emailState.value, passwordState.value);
};
```

- 지금은 버튼을 누르면 언제든 로그인을 할 수 있도록 되어있다. 우리는 여기서 form 의 형식이 유효한지를 먼저 확인하고 난 뒤에, form 형식이 유효한 경우에만 로그인을 할 수 있도록 설정할 것이다.

```js
const submitHandler = (event) => {
  event.preventDefault();

  if (formIsValid) {
    authCtx.onLogin(emailState.value, passwordState.value);
  }
};
```

- 그리고 `formIsValid`가 아닐 경우의 수들을 else if 로 처리해줘야 한다. 먼저 첫 번째 Input 의 입력값(이메일)이 유효하지 않은 경우부터 체크해주자.

![image](https://user-images.githubusercontent.com/53133662/162569864-ec253616-4ca4-4d4e-b23e-17a43e563a9c.png)

- 현재의 페이지를 보면 `Button`의 `disabled` 속성을 지워주었기 때문에 언제나 입력값을 전송할 수 있도록 로그인 버튼이 활성화되어 있는 걸 확인할 수 있다.

```js
const submitHandler = (event) => {
  event.preventDefault();

  if (formIsValid) {
    authCtx.onLogin(emailState.value, passwordState.value);
  } else if (!emailValid) {
    // 이메일 값이 유효하지 않을 때~ 한다
  }
};
```

- else if 로 로그인 버튼을 눌렀을 때 이메일 Input 값이 유효하지 않은 경우를 먼저 체크할 것이다. 그래서 만약 유효하지 않다면, 이메일 Input 창으로 커서가 포커싱 되도록 해줄 예정이다.

```js
const submitHandler = (event) => {
  event.preventDefault();

  if (formIsValid) {
    authCtx.onLogin(emailState.value, passwordState.value);
  } else if (!emailValid) {
    // 이메일 값이 유효하지 않을 때~ 한다
  } else {
    // 비밀번호 값이 유효하지 않을 때~ 한다
  }
};
```

- 두번째 Input 값(비밀번호)도 체크해 줘야 한다. 이메일 값은 유효하지만 비밀번호 값은 유효하지 않을 때를 가정하는 것이다.

  > 물론 둘 다 유효하지 않은 경우의 수도 추가해야되지 않을까 라고 생각할 수 있다. 하지만 이미 첫 번째 입력 값(이메일)의 유효성 체크에 대한 로직을 작성해줬기에, 둘 다 유효하지 않을 때에는 첫 번째 입력창(이메일)으로 포커싱될 것이기 때문에 굳이 로직을 추가할 필요는 없을 것이다.

- 이제 input 값에 집중할 것이다. 정규식 형태로 input 을 나타내고 싶다면, 우리는 여기서 `ref`를 사용해야 한다.

### `useRef`를 기반으로 `focus()` 메소드 사용하기

- `Input` 컴포넌트의 input 태그에 `ref` 속성을 지정해줄 차례다. `useRef`를 import 하고 `ref`를 연결시켜주자.
  > `ref` 속성은 모든 HTML 컴포넌트에서 지원하는 기능이다.

#### Input.js

```js
import React, { useRef } from "react";

const Input = (props) => {
  const inputRef = useRef();

  return (
    <div
      className={`${classes.control} ${
        props.isValid === false ? classes.invalid : ""
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
};
```

- `Input` 컴포넌트가 렌더링된 이후에 `focus` 되어야 하기 때문에, `useEffect`를 사용해서 해당 컴포넌트가 렌더링 된 후에 `focus` 해줄 수 있도록 코드를 작성해준다.

```js
useEffect(() => {
  inputRef.current.focus();
}, []);
```

- `useEffect`에 함수를 전달하면, 모든 컴포넌트가 렌더링 된 이후에 이 함수가 실행될 것이다. 일단 컴포넌트가 처음 렌더링 되었을 때, 한 번만 실행할 수 있도록 의존성 배열을 빈 값으로 비워둔다.
  > `focus()` 메소드는 Input `DOM` 객체 모델에만 사용할 수 있다. 그리고 `ref`를 통해서 접근할 수 있는 메소드이다.
- 이제 이메일과 비밀번호에 입력한 값이 렌더링될 것이고, 이후에 비밀번호 입력 값을 focus 할 것이다. 왜냐하면 비밀번호 입력 값은 렌더링 된 최종 입력값이기 때문이다!

![image](https://user-images.githubusercontent.com/53133662/162573995-8a716be1-9bb6-4ea3-b762-0ee6e6e4bc24.png)

- 다시 리로딩을 하면, 이메일 input 창은 유효하지 않은 것으로 보이는데(유효하지 않을 때만 적용되는 스타일, 빨간색으로 채워졌다) 일시적으로 focus가 지정되었기 때문이다. 하지만 비밀번호 input 창은 끝까지 focus가 지정되어 있는 걸 알 수 있다.

- 여기까지 봤을 때 분명히 우리가 원하는 기능에 대한 구현은 아닐지언정 `ref`와 리액트의 내장된 기능만을 이용해서 이런 방식으로도 사용해볼 수 있다는 사실 하나는 배웠을 것이다.

  > focus() 메소드는 리액트의 기능이 아니라, 자바스크립트의 `DOM` 객체 모델에 내장된 기능이다. 정확하게는 input `DOM` 객체 모델이라고 할 수 있다.

- 우리가 의도했던 focus 기능은 사실 input이 렌더링 된 후에 하려는 것은 아니기에, `useEffect`로 구현해주었던 로직은 다시 삭제해준다. 대신 `activate` 라는 이름의 함수를 작성해주자.

```js
const activate = () => {
  inputRef.current.focus();
};
```

- 여기서 `activate` 함수는 input 내에서 불러오는 게 아니라, 외부에서 불러올 수 있도록 해야한다. 참고로 이런 경우는 흔하지 않은 시나리오다. 왜냐하면 이런 식으로 리액트 프로젝트의 코드를 작성하지 않기 때문이다. 보통은 prop이나 상태(state)를 사용하거나 데이터 컴포넌트에 전송해서 무언가를 변경하는 방식이 훨씬 흔한 방식이다. 하지만 지금의 예시처럼 특이한 경우에는 이 input 에 focus 를 지정하는 것이 기발한 방법일 수 있다. focus나 `activate`를 호출할 때 우리의 `Input` 컴포넌트를 사용할 수 있다. 내장된 함수를 사용하거나 아니면, 앞서 작성한 `Input` 컴포넌트에서 `activate` 함수를 사용해도 된다는 이야기다. 드문 일이긴 하지만 언젠가 이런 경우를 맞닥뜨리게 될 수도 있다.

### 왜 `Login` 컴포넌트(parent)에서 `useRef`를 사용하지 않을까?

- 하지만 우리는 `Input` 컴포넌트 내부가 아니라 `Login` 컴포넌트에서 `useRef`를 사용하지 않을까 의문을 가질 수도 있다. 왜 `Login` 컴포넌트(parent)에서 `useRef`를 이용하지 않는지에 대해 알기 위해서는 예시가 필요하다.

#### Login.js

```js
const emailInputRef = useRef();
const passwordInputRef = useRef();
```

- 각각의 input 에 연결시켜줄 `useRef`를 생성하고, 해당하는 `Input` 컴포넌트에 `ref` 속성으로 연결시켜준다.

```js
<Input
  ref={emailInputRef}
  label="E-Mail"
  id="email"
  type="email"
  value={emailState.value}
  isValid={emailValid}
  onChange={emailChangeHandler}
  onBlur={validateEmailHandler}
/>

<Input
  ref={passwordInputRef}
  label="Password"
  id="password"
  type="password"
  value={passwordState.value}
  isValid={passwordValid}
  onChange={passwordChangeHandler}
  onBlur={validatePasswordHandler}
/>
```

- 그러면 이제 `submitHandler` 함수 로직(유효하지 않을 때)에 각각 `ref`로 연결한 `useRef` 값들을 넣어주고, `Input` 컴포넌트 내부의 함수인 `activate`를 이용해서 focus 메소드를 사용할 수 있도록 작업해주자.

```js
const submitHandler = (event) => {
  event.preventDefault();

  if (formIsValid) {
    authCtx.onLogin(emailState.value, passwordState.value);
  } else if (!emailValid) {
    emailInputRef.current.activate();
  } else {
    passwordInputRef.current.activate();
  }
};
```

- 이렇게 간단한 방법으로 focus 메소드를 사용할 수 있을 것이라고 생각했을 것이다. 하지만 우리의 의도대로 작동되지 않는다. 리로드해보면 콘솔에 에러가 발생하는 것을 알 수 있다.

![image](https://user-images.githubusercontent.com/53133662/162575289-37adb00d-2657-4290-9319-4c1a6274d8c5.png)

- 에러 메세지를 살펴보자. "Warning: Function components cannot be given refs." 즉, 함수형 컴포넌트는 `ref`를 전달하는 것이 불가능하다는 이야기다. 그렇기 때문에 `Login` 컴포넌트에서 `Input` 컴포넌트에 전달한 `ref` 속성을 가지고는 `Input` 컴포넌트 내부에서 아무 것도 할 수 없게 된다. prop 객체에선 `ref` 속성 값을 사용할 수 없기 때문이다.

  > 만약, prop 객체에서 `ref` 속성 값을 사용한다고 해도 `ref`는 예약어 이기 때문에 또 다시 에러메세지가 발생할 것이다. 이런 접근법으로는 focus 메소드를 작동할 수 없다.

### 우리가 시도할 수 있는 솔루션은 있다

- 그럼에도 불구하고, 우리가 해결할 방법은 언제나 존재한다. 이 솔루션을 위해서는 딱 두가지가 필요한데 첫 번째로, `Input` 컴포넌트에서 또 다른 hook을 import 해서 사용해야 한다. 바로 `useImperativeHandle` 이라는 hook 이다.

### `useImperativeHandle` hook

> [React 공식문서 참조 : useImperativeHandle](https://ko.reactjs.org/docs/hooks-reference.html#useimperativehandle)

- `useImperativeHandle`은 컴포넌트 내부 기능을 외부에서 명령형으로 사용할 수 있도록 만들어주는 React Hook 이다. 그말인 즉슨, 일반적으로 우리가 사용하는 상태(state)나 prop을 거치지 않고서도 부모 컴포넌트에서 상태(state)를 관리하고 조작할 필요 없이 자식 컴포넌트에서 바로 무언가를 호출하거나 조작할 수 있게 된다는 뜻이다.
  > 물론 `useImperativeHandle` hook 을 사용해야만 하는 경우는 드물다. 그러므로 프로젝트에서 자주 사용할 일이 없을 것이며, 또 자주 사용해서도 안된다. 일반적으로 이런 경우에 우리가 사용하는 방법인 상태(state)나 prop으로 접근하여 작업해주는 것이 낫기 때문이다. 그럼에도 불구하고 우리의 현재 프로젝트를 한정하여 맞닥뜨렸던 이 문제를 해결하기엔 꽤 좋은 솔루션이라고 말할 수 있다.

```js
useImperativeHandle(ref, createHandle, [deps]);
```

- 이 `useImperativeHandle`을 사용하기 위해서는 먼저 import를 해와야 한다. `Input` 컴포넌트에서 `useImperativeHandle`을 호출 해온 뒤, 로직을 작성한다.

```js
  useImperativeHandle(첫 번째 매개변수, () => {})
```

- `useImperativeHandle`은 두개의 인자를 전달받는다. 첫 번째 매개변수는 나중에 작성하는 걸로하고, 먼저 두 번째 인자인 함수부터 작성해보자. 이 함수는 반드시 객체를 반환하는 함수여야 한다.

```js
  useImperativeHandle( , () => {
    return {

    };
  })
```

- 그리고 반환하는 객체는 "밖에서도 사용할 수 있는 모든 데이터"를 포함하고 있어야 할 것이다.

```js
  useImperativeHandle( , () => {
    return{
      focus: 해당 컴포넌트 내부에 있는 함수나 변수,
    }
  })
```

- 우리는 이 객체 안에 `Input` 컴포넌트 내부의 '함수'나 '변수' 등을 포함시킬 수 있다. 예를 들어, `activate` 함수(`Input` 컴포넌트 내부에 있는 함수)를 값으로 받는 `focus`를 객체 안에 포함시킬 수 있을 것이다. (물론 이름은 우리가 마음대로 지정하면 된다.) 이렇듯 해당 컴포넌트 내부에 있는 함수나 변수 등을 포함시켜서 이 객체를 통해서 외부에서도 접근할 수 있도록 해야 한다.

```js
  useImperativeHandle( , () => {
    return{
      focus: activate,
    }
  })
```

- 우리는 `activate` 함수를 객체 안에 담아서 밖에서 접근할 수 있도록 해야하기 때문에 `focus` 값으로 `activate` 함수를 할당해주었다. 즉 `useImperativeHandle` 내부의 함수에서 반환되는 객체는 자식 컴포넌트(`Input`) 내부에 있는 기능과 외부의 부모 컴포넌트(`Login`) 사이를 번역해주는 역할이라고 보면 될 것이다.

- `useImperativeHandle` hook 에서 아직 할 일이 남았다. 지금은 비어있는 `useImperativeHandle` hook의 첫 번째 인자를 설정해주어야 한다. 그리고 이 첫 번째로 제공해주어야 할 인자는 `Input` 컴포넌트의 함수 인자 리스트에서 얻어내야 한다.

```js
const Input = (props) => {
  ...
}
```

- 지금까지 props 만 가지고도 거의 대부분의 문제는 해결해왔다. 하지만 이번에는 props를 포함한 두 번째 인자를 가져와볼까 한다. 바로 `ref` 이다.

```js
const Input = (props, ref) => {
  ...
}
```

- `Input` 컴포넌트에서 받아올 인자로 `ref`가 있다면 당연히 외부에서 `ref`를 전달해주어야 할 것이다. 이전에 우리가 `Login` 컴포넌트에서 `Input` 컴포넌트에 속성으로 달아준 `ref`를 생각해보자. 아마도 여기서 전달한 `ref`를 우리가 `Input` 컴포넌트에서 받아와 사용해줄 수 있을 것이다.

#### Login.js

```js
<Input
  ref={emailInputRef}
  label="E-Mail"
  id="email"
  type="email"
  value={emailState.value}
  isValid={emailValid}
  onChange={emailChangeHandler}
  onBlur={validateEmailHandler}
  >
<Input
  ref={passwordInputRef}
  label="Password"
  id="password"
  type="password"
  value={passwordState.value}
  isValid={passwordValid}
  onChange={passwordChangeHandler}
  onBlur={validatePasswordHandler}
/>
```

- `Login` 컴포넌트에서 전달 받은 `ref` 인자는 `Input` 컴포넌트에서 바인딩 해줘야 한다. 그러기 위해서는 `useImperativeHandle` hook 의 첫 번째 인자로 `ref` 전달해주는 일부터 시작해야 할 것이다.

#### Input.js

```js
useImperativeHandle(ref, () => {
  return {
    focus: activate,
  };
});
```

- 그래도 아직 부족하다. 이것만으로는 제대로 작동할 수 없기 때문이다. `Input` 컴포넌트에서 `ref` 를 인자로 전달받고 사용하기 위해서는 한 가지 작업을 처리해줘야 한다. `Input` 컴포넌트 함수를 특별한 방식으로 내보내는 작업 말이다. 이 작업을 하기 위해서는 React 에서 `forwardRef` 메소드를 가져와서 `Input` 컴포넌트를 내보낼 수 있도록 해야한다.

### `React.forwardRef()` 사용하기 (중요!)

> React.forwardRef는 전달받은 ref 어트리뷰트를 하부 트리 내의 다른 컴포넌트로 전달하는 React 컴포넌트를 생성합니다.

```js
const Input = React.forwardRef((props, ref) => {
  ...
})

```

- `forwardRef()` 메소드로 컴포넌트 함수를 전달할 수 있도록 함수를 감싸주었다. `Input` 컴포넌트 함수는 `forwardRef`에서 첫 번째 인자가 될 것이다. 그리고 `forwardRef`는 리액트 컴포넌트를 반환해줄 것이다. 이제 리액트 컴포넌트는 `ref`와 바인딩할 수 있게 되었다. 이제 `Input` 컴포넌트는 외부에서 지정한 `ref` 속성 값을 인자로 가질 수 있게 되었다. 또한 자식 컴포넌트에서 `ref` 를 노출시킬 것이고 부모 컴포넌트에서 자식 컴포넌트의 `ref`를 제어하거나 사용할 수 있을 것이다. 물론 우리는 `useImperativeHandle` hook을 통해서 `ref`를 노출시킬 것이다.

1.  [React 공식문서 참조 : React.forwardRef](https://ko.reactjs.org/docs/react-api.html#reactforwardref)
2.  [React 공식문서 참조 : Forwarding Refs](https://ko.reactjs.org/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

```js
useImperativeHandle(ref, () => {
  return {
    focus: activate,
  };
});
```

- `useImperativeHandle`의 내부 함수가 반환하는 객체 안에 `focus`(`activate()`) 함수를 통해 노출시켜 보자.

```js
const submitHandler = (event) => {
  event.preventDefault();

  if (formIsValid) {
    authCtx.onLogin(emailState.value, passwordState.value);
  } else if (!emailValid) {
    emailInputRef.current.focus();
  } else {
    passwordInputRef.current.focus();
  }
};
```

- 저장한 뒤 리로딩해보면, 제대로 동작하고 있는 걸 알 수 있다.

![ezgif com-gif-maker (38)](https://user-images.githubusercontent.com/53133662/162577982-6417982e-a3f7-48eb-ad7a-22be3405c7ef.gif)

### 정리

- 현재의 프로젝트처럼 input에 focus를 지정하고자 하는 경우일 때는 앞서 작업한 방법들은 꽤나 유용하고 적합한 방식이었다. `useImperativeHandle` hook 과 `React.forwardRef()`를 가지고서 리액트 컴포넌트 기능을 부모 컴포넌트에 유출할 수 있게 되었으며 `ref`를 통해서 자식 컴포넌트를 부모 컴포넌트에서 사용할 수 있도록 했기 때문이다. (`ref`를 통해서 함수 뿐만이 아니라 값도 노출시킬 수 있다.) 물론, 이런 방식은 지금과 같은 특이한 케이스일 때 시도해볼 만한 솔루션이긴 하다. 그러나 우리에게 꼭 필요한 기능이나 방법이라고 말하기는 어려울 것이다. 실은 어떻게든 이런 케이스를 피하는 것이 더 좋기 때문이다. 하지만 focus 뿐만 아니라, 앞으로 scroll 을 사용할 때에도 언제든지 적용할 수 있는 유용한 방법이기에 한 번쯤은 알아두면 좋을 기능들이다.

</br>
