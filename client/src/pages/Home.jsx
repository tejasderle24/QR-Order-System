import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MenuList from '../components/MenuList';
import Cart from '../components/Cart';
import API from '../api';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL);

const Home = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tableId = queryParams.get('tableId') || 'unknown';

  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const exists = cart.find((c) => c.itemId === item._id);
    if (exists) {
      setCart(cart.map((c) =>
        c.itemId === item._id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, { itemId: item._id, name: item.name, price: item.price, quantity: 1 }]);
    }
  };

  const placeOrder = async () => {
    try {
      const res = await API.post('/api/orders', { tableId, items: cart });
      console.log('✅ Order placed:', res.data);
      setCart([]);
      alert(`✅ Order placed for Table: ${tableId}`);
    } catch (err) {
      console.error('❌ Error placing order:', err);
    }
  };

  useEffect(() => {
    socket.on('orderStatusUpdate', (order) => {
      if (order.tableId === tableId) {
        alert(`📢 Your order status: ${order.status}`);
      }
    });
    return () => socket.off('orderStatusUpdate');
  }, [tableId]);

  return (
    <div className="min-h-screen bg-black text-orange-400 p-4 flex flex-col lg:flex-row">
      {/* Left Side - Menu */}
      <div className="flex-1 p-4">
        <h1 className="text-4xl font-extrabold mb-6 border-b-4 border-orange-500 pb-2">
          📋 Menu (Table: {tableId})
        </h1>
        <div className="bg-gray-900 rounded-2xl shadow-lg p-4 border border-orange-500">
          <MenuList addToCart={addToCart} />
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-full lg:w-1/3 mt-6 lg:mt-0 lg:ml-6">
        <div className="sticky top-4 bg-gray-900 rounded-2xl shadow-lg p-4 border border-orange-500">
          <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>
          <Cart cart={cart} placeOrder={placeOrder} />
        </div>
      </div>
    </div>
  );
};

export default Home;
