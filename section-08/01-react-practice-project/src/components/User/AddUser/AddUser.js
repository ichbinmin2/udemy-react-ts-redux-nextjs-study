import React from "react";

import styles from "./AddUser.module.css";
import UserForm from "./UserForm";

const AddUser = (props) => {
  const userInfoHandler = (userInfo) => {
    props.onUserHandler(userInfo);
  };

  const onModalHandler = (isValid) => {
    props.onModalHandler(isValid);
  };

  return (
    <div className={styles["new-form"]}>
      <UserForm
        userInfoHandler={userInfoHandler}
        onModalHandler={onModalHandler}
      />
    </div>
  );
};

export default AddUser;
