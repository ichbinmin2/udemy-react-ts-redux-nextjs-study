# Advanced: Handling Side Effects, Using Reducers & Using the Context API

## 목차

- [What are "Side Effects" & Introducing useEffect](#Side-Effects-와-useEffect)
- [Using the useEffect() Hook](#useEffect-훅-사용하기)

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

- 이 문제를 해결하기 위해 코드를 한 번 살펴보고자 한다. 현재 상황에서 유저의 인증 상태가 소실되는 이유는 무엇일까? 바로 `isLoggedIn` 상태(state)를 관리하는 `App.js` 파일에서 그냥 React 상태(state)로 관리되고 있기 때문이다.

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

- 그래서 결국에는 React에 의해서 단지 JavaScript 변수의 일종으로 관리되고 있을 뿐이다. 이런 경우에 어플리케이션을 리로드하게 되면 React 스크립트가 다시 시작하게 되며, 이전 실행에서의 모든 변수는 사라지게 된다. 이것은 React의 작동 방식의 문제가 아니며 그저 웹, 스크립트, 브라우저의 작동 방식 자체가 그렇기 때문에 발생하는 문제이다. 이렇듯 새로고침을 하게 되면 이전의 데이터를 모두 소실하는데 그전에 미리 어딘가(리로딩의 영향을 받지 않는 곳)에 저장해두면 데이터를 잃지 않을 수 있을 것이다. 또한 어플리케이션이 시작될 때, 데이터가 소실되지 않고 유지되고 있는지를 체크하여 만약 유지되고 있다면 유저를 자동으로 로그인되도록 하여 재차 로그인을 할 필요가 없도록 만들 수도 있을 것이다. 그리고 이때 우리는 `useEffect`를 활용할 수 있다.

- 먼저, useEffect를 활용하기 전 데이터를 저장해보자.


```js
const loginHandler = (email, password) => {
  setIsLoggedIn(true);
};
```

- `loginHandler` 함수를 살펴보면, `isLoggedIn`을 true로 설정한 것을 볼 수 있다. 이것은 물론 브라우저 스토리지의 이 위치에 정보를 저장하려는 시도일 것이다. 브라우저에는 활용 가능한 스토리지가 많으며, 우리가 사용하고자 하는 기능을 구현하기 위해서는 '쿠키' 혹은 '로컬 스토리지'를 가장 보편적으로 많이 사용한다. 그리고 이번에는 가장 간단한 방법인 '로컬 스토리지'를 한 번 사용해보려고 한다. 
> 이러한 스토리지 메터니즘은 브라우저에 내장되어 있으며, React로부터 완전히 독립적이다.

```js
const loginHandler = (email, password) => {
  localStorage.setItem("isLoggedIn", "1");
  setIsLoggedIn(true);
};
```

`loginHandler` 함수에서 `isLoggedIn`을 true로 설정하기 전에 `localStorage.setItem()`를 통해서 '로컬 스토리지'를 설정한다. ('로컬 스토리지'는 전역 객체이며 브라우저에서 제공하는 것이다.) `setItem()`에 들어가는 두개의 인수 중 첫번째는 식별자이며, 문자열 "isLoggedIn(식별자)"로 간단하게 설정해주었다. `setItem()`의 두번째 인수는 저장하는 정보에 대한 문자열이어야 한다. 여기서는 "1(값)"로 설정했다. 예를 들어, "1"은 유저가 로그인 되어 있다는 시그널이 될 것이며, "0"은 로그인이 되어있지 않다는 시그널이 될 것이다. 이제 모든 걸 저장하고 다시 로그인을 해보자. 개발자 도구를 열어, 네트워크를 확인해보면 "로컬 스토리지"에 해당 정보가 저장되어 있음을 알 수 있다.

![localStorage.setItem("isLoggedIn", "1")](https://user-images.githubusercontent.com/53133662/159119611-ea8daf45-8c9a-42c1-a54d-d79ad5e07f85.png)

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
```

```js
import React, { useEffect, useState } from "react";

...
useEffect(() => {
  const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

  if (storedUserLoggedInInformation === "1") {
    setIsLoggedIn(true);
  }
}, []);
```

```js
const logoutHandler = () => {
  localStorage.removeItem("isLoggedIn");
  setIsLoggedIn(false);
};
```
