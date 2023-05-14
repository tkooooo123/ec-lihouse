import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Message from "../../components/Message";
import { MessageContext, messageReducer, initState } from "../../store/messageStore";
import Footer from "../../components/Footer";
import GoTopButton from "../../components/GoTopButton";

function FrontLayout() {
  const reducer = useReducer(messageReducer, initState);
  const [cartData, setCartData] = useState({});
  const getCart = async () => {
    try {
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`,);
      setCartData(res.data.data);
    } catch (error) {
  
    }
  }
  useEffect(() => {
    getCart();
  }, [])
  return (
    <>
      <MessageContext.Provider value={reducer} >
        <Message />
        <Navbar cartData={cartData} />
        <Outlet context={{ getCart, cartData }} />
        <GoTopButton />
        <Footer />
      </MessageContext.Provider>
    </>
  )

}

export default FrontLayout;