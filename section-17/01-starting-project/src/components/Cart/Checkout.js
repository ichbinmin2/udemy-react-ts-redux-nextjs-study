import React, { useRef, useState } from "react";
import classes from "./Checkout.module.css";

// input 값이 비어있는지
const isEmpty = (value) => value.trim() === "";
// value 길이가 5가 아닐 때
const isNotFiveChars = (value) => value.trim().length !== 5;

const Checkout = (props) => {
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    street: true,
    city: true,
    postalCode: true,
  });
  const nameInput = useRef();
  const streetInput = useRef();
  const postalCodeInput = useRef();
  const cityInput = useRef();

  const confirmHandler = (event) => {
    event.preventDefault();
    const enteredName = nameInput.current.value;
    const enteredStreet = nameInput.current.value;
    const enteredPostalCode = nameInput.current.value;
    const enteredCity = nameInput.current.value;

    // 유효성 검사. true
    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredStreetIsValid = !isEmpty(enteredStreet);
    const enteredPostalCodeIsValid = !isEmpty(enteredPostalCode);
    const enteredCityIsValid = !isNotFiveChars(enteredCity);

    // 새로운 객체로 반환
    setFormInputsValidity({
      name: enteredNameIsValid,
      street: enteredStreetIsValid,
      city: enteredPostalCodeIsValid,
      postalCode: enteredCityIsValid,
    });

    const formIsValid =
      enteredNameIsValid &&
      enteredStreetIsValid &&
      enteredPostalCodeIsValid &&
      enteredCityIsValid;

    // 양식이 유효하지 않을 때
    if (!formIsValid) {
      return;
    }

    // submit the cart data
  };

  const nameControlClasses = `${classes.control} ${
    formInputsValidity.name ? "" : classes.invalid
  }`;

  const streetControlClasses = `${classes.control} ${
    formInputsValidity.street ? "" : classes.invalid
  }`;

  const postalCodeControlClasses = `${classes.control} ${
    formInputsValidity.postalCode ? "" : classes.invalid
  }`;

  const cityControlClasses = `${classes.control} ${
    formInputsValidity.city ? "" : classes.invalid
  }`;

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={nameControlClasses}>
        <label htmlFor="name">Your Name</label>
        <input ref={nameInput} type="text" id="name" />
        {!formInputsValidity.name && <p>유효한 이름을 입력해주세요.</p>}
      </div>
      <div className={streetControlClasses}>
        <label htmlFor="street">Street</label>
        <input ref={streetInput} type="text" id="street" />
        {!formInputsValidity.street && <p>유효한 주소를 입력해주세요.</p>}
      </div>
      <div className={postalCodeControlClasses}>
        <label htmlFor="postal">Postal Code</label>
        <input ref={postalCodeInput} type="text" id="postal" />
        {!formInputsValidity.postalCode && (
          <p>유효한 우편번호를 입력하십시오.</p>
        )}
      </div>
      <div className={cityControlClasses}>
        <label htmlFor="city">City</label>
        <input ref={cityInput} type="text" id="city" />
        {!formInputsValidity.city && <p>유효한 도시를 입력해주세요.</p>}
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
