import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, CreditCard, Eye, Search, Filter, Download } from 'lucide-react';



const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
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
        console.log(data)
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString : any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount : any) => {
    return `$${amount.toFixed(2)}`;
  };

  const getPaymentMethodText = (method : any) => {
    return method === 'CASH' ? 'Cash' : 'Card';
  };

  const getPaymentMethodColor = (method : any) => {
    return method === 'CASH' 
      ? { backgroundColor: '#dcfce7', color: '#166534' }
      : { backgroundColor: '#dbeafe', color: '#1e40af' };
  };

  const filteredOrders = orders.filter((order:any) =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) 
  )

  const viewOrderDetails = (order : any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #3b82f6',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>Loading orders...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px',
          padding: '32px'
        }}>
        
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by name, order ID, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '48px',
                paddingRight: '16px',
                paddingTop: '16px',
                paddingBottom: '16px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '18px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white'
                }}>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Order ID</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Customer</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Phone</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Total Amount</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Payment Method</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Date</th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order : any, index) => (
                  <tr
                    key={order.orderId}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f9fafb' : 'white';
                    }}
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        color: '#3b82f6',
                        fontWeight: '600'
                      }}>
                        {order.orderId}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600'
                        }}>
                          {order.customerName.charAt(0)}
                        </div>
                        <span style={{
                          fontWeight: '500',
                          color: '#1f2937'
                        }}>
                          {order.customerName}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#6b7280'
                      }}>
                        <Phone size={16} />
                        <span style={{ fontFamily: 'monospace' }}>{order.phoneNumber}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#10b981'
                      }}>
                        {formatCurrency(order.grandTotal)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        ...getPaymentMethodColor(order.paymentMehthod)
                      }}>
                        {getPaymentMethodText(order.paymentMehthod)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#6b7280'
                      }}>
                        <Calendar size={16} />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <button
                        onClick={() => viewOrderDetails(order)}
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e : any) => {
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)';
                        }}
                        onMouseLeave={(e :any) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';
                        }}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ color: '#9ca3af', marginBottom: '16px' }}>
                <Search size={64} style={{ margin: '0 auto' }} />
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>No orders found</h3>
              <p style={{
                color: '#9ca3af',
                margin: 0
              }}>No orders match your search criteria</p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '672px',
              width: '100%',
              maxHeight: '100vh',
              overflowY: 'auto'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                padding: '24px',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    margin: 0
                  }}>Order Details</h2>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e : any) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e : any) => e.target.style.backgroundColor = 'transparent'}
                  >
                    ×
                  </button>
                </div>
                <p style={{
                  color: '#bfdbfe',
                  marginTop: '8px',
                  margin: '8px 0 0 0'
                }}>{selectedOrder.orderId}</p>
              </div>

              <div style={{ padding: '24px' }}>
                {/* Customer Info */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '16px',
                    margin: '0 0 16px 0'
                  }}>Customer Information</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <User style={{ color: '#3b82f6' }} size={20} />
                      <div>
                        <p style={{
                          fontSize: '14px',
                          color: '#9ca3af',
                          margin: '0 0 4px 0'
                        }}>Customer Name</p>
                        <p style={{
                          fontWeight: '500',
                          margin: 0
                        }}>{selectedOrder.customerName}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Phone style={{ color: '#3b82f6' }} size={20} />
                      <div>
                        <p style={{
                          fontSize: '14px',
                          color: '#9ca3af',
                          margin: '0 0 4px 0'
                        }}>Phone Number</p>
                        <p style={{
                          fontWeight: '500',
                          fontFamily: 'monospace',
                          margin: 0
                        }}>{selectedOrder.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '16px',
                    margin: '0 0 16px 0'
                  }}>Order Items</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedOrder.cartItems.map((item : any) => (
                      <div key={item.itemId} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#f9fafb',
                        padding: '16px',
                        borderRadius: '8px'
                      }}>
                        <div>
                          <p style={{
                            fontWeight: '500',
                            color: '#1f2937',
                            margin: '0 0 4px 0'
                          }}>{item.name}</p>
                          <p style={{
                            fontSize: '14px',
                            color: '#9ca3af',
                            margin: 0
                          }}>Quantity: {item.quantity}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{
                            fontWeight: '600',
                            color: '#3b82f6',
                            margin: '0 0 4px 0'
                          }}>{formatCurrency(item.price * item.quantity)}</p>
                          <p style={{
                            fontSize: '14px',
                            color: '#9ca3af',
                            margin: 0
                          }}>{formatCurrency(item.price)} × {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div style={{
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                  padding: '24px',
                  borderRadius: '12px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '16px',
                    margin: '0 0 16px 0'
                  }}>Order Summary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Subtotal:</span>
                      <span style={{ fontWeight: '500' }}>{formatCurrency(selectedOrder.subTotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Tax:</span>
                      <span style={{ fontWeight: '500' }}>{formatCurrency(selectedOrder.tax)}</span>
                    </div>
                    <div style={{
                      borderTop: '1px solid #e5e7eb',
                      paddingTop: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        <span>Grand Total:</span>
                        <span style={{ color: '#10b981' }}>{formatCurrency(selectedOrder.grandTotal)}</span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px'
                    }}>
                      <span style={{ color: '#6b7280' }}>Payment Method:</span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        ...getPaymentMethodColor(selectedOrder.paymentMehthod)
                      }}>
                        {getPaymentMethodText(selectedOrder.paymentMehthod)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;