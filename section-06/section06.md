# Styling React Components

## 목차

- [Setting Dynamic Inline Styles](#동적으로-인라인-스타일-설정하기)
- [Setting CSS Classes Dynamically](#동적으로-CSS-클래스-설정하기)

## 동적으로 인라인 스타일 설정하기

- React로 웹앱을 빌드하는 것은 단지 컴포넌트를 구성하고 로직이 작동되는 것이 전부가 아니다. 물론 이것이 가장 중요한 부분이고 React를 사용하는 가장 큰 이유이기는 하지만 React 앱을 빌드하는 데 있어서는 앱에 Style을 적용하는 것도 중요하다. 스타일링은 컴포넌트를 빌드하는 데에도 중요한 부분을 차지한다. 스타일을 동적으로 설정하고 특정 컴포넌트의 스타일이 다른 컴포넌트에 영향을 주지 못하게 설정하는 다양한 기법이 존재한다.

- 프로젝트를 살펴보면 지금은 class 선택해서 적용하는 일반적인 css 적용 방법을 사용하고 있다. 허나, 이런 방식은 className이 동일할 경우 다른 컴포넌트의 스타일에서도 영향을 끼칠 가능성이 농후하다. 하지만 먼저, 스타일을 동적으로 그리고 inline 방식으로 적용하는 방법에 대해서 알아보자.

### 조건식을 활용한 동적 인라인 스타일 적용하기

![데모 어플리케이션 화면](https://user-images.githubusercontent.com/53133662/157377938-b24e7cd2-40f0-48cf-9644-4c4dc8035b15.png)

- 현재 작동되고 있는 데모 앱을 확인해보자. 빈 값을 입력했을 때도 빈 element 그대로 추가가 되는 것을 알 수 있다. 이는 사용자에게 잘못된 입력에 대한 피드백이 필요하다는 이야기다. 이를 위해서 동적으로 스타일을 적용해볼 생각이다. 먼저, 사용자 입력값을 수집하는 `CourseInput` 컴포넌트를 살펴보자.

```js
const goalInputChangeHandler = (event) => {
  setEnteredValue(event.target.value);
};

const formSubmitHandler = (event) => {
  event.preventDefault();
  props.onAddGoal(enteredValue);
};
```

- 먼저, `formSubmitHandler` 함수가 입력 데이터를 추가해주는 `onAddGoal` 함수를 트리거 하기 전에 사용자 입력이 올바르게 되었는지 확인하는 로직이 필요할 것 같다.

```js
const formSubmitHandler = (event) => {
  event.preventDefault();
  if (enteredValue.trim().length === 0) {
    return; // 함수실행 중단
  }

  props.onAddGoal(enteredValue);
};
```

- `formSubmitHandler` 함수에 if 문을 추가하고 입력된 값의 상태(state)인 `enteredValue`를 가져와서 `trim()` 문자열 메소드를(사용자가 공백을 많이 입력한 경우를 배제하기 위해) 사용하여 양 끝의 공백을 삭제한 길이 `length`가 0 과 같은지를 체크한다. 단순하게 말하자면 사용자 입력값이 없을 때의 조건을 찾아서 return 하여 함수를 중단시키는 것이다.
- [MDN 문서 참조: String.prototype.trim()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)

  > trim() 메서드는 문자열 양 끝의 공백을 제거합니다. 공백이란 모든 공백문자(space, tab, NBSP 등)와 모든 개행문자(LF, CR 등)를 의미합니다.

- 이제 사용자가 빈값을 입력했을 때 더이상 카드가 추가되지 않는 것을 확인할 수 있다. 그러나 사용자에게 빈값을 입력했음을 피드백주지는 못했다. 바로 여기서 스타일링이 필요한 것이다. 사용자가 잘못된 값을 입력하면, 이 `<input>` 부분과 `<label>`에 테두리와 배경, 폰트 색상 등을 변경하여 효과적으로 피드백을 줄 수 있도록 해보자.

```js
const [isValid, setIsValid] = useState(true);
```

- 먼저 조건식에 따른 스타일을 적용하기 전에, 사용자가 제대로 입력을 했는지에 관한 boolean 상태(state)를 먼저 설정한다. 이 상태(state)값을 이용해서 조건식을 작성할 것이다.

```js
const formSubmitHandler = (event) => {
  event.preventDefault();
  if (enteredValue.trim().length === 0) {
    setIsValid(false);
    return; // 함수실행 중단
  }

  props.onAddGoal(enteredValue);
};
```

- 앞서 작성한 `formSubmitHandler` 함수의 입력값이 없을 때의 조건을 찾는 if 문 내부에 return을 하여 함수 실행을 중단하기 이전에 상태(state) 업데이트인 `setIsValid`로 상태(state)를 변경해준다.

```js
 <label style={{ color: !isValid ? "red" : "black" }}>
```

- `<label>` 태그에 style prop을 추가한 뒤, color(property)를 `isValid` 상태(state)값을 이용하여 삼항 조건 연산자로 색상을 추가해준다. `isValid`가 false면 폰트의 색상이 "red"로 변하고 true면 "black"으로 바뀔 수 있도록 작업했다. (`isValid`의 기본값은 true이기 때문에 `<label>` 폰트 색상의 default는 언제나 "black"일 것이다.)

![label warning](https://user-images.githubusercontent.com/53133662/157380695-92c03b78-3049-4e62-9f39-9a49f45191c3.png)

- 이제 `<input>`의 테두리와 배경색에도 동일한 작업을 해줄 수 있도록 해보자.

```js
<input
  style={{
    borderColor: !isValid ? "red" : "#ccc",
    backgroundColor: !isValid ? "salmon" : "transparent",
  }}
  type="text"
  onChange={goalInputChangeHandler}
/>
```

- 이제 사용자가 빈값을 입력하고 제출하려고 시도할 때마다 `<label>`의 폰트 컬러가 "red"로 바뀌고, 동시에 `<input>`의 테두리 색상과 배경색이 "salmon"으로 변하는 것을 확인할 수 있다.

![input warning](https://user-images.githubusercontent.com/53133662/157386480-52c9cd64-fdf2-4811-816c-f6728baeb1e9.png)

- 마지막으로 사용자에게 빈값을 입력했을 때 받는 피드백의 이후로 이것을 다시 리셋해야 하는 과정이 필요할 것이다. 사용자가 빈값이 아닌 어떤 값을 입력했을 때에는 본래의 스타일로 돌아올 수 있도록 말이다.

```js
const goalInputChangeHandler = (event) => {
  setEnteredValue(event.target.value);
};
```

- 사용자 입력값을 받는 함수인 `goalInputChangeHandler`로 가서 리셋기능을 설정해보자. 동일하게 if 문을 이용해서 사용자 입력값인 `event.target.value`을 받고 `trim()`으로 양끝의 공백을 삭제해준 길이(`length`)를 구해서 0 값보다 큰지 확인하는 조건을 찾는다. 즉, 입력값이 0보다 컸을 떄 그러니까 사용자가 유효한 값을 입력했을 때 상태(state) 업데이트인 `setIsValid`를 이용하여 상태(state)를 초기화(true) 해주었다. `isValid`의 기본값은 true이기 때문에 `<label>` 과 `<input>` 태그 모두 default 스타일로 리셋될 수 있도록 했다.

```js
const goalInputChangeHandler = (event) => {
  if (event.target.value.trim().length > 0) {
    setIsValid(true);
  }
  setEnteredValue(event.target.value);
};
```

- 이제 사용자가 빈 값을 입력하여 제출하려고 시도할 때마다 스타일의 변화로 피드백을 줄 수 있게 되었다. 그리고 이때 다시 사용자가 유효한 값을 입력하면 이전에 받은 사용자 피드백을 초기화 되도록(처음으로 돌아갈 수 있도록) 하였다.

### 결론

- 지금까지 조건식을 활용하여 동적으로 인라인 스타일을 추가해보았다. 하지만 인라인 스타일은 언제나 최우선 순위로 고려되기 때문에 이전에 적용한 css 클래스를 덮어씌운다는 특이점이 있다. 인라인 스타일의 이런 부분들 때문에 보통은 다른 대안을 더 고려하게 된다.

</br>

## 동적으로 CSS 클래스 설정하기

### 인라인 클래스가 아닌 다른 대안은 없을까?

```js
<div className="form-control" >
  <label style={{ color: !isValid ? "red" : "black" }}>
  <input
    style={{
      borderColor: !isValid ? "red" : "#ccc",
      backgroundColor: !isValid ? "salmon" : "transparent",
    }}
    type="text"
    onChange={goalInputChangeHandler}
  />
</div>
```

- 현재 `<label>`과 `<input>`을 가지고 있는 `<div>`에 새로운 class로 CSS 속성을 추가해보자. 이 class를 동적으로 입력한 값이 유효하지 않을 때만 추가할 수 있도록 말이다.

```js
<div className="form-control invalid">...</div>
```

- `<div>`의 class에 `invalid` 를 추가해보았다. 이 `invalid` class가 여기에 어떤 조건일 때에만 동적으로 추가되어야 한다. 그리고 CSS에 `invalid`에 해당하는 스타일을 준비하도록 하자.

```css
.form-control.invalid input {
  border-color: red;
  background-color: #fad0ec;
}

.form-control.invalid label {
  color: red;
}
```

- 동일 선상에 있는 class는 공백 없이 함께 붙여서 작성해야 한다. 그리고 `input`과 `label`을 타겟하여 원하는 스타일을 추가한다. 이 스타일이 효과를 발휘하려면 `invalid` 클래스를 동적으로 추가해야 할 것이다.

### 클래스를 동적으로 추가하기

```js
<div className={``} >
  <label>
  <input
    type="text"
    onChange={goalInputChangeHandler}
  />
</div>
```

- 먼저, `div`의 class인 `invalid`를 이용해서 `input`과 `label` 스타일을 추가해줄 것이기에, 그동안 작성한 인라인 스타일들을 모두 지워주었다. 그리고 `div`의 class에 동적인 값이 필요하기에, 중괄호를 생성해주고 동적으로 더 많은 텍스트를 추가해줄 수 있는 백틱을 사용하여 작성한다. 백틱은 기본 JavaScript 기능이며, Template literals 이라고 한다. 이 백틱에서 사용하는 모든 내용은 기본 문자열로 처리된다.

- [MDN 문서 참조: Template literals](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals)
  > 템플릿 리터럴은 내장된 표현식을 허용하는 문자열 리터럴입니다. 여러 줄로 이뤄진 문자열과 문자 보간기능을 사용할 수 있습니다. 이전 버전의 ES2015사양 명세에서는 "template strings" (템플릿 문자열) 라고 불려 왔습니다.

```js
<div className={`form-control ${}`}>...</div>
```

- 그리고 `${}`과 같은 특수 구문을 사용하여 동적 값을 백틱(문자열)에 넣어줄 수 있다. 이렇게 `${}`을 사용하면 문자열에 내용이 추가되고, 이 중괄호 사이에 전달하는 내용은 모든 JavaScript 표현식이 될 수 있다. (JSX 안의 중괄호의 역할과 비슷하다.)

```js
<div className={`form-control ${!isValid ? "invalid" : ""}`}>...</div>
```

- `${}`를 사용하여 `isValid` 라는 상태(state)가 true 인지 false 인지를 확인하는 조건식을 작성한다. 만약 `isValid`가 false이면 `form-control invalid` class를 추가해줄 것이고, 아니라면 빈 문자열을 전달하면서 default 스타일(`form-control`로만 구현되는 CSS 스타일)을 유지할 수 있도록 했다. 이제 인라인으로 동적인 스타일을 구현하지 않아도 동일한 방식으로(동적으로) 스타일을 구현할 수 있게 되었다. 이것은 CSS 파일과 class 만으로 작업할 수 있으며, 예시처럼 간단한 구문으로 class를 동적으로 추가하거나 제거할 수 있기 때문에 매우 강력하다.

![input warning](https://user-images.githubusercontent.com/53133662/157386480-52c9cd64-fdf2-4811-816c-f6728baeb1e9.png)

</br>