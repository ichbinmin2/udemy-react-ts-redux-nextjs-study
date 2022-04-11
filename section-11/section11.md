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
