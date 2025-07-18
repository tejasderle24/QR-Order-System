import React from 'react';

const Cart = ({ cart, placeOrder }) => {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-4 border-t">
      <h2 className="font-bold text-lg">Cart</h2>
      {cart.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center mt-2">
          <span>{item.name} x {item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}
      <h3 className="mt-3 font-bold">Total: ₹{total}</h3>
      <button
        onClick={placeOrder}
        className="bg-blue-600 text-white mt-3 px-3 py-1 rounded"
      >
        Place Order
      </button>
    </div>
  );
};

export default Cart;
