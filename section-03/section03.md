# React Basics & Working With Components

## 목차

- [What Are Components?](#컴포넌트란-무엇인가)
- [React Code Is Written In A "Declarative Way"!](#리액트-코드는-선언적-방식으로-작성되었습니다)
- [Creating a new React Project](#리액트-코드는-선언적-방식으로-작성되었습니다)

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

- CRA(Create React App)를 설치하기 위해서는 비교적 최신 버전의 `Node.js`가 필요하다. 만약 `Node.js`가 설치되어 있지 않다면, 먼저 개개인의 사용자 환경에 맞는 버전으로 먼저 설치를 해주어야 한다. 리액트 앱 프로젝트는 `Node.js`를 이용해서 미리보기 서버를 만들 예정이다.
- `Node.js`는 최적화 과정을 위해서 그리고 앱을 만들기 위해서 반드시 필요하다.
- [Node.js](https://nodejs.org/ko/)
- [Create React App](https://create-react-app.dev/docs/getting-started)

```
yarn create react-app my-app
cd my-app
yarn start
```

- package.json 은 프로젝트와 관련된 개발 사항들이 버전별로 저장되어있다.
- node_modules 는 로컬 시스템에 다운된 서브 파트 패키지다.