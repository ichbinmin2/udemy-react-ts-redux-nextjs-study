import React, { useState } from "react";
import AddUser from "./components/Users/AddUser";
import UserList from "./components/Users/UserList";

function App() {
  const [users, setUsers] = useState([]);

  return (
    <div>
      <AddUser />
      <UserList users={[]} />
    </div>
  );
}

export default App;
