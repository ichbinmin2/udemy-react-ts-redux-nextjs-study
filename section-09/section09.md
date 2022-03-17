# Diving Deeper: Working with Fragments, Portals & "Refs"

## 목차

- [JSX Limitations & Workarounds](#JSX-제한-사항-및-해결-방법)
- [Creating a Wrapper Component](#컴포넌트-감싸기-wrapper-만들기)

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

- `Warpper` 컴포넌트는 기본적으로 비어있는 컴포넌트이다. `props.children`로 받아온다는 계획만 있고, 실제로 이 커스텀 컴포넌트를 어떤 컨텐츠 태그를 감싸는 데에 사용하지 않으면 그저 빈 컴포넌트라는 이야기다. 실제로 `Warpper` 컴포넌트로 `AddUser` 컴포넌트의 JSX 코드 블럭들을 warp 해주니 앱은 제대로 작동하게 된다. 여기서 `<div>` 태그로 warp 해주는 방법과 다른 지점은 `Warpper` 컴포넌트로 감싸는 요소는 `DOM`에 렌더되지 않는다는 것이다. JSX 코드 블럭이 요구했던 사항에 대해서 생각해보자. JSX 코드는 반드시 하나의 root 컴포넌트가 `DOM`에 렌더되어야 한다. 그런데, `DOM`에 렌더되지는 않지만 하나의 root 컴포넌트가 반환될 수 있는 그 역할을 `Warpper` 컴포넌트가 해주고 있는 것이다. (그리고 이것은 JavsScript의 기술적인 요구사항을 지켜주는 방법이다.) 이제 서버를 열고, 개발자 도구의 `Element` 탭을 확인해보자.

<img width="1009" alt="image" src="https://user-images.githubusercontent.com/53133662/158741765-7ac87041-bf5a-4955-9f37-fbc4fdc60efc.png">

- `Warpper` 컴포넌트는 JSX 코드가 요구하는 단 하나의 지시사항(하나의 root 태그로 JSX 요소를 warp 해주어야 한다)가을 지켜주고 있으나 실제 `DOM`에는 렌더되고 있지 않는 것을 확인할 수 있다. 사실 `Warpper`를 사용하는 것은 어쩌면 눈속임을 해주는 것에 더 가깝지만, 앞서 `<div>` 태그로 warp 해주었을 때보다 스타일링에서도 안전하고 쓸데없는 HTML 요소들을 과하게 렌더하지 않게 되어, 어플리케이션의 성능을 보장할 수 있게 된다.

</br>
