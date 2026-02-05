import React, { useState, useEffect } from 'react';
import api from '../services/api';
import socketIOClient from 'socket.io-client';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.filter(o => ['pending', 'preparing'].includes(o.status)));
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrders();

    const socket = socketIOClient('http://localhost:5000');
    socket.on('newOrder', (order) => {
      setOrders(prev => [...prev, order]);
    });
    socket.on('orderUpdated', (updatedOrder) => {
      setOrders(prev => 
        prev.map(o => o._id === updatedOrder._id ? updatedOrder : o)
            .filter(o => ['pending', 'preparing'].includes(o.status))
      );
    });

    return () => socket.disconnect();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">KITCHEN<span className="text-orange-500">LIVE</span></h1>
            <p className="text-slate-400 mt-1">Real-time incoming orders</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700">
              <span className="text-slate-400 text-sm block">Pending</span>
              <span className="text-white font-bold text-xl">{orders.filter(o => o.status === 'pending').length}</span>
            </div>
            <div className="bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700">
              <span className="text-slate-400 text-sm block">Preparing</span>
              <span className="text-white font-bold text-xl">{orders.filter(o => o.status === 'preparing').length}</span>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-700">
            <span className="text-5xl mb-4">🍳</span>
            <p className="text-slate-400 font-medium">No orders to prepare right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {orders.map(order => (
              <div 
                key={order._id} 
                className={`bg-white rounded-[2rem] shadow-2xl overflow-hidden border-t-[12px] ${
                  order.status === 'pending' ? 'border-orange-500' : 'border-blue-500'
                }`}
              >
                <div className="p-6 bg-slate-50 border-b flex justify-between items-start">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Order</span>
                    <h2 className="text-2xl font-black text-slate-800">#{order.orderNumber}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 block">Table</span>
                    <span className="text-xl font-bold text-orange-600">{order.tableNumber || 'Takeaway'}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4 text-slate-500 font-medium text-sm">
                    <span>🕒</span>
                    <span>Ordered at {formatTime(order.createdAt)}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                        <span className="font-bold text-slate-800">{item.menuItem?.name}</span>
                        <span className="bg-slate-900 text-white w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm">
                          {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-3">
                    {order.status === 'pending' ? (
                      <button 
                        onClick={() => updateStatus(order._id, 'preparing')} 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-orange-200"
                      >
                        START PREPARING
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateStatus(order._id, 'ready')} 
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-green-200"
                      >
                        MARK READY
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDashboard;
