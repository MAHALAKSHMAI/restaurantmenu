import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Receipt from '../components/Receipt';

const CashierDashboard = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data } = await api.get('/menu');
      setMenu(data);
      const uniqueCategories = ['All', ...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
    };
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    const exists = cart.find(c => c._id === item._id);
    if (exists) {
      setCart(cart.map(c => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(c => {
      if (c._id === id) {
        const newQty = Math.max(1, c.quantity + delta);
        return { ...c, quantity: newQty };
      }
      return c;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c._id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.10; // 10% tax
  const discount = 0; // Can be expanded later
  const total = subtotal + tax - discount;

  const placeOrder = async () => {
    if (cart.length === 0) return alert('Cart is empty');
    try {
      const orderData = {
        items: cart.map(c => ({ menuItem: c._id, quantity: c.quantity, price: c.price })),
        totalAmount: total,
        tableNumber: parseInt(tableNumber) || 0
      };
      const { data } = await api.post('/orders', orderData);
      setLastOrder(data);
      setCart([]);
      setTableNumber('');
      navigate('/order-success', { state: { order: data } });
    } catch (error) {
      alert('Failed to place order');
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-receipt');
    const WinPrint = window.open('', '', 'width=900,height=650');
    WinPrint.document.write(`
      <html>
        <head><title>Receipt</title></head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  const filteredMenu = selectedCategory === 'All' 
    ? menu 
    : menu.filter(item => item.category === selectedCategory);

  return (
    <div className="flex h-screen bg-slate-100 font-inter">
      {/* Left Side: Menu Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Category Header */}
        <div className="bg-white border-b p-4 flex gap-3 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMenu.map(item => (
              <div 
                key={item._id} 
                onClick={() => addToCart(item)} 
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="aspect-video bg-slate-50 rounded-xl mb-4 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-orange-500 transition-colors">{item.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-orange-600 font-black text-xl">₹{item.price.toFixed(2)}</span>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-widest">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Order Summary */}
      <div className="w-[450px] bg-white border-l shadow-2xl flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-2xl font-black text-slate-800">Current Order</h2>
          {lastOrder && (
            <button onClick={handlePrint} className="text-orange-500 hover:text-orange-600">
              🖨️ Print
            </button>
          )}
        </div>

        {/* Table Selection */}
        <div className="p-4 bg-orange-50 border-b flex items-center gap-3">
           <span className="font-bold text-orange-800">TABLE NO:</span>
           <input 
            type="number" 
            placeholder="0" 
            className="w-20 p-2 bg-white border-2 border-orange-200 rounded-lg text-center font-black text-orange-600 focus:border-orange-500 outline-none"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
          />
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
              <span className="text-6xl mb-4">🛒</span>
              <p className="font-medium">Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="bg-slate-50 p-4 rounded-xl flex items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">{item.name}</h4>
                  <p className="text-slate-500 font-medium">₹{item.price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white border rounded-lg p-1">
                  <button onClick={() => updateQuantity(item._id, -1)} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-md text-xl font-bold">-</button>
                  <span className="w-6 text-center font-black">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)} className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 rounded-md text-xl font-bold">+</button>
                </div>

                <div className="text-right min-w-[80px]">
                  <p className="font-black text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item._id)} className="text-xs text-red-400 hover:text-red-600 font-bold uppercase tracking-tighter">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Actions */}
        <div className="p-6 bg-slate-900 text-white rounded-t-[32px]">
          <div className="space-y-2 mb-6 opacity-80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between text-3xl font-black mb-8">
            <span>TOTAL</span>
            <span className="text-orange-500">₹{total.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold transition-all uppercase tracking-widest text-sm">
              Bill Only
            </button>
            <button 
              onClick={placeOrder}
              disabled={cart.length === 0}
              className={`py-4 rounded-2xl font-black transition-all uppercase tracking-widest text-sm ${
                cart.length === 0 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-900/20 active:scale-95'
              }`}
            >
              Place Order
            </button>
          </div>
          <button 
            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all uppercase tracking-widest text-xs"
          >
            Mark as Paid & Close
          </button>
        </div>
      </div>

      {/* Hidden Receipt */}
      <div style={{ display: 'none' }}>
        <Receipt order={lastOrder} />
      </div>
    </div>
  );
};

export default CashierDashboard;
