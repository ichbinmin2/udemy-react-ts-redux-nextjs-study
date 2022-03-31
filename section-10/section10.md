# Advanced: Handling Side Effects, Using Reducers & Using the Context API

## 목차

- [What are "Side Effects" & Introducing useEffect](#Side-Effects-와-useEffect)
- [Using the useEffect() Hook](#useEffect-훅-사용하기)
- [useEffect & Dependencies](#useEffect와-종속성)
- [What to add & Not to add as Dependencies](#종속성으로-추가할-항목-및-추가하지-않을-항목)
- [Using the useEffect Cleanup Function](#useEffect에서-Cleanup-함수-사용하기)

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

- 그럼 Side Effects(Effect) 란 무엇일까? 사이드 이펙트(Side Effect)는 어플리케이션에서 벌어지는 모든 일들을 총칭하는 용어이다. 예를 들자면 HTTP 리퀘스트를 보내거나 브라우저 스토리지(or 로컬 스토리지)에 무언가를 저장하는 일 등이 바로 사이드 이펙트에 해당한다. 물론 코드 내에서 세팅하는 타이머나 interval 역시 사이드 이펙트라고 말할 수 있을 것이다. 앞서 거론한 이러한 작업들은 모두 어플리케이션 내부에서 고려되어야 하는 사항이다. HTTP 리퀘스트를 백엔드 서버로 보내야 하는 경우를 생각해보자. (당연히 어플리케이션의 시나리오에 따라 다르겠지만) 어떤 어플리케이션에서는 이런 리퀘스트가 셀 수도 없이 많을지도 모른다. 하지만 놀랍게도 이런 어플리케이션 내부에서 고려되어야 하는 작업들은 모두 화면에 무언가를 가져오거나 그려내는 것과는 관련이 없다. (적어도 직접적으로는 말이다.) 물론 HTTP 리퀘스트를 백엔드 서버에 전송해서 응답을 받을 때마다 화면에 무언가를 그려낼 수도 있겠으나 HTTP 리퀘스트를 전송하는 행위 그 자체는 관련이 없다. HTTP 리퀘스트나 잠재적 error를 관리하는 등등의 일들은 적어도 React가 필요한 일이 아니기 떄문이다. (이러한 일들은 보통 React가 관심을 두거나 고려하는 사항도 아니며, 애초에 React의 역할도 아니다.)
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
- `timerDuration` 은 종속성으로 추가되었다. 왜냐하면 `timerDuration`은 해당 컴포넌트에서 받아온 prop 값이기 떄문에 상위 컴포넌트에서 해당 값을 변경하면 변경될 수 있음을 고려해줘야 하기 때문이다. (이 `MyComponent` 도 다시 렌더링되도록 함).
- `setTimerIsActive` 는 종속성으로 추가되지 않았다. (왜냐하면 앞서 거론한 예외 조건이기 때문이다.) 상태(state) 업데이트 기능을 종속성에 추가할 수는 있지만 React는 기능 자체가 절대 변경되지 않음을 보장하므로 굳이 추가할 필요가 없다.
- `myTimer` 는 종속성으로 추가되지 않았다. 왜냐하면 그것은 `MyComponent` 컴포넌트 내부의 변수가 아니기 때문이다. (즉, 어떤 상태(satte)나 prop 값이 아님) 컴포넌트 요소 외부에서 정의되고 이를 변경하기 때문에(어디에서든) `MyComponent` 컴포넌트 요소가 다시 평가되도록 하지 않는다.
- `setTimeout` 은 종속성으로 추가되지 않았다. 왜냐하면 그것은 "내장 API"이기 때문이다. 이는 React 및 구성 요소와 독립적이며 변경되지 않는다.

</br>

## useEffect에서 Cleanup 함수 사용하기

- 우리는 때떄로 Clean up 작업이 필요한 `Effect`를 사용할 때도 있을 것이다. 물론 이는 너무 추상적인 이야기이기 때문에 예시를 통해 알아보는 것이 좋겠다.

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
