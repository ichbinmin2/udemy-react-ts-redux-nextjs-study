import React from "react";

import styles from "./UserItem.module.css";

const UserItem = (props) => {
  return (
    <li className={styles["new-user"]}>
      {`${props.name} (${props.age} year old)`}
    </li>
  );
};

export default UserItem;
