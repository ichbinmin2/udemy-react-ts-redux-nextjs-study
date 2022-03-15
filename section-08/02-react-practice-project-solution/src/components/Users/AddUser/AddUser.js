import React from "react";
import Button from "../../UI/Button/Button";
import Card from "../../UI/Button/Card";

import styles from "./AddUser.module.css";

const AddUser = (props) => {
  const addUserHandler = (event) => {
    event.preventDefault(); // form submit 리로딩 방지
  };
  return (
    <Card classNameProps={styles.input}>
      <form onSubmit={addUserHandler}>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" />
        <label htmlFor="age">Age (Years)</label>
        <input id="age" type="number" />
        <Button>Add User</Button>
      </form>
    </Card>
  );
};

export default AddUser;
