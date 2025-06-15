import { Clock, Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";


// Types
interface Order {
  id: string;
  customer: string;
  amount: number;
  payment: string;
  status: 'completed' | 'pending' | 'cancelled';
  time: string;
}

export const OrdersTable: React.FC = () => {
  const [orders] = useState<Order[]>([
    { id: '#12345', customer: 'Ahmed Mohamed', amount: 250.0, payment: 'Credit Card', status: 'completed', time: '2 hours ago' },
    { id: '#12346', customer: 'Sara Ali', amount: 180.5, payment: 'PayPal', status: 'pending', time: '4 hours ago' },
    { id: '#12347', customer: 'Mohamed Hassan', amount: 320.0, payment: 'Bank Transfer', status: 'cancelled', time: '6 hours ago' }
  ]);

  const getStatusClass = (status: string) => {
    return `status-label ${status}`;
  };

  return (
    <div className="orders-table">
      <div className="orders-header">
        <div className="orders-title">
          <div className="orders-icon"><Clock size={20} /></div>
          <h2>Recent Orders</h2>
        </div>
        <button className="view-all-btn">
          <Eye size={16} /> View All
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="no-orders">
                <div>
                  <div className="empty-icon"><ShoppingCart size={24} /></div>
                  <p>No recent orders</p>
                </div>
              </td>
            </tr>
          ) : (
            orders.map((order:any) => (
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>
                <td>{order.customer}</td>
                <td className="amount">₹{order.amount.toFixed(2)}</td>
                <td>{order.payment}</td>
                <td><span className={getStatusClass(order.status)}>{order.status}</span></td>
                <td>{order.time}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
