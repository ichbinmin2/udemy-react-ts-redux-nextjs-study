import React from "react";
import Card from "../UI/Button/Card";

import styles from "./UserList.module.css";

const UserList = (props) => {
  return (
    <Card classNameProps={styles.users}>
      <ul>
        {props.users.map((user) => (
          <li>
            {user.name} ({user.age} years old)
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default UserList;
