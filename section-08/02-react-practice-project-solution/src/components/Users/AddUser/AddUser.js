import React from "react";
import styles from "./AddUser.module.css";

const AddUser = (props) => {
  const addUserHandler = (event) => {
    event.preventDefault(); // form submit 리로딩 방지
  };
  return (
    <form onSubmit={addUserHandler} className={styles["new-form"]}>
      <label htmlFor="username">Username</label>
      <input id="username" type="text" />
      <label htmlFor="age">Age (Years)</label>
      <input id="age" type="number" />
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUser;
