# Diving Deeper: Working with Fragments, Portals & "Refs"

## 목차

- [JSX Limitations & Workarounds](#JSX-제한-사항-및-해결-방법)
- [Creating a Wrapper Component](#컴포넌트-감싸기-wrapper-만들기)
- [React Fragments](#리액트-프래그먼트)
- [Introducing React Portals](#리액트-포털-소개)

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

- 앞서 소개한 `<div>`로 warp을 하는 방법 외에도 JSX 코드 블럭을 감싸주는 여러 방법들이 있다. 먼저, components 폴더에 `Helters`라는 폴더를 만들고, `Warpper.js`를 생성한다.

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

- `Warpper` 컴포넌트는 "`<div>` Soup" 를 만들지 않으면서도 요구사항을 충족하는 일종의 눈속임으로서 사용되었다. 사실 이는 아주 편리하고도 괜찮은 방법이기 떄문에 `Warpper` 컴포넌트와 동일한 기능을 React에서 제공해주고 있다.

### `<React.Fragment>`

```js
<React.Fragment>
  <h2>Hi there!</h2>
  <p>This does not work :-(</p>
</React.Fragment>
```

> `Fragment` 컴포넌트는 `React.Fragment`에서 엑세스 하거나 React에서 `Fragment`를 직접 import 해와도 된다.

### `<></>`

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

- 다른 컴포넌트에서 비롯된 `<section>`과 `<h2>` 태그가 보일 것이다. 이는 다른 컴포넌트에서 비롯된 태그들이므로 중요하지 않다. 그리고 `<MyModal />` 컴포넌트가 담고 있는 `<div>`태그와 `<h2>`가 보일 것이고, `<MyInputForm />` 컴포넌트가 담고 있는 `<label>`과 `<input>` 태그가 보일 것이다. 이 코드들은 무슨 문제가 있을까? 사실 기술적으로 잘못된 것은 없는 코드이다. 하지만 바람직하지 못한 부분이 존재하고 있다. 바로 `<MyModal />` 컴포넌트가 존재하는 위치 때문이다. `DOM`에 렌더링된 이 모달은 적절한 스타일링만 적용해주면 분명 그럴듯하게 작동이 될 것이다. 하지만 의미론적인(Semantically) 차원에서 한 번 생각해보자. 현재 간결한 HTML 구조를 갖추고 있는가? 그렇지 않을 것이다. 왜냐면 모달이라는 것은 페이지 위의 오버레이임을 고려해야 되기 때문이다. 그것도 전체 페이지를 덮는 오버레이 창이라는 것을 말이다. 논리적으로 생각해보면 모달은 모든 코드 위에 위치해있어야 할 것이다. 모달이 만약 다른 HTML 코드와 중첩되어 있다면, 스타일링에 의해 그럴듯하게 작동은 하겠지만 좋은 코드라고 불리기에는 어딘가 부족하다. 그리고 이런 방식은 스타일링이나 접근성과 관련된 어떤 문제를 발생시킬 가능성이 있다. 예를 들면, 스크린 리더가 렌더링 되고 있는 HTML 코드를 해석하고자 할 때 일반 오버레이로 간주하지 않을 가능성이 있다. 스크린 리더에서는 CSS 스타일링이 중요한 고려 요소가 아니기 때문이다. 또한 의미론적 관점과 스트럭쳐 측면에서 생각해봤을 때 이는 HTML 코드로 짜인 구조일 것이다. 그렇기 때문에 이 모달이 다른 콘텐츠에 대한 오버레이인지도 분명하지 않게 된다. 이는 모달 뿐만 아니라, 사이드 드로어나 다이얼 로그를 비롯한 모든 종류의 오버레이와 그와 연관된 컴포넌트에 문제를 일으킬 수 있는 가능성을 제공한다. 마치 버튼을 만들 때 `<div>` 태그를 `<button>`처럼 스타일링하고 이벤트 리스너를 추가하는 방식과 비슷하다.

```js
<div onClick={clickHandler}>Click me, I'm a bad button</div>
```

- 앞의 예시 코드처럼 스타일링이나 이벤트 리스너를 추가한 방식으로 작동은 하겠으나, 역시 좋은 방법이라고 말할 수는 없다. 접근성 측면에서도 좋지 않으며 다른 개발자가 코드를 이해하거나 손을 대기에도 진입장벽을 높게 하는 등의 단점이 많다. 일반적으로 웹 개발 측면에서 HTML, CSS, JavaScript는 포용력이 좋아 활용도가 높지만 그렇다고 해서 작동된다는 이유 하나만으로 이런 좋지 않은 방식을 고수하면 안될 것이다. 이렇게 React 개념을 활용해서 모달과 같이 중첩되어서는 곤란한 오버레이 콘텐츠의 문제를 해결할 수 있다. 그리고 포털을 통해 우리가 원하는 방식으로 컴포넌트를 작성할 수 있도록 함으로서 데이터 전달 등에 있어 혹여나 발생할 문제들을 방지할 수 있게 된다. 하지만 이를 실제 `DOM`에서 다른 방식으로 렌더링을 한다면 어떨까?

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

- Real DOM 예시를 보면, 모달 HTML 콘텐츠를 일반적인 위치가 아니라 다른 곳에서 렌더링해주고 있다. 앞의 JSX 코드는 변하지 않았지만 렌더링된 HTML 코드는 JSX 코드와는 다소 다른 형태를 가지고 있는 걸 확인할 수 있다. (모달과 form이 서로 떨어져있는 형태다.) 그리고 우리는 React Portal을 통해 JSX 코드의 규칙을 지키면서도 HTML 코드를 이러한 방식으로 만들 수 있다.

</br>
