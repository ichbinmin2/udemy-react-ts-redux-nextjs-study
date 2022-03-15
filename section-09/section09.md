# Diving Deeper: Working with Fragments, Portals & "Refs"

## 목차

- [JSX Limitations & Workarounds](#JSX-제한-사항-및-해결-방법)

### JSX 제한 사항 및 해결 방법

#### JSX는 하나 이상의 root JSX element를 가질 수 없다.

- JSX

```js
return (
    <h2>Hi there!</h2>
    <p>This does not work :-(</p>
)
```

- JavaScript

```js
return (
    React.createElement('h2', {}, "Hi there!")
    React.createElement('p', {}, "This does not work :-('")
);
```

- 유효하지 않는 JavaScript 이기 때문이다.

- JSX

```js
return (
  <div>
    <h2>Hi there!</h2>
    <p>This does not work :-(</p>
  </div>
);
```

- JSX Element를 `<div>` 로 warp 해서 해결할 수 있다. `<div>`로 warp을 했다면, return 하는 JSX는 하나의 root 요소만 가지게 되는 것이다.

### 새로운 문제 : `<div> Soup`
