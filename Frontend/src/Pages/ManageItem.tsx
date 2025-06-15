import React, { useState } from 'react';

// TypeScript interfaces
interface ItemFormData {
  name: string;
  category: string;
  price: string;
  description: string;
}

const ItemManagementDashboard: React.FC = () => {
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    category: '',
    price: '₹200.00',
    description: ''
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isToggleOn, setIsToggleOn] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter an item name');
      return;
    }
    console.log('Form Data:', formData);
    alert('Item saved successfully!');
  };

  const handleSearch = () => {
    console.log('Search term:', searchTerm);
  };

  return (
    <div style={styles.dashboard}>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.contentContainer}>
          {/* Form Section */}
          <div style={styles.formSection}>
            <div style={styles.formCard}>
              <div style={styles.formHeader}>
                <div style={styles.uploadIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 16L12 8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div style={styles.itemForm}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Item Name"
                    style={styles.formInput}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={styles.formSelect}
                  >
                    <option value="">--SELECT CATEGORY--</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="home">Home & Garden</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Price</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    style={styles.formInput}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Write content here.."
                    rows={6}
                    style={styles.formTextarea}
                  />
                </div>

                <button onClick={handleSave} style={styles.saveButton}>
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div style={styles.searchSection}>
            <div style={styles.searchForm}>
              <div style={styles.searchContainer}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by keyword"
                  style={styles.searchInput}
                />
                <button onClick={handleSearch} style={styles.searchButton}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div style={styles.toggleContainer}>
              <div style={styles.toggleSwitch}>
                <input 
                  type="checkbox" 
                  checked={isToggleOn}
                  onChange={(e) => setIsToggleOn(e.target.checked)}
                  style={styles.toggleInput} 
                />
                <label style={{
                  ...styles.toggleLabel,
                  backgroundColor: isToggleOn ? '#4CAF50' : '#404040'
                }}>
                  <span style={{
                    ...styles.toggleSlider,
                    transform: isToggleOn ? 'translateX(26px)' : 'translateX(0)'
                  }}></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles object (this would normally be in a separate CSS file)
const styles: { [key: string]: React.CSSProperties } = {
  dashboard: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
  },
  
  navbar: {
    backgroundColor: '#2d2d2d',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
    borderBottom: '1px solid #404040',
  },
  
  navBrand: {
    display: 'flex',
    alignItems: 'center',
  },
  
  logo: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoIcon: {
    width: '24px',
    height: '24px',
    background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
    borderRadius: '4px',
    position: 'relative',
  },
  
  navLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  
  navLink: {
    textDecoration: 'none',
    color: '#b0b0b0',
    fontSize: '14px',
    fontWeight: '500',
    padding: '0.5rem 0',
    transition: 'color 0.3s ease',
  },
  
  activeLink: {
    color: '#FFA726',
    fontWeight: '600',
  },
  
  navProfile: {
    display: 'flex',
    alignItems: 'center',
  },
  
  profileAvatar: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #6B73FF, #9575CD)',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  
  mainContent: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#1a1a1a',
  },
  
  contentContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  
  formSection: {
    width: '100%',
    maxWidth: '600px',
  },
  
  formCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid #404040',
  },
  
  formHeader: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  
  uploadIcon: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  
  itemForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  
  formLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#ffffff',
  },
  
  formInput: {
    backgroundColor: '#404040',
    border: '1px solid #555555',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#ffffff',
    fontSize: '14px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
  },
  
  formSelect: {
    backgroundColor: '#404040',
    border: '1px solid #555555',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
  },
  
  formTextarea: {
    backgroundColor: '#404040',
    border: '1px solid #555555',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#ffffff',
    fontSize: '14px',
    resize: 'vertical',
    minHeight: '120px',
    outline: 'none',
  },
  
  saveButton: {
    background: 'linear-gradient(135deg, #FFA726, #FF9800)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.875rem 2rem',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem',
  },
  
  searchSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    alignItems: 'flex-end',
    minWidth: '300px',
  },
  
  searchForm: {
    width: '100%',
  },
  
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  
  searchInput: {
    backgroundColor: '#404040',
    border: '1px solid #555555',
    borderRadius: '8px',
    padding: '0.75rem 3rem 0.75rem 1rem',
    color: '#ffffff',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
  },
  
  searchButton: {
    position: 'absolute',
    right: '8px',
    background: 'linear-gradient(135deg, #FFA726, #FF9800)',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  
  toggleContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  
  toggleSwitch: {
    position: 'relative',
    display: 'inline-block',
    width: '60px',
    height: '34px',
  },
  
  toggleInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  
  toggleLabel: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '34px',
    transition: '0.4s',
  },
  
  toggleSlider: {
    position: 'absolute',
    height: '26px',
    width: '26px',
    left: '4px',
    bottom: '4px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: '0.4s',
  },
};

export default ItemManagementDashboard;