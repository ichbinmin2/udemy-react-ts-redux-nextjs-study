import React, { useRef, useState } from "react";
import Input from "../../UI/Input";
import classes from "./MealItemForm.module.css";

const MealItemForm = (props) => {
  const [amountIsValid, setAmountIsValid] = useState(true);
  const amountInpuntRef = useRef();

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

    // form 제출은 amount를 처리하는 input 값이 유효할 때만 완성될 것이다.
    props.onAddToCart(enteredAmountNumber);
    // MealItemForm 컴포넌트에는 amount 만 있다. 아이템의 id 나 name, price 데이터는 존재하지 않는다.
    // 그래서 context를 사용할 필요가 없었으며, 함수를 대신 호출하는 것이다.
    // 이 함수를 통해서 props 만 받아서 유효한 amount 값을 parse 할 것이다.
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
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
      <button>+ Add</button>
      {!amountIsValid && <p>상품의 갯수를 1개 이상 5개 이하로 입력해주세요.</p>}
    </form>
  );
};

export default MealItemForm;
