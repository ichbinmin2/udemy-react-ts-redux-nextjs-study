import React, { useState } from "react";
import Button from "../../UI/Button/Button";

import styles from "./UserForm.module.css";

const UserForm = (props) => {
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [isValid, setIsValid] = useState(false);

  const userNameChangeHandler = (e) => {
    setUserName(e.target.value);
  };

  const userAgeChangeHandler = (e) => {
    setUserAge(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const user = {
      id: Math.random().toString(),
      name: userName,
      age: userAge,
    };

    let userNameLength = user.age.trim().length;
    let userAgeLength = user.name.trim().length;

    if (userNameLength <= 0 && userAgeLength <= 0) {
      setIsValid(false);
      props.onModalHandler(isValid);
    } else if (user.age < 0) {
      setIsValid(true);
      props.onModalHandler(isValid);
    } else {
      props.userInfoHandler(user);
    }

    setUserName("");
    setUserAge("");
  };

  console.log("isValid", isValid);

  return (
    <form className={styles["form-control"]} onSubmit={submitHandler}>
      <div>
        <div className={styles.display}>
          <label>Username</label>
          <input
            type="text"
            onChange={userNameChangeHandler}
            value={userName}
          />
        </div>
        <div className={styles.display}>
          <label>Age (Years)</label>
          <input type="text" onChange={userAgeChangeHandler} value={userAge} />
        </div>
      </div>
      <Button type="submit">Add User</Button>
    </form>
  );
};

export default UserForm;
