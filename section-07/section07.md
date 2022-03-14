# Debugging React Apps

## 목차

- [Understanding React Error Messages](#리액트-오류-메시지-이해하기)

## 리액트 오류 메시지 이해하기

- React로 앱을 빌드할 때나, 혹은 그저 개발자로서 일을 할 때마다 우리는 언제나 에러를 만나게 된다. 개발 과정에서는 항상 에러가 발생하며, 애초에 에러가 없는 코드를 작성한다는 것은 어쩌면 불가능에 가까울지도 모른다. 이렇듯, 개발자라면 언제나 에러를 직면하게 되어있다. 그리고 개발자에게는 에러를 이해하고 스스로 찾아서 해결하는 것(문제 해결 능력)이 가장 중요한 역량이라고 말할 수도 있을 것이다. 이번 `Debugging React Apps` 섹션에서 바로 이 React 앱을 디버깅 하는 방법에 대해 학습하고자 한다.

![Failed to compile-img](https://user-images.githubusercontent.com/53133662/157864434-0f704599-644b-4057-913e-de9eb93ed2f4.png)

### error 메세지를 뜯어보기

- error 메세지를 보면 특정 키워드를 확인할 수 있다. `Parsing error`, `Adjacent JSX elements must be wrapped in an enclosing tag.`,`(43:6)`,`./src/App.js`. 즉, 이 키워드를 토대로 해석해보자면 `./src/App.js`의 `43` 번째 줄에서 `Parsing errpr`가 발생했다고 되어있으며, 인접해있는 JSX 요소들은 하나의 태그로 감싸야 한다는 메세지를 주고 있는 것이다.

![error 메세지](https://user-images.githubusercontent.com/53133662/158140178-ac902f63-ecd4-40dd-addc-59acb7e34552.png)

```js
  return (
      <section id="goal-form">
        <CourseInput onAddGoal={addGoalHandler} />
      </section>
      <section id="goals">{content}</section>
  );
```

- 앞서 error 메세지에서 문제가 생긴 부분인 `./src/App.js`의 `43` 번째 줄을 확인해보면 빨간 줄로 error를 피드백 해주고 있는 것을 알 수 있다. JSX를 반환하거나 변수로 저장하려면, 반드시 하나의 root 태그 요소로 감싸줘야 하기 때문이다. error 메세지를 토대로 `./src/App.js`에서 error가 발생한 부분인 JSX 요소들을 하나의 root 태그 요소로 감싸주면,

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

- 더이상 error 메세지가 뜨지 않으며, 성공적으로 컴파일되며 브라우저도 정상적으로 동작하는 것을 알 수 있다.

### 정리

- 초보자들이 개발을 하면서 마주치는 에러들은 꽤나 당황스러운 일일지도 모른다. 그러나 에러가 발생할 때마다 당황하게 된다면 문제의 원인을 파악할 여유도 없이 멘붕에 빠져버릴지도 모른다. 멘붕에 빠지기 전에 침착하게 에러 메세지를 읽어보고, 메세지 속에 드러난 키워드를 구분해가며 읽어나가는 것이 무엇보다도 중요하다. 에러가 발생한 파일과 라인을 천천히 살펴보면서 제시된 코드 조각들을 하나씩 뜯어보며 고치다보면, 어느새 에러를 해결할 수 있게 된다. 이러한 과정의 반복을 통해 개발자로서 가장 중요한 역할이라 할 수 있는 문제 해결 능력 또한 조금씩 성장할 수 있을 것이다.

</br>
