import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalRevenue: 0, count: 0, todaySales: 0 });
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '', available: true, image: '' });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, menuRes] = await Promise.all([
        api.get('/orders/stats'),
        api.get('/menu')
      ]);
      setStats(statsRes.data);
      setMenuItems(menuRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem) {
        await api.put(`/menu/${editingItem._id}`, newItem);
        alert('Item updated successfully');
      } else {
        await api.post('/menu', newItem);
        alert('Item added successfully');
      }
      setNewItem({ name: '', price: '', category: '', available: true });
      setEditingItem(null);
      fetchData();
    } catch (error) {
      alert('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await api.delete(`/menu/${id}`);
      fetchData();
    }
  };

  const toggleAvailability = async (item) => {
    await api.put(`/menu/${item._id}`, { ...item, available: !item.available });
    fetchData();
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setNewItem({ name: item.name, price: item.price, category: item.category, available: item.available, image: item.image || '' });
    setActiveTab('menu-form');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-slate-900 min-h-screen p-6 text-white fixed">
          <h1 className="text-2xl font-black mb-10 tracking-tight">RESTO<span className="text-orange-500">ADMIN</span></h1>
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'menu', label: 'Menu Management', icon: '🍴' },
              { id: 'reports', label: 'Sales Reports', icon: '📈' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-10">
          {activeTab === 'overview' && (
            <div className="space-y-10">
              <header>
                <h2 className="text-3xl font-black text-slate-800">Business Overview</h2>
                <p className="text-slate-500">How your restaurant is performing today</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Today's Revenue</span>
                  <p className="text-4xl font-black text-slate-800 mt-2">₹{stats.totalRevenue?.toFixed(2) || '0.00'}</p>
                  <div className="mt-4 text-green-500 font-bold text-sm">↑ 12% from yesterday</div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total Orders</span>
                  <p className="text-4xl font-black text-slate-800 mt-2">{stats.count || 0}</p>
                  <div className="mt-4 text-slate-400 font-bold text-sm">Orders processed</div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Active Tables</span>
                  <p className="text-4xl font-black text-slate-800 mt-2">8</p>
                  <div className="mt-4 text-orange-500 font-bold text-sm">Currently occupied</div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'menu' || activeTab === 'menu-form') && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-800">Menu Management</h2>
                <button 
                  onClick={() => { setEditingItem(null); setNewItem({ name: '', price: '', category: '', available: true }); setActiveTab('menu-form'); }}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                  + Add New Item
                </button>
              </div>

              {activeTab === 'menu-form' ? (
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 max-w-2xl">
                  <h3 className="text-xl font-black mb-6">{editingItem ? 'Edit Menu Item' : 'Create New Menu Item'}</h3>
                  <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Item Name</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border bg-slate-50 focus:ring-2 focus:ring-orange-200 outline-none" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                        <select className="w-full px-4 py-3 rounded-xl border bg-slate-50 focus:ring-2 focus:ring-orange-200 outline-none" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} required>
                          <option value="">Select Category</option>
                          <option value="Starters">Starters</option>
                          <option value="Main Course">Main Course</option>
                          <option value="Desserts">Desserts</option>
                          <option value="Beverages">Beverages</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹)</label>
                        <input type="number" step="0.01" className="w-full px-4 py-3 rounded-xl border bg-slate-50 focus:ring-2 focus:ring-orange-200 outline-none" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border bg-slate-50 focus:ring-2 focus:ring-orange-200 outline-none" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} placeholder="https://unsplash.com/..." />
                      </div>
                    </div>
                    <div className="flex items-center pb-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-orange-500" checked={newItem.available} onChange={e => setNewItem({...newItem, available: e.target.checked})} />
                        <span className="font-bold text-slate-700">Available in Menu</span>
                      </label>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="submit" disabled={loading} className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-black hover:bg-orange-600 transition-all">
                        {loading ? 'Saving...' : (editingItem ? 'Update Item' : 'Create Item')}
                      </button>
                      <button type="button" onClick={() => setActiveTab('menu')} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b">
                        <th className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest text-xs">Item</th>
                        <th className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest text-xs">Category</th>
                        <th className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest text-xs">Price</th>
                        <th className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest text-xs">Status</th>
                        <th className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest text-xs text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {menuItems.map(item => (
                        <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                              <span className="font-bold text-slate-800">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500">{item.category}</span>
                          </td>
                          <td className="px-8 py-5 font-black text-slate-800">₹{item.price.toFixed(2)}</td>
                          <td className="px-8 py-5">
                            <button onClick={() => toggleAvailability(item)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${item.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {item.available ? '● Available' : '○ Hidden'}
                            </button>
                          </td>
                          <td className="px-8 py-5 text-right space-x-4">
                            <button onClick={() => startEdit(item)} className="text-blue-500 font-bold hover:text-blue-700">Edit</button>
                            <button onClick={() => handleDelete(item._id)} className="text-red-500 font-bold hover:text-red-700">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-10">
              <header>
                <h2 className="text-3xl font-black text-slate-800">Sales Reports</h2>
                <p className="text-slate-500">Detailed breakdown of your restaurant revenue</p>
              </header>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-black">Monthly Performance</h3>
                   <div className="flex gap-2">
                     <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold">This Month</button>
                     <button className="px-4 py-2 text-sm font-bold text-slate-400">Last Month</button>
                   </div>
                </div>
                {/* Sales Chart Placeholder or Data Table */}
                <div className="space-y-4">
                  {[
                    { date: '2024-05-10', orders: 45, revenue: 1250.50 },
                    { date: '2024-05-09', orders: 38, revenue: 980.20 },
                    { date: '2024-05-08', orders: 52, revenue: 1540.00 },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-800">{new Date(row.date).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-400 font-bold">{row.orders} Orders</p>
                      </div>
                      <p className="text-xl font-black text-slate-800">₹{row.revenue.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
