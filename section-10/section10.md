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

- `useEffect`를 주석 처리하고 이전에 `emailChangeHandler`와 `passwordChangeHandler`에서 관리해주었던 form 유효성 체크 로직을 다시 살려놓는다. 이 방법은 이전에도 말했다시피 작동은 하지만, 코드를 여러번 재사용하는 좋지 않은 코드이다. (그래서 우리는 `useEffect`를 사용했을 것이다.) 하지만 어떤 이유에서인지 라우트를 `useEffect`에 가져오고 싶지 않다고 가정해보자. 그리고 이때 우리는 어떤 문제를 맞닿드리게 된다.

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

> [React 공식문서 참조: useReducer)](https://ko.reactjs.org/docs/hooks-reference.html#usereducer)

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

- email input 창이 아무런 변화가 없다는 걸 확인할 수 있다. 즉, 처음부터 blur 된 것처럼 취급되지 않는 것이다. 다시 isValid 의 초기 값을 false 로 돌려놓은 뒤 로그인을 실행해보면

![ezgif com-gif-maker (30)](https://user-images.githubusercontent.com/53133662/161488160-5addb260-3f34-4a30-bc80-40c82342d454.gif)

- `useReducer`를 사용하기 전과 동일하게 작동되고 있음을 확인할 수 있다. `useReducer`를 사용하게 되면서 emailState를 하나로 묶어서 하나의 장소에서 관리할 수 있었고, `Login` 컴포넌트 내부에서의 코드가 보다 간결해질 수 있었다.

</br>
