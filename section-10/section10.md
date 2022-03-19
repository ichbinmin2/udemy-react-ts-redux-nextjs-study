# Advanced: Handling Side Effects, Using Reducers & Using the Context API

## 목차

- [What are "Side Effects" & Introducing useEffect](#Side-Effects-와-useEffect)

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
