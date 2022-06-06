# Building Custom React Hooks

## 목차

- [What are "Custom Hooks"?](#커스텀-훅이란-무엇인가)
- [Creating a Custom React Hook Function](#커스텀-리액트-컴포넌트-ReEvaluation-Hook-함수-생성하기)
- [Using Custom Hooks](#사용자-정의-훅-사용하기)
- [Configuring Custom Hooks](#사용자-정의-훅-구성하기)
- [Configuring Custom Hooks](#사용자-정의-훅-구성하기)
- [Onwards To A More Realistic Example](#좀-더-현실적인-예시를-위해)
- [Building a Custom Http Hook](#사용자-정의-Http-훅-빌드하기)
- [Using the Custom Http Hook](#사용자-정의-Http-훅-사용하기)
- [Adjusting the Custom Hook Logic](#사용자-정의-훅-로직-조정하기)

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

## 좀 더 현실적인 예시를 위해

- 먼저 이전에 HTTP 요청을 전송하는 것에 대한 방법을 학습한 적이 있을 것이다. 이때 사용했던 Firebase의 realtime database의 URL 주소가 필요하니, 그 주소를 긁어와 현재의 어플리케이션에서 fetch를 통해 사용하고 있는 URL 주소를 대체하도록 하자. 물론 Firebase 가 요구하는 조건 `/저장하고자 하는 노드의 이름.json`을 URL 주소 뒤에 붙이는 걸 잊지 말자.

- 이 어플리케이션은 어떻게 돌아갈까? 먼저 URL을 Firebase의 realtime database의 URL 주소로 수정해주고 저장한 뒤, 새로고침을 해보자.

![ezgif com-gif-maker (83)](https://user-images.githubusercontent.com/53133662/171605520-025dfb16-1df3-46c0-a211-7a140815dd9a.gif)

- "Task 1"을 추가하고 "Add Button"을 누른 뒤 연결한 Firebase의 realtime database 로 이동하면

![스크린샷 2022-06-02 오후 6 55 57](https://user-images.githubusercontent.com/53133662/171605490-aab4dc5d-3d7c-47d4-a5cf-e4a491fd0eaa.png)

- 내가 설정한 새로운 노드(`tasks`)가 생성되었음을 확인할 수 있다.

### 커스텀 훅으로 가져올 수 있는 공통된 로직 찾아보기

- 현재 어플리케이션의 데이터(Task)를 렌더링하는 컴포넌트 로직들을 보면 Task 데이터를 fetch API 를 통해 Firebase의 database에 "POST" 하고, 이를 다시 "GET" 해오는 방식을 사용한 걸 알 수 있다. HTTP 를 전송하고 오류를 처리하고 로딩 상태(state)도 관리하며 도착한 데이터를 변경하거나 표시하는 모든 작업이 fetch API를 통해 이루어진 것이다. 여기에는 다양한 컴포넌트가 관리해주고 있지만 가장 중요한 것은 `App` 컴포넌트로 Task 데이터를 가져오는 `fetchTask` 함수가 있는 부분이다.

#### App.js

```js
const fetchTasks = async (taskText) => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(
      "https://react-http-6b4a6.firebaseio.com/tasks.json"
    );

    if (!response.ok) {
      throw new Error("Request failed!");
    }

    const data = await response.json();

    const loadedTasks = [];

    for (const taskKey in data) {
      loadedTasks.push({ id: taskKey, text: data[taskKey].text });
    }

    setTasks(loadedTasks);
  } catch (err) {
    setError(err.message || "Something went wrong!");
  }
  setIsLoading(false);
};
```

- 이 `fetchTasks` 함수는 `useEffect`로 인해 실행되거나 `App` 컴포넌트가 반환하는 `Tasks` 컴포넌트에 props로 전달되어 해당 컴포넌트 내부에서 버튼이 클릭되거나 하면서 실행되고 있다. 이렇게 `App` 컴포넌트 안에서 `fetchTasks` 함수가 트리거 되고 있다.

#### NewTask.js

```js
const enterTaskHandler = async (taskText) => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(
      "https://react-http-6b4a6.firebaseio.com/tasks.json",
      {
        method: "POST",
        body: JSON.stringify({ text: taskText }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Request failed!");
    }

    const data = await response.json();

    const generatedId = data.name; // firebase-specific => "name" contains generated id
    const createdTask = { id: generatedId, text: taskText };

    props.onAddTask(createdTask);
  } catch (err) {
    setError(err.message || "Something went wrong!");
  }
  setIsLoading(false);
};
```

- `NewTask` 컴포넌트도 fetch API를 사용하는 로직 함수 `enterTaskHandler` 를 가지고 있다. `enterTaskHandler` 함수는 `App`의 `fetchTasks` 함수처럼 HTTP 요청을 보내고 있지만, Firebase에 데이터를 저장하기 위한 "POST" 요청이 전송된다. 이 `enterTaskHandler` 함수는 `TaskForm` 컴포넌트가 최종적으로 제출될 때 트리거 되는 함수이다. 즉, `TaskForm` 컴포넌트는 `NewTask` 컴포넌트로부터 props로 함수를 받아 해당 함수에서 버튼이 클릭되거나 인풋에 입력된 값이 검증되는 시점에서 `enterTaskHandler`가 실행되는 것이다.

### 정리

- 이 두가지의 컴포넌트(`App`, `NewTask`)를 살펴보면서, fetch API를 사용해서 HTTP 요청을 하는 로직이 최소 하나 이상의 커스텀 훅을 추가할 수 있다는 걸 알 수 있었다. 이 두개의 HTTP 요청을 하는 함수가 모두 동일한 로직을 가진 것은 아니지만 크게 두 가지의 비슷한 종류의 작업을 하고 있을 것이다. 저장할 데이터를 전송하는 부분과, 데이터를 가져오기 위한 요청을 보내는 부분 말이다. 세밀하게 살펴보면 응답에 대한 변환 로직은 조금 다른 형태이지만 실제로 코드가 유사한 부분은 상당수 존재한다. 로딩과 오류 상태(state)를 관리하고 설정하는 것과 오류를 다루는 로직 역시 동일하다. 이처럼 비슷한 코드가 존재하고 있기 때문에 이 부분의 로직을 별도의 함수에 아웃소싱하는 것을 고려해볼 수 있을 것이다. 지금까지 배운 커스텀 훅을 통해서 말이다.

</br>

## 사용자 정의 Http 훅 빌드하기

- hooks 폴더를 생성하고 사용할 커스텀 훅 `use-fetch.js` 파일을 만든다.

```js
const useFetch = () => {};
export default useFetch;
```

- 그리고 먼저 `useFetch` 커스텀 훅으로 아웃소싱할 로직(`App.js`)을 확인한다.

#### App.js

```js
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const fetchTasks = async (taskText) => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(
      "https://react-http-6b4a6.firebaseio.com/tasks.json"
    );

    if (!response.ok) {
      throw new Error("Request failed!");
    }

    const data = await response.json();

    const loadedTasks = [];

    for (const taskKey in data) {
      loadedTasks.push({ id: taskKey, text: data[taskKey].text });
    }

    setTasks(loadedTasks);
  } catch (err) {
    setError(err.message || "Something went wrong!");
  }
  setIsLoading(false);
};
```

- 위의 로직들을 살펴보면, 이것은 로딩과 오류 상태(state)에 대한 것임과 동시에 응답을 보내고 해당 응답을 평가하는 코드이기도 한 걸 알 수 있다. 그리고 이 모두가 아웃소싱 되어야 한다. 해당 `fetchTasks` 함수 전체와 `isLoading`, `error` 의 상태(state) 코드까지 모두 복사해서 `useFetch` 커스텀 훅 함수 안에 붙여 넣어준다.

```js
const [tasks, setTasks] = useState([]);
```

> `tasks` 상태(state)는 `App` 컴포넌트에만 사용하는 것이기 때문에 이를 제외하고 모두 복사해서 `useFetch` 커스텀 훅에 넣어주자.

#### use-fetch.js

```js
const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = async (taskText) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-6b4a6.firebaseio.com/tasks.json"
      );

      if (!response.ok) {
        throw new Error("Request failed!");
      }

      const data = await response.json();

      const loadedTasks = [];

      for (const taskKey in data) {
        loadedTasks.push({ id: taskKey, text: data[taskKey].text });
      }

      setTasks(loadedTasks);
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
    setIsLoading(false);
  };

  return {
    isLoading: isLoading,
    error: error,
    sendRequest: sendRequest,
  };
};
```

- `App` 컴포넌트에서 긁어온 `fetchTasks` 함수의 이름을 `sendRequest`로 수정한다. 이렇게 수정한다면 내부에 있는 로직을 좀 더 일반화시킬 수 있다. 이 `useFetch` 커스텀 훅은 데이터 fetch 에만 국한되어 데이터를 가져오는 역할만 하는 것이 아니라, 데이터를 보내는 역할도 하기 때문에 조금 더 이름을 일반화 시키는 것이다. 이렇게 수정하게 되면 훅의 재사용성을 높이고 여러 작업에도 사용할 수 있다는 걸 명시적으로 알 수 있게 된다.

### useFetch 커스텀 훅에 다수의 매개변수 추가하기

- `useFetch` 커스텀 훅은 어떤 종류의 요청이든 받아서 모든 종류의 URL로 보낼 수 있어야 하고, 또한 어떤 데이터든 변환을 할 수 있어야 한다. 동시에 로딩(`isLoading`)과 오류(`error`) 상태(state)를 관리하고, 모든 과정을 동일한 순서대로 실행해야만 한다. 그리고 이런 유연한 커스텀 훅을 만들기 위해서는 몇 가지의 매개변수가 필요하다.

#### App.js

```js
const response = await fetch(
  "https://react-http-6b4a6.firebaseio.com/tasks.json"
);
```

#### NewTask.js

```js
const response = await fetch(
  "https://react-http-9914f-default-rtdb.firebaseio.com/tasks.json",
  {
    method: "POST",
    body: JSON.stringify({ text: taskText }),
    headers: {
      "Content-Type": "application/json",
    },
  }
);
```

- 먼저, 이 fetch API 의 `response` 로직 부분을 보면 URL 을 비롯하여, 메소드, body, headers 등 유연성을 갖추어야 함을 알 수 있다. `NewTask` 컴포넌트에서 사용하는 HTTP 요청은 "POST"이기 떄문에 fetch API를 요청할 때 URL 뿐만 아니라, 두 번째 인자에 메소드, body, headers 가 필요하기 때문이다. 따라서 해당 설정을 위한 매개변수(`requestConfig`)를 추가한다.

```js
const useFetch = (requestConfig) => {
  ...
}
```

- 매개변수 `requestConfig`는 URL을 포함해서 어떤 종류의 설정 사항도 포함할 수 있는 객체 형태여야만 할 것이다.

```js
const sendRequest = async (taskText) => {
  setIsLoading(true);
  setError(null);
  try {
    // ⚡️ --------
    const response = await fetch(requestConfig.url, {
      method: requestConfig.method,
      headers: requestConfig.headers,
      body: JSON.stringify(requestConfig.body),
    });
    // ⚡️ --------

    if (!response.ok) {
      throw new Error("Request failed!");
    }

    const data = await response.json();

    applyData(data);
  } catch (err) {
    setError(err.message || "Something went wrong!");
  }
  setIsLoading(false);
};
```

- 따라서 URL 주소와 설정 객체 등 하드 코딩된 것을 제거한 뒤, URL은 `requestConfig.url` 그리고 설정 객체는 각각 `method`는 `requestConfig.method`, `headers`는 `requestConfig.headers`, `body`는 `JSON.stringify(requestConfig.body)`로 할당한다. 이렇게 해야, 외부 컴포넌트에서 커스텀 훅을 호출할 때 URL 주소를 담은 것과 해당 설정 속성을 가진 객체(`requestConfig`)를 전달할 수 있기 때문이다. 이렇게 되면, "GET"으로 URL만 요청하는 로직 뿐만 아니라, "POST"로 요청할 때도 설정 객체를 넣어서 사용할 수 있게 된다.

```js
const data = await response.json();
```

- 당연하게도 이런 방식으로 `response`을 변환하기도 해야 한다. JSON 데이터만을 다룰 것이기 때문에, 이 부분은 수정하지 않고 그대로 둔다.

```js
const loadedTasks = [];

for (const taskKey in data) {
  loadedTasks.push({ id: taskKey, text: data[taskKey].text });
}

setTasks(loadedTasks);
```

- 하지만 위의 코드처럼 데이터를 최종적으로 처리하는 부분은 너무 구체적인 부분(`GET` 요청만을 위한 데이터 처리)이기 때문에 커스텀 훅에 포함되서는 안될 것이다. 대신에 여기에 데이터를 가져오면, `useFetch` 커스텀 훅을 사용하는 컴포넌트로부터 얻은 함수를 실행해서 그 함수에 데이터를 넘겨주는 방식을 사용할 것이다. 이렇게 하면 세부적인 변환 과정은 커스텀 훅이 사용되는 컴포넌트 안에서 정의할 수 있게 된다. 따라서 위의 코드를 커스텀 훅 내부에서 실행하지 않고, 매개변수로 받은 함수로 처리해줄 수 있도록 한다.

```js
const useFetch = (requestConfig, applyData) => {
  ...
}

```

- 해당 로직(데이터 처리)을 처리할 함수를 `applyData` 라는 이름의 매개변수로 받기로 한다. 요청을 통해 데이터를 가져온 다음 `applyData` 매개변수 함수를 호출해서 데이터를 전달한다.

```js
const data = await response.json();

applyData(data);
```

- 즉, `useFetch` 커스텀 훅에서 `applyData` 함수로 데이터를 전달한 것이며, `applyData` 함수 안에서 무엇이 발생하는지에 대해서는 `applyData` 커스텀 훅을 사용하는 컴포넌트에서 정의할 수 있게 되었다. 이제 `useFetch` 커스텀 훅에서 재사용과 재사용 로직을 준비했다. 하지만 데이터를 사용하는 세부적인 과정은 해당 커스텀 훅을 사용하는 컴포넌트에서만 정의할 수 있도록 했다. 그리고 이렇게 분리를 해주는 것이 이전보다는 조금 더 합리적으로 보인다. `useFetch` 커스텀 훅에는 `isLoading`과 `error` 같은 상태(state)와 HTTP 통신을 하는 `sendRequest` 함수가 포함되었다. 하지만 이것들은 결국 `useFetch` 커스텀 훅을 사용하는 컴포넌트에 필요한 것들이다.

### 컴포넌트에서 커스텀 훅의 상태(state)와 함수에 접근하기

- `useFetch` 커스텀 훅을 사용하는 컴포넌트들은 로딩(`isLoading`)과 오류(`error`) 상태에 대해 접근할 수 있어야 하고, `sendRequest` 함수에도 접근할 수 있어야 한다. 그래야지 해당 커스텀 훅을 사용하는 컴포넌트들이 이것들을 활성화하고 요청 또한 보낼 수 있기 때문이다.

```js
const useFetch = (requestConfig, applyData) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = async (taskText) => {
    ...
  };

  return {}
};
```

- 따라서 `useFetch` 함수 내부의 가장 하단으로 이동하여 외부 컴포넌트들이 접근하여 사용할 수 있도록 상태(state)와 함수를 반환한다. 이전의 학습에서 언급했던 것처럼 커스텀 훅은 숫자나 문자열, 배열, 객체 등과 같이 무엇이든 반환할 수 있다. 이번에는 여러 개의 값들을 반환할 예정이기 때문에 객체의 형태로 반환할 것이다.

```js
return {
  isLoading: isLoading,
  error: error,
  sendRequest: sendRequest,
};
```

- 객체 안에 반환할 상태(`isLoading`, `error`)와 함수(`sendRequest`)를 반환한다. 객체의 키와 값에서 왼쪽의 키는 속성의 이름을 말하고, 오른쪽의 값은 말 그대로 값을 의미한다.

```js
return {
  isLoading,
  error,
  sendRequest,
};
```

- 물론, 객체 내부의 좌측의 속성 이름과 우측의 값의 이름이 동일하기 때문에 모던 자바스크립트의 편의 기능을 통해 생략하여 사용할 수도 있다. 이전에 작성했던 코드와 같은 결과를 얻으면서 코드가 좀 더 짧아지는 효과이다. 그리고 이렇게 생략을 하여 사용해도, 이전의 긴 문법으로 변환한 뒤 사용되기 때문에 간단하게 생략하여 사용하는 것이 더 좋을 것이다.

</br>

## 사용자 정의 Http 훅 사용하기

- 이제 `App` 컴포넌트로 돌아와 커스텀 훅(`useFetch`)을 사용해보자.

```js
import useFetch from "./hooks/use-fetch";
```

- 먼저 사용할 `useFetch` 훅을 import 해온 뒤 호출해오자.

```js
useFetch();
```

- 여기에는 두 개의 인자(매개변수)를 전달해주어야 한다. 이전에 우리가 `useFetch`에서 외부 컴포넌트로부터 받기로 한 그 매개변수들 말이다.

```js
useFetch(
  {
    url: "https://react-http-9914f-default-rtdb.firebaseio.com/tasks.json",
  },
  데이터 처리 함수
);
```

- 먼저 `useFecth` 내부에서 `fetch()` 안에 넣어줄 URL과 method, headers, body 등의 속성을 포함하고 있는 `requestConfig` 에 보낼 객체와 데이터를 처리해주는 함수(`applyData`)를 전달해야 한다. `requestConfig` 에 보내는 객체는 내부에 필요한 속성들이 포함되어 있어야 한다. 커스텀 훅 내부에서 URL 과 method, headers, body 등의 속성에 접근하기 때문이다. 따라서 `App` 컴포넌트의 url 속성에 해당 문자열 주소를 할당해준다. 그렇다면 나머지 method, headers, body 속성은 왜 넣어주지 않을까?

### `App` 컴포넌트 내부에서 `requestConfig`에 보내는 객체에는 왜 URL 만 포함시켰을까

- `useFetch` 커스텀 훅을 사용하고자 하는 두개의 컴포넌트의 차이점을 확인해보자. `App` 컴포넌트에서는 데이터를 그저 가져오기만 하면 되기 때문에 "GET" 요청으로만 처리가 가능하고, 여기에는 method, headers, body 등이 필요하지 않다. 반면, `NewTask` 컴포넌트는 "POST" 요청으로 데이터를 서버에 보내야 하고 여기에는 method, headers, body 의 속성이 필요하다. 이렇게 필요한 속성들이 다르기 떄문에 우리는 유연성을 조금 더 갖춰야할 필요가 있다. 모든 컴포넌트가 더미 데이터를 보낼 필요가 없기 때문이다. 이제 다시 커스텀 훅으로 돌아가 `fetch()`의 Request 부분을 유연성을 갖춘 로직으로 수정해야 한다.

### 커스텀 훅의 fetch() 두 번째 속성에 유연성 부여하기

```js
const response = await fetch(requestConfig.url, {
  method: requestConfig.method,
  headers: requestConfig.headers,
  body: JSON.stringify(requestConfig.body),
});
```

- `useFetch` 커스텀 훅으로 돌아와 response 변수의 `fetch()` 로직을 수정한다.

```js
const response = await fetch(requestConfig.url, {
  method: requestConfig.method ? requestConfig.method : "GET",
  headers: requestConfig.headers ? requestConfig.headers : {},
  body: JSON.stringify(requestConfig.body)
    ? JSON.stringify(requestConfig.body)
    : null,
});
```

- `method`의 경우에는 `requestConfig.method`가 적용 되었는지를 확인하고(`?`) 설정되었을 때만 `requestConfig.method`를 부여하고 아닐 때(`:`)는 "GET"으로 요청을 보낼 수 있도록 수정한다.
- `headers`의 경우에는 `requestConfig.headers`가 적용 되었는지를 확인하고(`?`) 설정되었을 때만 `requestConfig.headers`를 부여하고 아닐 때(`:`)는 빈 객체(`{}`)를 할당한다.
- `body`의 경우에는 `JSON.stringify(requestConfig.body)`의 설정 상태를 확인하고(`?`) 설정되었을 때만 `JSON.stringify(requestConfig.body)`를 부여하고 아닐 때(`:`)는 `null`로 할당한다. 이렇게 수정함으로써 커스텀 훅은 충분한 유연성을 갖추게 되었다.

```js
useFetch(
  {
    url: "https://react-http-9914f-default-rtdb.firebaseio.com/tasks.json",
  },
  데이터 처리 함수
);
```

- 다시 `App` 컴포넌트로 돌아오자. 이제 `App` 컴포넌트에서 호출한 `useFetch`가 이런 형태의 객체를 전달할 수 있게 되었다. 가독성을 위해 데이터 처리 로직을 `useFetch` 위에 작성한다. 이제 남은 건 데이터를 처리하는 함수인 두 번째 인자를 준비하는 일이다.

```js
const transformTasks = (taskObj) => {};

useFetch(
  {
    url: "https://react-http-9914f-default-rtdb.firebaseio.com/tasks.json",
  },
  transformTasks
);
```

- 먼저 데이터 처리를 담당할 함수의 이름을 `transformTasks` 라고 한다. 여기에는 `taskObj`를 매개변수로 받는다. 이 `transformTasks` 함수 내부에 `useFetch` 안에서 사용했던 즉, 이전에 제거했던 그 데이터 처리 로직을 그대로 복사해서 붙여넣기 해준다.

```js
const transformTasks = (taskObj) => {
  const loadedTasks = [];

  for (const taskKey in data) {
    loadedTasks.push({ id: taskKey, text: data[taskKey].text });
  }

  setTasks(loadedTasks);
};
```

- 그리고 여기에서 `taskObj` 인자를 `data` 로 표기된 자리에 대신 넣어주고,

```js
const transformTasks = (taskObj) => {
  const loadedTasks = [];

  for (const taskKey in taskObj) {
    loadedTasks.push({ id: taskKey, text: taskObj[taskKey].text });
  }

  setTasks(loadedTasks);
};
```

- `for in` 문을 통해서 읽어와서 객체 형태로 `loadedTasks` 이라는 빈 배열에 push 해준다. 이제 Firebase에서 받는 객체의 모든 작업은 프론트엔드에서 필요한 구조와 유형을 갖는 객체로 변환될 것이다. 그리고 `setTasks` 상태(state) 업데이트 함수에 전달한다. 이것으로 `useFetch()` 의 두 번째 인자인 데이터 처리 함수가 준비되었다.

```js
useFetch(
  {
    url: "https://react-http-9914f-default-rtdb.firebaseio.com/tasks.json",
  },
  transformTasks
);
```

- `transformTasks` 이 함수는 커스텀 훅이 응답을 받게 되면 알아서 호출될 것이다. 이런 방법이 좋은 이유는 이렇게 하면 주요 로직은 커스텀 훅에 아웃소싱 할 수 있게 되고 로직에 대한 데이터는 그 데이터가 필요한 컴포넌트에 위치하게 되기 때문이다.

### `useFetch` 요청 활성화하기

- `useFetch` 커스텀 훅은 매개변수만 받는 것이 아니라 무언가를 반환하기도 한다. `isLoading`과 `error` 상태(state)가 있는 객체를 반환하며, `sendRequest` 함수의 포인터 역시 반환한다. 그리고 `useFetch` 요청을 활성화하기 위해서는 호출이 필요하다. 따라서 `App` 컴포넌트에서 `httpData`란 이름으로 `useFetch`를 호출할 수 있도록 하고,

```js
const httpData = useFetch(
  {
    url: "https://react-http-9914f-default-rtdb.firebaseio.com/tasks.json",
  },
  transformTasks
);
```

- 이제 `httpData`를 포인터해서 구조를 분해하는 로직을 작성한다.

```js
const httpData = useFetch(
  {
    url: "https://react-http-9914f-default-rtdb.firebaseio.com/tasks.json",
  },
  transformTasks
);
const {} = httpData;
```

- 그리고 `isLoading`, `error`, `sendRequest`를 객체 구조 분해 할당을 통해 추출한다.

```js
const { isLoading, error, sendRequest } = httpData;
```

- 그리고 여기에서 `App` 컴포넌트에서 사용할 별칭을 생성할 것인데, 자바스크립트에서 이 분해 문법에 콜론(`:`)을 추가하면 다른 이름을 부여할 수 있기에 이 방법을 사용해서 새로운 이름을 부여한다.

```js
const { isLoading, error, sendRequest: fetchTasks } = httpData;
```

- `sendRequest`의 새로운 이름으로 `fetchTasks`를 설정한다. 이는 커스텀 훅 내부의 `sendRequest` 함수를 가리키고 있는 포인터의 이름인 것이다. 단순히 이것을 사용할 `App` 컴포넌트 함수 안에서 `sendRequest` 함수를 가리키는 이름만 바꾼 것이다.

```js
useEffect(() => {
  fetchTasks();
}, []);
```

- 그렇게 되면, 기존에 HTTP 요청을 담당했던 함수 이름인 `fetchTasks()`를 그대로 사용할 수 있게 되고, 아래의 `useEffect` 훅 로직을 수정할 필요도 없을 것이다.

### `useEffect`의 의존성을 추가 문제

- 커스텀 훅으로 HTTP 요청을 하는 주요 로직들을 아웃소싱하면서 `useEffect` 훅의 의존성 배열에 무언가 오류가 있음을 경고하는 걸 알 수 있다. 이전에 사용하던 `fetchTasks` 함수에서는 문제가 되지 않던 것이다. 이전에는 상태 갱신 함수만 호출하고 있었기 때문에 의존성 배열을 굳이 주입하지 않아도 상관 없었기 때문이다. 하지만 `fetchTasks` 함수, 즉 내부의 `sendRequest` 함수는 커스텀 훅 내부에 위치해있고, 이를 추출해서 사용한 것이기 때문에 `useEffect`는 이 `sendRequest` 함수 안에서 무슨 일이 일어나고 있는지를 알지 못한다. 때문에 `fetchTasks` 함수가 변화할 때마다 `useEffect`를 재실행하려면 `fetchTasks`를 의존성으로 추가해야 한다.

#### 🚨 무한루프 발생

```js
useEffect(() => {
  fetchTasks();
}, [fetchTasks]);
```

- 하지만 이는 현재로서는 큰 문제가 될 수 있다. 현 시점에서는 무한 루프가 만들어지고 에러 상황을 발생시키기 때문에 이는 좋은 솔루션이 될 수 없기 때문이다. 그러니 나중에 다시 논의하기로 하고, 다시 의존성을 제거한다.

```js
useEffect(() => {
  fetchTasks();
}, []);
```

### 정리

- 지금까지 커스텀 훅을 통해서 `App` 컴포넌트를 재구축했다. 이제 `isLoading`과 `error` 상태에 접근이 가능하고, 이것들은 `Tasks` 컴포넌트 내부에 있는 자식 컴포넌트인 `Task` 컴포넌트에 전달된다. `fetchTasks` 함수에도 접근 가능하지만 요청을 보내거나 오류를 처리하는 부분은 커스텀 훅의 일부가 되었다.

![ezgif com-gif-maker (86)](https://user-images.githubusercontent.com/53133662/172176252-b67ac421-6e47-4d77-b401-e3a97cf7d381.gif)

- 저장하고, 새로고침을 해오면 현재 작업을 모두 불러오며 작업을 추가하는 기능도 동일하게 작동하는 걸 알 수 있다.
  </br>

## 사용자 정의 훅 로직 조정하기

- 이제 `App` 컴포넌트의 `useEffect`에 `fetchTasks`를 의존성으로 추가해야 한다. 왜냐하면 컴포넌트 함수 안에서 설정된 모든 데이터, 또는 함수는 그 함수의 의존성으로서 추가되어야 하기 때문이다.

#### 🚨 무한루프 발생

```js
useEffect(() => {
  fetchTasks();
}, [fetchTasks]);
```

- 하지만 여기서, 이전에 거론한 문제가 발생한다. 무한루프가 발생하는 것이다. `useEffect` 내부에서 `fetchTasks()` 함수를 호출하는데, 그렇게 되면 커스텀 훅 안에 있는 `sendRequest` 함수를 실행하게 되고, 몇 몇 상태(state)가 새로 설정 되기 때문이다.

### 커스텀 훅의 상태(state) 설정이 발생하면 커스텀 훅을 사용하는 컴포넌트는 재렌더링 된다.

- 상태(state)를 설정하는 커스텀 훅을 만들고, `App` 컴포넌트 내부에서 훅을 사용하게 되면, 컴포넌트는 묵시적으로 커스텀 훅이 설정한 상태(state)를 사용하게 된다. 즉, 커스텀 훅에서 구성된 상태(state)가 그 커스텀 훅을 사용하는 컴포넌트에 설정되게 되는 것이라는 뜻이다.

#### use-fetch.js

```js
const sendRequest = async (taskText) => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(requestConfig.url, {
      method: requestConfig.method ? requestConfig.method : "GET",
      headers: requestConfig.headers ? requestConfig.headers : {},
      body: JSON.stringify(requestConfig.body)
        ? JSON.stringify(requestConfig.body)
        : null,
    });

    if (!response.ok) {
      throw new Error("Request failed!");
    }

    const data = await response.json();

    applyData(data);
  } catch (err) {
    setError(err.message || "Something went wrong!");
  }
  setIsLoading(false);
};
```

- 여기 `sendRequest` 함수에서 `setIsLoading` 과 `setErrer`를 호출하면 이는 `App` 컴포넌트의 재렌더링을 발생시킨다. 왜 그럴까? 이는 `App` 컴포넌트 안에 있는 커스텀 훅을 사용하는 것이기 때문이다. 그렇게 되면, 재렌더링이 되는 순간 커스텀 훅(`useFetch`)이 다시 호출되고, 커스텀 훅(`useFetch`)이 다시 호출되면 `sendRequest` 함수가 또 다시 재생성되면서 새로운 함수 객체를 반환하고 `App` 컴포넌트의 `useEffect`가 재실행된다.

#### App.js

```js
useEffect(() => {
  fetchTasks();
}, [fetchTasks]);
```

### 무한 루프가 발생하는 이유

- 이전의 강의(section-12) 에서 살펴봤듯이 자바스크립트에서 함수는 객체이다. 그리고 내부에 같은 로직을 품고 있더라도 함수가 재생성되면 이는 메모리에서 새로운 객체로 인식되기 때문에 `useEffect`가 이를 새로운 값으로 받아들이게 되며 기술적으로 같은 함수일지라도 재실행을 유발하게 된다.

### useCallback 으로 무한 루프를 방지하기

- 이를 방지하기 위해서는 다시 `useFetch` 커스텀 훅으로 돌아가서 `sendRequest` 부분을 수정해야 한다.

```js
const sendRequest = useCallback(async (taskText) => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(requestConfig.url, {
      method: requestConfig.method ? requestConfig.method : "GET",
      headers: requestConfig.headers ? requestConfig.headers : {},
      body: JSON.stringify(requestConfig.body)
        ? JSON.stringify(requestConfig.body)
        : null,
    });

    if (!response.ok) {
      throw new Error("Request failed!");
    }

    const data = await response.json();

    applyData(data);
  } catch (err) {
    setError(err.message || "Something went wrong!");
  }
  setIsLoading(false);
}, []);
```

- `async/await` 구문이 있더라도 문제가 없기 때문에 해당 함수 부분을 `useCallback`으로 감싸자. 알다시피 `useCallback`은 의존성 배열이 필요하다. 여기에 무엇을 주입해야 할까?

```js
const useFetch = (requestConfig, applyData) => {
  ...

  const sendRequest = useCallback(
    async (taskText) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(requestConfig.url, {
          method: requestConfig.method ? requestConfig.method : "GET",
          headers: requestConfig.headers ? requestConfig.headers : {},
          body: JSON.stringify(requestConfig.body)
            ? JSON.stringify(requestConfig.body)
            : null,
        });

        if (!response.ok) {
          throw new Error("Request failed!");
        }

        const data = await response.json();

        applyData(data);
      } catch (err) {
        setError(err.message || "Something went wrong!");
      }
      setIsLoading(false);
    },
    // ⚡️ --------
    [requestConfig, applyData]
    // ⚡️ --------
  );

  ...
};
```

- 의존성 배열은 이 안에서 사용되는 모든 것을 나열해야 한다. 이 경우에는 `useFetch` 커스텀 훅이 매개변수로 받아오는 `requestConfig` 와 `applyData`를 추가할 수 있을 것이다. 하지만 이렇게 했을 경우 또 다른 문제가 발생한다. 당연한 이야기겠지만 이 두가지 모두 객체이다. `requestConfig`는 자바스크립트 기본 객체이고, `applyData`는 함수인데 자바스크립트에서는 함수 역시 객체이기 때문이다. 다시 `App` 컴포넌트로 돌아가서 `useFetch`에 전달한 객체들을 살펴보자.

#### App.js

```js
const transformTasks = (taskObj) => {
  const loadedTasks = [];

  for (const taskKey in taskObj) {
    loadedTasks.push({ id: taskKey, text: taskObj[taskKey].text });
  }

  setTasks(loadedTasks);
};

const httpData = useFetch(
  {
    url: "https://react-http-9914f-default-rtdb.firebaseio.com/tasks.json",
  },
  transformTasks
);

const { isLoading, error, sendRequest: fetchTasks } = httpData;
```

- 우리는 `useFetch`에 인자로 전달하는 두 개의 객체가 `App` 컴포넌트가 재실행될 때마다 재생성되지 않도록 해야 한다. 현재로서는 `App` 컴포넌트가 재실행될 때마다 재실행되고 있기 때문이다.

```js
const transformTasks = useCallback((taskObj) => {
  const loadedTasks = [];

  for (const taskKey in taskObj) {
    loadedTasks.push({ id: taskKey, text: taskObj[taskKey].text });
  }

  setTasks(loadedTasks);
}, []);
```

 </br>
