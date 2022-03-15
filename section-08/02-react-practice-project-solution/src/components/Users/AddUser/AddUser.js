import React, { useState } from "react";
import Button from "../../UI/Button/Button";
import Card from "../../UI/Button/Card";

import styles from "./AddUser.module.css";

const AddUser = (props) => {
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState("");

  const usernameChangeHandler = (event) => {
    setUserName(event.target.value);
  };

  const ageChangeHandler = (event) => {
    setAge(event.target.value);
  };

  const addUserHandler = (event) => {
    event.preventDefault(); // form submit 리로딩 방지

    console.log(userName, age);
  };

  return (
    <Card classNameProps={styles.input}>
      <form onSubmit={addUserHandler}>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" onChange={usernameChangeHandler} />
        <label htmlFor="age">Age (Years)</label>
        <input id="age" type="number" onChange={ageChangeHandler} />
        <Button type="submit">Add User</Button>
      </form>
    </Card>
  );
};

export default AddUser;
