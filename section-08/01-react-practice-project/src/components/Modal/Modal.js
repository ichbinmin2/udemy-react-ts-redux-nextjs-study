import React from "react";
import Button from "../UI/Button/Button";
import styles from "./Modal.module.css";

const Modal = (props) => {
  const { modal, hide } = props;

  return (
    // <div className={styles["new-modal-warp"]}>
    //   <div className={styles["new-modal"]}>
    //     dddd
    //     <button onClick={props.onModalShow}>Okay</button>
    //   </div>
    // </div>"openModal modal"

    <div
      className={
        modal ? `${styles.openModal} ${styles.modal}` : `${styles.modal}`
      }
      onClick={hide}
    >
      {modal ? (
        <section>
          <header>{props.header}</header>
          <main>{props.children}</main>
          <footer>
            <button className={styles.close} onClick={hide}>
              Okay
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default Modal;
