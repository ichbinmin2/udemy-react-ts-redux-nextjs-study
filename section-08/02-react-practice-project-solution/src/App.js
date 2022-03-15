import React, { useState } from "react";
import AddUser from "./components/Users/AddUser";
import UserList from "./components/Users/UserList";

function App() {
  const [usersList, setUsersList] = useState([]);

  const onAddUser = (uName, uAge) => {
    setUsersList((prevUserList) => {
      return [
        ...prevUserList,
        { id: Math.random().toString(), name: uName, age: uAge },
      ];
    });
  };
  return (
    <div>
      <AddUser onAddUser={onAddUser} />
      <UserList users={usersList} />
    </div>
  );
}

export default App;
