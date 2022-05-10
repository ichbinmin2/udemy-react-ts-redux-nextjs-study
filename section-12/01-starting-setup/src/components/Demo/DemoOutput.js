import React from "react";

const DemoOutput = (props) => {
  console.log("DemoOutput RUNNUNG");
  return <p>{props.show ? "This is New!" : ""}</p>;
};

export default DemoOutput;
