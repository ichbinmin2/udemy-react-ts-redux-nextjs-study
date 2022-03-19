# Diving Deeper: Working with Fragments, Portals & "Refs"

## 목차

- [JSX Limitations & Workarounds](#JSX-제한-사항-및-해결-방법)
- [Creating a Wrapper Component](#컴포넌트-감싸기-wrapper-만들기)
- [React Fragments](#리액트-프래그먼트)
- [Introducing React Portals](#리액트-포털-소개)
- [Working with Portals](#리액트-포털-사용해보기)
- [Working with "ref"s](#ref로-작업하기)
- [Controlled vs Uncontrolled Components](#제어되는-컴포넌트와-제어되지-않는-컴포넌트)

## JSX 제한 사항 및 해결 방법

> JSX는 하나 이상의 root JSX element를 가질 수 없다.

### 잘못된 JSX 예시

```js
return (
    <h2>Hi there!</h2>
    <p>This does not work :-(</p>
)
```

- 위의 JSX 코드가 error 가 나는 이유는 하나 이상의 root JSX 요소를 가지고 있기 때문이다. value를 return 하거나 value를 변수에 저장하거나, 또는 상수에 저장하거나 property에 저장하면 value는 정확히 하나의 JSX 요소를 가지게 되어있다. 여러개의 children 은 가질 수 있지만, 저장하거나 return 할 때는 하나의 요소(element)만 가지고 있어야 한다.

### JSX 변환 JavaScript

```js
return (
    React.createElement('h2', {}, "Hi there!")
    React.createElement('p', {}, "This does not work :-('")
);
```

- 이것은 앞서 보여준 JSX 코드를 JavaScript로 변환한 코드이다. JavsScript 에서는 하나 이상을 return 할 수 없고, 위의 코드는 유효하지 않은 JavaScript 라는 것을 알 수 있다.

### 올바른 JSX 예시

```js
return (
  <div>
    <h2>Hi there!</h2>
    <p>This does not work :-(</p>
  </div>
);
```

- 이전에 하나 이상의 roor JSX 요소를 가지고 있어서 error가 났던 JSX 코드를 `<div>` 로 warp 하여 문제를 해결했다. `<div>`로 모든 JSX 요소(element)를 warp을 했다면, return 하는 JSX는 하나의 root 요소만 가지게 되는 것이다.

### 또 다른 대안

```js
return [
    <h2>Hi there!</h2>
    <p>This does not work :-(</p>
]
```

- 네이티브 JavaScript로 배열을 이용할 수도 있다. React는 JSX 요소(element)의 배열을 사용할 수 있기 때문이다. 다만 배열을 JSX 요소의 배열로 작업할 때마다 React는 `key`를 필요로 하고, 이때문에 매번 `key`를 설정해줘야 하는 번거로움이 있다.

### 정리

- 지금까지 하나의 root 태그로 JSX 요소를 warp을 해줌으로써 JSX 코드가 유효하게 return 될 수 있도록 했다. JSX는 하나 이상의 root JSX element를 가질 수 없기 때문이다. 허나 `<div>` 태그로 JSX 요소들을 warp 하는 것에는 문제가 하나 있다. 바로 `<div> Soup` 라는 이슈이다.

### 새로운 문제 : `<div> Soup`

```js
<div>
  <div>
    <div>
      <div>
        <h2>Some content.</h2>
      </div>
    </div>
  </div>
</div>
```

- 모든 컴포넌트는 다양한 이유(요구사항이나, JSX의 제한사항 때문에)로 warp 해줄 `<div>` 가 필요하다. 하지만 이러한 이유 때문에 불필요하게 렌더되기도 한다. (실제 element가 `DOM`에만 있더라도 마찬가지이다.) 또한 복잡하고 큰 어플리케이션에서는 최종 HTML 페이지가 엔드 사용자에게 서브 되는데, 불필요한 `<div>`나 다른 요소 태그들이 포함되어 있을 수 있다. 물론, 동작에는 문제가 없을지도 모른다. 허나 스타일링할 때 이러한 불필요한 `<div>` 태그들, 혹은 다른 요소의 warp 태그들로 인해 어쩌면 스타일링에 영향을 미치게 될 수도 있다. 그리고 기본적으로 `<div>`를 반복해서 warp을 하는 방식은 좋은 프로그래밍이라 말할 수 없다. 너무 많은 HTML 요소들을 렌더하게 되면 최종적으로 어플리케이션의 성능을 저하시키는 결과를 초래하기 때문이다. 이렇듯 JSX 요소를 `<div>` 태그로 warp 하는 방법은 썩 나쁘지 않은 방법이지만 그렇다고 완벽한 해결책은 아닐 것이다.

</br>

## 컴포넌트 감싸기 wrapper 만들기

- 앞서 소개한 `<div>`로 warp을 하는 방법 외에도 JSX 코드 블럭을 감싸주는 여러 방법들이 있다. 먼저, components 폴더에 `Helpers`라는 폴더를 만들고, `Warpper.js`를 생성한다.

![Warpper.js](https://user-images.githubusercontent.com/53133662/158738850-00a89866-260a-40ed-a387-ce1403cfa4fc.png)

- `Warpper.js` 에서는 JSX 코드를 사용하지 않기 때문에, React를 import 하지 않았다.

```js
const Warpper = (props) => {
  return props.children;
};

export default Warpper;
```

- `props.children`만을 return 하는 `Warpper` 컴포넌트를 만들었다. 이전에 학습했던 것처럼, `props.children`은 모든 컨텐츠를 저장한다. (커스텀 컴포넌트의 태그 사이로 보내는 모든 컨텐츠를 말이다.)

```js
<div>
  ...
  <Card className={classes.input}>...</Card>
</div>
```

- `AddUser` 컴포넌트로 이동하여, `<div>` 태그로 warp 해주었던 부분을 `Warpper` 컴포넌트로 수정해준다.

```js
<Warpper>
  ...
  <Card className={classes.input}>...</Card>
</Warpper>
```

### 정리

- `Warpper` 컴포넌트는 기본적으로 비어있는 컴포넌트이다. `props.children`로 받아온다는 계획만 있고, 실제로 이 커스텀 컴포넌트를 어떤 컨텐츠 태그를 감싸는 데에 사용하지 않으면 그저 빈 컴포넌트라는 이야기다. 실제로 `Warpper` 컴포넌트로 `AddUser` 컴포넌트의 JSX 코드 블럭들을 warp 해주니 앱은 제대로 작동하게 된다. 여기서 `<div>` 태그로 warp 해주는 방법과 다른 지점은 `Warpper` 컴포넌트로 감싸는 요소는 `DOM`에 렌더되지 않는다는 것이다. JSX 코드 블럭이 요구했던 사항에 대해서 생각해보자. JSX 코드는 반드시 하나의 root 컴포넌트가 `DOM`에 렌더되어야 한다. 그런데, `DOM`에 렌더되지는 않지만 하나의 root 컴포넌트가 반환될 수 있는 그 역할을 `Warpper` 컴포넌트가 해주고 있는 것이다. (그리고 이것은 JavsScript의 기술적인 요구사항을 지켜주는 방법이다.) 이제 서버를 열고, 개발자 도구의 `Elements` 탭을 확인해보자.

<img width="500" alt="image" src="https://user-images.githubusercontent.com/53133662/158741765-7ac87041-bf5a-4955-9f37-fbc4fdc60efc.png">

- `Warpper` 컴포넌트는 JSX 코드가 요구하는 단 하나의 지시사항(하나의 root 태그로 JSX 요소를 warp 해주어야 한다)을 지켜주고 있으나 실제 `DOM`에는 렌더되고 있지 않는 것을 확인할 수 있다. 이렇듯, `Warpper`를 사용하는 것은 어쩌면 눈속임의 역할에 더 가까울 수도 있다. 하지만 앞서 `<div>` 태그로 warp 해주었을 때보다 스타일링에서도 안전하고 쓸데없는 HTML 요소들을 과하게 렌더하지 않게 되어 어플리케이션의 성능을 보장할 수 있게 된다는 점에서 꽤나 좋은 속임수라고 말할 수도 있을 것이다.

</br>

## 리액트 프래그먼트

```js
<div>
  <div>
    <div>
      <div>
        <h2>Some content.</h2>
      </div>
    </div>
  </div>
</div>
```

- `Warpper` 컴포넌트는 "`<div>` Soup" 를 만들지 않으면서도 요구사항을 충족하는 일종의 눈속임으로서 사용되었다. 사실 이는 아주 편리하고도 괜찮은 방법이기 때문에 `Warpper` 컴포넌트와 동일한 기능을 React에서 제공해주고 있다.

### 1. `<React.Fragment>`

```js
<React.Fragment>
  <h2>Hi there!</h2>
  <p>This does not work :-(</p>
</React.Fragment>
```

> `Fragment` 컴포넌트는 `React.Fragment`에서 엑세스 하거나 React에서 `Fragment`를 직접 import 해와도 된다.

### 2. `<></>`

```js
<>
  <h2>Hi there!</h2>
  <p>This does not work :-(</p>
</>
```

> `<></>`는 React를 사용한 프로젝트라면 언제든 사용 가능한 `Fragment` 컴포넌트와는 달리, 프로젝트 셋업의 빌드 워크 플로가 지원할 경우에만 가능한 방법이다.

- 이 두가지 문법 모두 비어있는 `warpper`를 렌더링하는 것과 같으며, 앞서 소개한 `Warpper` 컴포넌트처럼 `DOM`에 HTML 요소를 렌더링하지 않는 특징을 가지고 있다. 이 두가지는 내장되어 있는 기능이기에 굳이 커스텀 `Warpper`를 사용하지 않아도 충분히 JSX의 요구사항에 복무하고 있기 때문에 사용 가능하다. (다만, `Warpper` 컴포넌트는 이 내장되어 있는 두가지 기능에 대해 보다 깊은 이해를 돕는 용도로 소개되었다.)

### 사용 예시 : `<></>`

```js
return (
  <div>
    <AddUser onAddUser={addUserHandler} />
    <UsersList users={usersList} />
  </div>
);
```

- `App.js` 파일로 가서 `<div>` 태그로 warp 되어있던 부분을 모두 `<></>`로 변경해주었다.

```js
return (
  <>
    <AddUser onAddUser={addUserHandler} />
    <UsersList users={usersList} />
  </>
);
```

- `<></>`는 적합한 HTML 요소는 아니지만 모든 React 프로젝트에 적합한 JSX 코드일 것이다. 물론, `<></>`는 프로젝트 셋업의 빌드 워크 플로가 지원해주고 있을 경우에만 사용할 수 있는 React 내장 기능이다. 현재 프로젝트 셋업에서는 지원해주고 있기 때문에 `<></>` 를 사용했다. 이제 서버를 열고 개발자 도구의 `Elements` 탭을 확인해보자. `Warpper` 컴포넌트와 동일하게 JSX 코드의 요구사항을 지켜주고 있으나 실제 `DOM`에는 렌더되고 있지 않는 것을 확인할 수 있다.

### 사용 예시 : `<React.Fragment>`

```js
return (
  <>
    <AddUser onAddUser={addUserHandler} />
    <UsersList users={usersList} />
  </>
);
```

- 이번엔 `<></>`으로 warp 해주었던 부분을 다시 `<React.Fragment>`로 수정해서 감싸보자.

```js
return (
  <React.Fragment>
    <AddUser onAddUser={addUserHandler} />
    <UsersList users={usersList} />
  </React.Fragment>
);
```

- `<React.Fragment>` 태그로 사용한다면, 따로 React에서 import 해올 필요가 없지만, 깔끔하게 `Fragment`만 가져오고 싶다면

```js
import React, { useState, Fragment } from "react";

...
return (
  <Fragment>
    <AddUser onAddUser={addUserHandler} />
    <UsersList users={usersList} />
  </Fragment>
);
```

- 중괄호로 `Fragment`를 import 해온 뒤, `<Fragment>` 태그로만 사용할 수 있다.

### 정리

- 물론, 우리가 JSX 가 요구하는 단 하나의 요구사항을 지키려고 했던 모든 방법들 중 가장 첫번째로 시도했던 `Warpper` 같은 커스텀 컴포넌트는 기본적으로 직접 작성하여 사용하지는 않을 것이다. 다만 `<></>`와 `Fragment` 같은 React에서 제공하는 내장 기능들의 기본적인 원리를 이해하는 것이 무엇보다도 중요하기에 내장되어 있는 이 두가지 기능에 대해 보다 깊은 이해를 돕는 용도로 소개되었다.

</br>

## 리액트 포털 소개

- `Fragment`를 사용하면 깔끔한 코드를 작성할 수 있게 되고, 최종 페이지(`DOM`)에 불필요한 HTML 요소들이 포함되지 않는다. 그리고 React Portal 역시 이와 비슷한 역할을 하는 유용한 기능이다.

#### JSX

```js
return (
  <Fragment>
    <MyModal />
    <MyInputForm />
  </Fragment>
);
```

- React Portal의 예시가 될 JSX 코드이다. `<MyModal />`과 `<MyInputForm />` 라는 두 컴포넌트가 인접해있으며, `<Fragment>`가 이 컴포넌트들을 warp 해주고 있다. 그리고 실제 최종 `DOM`에 들어가게 되는 코드는 이런 형태를 띄게 될 것이다.

#### Real DOM

```js
return (
  <section>
    <h2>Some other content...</h2>
    // <MyModal /> //
    <div>
      <h2>A Modal Title</h2>
    </div>
    // <MyInputForm /> //
    <label>Username</label>
    <input type="text" />
  </section>
);
```

- 다른 컴포넌트에서 비롯된 `<section>`과 `<h2>` 태그가 보일 것이다. 이는 다른 컴포넌트에서 비롯된 태그들이므로 중요하지 않다. 그리고 `<MyModal />` 컴포넌트가 담고 있는 `<div>`태그와 `<h2>`가 보일 것이고, `<MyInputForm />` 컴포넌트가 담고 있는 `<label>`과 `<input>` 태그가 보일 것이다. 대체 이 코드에는 무슨 문제가 있는 것일까? 사실 기술적으로 잘못된 코드라고 말할 수는 없다. 하지만 바람직하지 못한 부분은 분명 존재하고 있다. 바로 `<MyModal />` 컴포넌트가 존재하는 위치 때문이다.

### 바람직한 코드가 아닌 이유

- `DOM`에 렌더링된 이 모달은 적절한 스타일링만 적용해주면 분명 그럴듯하게 작동이 될 것이다. 하지만 의미론적인(Semantically) 차원에서 한 번 생각해보자. 현재 간결한 HTML 구조를 갖추고 있는가? 그렇지 않을 것이다. 왜냐면 모달이라는 것은 페이지 위의 오버레이임을 고려해야 되기 때문이다. (그것도 전체 페이지를 덮는 오버레이 창이라는 것을 말이다.) 논리적으로 생각해보면 모달은 모든 코드 위에 위치해있어야 할 것이다. 모달이 만약 다른 HTML 코드와 중첩되어 있다면, 스타일링에 의해 그럴듯하게 작동은 하겠지만 좋은 코드라고 불리기에는 어딘가 부족하다. 그리고 이런 방식은 스타일링이나 접근성과 관련된 어떤 문제를 발생시킬 가능성이 있다. 예를 들면, 스크린 리더가 렌더링 되고 있는 HTML 코드를 해석하고자 할 때 일반 오버레이로 간주하지 않을 가능성이 있다. 스크린 리더에서는 CSS 스타일링이 중요한 고려 요소가 아니기 때문이다. 또한 의미론적 관점과 스트럭쳐 측면에서 생각해봤을 때 이는 HTML 코드로 짜인 구조일 것이다. 그렇기 때문에 이 모달이 다른 콘텐츠에 대한 오버레이인지도 분명하지 않게 된다. 이는 모달 뿐만 아니라, 사이드 드로어나 다이얼 로그를 비롯한 모든 종류의 오버레이와 그와 연관된 컴포넌트에 문제를 일으킬 수 있는 가능성을 제공한다. 마치 버튼을 만들 때 `<div>` 태그를 `<button>`처럼 스타일링하고 이벤트 리스너를 추가하는 방식과 비슷하다고 생각하면 된다.

```js
<div onClick={clickHandler}>Click me, I'm a bad button</div>
```

- 앞의 예시 코드처럼 스타일링이나 이벤트 리스너를 추가한 방식으로 작동은 하겠으나, 역시 좋은 방법이라고 말할 수는 없다. 접근성 측면에서도 좋지 않으며 다른 개발자가 코드를 이해하거나 손을 대기에도 진입장벽을 높게 하는 등의 단점이 많다. 일반적으로 웹 개발 측면에서 HTML, CSS, JavaScript는 포용력이 좋아 활용도가 높지만 그렇다고 해서 작동된다는 이유 하나만으로 이런 좋지 않은 방식을 고수하면 안될 것이다.
- 그리고 우리는 React 개념을 활용해서 모달과 같이 중첩되어서는 곤란한 오버레이 콘텐츠의 문제를 해결할 수 있다. 포털을 통해 우리가 원하는 방식으로 컴포넌트를 작성할 수 있도록 함으로서 데이터 전달 등에 있어 혹여나 발생할 문제들을 방지할 수 있기 때문이다. 하지만 이를 실제 `DOM`에서 다른 방식으로 렌더링을 한다면 어떨까?

#### JSX

```js
return (
  <Fragment>
    <MyModal />
    <MyInputForm />
  </Fragment>
);
```

#### Real DOM

```js
return (
  // <MyModal /> //
  <div>
    <h2>A Modal Title</h2>
  </div>
  <section>
    <h2>Some other content...</h2>
    // <MyInputForm /> //
    <label>Username</label>
    <input type="text" />
  </section>
);
```

- Real DOM 예시를 보면, 모달 HTML 콘텐츠를 일반적인 위치가 아니라 다른 곳에서 렌더링해주고 있다. 앞의 JSX 코드는 변하지 않았지만 렌더링된 HTML 코드는 JSX 코드와는 다소 다른 형태를 가지고 있는 걸 확인할 수 있다. (모달과 form이 서로 떨어져있는 형태다.) 그리고 우리는 React Portal을 통해 JSX 코드의 규칙을 지키면서도 HTML 코드를 이러한 형태로 만들 수 있게 된다.

</br>

## 리액트 포털 사용해보기

- 현재의 `AddUser.js` 컴포넌트를 살펴보면 백드롭과 모달 오버레이를 담고 있는 `ErrorModal` 컴포넌트가 다른 HTML 요소들(컴포넌트들)과 같은 위치에서 렌더링되고 있음을 확인할 수 있다.

#### `AddUser.js`

```js
<React.Fragment>
  {error && (
    <ErrorModal
     ...
    />
  )}
  <Card className={classes.input}>
    ...
  </Card>
</React.Fragment>
```

#### 개발자 도구 : `Elements`

<img width="500" alt="image" src="https://user-images.githubusercontent.com/53133662/158797326-2a399764-6dd6-492e-9734-a8b821e06636.png">

- 이 어플리케이션은 크지 않기 때문에 그다지 큰 문제가 되지 않을 수도 있다. 하지만 어떤 어플리케이션에서는 `AddUser` 컴포넌트가 어플리케이션의 최상단과 가깝지 않으며, 다른 컴포넌트와 깊이 중첩되어 있어서 백드롭과 모달 오버레이 또한 `DOM` 내의 다른 콘텐츠와 깊게 중첩될 수 있을지도 모른다. 이때는 어떻게 해야할까?

### 리액트 포털

- `body` 바로 아래에 백드롭을 놓아서 `body`의 직계 자식으로 만들고, 모달 오버레이 역시 `body`의 직계 자식으로서 나머지 어플리케이션을 포함하는 root `div` 옆에 배치할 수 있다면, 앞서 거론된 문제를 해결할 수 있을지도 모른다. 그리고 React 에서는 React Portal을 이용하여 이런 기능을 구현할 수 있게 되어있다.

### 리액트 포털에 필요한 두가지

- React Portal 기능을 사용하기 위해서는 일단 두가지가 필요하다. 첫번째로 먼저 컴포넌트를 이식할 "위치"가 필요하며, 두번째로는 해당 위치에 Potal이 필요함을 "컴포넌트에게 알려야" 한다. 먼저, 첫번째의 요소(컴포넌트를 이식할 "위치"를 확인)를 갖추기 위해 우리가 해야할 일은 `public` 폴더에 있는 `index.html`로 이동하는 것이다.

#### index.html

```html
<body>
  ...
  <div id="root"></div>
</body>
```

- `index.html`를 보자. `index.html`에서는 보통 `<div>`와 `id`를 함께 추가해서 `index.js`에서 이것을 다시 찾아올 수 있도록 만들어준다.

#### index.js

```js
ReactDOM.render(<App />, document.getElementById("root"));
```

- `index.html`으로 돌아가, 백드롭과 모달 오버레이를 같은 방식으로 찾을 수 있도록 `<div>`와 `id`를 함께 추가해보자.

```html
<body>
  ...
  <div id="backdrop-root"></div>
  <div id="overlay-root"></div>
  <div id="root"></div>
</body>
```

- 백드롭을 찾아올 수 있도록 `<div id="backdrop-root"></div>`를 추가했고, 모달 오버레이도 같은 방식으로 추가했다. 이제 다시 `ErrorModal` 컴포넌트로 돌아가보자.

#### `ErrorModal.js`

```js
<React.Fragment>
  <div className={classes.backdrop} onClick={props.onConfirm} />
  <Card className={classes.modal}>
    <header className={classes.header}>
      <h2>{props.title}</h2>
    </header>
    <div className={classes.content}>
      <p>{props.message}</p>
    </div>
    <footer className={classes.actions}>
      <Button onClick={props.onConfirm}>Okay</Button>
    </footer>
  </Card>
</React.Fragment>
```

- 먼저 Portal을 사용하기 위해 필요한 두가지 요소 중 두번째 요소 즉, 해당 위치에 Potal이 필요함을 "컴포넌트에게 알려야" 하는 작업이 필요하다. 현재 백드롭을 담당하고 있는 `<div>` 태그 라인을 다른 곳에 이식해야 한다고 React에게 알려줄 생각이다.

#### `ErrorModal.js`

```js
const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onConfirm} />;
};

const ModalOverlay = (props) => {
  return (
    <Card className={classes.modal}>
      <header className={classes.header}>
        <h2>{props.title}</h2>
      </header>
      <div className={classes.content}>
        <p>{props.message}</p>
      </div>
      <footer className={classes.actions}>
        <Button onClick={props.onConfirm}>Okay</Button>
      </footer>
    </Card>
  );
};

const ErrorModal = (props) => {
  <React.Fragment></React.Fragment>;
};
```

- `ErrorModal` 컴포넌트가 위치하고 있는 `ErrorModal.js` 파일에서 `Backdrop` 컴포넌트를 생성한다. (이 백드롭 컴포넌트를 모달 오버레이 컴포넌트와 함께 사용하고 있기 때문이다) 그리고 원래는 `ErrorModal` 컴포넌트 안에 위치해있던 백드롭 코드를 긁어와 return 해줄 수 있도록 한다. 마찬가지로 모달 오버레이 역시 해당하는 코드 블럭들을 긁어와서 `ModalOverlay` 컴포넌트를 생성하여 return 할 수 있도록 해준다. 이렇게 모달을 2개의 컴포넌트(`Backdrop`, `ModalOverlay`)로 분리하면서 간편하게 포털을 다룰 수 있게 되었다.

```js
const ErrorModal = (props) => {
  <React.Fragment>{}</React.Fragment>;
};
```

- 2개의 컴포넌트(`Backdrop`, `ModalOverlay`)를 감싸고 있던 `<React.Fragment>` 사이에 `{}` 중괄호를 넣어준다. JSX 코드이기 때문에 표현식을 추가할 수 있기 때문이다.

### ReactDOM

- React는 상태 관리 등을 비롯한 React의 모든 기능이 존재하는 라이브러리이다. 그리고 `ReactDOM`은 React를 사용하여 각종 기능들을 웹 브라우저로 가져올 수 있는 역할을 한다. 즉, React를 `DOM`과 호환되도록 만들어주는 것이다. 바꿔 말하자면, React 라이브러리 자체는 React를 `DOM`이 있는 환경에서 실행하는지, 혹은 네이티브 앱을 만드는 데 사용하는지에 대해서는 관심이 없다는 이야기다. 단순히 말하자면, `ReactDOM`은 브라우저에 대한 React의 어댑터라고 이해하면 될 것이다. 아무튼 이제, 우리가 설정한 2개의 컴포넌트(`Backdrop`, `ModalOverlay`)를 `DOM` 내의 다른 위치로 이식하기 위해서 `ReactDOM`으로부터 import를 해줘야 한다.

```js
import ReactDOM from "react-dom";
```

- 이제 `ReactDOM` 에서 `createPortal` 메소드를 사용할 수 있게 되었다.

```js
<React.Fragment>
  {ReactDOM.createPortal(
    <Backdrop />,
    document.getElementById("backdrop-root")
  )}
</React.Fragment>
```

- 중괄호 `{}` 안에 `ReactDOM`에서 `createPortal()` 메소드를 불러온다. `createPortal()` 메소드는 2개의 인수가 필요한데, 첫번째 인수는 렌더링 되어야 하는 React 노드(반드시, JSX 형태여야 한다.)이고 두번째 인수는 첫번째 인수가 렌더링 되어야 하는 실제 `DOM` 안의 컨테이너를 가리키는 포인터이다. 우리는 `<Backdrop>` 컴포넌트를 `index.html`의 `<div>` 태그에서 `backdrop-root`이라는 `id`를 가진 컨테이너로 이식시켜줄 것이기 때문에 `document.getElementById()`로 `backdrop-root`를 포인터 시켜주었다.

#### 예시) `index.js`

```js
ReactDOM.render(<App />, document.getElementById("root"));
```

> `index.js` 에서도 `ReactDOM`의 `render` 메소드를 통해 root 컴포넌트(`<App />`)를 `getElementById`가 선택한`id` 위치로 렌더링한 것을 알 수 있다.

- 다시 `ErrorModal.js`로 돌아와 `ModalOverlay` 컴포넌트도 새로운 중괄호 `{}`를 생성하여, `Backdrop`을 이식시켜준 방식으로 동일하게 작성한다.

```js
<React.Fragment>
  {ReactDOM.createPortal(
    <Backdrop />,
    document.getElementById("backdrop-root")
  )}
  {ReactDOM.createPortal(
    <ModalOverlay />,
    document.getElementById("overlay-root")
  );
  }
</React.Fragment>
```

### props pass 해주기

- 우리가 이전에, `ModalOverlay`와 `Backdrop` 컴포넌트에 props로 전달해주었던 Property 역시 동일하게 전달하여 해당 컴포넌트에서 사용할 수 있도록 추가해준다.

```js
{
  ReactDOM.createPortal(
    <Backdrop onConfirm={props.onConfirm} />,
    document.getElementById("backdrop-root")
  );
}
{
  ReactDOM.createPortal(
    <ModalOverlay
      onClick={props.onConfirm}
      title={props.title}
      message={props.message}
      onConfirm={props.onConfirm}
    />,
    document.getElementById("overlay-root")
  );
}
```

#### 개발자 도구 : `Elements`

<img width="500" alt="image" src="https://user-images.githubusercontent.com/53133662/159008311-7aaf879b-20d1-4b6b-86bb-4e8915c3b1d2.png">

- 저장하고 라이브 서버를 열어 확인해보면 `ModalOverlay`와 `Backdrop` 컴포넌트가 제대로 작동되고 있음을 알 수 있다. 다시 `Elements` 탭을 확인해보자. 이제 JSX 코드 어디에서 `ErrorModal`을 쓰든지 관계 없이 `ModalOverlay`와 `Backdrop` 컴포넌트는 이식한 그 위치에 그대로 있을 것이다.

![Working with Portals](https://user-images.githubusercontent.com/53133662/158755090-78af5c36-84b1-4b8d-9829-f16619effe01.gif)

### 정리

- `ReactDOM.createPortal`는 JSX 코드를 사용할 수 있는 곳에서는 언제든지 사용할 수 있다. (물론 JSX 코드 내에서 중괄호 `{}`를 사용하여 표현식을 사용할 수 있도록 작업해주어야 한다.) 이렇듯, `createPortal`를 사용해서 컴포넌트의 HTML 컨텐츠를 `DOM`이 렌더링 되고 있는 다른 위치에 옮길 수 있으며, 동시에 JSX와 컴포넌트 내에서는 전과 동일한 방식으로 컴포넌트 작업을 이어갈 수 있다.

</br>

## ref로 작업하기

- 이제 `Fragment`와 `Portal`이라는 2개의 멋진 기능을 이용하여 HTML 코드를 깔끔하게 작성할 수 있게 되었다. 물론 앱의 작동 방식은 여전히 동일하지만 이 두가지 기능들을 다양하게 사용함으로써 의미론적으로 더욱 정확한 코드를 쓸 수 있게 된 것이다. 또한, 앱에 대한 접근성을 높이고 불필요하게 많은 `<div>`를 남발하여 렌더링하지 않을 수 있게 된 것이다. 앞으로 `Fragment`와 `Portal`과는 조금 다른 역할을 하면서도 동시에 더 좋은 코드를 사용할 수 있게끔 해주는 기능을 알아보려고 한다. 바로 `ref` 라는 기능이다.

### ref 란 무엇인가?

- `ref`는 레퍼런스(reference)를 뜻하며 React에서는 그냥 `ref`라고 불리고 있다. `ref`의 역할을 단순하게 설명하자면, `ref`는 기본적으로 다른 `DOM` 요소로 엑세스해서 작업할 수 있게 해준다. 이게 무슨 뜻일까? 앞으로 `AddUser` 컴포넌트와 함께 살펴보면서 `ref`가 대체 어떤 역할로서 기능하고 있는지 한 번 알아볼까 한다.

#### `AddUser.js`

```js
const [enteredUsername, setEnteredUsername] = useState("");
const [enteredAge, setEnteredAge] = useState("");

const addUserHandler = (event) => {
  event.preventDefault();

  if (enteredUsername.trim().length === 0 || enteredAge.trim().length === 0) {
    setError({
      title: "Invalid input",
      message: "Please enter a valid name and age (non-empty values).",
    });
    return;
  }
  if (+enteredAge < 1) {
    setError({
      title: "Invalid age",
      message: "Please enter a valid age (> 0).",
    });
    return;
  }

  props.onAddUser(enteredNameValue, enteredUserAgeValue);
  setEnteredUsername("");
  setEnteredAge("");
};

const usernameChangeHandler = (event) => {
  setEnteredUsername(event.target.value);
};
const ageChangeHandler = (event) => {
  setEnteredAge(event.target.value);
};

return (
  ...
    <input
      id="username"
      type="text"
      value={enteredUsername}
      onChange={usernameChangeHandler}
    />
    ...
    <input
      id="age"
      type="number"
      value={enteredAge}
      onChange={ageChangeHandler}
    />
  ...
  );
```

- `AddUser` 컴포넌트를 살펴보면, `userName`과 `userAge`를 입력하는 `<input>`이 각각 존재하며, `onChange` 이벤트 함수로 `<input>`에 입력하는 value를 추적-업데이트 하여 각각의 상태(`enteredUsername`, `enteredAge`)로 관리해주고 있는 걸 볼 수 있다. 이런 상태(state)를 업데이트하는 방식으로 `userName`과 `userAge`를 관리해도 충분히 괜찮을 것이라는 것을 우리 모두는 이미 알고 있을 것이다. 하지만 `form`의 value 값을 제출하기만 하면 되는데 `key` 입력마다 상태(state)를 업데이트하는 건 다소 과한 느낌이 드는 건 사실이다. 그리고 이런 경우에 바로 `ref`라는 기능이 우리에게 도움을 줄 수 있다.

### ref 는 어떻게 작동할까?

- `ref`를 사용하면, 연결을 만들 수 있다. 즉, 렌더링 될 HTML 요소와 JavsScript 코드를 연결할 수 있도록 도와준다는 이야기다. 이를 더 정확하게 이해하기 위해서 `ref`를 한 번 사용해보자.

```js
import React, { useRef, useState } from "react";

...
useRef();
```

- `ref`를 사용하기 위해서는 먼저 React로부터 `useRef`를 import 해야만 한다.
  > `useRef`은 React Hook 이기 때문에 반드시 함수형 컴포넌트 안에서만 사용할 수 있다.
- `useRef`은 무엇을 반환하고, 어떤 값을 취할까? `useRef()`는 초기 설정 디폴트 값을 취하는 형태이지만 지금 현재의 기능에서는 필요치 않기 때문에 비워준다. 그리고 `useRef()`는 어떤 값을 반환하는데 바로 이 `useRef()`가 반환하는 값을 통해서 나중에 이 `useRef()`를 활용할 수 있게 되며 연결한 HTML 요소(element)에 접근하여 작업할 수 있다.

```js
import React, { useRef, useState } from "react";

...
const nameInputRef = useRef();
const ageInputRef = useRef();
```

- 우리는 `userName`과 `userAge`를 입력하고 관리할 두개의 `<input>` HTML 요소와 연결할 것이기 때문에 각각의 `useRef` 값을 상수로 선언해주었다. (초기 설정 디폴트 값이 필요하지만 여기서는 필요없기 때문에 정의하지 않았다.) 이제 이 두개의 `ref`를 각각의 `<input>` HTML 요소와 연결해야 한다.

```js
  // userName input
  <input
    id="username"
    type="text"
    ...
    ref={nameInputRef}
  />
  // userAge input
  <input
    id="age"
    type="number"
    ...
    ref={ageInputRef}
  />
```

- `<input>` HTML 요소로 이동하여, 특별한 prop을 추가했다. 바로 `ref` prop 말이다.

  > `ref` prop 은 `key` prop 과 마찬가지로 내장 prop 이며, HTML 요소라면 추가할 수 있는 속성이다. 어떤 HTML 요소든 하나의 레퍼런스와 연결하는 게 가능하기 때문이다. 또한, input 의 데이터를 가져오기 위해서 `ref` prop 을 사용하는 경우는 아주 흔한 편이다.

- 이제 `<input>` HTML 요소에 `ref` prop 을 추가하고, 각각 `nameInputRef`와 `ageInputRef` 값으로 연결시켜 준다. 이제 `nameInputRef`와 `ageInputRef`로 각각 연결된 `<input>` HTML 요소를 JavaScript 코드를 사용해서 접근하거나 관리할 수 있게 되었다. React가 이 `AddUser` 컴포넌트의 JSX 코드들을 렌더링 할 때, `nameInputRef`와 `ageInputRef`에 저장된 값들을 연결된 `<input>`에 근거해 렌더링 된 네이티브 `DOM` 요소에 세팅할 것이다. `nameInputRef`와 `ageInputRef` 안의 최종 데이터가 실제 `DOM` 요소가 될 것이라고 생각하면 된다. 이제 연결되었다는 걸 확인해보기 위해 `<input>` 데이터 제출 함수인 `addUserHandler()` 내부에서 `nameInputRef`를 콘솔로 출력해보았다.

```js
const addUserHandler = (event) => {
  event.preventDefault();
  console.log(nameInputRef);
 ...
};
```

![console.log(nameInputRef)](https://user-images.githubusercontent.com/53133662/159108054-93f0c0de-cc72-45d5-b49e-28592832ddde.png)

- Add User 버튼을 클릭하여 `addUserHandler()` 이벤트 함수가 발생하면 console에 `nameInputRef`의 값이 객체 형태로 출력되고 있음을 확인할 수 있다. 이 객체를 살펴보면 current 속성을 가지고 있는 듯이 보이는데, 이는 연결된 `ref` 값은 항상 객체이며 동시에 current prop(`ref`가 연결된 실제 값)을 가지고 있다는 걸 의미한다.

<img width="500" alt="image" src="https://user-images.githubusercontent.com/53133662/159113354-a174919c-5a17-4226-9be6-3f35b55f888d.png">

> current 에 저장된 것들은 어떤 이론 적인 차원의 값이 아니라, 실제 `DOM` 노드이다. `DOM`은 직접 조작하면 안되며, 다만 React에 의해서만 조작되어야 한다. (이러한 까다로운 작업을 편리하게 하고자 React를 사용하는 것이기 때문이다.)

```js
const addUserHandler = (event) => {
  event.preventDefault();
  console.log(nameInputRef.current.value);
 ...
};
```

- `nameInputRef`으로 `<input>`에 접근할 수 있게 되었으니 당연히 `nameInputRef`에 저장된 `<input>`의 현재 값, 즉 current value를 읽어올 수도 있을 것이다. JavaScript에서 모든 `<input>` 요소는 value 속성을 가지고 있기 때문이다.

![console.log(nameInputRef.current.value)](https://user-images.githubusercontent.com/53133662/159108377-39793d30-3020-475f-af80-47224316a03c.gif)

- `<input>` 요소에 입력하고 제출한 값이 `nameInputRef.current.value` 로 접근했을 때도 동일하게 콘솔에 출력되고 있음을 확인할 수 있다. 그리고 이는 모든 `key` 입력을 `log`로 출력하지 않더라도 `<input>` 요소에 저장된 값(value)에 엑세스할 수 있음을 뜻할 것이다. 상태(state)로 접근하고 관리하지 않더라도 말이다.

```js
const enteredNameValue = nameInputRef.current.value;
const enteredUserAgeValue = ageInputRef.current.value;
```

- 이제 각각의 `<input>` 요소에 입력하고 제출한 가장 최신의 값(`current.value`)을 연결한 `ref`를 통해 받아올 수 있도록 상수를 생성한다.

```js
const addUserHandler = (event) => {
  event.preventDefault();

  const enteredNameValue = nameInputRef.current.value;
  const enteredUserAgeValue = ageInputRef.current.value;

  if (
    enteredNameValue.trim().length === 0 ||
    enteredUserAgeValue.trim().length === 0
  ) {
    ..
  }
  if (+enteredUserAgeValue < 1) {
   ...
  }

  props.onAddUser(enteredNameValue, enteredUserAgeValue);

  setEnteredUsername("");
  setEnteredAge("");
};
```

- 그리고, 각각의 개별 상태(state)로 접근하여 작성해주었던 조건식들을 모두 `ref.current.value`로 접근한 상수로 수정해준다. 그리고 마지막으로 `props.onAddUser()`로 최종 값들을 pass 하여 제출할 수 있도록 해준다.

```js
const addUserHandler = (event) => {
  ...
  nameInputRef.current.value = "";
  ageInputRef.current.value = "";
}
```

- `<input>` 값들을 상태(state) 업데이트 함수를 사용하여 다시 리셋해주었던 로직도 `ref.current.value`을 빈 문자열로 할당하여 수정해준다.

  > `ref.current.value`을 사용해서 빈 문자열을 할당하여 리셋하는 방식은 자주 사용하는 방법도 아니며 React 없이 `DOM`을 조작해서는 안되지만, 단지 유저가 입력한 값을 리셋하기 위해서라면 한 번쯤은 고려해볼 수 있는 방법이다.

- 이제 상태(state)를 통하여 `<input>` 요소의 값들에 접근하거나 변경해주지 않아도 되므로, `enteredUsername` 와 `enteredAge` 같은 상태(state)를 비롯한 이 상태(state)를 이용해서 `<input>` 요소에 접근한 모든 이벤트 핸들러 로직들(`usernameChangeHandler()`, `ageChangeHandler()`)을 전부 삭제해준다. 물론, 상태(state)와 `<input>` 요소를 연결한 속성(`value`, `onChange`)도 마찬가지로 삭제해준다. 이제 라이브 서버를 작동시키면, 상태(state)를 사용하던 때와 동일하게 동작하고 있음을 확인할 수 있다.

### 정리

- 앞에서 누누히 말했다시피, `ref`로 `DOM`을 조작하는 경우는 아주 드문 일이다. 현재 `ref`를 사용하고 있는 방식을 살펴보면 `DOM`을 조작하거나 새로운 요소를 추가하는 것이 아니며, 단지 유저가 입력한 값을 바꾸거나 읽어오고 있을 뿐이다. 일반적으로 `ref`와 상태(state) 중 뭐가 더 나은 방식인지 고르는 것은 그다지 중요하지 않다. (사실 무엇을 써도 괜찮기 때문이다.) 하지만 어떤 유스 케이스 에서는 `DOM`을 조작하지 않고, 그저 현재 값을 신속하게 읽기만 해도 되는 경우가 있기 때문에 굳이 상태(state)를 사용할 필요가 없을 것이다. 또한 단지 `key` 로그용으로 상태(state)를 사용하는 것은 보통 나쁜 코드라고 이야기하기도 한다. 이때 상태(state)의 대체제로 `ref`를 사용함으로써 `DOM`을 조작하지 않고서 다만 신속하게 값을 읽어오면서도 전체 코드량을 상대적으로 줄일 수 있는 것이다. 물론 현재 어플리케이션의 케이스에서는 취향의 차이일 뿐일지도 모른다. 다만, 앞으로 어떤 케이스냐에 따라 달라질 것이기 때문에 여러가지를 고려하여 선택해서 사용하면 개발자로서 더 좋은 코드를 작성할 수 있을 것이다.

</br>

## 제어되는 컴포넌트와 제어되지 않는 컴포넌트

- 지금까지 user의 `<input>`에 엑세스하는 방법으로 `ref`를 활용해보았다. 또한 `ref.current.value = "";` 를 사용하여 `<input>` 필드를 조작하고 리셋하기도 하였다. 이렇듯 `ref`를 사용해서 `DOM` 요소(`<input>`)들과 상호작용하는 방식에는 특별한 용어가 붙는다. `ref`를 통해 값value 에 접근하는 방식을 바로 "비제어 컴포넌트" 라고 한다.

### 비제어 컴포넌트

```js
  // userName input
  <input
    id="username"
    type="text"
    ref={nameInputRef}
  />
  // userAge input
  <input
    id="age"
    type="number"
    ref={ageInputRef}
  />
```

- 여기 존재하는 `<input>` 컴포넌트틀은 "비제어 컴포넌트"에 해당한다. 이들의 내부 상태 즉, 내부에 반영된 값들이 React에 의해서 제어되고 있는 게 아니기 때문이다. 단지 우리는 `<input>`의 디폴트 값에 의존하고 있을 뿐이다. 그러니까 유저가 어떤 값을 `<input>`에 입력하면 그 값이 반영되고 있을 뿐이다. 물론 React 기능(`useRef`)을 통해서 값을 가져오고 있기는 하지만 데이터를 `<input>`에 다시 피드백하지는 않는다.

```js
nameInputRef.current.value = "";
ageInputRef.current.value = "";
```

- `<input>` 값을 리셋하기 위해서 임시방편으로 `<input>`에 대해 새로운 값을 할당하긴 하지만 React를 사용하여 `DOM`을 제어하고 있지는 않음을 알 수 있다. 이러한 방식은 단지 `ref`를 사용하여 네이티브 `DOM` 요소에 대한 엑세스를 얻은 뒤, 일반 `DOM` API를 사용해서 `<input>`의 `DOM` 노드 값을 다시 세팅하고 있을 뿐이다. 그리고 이런 이유로 인해서 바로 "비제어" 라는 말이 붙는 것이다. `ref`를 사용하기 전의 방식처럼, React를 통해서 `<input>` 요소의 상태(state)를 제어하고 있지 않기 때문이다.

  > 일반적으로 input 컴포넌트와 form 컴포넌트에 대해 논의가 필요할 때 제어와 비제어 라는 용어가 필연적으로 등장하게 된다. 왜냐하면 input과 form 컴포넌트는 브라우저에 의해 태생적으로 내부의 상태를 갖게 되기 때문이다. 우리가 input 요소를 구성해서 유저의 input을 가져오고, 저장해서 반영하는 작동 방식을 생각해본다면 왜 브라우저에 의해 태생적으로 내부의 상태를 갖게 되는지에 대해 이해하기가 쉬울 것이다. 이렇듯 React 앱의 컴포넌트를 다룰 때에는 React 상태(state)를 컴포넌트와 연결해야 한다. 그래서 일반적으로 React의 input 컴포넌트를 다룰 때, 제어/비제어 라는 용어가 필연적으로 등장하게 되는 것이다.

### 제어 컴포넌트

```js
const [enteredUsername, setEnteredUsername] = useState("");
const [enteredAge, setEnteredAge] = useState("");
...
return (
  ...
    <input
      id="username"
      type="text"
      value={enteredUsername}
      onChange={usernameChangeHandler}
    />
    ...
    <input
      id="age"
      type="number"
      value={enteredAge}
      onChange={ageChangeHandler}
    />
  ...
  );
```

- `ref`를 사용하기 이전의 방식에 대해 다시 생각해보자. 상태(state)로 관리하면서 `key` 입력에 따라서 업데이트했고 업데이트한 최종 상태(state)를 prop을 통해서 다시 `<input>` 요소에 피드백 해주었다. 이런 방식은 "제어된" 방식에 해당한다. 그리고 상태(state)를 통해서 관리해왔던 `<input>`을 바로 "제어된 컴포넌트" 라고 부른다. (내부 상태가 React에 의해서 제어되고 있기 때문이다.)

### 정리

- 제어/비제어 컴포넌트 같은 용어는 React 어플리케이션을 개발하면서 꽤나 중요한 축에 속한다. 다른 React 개발자들과 원활한 논의가 필요할 때 반드시 알아야 하는 용어이기 때문이다. 그만큼 React와 관련하여 자주 등장하는 용어이기에 이를 이해하고 사용하는 것이 무엇보다도 중요할 것이다.

</br>
