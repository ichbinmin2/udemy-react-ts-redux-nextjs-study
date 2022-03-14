# Debugging React Apps

## 목차

- [Understanding React Error Messages](#리액트-오류-메시지-이해하기)
- [Analyzing Code Flow & Warnings](#코드의-흐름과-경고를-분석하기)
- [Working with Breakpoints](#중단점-breakpoint-작업하기)

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

## 코드의 흐름과 경고를 분석하기

- 브라우저에서 동작하는 todolist를 확인해보자. 현재는 input에 새로 입력한 Goal list 들을 추가하고 그 Goal을 하나씩 지우고자 할 때, 원하는 Goal을이 아닌 전혀 다른 Goal이 지워지거나 추가한 Goal 모두가 한꺼번에 지워지는 등의 문제가 발생되고 있는 걸 확인할 수 있다. 하지만, 컴파일 에러로 이어지지 않고 메인 스크린에서도 뜨지 않기 때문에 이러한 에러를 발생시키는 요소가 무엇인지 코드를 살펴보고 확인해야 한다.

### 코드의 흐름을 분석하기

- 현재 어플리케이션 화면이나 터미널에서는 에러가 확인되지 않고 있다. 이런 경우에는 몇 가지 방법을 시도하여 에러를 확인해볼 수 있을 것이다. 먼저, 작동 시에 문제가 생긴 삭제 로직을 확인해본다. 이 삭제 로직을 작성한 위치로 가보는 것이다.
- Goal 아이템을 삭제하는 로직인 `deleteItemHandler`은 `App.js`에 있는 것을 확인할 수 있다. `deleteItemHandler` 을 확인해보면,

```js
const deleteItemHandler = (goalId) => {
  setCourseGoals((prevGoals) => {
    const updatedGoals = prevGoals.filter((goal) => goal.id !== goalId);
    return updatedGoals;
  });
};
```

- Goal 아이템 리스트를 담아주는 상태(state) 함수인 `setCourseGoals` 에서 인자로 받아오는 `goalId`와 해당 상태(state)의 id가 다를 때만 `filter` 함수로 걸러준 아이템을 `courseGoals`에 담아 업데이트해주고 있는 것을 볼 수 있다. 삭제 논리 자체는 잘 작동되고 있는 것이며, 이는 `id`의 문제처럼 보인다. 그렇다면, 이 `id`가 생성되는 로직을 확인해보면 될 것이다.

```js
const addGoalHandler = (enteredText) => {
  setCourseGoals((prevGoals) => {
    const updatedGoals = [...prevGoals];
    updatedGoals.unshift({ text: enteredText, id: "goal1" });
    return updatedGoals;
  });
};
```

- `addGoalHandler` 함수는 Goal 아이템을 추가하면서 동시에 `id`가 생성되는 로직이다. 새로운 Goal 아이템이 상태(state) 함수인 `setCourseGoals`를 통해 Goal list의 상태(state)가 업데이트 되고 있다. 이때, `id` 값을 부여하고 있는데 랜덤하게 고유한 `id`로 추가되는 것이 아니라, Goal 아이템이 추가될 때마다 동일한 문자열의 `id`로 업데이트 되는 것을 확인할 수 있다. 그리고 여기서 논리적 오류가 발생된 것이다. Goal이 새로 추가될 때마다, 동일한 `id`로 할당되었다는 이야기다.
- 이런 논리적 오류로 인해 앞서 `deleteItemHandler` 함수에서 이벤트 아이템 즉, Goal 아이템에서 받아오는 `goalId` 인자가 동일했기 때문에 `id`로 각각의 Goal 아이템을 구분하여 삭제할 수 없게 된 것이다.
- 이처럼, 전체적으로 흘러가는 코드의 흐름과 이벤트의 연쇄 동작들을 하나씩 따라가고 살펴보면서, 해당 오류가 발생한 지점까지 좁혀가며 에러를 확인할 수 있었다. 그리고 이러한 시도를 통해 현재 어플리케이션 화면이나 터미널에서는 에러가 확인되지 않을 때마다 에러를 찾아내고 해결할 수 있다. 물론, 코드의 흐름을 따라가는 방법이 아닌 다른 해결 방법도 존재한다.

### 개발자 도구 살펴보기

- 이번에는 브라우저의 개발자 도구를 사용해볼 것이다. 위와 같은 에러를 마주했을 때, 브라우저를 열어 console 에러 메세지가 뜨는지 먼저 확인해볼 수 있다. Goal 아이템을 작성하고 추가하자마자 console 에서는 이런 에러 메세지를 출력한다.

![image](https://user-images.githubusercontent.com/53133662/158144319-4657f1b1-5321-4cf9-ae26-4e181e640570.png)

- Warning 메세지를 하나하나 뜯어보면, 몇 가지 키워드가 등장하는 것을 확인할 수 있다. `Encountered two children with the same key`, `goal1`. `Non-unique keys`.
- 이 Warning 메시지를 해석해보자면 현재 브라우저에서 사용되고 있는 `goal1` 은 고유한 `key`가 아니라는 것이다. 이는 삭제 기능에서 고유하지 않은 `key` 로 인하여 문제를 발생시킬 여지가 있다고 미리 경고를 보낸 것이다.
- 이처럼, 개발자 도구에서 출력되는 메세지 들을 통해서 우리는 에러를 추측하고 찾아내며 결국에는 그 에러를 해결할 수 있는 것이다.

</br>

## 중단점 breakpoint 작업하기

- 개발자 도구의 Sources 텝을 이용하여, 아이템을 지워주는 로직의 트리거가 있는 `CourseGoalItem.js`로 이동한 뒤 직접적으로 `id`를 지워주는 로직에 `breakpoint`를 추가한다.

![image](https://user-images.githubusercontent.com/53133662/158186135-bb097c57-5f62-483c-83a7-5dd4e4ba3b44.png)

- `breakpoint`를 추가한 뒤, 브라우저에서 문제가 발생되는 지점의 액션을 동작하도록 해보자. 그러면 해당 트리거가 어디에서 최종적으로 로직을 받아 실행되고 있는지 흐름을 따라가 볼 수 있게 된다. 그리고 이렇게 흐름을 따라가 보면서 최종적으로는 에러의 최초 발생 지점까지 찾아갈 수 있게 된다.
  > 추가된 `breakpoint`은 해당 줄을 한 번 더 클릭하면 해제가 된다.

### 정리

- 중단점 `breakpoint`을 활용한다면, 코드를 단계적으로 살펴볼 수 있으며 변수들에 저장된 값 또한 직접 살펴보면서 특정한 에러 상황이 발생한 원인을 파악해볼 수 있게 된다. 중단점을 `breakpoint`을 잘 활용만 한다면 코드를 분석하고 더 나아가 그 동작 흐름을 이해할 수 있게 되며, 결론적으로는 에러를 찾아서 문제를 조금 더 빨리 해결할 수도 있게 된다.

```js
const addGoalHandler = (enteredText) => {
  setCourseGoals((prevGoals) => {
    const updatedGoals = [...prevGoals];
    updatedGoals.unshift({ text: enteredText, id: Math.random().toString() });
    return updatedGoals;
  });
};
```

</br>
