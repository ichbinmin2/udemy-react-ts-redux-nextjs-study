import React, { useState } from "react";
import Modal from "./components/Modal/Modal";
import AddUser from "./components/User/AddUser/AddUser";
import UserList from "./components/User/UserList/UserList";

const nonValue = "Please enter a valid name and age (non-empty values)";
const ageValid = "Please enter a valid age (> 0)";

function App() {
  const [user, setUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const userHandler = (userInfo) => {
    setUser([...user, userInfo]);
  };

  const onModalShowHandler = (check) => {
    console.log("check", check);
    if (check === false) {
      setMessage(nonValue);
    } else if (check === true) {
      setMessage(ageValid);
    }
    setShowModal(true);
  };

  const onModalHideHandler = () => {
    setShowModal(false);
  };

  console.log("user", user);
  console.log("showModal", showModal);

  // 1. input의 값이 0일 때 modal - Invalid input : message1
  // 2. age의 값이 음수 (-1) 일 때 modal - Invalid input : message2
  // Modal에 창을 닫는 button 있음(showModal 값을 이용함)

  return (
    <div>
      <Modal
        hide={onModalHideHandler}
        modal={showModal}
        header={"Invalid Input"}
      >
        {message}
      </Modal>
      <AddUser
        onUserHandler={userHandler}
        onModalHandler={onModalShowHandler}
      />
      <UserList users={user} />
    </div>
  );
}

export default App;
