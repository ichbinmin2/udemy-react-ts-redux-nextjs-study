import { useRef } from "react";
import Input from "../../UI/Input";
import classes from "./MealItemForm.module.css";

const MealItemForm = (props) => {
  const inputRef = useRef();

  const submitHander = (e) => {
    e.preventDefault();

    const enteredAmount = inputRef.current.value;
    const enteredAmountNumber = +enteredAmount;

    console.log(enteredAmountNumber);
    props.onAdd(enteredAmountNumber); //amount를 넘겨줘야 함.
  };

  // input value = amount 값을 받아오기
  // input 이 컴포넌트임. 컴포넌트는 ref를 사용할 수 없음.

  return (
    <form className={classes.form} onSubmit={submitHander}>
      <Input
        ref={inputRef}
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
  );
};

export default MealItemForm;
