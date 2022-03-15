import React from "react";
import UserItem from "../UserItem/UserItem";
import styles from "./UserList.module.css";

const UserList = (props) => {
  return (
    <ul className={styles["new-userList"]}>
      {props.users.map((user) => (
        <UserItem key={user.id} name={user.name} age={user.age} />
      ))}
    </ul>
  );
};

export default UserList;
