import { useState } from "react";

import useInput from "../hooks/use-input";

const SimpleInput = (props) => {
  // name
  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInput((value) => value.trim() !== "");

  // e-mail
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: eamilChangeHandler,
    inputBlurHandler: eamilBlurHandler,
    reset: resetEmailInput,
  } = useInput((value) => value.trim() !== "" && value.includes("@"));

  // const [enteredName, setEnteredName] = useState("");
  // const [enteredNameTouched, setEnteredNameTouched] = useState(false);

  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);

  // const enteredNameIsValid = enteredName.trim() !== "";
  // const nameInputIsInvalid = !enteredNameIsValid && enteredNameTouched;

  // const enteredEmailIsValid =
  //   enteredEmail.trim() !== "" && enteredEmail.includes("@");
  // const emailInputIsInvalid = !enteredEmailIsValid && enteredEmailTouched;

  let formIsValid = false;

  if (enteredNameIsValid && enteredEmailIsValid) {
    formIsValid = true;
  } else {
    formIsValid = false;
  }

  // const nameInputChangeHandler = (event) => {
  //   setEnteredName(event.target.value);
  // };

  // const emailInputChangeHandler = (event) => {
  //   setEnteredEmail(event.target.value);
  // };

  // const nameInputBlurHandler = () => {
  //   setEnteredNameTouched(true);
  // };

  // const emailInputBlurHandler = () => {
  //   setEnteredEmailTouched(true);
  // };

  const formSubmitssionHandler = (event) => {
    event.preventDefault();
    // setEnteredNameTouched(true);
    // setEnteredEmailTouched(true);

    if (!enteredNameIsValid || !enteredEmailIsValid) {
      return;
    }

    // setEnteredName("");
    // setEnteredNameTouched(false);
    resetNameInput();

    // setEnteredEmail("");
    // setEnteredEmailTouched(false);
    resetEmailInput();
  };

  const nameInputClasses = nameInputHasError // true ??????,
    ? "form-control invalid" // ?????? css
    : "form-control";

  const emailInputClasses = emailInputHasError // true ??????,
    ? "form-control invalid" // ?????? css
    : "form-control";

  return (
    <form onSubmit={formSubmitssionHandler}>
      <div className={nameInputClasses}>
        <label htmlFor="name">Your Name</label>
        <input
          type="text"
          id="name"
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
          value={enteredName}
        />
        {nameInputHasError && (
          <p className="error-text">Name must not be empty.</p>
        )}
      </div>
      <div className={emailInputClasses}>
        <label htmlFor="name">Your E-mail</label>
        <input
          type="email"
          id="email"
          onChange={eamilChangeHandler}
          onBlur={eamilBlurHandler}
          value={enteredEmail}
        />
        {emailInputHasError && (
          <p className="error-text">Email must not be empty.</p>
        )}
      </div>
      <div className="form-actions">
        <button disabled={!formIsValid}>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;
