import React, { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    // const updatedItems = state.items.concat(action.item);
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    // item이 카트에 이미 있는지 없는지를 체크해야 한다.
    // .findIndex()는 배열 안의 item index를 찾아주는 메소드이다.
    // .findIndex()의 인자 item을 찾고, item이면 ture고 아니면 false를 return 한다.
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    // state.items 배열에서 살펴본 인자 item이 action 에서 새로 추가한 item 과 id가 동일하다면 true 를 리턴할 것이다.
    // true 를 리턴한다는 것은 앞의 조건이 만족해서 true가 된다면 그 item의 index 를 리턴한다는 뜻이다.

    // state.items에 existingCartItemIndex 로 찾은 index 번호를 넣은 값이 existingCartItem(상수) 가 된다.
    const existingCartItem = state.items[existingCartItemIndex];
    // existingCartItem(상수)는 해당 item이 cart 에 있을 때만 작동한다.

    let updatedItems;

    // existingCartItem(상수) 이 카트 안에 있다면 true 일 것이다.
    if (existingCartItem) {
      // 만약 existingCartItem 가 true 라면
      const updatedItem = {
        ...existingCartItem, // existingCartItem 을 그대로 받고
        amount: existingCartItem.amount + action.item.amount,
        // existingCartItem의 amount 에다 새로 추가한 동일 item 의 amount를 더해준다.
      };

      // updatedItems는 state.items 를 그대로 만든 새로운 배열 값으로 만들고
      updatedItems = [...state.items];
      // 동일한 item 을 찾은 index 값은 이미 있는 updatedItem 으로 할당한다.
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // existingCartItem(상수) 이 카트 안에 없다면 false 일 것이다. 처음 카트에 추가되는 경우이다.
      updatedItems = state.items.concat(action.item);
      // concat() 으로 새로운 배열에 action의 item을 추가해서 업데이트해준다.
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({
      type: "ADD",
      item: item, // 하나의 item 마다 item의 데이터(id, name, amount, price)들이 포함된 묶음 객체로 들어올 것이다.
    });
  };

  const removeItemToCartHandler = (id) => {
    dispatchCartAction({
      type: "REMOVE",
      id: id,
    });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemToCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
