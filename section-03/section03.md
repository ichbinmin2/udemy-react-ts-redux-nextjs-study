# React Basics & Working With Components

## 목차

- [What Are Components?](#컴포넌트란-무엇인가)
- [React Code Is Written In A "Declarative Way"!](#리액트-코드는-선언적-방식으로-작성되었습니다)
- [Creating a new React Project](#새로운-리액트-프로젝트-생성하기)
- [Analyzing a Standard React Project](#표준-리액트-프로젝트-분석하기)
- [Introducing JSX](#JSX-소개)
- [How React Works](#리액트의-작동-방식)

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
