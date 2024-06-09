import React, { useEffect, useState } from 'react'
import { VscError } from 'react-icons/vsc';
import CartItem from '../components/CartItem';
import Link from "react-router-dom"
const cartItems =[
  {
          productId:"asfsdsdd",
          name:"MacBook",
          price:9000,
          stock:900,
          quantity:4,
          photo:"data:image/jpeg;base64,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"
  }
];
const subTotal=4000;
const tax = Math.round(subTotal*0.18);
const shippingCharges=200;
const discount=400;
const total = subTotal+tax+shippingCharges-discount;
const Cart = () => {
  const [couponCode,setCouponCode]=useState<string>("");
  const [isValidCouponCode,setIsVallidCouponCode]=useState<boolean>(false);
  useEffect(()=>{
    const timeoutID= setTimeout(()=>{
      if(Math.random()>0.5)setIsVallidCouponCode(true);
      else setIsVallidCouponCode(false);
    },1000);
    return ()=>{
      clearTimeout(timeoutID);
      setIsVallidCouponCode(false);
    }
  },[couponCode])
  return (
    <div className="cart">
      <main>
        {cartItems.length >0 ? cartItems.map((i, idx) => (
          <CartItem key={idx} cartItem={i} />
        )):<h1>No items Added</h1>}
      </main>
      <aside>
        <p>SubTotal: ${subTotal}</p>
        <p>Shipping Charges : ${shippingCharges}</p>
        <p>Tax: ${tax}</p>
        <p>
          Discount <em>- ${discount}</em>
        </p>
        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ${discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon Code <VscError />
            </span>
          ))}
          {
            cartItems.length >0 && <Link to="/shipping">Checkout</Link>
          }
      </aside>
    </div>
  );
}

export default Cart
