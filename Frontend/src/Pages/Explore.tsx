import React, { useState } from 'react';
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

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
    <div className="explore-container" style={{color:"white"}}>
      
      <div className="main-content">
        {/* Left Panel */}
        <div className="left-panel">
          {/* Categories Section */}
          <div className="categories-section">
            <div className="category-card">
              <div className="category-icon">
                <ShoppingCart size={24} />
              </div>
              <div className="category-info">
                <h3>All Items</h3>
                <p>0 Items</p>
              </div>
            </div>
          </div>
          <div className="" style={{marginBottom:"20px"}}>
            <div className="search-form">
              <input
                type="text"
                className="search-input"
                placeholder="Search Items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-button" onClick={handleSearch}>
                <Search size={20} />
              </button>
            </div>
          </div>
        <hr></hr>
          {/* Search Section */}
          
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
                onChange={(e) => setCustomer({...customer, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile number</label>
              <input
                type="tel"
                className="form-input"
                value={customer.mobile}
                onChange={(e) => setCustomer({...customer, mobile: e.target.value})}
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