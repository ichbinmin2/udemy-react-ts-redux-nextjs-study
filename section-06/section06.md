# Styling React Components

## 목차

- [Setting Dynamic Inline Styles](#동적으로-인라인-스타일-설정하기)
- [Setting CSS Classes Dynamically](#동적으로-CSS-클래스-설정하기)
- [Introducing Styled Components](#Styled-Components-소개)
- [Styled Components & Dynamic Props](#Styled-Components와-동적-Props)

## 동적으로 인라인 스타일 설정하기

- React로 웹앱을 빌드하는 것은 단지 컴포넌트를 구성하고 로직이 작동되는 것이 전부가 아니다. 물론 이것이 가장 중요한 부분이고 React를 사용하는 가장 큰 이유이기는 하지만 React 앱을 빌드하는 데 있어서는 앱에 Style을 적용하는 것도 중요하다. 스타일링은 컴포넌트를 빌드하는 데에도 중요한 부분을 차지한다. 스타일을 동적으로 설정하고 특정 컴포넌트의 스타일이 다른 컴포넌트에 영향을 주지 못하게 설정하는 다양한 기법이 존재한다.

- 프로젝트를 살펴보면 지금은 class 선택해서 적용하는 일반적인 css 적용 방법을 사용하고 있다. 허나, 이런 방식은 className이 동일할 경우 다른 컴포넌트의 스타일에서도 영향을 끼칠 가능성이 농후하다. 이런 한계를 극복하기 전에 먼저 스타일을 동적으로 그리고 inline 방식으로 적용하는 방법에 대해서 알아보자.

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

### 정리

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

## Styled Components 소개

- style과 class를 동적으로 설정할 줄 아는 것은 중요할 것이다. 현재까지 우리는 css만 이용하고 있었다. 대부분이 class 셀렉터를 통한 스타일 적용이었고 몇가지 태그 셀렉터 등과 결합되는 일반 셀렉터가 있는 일반 CSS 파일을 사용했다. 그리고 이 CSS 파일은 사용하고자 하는 컴포넌트에 import 하여 적용시켰다. 이렇게 지금까지 React 코드로 컨트롤했지만, 이번에는 스타일링 그 자체에 대해서 알아보려고 한다.

```js
import "./Button.css";
```

- 앞에서 몇 차례 강조한 것처럼 이 스타일들의 적용 범위는 import한 컴포넌트에만 국한되지 않는다. 예를 들어보자. DOM 어딘가에 `form-control` 라는 class를 가진 다른 element가 있다면, `form-control`에 작성한 스타일 요소들이 그 element까지 영향을 주게 된다. 그러니까 `form-control`에 어떤 스타일을 적용시킨 하나의 컴포넌트가 다른 컴포넌트의 엘리먼트와 동일한 className(`form-control`)을 가지고 있다면, `form-control`에 작성한 스타일 요소가 동일하게 영향을 미쳐서 적용된다는 소리이다. 이는 기본값으로는 스타일의 범위가 지정되지 않기 때문에 발생하는 문제이다. 물론 셀렉터 name의 중복을 고려하여 조금 더 신경을 쓴다던지 하는 방식을 고수하면 반드시 문제가 될 사항은 아니라고 볼 수도 있겠지만, 만약 큰 프로젝트라면 어떨까? 아마도 많은 개발자들이 코드 작업을 할 것이고 본인도 모르게 className을 중복으로 사용하게 될 가능성이 높을 것이다. 이런 중복을 피하기 위해서 다양한 방법이 존재하지만 이번에는 가장 인기 있는 두가지 방법 중 하나를 소개하려고 한다.

### Styled-Components

- [Styled-Components 공식페이지](https://styled-components.com/)
- Styled-Components 는 특정 스타일이 첨부된 컴포넌트를 빌드할 때 도와주는 패키지이다. 스타일이 첨부된 컴포넌트에만 영향을 미치게 하고, 다른 컴포넌트에는 영향을 주지 않는 또 다른 스타일 컴포넌트를 생성하는 것이다. Styled-Components 를 시작하기 위해서는 먼저 패키지를 설치해야 한다.

```
 yarn add styled-components
```

- `Button.js` 컴포넌트를 이용하여 Styled-Components 를 연습해볼 것이다. 먼저 `Button.js`의 원본 코드를 확인해보자.

```js
import "./Button.css";

const Button = (props) => {
  return (
    <button type={props.type} className="button" onClick={props.onClick}>
      {props.children}
    </button>
  );
};
```

- `Button.js` 컴포넌트는 CSS 파일을 import하여 class 선택기로 스타일을 적용하고 있다. 이제 Styled-Components를 이용하여 더 쉽게 스타일을 적용해보도록 하자.

```js
import styled from "styled-components";

const Button = styled;
```

- 먼저, 이전에 import 했던 `Button.css`를 삭제하고 `styled-components`에서 `styled`를 import 해오자. 그리고 새 상수인 `Button`을 생성하여 `Button`을 리빌드한다. (이 `Button`에 할당하는 것은 함수형 컴포넌트가 아님을 명심하자.)

```js
import styled from "styled-components";
const Button = styled.button``;
```

- `styled.button`을 입력하고 백틱을 붙인다. 이것을 "태그가 지정된 Template literals" 이라고 한다. 이것은 React나 styled-components 에서만 국한된 기능이 아니며, 기본 JavaScript 기능이기에 모든 JavaScript 프로젝트에서 사용할 수 있다.

```js
styled.button``;
```

- `button`은 이 `styled` 객체의 메소드이다. `styled`는 styled-components 에서 가져온 객체이며, `button` 메서드에 접근할 수 있도록 만들어준다. 이 메서드는 괄호로 호출하는 메서드가 아니라, 백틱을 붙여서 사용하는 특별한 메서드이다. 그리고 이 백틱 사이에서 작성한 스타일 요소들이 `button` 메서드로 전달된다. 재밌는 점은 이 `button` 메서드가 새로운 `button` 컴포넌트를 반환한다는 사실이다. 물론, styled 패키지가 모든 HTML 엘리먼트에 대한 메서드를 보유하고 있다는 점도 기억하자.

<img width="985" alt="image" src="https://user-images.githubusercontent.com/53133662/157629362-f063e849-10b3-4ec5-8b65-7607aa60f5e5.png">

- `Button.css`에서 작성한 모든 스타일을 복사하여 해당 백틱 사이에 넣어주자.

```js
const Button = styled.button`
  .button {
    font: inherit;
    padding: 0.5rem 1.5rem;
    border: 1px solid #8b005d;
    color: white;
    background: #8b005d;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.26);
    cursor: pointer;
  }

  .button:focus {
    outline: none;
  }

  .button:hover,
  .button:active {
    background: #ac0e77;
    border-color: #ac0e77;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.26);
  }
`;
```

- `Button.css`에서 그대로 복사하여 가져온 이 스타일들에 대한 약간의 수정이 필요한데, 아주 간단하다.

```js
const Button = styled.button`
    font: inherit;
    padding: 0.5rem 1.5rem;
    border: 1px solid #8b005d;
    color: white;
    background: #8b005d;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.26);
    cursor: pointer;
....
`;
```

- 우리는 `button` 이라는 새로운 스타일 컴포넌트를 반환할 것이고, 이 컴포넌트 내부에는 `.button` 이라는 className으로 적용할 엘리먼트가 따로 없기 때문에 두 백틱 사이에서 전달한 스타일이 이 `button` 이라는 메소드에 직접 영향을 줄 것이기 때문에 `.button` 으로 전달한 class 괄호 부분을 지워준다. 이제 `.button`로 적용했던 스타일이 `button` 메서드에 직접적으로 전달되어 `button` 엘리먼트로 반환될 것이다.

```js
const Button = styled.button`
  // ...

  &:focus {
    outline: none;
  }

  &:hover,
  &:active {
    background: #ac0e77;
    border-color: #ac0e77;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.26);
  }
`;

export default Button;
```

- 가상 선택자의 경우 `&` 기호로 대신할 수 있다. 이 또한 styled-components 패키지에서 지원하는 것이다. `&`로 작성된 코드를 해석하자면, "이 `button`에 `focus`가 있으면 스타일을 적용해달라"는 의미이다. 나머지 `hover`와 `active`에도 동일하게 적용할 수 있기에 수정을 진행했다. 이제 default로 반환된 `Button`은 여기에서 내보내는 컴포넌트에 전달할 수 있는 모든 props를 적용할 수 있게 되었다. `onClick` props을 추가하거나, `type`을 설정할 수도 있는 것이다. 그리고 이 모든 것은 styled-components 패키지에 의해 `button`으로 전달된다. 이제 이전과 동일한 모습으로 똑같이 적용되는 것을 확인 할 수 있을 것이다.

### 정리

- styled-components는 우리가 설정한 스타일을 토대로 생성된 className으로 스타일 속성들을 래핑한다. 이렇게 styled-components 패키지는 모든 styled-components 마다 고유한 className을 가지므로 앱의 다른 컴포넌트에 영향을 미치지 못하게 한다.

</br>

## Styled-Components와 동적 Props

- Styled-Components를 특정 컴포넌트에서만 사용하고 싶다면 이전에 `Button`처럼 새로운 컴포넌트를 생성하지 않고, 같은 컴포넌트 파일 내에서 `styled`를 작성하는 방법도 있다. (해당 스타일드 컴포넌트가 여러번 재사용되지 않는 이상 가장 흔히 사용되는 방법이기도 하다.)
- `CourseInput` 컴포넌트를 통해서 예시를 들어보자. 현재는 CSS 파일을 import 하여 class 선택자로 스타일을 적용하고 있다. `form-control`과 `invalid`를 class로 가지고 있는 `<div>`를 이용해서 styled를 작업할 생각이다.

```js
<div className={`form-control ${!isValid ? "invalid" : ""}`}>
  <label>Course Goal</label>
  <input type="text" onChange={goalInputChangeHandler} />
</div>
```

```css
.form-control {
  margin: 0.5rem 0;
}

.form-control label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

.form-control input {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
  line-height: 1.5rem;
  padding: 0 0.25rem;
}

.form-control input:focus {
  outline: none;
  background: #fad0ec;
  border-color: #8b005d;
}

.form-control.invalid input {
  border-color: red;
  background-color: #fad0ec;
}

.form-control.invalid label {
  color: red;
}
```

- `CourseInput` 컴포넌트 내부에 `Button`에서 했던 방식처럼 styled-components의 styled를 import 하고 `FormControl` 라는 상수를 만들어 styled 를 할당해보자. 앞서, `form-control`과 `invalid`를 class로 가지고 있는 `<div>` 를 대신할 styled를 생성할 것이기 때문에 styled에 `div` 메소드를 불러오고 백틱 사이에 `CourseInput.css` 안에 있는 스타일 요소들도 모두 가져와 복사해준다.

```js
const FormControl = styled.div`
  .form-control {
    margin: 0.5rem 0;
  }

  .form-control label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
  }

  .form-control input {
    display: block;
    width: 100%;
    border: 1px solid #ccc;
    font: inherit;
    line-height: 1.5rem;
    padding: 0 0.25rem;
  }

  .form-control input:focus {
    outline: none;
    background: #fad0ec;
    border-color: #8b005d;
  }

  .form-control.invalid input {
    border-color: red;
    background-color: #fad0ec;
  }

  .form-control.invalid label {
    color: red;
  }
`;
```

- `.form-control` class를 가진 `<div>` 태그를 대체할 것이기 때문에 `.form-control` 클래스 항목을 모두 지워준다. `label`과 `input` 같은 중첩 element도 가상 선택자 `&` 기호를 이용하여 target 해준다.

```js
const FormControl = styled.div`
  margin: 0.5rem 0;

  & label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
  }

  & input {
    display: block;
    width: 100%;
    border: 1px solid #ccc;
    font: inherit;
    line-height: 1.5rem;
    padding: 0 0.25rem;
  }

  & input:focus {
    outline: none;
    background: #fad0ec;
    border-color: #8b005d;
  }

  &.invalid input {
    border-color: red;
    background-color: #fad0ec;
  }

  &.invalid label {
    color: red;
  }
`;
```

- 가상 선택자 `&` 기호를 붙이면 styled-components 에게 `div` 내부의 관한 element 임을 알려주는 것이다. `.invalid`의 경우 `div`와 같은 위치에 있는 class 이기 때문에 가상 선택자 `&`을 빈칸 없이 바로 붙여준다. 이제 다시 JSX 코드로 돌아가서 `FormControl` 스타일드 컴포넌트가 적용될 수 있도록 `<div>` 태그가 있던 위치에 스타일드 컴포넌트가 대체할 수 있도록 수정하자.

```js
<FormControl>
  <label>Course Goal</label>
  <input type="text" onChange={goalInputChangeHandler} />
</FormControl>
```

- 이렇게 해당 `FormControl` 스타일드 컴포넌트를 저장해보면 스타일이 제대로 적용되고 있음을 확인할 수 있다. 하지만 이전에 조건식을 이용하여 동적으로 스타일을 적용했던 부분(`${!isValid ? "invalid" : ""}`)이 사라져 더이상 `invalid` 클래스에 대한 스타일이 적용되지 않는다. 다행인 점은 styled-components 함수에 의해 반환되는 컴포넌트가 우리가 설정한 모든 props를 컴포넌트(ex. `<FormControl>`)에 전달할 수 있다는 것이다.

```js
<FormControl className={!isValid && "invalid"}>...</FormControl>
```

- className으로 괄호를 생성하고 그 안에 `&&` 로 `isValid`가 false 이면, `invalid` class가 추가되도록 `&&` 조건식을 작성해주었다. (만약 `isValid`가 true 라면 어떤 class도 추가하지 않는다.) 이제 확인해보면 목표를 빈값으로 추가할 때마다 전과 같이 동적으로 스타일이 변하는 것을 알 수 있다.

### Styled-Components의 Props를 이용한 동적 스타일링 구현하기

- 앞서 저런 방법으로 styled-components를 동적으로 스타일링을 할 수도 있지만, styled-components가 제공하는 다른 기능을 사용해봐도 좋을 것이다. 그것은 바로 styled-components에 props를 추가하는 것이다. `FormControl` 스타일드 컴포넌트의 백틱 사이에서, 즉 스타일 요소 안에서 props를 이용하여 동적으로 스타일을 변화시켜보자.

```js
<FormControl invalid={!isValid}>
  <label>Course Goal</label>
  <input type="text" onChange={goalInputChangeHandler} />
</FormControl>
```

- props를 이용하기 위해서는 `<FormControl>` 컴포넌트 태그에 먼저 props로 내려줄 속성을 설정한다. 우리가 사용할 상태(state)는 `!isValid` 이므로 props의 이름으로 사용할 `invalid`을 설정하고, 중괄호로 `!isValid`를 할당해준다. 이제 props으로 전달한 `invalid`를 `FormControl`의 백틱 사이에서 사용해보자.

```js
& label {
    color: ${(props) => (props.invalid)};
}
```

- `${}` 를 사용해서 파라미터로 props를 받고 화살표 함수로 전달한다. 그런 다음 반환되어야 하는 텍스트를 작성한다. (props의 경우 스타일 컴포넌트가 가져오는 모든 props를 제공한다.)

```js
& label {
    color: ${(props) => (props.invalid ? "red" : "black")};
}
```

- props 으로 전달받은 `invalid`를 이용해서 조건식을 작성했다. 만약 `invalid`이면 (`!isValid`이면, false 이면) "red" 속성을 반환하고, 아니면(`!isValid`가 아니면, true 이면) "black"을 반환하도록 했다. props를 받아서 조정할 나머지 스타일 요소들도 동일하게 작성해준다.

```js
const FormControl = styled.div`
  margin: 0.5rem 0;

  & label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
    color: ${(props) => (props.invalid ? "red" : "black")};
  }

  & input {
    display: block;
    width: 100%;
    /* border: 1px solid #ccc; */
    border: 1px solid ${(props) => (props.invalid ? "red" : "#ccc")};
    background: ${(props) => (props.invalid ? "#fad0ec" : "transparent")};
    font: inherit;
    line-height: 1.5rem;
    padding: 0 0.25rem;
  }

  & input:focus {
    outline: none;
    background: #fad0ec;
    border-color: #8b005d;
  }
`;
```

- styled-components의 props를 이용하는 방법으로 동적으로 스타일링을 완료했다. 이제 이전과 동일하게 동적으로 스타일이 변하는 것을 확인할 수 있을 것이다.

</br>
