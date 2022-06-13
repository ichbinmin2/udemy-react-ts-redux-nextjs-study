import { useState, useEffect } from "react";

const SimpleInput = (props) => {
  const [enteredName, setEnteredName] = useState("");
  // const [enteredNameIsValid, setEnteredNameIsValie] = useState(false);
  const [enteredNameTouched, setEnteredNameTouched] = useState(false);

  // useEffect(() => {
  //   if (enteredNameIsValid) {
  //     // true 일 때
  //     console.log("Name Input Is valid!"); // 콘솔에 출력한다
  //   }
  // }, [enteredNameIsValid]);

  const enteredNameIsValid = enteredName.trim() !== "";
  const nameInputIsInvalid = !enteredNameIsValid && enteredNameTouched;

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);

    // if (enteredName.trim() !== "") {
    // if (event.target.value.trim() !== "") {
    //   setEnteredNameIsValie(true);
    // }
  };

  const nameInputBlurHandler = (event) => {
    setEnteredNameTouched(true);

    // if (enteredName.trim() === "") {
    //   setEnteredNameIsValie(false);
    //   return;
    // }
  };

  const formSubmitssionHandler = (event) => {
    event.preventDefault();
    setEnteredNameTouched(true);

    // if (enteredName.trim() === "") {
    //   setEnteredNameIsValie(false);
    //   return;
    // }

    if (!enteredNameIsValid) {
      return;
    }

    // setEnteredNameIsValie(true);
    setEnteredName("");
    setEnteredNameTouched(false);
  };

  const nameInputClasses = nameInputIsInvalid // true 이면,
    ? "form-control invalid" // 경고 css
    : "form-control";

  return (
    <form onSubmit={formSubmitssionHandler}>
      <div className={nameInputClasses}>
        <label htmlFor="name">Your Name</label>
        <input
          type="text"
          id="name"
          onChange={nameInputChangeHandler}
          onBlur={nameInputBlurHandler}
          value={enteredName}
        />

        {nameInputIsInvalid && (
          <p className="error-text">Name must not be empty.</p>
        )}
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;
