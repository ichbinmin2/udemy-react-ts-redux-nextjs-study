# React Basics & Working With Components

## 목차

- [What Are Components?](#컴포넌트란-무엇인가)
- [React Code Is Written In A "Declarative Way"!](#리액트-코드는-선언적-방식으로-작성되었습니다)
- [Creating a new React Project](#새로운-리액트-프로젝트-생성하기)
- [Analyzing a Standard React Project](#표준-리액트-프로젝트-분석하기)
- [Introducing JSX](#JSX-소개)
- [How React Works](#리액트의-작동-방식)
- [Building a First Custom Component](#첫-번째-사용자-지정-컴포넌트-만들기)
- [Writing More Complex JSX Code](#더-복잡한-JSX-코드-작성하기)
- [Adding Basic CSS Styling](#기본-CSS-스타일-추가하기)
- [Outputting Dynamic Data & Working with Expressions in JSX](#JSX에서-동적-데이터-출력-및-표현식-작업하기)
- [Passing Data via "props"](#props를-통해-데이터-전달하기)
- [Adding "normal" JavaScript Logic to Components](#컴포넌트에-일반-JavaScript-논리-추가하기)
- [Splitting Components Into Multiple Components](#컴포넌트를-여러-컴포넌트로-분할하기)
- [Time to Practice: React & Component Basics](#연습-리액트-및-컴포넌트-기본-사항)

</br>

## 컴포넌트란 무엇인가

- 과거에서처럼 HTML, CSS & JavaScript 만으로 사용자 인터페이스를 만들 수 있으나 그럼에도 React를 사용하는 이유는 사용자 인터페이스를 만드는 과정을 단순화시켜주기 때문이다.
- 하지만 현재처럼 복잡한 사용자 인터페이스를 만들어야만 한다면 React를 사용해서 작업 과정을 비교적 단순화시킬 수 있게 된다.
- React를 사용한다면 어떤 문제가 발생했을 때 업데이트 과정에 집중할 필요가 없으며, 앱을 구상할 떄 조금 더 중요한 비지니스 로직에 집중할 수 있게 된다.
- 이처럼 작업을 단순화하기 위한 목적으로 React에서는 컴포넌트(Component)라는 개념이 등장했다.

### 왜 컴포넌트는 리액트의 전부라고 하는가?

- 모든 사용자 인터페이스가 결국에는 컴포넌트(Component)로 구성되기 때문이다.
- 컴포넌트(Component)는 결국 사용자 인터페이스에서 재사용할 수 있는 블록을 의미한다. (또한, 컴포넌트는 단지 HTML 코드의 결합일 뿐이라고 말할 수도 있다.)
- 우리는 컴포넌트(Component)를 각각 만든 뒤에 React에게 최종 사용자 인터페이스에서 컴포넌트들을 어떻게 구성할 것인지 명령할 수 있다.

### 리액트는 왜 컴포넌트를 사용할까?

- 컴포넌트(Component)는 "Reusablilty" 즉,재사용이 가능하다는 것과 "Separation of Concerns" 즉, 우려사항을 분리할 수 있다는 특징이 있다.
- 두 개념 모두가 프로그래밍에서 중요한 개념들이다.
- Reusablilty
  - 빌딩 블록을 재사용할 수 있다는 것은 반복을 피할 수 있게 만들어준다.
- Separation of Concerns
  - 우려사항을 분리하면 코드를 작게 그리고 관리할 수 있는 규모로 유지할 수 있게 한다. 모든 HTML과 JavaScript 로직을 포함한 거대한 파일을 가질 필요가 없게 되고, 전체 사용자 인터페이스에서 분리되어 작은 단위로 관리할 수 있다. 그러면 각 컴포넌트가 하나의 사항에 대해서만 집중할 수 있게 된다.

</br>

## 리액트 코드는 선언적 방식으로 작성되었습니다

- React는 컴포넌트(Component)로 구성되어 있다.
- 그렇다면, 컴포넌트는 어떻게 만들어질까?

### 어떻게 컴포넌트를 만들까?

- 사용자 인터페이스는 HTML, CSS, JavaScript와 관련이 있다. 이 세가지가 결합하여 같은 컴포넌트로 묶고 사용자 인터페이스를 만든다.
- React 컴포넌트에서 중요한건 HTML과 JavaScript이다.

### React & Components

- React는 컴포넌트(Component)로 구성되고, HTML, CSS, JavaScript를 결합하여 컴포넌트를 생성할 수 있다.
- React는 컴포넌트(Component)로 재사용을 할 수 있고, 또한 반응하는 컴포넌트를 만들 수 있다.
- React의 컴포넌트(Component)는 HTML과 JavaScript, 그리고 약간의 CSS로 구성된다.
- React는 선언적 접근법(Declarative Approach)을 사용해서 컴포넌트를 생성한다.
- React는 우리가 최종 state를 정하고 나서, 웹페이지의 어떤 요소가 추가되거나 제거되거나 업데이트 되는지를 정해준다.
- 개발자는 이 과정에서 콘크리트 DOM을 직접 사용할 필요가 없으며, 단지 JavsScript로만 작업하면 된다. 이는 React나 React 요소 대신에 최종 상태만 정하면 된다는 의미이다. 그 이후는 리액트가 알아서 나머지 일을 처리해주며, 이는 개발자 삶의 질을 높여줄 수 있는 장점이 될 것이다!

</br>

## 새로운 리액트 프로젝트 생성하기

### Create React App로 React 프로젝트 생성하기

- CRA(Create React App)는 기본 React 코드 파일로, 개발자가 React로 App을 만들거나 실행할 때 일일이 변형하거나 최적화 할 필요 없이 미리 세팅하여 제공하기 때문에 편리하다.
- CRA(Create React App)로 만들어지는 프로젝트는 개발자에게 최적의 개발 환경을 자동으로 세팅해주는 역할을 한다.
- 또한 개발 웹 서버가 로컬 환경에서 App을 미리 검토할 수 있도록 해준다. 또한, 코드가 수정되었거나 변화가 생겼을 때 브라우저가 자동으로 페이지를 업데이트 해줄 것이다.
- 이렇듯, CRA(Create React App)은 우리의 개발 프로세스를 단순화해준다.

### 초기 세팅

- CRA(Create React App)를 설치하기 위해서는 비교적 최신 버전의 `Node.js`가 필요하다. 만약 `Node.js`가 설치되어 있지 않다면, 먼저 개개인의 사용자 환경에 맞는 버전으로 먼저 설치를 해주어야 한다.
- 리액트 앱 프로젝트는 `Node.js`를 이용해서 미리보기 서버를 만들 예정이다. `Node.js`는 최적화 과정을 위해서 그리고 앱을 만들기 위해서 반드시 필요하다.
- [Node.js](https://nodejs.org/ko/)
- [Create React App](https://create-react-app.dev/docs/getting-started)

```
yarn create react-app my-app
cd my-app
yarn start
```

- package.json 은 프로젝트와 관련된 개발 사항들이 버전별로 저장되어있다.
- node_modules 는 로컬 시스템에 다운된 서브 파트 패키지다.

</br>

## 표준 리액트 프로젝트 분석하기

- React 코드는 일반 JavaScript 코드이다.
- React를 사용하고, React의 특별한 구문도 사용할 것이지만, 결국은 모두 JavaScript이다.

### `src/index.js`

- 페이지가 로드되면 가장 첫번째로 실행되는 코드 파일이다.
- 브라우저에 전송되기 전에 작성된 코드들을 변형해주는 역할을 해준다.
- `index.js`에서는 서드파티 라이브러리인 `ReactDOM`을 import한다.

  - React와 ReactDOM은 두개의 분리된 패키지지만 리액트 라이브러리로 여긴다. 다른 책임을 맡고 있는 두개의 패키지이지만 리액트돔과 리액트는 결국 리액트 라이브러리인 것이다. 따라서, 리액트와 리액트돔에서 무언가를 import 했다면, 리액트와 리액트 특성을 모두 이용하고 있다는 의미다.
  - ReactDOM은 `render` 라는 메소드를 호출하며, `render` 메소드는 두개의 매개변수가 있다.

    ```js
    ReactDOM.render(<App />, document.getElementById("root"));
    ```

  - 첫번째 매개변수는 `App`이라는 Component이다.
  - 두번째 매개변수는 default JavaScript DOM API 이다.
    - `global document object`에서는 JavaScript를 JavaScript 브라우저에 혼합한다.
    - `getElementById` 메소드로 요소를 얻어서 `id`로 특정 DOM HTML 요소를 선택한다.

### `public/index.html`

- 브라우저에서 로드되는 싱글 HTML 파일.
- React는 싱글 페이지 앱을 만들기 때문에 사용되는 파일.
- 하나의 HTML 파일만이 브라우저에 전달되고, 브라우저에 의해 호스트 된다.
- 하지만 싱글 파일에서는 완성된 React 앱 코드를 가져오지만, 시작코드 라고 말할 수는 없다. 그저, 스크린에서 무엇을 보여줄지 업데이트하는 역할을 할 뿐이다.
- 하나의 HTML 파일만이 브라우저에 전달되지만, 리액트라는 라이브러리 덕분에 스크린에서 보는 내용은 계속 업데이트 된다.

```js
<div id="root"></div>
```

- `root` 라는 `id` 값을 가지고 있는 `<div>`는 `index.html`의 body 중에서 유일한 HTML 요소이다.
- 이 `div`는 `index.js`의 `render` 메소드 안에서 두번째로 호출되는 매개변수에서 `root`라는 `id`로 타겟하여 선택된 것이다.
- 이 `div`라는 빈 콘텐츠는 `render` 메소드 안에서 첫번째로 호출되는 매개변수인 `<App/>`으로 대체된다.

### `src/App.js`

- `index.js`에서 ReactDOM이 호출한 `render` 메소드 안에서 첫번째로 호출되는 매개변수이다.
- `App`도 결국에는 Component이다.
- `App`에서 함수가 정의된 것을 export하고 `index.js`에서 import 하여 가져오게 된다.
- `App` 이라는 함수는 무언가를 return 하는 역할을 한다.
- React에서 개발하고 도입한 특별 구문인 jsx 라는 특성 때문에 JavaScript 파일에서도 작동하게 된다. (변형 과정 덕에 가능)

</br>

## JSX 소개

- JSX 코드는 JavaScript 내에 있는 HTML 코드를 의미한다.
- JSX 는 JavaScript XML을 위한 것이다. HTML이 결국 XML이라고 할 수 있기 때문이다. 따라서 HTML 코드를 JavaScript로 받는 것이다.

```js
function App() {
  return (
    <div>
      <h2>Let's get started!</h2>
    </div>
  );
}

export default App;
```

- JSX 코드는 변형(JavaScript로) 과정이 있었기 때문에 브라우저에서 작동하게 되며, 이러한 과정 덕분에 여러 브라우저에서 사용할 수 있게 되었다.
- 변형된 코드는 개발자 도구-소스 탭에서 확인 할 수 있는데, 우리가 개발하며 작성한 코드와는 다른 것을 확인할 수 있다.

<img width="826" alt="스크린샷 2022-02-23 오후 5 33 15" src="https://user-images.githubusercontent.com/53133662/155284659-40117856-a368-4285-99b7-95ecd18a2322.png">

- 개발자 도구-소스 탭의 `static/js` 폴더 내의 `bundle.js`를 살펴보면, 우리가 작성한 소스 코드는 포함하고 있지 않으며 전체 React 라이브러리 소스 코드와 전체 ReactDOM 라이브러리 소스 코드를 포함하고 있을 뿐이다.
- 개발자 도구-소스 탭의 `static/js` 폴더 내의 `main.chunk.js`를 살펴보면, `App`이라는 이름의 함수를 발견할 수 있다. 이는 우리가 `App`에서 작성한 소스 코드와는 다름을 확인할 수 있다. 이는 변형된 코드로 브라우저에서 실행되고 있음을 말해준다.
- JSX 이라는 특별한 구문을 사용하면서, 우리가 작성한 소스 코드가 브라우저에서 실행되기 전에 브라우저가 이해할 수 있는 코드로 자동 변환이 되며 이는 개발자가 코드를 조금 더 편하게 작성할 수 있도록 만들어준다.

</br>

## 리액트의 작동 방식

```js
function App() {
  return (
    <div>
      <h2>Let's get started!</h2>
    </div>
  );
}

export default App;
```

- `App` 함수 안에 HTML 코드가 있다. `App` 은 하나의 컴포넌트(Component)이고 컴포넌트는 전용 HTML 요소이기 때문이다.
- 선언 접근 방식(Declarative Approach)을 살펴보자.
  - 선언 접근 방식(Declarative Approach)이란, 리액트의 타겟 state를 정한 뒤에 실제 돔 지시를 생성하고 실행하는 것을 의미한다.

```js
<div>
  <h2>Let's get started!</h2>
</div>
```

- `<h2>` 태그로 `div`를 만들고 있다. 즉, `<h2>` 태그 안 넣어준 문구 "Let's get started!" 가 화면 상에서 나타나도록 하겠다는 의미이다.
- 그렇다면, `App.js` 에서 선언한 함수에서 HTML 블록에 `<p>` 태그로 새로운 구문을 추가한다면 어떨까?

### 일반적으로 JavaScript 에서 하던 방식

- 일반적으로 JavaScript에서는 페이지의 요소를 선택하고 `innerHTML`로 문장을 직접 넣어주는 방식을 사용했다.

```js
document.getElementById("root").innerHTML = "This is also visible!";
```

- 혹은 Element를 생성하고, `textContent`로 문장을 할당한 뒤 자식으로 넣어주는 방식을 사용하기도 했다.

```js
const para = document.createElement("p");
para.textContent = "This is also visible!";
document.getElementById("root").append(para);
```

- 앞서 보여준 예시와 같은 일반적으로 JavaScript에서 하던 방식은 명령형 접근 방식(Imperative Approach)을 따른 것이다.
- 명령형 접근 방식(Imperative Approach)은 확실한 단계별 지시를 통해 작동되는 방식을 의미한다. 이는, 요소가 아주 많은 복잡한 사용자 인터페이스를 다루기엔 다소 성가실 수 있는 방법이다. 매번 모든 지시를 일일이 작성하여 업데이트 해야되기 때문이다.
- 이러한 성가신 작업 과정들은 리액트의 선언 접근 방식(Declarative Approach)으로 최종 상태를 정의하는 방식으로 단순화할 수 있게 되었다.

### 리액트 jsx의 방식

```js
<div>
  <h2>Let's get started!</h2>
  <p>This is also visible!</p>
</div>
```

- `<p>` 태그로 새로운 구문을 추가하고 파일을 저장하고 개발 서버가 실행되도록 하면, React가 자동으로 변화를 감지하여 브라우저 페이지를 업데이트 해줄 것이다.

```js
<div>
  <h2>Let's get started!</h2>
  <p>This is also visible!</p>
</div>
```

- React는 컴포넌트(Component)라는 개념을 가지고 있다. 그리고 첫번째 컴포넌트라고 할 수 있는 `App`이 존재한다. 이 `App`은 `index.js`에서 전용 HTML 요소(Element)처럼 사용되는 컴포넌트(Component)이다.

</br>

## 첫 번째 사용자 지정 컴포넌트 만들기

- `src` 폴더에 `components` 폴더를 생성하고, 새로운 컴포넌트(component) 파일을 생성한다.
- 컴포넌트(component) 하나 당 하나의 파일을 생성하는 게 좋다.
- 모든 컴포넌트(component)는 `App.js` 함수 안에 포함되거나 다른 컴포넌트(component)에 포함될 것이다.
- 컴포넌트 트리(component tree) 안에는 최상위 컴포넌트인 `<App/>`이 있고 그 안에 커스텀 HTML Element가 있을 것이다. 그리고 이 커스텀 컴포넌트 안에는 사용자 인터페이스를 담당하는 것들이 존재한다.
- 프로젝트 앱이 커질 수록 이 컴포넌트 트리도 복잡하고 커지게 된다.
- 가장 최상 위에 위치하고 있는 `App.js` 같은 컴포넌트(component)만이 ReactDOM render의 지시를 통해 HTML 페이지에 직접 만들어진다.
- 컴포넌트(component) 이름은 대문자로 시작하는 것이 보편적이며, 여러 단어를 섞어서 쓸 때는 각 단어를 대문자로 시작하는 카멜 케이스를 사용한다.
- 컴포넌트가 어떻게 React에서 사용되는 것일까? React에서 컴포넌트는 자바스크립트 함수일 뿐이다.(중요)
- React에서는 특별한 함수, 특별한 리턴 그리고 특별한 코드를 리턴하지만 그럼에도 여전히 HTML 코드를 리턴하는 JavaScript 함수일 뿐임을 기억해야 한다.

- `ExpenseItem` 이라는 커스텀 컴포넌트 파일(`ExpenseItem.js`)을 생성해보자.

```js
import React from "react";

const ExpenseItem = () => {
  return <h2>Expense Item</h2>;
};
export default ExpenseItem;
```

- `App.js`에서 import 하여 `ExpenseItem` 컴포넌트를 가져와서 사용한다.

```js
import ExpenseItem from "./components/ExpenseItem";

function App() {
  return (
    <div>
      <h2>Let's get started!</h2>
      <ExpenseItem />
    </div>
  );
}

export default App;
```

- `App`에서 return 해주고 있는 일반적인 HTML Element와 `ExpenseItem` 컴포넌트(component)의 차이점이라면 컴포넌트는 소문자로 시작하는 HTML Element와는 달리 대문자로 시작하는 것이다. JSX의 이러한 규칙에 따라서 React가 이러한 커스텀 컴포넌트(component)를 감지할 수 있게 만들어준다.

</br>

## 더 복잡한 JSX 코드 작성하기

- 기존에 생성한 `ExpenseItem` 컴포넌트에 날짜, 제목, 비용의 총량까지 더해 표기하기 위해서 조금 더 복잡한 HTML 코드를 작성해보자.

```js
const ExpenseItem = () => {
  return (
      <div>Date</div>
      <div>
        <h2>Title</h2>
        <div>Amount</div>
      </div>
  );
};
```

- 하지만 이렇게 작성하였을 때, 유효하지 않은 코드라는 error가 출력된다. 왜냐하면, React 컴포넌트(component)에는 아주 중요한 규칙을 지키지 않았기 때문이다. (이는 HTML과 return한 JSX 코드와 컴포넌트에 관한 문제이다.)
- React 컴포넌트(component)에서는 작성된 HTML 코드가 하나의 최상위 요소(element)로 감싸져있어야 한다는 규칙이 있다. 즉, 하나의 return 명령어 당 하나의 요소(element)만 가져야 한다는 뜻이며, 또는 하나의 JSX 코드 당 하나의 요소(element)만 가져야 한다는 뜻이기도 하다. 그렇기에 현재 작성된 HTML 코드에서는 `div`라는 두개의 최상위 태그를 가지고 있기 때문에 error가 발생한 것이다.

```js
const ExpenseItem = () => {
  return (
    <div>
      <div>Date</div>
      <div>
        <h2>Title</h2>
        <div>Amount</div>
      </div>
    </div>
  );
};
```

![image](https://user-images.githubusercontent.com/53133662/155303587-475ce15c-8f7e-45fe-b52c-37c1289c32ee.png)

- 현재 작성된 HTML 코드에 `div`를 최상위 태그로 감싸주면 다시 유효하게 작동됨을 확인할 수 있다.

</br>

## 기본 CSS 스타일 추가하기

- React 구문에서는 `class`가 아니라 `className`으로 사용한다.
- 적용하고자 하는 css 파일은 적용할 JavaScript 파일 옆에 추가하면 된다.
- 적용하고자 하는 css 파일은 적용할 JavaScript 파일에서 `import "./style.css"`로 import를 해와서 적용한다.

</br>

## JSX에서 동적 데이터 출력 및 표현식 작업하기

- 컴포넌트(component)는 단순히 분리의 문제가 아니라, 재사용성에 관한 문제이다.
- 컴포넌트(component)를 생성한 뒤 그것을 재사용하길 원한다면 하드 코드가 아니라, 동적으로 데이터를 출력할 수 있도록 수정하는 작업이 필요하다.
- 하드 코드로 입력한 `ExpenseItem` 컴포넌트(component)를 동적으로 데이터를 출력할 수 있도록 수정해보자.

### (before) ExpenseItem

```js
return (
  <div className="expense-item">
    <div>March 28th 2022</div>
    <div className="expense-item__description">
      <h2>Car Insurance</h2>
      <div className="expense-item__price">$294.67</div>
    </div>
  </div>
);
```

- React의 컴포넌트(component)는 함수라는 사실을 잊지 말자. 컴포넌트라는 건 HTML과 CSS, JavaScript로 구성되어 있으며, JavaScript는 컴포넌트 함수가 return 하기 전에 추가해야 한다.

```js
const expenseDate = new Date(2022, 2, 28); // 날짜 객체
const expenseTitle = "Car Insurance";
const expenseAmount = 294.67;
```

- 먼저, 동적으로 데이터를 입력받을 수 있는 상수값(날짜, 제목, 비용)들을 추가했다.

```js
 <h2>{expenseTitle}</h2>
 <div className="expense-item__price">${expenseAmount}</div>
```

- 상수로 선언한 `expenseTitle`과 `expenseAmount`를 해당 표기하고자 하는 JSX 코드 블럭(HTML 태그 사이) 안에 중괄호를 사용해서 넣어주었다.
  - 하드 코드 데이터는 JSX 코드 블럭 안에서 여닫는 중괄호를 사용하여 표기해준다.
  - JSX 코드 블럭의 중괄호 안에서는 기본적으로 JavaScript를 작성할 수 있다.

```js
<div>{expenseDate.toISOString()}</div>
```

- 상수로 선언한 `expenseDate`(날짜)도 넣어주자.
  - `new Date()`로 가져온 `expenseDate`의 상수 값은 객체이므로 중괄호 안에 바로 `expenseDate`를 넣어주지 않고, `toISOString()` 메소드를 통해 변환해준다.
    > `toISOString()`은 주어진 날짜를 국제표준시 기준 ISO 8601 형식으로 표현한 문자열을 반환해주는 메소드이다.
    > [MDN 문서 참조: toISOString()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)

### (after) ExpenseItem

```js
const expenseDate = new Date(2022, 2, 28);
const expenseTitle = "Car Insurance";
const expenseAmount = 294.67;
return (
  <div className="expense-item">
    <div>{expenseDate.toISOString()}</div>
    <div className="expense-item__description">
      <h2>{expenseTitle}</h2>
      <div className="expense-item__price">${expenseAmount}</div>
    </div>
  </div>
);
```

</br>

## props를 통해 데이터 전달하기

- 생성한 컴포넌트를 `App.js`에서 반복하여 재사용해보자.

### App.js

```js
return (
  <div>
    <h2>Let's get started!</h2>
    <ExpenseItem />
    <ExpenseItem />
    <ExpenseItem />
    <ExpenseItem />
  </div>
);
```

- `ExpenseItem`라는 컴포넌트(component)를 네번 추가했다.
- `yarn start`로 확인해보면, 동일한 데잍러를 가진 `ExpenseItem` 컴포넌트 블럭이 4개 추가됐음을 확인할 수 있다. 이렇듯, 원하는 만큼 컴포넌트를 추가해서 재사용하면 된다.
- 근본적으로 동일한 데이터를 가진 `ExpenseItem` 컴포넌트를 사용했기 때문에, 컴포넌트를 재사용했다고는 볼 수 없을 것이다. 이를 해결하기 위해, 리액트에서는 `props`라는 개념을 이용한다.

### props

- `props`는 프로퍼티를 뜻한다.
- 우리는 `props`라는 개념을 이용해서 최상위 컴포넌트에서 지정한 데이터를 커스텀 컴포넌트에 전달할 수 있다.

- 이제 `ExpenseItem` 컴포넌트에서 각기 다른 데이터를 받아오기 위해 `App.js`에서 커스텀 컴포넌트에 전달할 데이터를 배열로 담아준다.

```js
const expenses = [
  {
    id: "e1",
    title: "Toilet Paper",
    amount: 94.12,
    date: new Date(2020, 7, 14),
  },
  { id: "e2", title: "New TV", amount: 799.49, date: new Date(2021, 2, 12) },
  {
    id: "e3",
    title: "Car Insurance",
    amount: 294.67,
    date: new Date(2021, 2, 28),
  },
  {
    id: "e4",
    title: "New Desk (Wooden)",
    amount: 450,
    date: new Date(2021, 5, 12),
  },
];
```

- 기본적으로 데이터는 내부에 저장되어 있으면 안되며, 외부에서 유입되어야 한다. 이러한 규칙을 지키기 위해 사용하는 게 바로 `props`라는 개념이다.
- 이제 `App.js` 에서 지정한 데이터인 `expenses`배열을 `ExpenseItem` 컴포넌트에 속성으로 전달해줘야 한다.

```js
      <ExpenseItem
        title={expenses[0].title}
        amount={expenses[0].amount}
        date={expenses[0].date}
      />
      <ExpenseItem
        title={expenses[1].title}
        amount={expenses[1].amount}
        date={expenses[1].date}
      />
      <ExpenseItem
        title={expenses[2].title}
        amount={expenses[2].amount}
        date={expenses[2].date}
      />
      <ExpenseItem
        title={expenses[3].title}
        amount={expenses[3].amount}
        date={expenses[3].date}
      />
```

- `ExpenseItem` 컴포넌트에서 해당 데이터 값을 사용하기 위해서는 전달받은 속성을 매개변수로 받아와야 한다.

```js
const ExpenseItem = (title, amount, date) => {...}
```

- 하나하나 속성 값을 매개변수로 받아올 수도 있지만, `props`로 하나의 매개변수를 받아올 수도 있다. React는 하나의 매개변수를 모든 컴포넌트에서 사용할 수 있도록 하기 때문이다. 이 하나의 매개변수는 모든 속성을 받은 객체가 된다. 그리고 이 모든 과정을 통틀어 `props`라고 할 수 있다.

```js
const ExpenseItem = (props) => {...}
```

- `props` 객체에는 `key`와 `value` 의 쌍이 존재한다. `App.js` 에서 `ExpenseItem` 컴포넌트로 보내는 매개변수는 `props` 객체로 받아오며, 이 객체 안에서 `key`는 속성의 이름을 정의하고 `value`는 전달하는 데이터 값을 의미한다.

```js
<div className="expense-item">
  <div>{props.date.toISOString()}</div>
  <div className="expense-item__description">
    <h2>{props.title}</h2>
    <div className="expense-item__price">${props.amount}</div>
  </div>
</div>
```

- `props`로 받은 매개변수를 사용할 때는 앞서 `App.js`에서 데이터를 보낼 때 정의한 `key` 값으로 접근하여 사용하면 된다.
- `props` 이름이나, 속성의 이름(`key`)은 직관적으로 정의하도록 해야 한다.
- React는 `props` 라는 개념을 이용하면서 React 컴포넌트 간에 데이터를 동적으로 공유할 수 있도록 하였다. 즉, 컴포넌트를 재사용할 수 있게 되는 것이다.

</br>

## 컴포넌트에 일반 JavaScript 논리 추가하기

- `props`는 유동적으로 `value`를 설정하는 데에만 국한되어 있지 않다.
- `props`은 단지 데이터를 컴포넌트로 보내고, 설정하고, 재사용할 뿐이다.

- 날짜 부분 코드 수정

```js
<div>
  <div>Month</div>
  <div>Year</div>
  <div>Day</div>
</div>
```

- 복잡한 로직 변수나 상수로 따로 분리하기

```js
const month = props.date.toLocaleString("en-US", { month: "long" });
const day = props.date.toLocaleString("en-US", { day: "2-digit" });
const year = props.date.getFullYear();
```

- 중괄호로 태그 안에 값(변수/상수) 넣어주기

```js
<div>
  <div>{month}</div>
  <div>{year}</div>
  <div>{day}</div>
</div>
```

### toLocaleString()

- toLocaleString 메서드는 배열의 요소를 나타내는 문자열을 반환합니다. 요소는 toLocaleString 메서드를 사용하여 문자열로 변환되고 이 문자열은 locale 고유 문자열(가령 쉼표 “,”)에 의해 분리됩니다.
- [MDN 문서 참조: Array.prototype.toLocaleString()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString)

> arr.toLocaleString([locales[, options]]);

```js
var number = 1337;
var date = new Date();
var myArr = [number, date, "foo"];

var str = myArr.toLocaleString();
console.log(str);
// '1337,6.12.2013 19:37:35,foo' 출력(log)
```

### getFullYear()

- getFullYear() 메서드는 주어진 날짜의 현지 시간 기준 연도를 반환합니다.
- [MDN 문서 참조: Date.prototype.getFullYear()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear)

  > dateObj.getFullYear()

```js
var today = new Date();
var year = today.getFullYear();
```

</br>

## 컴포넌트를 여러 컴포넌트로 분할하기

- 모든 빌딩 블록, 모든 컴포넌트는 단 하나의 핵심 기능에 집중해야 한다.
- 앱이 커질 수록 필연적으로 컴포넌트는 길어지거나 커질 수 밖에 없기 때문에, 컴포넌트를 더 작게 쪼개면서 결과적으로는 유지하고 관리하기 수월해지도록 분리하는 것이 좋다.

</br>
