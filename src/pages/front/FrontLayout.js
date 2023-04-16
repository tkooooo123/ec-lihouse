import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Message from "../../components/Message";
import { MessageContext , messageReducer, initState } from "../../store/messageStore";
import Footer from "../../components/Footer";

function FrontLayout() {
  const reducer = useReducer(messageReducer, initState);
  const [cartData, setCartData] = useState({});
  const getCart = async () => {
    try {
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`,);

      console.log('cart', res)
      setCartData(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCart()

  }, [])
  return (
    <>
      <MessageContext.Provider value={reducer}>
        <Message/>
        <Navbar cartData={cartData} />
        <Outlet context={{ getCart, cartData }} />
        <Footer/>
 
      </MessageContext.Provider>
    </>
  )

}

export default FrontLayout;