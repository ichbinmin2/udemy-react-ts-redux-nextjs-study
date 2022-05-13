import React from "react";

const MyParagraph = (props) => {
  console.log("MyParagraph RUNNUNG");
  return <p>{props.children}</p>;
};

export default MyParagraph;
