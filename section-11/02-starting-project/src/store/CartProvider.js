import React, { useReducer } from "react";
import CartContext from "./cart-context";

//카트 컨텍스트와 카트 데이터를 만들어준다?
//컨텍스트 데이터를 관리하는 로직을 추가하기

// 리듀서 -> 복잡한 로직을 계산해줌
// 컨텍스트 -> 전역 상태 관리
const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  // Add
  if (action.type === "ADD") {
    const newTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const existCartItem = state.items[existingCartItemIndex];

    let updatedItems;
    if (existCartItem) {
      const updatedItem = {
        ...existCartItem,
        amount: existCartItem.amount + action.item.amount,
      };

      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: newTotalAmount,
    };
  }
  // Remove

  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemToCartHandler = (id) => {
    dispatchCartAction({ type: "Remove", id: id });
  };

  // 초기 데이터 만들기 => 우리가 내보낼 값임.
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
