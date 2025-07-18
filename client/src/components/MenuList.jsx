import React, { useEffect, useState } from 'react';
import API from '../api';

const MenuList = ({ addToCart }) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await API.get('/api/menu');
      setMenu(res.data);
    };
    fetchMenu();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {menu.map(item => (
        <div key={item._id} className="border rounded p-3 shadow">
          <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
          <h3 className="font-bold mt-2">{item.name}</h3>
          <p>₹{item.price}</p>
          <button
            onClick={() => addToCart(item)}
            className="bg-green-600 text-white mt-2 px-3 py-1 rounded"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default MenuList;
