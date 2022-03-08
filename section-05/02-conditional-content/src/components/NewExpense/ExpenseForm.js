import React, { useState } from "react";
import "./ExpenseForm.css";

const ExpenseForm = (props) => {
  const [show, setShow] = useState(false);
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredDate, setEnteredDate] = useState("");

  const titleChangeHandler = (event) => {
    const values = event.target.value;

    setEnteredTitle(values);
  };

  const amountChangeHandler = (event) => {
    const values = event.target.value;

    setEnteredAmount(values);
  };

  const dateChangeHandler = (event) => {
    const values = event.target.value;

    setEnteredDate(values);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const expenseData = {
      title: enteredTitle,
      amount: enteredAmount,
      date: new Date(enteredDate),
    };

    props.onSaveExpenseData(expenseData);

    // 초기화
    setEnteredTitle("");
    setEnteredAmount("");
    setEnteredDate("");
  };

  const onClickShowInput = () => {
    setShow(!show);
  };
  return (
    <form onSubmit={submitHandler}>
      {show && (
        <>
          <div className="new-expense__controls">
            <div className="new-expense__control">
              <label>Title</label>
              <input
                type="text"
                onChange={titleChangeHandler}
                value={enteredTitle}
              />
            </div>

            <div className="new-expense__control">
              <label>Amount</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                onChange={amountChangeHandler}
                value={enteredAmount}
              />
            </div>

            <div className="new-expense__control">
              <label>Date</label>
              <input
                type="date"
                min="2022-01-01"
                max="2024-12-31"
                onChange={dateChangeHandler}
                value={enteredDate}
              />
            </div>
          </div>

          <div className="new-expense__actions">
            <button onClick={onClickShowInput}>Cancel</button>
            <button type="submit">Add Expense</button>
          </div>
        </>
      )}
      {!show && (
        <div className="new-expense__actions display">
          <button onClick={onClickShowInput}>Add New Expense</button>
        </div>
      )}
    </form>
  );
};

export default ExpenseForm;
