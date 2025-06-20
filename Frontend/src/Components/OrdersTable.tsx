import { Clock, Eye, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Types
interface Order {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  grandTotal: number;
  paymentMehthod: string;
  createdAt: string;
  cartItems: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  subTotal: number;
  tax: number;
}

export const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1.0/orders/latest', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        let data = await response.json();
        // Take only first 5-6 orders
        setOrders(data.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getPaymentMethodText = (method: string) => {
    return method === 'CASH' ? 'Cash' : 'Card';
  };

  const getStatusClass = (method: string) => {
    return method === 'CASH' ? 'status-label completed' : 'status-label pending';
  };

  const nav = useNavigate();

  if (loading) {
    return (
      <div className="orders-table">
        <div className="orders-header">
          <div className="orders-title">
            <div className="orders-icon"><Clock size={20} /></div>
            <h2>Recent Orders</h2>
          </div>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-table">
      <div className="orders-header">
        <div className="orders-title">
          <div className="orders-icon"><Clock size={20} /></div>
          <h2>Recent Orders</h2>
        </div>
        <button onClick={()=>nav("/OrderHistory")} className="view-all-btn">
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
            orders.map((order) => (
              <tr key={order.orderId}>
                <td className="order-id">{order.orderId}</td>
                <td>{order.customerName}</td>
                <td className="amount">{formatCurrency(order.grandTotal)}</td>
                <td>{getPaymentMethodText(order.paymentMehthod)}</td>
                <td>
                  <span className={getStatusClass(order.paymentMehthod)}>
                    {order.paymentMehthod === 'CASH' ? 'completed' : 'pending'}
                  </span>
                </td>
                <td>{formatDate(order.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <style >{`
        .orders-table {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .orders-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .orders-icon {
          background: #f0f7ff;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }
        
        .view-all-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .view-all-btn:hover {
          background: #f1f5f9;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th {
          text-align: left;
          padding: 12px 16px;
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
          border-bottom: 1px solid #f1f5f9;
        }
        
        td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }
        
        .order-id {
          font-family: monospace;
          color: #3b82f6;
          font-weight: 500;
        }
        
        .amount {
          font-weight: 600;
          color: #10b981;
        }
        
        .status-label {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .status-label.completed {
          background: #dcfce7;
          color: #166534;
        }
        
        .status-label.pending {
          background: #fef9c3;
          color: #854d0e;
        }
        
        .status-label.cancelled {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .no-orders {
          text-align: center;
          padding: 40px 0;
        }
        
        .no-orders div {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .empty-icon {
          color: #cbd5e1;
        }
        
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
          gap: 12px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};