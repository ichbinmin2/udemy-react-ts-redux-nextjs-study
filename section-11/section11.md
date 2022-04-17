# Second Practice Project: Building a Food Order App

## 목차

- [Practice | Adding a "Header" Component](#헤더-컴포넌트-추가하기)
- [Practice | Adding the "Cart" Button Component](#장바구니-버튼-컴포넌트-추가하기)
- [Practice | Adding a "Meals" Component](#Meals-컴포넌트-추가하기)
- [Practice | Adding Individual Meal Items & Displaying Them](#개별-식사-항목-추가-및-표시하기)
- [Practice | Adding Individual Meal Items & Displaying Them](#개별-식사-항목-추가-및-표시하기)
- [Practice | Adding a Form](#양식-추가하기)
- [Practice | Working on the "Shopping Cart" Component](#장바구니-컴포넌트-작업하기)
- [Practice | Adding a Modal via a React Portal](#리액트-Portal을-통해-모달-추가하기)
- [Practice | Managing Cart & Modal State](#Cart-및-모달-state-관리)
- [Practice | Adding a Cart Context](#장바구니-컨텍스트-추가)
- [Practice | Using the Context](#컨텍스트-사용)
- [Practice | Adding a Cart Reducer](#장바구니-리듀서-추가)
- [Practice | Working with Refs & Forward Refs](#Refs-및-Forward-Refs-작업하기)
- [Practice | Outputting Cart Items](#장바구니-항목-출력하기)
- [Practice | Working on a More Complex Reducer Logic](#더-복잡한-리듀서-로직-작업하기)
- [Practice | Making Items Removable](#동적인-아이템들로-만들기)

## 헤더 컴포넌트 추가하기

![image](https://user-images.githubusercontent.com/53133662/162579242-5346ea84-1328-46c0-8fe3-621491e8f8ef.png)

</br>

## 장바구니 버튼 컴포넌트 추가하기

#### CartIcon.js

```js
const CartIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  );
};
```

- `svg` 아이콘을 저장하여 컴포넌트 형식으로 사용할 수 있다. `svg`를 저장하고 있더라도 일반 리액트 컴포넌트이기 때문이다.

#### HeaderCartButton.js

```js
<span className={classes.icon}>
  <CartIcon />
</span>
```

</br>

## Meals 컴포넌트 추가하기

#### AvailableMeals.js

```js
const AvailableMeals = () => {
  return (
    <section>
      <ul>{DUMMY_MEALS.map()}</ul>
    </section>
  );
};
```

- 헬퍼 상수를 이용해서 JSX 스니펫이 깔끔해지도록 작성.

```js
const AvailableMeals = () => {
  const mealsList = DUMMY_MEALS.map();
  return (
    <section>
      <ul>{mealsList}</ul>
    </section>
  );
};
```

- `melasList`를 마저 작성.

```js
const AvailableMeals = () => {
  const mealsList = DUMMY_MEALS.map((meal) => <li>{meal.name}</li>);
  return (
    <section>
      <ul>{mealsList}</ul>
    </section>
  );
};
```

</br>

## 개별 식사 항목 추가 및 표시하기

#### MealItem.js

```js
const price = `$${props.price.toFixed(2)}`;
```

- `toFixed(2)`를 사용해서 소숫점 두자리만 표기될 수 있도록 함

> [MDN 문서 참조 : toFixed()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)

#### AvailableMeals.js

```js
const mealsList = DUMMY_MEALS.map((meal) => (
  <MealItem
    key={meal.id}
    name={meal.name}
    description={meal.description}
    price={meal.price}
  />
));

return (
  <section className={classes.meals}>
    <Card>
      <ul>{mealsList}</ul>
    </Card>
  </section>
);
```

- `MealItem` 컴포넌트에 props로 `meal` 전달. 주어진 `id`로 key 값 설정.

  </br>

## 양식 추가하기

### htmlFor 속성 다루기

> `<label>` 태그의 for 속성은 라벨(label)과 결합될 요소를 명시합니다.

#### Input.js

```js
<div className={classes.input}>
  <label htmlFor={props.input.id}>{props.label}</label>
  <input />
</div>
```

- `Input` 컴포넌트의 구성 요소들이 사용될 때, `label` prop과 `input` prop을 받게 된다. (+ `props.label` 텍스트도 마찬가지이다.) 이때 객체와 구성 데이터는 보류된다. 예를 들어 `id`는 `<input>` 뒤에 `id` prop을 추가하면 된다.

```js
<div className={classes.input}>
  <label htmlFor={props.input.id}>{props.label}</label>
  <input id={props.input.id} />
</div>
```

### `<input>` 속성을 `props`로 받기

- 구성 데이터를 전부 전달하려면 아래의 `<input>` 태그 요소를 prop 으로 가져와야 한다.

```js
const Input = (props) => {
  return (
    <div className={classes.input}>
      <label htmlFor={props.input.id}>{props.label}</label>
      <input id={props.input.id} {...props.input} />
    </div>
  );
};
```

- spread 연산자를 사용하여 `props.input`을 분배하면 이 `<input>` 객체에 있는 "모든 키, 값의 쌍"을 `props.input`에서 받아서 `<input>` 태그 요소에 prop으로 추가할 수 있게 된다!

- 만약 `props.input`에서 받아온 `{ type : "text" }` 를 덧붙였다면, `<input>` 태그의 type 속성은 알아서 "text"로 추가가 될 것이다. spread 연산자를 통해 컴포넌트 요소 밖에서 컴포넌트 내부에 있는 태그인 `<input>`의 속성을 구성할 수 있는 아주 간단한 방법이다.

```js
<div className={classes.input}>
  <label htmlFor={props.input.id}>{props.label}</label>
  <input id={props.input.id} {...props.input} />
</div>
```

- `props.input`에서 받아온 `{...props.input}`으로 `<input>` 을 구성해주었으니, `id` 값으로 받아온 `props.input.id` 역시 적어줄 필요가 없을 것이다.

```js
<div className={classes.input}>
  <label htmlFor={props.input.id}>{props.label}</label>
  <input id={props.input.id} {...props.input} />
</div>
```

- `<label>` 태그에서 `htmlFor` 속성을 `props.input.id`으로 지정해주었기 때문에 `{...props.input}` 가 알아서 `<input>`의 `id` 값을 구성해줄 것이기 때문이다.

### 외부에서 `Input` 컴포넌트 사용하기

#### MealItemForm.js

```js
<form className={classes.form}>
  <input />
  <button>+ Add</button>
</form>
```

- 기존에 하드코딩으로 입력해주었던 `<input>` 태그 대신 앞서 작성한 `Input` 컴포넌트를 import 해주고,

```js
import Input from "../../UI/Input";
...
<form className={classes.form}>
  <Input />
  <button>+ Add</button>
</form>
```

- `Input` 컴포넌트에 전달해야 하는 prop 요소들을 작성해준다. 객체를 보류해줄 `input`을 prop 한다. 이때 값은 물론 "객체"가 되어야 할 것이다.

```js
<form className={classes.form}>
  <Input label="Amount" input={{}} />
  <button>+ Add</button>
</form>
```

- 중괄호 두쌍 `{{}}`은 특별한 구문이 아니다. 값으로 전달할 때 자바스크립트 식으로 계산해야 하며 이 값은 자바스크립트의 객체이기 때문에, 중괄호를 한쌍 `{}`만 입력해서는 자바스크립트 구문을 작성할 수 없다.

```js
<form className={classes.form}>
  <Input
    label="Amount"
    input={{
      id: "amount",
      type: "number",
    }}
  />
  <button>+ Add</button>
</form>
```

- 기본적으로 제공해야 하는 `input`의 속성들인 `id`와 `type`을 지정해준다.

```js
<form className={classes.form}>
  <Input
    label="Amount"
    input={{
      id: "amount",
      type: "number",
      min: "1",
      max: "5",
    }}
  />
  <button>+ Add</button>
</form>
```

- 유효성 검사 prop도 추가해준다. `input`이란 이름의 prop 으로 전달하는 모든 키와 값들은 기본적으로 `<input>` 태그에 추가할 수 있는 prop 이라는 것을 명심하자. `min`과 `max` 값을 설정해준다. 추가할 수 있는 수량은 최소 1이고 최대 5개라는 뜻이다.

```js
<form className={classes.form}>
  <Input
    label="Amount"
    input={{
      id: "amount",
      type: "number",
      min: "1",
      max: "5",
      step: "1",
      defaultValue: "1",
    }}
  />
  <button>+ Add</button>
</form>
```

- 마지막으로 `step` 와 `defaultValue`도 prop으로 추가한다. `defaultValue`는 초기값을 표기하는 속성이다.
- 앞에서 설명했듯이 현재 `Input` 컴포넌트에 전달하는 input prop 객체의 키와 값들은 전부 `<input>` 태그에서 사용할 수 있는 속성이다. 물론, `Input` 컴포넌트에 prop 값을 전달하면서 `Input` 컴포넌트에 `{...props.input}` 처럼 분배해야 할 것이다. 지금 전달하는 prop 은 전부 `<input>` 속성을 위한 기본 제공 prop 이기 때문이다.

#### Input.js

```js
<div className={classes.input}>
  <label htmlFor={props.input.id}>{props.label}</label>
  <input {...props.input} />
</div>
```

 </br>

## 장바구니 컴포넌트 작업하기

#### Cart.js

```js
const cartItems = [{ id: "c1", name: "Sushi", amount: 2, price: 12.99 }].map(
  (item) => <li>{item.name}</li>
);

return (
  <div>
    CartItem
    <div></div>
    <div></div>
  </div>
);
```

- 상수를 추가해서 모든 `cartItems`을 JSX 요소에 매핑할 예정이다. 지금은 `cartItmes`가 없으므로 더미 데이터를 배열로 만들어서 매핑해준다.

```js
const cartItems = [{ id: "c1", name: "Sushi", amount: 2, price: 12.99 }].map(
  (item) => <li>{item.name}</li>
);
return (
  <div>
    {cartItems}
    <div></div>
    <div></div>
  </div>
);
```

- `<li>` 태그 요소는 정렬되지 않았기 때문에, `<ul>`태그와 중괄호 `{}`로 감싸서 매핑(감싸줄 식이 자바스크립트 식이기 때문)해주도록 한다.

```js
const cartItems = (
  <ul>
    {[{ id: "c1", name: "Sushi", amount: 2, price: 12.99 }].map((item) => (
      <li>{item.name}</li>
    ))}
  </ul>
);
```

- 스타일 값도 추가해준다.

```js
const cartItems = (
  <ul className={classes["cart-items"]}>
    {[{ id: "c1", name: "Sushi", amount: 2, price: 12.99 }].map((item) => (
      <li>{item.name}</li>
    ))}
  </ul>
);
```

</br>

## 리액트 Portal을 통해 모달 추가하기

#### index.html

```html
<div id="overlays"></div>
<div id="root"></div>
```

#### Modal.js

```js
const BackDrop = (props) => {
  return <div className={classes.backdrop} />;
};

const ModalOverlay = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const Modal = (props) => {
    return(
    <React.Fragment>
        {ReactDOM.createPortal(<BackDrop />, document.getElementById("overlays"))}
        {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
      document.getElementById("overlays")
        )}
    </React.Fragment>;
    )
};
```

- `<ModalOverlay>` 사이에 `{props.children}`를 넣는 이유는 `<ModalOverlay>`에서 `{props.children}`를 사용해서 받아오고 있기 때문이다.

```js
const portalElement = document.getElementById("overlays");

const Modal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(<BackDrop />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </React.Fragment>
  );
};
```

- 상수로 만들어서 JSX 코드를 깔끔하게 정리할 수도 있다.

#### Cart.js

```js
<Modal>
  {cartItems}
  <div className={classes.total}>
    <span>Total Amout</span>
    <span>35.62</span>
  </div>
  {/* cart button */}
  <div className={classes.actions}>
    <button className={classes["button--alt"]}>Close</button>
    <button className={classes.button}>Order</button>
  </div>
</Modal>
```

- 기존의 `<div>` 태그를 `Modal` 컴포넌트로 수정해주고 전체 JSX 코드를 감싸준다.

#### App.js

```js
<Fragment>
  <Cart />
  <Header />
  <main>
    <Meals />
  </main>
</Fragment>
```

- 마지막으로 `Haeder` 컴포넌트 위에 `Cart` 컴포넌트를 import 해서 올려준다. (이미 React Portal로 위치를 지정해주었으므로 사실 `Cart` 컴포넌트의 위치는 어디에 넣어도 상관없다.)

</br>

## Cart 및 모달 state 관리

- 최상위 컴포넌트인 `App` 컴포넌트에서 cart의 상태(state)를 관리해줄 요량이다.

#### App.js

```js
const [cartIsShown, setCartIsShown] = useState(false);

const showCarthandler = () => {
  setCartIsShown(true);
};

const hideCartHandler = () => {
  setCartIsShown(false);
};
```

- cart의 상태(state)의 초기값을 false로 지정하고 상태(state) 업데이트 함수를 이용하여 상태(state)를 업데이트하는 트리거 함수를 작성한다.

```js
<Fragment>
  {cartIsShown && <Cart />}
  <Header onShowCart={showCarthandler} />
  <main>
    <Meals />
  </main>
</Fragment>
```

- `Cart` 컴포넌트는 `cartIsShow`이 true 일 때만 띄워줄 것이기 때문에 중괄호 `{}` 안에 `cartIsShow` 상태 여부에 따라 `Cart` 컴포넌트를 렌더링하는 조건식을 작성한다. `showCarthandler` 트리거 함수는 `Header` 컴포넌트에서 사용할 것이기 때문에 `Header` 컴포넌트에 `onShowCart`이라는 이름의 prop으로 넘겨주고,

#### Header.js

```js
<Fragment>
  <header className={classes.header}>
    <h1>ReactMeals</h1>
    <HeaderCartButton onClick={props.onShowCart} />
  </header>
  <div className={classes["main-image"]}>
    <img src={mealsImage} alt="mealsImage" />
  </div>
</Fragment>
```

- `App` 컴포넌트에서 prop으로 전달받은 트리거 함수 `showCarthandler`를 다시 `HeaderCartButton` 컴포넌트에 `onClick` 이란 이름으로 prop 체이닝을 해준다.

#### HeaderCartButton.js

```js
<button className={classes.button} onClick={props.onClick}>
  <span className={classes.icon}>
    <CartIcon />
  </span>
  <span>Your Cart</span>
  <span className={classes.badge}>3</span>
</button>
```

- `HeaderCartButton` 컴포넌트의 `<button>` 에 onClick 이벤트를 달아주고, `Header` 컴포넌트로부터 prop으로 전달받은 `onClick` 을 값으로 넣어준다.

- 이렇게 prop chain이 있으면 여러 수준의 구성 요소를 통해 prop 을 전달할 수 있고, 이를 바탕으로 컨텍스트를 사용하여 교체도 할 수 있게 된다.

#### App.js

```js
const hideCartHandler = () => {
  setCartIsShown(false);
};
```

- `Modal`을 닫는 기능도 필요하다. `hideCartHandler` 함수를 어디에 전달해야 할까?

```js
{
  cartIsShown && <Cart onClose={hideCartHandler} />;
}
```

- 먼저 `Cart` 컴포넌트 내부에 모달을 close 해줄 버튼을 마크업해줬기 때문에, `Cart` 컴포넌트에 해당 `hideCartHandler` 트리거 함수를 `onClose` 라는 이름의 prop 으로 전달한다.

#### Cart.js

```js
<button className={classes["button--alt"]} onClick={props.onClose}>
  Close
</button>
```

- Close 해줄 용도로 만든 `<button>` 태그에 onClick 이벤트 속성을 추가한 뒤 `App` 컴포넌트에서 전달받은 prop인 `onClose`를 값으로 넣어준다.

![ezgif com-gif-maker (39)](https://user-images.githubusercontent.com/53133662/162683031-e7cd0920-42e9-47b5-b3cf-f69fa4a9a9fd.gif)

- 마지막으로 모달을 띄웠을 때 모달의 뒷배경(back drop)을 클릭하면 모달이 닫히는 기능까지 추가해보자.

#### App.js

```js
{
  cartIsShown && <Cart onClose={hideCartHandler} />;
}
```

- 이미 `Cart` 컴포넌트에 `hideCartHandler` 함수가 `onClose`라는 prop 으로 전달되었으므로, `Cart` 컴포넌트로 다시 돌아가서,

#### Cart.js

```js
<Modal onClose={props.onClose}>
  {cartItems}
  <div className={classes.total}>
    <span>Total Amout</span>
    <span>35.62</span>
  </div>
  <div className={classes.actions}>
    <button className={classes["button--alt"]} onClick={props.onClose}>
      Close
    </button>
    <button className={classes.button}>Order</button>
  </div>
</Modal>
```

- `Modal` 컴포넌트에 해당 트리거 함수를 `onClose` 라는 이름으로 다시 prop chain 해준다.

#### Modal.js

```js
const Modal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <BackDrop onClose={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </React.Fragment>
  );
};
```

- props 으로 전달받은 값을 또 다시 `BackDrop` 컴포넌트에 `onClose` 라는 이름으로 넘겨주고,

```js
const BackDrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose} />;
};
```

- `BackDrop` 컴포넌트의 `<div>` 태그에 onClick 이벤트 값으로 props로 전달받은 `onClose`를 넣어준다.

![ezgif com-gif-maker (40)](https://user-images.githubusercontent.com/53133662/162685169-15c4bb0a-cd03-453b-9002-36d9bc0016a6.gif)

- 리액트 컨텍스트를 사용할 수도 있지만 이번 경우에는 사용하지 않는다. 리액트 컨텍스트를 사용하려면 Cart 모달을 닫기 위해서 onClick을 배경에 바인딩해야 되고, 특정한 스펙트럼 역시 필요하다. 그렇게 되면 다른 컨텐츠에 이 Modal을 사용할 수 없기 때문에 prop chain 으로 처리해주었다.

  </br>

## 장바구니 컨텍스트 추가

- 이제 리액트 컨텍스트를 이용해서 cart에 데이터와 항목을 추가할 수 있게 해보자. (어플리케이션 곳곳에 cart 데이터를 사용할 것이므로, 전역 상태관리가 필요하기 때문이다.) 리액트를 사용해서 어플리케이션 전체 상태(state)를 관리할 때는 이름을 store로 짓는 게 관례이다. 먼저 store 폴더를 만들고, `cart-context.js` 파일을 생성하자.

### Cart Context 만들기

- 이제 Cart에 데이터와 항목을 추가할 수 있도록 Cart에 리액트 컨텍스트를 추가해보자. 어플리케이션 모든 곳에서 사용할 것이므로, 컨텍스트로 cart 데이터 전체를 관리해줄 것이다. 나중에는 cart 안에 항목을 추가하거나 삭제하는 등의 기능도 추가해줄 것이기 때문에 컨텍스트로 관리가 필요하다.

#### `src/store/cart-context.js`

```js
import React from "react";

React.createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
});
```

- 먼저 store 폴더를 생성하고, `cart-context.js`을 생성해서 cart context에 초기화한 데이터를 넣어준다. 컨텍스트를 기본 데이터로 초기화 해주는 이유는 (이 값을 실제로 사용하지는 않을 것이지만) 나중에 자동완성 기능을 편리하게 사용하기 위해서다. 여러 cart 항목을 관리해줄 items에 빈 배열 값을 넣고, 총량을 표기할 totalAmount도 0으로 초기화해준다. 그런 다음 함수 두 개를 사용해서 컨텍스트 상태(state)를 업데이트 해줄 생각이다.

```js
import React from "react";

const CartContext = React.createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
});

export default CartContext;
```

- 그리고 이 컨텍스트를 `CartContext` 상수에 담아서 export 해준다. 이제 cart context를 사용하고자 하는 컴포넌트 내부에서 `useState`나 `useReducer`를 사용하여 컨텍스트를 관리해주자. (그러면 나중에 컨텍스트를 변경하고, 어플리케이션을 업데이트 해줄 수 있다.)

### Cart Provier 만들기

- `Provier`를 Context를 생성한 파일(`cart-context.js`)에서 관리해줄 수도 있지만, 가독성을 위해 같은 폴더 안에서 새로운 파일(`CartProvider`) 컴포넌트를 만들어 생성해준다.

#### `src/store/CartProvider.js`

```js
import CartContext from "./cart-context";

const CartProvider = (props) => {
  <CartContext.Provider>{props.children}</CartContext.Provider>;
};

export default CartProvider;
```

- 이 `CartProvider`는 `CartContext`와 cart 데이터를 관리해주는 것이 목적으로 생성되었다. 즉 `CartContext`를 제공하는 역할이라는 뜻이다. `CartContext.Provider` 사이에 `props.children`을 넣어줌으로써 이 컨텍스트(`CartContext`)에 접근할 수 있도록 모든 컴포넌트를 `CartContext.Provider`가 감싸준다.

- 컴포넌트에 컨텍스트 데이터를 관리하는 로직도 추가해주어야 한다. 이때 감싸는 컴포넌트 요소에만 포함되고 다른 컴포넌트 요소에는 포함되지 않는다.

```js
const cartContext = {};

return <CartContext.Provider>{props.children}</CartContext.Provider>;
```

- 이제 `CartProvider` 컴포넌트에 `cartContext` 라는 헬퍼 상수를 추가한다. `CartContext.Provider` 의 value 속성 값으로 들어갈 객체를 작성해주면 된다. 구체적으로 컨텍스트 필드를 설정해주는 것이다. (나중에 이 초기 값을 기반으로 업데이트해줄 것이다.)

```js
const cartContext = {
  items: [],
  totalAmount: 0,
  addItem: 함수 필요,
  removeItem: 함수 필요,
};
```

- 이제 `cartContext`의 `addItem`와 `removeItem`에 함수로 들어갈 함수들을 설정해준다.

```js
const addItemToCartHandler = (item) => {};

const removeItemToCartHandler = (id) => {};

const cartContext = {
  items: [],
  totalAmount: 0,
  addItem: addItemToCartHandler,
  removeItem: removeItemToCartHandler,
};

return <CartContext.Provider>{props.children}</CartContext.Provider>;
```

- 그리고 `CartContext.Provider`에 value prop 값으로 `cartContext`을 포인터 해준다. 이 value 값은 나중에 동적으로 업데이트될 것이다.

```js
const cartContext = {
  items: [],
  totalAmount: 0,
  addItem: addItemToCartHandler,
  removeItem: removeItemToCartHandler,
};

<CartContext.Provider value={cartContext}>
  {props.children}
</CartContext.Provider>;
```

- `CartProvider` 컴포넌트는 사용하기 위한 준비를 마쳤다. 이제 cart의 데이터를 사용하는 모든 컴포넌트를 감싸야 한다.

#### App.js

```js
return (
  <Fragment>
    {cartIsShown && <Cart onClose={hideCartHandler} />}
    <Header onShowCart={showCarthandler} />
    <main>
      <Meals />
    </main>
  </Fragment>
);
```

- `App` 컴포넌트를 살펴보면, 우리의 어플리케이션의 컴포넌트들 곳곳에서 `CartContext` 데이터가 필요하다는 걸 알 수 있다. 그동안 전체 컴포넌트를 감싸주던 `Fragment`를 삭제하고 이 자리를 `CartProvider`로 변경해주자.

```js
import CartProvider from "./store/CartProvider";

return (
  <CartProvider>
    {cartIsShown && <Cart onClose={hideCartHandler} />}
    <Header onShowCart={showCarthandler} />
    <main>
      <Meals />
    </main>
  </CartProvider>
);
```

- 이제 `CartContext` 전체를 `App.js`에서 관리해줄 수 있게 되었다. 또한 `CartProvider` 컴포넌트를 사용하면 `App` 컴포넌트도 깔끔해지고 모든 컴포넌트마다 cart 상태(state) 관리에 대한 로직을 삽입할 필요가 없어진다.

</br>

## 컨텍스트 사용

- 앞서 설정해준 `CartContext`를 사용해볼 차례다.

### 장바구니 항목의 갯수 출력하기

#### HeaderCartButton.js

```js
import React, { useContext } from "react";

import CartContext from "../../store/cart-context";

const HeaderCartButton = (props) => {
  const ctx = useContext(CartContext);
};
```

- `useContext`로 `CartContext` 불러오고, 상수의 이름은 `ctx`로 설정한다. 여기서 `useContext`를 사용하면 컨텍스트가 변경될 때 `HeaderCartButton` 컴포넌트가 React로 다시 렌더링-업데이트 된다.

  > 컨텍스트는 `CartProvider` 컴포넌트에서 업데이트할 때 변경될 것이다.

- 이제 `HeaderCartButton` 컴포넌트에서 cart 항목의 갯수를 출력할 수 있게 되었다

```js
const numberOfCartItems = ctx.items.legnth;
```

- cart 항목의 갯수를 출력하기 위해서 `numberOfCartItems` 이라는 상수를 하나 더 추가한다. `ctx.items.legnth`로 계산하지 않는 이유는, 아이템 항목에 상관없이 아이템의 갯수를 추가해도 즉 항목 하나에 갯수가 여러개일 때도 총합으로 장바구니 항목의 갯수를 계산해야하기 때문이다. `ctx.items.legnth`는 하나의 아이템의 갯수가 여러개일지라도 하나로만 계산될 것이기 때문에 사용하지 않았다.

```js
const numberOfCartItems = ctx.items.reduce(() => {});
```

- 장바구니 항목의 갯수를 `reduce` 메소드로 `curNumber`를 누적 계산했다. `reduce` 메소드를 사용하는 이유는 데이터 배열을 단일 값으로 변환할 수 있기 때문이다.

```js
const numberOfCartItems = ctx.items.reduce(() => {}, 0);
```

- `reduce` 메소드에 인수를 두개 추가하는데, 첫번째는 나중에 호출할 함수이고 두번째는 시작 값이다. 우리는 계산을 0부터 시작할 것이기 때문에 0으로 초기화해주었다.

```js
const numberOfCartItems = ctx.items.reduce((curNumber, item) => {}, 0);
```

- `reduce`에 첫 번째 인수로 전달된 함수는 자동으로 자바스크립트를 사용하여 인수 두개를 받는다. `reduce` 배열에 있는 모든 항목을 위해 함수를 호출하는 것이다. 누적의 용도로 사용할 `curNumber`를 추가하고, 작업해야 할 `item`을 두번째 인자로 추가한다. `curNumber`는 기본적으로 값의 갯수를 상징한다.

```js
const numberOfCartItems = ctx.items.reduce((curNumber, item) => {
  return curNumber + item.amount;
}, 0);
```

- 이제 반환 값을 작성한다. 누적할 이전 값 `curNumber`에 `item.amount`를 더해주는 식을 반환한다. 장바구니 항목 객체(`item`)에 항목 별로 항목 수를 저장하는 작은 필드(`amount`)를 사용할 예정이다. 이제 `reduce`로 반환된 배열은 단일 숫자가 된다.

```js
import React, { useContext } from "react";
import CartContext from "../../store/cart-context";

const HeaderCartButton = (props) => {
  const ctx = useContext(CartContext);

  const numberOfCartItems = ctx.items.reduce((curNumber, item) => {
    return curNumber + item.amount;
  }, 0);

  return (
    <button className={classes.button} onClick={props.onClick}>
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span>Your Cart</span>
      <span className={classes.badge}>{numberOfCartItems}</span>
    </button>
  );
};
```

- 기존에 하드 코딩으로 작성해주었던 `<span>`태그 사이에 `numberOfCartItems` 값을 넣어준다. 장바구니에 아이템 갯수가 증가할 때마다 `reduce`가 장바구니 아이템 갯수를 반환해줄 것이다.

</br>

## 장바구니 리듀서 추가

- cart item을 추가하기 위해서는 먼저 `CartProvider`으로 돌아가야 한다. 여기서 cart 데이터를 관리하기 때문이다.

#### CartProvider.js

```js
const addItemToCartHandler = (item) => {};

const removeItemToCartHandler = (id) => {};
```

- 함수들을 하나씩 살펴보자. `addItemToCartHandler` 함수는 호출 될 때마다 cart 에 추가될 item 을 받을 것이다. 그리고 item이 이미 cart에 있는지 역시 확인할 것이다. (item 이 이미 카트에 들어있다면, 이미 존재하고 있는 item 을 업데이트하고, 이 item이 없다면 새로 해당 item을 추가해야 하기 때문이다.)
- `CartProvider` 컴포넌트와 cart context, 그리고 cart context의 영향을 받는 모든 컴포넌트가 cart 데이터가 변화할 때마다 다시 리렌더링 할 것이다. `CartProvier` 컴포넌트에서는 우리의 cart 데이터를 상태(state)로 관리해줄 것이며, 이 복잡한 데이터의 상태(state)를 조금 더 편리하게 관리해주도록 `useReducer`를 사용할 것이다. 물론 이 상태(state)는 cart의 item이 있는지 없는지를 체크해주기 위한 용도로 사용할 것이다.

```js
const cartReducer = (state, action) => {
  return;
};
```

- 먼저 `CartProvider` 함수 외부에서 리듀서 함수(`cartReducer`)를 작성한다. 앞서 설명했다시피, `cartReducer`에 필요한 데이터는 `CartProvider` 컴포넌트 내부에 없기 때문에 굳이 컴포넌트 내부에서 작성해서 컴포넌트가 리렌더링할 때마다 불필요한 재생성을 하지 않도록 하자. 리듀서 함수의 첫번째 인자인 `state`는 리듀서가 관리하는 마지막 스냅샷(가장 최신의 상태)이고 `action`은 우리가 리듀서 함수에 보내는 명령을 받는 역할을 할 것이다. (이 `cartReducer`의 state와 action을 리액트가 자동으로 전달해줄 것이다.)
  > section-10 의 `useReducer` 섹션 참조

```js
import React, { useReducer } from "react";

const cartReducer = (state, action) => {
  return;
};

const CartProvider = (props) => {
  useReducer(cartReducer);
  ...
}
```

- 그리고 `useReducer` 를 import 한 뒤, `useReducer` hook 에 넣어줄 첫번째 리듀서 함수(`cartReducer`)를 포인터해준다.

### 초기 상태(state) 값 지정하기

```js
const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  return defaultCartState;
};
```

- `defaultCartState` 는 리듀서의 상태(state) 초기값을 설정해주기 위해 작성한 것이다. 이 또한 컴포넌트 내부에 없어도 되므로, 컴포넌트 외부에 작성한다. `items`는 빈 배열 값으로 설정하여 비워두고, `totalAmount`도 0으로 초기화하였다.

```js
const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );
  ...
};
```

- `CartProvider` 컴포넌트 함수 최상위에 `useReducer`를 작성한다. 첫번째 인자로 리듀서 함수(`cartReducer`)를 전달하고, 두번째 인자로 상태(state)를 초기화해주는 상수 값인 `defaultCartState`를 포인터한다. (물론, 상수로 만들지 않고 그대로 초기 값 객체를 넣어줘도 상관없다.)
- `useReducer`는 두가지 요소와 함께 배열을 리턴하기 때문에 요소를 배열 밖으로 끌어내 별개의 정수에 보관(배열 구조 분해 할당)해야 한다. 첫번째는 최신 상태(state)값 즉 "스냅 샷"을 담는 `cartState`이고, 리듀서에 "action을 전송하는 역할을 하는 함수"인 `dispatchCartAction` 이다.

### `cartContext`를 리듀서 상태(state) 값으로 교체하기

#### before

```js
const cartReducer = (state, action) => {
  const cartContext = {
    items: [],
    totalAmount: 0,
    addItem: addItemToCartHandler,
    removeItem: removeItemToCartHandler,
  };
  ...
};
```

#### after

```js
const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemToCartHandler,
  };
};
```

- 이제부터 item을 상태(state)로 관리해줄 것이기 때문에, 기존에 작성했던 `cartContext`를 `useReducer`에서 `cartState`로 관리하는 상태(state) 값으로 교체한다.
  > `cartState.items`과 `cartState.totalAmount`는 `cartState`에 리듀서로 설정해준 초기 값(`defaultCartState`)을 기반으로 접근한 값이다.

### 리듀서 함수에 action 을 전송하기

- 일단 item 을 추가한 뒤에 `cartReducer` 에 "action" 을 보낼 생각이다.

```js
const addItemToCartHandler = (item) => {
  dispatchCartAction();
};
```

- 먼저 item 을 추가하는 함수 `addItemToCartHandler` 내부에 "action" 을 전달하는 함수 `dispatchCartAction()`을 가져온다.

```js
const addItemToCartHandler = (item) => {
  dispatchCartAction({});
};
```

- `useReducer` 섹션에서 다룬 이야기지만, 사실 무슨 "action" 을 쓸지는 개발자의 자유이다. 문자열이나 숫자도 가능하다. 그러나 보통은 속성이 있는 객체를 사용해서 action을 확인한다. (아마도 훨씬 접근이 쉽고, 복잡한 구성 요소들을 처리하기에도 좋을 것이다.) 그렇기에 이번에도 객체를 추가했다.

```js
const addItemToCartHandler = (item) => {
  dispatchCartAction({
    type: "ADD",
  });
};
```

- `dispatchCartAction()`의 객체 내부에 속성과 값을 추가한다. `cartReducer` 함수에서 받을 이 action은 어떤 action 으로 전송되었느냐에 따라서 다른 코드를 사용할 수 있다. action을 확인하는 속성 이름은 늘 그렇듯이 type 으로 지정했다. 간단한 문자열(관습에 따라 대문자)로 값도 지정해주었다.

```js
const addItemToCartHandler = (item) => {
  dispatchCartAction({
    type: "ADD",
    item: item,
  });
};
```

- 리듀서(`cartReducer`) 함수에 item 을 추가하려면 "action" 의 값에 넣어주어야 한다. item 속성을 추가하고 그 값으로 (`addItemToCartHandler`가 받아오는 cart에 추가될) item 인자를 포인터해준다. 이제 리듀서 함수(`cartReducer`)에 action이 전송될 것이다.

### item 을 추가하는 로직 완성하기

```js
const cartReducer = (state, action) => {
  if (action.type === "ADD") {
  }
  return defaultCartState;
};
```

- action 을 받았으니 다시 `cartReducer` 리듀서 함수로 돌아가자. 이 리듀서 함수 안에서 item 을 추가하는 로직을 완성할 것이다. `cartReducer` 함수는 if 문을 통해서 action.type이 'ADD' 와 같은지를 확인(item 을 추가하는 로직은 type이 'ADD' 일 때만 사용하기 때문이다.)하고, cart에 item 을 추가할 것이다.

```js
const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedItems = state.items;
  }
  return defaultCartState;
};
```

- if 문을 통과하면 item 을 `items` 배열에 새로 추가할 수 있도록 하자. 그런데 같은 제품끼리 묶어서 나타내고 가격을 제품 하나 기준으로 나타내야 한다. 게다가 cart에 들어간 아이템들의 총 값인 `totalAmount`도 업데이트를 해야한다.
- 먼저, 가장 최신의 스냅샷인 `state`(상태) 에서 `state.items`로 접근하여 '현재' cart에 들어있는 아이템들을 모두 구할 수 있도록 하자. (React가 리듀서 함수의 첫 번째 인자로 보낸 상태(state) 값을 기준으로 한다.) 이름은 `updatedItems`로 지정한다.

```js
const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedItems = state.items.concat(action.item);
  }
  return defaultCartState;
};
```

- 그리고 `concat()` 메소드를 사용해서 `addItemToCartHandler` 함수가 트리거 될 때 받아오는 action의 item 으로 접근하여(`action.item`) 이것들이 기존의 cart 바구니(`state.items`)에 추가될 수 있도록 한다. `concat()` 메소드는 `push()` 메소드와는 달리, 기존의 배열을 수정하지 않고, "새로운 배열"로 반환한다.

  - `concat()`은 인자로 주어진 배열이나 값들을 기존 배열에 합쳐서 새 배열을 반환해주는 메소드이다.
    > [MDN 문서 참조 : Array.prototype.concat()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)

- 이는 아주 중요한 포인트인데, 상태(state)의 불변성을 유지하면서 업데이트를 하려면 기존의 최신 상태(state) 스냅샷을 수정해서는 안되기 때문이다! (만약 `push()`로 기존의 배열을 수정한다면, 메모리의 기존 데이터가 React 도 모르게 수정이 될 것이다.)
- 새로운 item 을 추가하는 함수(`addItemToCartHandler`) 가 실행되면, 리듀서 함수에 자동으로 action이 들어오고 이 "action" 값의 item 필드에 저장된 item 에 모든 데이터가 새로이 들어올 것이다. 그렇기 때문에 `action.item`로 접근하여 `concat()` 메소드에 인자로 넣어준다.

```js
const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedItems = state.items.concat(action.item);

    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;
  }
  return defaultCartState;
};
```

- "아이템 항목 당 갯수"와 "아이템 항목의 갯수", 그리고 "아이템 항목 하나당 가격"을 모두 계산하는 `updatedTotalAmount` 는 cart에 들어있는 아이템 항목의 갯수인 기존 상태(state)의 최신 스냅샷인 `state.totalAmount`에 아이템 항목당 갯수인 `action.item.amount`와 아이템의 가격인 `action.item.price`을 곱한 값을 더해준 것이다. 이렇게 접근하기 위해서는 `action`으로 들어오는 `item`에 `amount`와 `price` 필드가 필요할 것이다. `action.item.amount`와 `action.item.price`를 곱하면 아이템 항목 당 `totalAmount`의 계산 값을 알 수 있을 것이다.

```js
const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedItems = state.items.concat(action.item);
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  return defaultCartState;
};
```

- 이제 새로운 상태(state)를 받을 수 있게 되었다. 동일한 item이 cart에 들어있는지에 대한 여부는 아직 체크하지 않았지만 나중에 추가할 예정이다.

```js
const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedItems = state.items.concat(action.item);
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    return {};
  }
  return defaultCartState;
};
```

- 이제 새로운 상태(state) 스냅샷을 return 할 것이다. 이 반환되는 객체는 기존의 `defaultCartState`의 필드(초기 값)를 기반으로 작성한다.

```js
const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedItems = state.items.concat(action.item);

    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  return defaultCartState;
};
```

- 새로운 아이템이 추가될 때마다 (`action.type === "ADD"`일 때) `items`에는 action 으로 받은 새로운 item을 추가하는 `updatedItems`으로 업데이트될 것이고, `totalAmount`는 기존에 존재하고 있는 총합에 action 으로 받은 새로운 item 의 데이터를 기반으로 접근한 price 와 amount 를 곱한 값을 더한 `updatedTotalAmount`으로 업데이트 될 것이다.

</br>

## Refs 및 Forward Refs 작업하기

```js
const addItemToCartHandler = (item) => {
  dispatchCartAction({
    type: "ADD",
    item: item, // 하나의 item 마다 item의 데이터(id, name, amount, price)들이 포함된 묶음 객체로 들어올 것이다.
  });
};

...

const cartContext = {
  items: cartState.items,
  totalAmount: cartState.totalAmount,
  addItem: addItemToCartHandler,
  removeItem: removeItemToCartHandler,
};
```

- 이제 `addItemToCartHandler` 함수를 호출해야 하니 Context 에서 `addItem`을 호출해야 한다. 최종적으로는 `MealItemFrom`에 도달할 것이다.

#### MealItemForm.js

```js
<form className={classes.form}>
  <Input
    label="Amount"
    input={{
      id: "amount_" + props.id,
      type: "number",
      min: "1",
      max: "5",
      step: "1",
      defaultValue: "1",
    }}
  />
  <button>+ Add</button>
</form>
```

- `MealItemForm` 컴포넌트에서 버튼을 누르면 item 이 하나씩 Cart에 추가되는 형태이다. 가장 첫 번째로 해야할 일은 `submitHandler` 함수를 생성하는 일이다.

```js
const submitHandler = (event) => {};
```

- `submitHandler` 함수를 호출 할 때 event를 인자로 받도록 작성하면, 이 함수를 호출할 때마다 자동으로 event가 일어나는 위치를 인자로 전달받을 수 있게 된다.

```js
<form className={classes.form} onSubmit={submitHandler}>
  ...
  <button>+ Add</button>
</form>
```

- 이 `submitHandler` 함수를 `onSubmit` 이벤트나 form 이벤트가 발생할 때마다 호출할 수 있도록 `<form>` 태그에 `onSubmit` 이벤트 prop 을 달아 `submitHandler` 함수를 포인터해준다.

```js
const submitHandler = (event) => {
  event.preventDefault();
};
```

- 먼저, 해당 함수 안에 `event.preventDefault()`를 추가해서 페이지가 다시 로드되는 현상을 방지한다. 그리고 해당 함수에서 받은 event 인자를 이용하여, 이벤트가 발생한 위치의 value 값을 추출해야 한다. 이때 우리는 `ref`를 사용할 수 있을 것이다.

```js
import React, { useRef, useState } from "react";

...
const amountInpuntRef = useRef();
```

- `useRef`를 선언하고, `ref`를 `Input` 컴포넌트에 달아주어야 한다. `Input` 에서 발생한 event의 value 값을 받아와야 하기 때문이다. 하지만 `Input`은 태그가 아니라 별개의 컴포넌트이고, 별개의 컴포넌트에는 `ref`를 prop으로 전달할 수 없다.

```js
<Input
  ref={amountInpuntRef}
  label="Amount"
  input={{
    id: "amount_" + props.id,
    type: "number",
    min: "1",
    max: "5",
    step: "1",
    defaultValue: "1",
  }}
/>
```

- 우리가 앞서 공부했던 방법으로 별개의 컴포넌트인 `Input` 에서도 `ref` 속성을 prop으로 전달 받을 수 있도록 작업해줘야 한다. 별개의 컴포넌트(커스텀 컴포넌트)에 `ref` prop이 작동되기 위해서는 `ref`를 내려받는 컴포넌트로 이동해서 `React.forwardRef`로 컴포넌트 로직을 감싸주는 작업을 추가로 진행해줄 필요가 있다.

#### Input.js

```js
const Input = (props) => {
  return (
    <div className={classes.input}>
      <label htmlFor={props.input.id}>{props.label}</label>
      <input {...props.input} />
    </div>
  );
};
```

- `ref` 를 prop으로 받아올 `Input` 컴포넌트이다. 우리는 이 컴포넌트 로직을 `React.forwardRef()`로 감싸주어야 `ref` prop을 작동시킬 수 있다.

```js
const Input = React.forwardRef((props, ref) => {
  return (
    <div className={classes.input}>
      <label htmlFor={props.input.id}>{props.label}</label>
      <input ref={ref} {...props.input} />
    </div>
  );
});
```

- `Input` 컴포넌트(커스텀 컴포넌트)는 상위 컴포넌트에서 내려준 `ref` prop을 작동할 수 있게 되었다. 함수 컴포넌트는 `forwardRef`의 인자가 된 셈이다. 포워딩 된 `ref`를 `input` 태그의 `ref` 속성과 연결되도록 작업해주면 이제 `ref`를 통해 `Input` 컴포넌트 내부의 `<input>` 태그 값에 접근 가능해진다.

```js
const submitHandler = (event) => {
  event.preventDefault();
  const enteredAmount = amountInpuntRef.current.value;
};
```

- `submitHandler` 함수가 작동될 때마다 `amountInpuntRef`의 value 값에 접근하는 변수를 선언해준다. `amountInpuntRef.current`가 `ref`에 저장된 `<input>` 요소를 point 할 것이다. 그리고 이렇게 얻은 value 값은 언제나 '문자열'이다. 그래서 우리가 이 값을 계산을 하기 위한 용도로 사용하기 위해서는 반드시 숫자형으로 변경을 해주어야 할 것이다.
  > `useRef`로 `ref`를 만들 때에는 `current`를 붙여서 속성 값에 접근해야 한다.

```js
const submitHandler = (event) => {
  event.preventDefault();
  const enteredAmount = amountInpuntRef.current.value;

  const enteredAmountNumber = +enteredAmount;
};
```

- `ref.current`로 받은 value 값인 `enteredAmount`에 `+`를 붙여줌으로써 간단하게 문자열인 숫자 값(ex. `"1"`)을 숫자타입(ex. `1`)으로 변형해준다.

```js
const submitHandler = (event) => {
  event.preventDefault();

  const enteredAmount = amountInpuntRef.current.value;
  const enteredAmountNumber = +enteredAmount;

  if (enteredAmount.trim().length ==== 0) {}
};
```

- 전달 받은 값의 유효성을 판별하기 위해 `if` 문을 작성한다. 먼저 문자열로 입력된 값에 `trim()` 메소드로 양 앞뒤로의 공백을 제거한 `enteredAmount`의 길이가 0일 때를 체크한다. 값이 0 일때를 판별해주는 것이다.

```js
if (enteredAmount.trim().length === 0 || enteredAmountNumber < 1) {
}
```

- 숫자로 변환한 값인 `enteredAmountNumber` 가 1보다 작거나,

```js
if (
  enteredAmount.trim().length === 0 ||
  enteredAmountNumber < 1 ||
  enteredAmountNumber > 5
) {
}
```

- 숫자로 변환한 값인 `enteredAmountNumber` 가 5보다 큰지를 확인한다.

```js
if (
  enteredAmount.trim().length === 0 ||
  enteredAmountNumber < 1 ||
  enteredAmountNumber > 5
) {
  setAmountIsValid(false);
  return;
}
```

- 이런 유효성을 판단하는 과정에서 세가지 조건 중에 '두가지' 조건이 충족되면 `submitHandler` 함수의 실행을 멈출 수 있도록 return 을 작성해준다.

- 앞서 세가지 요건 중에 '두가지' 조건이 충족된다는 것은 우리가 원하는 결과 값이 아니라는 소리일 것이다. 이런 조건에 해당할 때마다 오류 메세지가 뜨도록 추가하는 게 좋을지도 모른다.

```js
const [amountIsValid, setAmountIsValid] = useState(true);
```

- `MealItemForm` 컴포넌트 내부에 `useState`를 import 하고 앞서 오류메세지의 가시화 여부를 업데이트해줄 수 있는 상태(state)를 추가한다. form이 유효한지에 대해서만 체크하는 간단한 상태(state)이다. 초기 설정은 true로 하고 상태(state) 스냅샷과 상태(state) 업데이트 함수를 작성한다.

```js
const submitHandler = (event) => {
  event.preventDefault();

  const enteredAmount = amountInpuntRef.current.value;
  const enteredAmountNumber = +enteredAmount;

  if (
    enteredAmount.trim().length === 0 ||
    enteredAmountNumber < 1 ||
    enteredAmountNumber > 5
  ) {
    setAmountIsValid(false);
    return;
  }
};
```

- 우리가 앞서 작성한 유효하지 않은 input 값일 때 바로 반환을 해주었던 걸 기억할 것이다. input의 값이 유효하지 않을 때마다 `amountIsValid` 상태 값을 상태 업데이트 함수`setAmountIsValid` 를 이용하여 fasle 로 업데이트해주고, 다시 `submitHandler` 함수의 실행을 멈출 수 있도록 return 을 작성한다.

```js
<button>+ Add</button>;
{
  !amountIsValid && <p>상품의 갯수를 1개 이상 5개 이하로 입력해주세요.</p>;
}
```

- 마지막으로 `button` 태그 아래에 조건식을 작성한다. `amountIsValid`가 false 일 때(input 값이 유효하지 않을 때)마다 오류 메세지가 출력될 수 있도록 한다. 여기서 form의 양식 제출은 input 값이 유효할 때만 완성된다는 사실이 가장 중요하다.

```js
if (
  enteredAmount.trim().length === 0 ||
  enteredAmountNumber < 1 ||
  enteredAmountNumber > 5
) {
  setAmountIsValid(false);
  return;
}

props.onAddToCart();
```

- `MealItemForm` 컴포넌트에는 `amount` 만 있다. item의 `id` 나 `name`, `price` 데이터는 존재하지 않는다. 그래서 Context를 직접 가져와서 사용할 필요가 없었으며, props로 받은 함수를 대신 호출하는 것이다.

```js
props.onAddToCart(enteredAmountNumber);
```

- `ref.current`로 받은 value 값이 if 문을 통과하고 나면, 이 값을 props 로 받은 `onAddToCart` 함수에 넣어준다. 이 함수를 통해서 조건식을 통과한 유효한 `amount` 값을 parse 할 것이다. if 문을 통과할 때만 form 제출을 할 수 있는 것이다. 이제 cart 에 item 을 추가하기 위해 Context method 를 실행해야 한다. 그러기 위해서는 상위 컴포넌트(`MealItem`)로 이동하여, Context 함수를 props 으로 내려주고, 이를 해당 `MealItemForm` 컴포넌트에서 props로 받아와 호출해야 할 것이다.

#### MealItem.js

```js
import React, { useContext } from "react";
import CartContext from "../../../store/cart-context";

const MealItem = (props) => {
  const cartCtx = useContext(CartContext);
  const addToCartHandler = (amount) => {

  };
  ...
};
```

- 먼저 `MealItem` 컴포넌트에서 CartContext를 받아오고 `amount`를 인자로 받아오는 `addToCartHandler` 함수를 추가해보자.

```js
<MealItemForm onAddToCart={addToCartHandler} />
```

- 그 다음 포인터를 `MealItemForm` 컴포넌트에 `onAddToCart` 이란 prop으로 parse 한다.

```js
const addToCartHandler = (amount) => {
  cartCtx.addItem({
    name: props.name,
    amount: amount,
    price: props.price,
  });
};
```

- `cartCtx`를 호출하고, `addItem` 라는 메소드 함수 안에 전달할 객체 값(item 데이터)들을 모두 넣어준다. `amount`는 `MealItemForm` 컴포넌트에서 인자로 받아오기 때문에 props 가 아닌, 인자 `amount`를 값으로 넣어준다. `MealItemForm` 컴포넌트에서 제출한 form 의 데이터 `amount`는 `MealItem` 컴포넌트의 `addToCartHandler` 함수의 인자로 들어온다. 그리고 그 값은 Context의 `addItem` 함수에 전달될 것이다.

```js
const addToCartHandler = (amount) => {
  cartCtx.addItem({
    id: props.id,
    name: props.name,
    amount: amount,
    price: props.price,
  });
};
```

- `id`는 props를 통해서 받을 것이기 때문에 `props.id`로 설정해준다. `id`는 상위 컴포넌트인 `AvailableMeals` 에서 받아오기 때문에 `AvailableMeals`로 이동해서 `id`를 prop 해줄 수 있도록 추가한다.

#### AvailableMeals.js

```js
const AvailableMeals = () => {
  const mealsList = DUMMY_MEALS.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));
  ...
};
```

- 실행 결과를 확인해보면 Add 버튼을 누를 때마다 Cart 에 담긴 item 갯수(`amount`)가 증가하는 것을 확인할 수 있다.

![ezgif com-gif-maker (41)](https://user-images.githubusercontent.com/53133662/163715814-e60cc329-3f32-4b19-9826-732976610615.gif)

</br>

## 장바구니 항목 출력하기

</br>

## 더 복잡한 리듀서 로직 작업하기

</br>

## 동적인 아이템들로 만들기

</br>
