import React from 'react';

interface OrderProps {
  created_at: string;
  destination: string;
  deliverRequest: string;
}

const Order: React.FC<OrderProps> = ({ created_at, destination, deliverRequest, children: orderItems }) => {
  return (
    <div className="m-2 p-2">
      <h2 className="mb-2 font-bold text-lg">{created_at}</h2>
      <div className="border-2 rounded-lg">{orderItems}</div>
    </div>
  );
};

export default Order;
