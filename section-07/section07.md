# Debugging React Apps

## 목차

- [Understanding React Error Messages](#리액트-오류-메시지-이해하기)

## 리액트 오류 메시지 이해하기

- React로 앱을 빌드할 때나, 혹은 그저 개발자로서 일을 할 때마다 우리는 언제나 에러를 만나게 된다. 개발 과정에서는 항상 에러가 발생하며, 애초에 에러가 없는 코드를 작성한다는 것은 어쩌면 불가능에 가까울지도 모른다. 이렇듯, 개발자라면 언제나 에러를 직면하게 되어있다. 그리고 개발자에게는 에러를 이해하고 스스로 찾아서 해결하는 것(문제 해결 능력)이 가장 중요한 역량이라고 말할 수도 있을 것이다. 이번 `Debugging React Apps` 섹션에서 바로 이 React 앱을 디버깅 하는 방법에 대해 학습하고자 한다.

![Failed to compile-img](https://user-images.githubusercontent.com/53133662/157864434-0f704599-644b-4057-913e-de9eb93ed2f4.png)

### error 메세지를 뜯어보기

- `Adjacent JSX elements must be wrapped in an enclosing tag.` `(43:6)` `./src/App.js`

```js
  return (
      <section id="goal-form">
        <CourseInput onAddGoal={addGoalHandler} />
      </section>
      <section id="goals">{content}</section>
  );
```

```js
return (
  <div>
    <section id="goal-form">
      <CourseInput onAddGoal={addGoalHandler} />
    </section>
    <section id="goals">{content}</section>
  </div>
);
```

- 성공적으로 컴파일되며 브라우저도 정상적으로 동작하는 것을 알 수 있다.
