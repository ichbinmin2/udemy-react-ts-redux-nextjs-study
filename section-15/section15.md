# Building Custom React Hooks

## 목차

- [What are "Custom Hooks"?](#커스텀-훅이란-무엇인가)
- [Creating a Custom React Hook Function](#커스텀-리액트-컴포넌트-ReEvaluation-Hook-함수-생성하기)

</br>

## 커스텀 훅이란 무엇인가

- 커스텀 훅은 결국 정규 함수라고 말할 수 있다. 내장 훅이라던가 `useState` 같은 것들 말이다. 하지만 내부에 상태(state)를 설정할 수 있는 로직을 포함한 함수이다. 커스텀 훅을 만들어서 재사용 가능한 함수에 상태(state)를 설정하는 로직을 '아웃소싱' 할 수 있다. 정규 함수와는 다르게, 커스텀 훅은 다른 커스텀 훅을 포함한 다른 리액트 훅을 사용할 수 있다. 따라서 `useState`나 `useReducer`와 같은 상태(state) 관리 훅을 이용해서 리액트의 상태(state)를 활용할 수 있다. 또한, `useEffect`에도 접근할 수 있다. 커스텀 훅을 통해 다른 컴포넌트에서 사용할 수 있는 로직을 커스텀 훅으로 아웃소싱할 수 있으며, 이를 통해 다양한 컴포넌트 호출이 가능하다.

### 커스텀 훅은 로직 재사용이 가능한 메커니즘이다

- 커스텀 훅은 로직을 재사용할 수 있는 메커니즘이다. 정규 함수와 특수 함수의 관계처럼 커스텀 훅 함수에서는 리액트 훅과 다른 훅을 사용할 수 있다.

</br>

## 커스텀 리액트 컴포넌트 ReEvaluation Hook 함수 생성하기

![ezgif com-gif-maker (81)](https://user-images.githubusercontent.com/53133662/171421862-f8503b9b-da8f-4121-88e0-d96127fb1f96.gif)

- 개발 서버를 열어보면, 이 어플리케이션은 2개의 카운터가 있는 걸 알 수 있다. 일정 시간 뒤에 하나는 증가하고 또 다른 하나는 감소하는 걸 알 수 있다.

#### ForwardCounter.js

```js
const ForwardCounter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Card>{counter}</Card>;
};
```

#### BackwardCounter.js

```js
const BackwardCounter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Card>{counter}</Card>;
};
```

- 위의 코드들은 각각의 증가와 감소 카운터를 맡고 있는 컴포넌트들이다. 이 컴포넌트들은 이름 그대로의 역할을 해주고 있다. `ForwardCounter` 컴포넌트는 `useState`와 `useEffect`를 사용해서 상태(state)를 관리하고, 시간 간격을 만들어서(`setInterval`) 정방향으로 카운팅을 시작하며 매 초, 즉 매 1000 밀리초 마다 새로운 `counter` 상태(state)를 설정한다. `BackwardCounter` 컴포넌트 역시 `ForwardCounter` 컴포넌트와 동일한 역할을 하지만 다만 역방향으로 카운팅을 하고 있다. 이것 외에는 두 컴포넌트 모두 동일한 로직을 가지고 있는 것이다. 따라서, 이 두 개의 컴포넌트는 매우 유사하다고 볼 수 있다. 물론 컴포넌트를 만들고, 이 컴포넌트에 props 를 넘겨받는 형식으로 설정하는 방법으로도 구성할 수 있지만 실제 어플리케이션에서는 상호 간에 연관된 작업을 수행하는 서로 다른 컴포넌트들이 있는 경우가 많다. 그렇기 때문에 이 정방향/역방향 `counter` 에도 양 로직간에 중복되는 코드가 존재할 것이다. (어쨌든 덧셈과 뺄셈이라는 차이만 제외하면 이 둘은 정확히 같은 코드라고 볼 수 있다.)

### 중복된 코드 리팩토링 하기

- 이렇게 프로그래밍 중에 중복되는 코드가 있을 경우, 이 코드를 떼어내어 커스텀 훅으로 만든다. 이 중복되는 코드를 갖는 함수를 만들어 필요한 곳에서 재사용을 할 수 있도록 말이다. 여기서 문제는 재사용하려는 코드가 `useState`나 `useEffect` 같은 리액트 훅을 사용하는 것이고, 이는 상태(state) 갱신 함수를 호출함으로서 상태를 갱신하게 된다는 것에 있다. 우리가 배웠던 훅의 규칙을 기억해보라. 리액트 컴포넌트 함수가 아닌 다른 함수에서 이러한 리액트 훅을 사용하는 것은 불가능하다. 하지만 커스텀 훅은 리액트 컴포넌트 함수처럼 리액트 훅을 사용할 수 있다.

### 커스텀 훅 만들기

- 커스텀 훅은 어떻게 만들어야 할까? 일단 첫 번째로, 일반적인 컴포넌트와 같이 모든 훅을 독립된 파일에 저장할 수 없다. 그러니 커스텀 훅 파일들을 따로 넣어둘 `hooks` 라는 별도의 폴더를 먼저 만들자.

![image](https://user-images.githubusercontent.com/53133662/171426047-9ebff36d-f45c-4818-bf79-c61e831045d4.png)

### 커스텀 훅을 만드는 규칙

- 커스텀 훅에는 몇 가지 규칙이 있다. 첫 번쨰로 앞서 설명한 것처럼 독립된 파일에 저장할 수 없다. 그리고 두 번째 규칙으로는 커스텀 훅의 네이밍의 시작을 `use`로 시작해야 한다는 것에 있다.

#### use-counter.js

```js
const useCounter = () => {};
export default useCounter;
```

- 별도로 만든 `hooks` 폴더 안에 `use-counter.js` 라는 커스텀 훅 파일을 만든다. 앞서 설명했던 두 번째 규칙을 따라서 `use`로 시작되는 이름의 커스텀 훅이다. 이렇게 파일 이름을 지은 것에는 이유가 있다. 파일 안에 함수 이름에 대해 따라야 하는 규칙이 있기 때문이다. 우리는 `use-counter.js` 라는 파일 안에서 함수를 만들 것이고, 이렇게 만들어진 함수는 반드시 이름을 `use`로 명명해야 한다. 이는 필수적으로 지켜야하는 엄격한 규칙이다.

### 리액트가 커스텀 훅에게 요구하는 규칙 `use` 네이밍

- 엄연히 보자면 이것은 결국 일반적인 함수이지만, 커스텀 훅 파일 앞에 붙인 `use`는 리액트에게 해당 함수가 커스텀 훅임을 알려주는 신호가 된다. 그러니까, 이런 신호를 통해서 리액트가 해당 함수를 훅의 규칙에 따라 사용하겠다고 '보장'해 줄수 있는 것이다. 그리고 이것은 리액트가 요구하는 규칙이기 때문에 만약 이 규칙을 지키지 않고 리액트 훅을 커스텀 훅에서 사용하면서 이 커스텀 훅을 잘못된 곳에서 사용하게 됐을 시, 내부에서 사용하고 있는 리액트 훅 역시 잘못된 곳에서 쓸 수 있음을 내포하는 것과 같다. 이것이 커스텀 훅 파일의 이름을 `use`로 시작하게끔 하는 이유다. 이렇게 해야 리액트에서 어떤 함수가 `use`로 시작하고 있다는 신호를 알아 본 뒤에 훅의 규칙을 위반한 것이 발견된다면 보다 정확한 경고를 보낼 수 있을 것이다.

### 중복된 카운터 코드를 커스텀 훅으로 이전하기

```js
const useCounter = () => {};
export default useCounter;
```

- `useCounter` 라는 정규 함수를 만든다. 그리고 이 함수의 궁극적인 목적은 외부의 다른 파일에서 가져와 사용하는 것이므로, 이 함수를 `export` 하도록 작성한다.

```js
import { useEffect, useState } from "react";

const useCounter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
};

export default useCounter;
```

- 그리고 `ForwardCounter` 컴포넌트에 있는 코드를 모두 복사(JSX 코드를 반환하는 코드는 남겨둔다.)해서 해당 커스텀 훅 함수 안에 이전시켜 준다.

</br>
