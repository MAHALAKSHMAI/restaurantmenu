import React from 'react';

const Receipt = ({ order }) => {
  if (!order) return null;

  return (
    <div className="p-4 bg-white text-black font-mono w-64 border" id="printable-receipt">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">RESTAURANT POS</h2>
        <p className="text-sm">123 Street, City</p>
        <p className="text-sm">Tel: 555-0123</p>
      </div>
      <div className="border-b mb-2 pb-2">
        <p>Order: {order.orderNumber}</p>
        <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
        {order.tableNumber && <p>Table: {order.tableNumber}</p>}
      </div>
      <div className="mb-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span>{item.menuItem?.name} x {item.quantity}</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-2 font-bold flex justify-between">
        <span>TOTAL</span>
        <span>₹{order.totalAmount.toFixed(2)}</span>
      </div>
      <div className="text-center mt-4 text-xs">
        <p>Thank you for your visit!</p>
      </div>
    </div>
  );
};

export default Receipt;
