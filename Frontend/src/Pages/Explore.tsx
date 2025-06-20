import React, { useEffect, useState } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  name: string;
  mobile: string;
}

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customer, setCustomer] = useState<Customer>({ name: '', mobile: '' });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash');
  const [Cat, setCat] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1.0/categories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        setCat(data);
      } catch (error) {
        console.error('Error:', error);
        alert(`Error submitting category: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    fetchData();
  }, []);

  const [itemType, setItemType] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1.0/items${itemType? "/" + itemType : ""}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        let data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        alert(`Error submitting category: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setLoading(false);
      }
    };
    fetchData();
  }, [itemType]);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (!customer.name || !customer.mobile) {
      alert('Please enter customer details');
      return;
    }

    const orderData = {
      customerName: customer.name,
      phoneNumber: customer.mobile,
      cartItems: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subTotal: subtotal,
      tax: tax,
      grandTotal: total,
      paymentMethod: paymentMethod.toUpperCase()
    };

    try {
      const response = await fetch('http://localhost:8080/api/v1.0/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert('Order placed successfully!');
      console.log('Order response:', data);
      
      setCart([]);
      setCustomer({ name: '', mobile: '' });
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Error placing order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addToCart = (item: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.itemId);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.itemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, {
          id: item.itemId,
          name: item.name,
          price: item.price,
          quantity: 1
        }];
      }
    });
  };

  const increaseQuantity = (itemId: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (itemId: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
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
          <p style={{ color: '#6b7280', fontSize: '18px' }}>Loading items...</p>
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
      <div style={{ 
        maxWidth: '1600px', 
        margin: '0 auto',
        display: 'flex',
        gap: '24px'
      }}>
        {/* Left Panel - Items */}
        <div style={{ 
          flex: '1',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          overflow: 'hidden'
        }}>
          {/* Search Bar */}
          <div style={{ 
            position: 'relative',
            marginBottom: '24px'
          }}>
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
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '48px',
                paddingRight: '16px',
                paddingTop: '12px',
                paddingBottom: '12px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Categories */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div
              onClick={() => setItemType("")}
              style={{
                backgroundColor: '#f9fafb',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f46e5'
              }}>
                <ShoppingCart size={20} />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 4px 0',
                  color: '#1f2937'
                }}>
                  All Categories
                </h3>
                <p style={{ 
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  {Cat.length} categories
                </p>
              </div>
            </div>

            {Cat.map((cat: any) => (
              <div
                key={cat.categoryId}
                onClick={() => setItemType(cat.categoryId)}
                style={{
                  backgroundColor: '#f9fafb',
                  padding: '16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={cat.imgUrl} 
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 4px 0',
                    color: '#1f2937'
                  }}>
                    {cat.name}
                  </h3>
                  <p style={{ 
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '140px'
                  }}>
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Items Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {items.map((item: any) => (
              <div
                key={item.itemId}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  height: '160px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img
                    src={item.imgUrl || "https://via.placeholder.com/300"}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                    color: '#1f2937'
                  }}>
                    {item.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '0 0 12px 0',
                    minHeight: '40px'
                  }}>
                    {item.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#10b981'
                    }}>
                      ₹{item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e: any) => {
                        e.target.style.backgroundColor = '#2563eb';
                      }}
                      onMouseLeave={(e: any) => {
                        e.target.style.backgroundColor = '#3b82f6';
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div style={{ 
          width: '400px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          position: 'sticky',
          top: '24px',
          height: 'fit-content'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '24px'
          }}>
            Order Summary
          </h2>

          {/* Customer Details */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Customer Details
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Customer Name
              </label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                placeholder="Enter customer name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Mobile Number
              </label>
              <input
                type="tel"
                value={customer.mobile}
                onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
                placeholder="Enter mobile number"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Cart Items */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Cart Items ({cart.length})
            </h3>
            {cart.length === 0 ? (
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                Your cart is empty
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxHeight: '300px',
                overflowY: 'auto',
                paddingRight: '8px'
              }}>
                {cart.map(item => (
                  <div key={item.id} style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontWeight: '500',
                        color: '#1f2937'
                      }}>
                        {item.name}
                      </span>
                      <span style={{
                        fontWeight: '600',
                        color: '#10b981'
                      }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#6b7280'
                          }}
                        >
                          -
                        </button>
                        <span style={{
                          minWidth: '20px',
                          textAlign: 'center',
                          fontWeight: '500'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#6b7280'
                          }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Order Summary
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: '#6b7280' }}>Subtotal:</span>
                <span style={{ fontWeight: '500' }}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: '#6b7280' }}>Tax (18%):</span>
                <span style={{ fontWeight: '500' }}>₹{tax.toFixed(2)}</span>
              </div>
              <div style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: '8px',
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: '600',
                fontSize: '16px'
              }}>
                <span>Total:</span>
                <span style={{ color: '#10b981' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Payment Method
            </h3>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => setPaymentMethod('cash')}
                style={{
                  flex: '1',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `2px solid ${paymentMethod === 'cash' ? '#3b82f6' : '#e5e7eb'}`,
                  backgroundColor: paymentMethod === 'cash' ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: paymentMethod === 'cash' ? '#1e40af' : '#6b7280',
                  transition: 'all 0.3s ease'
                }}
              >
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod('upi')}
                style={{
                  flex: '1',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `2px solid ${paymentMethod === 'upi' ? '#3b82f6' : '#e5e7eb'}`,
                  backgroundColor: paymentMethod === 'upi' ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: paymentMethod === 'upi' ? '#1e40af' : '#6b7280',
                  transition: 'all 0.3s ease'
                }}
              >
                UPI
              </button>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={cart.length === 0}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '8px',
              background: cart.length === 0 ? '#e5e7eb' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: cart.length === 0 ? '#9ca3af' : 'white',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e: any) => {
              if (cart.length > 0) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e: any) => {
              if (cart.length > 0) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Explore;