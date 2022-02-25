import React from "react";
import "./ExpenseItem.css";

const ExpenseItem = () => {
  const expenseDate = new Date(2022, 2, 28);
  // 날짜 객체는 문자열 형태로 출력되지 않기에, toISOString() 메소드로 문자열화 한다.
  const expenseTitle = "Car Insurance";
  const expenseAmount = 294.67;
  return (
    <div className="expense-item">
      <div>{expenseDate.toISOString()}</div>
      <div className="expense-item__description">
        <h2>{expenseTitle}</h2>
        <div className="expense-item__price">${expenseAmount}</div>
      </div>
    </div>
  );
};
export default ExpenseItem;
