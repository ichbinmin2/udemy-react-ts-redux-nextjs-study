# A Look Behind The Scenes Of React & Optimization Techniques

## 목차

- [How React Really Works](#리액트가-실제로-작동하는-방식)
- [Component Updates In Action](#컴포넌트-업데이트-실행-과정)
- [A Closer Look At Child Component Re-Evaluation](#자식-컴포넌트의-리렌더링-자세히-살펴보기)
- [Preventing Unnecessary Re-Evaluations with React.memo()](#React-memo로-불필요한-재평가-방지하기)
- [Preventing Function Re-Creation with useCallback()](#useCallback으로-함수-재생성-방지하기)
- [useCallback() and its Dependencies](#useCallback-및-종속성에-대하여)
- [A First Summary](#첫-번째-요약)
- [A Closer Look At State & Components](#State-및-컴포넌트-자세히-살펴보기)

## 리액트가 실제로 작동하는 방식

- 리액트는 어떻게 작동되는 걸까? 지금까지 우리가 리액트에 대해 학습한 바로는 사용자 인터페이스 구축을 위한 자바스크립트 라이브러리를 일컬으며, 리액트의 핵심은 컴포넌트라는 것이다. 우리는 사용자 인터페이스를 구축하기 위해서 컴포넌트를 사용하고, 리액트는 이 컴포넌트 개념을 채택했다. 그리고 리액트는 컴포넌트를 통해 사용자 인터페이스를 효과적으로 구성하며 컴포넌트를 통해 업데이트를 진행한다. 여기서 중요한 개념이 등장하는데, 바로 리액트 DOM 이란 개념이다.

### ReactDOM

- 결론부터 말하자면, ReactDOM 은 웹에 대한 인터페이스라고 볼 수 있다. 반면 React 자체는 웹에 대해서 잘 알지 못한다. 즉 브라우저와 전혀 관계가 없는 라이브러리라는 이야기다. 리액트는 어떻게 컴포넌트를 다루는지 알고 있지만 컴포넌트에 HTML 요소들이 포함되어 있는지 혹은 허구적인 요소들이 있는지에 대해서는 전혀 알지 못한다. 이는 ReactDOM의 역할이 실제 HTML 요소들을 화면에 표시하기 위한 것이라는 이야기이기도 하다. 리액트는 그저 컴포넌트를 관리하고 상태(state) 객체를 관리하며 다른 객체의 상태(state)와 컴포넌트가 업데이트 되어 모든 정보들을 (현재 사용중인) 인터페이스에 전달할 뿐이다. 그리고 이 인터페이스란 ReactDOM 같은 것을 말한다. 이렇듯, ReactDOM 은 브라우저의 일부인 실제 DOM에 대한 작업을 하기 때문에 사용자가 보고 있는 화면에 무언가를 표시할 때 사용된다.

### 리액트가 고려하거나 신경쓰는 것들(리액트의 핵심기능)

- 리액트는 핵심 기능(컴포넌트, props, 상태(state), context 등)만을 다룬다. 즉 리액트는 컴포넌트만 신경쓴다는 의미이다.
  - 컴포넌트에 전달하는 데이터인 props를 관리한다.
  - 컴포넌트 내부의 데이터인 상태(state)를 관리한다.
    > props는 컴포넌트의 구성을 가능하게 해주며 부모-자식 컴포넌트 간의 통신을 가능하게 하는 역할이다.
  - 컴포넌트 전체(전역) 데이터인 컨텍스트(context)도 관리한다.
- 컴포넌트 내부에서 사용되는 props 와 상태(state) 또는 컨텍스트(context)가 변경이 되면, 컴포넌트 역시 리액트를 통해서 변경되며 리액트는 이 컴포넌트가 화면에 새로운 것을 표시하고 있는지에 대해서 확인한다. 화면에 뭔가를 그리려고 한다면 리액트는 ReactDOM 에게 이런 정보를 전달해서 ReactDOM 이 업데이트된 화면을 표시할 수 있게 도와준다.

### 컴포넌트와 실제 DOM과의 통신은 어떻게 작동되고 있는 걸까?

- 최종적으로 리액트가 담당하는 역할이란 가상(Virtual)의 DOM 이라는 개념을 사용하는 것이라고 볼 수 있다.

### React의 가상(Virtual) DOM

- 리액트의 가상 DOM 은 어플리케이션이 마지막에 만들어내는 컴포넌트의 트리를 결정한다. 각각의 하위 트리를 가지고 있는 컴포넌트들은 JSX 코드를 반환하는데, 이 가상 DOM은 컴포넌트 트리의 현재 모양과 최종 모양을 결정 짓는다. 가령, 상태(state)가 업데이트되면 이 업데이트되는 정보는 ReactDOM 으로 전달되어 업데이트 이전과 이후(갱신 이후)의 상태(state) 차이를 인식하고 리액트가 컴포넌트 트리를 통해 구성한 가상의 스냅샷인 가상DOM 과 일치하도록 실제 DOM을 조작하는 방법을 알 수 있게 한다.

- 앞서 여러번 거론했다시피 리액트는 상태(state)나 props, 컨텍스트(context) 그리고 컴포넌트가 변경되면 컴포넌트 함수 자체가 재실행되기 때문에 리액트는 다시 렌더링을 해준다. 하지만 이 렌더링이 실제 DOM 전체를 다시 렌더링하는 것이 아님을 명심해야 한다. 그러니까 리액트에 의해 자동으로 컴포넌트 함수가 재실행된다고 해서 실제 DOM의 각 부분들이 다시 렌더링하는 것은 아니라는 의미이다. 재실행과 렌더링을 다룰 때 컴포넌트 부분과 리액트 부분, 그리고 실제 업데이트 되는 DOM(트리)를 구분해서 이해해야 한다.

- 컴포넌트는 상태, props, 컨덱스트가 변경될 때 리렌더링 된다. 하지만 다시 렌더링이 되어도 실제 DOM 은 React가 구성한 컴포넌트의 이전 상태와 현재 상태의 실질적인 차이점을 기반으로 실질적으로 업데이트 되는 부분이 있을 때만 변경-업데이트를 해준다. 즉, 실제 DOM 은 가상의 DOM 과 비교하여 업데이트가 필요하다고 '판단'이 될 때에만 업데이트를 해준다는 뜻이다.

### React의 성능 측면에서 버츄얼 돔은 어떤 역할을 할까?

- React가 각각의 컴포넌트 메모리에 가상 DOM을 가지고 있다는 것은 성능 측면에서 무엇을 의미할까? 매번 업데이트를 할 때마다 리로드를 하고, 실제 DOM을 사용해서 브라우저에 직접 렌더링하는 경우 성능 측면에서 많은 자원이 필요하게 된다. 실제 DOM 을 이용하는 작업은 어플리케이션의 성능에 과부화를 일으킬 가능성이 높기 때문이다. 하지만 이전과 현재의 상태를 가상 DOM을 사용해서 비교-계산하여 렌더링하는 경우에는 간편하기도 하거니와, 자원도 적게 든다. 즉 성능 면에서 우수한 퍼포먼스를 보여줄 수 있다.
- 이렇게 리액트는 가상 DOM 과 실제 DOM 의 비교를 통해 최종 스냅샷과 현재의 스냅샷을 실제 DOM에 전달하는 구조를 가지고 있다. 가상 DOM을 통해 2개의 스냅샷(최종 스냅샷, 현재의 스냅샷) 간의 차이점을 알아내고 실제 DOM에 렌더링하는 방식 말이다. 그래도 이해가 되지 않는다면, 우리는 예시 코드를 통해 비교하여 이해해볼 수 있을 것이다.

```js
<div>
  <h1>Hi there!</h1>
</div>
```

- 먼저 위의 간단한 코드는 해당 코드를 담은 컴포넌트를 실행한 시점의 최종 스냅샷 상태라고 생각해보자. 그리고 여기서 상태가 변경되어, 새로운 문장을 업데이트할 수 있도록 수정해보자.

```js
<div>
  <h1>Hi there!</h1>
  <p>This is New!</p>
</div>
```

- 첫 번째 코드와 비교해보면, `<h1>` 태그 밑에 새로운 `<p>` 태그가 추가된 것을 알 수 있다. 리액트는 이 두개의 스냅샷(최종 스냅샷, 현재 스냅샷) 간의 차이점이 이 `<p>This is New!</p>` 임을 확인한다. 그리고 이러한 변경 사실을 ReactDOM 에 전달하면 ReactDOM 은 실제 DOM을 업데이트하고 이 `<p>This is New!</p>`을 집어넣는다. ReactDOM 은 전체 DOM을 재렌더링 하지 않는다. 이전에 DOM 트리에 업데이트 되었던 최종 스냅샷 내부의 코드 `<h1>`과 `<div>`는 건드리지 않고, 다만 현재의 스냅샷과 최종 스냅샷과의 차이점인 `<p>This is New!</p>` 만을 추가해서 실제 DOM 트리에 업데이트하는 것이다. 이것이 바로 백그라운드에서 리액트가 작동하는 방식이다.

#### ✓ 리액트의 가상 돔(버츄얼 돔) 정리

- 리액트의 가상돔은 상태(state)가 변경될 때마다 렌더링이 일어나고 업데이트가 되는 비효율적인 방식을 방지하기 위해 등장한 개념입니다. 리액트의 컴포넌트는 가상의 돔 트리로 리액트의 메모리에 저장되어 있으며 바로 돔 트리에 업데이트 되지 않습니다. 컴포넌트에 변동 사항이 생겨 render 함수가 호출되면 리액트는 이전의 돔 트리와 비교해서 **실질적으로 어떤 부분이 업데이트 되어야 하는지 파악**하고, 필요한 부분만 돔 트리에 업데이트를 합니다. render 함수가 여러번 업데이트-호출이 되어도 **실질적으로 보여지는 데이터가 변동**되지 않으면, 이 돔 Tree에는 전혀 영향을 주지 않습니다. 그렇기에 render 함수가 여러번 호출이 되어도 React의 성능에 큰 영향을 끼치지 않습니다.

</br>

## 컴포넌트 업데이트 실행 과정

- 실제 어플리케이션을 보면서 컴포넌트 업데이트 실행 과정과 함수 업데이트 이후 실제 DOM에 어떻게 적용되는지 확인해볼 것이다.

```js
<div className="app">
  <h1>Hi there!</h1>
</div>
```

- 현재 `App.js` 에는 간단한 `<div>` 와 `<h1>` 태그가 들어있다.

```js
<div className="app">
  <h1>Hi there!</h1>
  <p>This is New!</p>
</div>
```

- 그리고, `<p>This is New!</p>` 가 추가되어야 한다고 생각해보자. 어떻게 하면, 처음에는 문장을 표시(추가)하지 않은 상태에서 어떤 시점을 기점으로 문장을 표시(추가)할 수 있을까? 이때 우리가 늘 사용하는 상태(state)를 이용한 방법이 떠올렸다면 정답이다. 상태(state)와 상태(state) 업데이트 함수를 이용해서, 처음에는 `<p>` 태그의 문장이 표시되지 않다가 해당 상태(state)의 업데이트를 트리거하는 기능(버튼을 클릭하거나, 타이머를 작동시킨다거나)에 따라서 `<p>` 태그의 문장이 표시되도록 할 수 있기 때문이다.

```js
const [showParagraph, setShowParagraph] = useState(false);
```

- 먼저, 기본 값을 false 로 갖는 `useState` 상태(state)를 설정한다. 앞서 누누히 말했듯이 리액트는 상태(state)나 props, 컨텍스트(context) 변경 시에만 컴포넌트 함수를 재실행하고 재 렌더링 한다. 현재 우리가 작성하고 있는 컴포넌트는 root 컴포넌트로 props나 컨텍스트(context)로는 거의 바뀌지 않을 가능성이 높다. 따라서 우리는 지금 상태(state) 변화를 이용해서 앞서 설명한 이론적 이야기들을 추상적인 이해가 아닌 실질적인 이해로 확인할 수 있을 것이다.

```js
<div className="app">
  <h1>Hi there!</h1>
  {showParagraph && <p>This is New!</p>}
</div>
```

- `showParagraph` 상태(state)와 `setShowParagraph` 상태(state) 업데이트 함수를 이용해서, 즉 이전에 배운 조건부 식을 이용해서 `showParagraph`가 true 일 때만 `<p>` 태그의 문장이 표시되도록 수정해주었다. `showParagraph` 상태(state)의 초기 값이 false 이므로, 처음 페이지를 렌더링하면, `<p>` 태그의 문장은 보이지 않을 것이다. 이제 `<p>` 태그의 문장을 보일 수 있게끔 `showParagraph` 상태(state) 값을 변경해보자.

#### Button.js

```js
const Button = (props) => {
  return (
    <button
      type={props.type || "button"}
      className={`${classes.button} ${props.className}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};
```

#### App.js

```js
import Button from "./components/UI/Button/Button";

...
<div className="app">
  <h1>Hi there!</h1>
  {showParagraph && <p>This is New!</p>}
  <Button onClick={}>Toggle Paragraph!</Button>
</div>
```

- 기존에 있던 `Button` 컴포넌트를 import 하고 onClick 이라는 prop으로 (상태를 변화시키는)트리거 함수를 실행할 수 있도록 바인드 한다.

```js
const toggleParagraphHandler = () => {
  setShowParagraph((prevParagraph) => !prevParagraph);
};
...
  <Button onClick={toggleParagraphHandler}>Toggle Paragraph!</Button>
```

- `showParagraph` 상태(state)의 업데이트 함수인 `setShowParagraph()`를 불러오고, 해당 트리거 함수가 `Button` 컴포넌트의 onClick 이벤트로 트리거 될 때마다 기존의 상태(`prevParagraph`)의 반댓값(`!prevParagraph`)으로 업데이트하도록 작성한다.

```css
.app {
  ...
  text-align: center;
}
```

- 조금 더 예쁘게 보이도록 CSS 도 추가해준다.
- 이제 Toggle Paragraph! 버튼을 누르면 This is New! 라는 문장이 나타나고, 다시 이 버튼을 누르면, This is New! 문장은 사라진다.

![ezgif com-gif-maker (49)](https://user-images.githubusercontent.com/53133662/165295981-5bf1bd4e-f4a9-47eb-9065-d11b34ebd290.gif)

### 작동 방식 분석하기

- 함수가 업데이트되는 작동 방식을 분석하기 위해서 `App` 컴포넌트에 간단한 로그를 작성해보자.

```js
console.log("APP RUNNING");

const toggleParagraphHandler = () => {
  setShowParagraph((prevParagraph) => !prevParagraph);
};
```

- `console.log("APP RUNNING");`를 추가해서 버튼을 누를 때마다 "APP RUNNING" 문구를 콘솔로그에 출력하도록 했다.

![스크린샷 2022-04-26 오후 10 07 58](https://user-images.githubusercontent.com/53133662/165306840-4ec90b05-baed-4d3b-bc73-873c86376774.png)

- 저장 후 콘솔 화면을 보면 실행 문구("APP RUNNING")가 뜨는 걸 확인할 수 있다. 리액트가 `App` 컴포넌트를 화면에 최초로 렌더링했기 때문이다. 그리고 첫 렌더링을 하면서 리액트는 `<div>`와 `<h1>` 요소 그리고 `<Button>`이 필요하다는 것을 알게 되었다. 우리가 조건부 식으로 작성했던 `<p>`의 문장들은 표시되지 않는다. `<p>`의 문장이 true 일 때만 표시하도록 컨트롤하는 상태(state) 값의 초기 값은 false 이기 때문이다. 리액트가 `App` 컴포넌트를 처음으로 렌더링한 이후 출력할 것은 없다. 즉 이전 스냅샷은 존재하지 않는다. 따라서 차이점을 비교하는 과정에서 `<div>`와 `<h1>` 요소 그리고 `<Button>`가 다시 렌더링하게 된다. 그리고 이 정보가 ReactDOM 패키지로 전달되며 화면에 렌더링 결과가 표시된다.

![ezgif com-gif-maker (50)](https://user-images.githubusercontent.com/53133662/165301945-41c61cb8-6e4d-47e7-a82b-0d5636cd1b30.gif)

- 버튼을 누르면 또 다시 "APP RUNNING" 가 출력된다. 이렇게 매 번 상태(state) 변경이 일어날 때마다 `App` 컴포넌트는 재실행되며 다시 렌더링 된다. 그렇다면, 실제 DOM 에는 어떤 영향을 끼칠까? 라이브 서버를 열고, 개발자 도구의 Elements 탭을 확인해보자.

![ezgif com-gif-maker (51)](https://user-images.githubusercontent.com/53133662/165307352-5c2476ae-7cd3-4481-ab95-94204d1d4b6c.gif)

- 페이지를 로드하면 개발 창에 `<div>`와 `<h1>` 요소 그리고 `<Button>` 요소가 존재하고 있음을 확인할 수 있다.

  > 개발 툴의 Elements 탭은 DOM 에서 발생한 변경 요소들을 강조해서 표시해준다. 이를 통해 실제 DOM이 새로 렌더링 되거나 갱신된 요소들을 볼 수 있는 것이다.

- `<Button>`을 클릭하면, `<p>` 부분이 강조되어 표시되는 걸 알 수 있다. 반면 기존의 `<div>`와 `<h1>`, `<Button>` 요소들은 이전과 그대로이다. 다시 `<Button>`을 클릭하면 `<div>` 요소가 강조 표시 된다. 이 안에 있는 `<p>` 요소가 사라졌기 때문이다. 이처럼 실제 DOM을 통한 업데이트는 리액트의 가상 DOM 과 최종 스냅샷을 저장하고 있는 실제 DOM 과의 차이점만 반영되는 것이다.

  </br>

## 자식 컴포넌트의 리렌더링 자세히 살펴보기

- 먼저 components 폴더에 하위 폴더 `Demo`를 만들고, 여기에 새로운 파일 `DemoOutput.js` 컴포넌트를 생성한다.

#### DemoOutput.js

```js
const DemoOutput = (props) => {
  return;
};
```

- 그리고 `App` 컴포넌트의 조건식 `<p>` 문장을 제거하고, `DemoOutput` 컴포넌트에 넣어준다.

```js
const DemoOutput = (props) => {
  return <p>This is New!</p>;
};
```

- props 로 전달받은 `show` 상태(state)를 기반으로 조건식 `<p>` 태그 속 문장을 렌더링한다.

```js
const DemoOutput = (props) => {
  return <p>{props.show ? "This is New!" : ""}</p>;
};
```

- 다시 `App` 컴포넌트로 돌아와서, `DemoOutput` 컴포넌트를 import 하고, 직전에 지워준 코드 위치에 위치시킨 뒤, show 라는 필드의 props로 `showParagraph` 상태(state) 값을 넘겨준다.

```js
<div className="app">
  <h1>Hi there!</h1>
  <DemoOutput show={showParagraph} />
  <Button onClick={toggleParagraphHandler}>Toggle Paragraph!</Button>
</div>
```

- 이제 `DemoOutput` 컴포넌트에 props 로 넘겨준 show의 상태값에 따라 기본 값은 false가 될 것이고, 버튼을 클릭하면 true로 상태값이 업데이트 되어 `<p>` 태그 내부의 문장이 출력될 것이다.
- `DemoOutput` 컴포넌트는 항상 렌더링 되고, `DemoOutput` 컴포넌트 안에서는 `<p>` 태그가 항상 렌더링 되지만, `<p>` 태그 내부의 문자열은 `props.show`에 따라 달라지는 것이다.

![ezgif com-gif-maker (52)](https://user-images.githubusercontent.com/53133662/167646274-b8ee911a-0931-457f-94d9-702f7618d672.gif)

- 저장하고 화면으로 돌아가면, 이전과 같은 행동을 하고 큰 차이도 없음을 확인할 수 있다. 하지만 개발자 도구의 `Elements` 탭에서 이전과는 차이점이 있음을 알 수 있는데,

![ezgif com-gif-maker (53)](https://user-images.githubusercontent.com/53133662/167647294-56b1c2d9-322d-4d5e-a2ef-b1fcd38246f1.gif)

- 화면을 렌더링하자마자 `DOM`을 확장해서 보면 `<p>` 태그 요소가 항상 표시되어 있다는 것이다. 하지만 버튼을 클릭하면 이번에는 `<p>` 태그가 깜빡이고, 다시 클릭하면 `<p>` 태그 역시 다시 깜빡인다.

- `<p>` 태그가 깜빡이는 이유는 텍스트의 추가와 삭제가 `<p>` 태그 요소 안에서만 이루어지기 때문이다. 이것은 전체 요소에 대한 변경으로 간주되며 텍스트가 아닌 `<p>` 태그가 깜빡이는 이유는 이 텍스트가 `<p>` 태그의 `props`와 동일하기 때문이다. 물론, 이를 컨텍스트라고 할 수도 있겠지만 이것은 엄연히 `<p>` 태그이다.

- 이 말인 즉슨, 이 `<p>` 태그는 현재 `<p>` 태그의 위 아래에 위치한 `<h1>` 이나 `<button>` 같은 일반적인 태그 요소가 아니라는 뜻이다. 왜냐하면, 리액트의 업데이트 매커니즘은 가상의 `DOM` 과 실제 DOM의 실질적인 차이점을 비교하여 실행되어야 하기 때문이다.
  > 물론, `App` 컴포넌트의 상태는 계속 바뀌나 실제로 바뀌는 부분은 다른 컴포넌트의 일부분이다.
- 이 사례는 리액트가 가상의 `DOM`을 사용하여 끊임없이 실제의 `DOM`과 계속 비교 작업을 하고 이를 기반으로 실제 `DOM`을 업데이트를 한다는 증거가 된다.

#### App.js

```js
console.log("APP RUNNING");

const toggleParagraphHandler = () => {
  setShowParagraph((prevParagraph) => !prevParagraph);
};
```

![ezgif com-gif-maker (54)](https://user-images.githubusercontent.com/53133662/167649289-e59e9076-360b-4bfe-9561-a1512f7fda05.gif)

- 다시 개발자 도구의 `Console`로 이동해서 페이지를 새로고침하면, 아까의 `APP RUNNING` 문구가 출력되고 버튼을 클릭할 때마다 문구가 추가로 확인된다. 실제 변경은 `DemoOutput`에서 발생하지만 `props.show`에 대한 상태(state)를 관리하고 있는 `App` 컴포넌트 역시 다시 실행되는 것이다.

- 상태(state)나 props 또는 컨텍스트를 관리하는 컴포넌트는 자식 컴포넌트에서 해당 상태(state)를 변화시킨다고 해도, 재실행-리로드 된다. 현재 `show`라는 상태(state)를 관리하고 있는 건 `App`이기 때문에, `App`에서 관리되는 상태(state)에 따른 변경이 다른 컴포넌트에 시각적으로 영향을 줬을 때 당연히 `App` 컴포넌트가 재실행되거나 리로드 되는 것이다. 결과적으로 `App`이 이 모든 변화의 상태(state) 관리를 하고 있기 때문이다.

```js
const DemoOutput = (props) => {
  console.log("DemoOutput RUNNUNG");
  return <p>{props.show ? "This is New!" : ""}</p>;
};
```

- `DemoOutput` 컴포넌트에 "DemoOutput RUNNUNG" 을 출력하도록 `console.log`를 추가한다.

![ezgif com-gif-maker (55)](https://user-images.githubusercontent.com/53133662/167651802-c0f1eb0e-32cc-4e06-8edf-0b45edfcbe05.gif)

- 페이지를 재실행하면, "APP RUNNING" 과 "DemoOutput RUNNUNG" 가 로그에 출력되는 걸 확인할 수 있다. `APP`과 `DemoOutput` 컴포넌트가 최초로 브라우저에 렌더링 됐을 때 출력되는 문구들이다. 그리고 매번 버튼을 클릭할 때마다 "DemoOutput RUNNUNG" 이 출력된다. 버튼을 클릭할 때마다 `show`라는 `props`가 변경되기 때문에 `APP`과 `DemoOutput` 컴포넌트 역시 그에 따라서 재실행 된다는 뜻이다.

### props 와 자식 컴포넌트의 리렌더링

#### App.js

```js
<DemoOutput show={showParagraph} />
```

- 먼저, `DemoOutput` 컴포넌트에 `show` prop 으로 전달하던 상태(state) 값인 `showParagraph`를 수정해주자.

```js
<DemoOutput show={false} />
```

- `DemoOutput` 컴포넌트에 전달하던 `show`의 값을 false로 바꿔준 것이다. `onClick` 이벤트로 `showParagraph` 상태(state) 값을 변경은 해주고 있지만 `showParagraph` 값을 가시화하는 `DemoOutput`에 이 업데이트 된 `showParagraph` 값을 전달해주지 않고 있다. 결과적으로 어떻게 될까? 페이지를 재실행해보자.

![ezgif com-gif-maker (56)](https://user-images.githubusercontent.com/53133662/167655886-e6bc5aeb-f846-4da1-837c-40e555878d25.gif)

- 페이지를 새로고침 한 뒤에 각각의 컴포넌트에서 설정한 콘솔 로그 문구가 출력된다. `App` 과 `DemoOutput` 컴포넌트 모두 렌더링 되고 난 후 버튼을 누르면 다시 동일하게 각각의 컴포넌트에서 설정한 콘솔 로그 문구가 출력된다. 버튼을 누를 때마다 말이다.

### props 값은 변화되지 않았지만 `DemoOutput` 컴포넌트가 리렌더링 되는 이유

- `App` 컴포넌트에서 `DemoOutput` 컴포넌트에 전달하던 `show`의 값을 props 값을 false로 고정을 해주었음에도 불구하고 `DemoOutput` 컴포너트가 리렌더링 되는 걸 확인할 수 있다. 왜 그럴까? 하나하나 짚어보도록 하자.

- 버튼을 누를 때마다 `App` 컴포넌트는 `showParagraph` 상태(state)가 변경되기 때문에 당연하게도 리렌더링 된다.

```js
return (
  <div className="app">
    <h1>Hi there!</h1>
    <DemoOutput show={false} />
    <Button onClick={toggleParagraphHandler}>Toggle Paragraph!</Button>
  </div>
);
```

- `App` 컴포넌트는 무엇을 반환할까? 당연히 `JSX` 코드를 반환한다. 여기에 있는 모든 JSX 요소들은 결국 컴포넌트 함수에 대한 함수 호출과 동일하다. 이말인 즉슨, `App` 컴포넌트가 반환하는 JSX 요소들 안에 있는 `DemoOutput` 이나, `Button` 컴포넌트 등을 호출하고 있다는 뜻이다. `App` 컴포넌트에서 관리하고 있는 상태(state)가 변화할 때마다 `APP` 컴포넌트가 리렌더링되는 것처럼, `App` 컴포넌트에서 반환하는 다른 컴포넌트(`DemoOutput`, `Button`) 역시 동일하게 리렌더링 된다는 뜻이다.

- 부모 컴포넌트 함수가 리렌더링 되면, 마찬가지로 자식 컴포넌트 함수도 리렌더링 된다. 따라서 props의 값은 이 리렌더링과 관련하여 상관이 없다고 할 수 있을 것이다.

### props 의 변경

- props 의 변화는 실제 `DOM`의 업데이트로 이어질 수는 있으나, 컴포넌트 함수에서 리렌더링을 할 때는 부모 컴포넌트가 리렌더링 되는 것만으로 충분하다. 그러니 `DemoOutput` 컴포넌트가 리렌더링되는 것이 실제 `DOM`이 업데이트된다는 것과 동일한 뜻은 아닐 것이다.

![ezgif com-gif-maker (57)](https://user-images.githubusercontent.com/53133662/167662131-53f692b8-7b68-402d-8890-93e19537d6c4.gif)

- 개발자 도구의 `Element`를 확인해보면, 버튼을 아무리 눌러도 해당 요소들 중 그 어느 것도 반짝이지 않는 걸 확인할 수 있다. 앞서 여러 번 거론한 것처럼 컴포넌트의 리렌더링과 컴포넌트 함수의 리렌더링이 일어나도, 실제 `DOM`이 다시 렌더링되거나 변경되는 것은 아니기 때문이다.
- 부모 컴포넌트가 재실행되면, 자식 컴포넌트 역시 리렌더링 된다. 따라서 `App` 컴포넌트가 재실행될 때마다 `DemoOutput` 컴포넌트 뿐만이 아니라, `Button` 컴포넌트 역시 리렌더링 된다. 만약 `App` 컴포넌트에서 반환하는 자식 컴포넌트인 `DemoOutput` 컴포넌트 내부에서 또 다른 자식 컴포넌트를 반환한다면, 그 컴포넌트 역시 `App` 컴포넌트가 재실행될 때마다 리렌더링 될 것이다.

### 정리

- 이렇게 컴포넌트 트리로 뻗어나가는 컴포넌트가 리렌더링 되는 것을 볼 때마다 의문이 생길 수도 있다. `App` 컴포넌트에 연결된 모든 자식 컴포넌트 함수가 동시에 리렌더링 되면, 성능에 영향을 미치지는 않을까 하는 의문 말이다. 하지만 기억하자. 리액트는 가상의 `DOM`과 실제 `DOM`을 비교하여 실질적으로 변한 부분만 업데이트를 한다.

- 방금 전 예시를 봤듯이, `DemoOutput` 컴포넌트는 변경되지 않았으므로 `DemoOutput` 컴포넌트는 재평가 되지 않는다. 만약 `DemoOutput` 컴포넌트에 prop 으로 내려주던 값을 지운다면, `App` 컴포넌트의 상태(state) 변경이 없으므로 출력 결과 역시 바뀌는 것이 없을 것이다. 그럼에도 불구하고, `DemoOutput` 컴포넌트와 같은 자식 컴포넌트를 리렌더링 하는 것은 아마도 불필요한 낭비가 될 수 있다.

</br>

## React memo로 불필요한 재평가 방지하기

- 사실 이런 간단한 앱에서는 몇 개의 자식 컴포넌트를 리렌더링하는 것은 성능 면에서 크게 문제가 되지 않을 수도 있다. 하지만 이보다 큰 어플리케이션이라면 자식 컴포넌트는 더 복잡하고 다양하게 많아질 것이고, 리렌더링으로 인한 성능을 고려하지 않을 수 없다. 좀 더 최적화가 필요하다는 이야기다. 따라서 개발자는 특정한 상황일 경우에만 자식 컴포넌트를 리렌더링 하도록 React 에 지시할 수 있어야 할 것이다.

### React.memo() 사용하기

- 앞서 거론한 특정한 상황이란 무엇일까? 예를 들면, 자식 컴포넌트가 부모 컴포넌트로 부터 받은 props 가 변경되었을 때를 생각해보자.

#### App.js

```js
<DemoOutput show={false} />
```

- `App` 컴포넌트에서 `DemoOutput` 컴포넌트로 전달하는 `show` 부분을 다시 불러오면, React는 `show` 상태(state) 값이 바뀔 때에만 `DemoOutput` 컴포넌트를 리렌더링을 할 수 있다면 이것이 특정한 상황이라고 말할 수 있을 것이다. 그렇다면, 우리는 어떻게 React 에 '특정한 상황' 일 때만 자식 컴포넌트를 리렌더링 할 수 있도록 지시할 수 있을까?

- 먼저, props가 바뀌었는지 확인할 컴포넌트를 지정한 뒤

#### DemoOutput.js

```js
const DemoOutput = (props) => {
  console.log("DemoOutput RUNNUNG");
  return <MyParagraph>{props.show ? "This is New!" : ""}</MyParagraph>;
};

export default DemoOutput;
```

- 이것을 통째로 warp 해주면 된다.

```js
const DemoOutput = (props) => {
  console.log("DemoOutput RUNNUNG");
  return <MyParagraph>{props.show ? "This is New!" : ""}</MyParagraph>;
};

export default React.memo(DemoOutput);
```

- 이렇게 `React.memo()` 로 warp을 해주는 것은 함수형 컴포넌트에서만 가능하다. 클래스 기반의 컴포넌트의 경우 작동하지 않는다.

- `React.memo()`는 함수형 컴포넌트를 최적화한다. 이 `memo()`는 어떤 역할을 할까? `React.memo()`는 인자로 들어간 컴포넌트에 어떤 props가 입력되는지를 확인하고, 입력되는 모든 props의 새로운 값을 확인한 뒤 이를 기존의 props 값과 비교하도록 React에 전달하는 역할을 한다. 그리고 props의 값이 바꾸니 경우에만 컴포넌트를 재실행 및 재평가 한다.

- 즉, 부모 컴포넌트가 변경되었지만 `React.memo()`로 감싼 컴포넌트의 props가 변하지 않았다면 이 컴포넌트의 재실행은 건너뛰게 되는 것이다.

![ezgif com-gif-maker (60)](https://user-images.githubusercontent.com/53133662/168254207-65545604-8021-4a06-85c7-2160428106ba.gif)

- 저장하고 콘솔을 확인해보자. 최초에 어플리케이션이 렌더링되면, `DemoOutput` 컴포넌트에서 출력하는 텍스트인 "DemoOutput RUNNUNG" 도 함께 출력된다. 하지만 콘솔을 초기화한 뒤 버튼을 누르면 "APP RUNNING" 와 "Button RUNNING" 는 출력되지만 "DemoOutput RUNNUNG"는 출력되지 않는 것을 볼 수 있다. `MyParagraph` 컴포넌트는 `React.memo()`로 감싼 `DemoOutput` 컴포넌트의 자식 컴포넌트이므로 이 또한 출력되지 않는다.

- 이렇게, 불필요한 재렌더링을 피하기 위해 `React.memo()`를 사용하여 최적화를 진행했다. 그리고 우리는 여기서 새로운 질문을 마주치게 된다. 이렇게 렌더링 최적화가 가능하다면, 왜 모든 컴포넌트에 적용하지 않는 걸까?

### 왜 모든 컴포넌트를 최적화하지 않는가

- 최적화에는 비용이 따른다. 이 `React.memo()`는 어플리케이션에 변경이 일어날 때마다 발생한다. 그리고 `App` 컴포넌트가 렌더링이 될 때마다 `React.memo()`로 감싼 컴포넌트로 이동하여, 기존의 props 값과 새로운 props 값을 비교한다. 그러면 React는 여기서 두 가지 작업이 필요하다. 먼저, 기존의 props 값을 저장할 공간이 필요하고 비교하는 작업이 첫 번째이고 두번째로 이 각각의 작업에서 개별적인 성능 비용이 필요하다. 따라서 이 성능 효율은 어떤 컴포넌트를 최적화하느냐에 따라 달라진다.

### `React.memo()`로 이루어지는 성능 비용의 교환

- 우리가 `React.memo()` 를 사용하여 특정 컴포넌트를 감싼다면, 매번 컴포넌트를 리렌더링하는 데에 필요한 **성능 비용**과, `React.memo()`로 감싼 특정 컴포넌트의 props를 비교하는 **성능 비용**을 서로 맞바꾸는 것과 동일하다.

- 그리고 이런 비용은 특정 컴포넌트에 필요한 props의 갯수와 해당 컴포넌트의 복잡도, 그리고 해당 컴포넌트가 가지고 있는 자식 컴포넌트의 숫자에 따라 달라지는 것이므로 둘 중 어느 쪽의 비용이 항상 높다고 말하는 것은 불가능하다. 물론, 자식 컴포넌트가 많아서 컴포넌트 트리가 크다면 이 `React.memo()`는 매우 유용하게 쓰일 수 있지만 말이다. 또한 컴포넌트 트리의 상위에 위치해 있다면 전체 컴포넌트 트리에 대한 불필요한 재렌더링을 막을 수 있다.

```js
const DemoOutput = (props) => {
  console.log("DemoOutput RUNNUNG");
  return <MyParagraph>{props.show ? "This is New!" : ""}</MyParagraph>;
};

export default React.memo(DemoOutput);
```

- 지금처럼 `DemoOutput` 컴포넌트를 `React.memo()`로 감싸면서 자동적으로 `DemoOutput` 컴포넌트의 자식 컴포넌트인 `MyParagraph` 컴포넌트의 리렌더링도 피할 수 있는 것처럼 말이다.

### `React.memo()` 가 필요하지 않는 경우

- 위의 사례와는 반대로 부모 컴포넌트를 매 번 재평가할 때마다 컴포넌트의 변화가 있거나 props의 값이 변화할 수 있는 가능성이 높은 컴포넌트라면 `React.memo()` 메소드는 크게 의미를 갖지 못할 것이다. 왜냐하면 `React.memo()` 메소드를 사용하더라도, 해당 컴포넌트의 재렌더링이 어떻게든 이루어지기 때문이다. 물론 props 값의 추가적인 비교에 대한 비용은 아낄 수 있을지는 모르겠지만 어쨌든 오버헤드로 발생하는 비용도 고려해본다면 굳이 `React.memo()`를 사용할 필요는 없을 것이다.

- `React.memo()`가 필요하지 않는 경우는 또 있다. 매우 작은 어플리케이션, 혹은 매우 작은 컴포넌트 트리의 경우에는 굳이 `React.memo()`로 트리의 가지를 잘라내는 것이 크게 의미가 없기 때문이다. 이렇듯, 모든 컴포넌트를 `React.memo()`로 랩핑할 필요는 없다. 경우에 따라서 컴포넌트 트리에서 잘라낼 수 있는 소수의 주요 컴포넌트를 선택해서 사용하는 게 좋을 것이다. 이렇게 적합한 용도로 `React.memo()`를 골라 사용한다면, 모든 컴포넌트를 `React.memo()`로 감싸는 것보다는 어쨌든 훨씬 효율적일 것이다. (오버헤드도 방지할 수 있다.)

### Button 컴포넌트에 `React.memo()`를 적용하는 게 좋을까?

- `Button` 컴포넌트는 트리거 컴포넌트이기 때문에 `React.memo()`를 적용하는 게 옳은지 아닌지에 대해 논할 수 있을지도 모른다.

```js
const Button = (props) => {
  console.log("Button RUNNING");
  return (
    <button
      type={props.type || "button"}
      className={`${classes.button} ${props.className}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};
```

- 하지만 이 어플리케이션에서 `Button` 컴포넌트는 다시 변경될 일이 없다는 것을 알고 있으므로 매번 리렌더링 되는 것은 불필요하다는 사실은 분명하다. `Button` 컴포넌트를 `React.memo()` 로 감싸보자.

```js
const Button = (props) => {
  console.log("Button RUNNING");
  return (
    <button
      type={props.type || "button"}
      className={`${classes.button} ${props.className}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default React.memo(Button);
```

- 이제 저장을 하고, 어플리케이션을 새로고침해보자.

![ezgif com-gif-maker (61)](https://user-images.githubusercontent.com/53133662/168427339-523ff6e0-457a-45aa-bc33-97ea73137afc.gif)

- 새로고침 해보면, "Button RUNNING" 이 표시되고, 버튼을 클릭하면 다시 "Button RUNNING"이 출력된다. 우리는 `Button` 컴포넌트를 `React.memo()`로 감쌌고, 더이상 리렌더링이 되지 않도록 작업했다. 하지만 왜 이런 일이 발생하는 걸까?

### Button 컴포넌트가 계속 리렌더링 되는 이유

- "Button RUNNING"이 계속 출력된다는 것은 props의 값이 계속 바뀐다는 뜻이다.

```js
const Button = (props) => {
  console.log("Button RUNNING");

  return (
    <button
      type={props.type || "button"}
      className={`${classes.button} ${props.className}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default React.memo(Button);
```

- `Button` 컴포넌트를 확인해보면 안에는 `onClick` 이라는 props와 `children` 이라는 props 를 가지고 있다. 하지만 이 둘 모두 값은 불변 값이다. `children`으로 받는 텍스트도 동일하고, `onClick` 이라는 함수도 동일하다. 그리고 이것은 React에서 흔하게 발생하는 오류 중 하나이다.

#### App.js

```js
function App() {
  const [showParagraph, setShowParagraph] = useState(false);

  console.log("APP RUNNING");

  const toggleParagraphHandler = () => {
    setShowParagraph((prevParagraph) => !prevParagraph);
  };

  return (
    <div className="app">
      <h1>Hi there!</h1>
      <DemoOutput show={false} />
      <Button onClick={toggleParagraphHandler}>Toggle Paragraph!</Button>
    </div>
  );
}
```

- `App` 컴포넌트를 보면, 어쨌건 함수이기 때문에 마치 일반적인 자바스크립트 함수처럼 재실행되는 걸 알 수 있다. 왜냐하면 결국 이것은 상태(state)가 바뀌면 일반적인 자바스크립트 함수와 같기 때문이다. 여기서 조금 다른 점은 `App` 컴포넌트 함수는 사용자가 아닌 React에 의해 호출된다는 것 뿐이다. 그렇지만 여전히 일반 함수처럼 실행되는데 이 말인 즉슨, 코드가 다시 실행된다는 의미이다. 이것은 무슨 뜻일까?

```js
const toggleParagraphHandler = () => {
  setShowParagraph((prevParagraph) => !prevParagraph);
};
```

- `Button`에 `onClick`이라는 props로 전달되는 이 함수는 매번 재생성된다. 이는 `App` 함수의 모든 렌더링 또는 모든 실행 사이클에서 매번 새로운 함수라는 뜻이다. 우리가 어플리케이션이 렌더링 될 때마다 매번 새로 만들어지는 상수이고, 재사용되지 않는다는 의미이다.

### `App` 컴포넌트에서 실행되는 함수는 리렌더링 될 때마다 모두 새로 만들어진다

- `App` 컴포넌트가 리렌더링 될 때마다 `App` 컴포넌트 내부에 있는 모든 코드 역시 다시 실행되므로 당연하게도 새로운 함수와 상수들이 만들어진다. `toggleParagraphHandler` 함수 역시 이전에 렌더링 되었던 `toggleParagraphHandler` 함수가 아니며, 그저 같은 기능을 하는 새로운 `toggleParagraphHandler` 함수일 뿐이다. 이처럼, `App` 컴포넌트 함수가 실행될 때마다 만들어지는 상수와 함수는 모두 새로운 상수와 함수이다.

```js
<DemoOutput show={false} />
```

- 그런데 `DemoOutput` 컴포넌트에 `false` 를 props 로 전달할 때에도 앞서 설명한 예시들이 모두 해당된다. 그렇지만 `Button` 컴포넌트처럼 `React.memo()`로 감싼 `DemoOutput` 컴포넌트는 리렌더링 되지 않는다. `App` 컴포넌트 함수가 리렌더링 될 때마다 `false` 값 역시 매번 새로 만들어지는데도 불구하고 말이다. 그렇다면, 왜 `DemoOutput` 컴포넌트와 같은 경우처럼 보이는 `Button` 컴포넌트만 리렌더링 되는 것일까? `false` props와는 뭐가 다른 것일까?

### `DemoOutput` 컴포넌트와 `Button` 컴포넌트와의 차이점

- `DemoOutput`에 props 로 전달하는 `false`는 Boolean 값이고, 문자열 또는 숫자열 같은 자바스크립트의 원시값으로 취급된다. `React.memo()`는 props의 값을 확인하고 `props.show`를 업데이트 이전의 `props.show`와 비교한다.

```js
<DemoOutput show={false} />
```

- 이렇게 이전의 `props.show`와 재실행되어 생성된 최신 값 `props.show`를 비교하는데 이 작업은 일반 비교 연산자를 통해 이루어진다. 그리고 이 일반적인 비교 연산자는 비교 값이 원시값 때에서만 올바르게 비교-계산할 수 있게 된다.

### `React.memo()`는 일반 비교 연산자를 통해 비교 계산한다

```js
false === false;
// true
"hi" === "hi";
// true
```

- 두개의 boolean 값을 비교해서 true 가 나왔다면, 이는 동일한 값이다. 두개의 문자열을 비교해서 true 가 나왔다면 이 역시 동일한 값이다. 하지만 기술적으로 따지자면, 이 두개의 boolean 값과 두개의 문자열 값은 서로 다른 값이다. 하지만 자바스크립트에서 원시값이라면 이런 비교가 가능하다.

```js
[1, 2] === [1, 2];
// false
```

- 그러나, 배열이나 객체, 함수를 비교한다면 말이 달라진다. 배열이나 객체, 함수는 원시값이 아니라 참조값 이기 때문이다. 우리가 보기에는 동일한 값처럼 보이지만 자바스크립트 내에서는 이 두개의 배열은 같은 값이 아니다. 이는 자바스크립트의 핵심적인 개념이므로 반드시 이해해하고 넘어가야 한다.

```js
<Button onClick={toggleParagraphHandler}>Toggle Paragraph!</Button>
```

- 다시 React로 돌아와서 `Button`에 props 로 넘겨주는 함수를 보자. 직전에 거론했듯이 자바스크립트에서 함수는 하나의 객체이며 참조 값에 불과하다. `App` 컴포넌트 함수가 재실행될 때마다 함수 내부에 있는 코드들은 재창조 되며, 이 `toggleParagraphHandler` 함수 역시 새로 만들어진다. 그리고 `React.memo()`로 감싼 `Button` 컴포넌트는 이전에 생성된 `props.onClick`과 새롭게 생선된 최신 값인 `props.onClick`과 비교하게 된다. 그리고 당연하게도 이 두개의 비교군 값들은 같은 내용을 가지고 있다고 하더라도 자바스크립트 내에서는 동일한 값이 아니라고 취급할 것이다. (참조 값을 비교하는 것이기 때문이다.)

### 정리

- `React.memo()` 가 하는 일은 props 의 값을 확인하고, 이전의 props 와 가장 최근의 props 스냅샷을 비교한다. 그리고 이 비교 작업은 일반적인 비교 연산자를 통해 이뤄진다. 일반적인 원시 값이라면 이런 일반적인 비교 연산자를 통해서 비교가 가능할 것이다. 하지만 배열이나 객체, 함수를 비교한다면 말이 달라진다. 배열이나 객체, 함수는 참조 값이기 때문에 일반적인 비교 연산자를 통해서는 동일한 값으로 취급하지 않기 때문이다.
- 이것은 React 에서의 일반적인 이슈 중 하나로, 이 때문에 많은 개발자들이 어려움을 겪고 있다. 그렇기에 `React.memo()`의 작동방식 즉, 자바스크립트 내에서 비교연산자를 통해 이루어지는 작동방식을 이해하고 사용하는 것은 무척 중요한 일이다. 그렇다면, `React.memo()`는 props를 통한 객체나 배열 또는 함수를 가져오는 컴포넌트에는 사용할 수 없는 걸까? 다행히도 해결 방법은 존재한다.

</br>

## useCallback으로 함수 재생성 방지하기

- `React.memo()`로 props로 전달하는 객체나 배열 혹은 함수에도 작동하게끔 만들 수 있다. 객체를 생성하고 저장하는 방식을 조금 변경해준다면 말이다. 그리고 이 작업은 React 에서 제공하는 hook 을 통해서 가능하다. 바로 `useCallback()` 이라는 hook 이다.

### `useCallback` 사용하기

> [React 공식 문서 참조 : useCallback()](https://ko.reactjs.org/docs/hooks-reference.html#usecallback)

- `useCallback` 은 기본적으로 컴포넌트 실행 전반에 걸쳐 함수를 저장할 수 있도록 하는 hook 으로써 `useCallback`를 통해서 감싼 함수를 저장하여 이 함수가 어플리케이션이 매번 실행될 때마다 재생성할 필요가 없다는 것을 React에 알리는 역할을 한다. `useCallback`을 사용하여 특정 함수를 감싼다면, 이 함수 객체가 메모리의 동일한 위치에 저장되므로 이를 통해 비교 작업을 할 수 있게 된다. 구체적으로 예를 들어보자.

```js
let obj1 = {};
let obj2 = {};
```

- 여기 두개의 객체가 있다. 이 둘은 비슷해보일지 모르겠지만, 적어도 자바스크립트에서는 분명 이 두개의 객체는 동일한 취급을 받을 수 없을 것이다.

```js
let obj1 = {};
let obj2 = {};

obj1 === obj2;
// false
```

- 하지만 `obj1`과 `obj2`가 같은 메모리 안의 같은 위치를 가리키고 있다면 어떨까?

```js
let obj1 = {};
let obj2 = {};

obj1 = obj2;
```

- 동일한 메모리 안의 같은 위치를 가리키도록 `obj1`에 `obj2`를 할당해보자.

```js
let obj1 = {};
let obj2 = {};
obj1 = obj2;

obj1 === obj2;
// true
```

- 자바스크립트는 이 `obj1`에 `obj2`를 같은 객체로 간주하게 된다. 이는 `useCallback`이 하는 일과 정확하게 동일한 역할을 한다.

```js
const toggleParagraphHandler = () => {
  setShowParagraph((prevParagraph) => !prevParagraph);
};
```

- 우리가 선택한 함수를 React 의 내부 메모리에 저장해서 해당 함수 객체가 재실행 될 때마다 이를 재사용할 수 있도록 하는 것이다. `useCallback`의 사용법도 매우 간단하다.

```js
const toggleParagraphHandler = useCallback(() => {
  setShowParagraph((prevParagraph) => !prevParagraph);
});
```

- `useCallback`으로 저장하려는 함수를 래핑하기만 하면 된다. `useCallback`을 통해서 어떤 함수를 첫 번째 인자로 전달하면, `useCallback`는 이 저장된 함수를 반환한다. 이런 작동 과정을 통해서 `App` 컴포넌트 함수가 재실행될 때마다 `useCallback` 이 React 의 내부 메모리에 저장된 함수를 찾아서 재사용하는 것이다. 따라서, 어떤 함수가 절대 변경되어서는 안된다면, 이 `useCallback` hook 을 사용해서 그 함수를 React 내부의 메모리에 저장하면 된다.

```js
const toggleParagraphHandler = useCallback(() => {
  setShowParagraph((prevParagraph) => !prevParagraph);
}, []);
```

- `useCallback` 은 두개의 인자가 필요한데 첫 번째 인자는 앞서 거론한 함수이고, 두 번째 인자는 의존성 배열이다. 의존성 배열은 `useEffect` hook 에서 말하는 의존성 배열과 같은 의미로 쓰인다.
- `useCallback` 호출에 대한 의존성 배열은 첫 번째 인자인 함수를 감싼 컴포넌트로부터 전달받는 모든 것을 사용할 수 있다. (`useEffect` 처럼) 즉, 상태(state)나 props, 컨텍스트 같은 것 말이다.

```js
const toggleParagraphHandler = useCallback(() => {
  setShowParagraph((prevParagraph) => !prevParagraph);
}, []);
```

- 이 `toggleParagraphHandler` 함수에서는 업데이트 함수 `setShowParagraph` 를 명시하면 된다. 물론 `setShowParagraph`을 의존성 배열 안에 추가할 수도 있지만 React가 `useCallback`을 통해 해당 함수는 절대 변하지 않으며, 이전과 동일한 함수 객체임을 보장하고 있기 때문에 굳이 추가할 필요가 없어서 생략하였다. 다만 이런 코드는 `setShowParagraph` 에 전달된 함수라는 걸 기억만 하면 될 것이다. 기억한다는 것은 즉, 이 모두가 콜백 함수에 포함되어 있다는 뜻이다.

### 정리

- 현재 `toggleParagraphHandler` 함수를 감싼 `useCallback`의 의존성 배열은 React에 `toggleParagraphHandler` 함수를 저장하려고 하는 이 콜백 함수는 절대 변경되지 않을 것이라고 React에 알려주는 역할을 한다. 따라서 `App` 컴포넌트가 다시 리렌더링 되어도 항상 같은 함수 객체가 사용되게끔 하는 것이다.

![ezgif com-gif-maker (62)](https://user-images.githubusercontent.com/53133662/168430276-57314193-aa0a-4563-bb62-01bb0ad194d7.gif)

- 저장하고 새로고침 해보면, 버튼을 여러 번 클릭해봐도 더이상 "Button RUNNING" 문구가 출력되지 않는 것을 알 수 있다. 우리가 전달한 모든 props 값이 원시 값 뿐만 아니라 함수 또한 `useCallback`을 통해 일반 비교 연산자를 통해 비교가 가능하도록 전달했기 때문에 `React.memo()`이 역할을 제대로 수행할 수 있도록 했기 때문이다. 즉, `useCallback` 덕분에 `toggleParagraphHandler` 객체가 React의 메모리 안에서 항상 같은 객체임을 보장하고 있는 것이다.

</br>

## useCallback 및 종속성에 대하여

- `useCallback` 을 이용하면 함수를 저장하고 이를 재사용할 수 있게 된다.

```js
const toggleParagraphHandler = useCallback(() => {
  setShowParagraph((prevParagraph) => !prevParagraph);
}, []);
```

- 이제 `useCallback` 으로 저장한 함수의 의존성 배열을 지정해야 하는데, 이 의존성 배열이 왜 필요한지에 대해서 의아할 수가 있다. 지금의 어플리케이션 내의 함수는 모든 재렌더링 주기마다 항상 똑같은 로직을 쓰는데, 이 의존성 배열은 왜 필요한 것일까?

### 자바스크립트에서의 함수는 클로저이다.

- 자바스크립트에서의 함수는 클로저이다. 즉, 이 환경에서 사용할 수 있는 값에 클로저를 만들게 된다. 구체적인 예시를 통해 이해해보자.

```js
  <DemoOutput show={showParagraph} />
  <Button>Allow Toggling</Button>
  <Button onClick={toggleParagraphHandler}>Toggle Paragraph!</Button>
```

- `App` 컴포넌트가 렌더하는 `Button` 컴포넌트 위에 "Allow Toggling" 이라는 텍스트를 넣은 `Button` 컴포넌트 하나를 더 추가한다. 이 버튼은 Toggle 기능을 활성화해서 아래의 버튼이 작동하게끔 하는 버튼으로 만들 것이다.

```js
const [allowToggle, setAllowToggle] = useState(false);
```

- Toggle 의 활성화/비활성화 기능을 사용하기 위해서는 이 버튼의 상태(state)가 필요할 것이다. `allowToggle` 상태(state)를 추가해주자. 초기값은 false 로 설정해준다. 그리고 해당 Toggle 기능을 적용할 버튼에 `onClick` 이벤트로 해당 트리거 함수를 할당한다.

```js
const allowToggleHandler = () => {
  setAllowToggle(true);
};

...
<Button onClick={allowToggleHandler}>Allow Toggling</Button>;
```

- Toggle 을 할 것인지 말 것인지를 결정하는 상태(state)를 핸들링하는 트리거 함수 `allowToggleHandler`도 작성한다. 해당 함수가 트리거 될 때마다 `setAllowToggle` 상태 업데이트 함수로 true 값으로 업데이트할 것이다. (이 함수는 Toggle 자체의 상태(state)가 아니라 Toggle을 움직이는 버튼 자체에 대한 Toggle을 활성화할 뿐이다.)
- 여기에서 문제가 발생할 수도 있는데, 새로운 버튼에 `allowToggleHandler`를 바인딩하는 것 외에도 여기의 다른 함수(`toggleParagraphHandler`)에서 `allowToggle` 상태(state) 스냅샷을 이용해서 `setShowParagraph`를 사용할 수 있는지 확인할 것이기 때문이다.

```js
const toggleParagraphHandler = useCallback(() => {
  if (allowToggle) {
    setShowParagraph((prevParagraph) => !prevParagraph);
  }
}, []);
```

- 텍스트를 Toggle 해주었던 트리거 함수인 `toggleParagraphHandler` 로 돌아가 `allowToggle` 상태(state) 스냅샷에 따라 아래의 버튼의 상태(state)가 업데이트 되도록 작성해준다. if 문을 사용해서 만약 `allowToggle`(Toggle 버튼을 실행할 수 있는지를 체크하는 상태 값)이 true 일 때만 `setShowParagraph` 상태(state) 업데이트 함수가 실행될 수 있도록 작성해준다. 이렇게 되면, `showParagraph` 상태(state)는 Toggle 이 허용되는 경우(`allowToggle`가 true 일 때)만 업데이트하게 된다.

![ezgif com-gif-maker (63)](https://user-images.githubusercontent.com/53133662/169037252-555ca0d3-7e20-4e06-b0a7-2d57461b8592.gif)

- 저장하고 콘솔창을 확인해보자. 바로 Toggle Paragraph! 버튼을 누르게 되면 텍스트가 보여지거나 하는 등의 액션이 일어나지 않는다. 그리고 Allow Toggling 버튼을 누르고 다시 Toggle Paragraph! 버튼을 눌러보자. 콘솔에는 분명 'App RUNNING' 이 출력되고 있지만, 버튼의 기능은 작동되지 않는다. 우리가 의도한 대로 작동되지 않고 있는 것이다. 왜 그럴까?

![image](https://user-images.githubusercontent.com/53133662/169037672-b19f7fa7-3be0-40ba-aa5b-dca4915e238f.png)

- 왜냐하면 자바스크립트에서 함수는 클로저이며 우리가 `useCallback`을 제대로 사용하지 않았기 때문이다. 위의 이미지를 보면 의존성 배열 `[]` 부분에 편집기에서 코드 작성에 문제가 있음을 표시해주고 있다.

### 버튼을 눌러도 반응하지 않는 이유

- 자바스크립트의 함수는 클로저이다. 이 말인 즉슨, `useCallback` 에서 반환하는 함수가 정의되면(`App` 컴포넌트 함수 내부에 있는 모든 코드들) 이 함수(`useCallback` 에서 반환하는 함수)가 정의될 때 자바스크립트는 이 함수 안에서 사용되는 모든 변수를 잠그게 된다. 물론 함수 외부에서 사용하는 모든 변수라고 해야 조금 더 정확한 설명일 것이다.

```js
const toggleParagraphHandler = useCallback(() => {
  if (allowToggle) {
    setShowParagraph((prevParagraph) => !prevParagraph);
  }
}, []);
```

- 여기에서는 `allowToggle`이 앞서 설명한 경우에 해당하는데 `allowToggle`는 `App` 컴포넌트 함수 외부에 있는 변수나 상수이고,

```js
const [allowToggle, setAllowToggle] = useState(false);
```

- 이를 `useCallback` 에서 반환하는 함수 안에서 사용하고 있다.

```js
useCallback(() => {
  if (allowToggle) {
    setShowParagraph((prevParagraph) => !prevParagraph);
  }
}, [allowToggle]);
```

- 따라서 자바스크립트는 이 `allowToggle`에 클로저를 만들고, 해당 함수를 정의할 때 사용하기 위해 변수(`allowToggle`)를 저장한다.

- 그리고 이렇게 되면, 다음에 `toggleParagraphHandler` 함수가 실행되면 이 저장된 변수(`allowToggle`)를 그대로 사용하게 된다. 따라서 이 변수의 값은 변수가 저장된 시점(`allowToggle`의 클로저를 만들 때)의 값을 사용하게 되고, 함수 밖의 변수를 함수 안에서 사용할 수 있으며 우리가 원하는 시점에 함수를 호출할 수 있게 된다.

### 변수의 값은 변수가 저장된 시점의 값을 사용한다.

- `allowToggle` 의 값은 `allowToggle` 가 저장된 시점의 값을 사용한다. 이는 언뜻 보기에 완벽한 기능처럼 보인다. 이런 기능을 사용하면 `useCallback` 에서 반환하는 함수 밖의 변수를 해당 함수 안에서 사용할 수 있으며 우리가 원하는 시점에 함수를 호출할 수 있기 때문이다.

```js
<Button onClick={toggleParagraphHandler}>Toggle Paragraph!</Button>
```

- 버튼에 바인딩한 `toggleParagraphHandler` 함수처럼 말이다.

### useCallback은 함수를 재생성하지 못하도록 한다.

- 그러나, 여기서 문제가 발생한다. 우리는 `useCallback`을 사용하여 리액트에게 해당 함수를 저장하라고 지시할 수 있다. 이러면 이 함수는 메모리 어딘가에 저장된다. `App` 함수가 토글 상태가 변경되어 재평가, 재실행되면 리액트는 이 함수를 재생성 하지 않을 것이다. 왜 그럴까? 왜냐하면 우리가 `useCallback`을 통해 리액트에게 어떤 환경에서든 함수 재생성을 하지 않도록 의도적으로 막았기 때문이다.

```js
useCallback(() => {
  if (allowToggle) {
    setShowParagraph((prevParagraph) => !prevParagraph);
  }
}, []);
```

- 따라서 리액트가 이 함수에 사용하기 위해 저장한 `allowToggle`의 값은 최신 스냅샷의 값이 아니라, `App` 컴포넌트가 처음 실행된 시점의 값을 저장하고 있을 뿐이다. 이전에 거론했듯이 자바스크립트는 함수 생성 시점의 `allowToggle` 상수의 값을 저장하고 있기 때문이다. 그리고 당연히 이런 점 때문에 오류는 발생한다. 우리가 의도적으로 `useCallback`을 사용해서 리액트에 함수를 저장하라고 지시하고, `App` 컴포넌트가 변경되어 재평가, 재실행되도 더이상 해당 함수가 재생성하지 않도록 했기 때문이다. 하지만 때때로 우리는 해당 함수의 재생성이 필요로 할지도 모른다. 그러니까 해당 함수에서 사용하는 즉 함수 외부에서 오는 값(`allowToggle`)이 업데이트 될지도 모르는 가능성이 있다는 이야기다. 지금의 사례처럼 말이다.

```js
const toggleParagraphHandler = useCallback(() => {
  if (allowToggle) {
    setShowParagraph((prevParagraph) => !prevParagraph);
  }
}, []);
```

### allowToggle 을 종속 형태로 추가하기

- 우리는 `allowToggle`을 `useCallback`에 종속성에 추가하려고 한다. 이렇게 되면, `useCallback`을 통해 리액트에 함수를 저장하라고 지시했어도, 종속 형태로 추가된 `allowToggle`의 값이 업데이트 되거나 새로운 값이 들어왔을 때 해당 함수를 재생성 하고, 이 재생성된 함수로 저장할 수 있게 된다.

```js
const toggleParagraphHandler = useCallback(() => {
  if (allowToggle) {
    setShowParagraph((prevParagraph) => !prevParagraph);
  }
}, [allowToggle]);
```

- 이렇게 되면, `allowToggle`의 최신 값만을 사용할 수 있다. 또한 `allowToggle`이 변경되지만 않는다면 함수를 재생성하지 않게 되었다. 즉, `useCallback`을 통한 불필요한 재생성을 방지하는 장점과, 해당 함수에서 사용하는 변수의 값을 최신 값으로 사용할 수 있는 장점을 모두 챙길 수 있게 되었다.

![ezgif com-gif-maker (64)](https://user-images.githubusercontent.com/53133662/170860183-58bdf6e6-9c03-4887-a1c0-d30c9a6af7ce.gif)

- 저장하고 화면으로 돌아가서 다시 "Toggle Paragraph!" 버튼을 눌러보자. 당연히 처음에는 아무 반응이 없다. 다시 "Allow Toggling" 버튼을 누르고, "Toggle Paragraph!" 을 누르면 드디어 우리가 원했던 모든 출력들이 표시된다. "Toggle Paragraph!" 버튼을 눌렀을 때 "Button RUNNING" 이 한 번만 출력되는 것도 눈여겨봐야 할 부분이다. 당연히 `React.memo`가 두 번째 버튼에서는 작동하지 않는다. 왜냐하면 "Allow Toggling" 버튼에 연결된 함수인 `allowToggleHandler`는 `useCallback`을 사용하지 않았기 때문이다. "Toggle Paragraph!" 버튼이 다시 렌더링 된다면 두 번 표시되겠지만, `useCallback`이 해당 함수가 매 번 다시 빌드되는 것을 의도적으로 막았기 때문에 다만 의존성으로 주입된 `allowToggle` 상태가 변경될 때만 해당 문구를 볼 수 있다.

### 정리

- 지금까지의 개념들은 리액트 보다는 자바스크립트에 가까운 것들이다. 다만, 클로저가 어떻게 작동하는지를 이해하고 원시값과 참조값에 대한 이해가 뒷받침 된다면 리액트의 작동 원리를 보다 완벽하게 이해할 수 있을 것이다.

</br>

## 첫 번째 요약

- 리액트 앱에서는 컴포넌트를 통해 작업을 수행한다. 그리고 최신 리액트에서는 주로 함수 컴포넌트를 사용할 것이다. 이런 컴포넌트(ex. `App`)는 결국 하나의 작업을 수행할 것이며, JSX 코드를 반환한다.

```js
return (
  <div className="app">
    <h1>Hi there!</h1>
    <DemoOutput show={showParagraph} />
    <Button onClick={allowToggleHandler}>Allow Toggling</Button>
    <Button onClick={toggleParagraphHandler}>Toggle Paragraph!</Button>
  </div>
);
```

- 이것은 리액트에게 컴포넌트의 출력이 무엇인지를 알려준다. 이런 리액트 컴포넌트에서는 상태(state)와 props, 컨텍스트를 이용해서 작업할 수 있다. 그리고 props와 컨텍스트는 결국 상태(state)의 변경으로 이어지기 때문에 컴포넌트의 변경과 혹은 컴포넌트에 영향을 주거나 어플리케이션 일부에 영향을 미치는 데이터를 변경하게 된다.

### 컴포넌트에서 상태(state)를 변경할 때마다 컴포넌트는 재평가 된다

- 컴포넌트에서는 상태(state)를 변경할 때마다 이 변경된 상태(state)를 가지고 있는 컴포넌트는 재평가 될 것이다. 즉, 이 말은 컴포넌트 함수가 상태(state)가 변경될 때마다 재실행 된다는 의미이다. 따라서 컴포넌트가 재실행 될 때마다 컴포넌트 내부의 모든 코드 역시 재실행되고, 새로운 출력 값을 얻게 된다. 물론 출력 값은 이전과 동일할 수 있지만 실제로는 다른 의미를 가진다. 예를 들어, 단락 전체가 렌더링 되거나 안될 수도 있다는 의미이다.

```js
<DemoOutput show={showParagraph} />
```

- `DemoOutput` 와 같은 컴포넌트를 예를 들어보자.

```js
const DemoOutput = (props) => {
  console.log("DemoOutput RUNNUNG");
  return <MyParagraph>{props.show ? "This is New!" : ""}</MyParagraph>;
};
```

- 여기 `DemoOutput` 컴포넌트 내부의 텍스트("This is New!")는 렌더링되지 않을 수도 있다. 리액트는 단순히 최신 평가의 결과를 가져와서 직전 평가의 결과와 비교해서 리액트의 `DOM`에 전달한다. 그리고 이는 모든 컴포넌트에 해당 된다.

### 리액트 DOM의 변경 사항은 브라우저의 실제 DOM 에 적용 된다

- 리액트는 최신 평가 결과와 직전 평가 결과와 비교해서 실질적으로 업데이트 되는 부분을 체크한 뒤 리액트 `DOM`에 전달한다. 그리고 이 리액트 `DOM`을 통해 `index.js` 파일을 렌더링하고 리액트 `DOM`은 이 변경 사항을 브라우저의 실제 `DOM`에 적용하며, 변경되지 않은 것들은 그대로 둔다.

```js
return (
  <div className="app">
    <h1>Hi there!</h1>
    <DemoOutput show={showParagraph} />
    <Button onClick={allowToggleHandler}>Allow Toggling</Button>
    <Button onClick={toggleParagraphHandler}>Toggle Paragraph!</Button>
  </div>
);
```

- 이제 리액트가 컴포넌트를 재평가 할 때 단순히 컴포넌트 재평가에서 그치지 않고 전체 함수를 재실행하고 이를 통해 코드 전부를 리빌드한다. 이 JSX 코드가 최신 스냅샷의 출력 결과를 리빌드 하는 것이다. 그리고 이 JSX 코드에 있는 모든 컴포넌트를 재실행한다. 위의 코드에서는 `DemoOutput` 컴포넌트와 아래의 `Button` 컴포넌트 두개를 재실행 할 것이다.

```js
const DemoOutput = (props) => {
  console.log("DemoOutput RUNNUNG");
  return <MyParagraph>{props.show ? "This is New!" : ""}</MyParagraph>;
};

export default React.memo(DemoOutput);
```

- 하지만 이제 `DemoOutput`는 `React.memo`를 통해 하위 컴포넌트의 불필요한 재실행을 막았고, 리액트에게 props가 실제로 변경되었을 때만 컴포넌트 함수를 재실행하고 새로운 값이 없을 땐 함수를 재실행하지 않도록 할 수 있게 되었다.

### 컴포넌트의 재평가는 컴포넌트 함수 전체의 재실행을 의미한다

- 컴포넌트의 재평가는 컴포넌트 함수 전체의 재실행을 의미한다. `App` 컴포넌트 안에 있는 모든 것들이 다시 실행된다는 사실을 알지 못한다면 우리는 이상한 결과를 초래할 수 있을지도 모른다. 예를 들어보자. 함수 안에 함수를 만들고 해당 함수를 props를 통해 컴포넌트에 전달하면 새로운 함수 객체를 얻을 수 있다. 이렇게 되면 `React.memo`를 통한 불필요한 재실행을 막을 수 없을 것이다. 앞서서 설명했듯이 객체(배열, 함수)는 참조 값이며, `React.memo`가 내부적으로 실행하는 일반적인 비교 연산자를 통한 비교는 이 참조 값에 대해서는 통용되지 않기 때문이다.

> "`React.memo()` 가 하는 일은 props 의 값을 확인하고, 이전의 props 와 가장 최근의 props 스냅샷을 비교한다. 그리고 이 비교 작업은 일반적인 비교 연산자를 통해 이뤄진다. 일반적인 원시 값이라면 이런 일반적인 비교 연산자를 통해서 비교가 가능할 것이다. 하지만 배열이나 객체, 함수를 비교한다면 말이 달라진다. 배열이나 객체, 함수는 참조 값이기 때문에 일반적인 비교 연산자를 통해서는 동일한 값으로 취급하지 않기 때문이다."

- 그래서 우리는 `useCallback`를 사용했다. 바로 이 `useCallback`을 통해 참조 값도 비교하여 불필요한 재실행을 막을 수 있도록 한 것이다.

> "`useCallback` 은 기본적으로 컴포넌트 실행 전반에 걸쳐 함수를 저장할 수 있도록 하는 hook 으로써 `useCallback`를 통해서 감싼 함수를 저장하여 이 함수가 어플리케이션이 매번 실행될 때마다 재생성할 필요가 없다는 것을 React에 알리는 역할을 한다. `useCallback`을 사용하여 특정 함수를 감싼다면, 이 함수 객체가 메모리의 동일한 위치에 저장되므로 이를 통해 비교 작업을 할 수 있게 된다. "

- `useCallback`을 통해 리액트에게 `useCallback`으로 특정 함수를 감싸서 함수를 저장하도록 하고, 해당 함수가 재실행되어도 특정 의존성이 변경되는 것이 아니라면 함수 재생성을 막을 수 있다.

</br>

## State 및 컴포넌트 자세히 살펴보기

- 리액트에서 상태(state)는 가장 중요한 개념이다. 이 상태(state)라는 것은 컴포넌트를 다시 렌더링하고, 화면에 표시되는 것들을 업데이트 해준다. 따라서 컴포넌트와 이 상태(state)와의 상호작용은 리액트의 핵심 개념이라 할 수 있다.

### 상태(state)와 컴포넌트

- 상태(state)와 컴포넌트 모두 리액트가 관리한다는 것에 주목할 필요가 있다. 이러한 컴포넌트의 개념은 리액트 라이브러리에서 나온 것이며, 리액트는 이 컴포넌트와 연결된 상태(state)도 함께 처리하기 때문이다. `useState` hook 을 사용하는 게 바로 그 예시가 될 수 있다. `useState`를 통해 컴포넌트와 상태(state)간의 상호 작용을 처리한다.

### useState는 가장 일반적인 형태의 상태(state) 관리 방법이다

- 가장 일반적인 형태의 상태(state) 관리는 `useState` 훅을 이용하는 것이다. `useState`를 이용하면 새로운 상태(state)를 만들어서 자동적으로 `useState`를 호출한 컴포넌트에 이를 연결할 수 있기 때문이다. 그리고 이런 종류의 '연결'도 리액트가 담당하는 역할이다.

- `useState`를 호출하게 되면 리액트는 백그라운드에서 이를 관리하고, 컴포넌트와 이를 묶어줄 새로운 상태(state) 변수를 만들기 때문이다. 이전의 학습에서도 강조했듯이 `useState`를 호출했음에도 `App` 컴포넌트 함수가 매번 다시 실행되는 것은 확실히 이상해 보인다. 왜냐하면 앞서 거론한 문제로 인해서 상태(state)에 대한 어떤 종류의 손실이 발생하거나 상태(state) 초기화가 발생하는 것 같지는 않기 때문이다.

### 컴포넌트가 업데이트될 때마다 useState 에 전달된 기본 값도 다시 초기화 될까?

- 컴포넌트 함수가 재실행 될 때마다 상태(state) 값은 초기화되지 않는 이유는 간단하다. `useState`는 리액트가 제공하는 훅이며, 리액트는 상태(state)를 관리하고 컴포넌트와의 연결을 관리한다. 그리고 이 리액트의 관리 프로세스의 일부로 리액트는 `useState`와 여기에 전달된 '기본 값'에 대해서는 한 번만 고려하도록 처리가 되기 때문이다. 한 번만 고려한다는 말은 무엇일까? 바로 `App` 컴포넌트(예시)가 최초 실행될 때에만 고려한다는 말이다.

```js
import React, { useState, useCallback } from "react";

function App() {
  const [showParagraph, setShowParagraph] = useState(false);
  const [allowToggle, setAllowToggle] = useState(false);

  ...
}
```

- `App` 컴포넌트가 최초 실행되고 `useState`가 실행되면, 리액트가 관리하는 새로운 상태(state) 변수를 만들게 된다. 그런 후, 리액트는 이 변수가 어느 컴포넌트에 속하는지를 기억해둔다. (우리의 경우에는 `App` 컴포넌트가 될 것이다.) 그리고 `useState`에 전달된 기본 값을 사용해서 상태(state) 값을 초기화한다. 이후 `App` 컴포넌트를 재평가하게 될 때 `useState`를 호출하게 되면(컴포넌트 함수가 재평가 될 때마다 해당 컴포넌트 함수의 모든 코드들은 재실행-호출 된다.) 새로운 상태(state)는 생성되지 않는다. 리액트는 여기에서 `App` 컴포넌트에 대한 상태(state)가 이미 존재함을 기억하고 있기 때문에 필요한 경우에만 이 상태(state)를 업데이트하게 된다. `App` 컴포넌트 함수가 재실행되고 몇 몇의 상태(state)는 업데이트될 수 있기 때문이다. 따라서 리액트는 상태(state)의 관리와 갱신만을 담당한다. 

### 정리

- 해당 컴포넌트가 `DOM`에서 완전히 삭제되거나 하지 않는 이상 상태(state)의 초기화는 다시 이루어지지 않는다. 게다가 우리가 예시로 들고 있는 `App` 컴포넌트는 root 컴포넌트이기에 앞서 거론한 예외적인 일은 아예 발생하지도 않을 것이다. 물론 하위 컴포넌트의 경우라면 조건에 따라 렌더링될 수도 있지만 말이다. 예를 들어, 하위 컴포넌트가 삭제되었다가 다시 연결된다면 새로운 상태(state)가 호출되고 다시 초기화될 수 있을 것이다. 하지만 `DOM` 에 컴포넌트가 연결되고 유지되는 동안에는 상태(state)는 최초의 초기화 이후에는 '갱신'만 된다. 이는 아주 중요한 개념이다. 물론 `useReducer`에 대해서도 이 개념은 동일하게 적용된다. 

</br>
