import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../component/header";   // Reused Header
import Footer from "../../component/footer";   // Reused Footer
import Tagbar from "../../component/tagbar";   // Reused Tagbar
import "./cart.css";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const userId = 1; // Giả sử lấy từ login hoặc context

  useEffect(() => {
    axios.get(`http://localhost:8080/cart/${userId}`)
      .then(response => {
        setCart(response.data);
      })
      .catch(error => {
        console.error("Error fetching cart:", error);
      });
  }, [userId]);

  const handleRemoveFromCart = (fishId) => {
    axios.delete(`http://localhost:8080/cart/remove/${fishId}?userId=${userId}`)
      .then(response => {
        setCart(response.data);
      })
      .catch(error => {
        console.error("Error removing item from cart:", error);
      });
  };
  

  const handleQuantityChange = (fishId, quantity) => {
    axios.put(`http://localhost:8080/cart/update?userId=${userId}`, {
      fishId: fishId,
      quantity: quantity
    })
    .then(response => {
      setCart(response.data);
    })
    .catch(error => {
      console.error("Error updating quantity:", error);
    });
  };
  

  return (
    <>
      <Header /> {/* Included Header */}
      <Tagbar /> {/* Included Tagbar */}

      <div className="cart-page">
        <h2 className="cart-title">Giỏ hàng của bạn</h2>

        <div className="cart-container">
          {cart && cart.cartItems.length > 0 ? (
            cart.cartItems.map(item => (
              <div key={item.fishId} className="cart-item">
                <img src={item.photo} alt={item.fishName} />
                <h3>{item.fishName}</h3>
                <p>Đơn giá: {item.unitPrice} VND</p>
                <p>
                  Số lượng:
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.fishId, e.target.value)}
                  />
                </p>
                <p>Tổng giá: {item.totalPrice} VND</p>
                <button onClick={() => handleRemoveFromCart(item.fishId)}>Xóa</button>
              </div>
            ))
          ) : (
            <p>Giỏ hàng của bạn trống.</p>
          )}
        </div>

        <div className="cart-total">
          <h3>Tổng tiền: {cart?.totalPrice} VND</h3>
        </div>
      </div>

      <Footer /> {/* Included Footer */}
    </>
  );
};

export default Cart;
