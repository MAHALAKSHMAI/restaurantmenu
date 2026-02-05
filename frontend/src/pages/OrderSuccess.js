import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <button 
          onClick={() => navigate('/cashier')}
          className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-inter">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
          ✓
        </div>
        
        <h1 className="text-3xl font-black text-slate-800 mb-2">Order Placed!</h1>
        <p className="text-slate-500 font-medium mb-8">Order #{order.orderNumber} has been sent to the kitchen.</p>
        
        <div className="bg-slate-50 rounded-3xl p-6 mb-8 text-left">
          <div className="flex justify-between mb-4 border-b border-slate-200 pb-4">
            <span className="font-bold text-slate-400 text-sm uppercase">Details</span>
            <span className="font-black text-slate-800">Table {order.tableNumber || 'Takeaway'}</span>
          </div>
          
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="font-bold text-slate-600">{item.menuItem?.name || 'Item'} x {item.quantity}</span>
                <span className="font-black text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-6 pt-4 border-t-2 border-dashed border-slate-200">
            <span className="font-black text-slate-800 text-xl">Total Paid</span>
            <span className="font-black text-orange-500 text-xl">₹{order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/cashier')}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
          >
            New Order
          </button>
          <button 
            onClick={() => window.print()}
            className="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
