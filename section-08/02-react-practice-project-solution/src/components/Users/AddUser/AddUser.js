import React, { useState } from "react";
import Button from "../../UI/Button/Button";
import Card from "../../UI/Button/Card";

import styles from "./AddUser.module.css";

const AddUser = (props) => {
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");

  const usernameChangeHandler = (event) => {
    setUserName(event.target.value);
  };

  const ageChangeHandler = (event) => {
    setUserAge(event.target.value);
  };

  const addUserHandler = (event) => {
    event.preventDefault(); // form submit 리로딩 방지

    if (userName.trim().length === 0 || userAge.trim().length === 0) {
      return;
    }

    if (+userAge < 1) {
      return;
    }

    console.log(userName, userAge);
    setUserName("");
    setUserAge("");
  };

  return (
    <Card classNameProps={styles.input}>
      <form onSubmit={addUserHandler}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          onChange={usernameChangeHandler}
          value={userName}
        />
        <label htmlFor="age">Age (Years)</label>
        <input
          id="age"
          type="number"
          onChange={ageChangeHandler}
          value={userAge}
        />
        <Button type="submit">Add User</Button>
      </form>
    </Card>
  );
};

export default AddUser;
