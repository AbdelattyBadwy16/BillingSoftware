import React, { useEffect, useState } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import '../Styles/Explore.css';

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
        console.log(data)
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

      } catch (error) {
        console.error('Error:', error);
        alert(`Error submitting category: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    fetchData();
  }, [itemType]);

  const handleSearch = () => {
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    // Handle order placement logic here
    console.log('Placing order:', { customer, cart, paymentMethod, total });
    alert('Order placed successfully!');
  };

  return (
    <div className="explore-container" style={{ color: "white" }}>

      <div className="main-content">
        {/* Left Panel */}
        <div className="left-panel">
          {/* Categories Section */}
          <div className="categories-section" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
            padding: '1rem'
          }}>
            <div
              className="category-card"
                onClick={()=>setItemType("")}
              style={{
                background: '#2d2d2d',
                padding: '1.5rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="category-icon"><ShoppingCart size={24} /></div>
              <div className="category-info">
                <h3>All Categories</h3>
                <p>{Cat.length} Categories</p>
              </div>
            </div>

            {Cat.map((cat: any) => (
              <div
                key={cat.categoryId}
                className="category-card"
                style={{
                  background: '#2d2d2d',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={()=>setItemType(cat.categoryId)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div className="category-icon"><img src={`${cat.imgUrl}`} style={{ width: "50px", height: "100%" }} /></div>
                <div className="category-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                </div>
              </div>
            ))}
          </div>

          <hr></hr>
          <div
            style={{
              marginTop: '10px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
            }}
          >
            {items.map((item: any) => (
              <div
                style={{
                  background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
                  padding: '1rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  marginTop: "10px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(147, 51, 234, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                {/* Hover background effect */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none'
                  }}
                  className="hover-bg"
                />

                {/* Icon container */}
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(147, 51, 234, 0.2)',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <img
                    src={item?.imgUrl || "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=50&h=50&fit=crop&crop=center"}
                    alt={item?.name || "Category"}
                    style={{
                      width: '32px',
                      height: '32px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    margin: '0 0 4px 0'
                  }}>
                    {item?.name || "Category Name"}
                  </h3>
                  <p style={{
                    color: '#10b981',
                    fontWeight: '600',
                    fontSize: '16px',
                    margin: '0 0 4px 0'
                  }}>
                    {item?.price || "$00.00"}
                  </p>
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '14px',
                    margin: '0',
                    lineHeight: '1.4'
                  }}>
                    {item?.description || "Category description"}
                  </p>
                </div>

                <style >{`
        div:hover .hover-bg {
          opacity: 1 !important;
        }
      `}</style>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          {/* Customer Form */}
          <div className="customer-form">
            <div className="form-group">
              <label className="form-label">Customer name</label>
              <input
                type="text"
                className="form-input"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile number</label>
              <input
                type="tel"
                className="form-input"
                value={customer.mobile}
                onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
              />
            </div>
          </div>

          {/* Cart Section */}
          <div className="cart-section">
            <div className="cart-empty">
              Your cart is empty.
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-row">
              <span>Item:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (18%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-methods">
            <button
              className={`payment-button cash ${paymentMethod === 'cash' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              Cash
            </button>
            <button
              className={`payment-button upi ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              UPI
            </button>
          </div>

          {/* Place Order Button */}
          <button
            className="place-order-button"
            onClick={handlePlaceOrder}
            disabled={cart.length === 0}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Explore;