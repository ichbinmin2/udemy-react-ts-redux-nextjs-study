import React, { useContext } from "react";
import Modal from "../UI/Modal";
import CartContext from "../../store/cart-context";

import classes from "./Cart.module.css";
import CartItem from "./CartItem";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);

  // 총 가격도 가져와야 함
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  // 카트 내부에서 아이템의 갯수를 추가하는 함수
  const cartItemAdd = (item) => {
    cartCtx.addItem({
      ...item, // 그대로 item 을 받아서 컨텍스트에 전달하면 => 리듀서 함수에서 action 을 받아 중복 유효성을 처리해줄 것이기에 item 그대로 복사해서 전달
      amount: 1, // 수량만 추가함
    });
  };

  const cartItemRemove = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {/* {[{ id: "c1", name: "Sushi", amount: 2, price: 12.99 }].map((item) => (
        <li key={item.id}>{item.name}</li>
      ))} */}
      {/* {cartCtx.items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))} */}

      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemove.bind(null, item.id)}
          onAdd={cartItemAdd.bind(null, item)}
        />
      ))}
    </ul>
  );
  return (
    <Modal onClose={props.onClose}>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amout</span>
        {/* <span>35.62</span> */}
        <span>{totalAmount}</span>
      </div>
      <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={props.onClose}>
          Close
        </button>

        {/* 카트에 아이템이 하나라도 담겨있을 때만 order 버튼이 출력되도록 작성 */}
        {hasItems && <button className={classes.button}>Order</button>}
        {/* <button className={classes.button}>Order</button> */}
      </div>
    </Modal>
  );
};

export default Cart;
