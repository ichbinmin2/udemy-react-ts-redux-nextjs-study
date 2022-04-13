import React, { useRef, useState } from "react";
import Input from "../../UI/Input";
import classes from "./MealItemForm.module.css";

const MealItemForm = (props) => {
  const [amountIsValid, setAmountIsValid] = useState(true); // form이 유효한지에 대해서만 체크하는 간단한 상태 state
  const amountInpuntRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredAmount = amountInpuntRef.current.value;
    const enteredAmountNumber = +enteredAmount; // 문자열을 숫자로 변경하는 아주 간단한 방법.

    if (
      // 문자로 입력된 값인 enteredAmount 에 공백을 없앤 길이가 0 이거나(값이 공백이거나),
      enteredAmount.trim().length === 0 ||
      // 숫자로 변환한 값인 enteredAmountNumber 가 1보다 작거나,
      enteredAmountNumber < 1 ||
      // 숫자로 변환한 값인 enteredAmountNumber 가 5보다 크면
      enteredAmountNumber > 5
    ) {
      // 이 ||(or) 에 작성된 세가지 조건 중에 '두가지' 조건이 충족되면 if 문 내부의 로직이 실행될 것이다.
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
