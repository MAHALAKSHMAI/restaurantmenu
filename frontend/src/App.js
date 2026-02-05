import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import CashierDashboard from './pages/CashierDashboard';
import KitchenDashboard from './pages/KitchenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OrderSuccess from './pages/OrderSuccess';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cashier" element={
            <ProtectedRoute allowedRoles={['cashier', 'admin']}>
              <CashierDashboard />
            </ProtectedRoute>
          } />
          <Route path="/kitchen" element={
            <ProtectedRoute allowedRoles={['kitchen', 'admin']}>
              <KitchenDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/order-success" element={
            <ProtectedRoute allowedRoles={['cashier', 'admin']}>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
