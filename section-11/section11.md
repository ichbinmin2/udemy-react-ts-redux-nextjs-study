# Second Practice Project: Building a Food Order App

## 목차

- [Practice | Adding a "Header" Component](#헤더-컴포넌트-추가하기)
- [Practice | Adding the "Cart" Button Component](#장바구니-버튼-컴포넌트-추가하기)

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
