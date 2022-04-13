import React, { useContext } from "react";
import Modal from "../UI/Modal";
import CartContext from "../../store/cart-context";

import classes from "./Cart.module.css";
import CartItem from "./CartItem";

const Cart = (props) => {
  const cartCxt = useContext(CartContext);

  // 총 가격도 가져와야 함
  const totalAmount = `$${cartCxt.totalAmount.toFixed(2)}`;
  const hasItems = cartCxt.items.length > 0;

  const cartItemAdd = (item) => {};

  const cartItemRemove = (id) => {};

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {/* {[{ id: "c1", name: "Sushi", amount: 2, price: 12.99 }].map((item) => (
        <li key={item.id}>{item.name}</li>
      ))} */}
      {/* {cartCxt.items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))} */}

      {cartCxt.items.map((item) => (
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
