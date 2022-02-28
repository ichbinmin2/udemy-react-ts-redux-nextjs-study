# React State & Working With Events

## 목차

- [Listening to Events & Working with Event Handlers](#이벤트-리스닝-및-이벤트-핸들러-수행하기)

</br>

## 이벤트 리스닝 및 이벤트 핸들러 수행하기

- [MDN 문서 참조: HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement)
- [MDN 문서 참조: Element](https://developer.mozilla.org/ko/docs/Web/API/Element)
- `div`, `h2`, `button` 등과 같은 전체 내장 HTML 요소에는 listen 할 수 있는 모든 네이티브 DOM Event에 모두 접근할 수 있다.
- React는 모든 Event에 `on`으로 시작하는 `prop`으로 노출된다.

```js
<button onClick={}>Change Title</button>
```

- `onClick` 이벤트는 `button`을 클릭할 때 이벤트 listener를 추가해주는 역할을 한다.
- `onClick` 이벤트의 값은 매우 중요하며, click이 발생할 때 실행되는 코드여야 한다.

```js
<button
  onClick={() => {
    console.log("clicked!");
  }}
>
  Change Title
</button>
```

- 이벤트 핸들러 `props`는 함수를 값으로 필요로 하며, `onClick`을 값으로 pass하는 함수를 포함한 모든 ` on``props `는 그 이벤트가 발생하면 실행되는 방식으로 이뤄진다.
- `onClick` 이벤트의 값으로 즉시 실행 함수를 넣어도 되지만, 보통 JSX 블록 즉 JSX 코드 안에 코드를 많이 작성하는 것은 그다지 좋은 방법이 아니다.
- `onClick` 이벤트의 값으로 즉시 실행 함수를 넣어주는 대신 return 하기 전에 동일한 실행 결과를 얻는 함수를 정의해주고,

```js
const clickHandler = () => {
  console.log("Clicked!");
};
```

- `onClick` 이벤트의 값으로 해당 함수를 지정(point)하는 방식을 취하는 게 좋다.

```js
<button onClick={clickHandler}>Change Title</button>
```

- `onClick` 이벤트의 값으로 함수를 지정(point)하면서 `()`를 덧붙이지 않은 이유는 만약 `clickHandler()`로 괄호를 덧붙인다면 `onClick` 이벤트가 실행되지 않았음에도 해당 코드들이 parse 됐을 때 JavaScript가 이것을 바로 실행하기 때문이다.
- 몇개의 element는 특정 이벤트만 실행할 수 있지만 어쨌든 모든 element의 이벤트는 기본 DOM 방식을 기반으로 한다. 그리고 element가 이벤트를 지원할 때 React와 함께 listener를 추가할 수 있게 된다.


</br>
