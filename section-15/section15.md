# Building Custom React Hooks

## 목차

- [What are "Custom Hooks"?](#커스텀-훅이란-무엇인가)
- [Creating a Custom React Hook Function](#커스텀-리액트-컴포넌트-ReEvaluation-Hook-함수-생성하기)
- [Using Custom Hooks](#사용자-정의-훅-사용하기)
- [Configuring Custom Hooks](#사용자-정의-훅-구성하기)

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

- 커스텀 훅에는 몇 가지 규칙이 있다. 첫 번째로 앞서 설명한 것처럼 독립된 파일에 저장할 수 없다. 그리고 두 번째 규칙으로는 커스텀 훅의 네이밍의 시작을 `use`로 시작해야 한다는 것에 있다.

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
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
};

export default useCounter;
```

- 그리고 `ForwardCounter` 컴포넌트에 있는 코드를 모두 복사(JSX 코드를 반환하는 코드는 남겨둔다.)해서 해당 커스텀 훅 함수 안에 이전시켜 준다.

</br>

## 사용자 정의 훅 사용하기

- 사용자 정의(Custom) 훅을 사용할 때는 우리가 내장 훅을 사용하는 방법을 떠올리면 된다. 결국 커스텀 훅도 함수기 때문이다.

```js
import useCounter from "../hooks/use-counter";
```

- 먼저 `ForwardCounter` 컴포넌트에 해당 로직을 복사해두었던 커스텀 훅(`useCounter`)를 import 해온다.

#### ForwardCounter.js

```js
import useCounter from "../hooks/use-counter";

const ForwardCounter = () => {
  useCounter();
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

- 그리고 커스텀 훅인 `useCounter`를 호출한다. `useCounter`를 호출하게 되면 `useCounter`의 내부 코드들이 실행될 것이다.

#### useCounter.js

```js
const useCounter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
};
```

- 어떤 컴포넌트에서 커스텀 훅을 호출하게 되면, 호출한 커스텀 훅 함수 내부에 있는 상태(state)나 `effect`가 해당 컴포넌트에 묶이게 된다. 따라서 `ForwardCounter`에서 `useCounter`를 호출하게 되면 `useCounter`에서 만들어진 상태(state)가 `ForwardCounter` 컴포넌트에 묶이는 것이다. 또 다수의 컴포넌트에서 특정 커스텀 훅을 사용하게 되면 이 다수의 컴포넌트가 커스텀 훅의 상태(state)를 받게 된다. 물론 커스텀 훅을 사용한다고 해서 컴포넌트 전반에 걸쳐 동일한 상태(state)와 `effect`를 공유하는 것은 아니다. 다만 모든 컴포넌트에서 커스텀 훅이 재실행되고 이 커스텀 훅을 호출하는 모든 컴포넌트가 각자의 상태(state)를 받게 될 뿐이다.

### 커스텀 훅을 호출하는 모든 컴포넌트는 커스텀 훅의 로직만을 공유한다

- 잊지 말아야될 것은 앞서 설명한 것처럼 커스텀 훅의 로직만 공유할 뿐 상태(state)를 동일하게 공유한다는 사실이다. 따라서 `ForwardCounter` 컴포넌트에서 `useCounter`를 호출했으므로 `useCounter`의 상태인 `counter`는 `ForwardCounter`에 의해서 설정된다. 그리고 `useCounter`의 `useEffect` 역시 `ForwardCounter` 에 의해서 설정되고 발생된다. 그렇다면 `ForwardCounter`에서 `useCounter`의 상태 `counter`에 접근해서 설정하려면 어떻게 해야하는 걸까?

### 컴포넌트에서 커스텀 훅의 상태(state) 접근하기

- 컴포넌트에서 호출하는 커스텀 훅의 상태(state)에 접근하는 것은 내장 훅을 사용할 때와 동일한 방법을 사용하면 된다. `useState` 같은 내장 훅도 백그라운드에서 무언가를 하고 있다. 상태를 만들고 관리도 한다. 그리고 어떠한 중요한 역할도 맡아서 한다.

```js
const [counter, setCounter] = useState(0);
```

- 위의 `useState`의 코드를 보면 배열 구조분해할당을 통해 반환하고 있는 걸 알 수 있다. 커스텀 훅 역시 함수이므로, 커스텀 내부에 있는 어떤 것이든 반환할 수 있다는 뜻이다. `useCounter` 같은 커스텀 훅을 호출해서 사용하는 컴포넌트에서 `counter` 라는 상태(state)에 접근해 설정하기 위해서는 커스텀 훅인 `useCounter`에서 외부 컴포넌트가 사용할 수 있도록 반환을 해줘야 한다.

```js
const useCounter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return counter;
};
```

- return `counter`를 추가해줌으로서 `useCounter` 커스텀 훅의 상태(state)를 외부 컴포넌트에서 접근할 수 있도록 해준다. 커스텀 훅에서는 외부 컴포넌트에서 필요한 무엇이든간에 반환이 가능하다. 배열이나 객체, 숫자도 반환할 수 있다.

```js
const [counter, setCounter] = useState(0);
```

- 이 상태(state)는 커스텀 훅이 설정하고 관리하는 것이다. 따라서 `useCounter`를 호출하고 있는 `ForwardCounter` 컴포넌트에서는 `useCounter`가 반환하는 값을 이용할 수 있다.

#### ForwardCounter.js

```js
const counter = useCounter();
```

- `ForwardCounter` 컴포넌트에서 호출한 `useCounter()`를 `counter` 라는 상수로 지정하고, 이를 할당한다. 이렇게 하면, `useCounter`가 `counter`로 값을 반환하기 때문에 `ForwardCounter` 컴포넌트 안의 상수(`counter`)에 값을 지정할 수 있다.

```js
const ForwardCounter = () => {
  const counter = useCounter();

  return <Card>{counter}</Card>;
};
```

- 이전에 사용했던 로직들을 모두 제거하니 `ForwardCounter` 컴포넌트의 로직이 매우 간결해졌다.

![ezgif com-gif-maker (82)](https://user-images.githubusercontent.com/53133662/171586355-b2bddc97-645b-4806-85f8-ec4c02034cf2.gif)

- 저장하고 새로고침 해보면, 커스텀 훅을 사용하던 이전과 동일하게 작동하는 것을 알 수 있다.

### 정리

- 커스텀 훅을 만드는 방법에서 가장 중요한 것은 '네이밍' 이다. 언제나 `use`로 시작해야 하고, 커스텀 훅 내부의 상태(state)와 관련된 로직을 사용한다던가, 다른 리액트 훅을 사용할 수 있으며, 이를 통해서 컴포넌트 간에 특정 로직을 공유할 수 있게 된다.

</br>

## 사용자 정의 훅 구성하기

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

- `BackwardCounter` 컴포넌트에도 `ForwardCounter` 컴포넌트와 동일한 로직을 가지고 있다. 다만 덧셈 대신 뺄셈을 이용할 뿐이다. 당연히 `ForwardCounter` 처럼 `useCounter` 커스텀 훅을 사용할 수 있을 것이다. 다만 이 두 개의 컴포넌트에서의 차이점(덧셈과 뺄셈)에 따른 조건부 로직을 사용하기 위해서는 매개변수를 받아들이게 해야만 한다. 커스텀 훅도 함수이기에 함수를 사용할 때 쓰던 것처럼 재사용 및 재설정을 위해서 인자와 매개변수를 받아올 수 있기 때문이다.

### 사용자 정의(Custom) 훅에서 매개변수 받기

- 앞서 설명한 것처럼 커스텀 훅도 함수이기 때문에 매개변수를 사용할 수 있다. 예를 들어, 내장 훅인 `useState` 역시 초기 값을 설정해주는 매개변수를 받을 수 있다. 두 개의 인자를 받는 `useEffect` 역시 2개의 매개변수를 받을 수 있다. `effect` 함수를 첫 번째 인자로 받고, 의존성 배열을 두 번째 인자로 받아들이기 떄문이다. 이는 지금까지 우리가 해왔던 방식이고, 이 방식은 커스텀 훅에서도 동일하게 사용할 수 있다. 그러면, 현재의 커스텀 훅에서는 어떤 매개변수를 사용할 수 있을까?

```js
const interval = setInterval(() => {
  setCounter((prevCounter) => prevCounter - 1);
}, 1000);
```

- 우리가 원하는 건 `counter`가 어떻게 증가하는지를 제어하는 지표이다. 이 상태(state) 갱신 함수 전체(`setCounter`)를 받아들여서 작동을 더 유연하게 할 수도 있다.

#### useCounter.js

```js
const useCounter = (counterUpdateFn) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return counter;
};
```

- 여기에 `counterUpdateFn` 이라는 `counter` 상태 갱신 함수를 매개변수로 넣고, ㅓ스텀 훅에서는 이 `counterUpdateFn`를 실행해주기만 하면 된다.

```js
const useCounter = (counterUpdateFn) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(counterUpdateFn());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return counter;
};
```

- 그리고 `useCounter` 에서 받게되는 `counterUpdateFn` 인자는 실행 가능한 함수이며, 이는 이전의 `counter`를 받아 새로운 `counter`를 만들어준다. 물론 위의 코드처럼 커스텀 훅을 이렇게 유연하게 만들 수도 있지만, 덧셈을 할지 뺄셈을 할지를 제어하는 boolean 플래그와 같은 것을 사용할 수도 있다. 예를 들어,

```js
const useCounter = (forwards) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return counter;
};
```

- `forwards` 라고 명명한 매개 변수를 입력한다고 해보자. `forwards`가 true 이면 덧셈을 할 것이고, false 면 뺄셈을 하도록 만들 것이다. 이 `forwards`는 초기값을 설정할 수도 있고, 그렇게 되면 이 매개변수는 boolean 방식으로 선택할 수 있을 것이다.

```js
const useCounter = (forwards = true) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return counter;
};
```

- `forwards` 라는 매개변수의 초기 값을 `true`로 설정했다. `setInterval()` 안에서는 이 `forwards`가 true 인지 false 인지를 확인해서 true 면 `setCounter`의 식을 덧셈으로 만들 것이고, false 이면 `setCounter`의 식을 뺄셈으로 만들 것이다.

```js
useEffect((forwards) => {
  const interval = setInterval(() => {
    if (forwards) {
      setCounter((prevCounter) => prevCounter + 1);
    } else {
      setCounter((prevCounter) => prevCounter - 1);
    }
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

- 간단하게 if 문을 사용해서 `setCounter`를 각각의 매개변수 조건에 맞게 갱신하도록 했지만, 앞서 했던 방식으로 전체 함수(ex. `counterUpdateFn`)를 받아들이는 방법도 가능하다. 어느 쪽이든 간에 이 커스텀 훅의 `effect` 안에는 이제 새로운 의존성이 생겼음을 알 수 있다.

### 커스텀 훅의 useEffect에 매개변수를 의존성으로 주입하기

- `useEffect` 안에서 사용하고 있는 매개변수 `forwards`는 분명 의존성이다. 이는 `useEffect` 함수 내부에서 정의된 것도 아니고, `useCounter` 커스텀 훅 '외부' 에서 설정된 것도 아니다. 대신에 이는 매개변수로서 `useCounter`가 받게 되는 값이기 때문에 이를 `useEffect`의 의존성으로 추가해야만 한다.

```js
useEffect(() => {
  const interval = setInterval(() => {
    if (forwards) {
      setCounter((prevCounter) => prevCounter + 1);
    } else {
      setCounter((prevCounter) => prevCounter - 1);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [forwards]);
```

- `forwards` 를 의존성으로 추가함으로써 의존성(`forwards`) 변경이 일어날 때마다 `useEffect` 함수가 재실행 할 수 있도록 해준다.

### 커스텀 훅의 useEffect에 매개변수를 의존성을 주입해야 하는 이유

- 물론 이런 커스텀 훅을 사용하는 컴포넌트 코드에 따라서 이 의존성(`forwards`)이 바뀌지 않을 가능성도 있다. 컴포넌트 안에서 그 값이 항상 참 또는 거짓으로 고정될 수도 있기 때문이다. 하지만 괜찮다. 의존성이 바뀌지 않는 이상 `useEffect`는 재실행 되지 않기 때문이다. 또한, 의존성 값이 바뀌지 않을 가능성에도 불구하고 `useEffect`에 해당 의존성을 추가하기를 권장하는 것에는 큰 이유가 있다. `useCounter` 커스텀 훅을 호출해서 사용하는 컴포넌트(서로 다른 인자를 사용)가 있는 경우에 인자가 바뀌면 `effect` 함수 역시 재실행할 수 있도록 보장할 수 있기 때문이다.

### BackwardCounter 에서 커스텀 훅 호출하기

- 이제 `BackwardCounter` 컴포넌트에서 `useCounter` 훅을 호출해야만 한다. 이전과 동일하게 `useCounter`를 import 해온 뒤에 `useCounter`에 인자를 전달한다.

```js
import useCounter from "../hooks/use-counter";

const BackwardCounter = () => {
  const counter = useCounter(false);

  return <Card>{counter}</Card>;
};
```

- `BackwardCounter` 컴포넌트의 뺄셈 로직은 `useCounter`로 전달하는 매개변수(`forwards`)의 값이 false 여야 하기 때문에 `useCounter`에 `false` 를 전달한다.

  > `ForwardCounter` 컴포넌트의 덧셈 로직은 매개변수가 true 이고, 매개변수의 초기값이 true 이기 때문에 그대로 `useCounter`를 호출만 한다.

- 만약, 매개변수의 기본 값 외에 다른 값을 원한다면 당연히 `BackwardCounter` 컴포넌트의 `useCounter(false)` 처럼 해당 값을 지정해서 넘겨줘야 한다. 이제 모든 로직이 완료 되었다. `BackwardCounter` 컴포넌트 역시 `ForwardCounter` 컴포넌트처럼 로직이 매우 간결해진 것을 알 수 있다.

```js
const BackwardCounter = () => {
  const counter = useCounter(false);

  return <Card>{counter}</Card>;
};
```

![ezgif com-gif-maker (82)](https://user-images.githubusercontent.com/53133662/171586355-b2bddc97-645b-4806-85f8-ec4c02034cf2.gif)

- 두 개의 카운터가 모두 커스텀 훅(`useCounter`)를 통해 정상적으로 작동되는 걸 확인할 수 있다.

### 정리

- 지금까지의 코드들은 인위적인 예시일 뿐이며, 현실적으로 실무에서 사용하는 방법이 아닐 수도 있다. 예를 들면 두 개의 컴포넌트 대신 하나의 컴포넌트를 사용할 수도 있지만 커스텀 훅을 이해하기 위해 별개로 나눈 것이기 때문이다. 이 점을 인지하고 있도록 하자.

  </br>