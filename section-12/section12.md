# A Look Behind The Scenes Of React & Optimization Techniques

## 목차

- [How React Really Works](#리액트가-실제로-작동하는-방식)
- [Component Updates In Action](#컴포넌트-업데이트-실행-과정)
- [A Closer Look At Child Component Re-Evaluation](#자식-컴포넌트의-리렌더링-자세히-살펴보기)

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

- 개발자 도구의 `Element`를 확인해보면, 버튼을 아무리 눌러도 해당 요소들 중 그 어느 것도 반짝이지 않는 걸 확인할 수 있다.
- 앞서 여러 번 거론한 것처럼 컴포넌트의 리렌더링과 컴포넌트 함수의 리렌더링이 일어나도, 실제 `DOM`이 다시 렌더링되거나 변경되는 것은 아니다.
- 부모 컴포넌트가 재실행되면, 자식 컴포넌트 역시 리렌더링 된다. 따라서 `App` 컴포넌트가 재실행될 때마다 `DemoOutput` 컴포넌트 뿐만이 아니라, `Button` 컴포넌트 역시 리렌더링 된다. 만약 `App` 컴포넌트에서 반환하는 자식 컴포넌트인 `DemoOutput` 컴포넌트 내부에서 또 다른 자식 컴포넌트를 반환한다면, 그 컴포넌트 역시 `App` 컴포넌트가 재실행될 때마다 리렌더링 될 것이다.

### 정리

- 이렇게 컴포넌트 트리로 뻗어나가는 컴포넌트가 리렌더링 되는 것을 볼 때마다 의문이 생길 수도 있다. `App` 컴포넌트에 연결된 모든 자식 컴포넌트 함수가 동시에 리렌더링 되면, 성능에 영향을 미치지는 않을까 하는 의문 말이다. 하지만 기억하자. 리액트는 가상의 `DOM`과 실제 `DOM`을 비교하여 실질적으로 변한 부분만 업데이트를 한다.

- 방금 전 예시를 봤듯이, `DemoOutput` 컴포넌트는 변경되지 않았으므로 `DemoOutput` 컴포넌트는 재평가 되지 않는다. 만약 `DemoOutput` 컴포넌트에 prop 으로 내려주던 값을 지운다면, `App` 컴포넌트의 상태(state) 변경이 없으므로 출력 결과 역시 바뀌는 것이 없을 것이다. 그럼에도 불구하고, `DemoOutput` 컴포넌트와 같은 자식 컴포넌트를 리렌더링 하는 것은 아마도 불필요한 낭비가 될 수 있다.

</br>
