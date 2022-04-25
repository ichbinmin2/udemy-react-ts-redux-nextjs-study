import { useState } from "react";

import Header from "./components/Layout/Header";
import Meals from "./components/Meals/Meals";
import Cart from "./components/Cart/Cart";
import CartProvider from "./store/CartProvider";

function App() {
  const [IsShownCart, setIsShownCart] = useState(false);

  const showModal = () => {
    setIsShownCart(true);
  };

  const hideModal = () => {
    setIsShownCart(false);
  };

  return (
    <CartProvider>
      <Header onClick={showModal} />
      {IsShownCart && <Cart onClose={hideModal} />}
      <main>
        <Meals />
      </main>
    </CartProvider>
  );
}

export default App;
