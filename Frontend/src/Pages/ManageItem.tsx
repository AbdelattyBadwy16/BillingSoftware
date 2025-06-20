import React, { useEffect, useState } from 'react';
import { Search, Trash2, PlusCircle } from 'lucide-react';

interface ItemFormData {
  name: string;
  category: string;
  price: string;
  description: string;
  imageFile?: File;
}

const ItemManagementDashboard: React.FC = () => {
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    category: '',
    price: '₹200.00',
    description: '',
  });
  const [categories, setAllCategory] = useState([]);
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
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

        let data = await response.json();
        setAllCategory(data);
      } catch (error) {
        console.error('Error:', error);
        alert(`Error submitting category: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1.0/items', {
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
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        imageFile: e.target.files![0],
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Please enter an item name');
      return;
    }

    const formDataToSend = new FormData();

    const itemRequest = {
      name: formData.name,
      categoryId: formData.category,
      price: formData.price.replace(/[^\d.]/g, ''),
      description: formData.description,
    };

    formDataToSend.append('item', JSON.stringify(itemRequest));
    if (formData.imageFile) {
      formDataToSend.append('file', formData.imageFile);
    }

    try {
      const response = await fetch('http://localhost:8080/api/v1.0/admin/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      window.location.reload();

    } catch (error) {
      console.error(error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: any) => {
    if(!id) return;
    try {
      const response = await fetch(`http://localhost:8080/api/v1.0/admin/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(`Error deleting item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px',
          padding: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            Item Management Dashboard
          </h1>
          
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
              placeholder="Search by item name or description..."
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

        {/* Main Content */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start'
        }}>
          {/* Add Item Form */}
          <div style={{
            flex: '0 0 400px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            position: 'sticky',
            top: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <PlusCircle size={20} />
              Add New Item
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Item Name
              </label>
              <input
                name="name"
                placeholder="e.g. Margherita Pizza"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
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
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white'
                }}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat: any) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Price
              </label>
              <input
                name="price"
                placeholder="e.g. ₹200.00"
                value={formData.price}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
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
                Description
              </label>
              <textarea
                name="description"
                placeholder="Item description..."
                value={formData.description}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Item Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  fontSize: '16px'
                }}
              />
            </div>

            <button
              onClick={handleSave}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e: any) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e: any) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              Save Item
            </button>
          </div>

          {/* Items List */}
          <div style={{
            flex: '1',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                Menu Items ({filteredItems.length})
              </h2>
            </div>

            {filteredItems.length === 0 ? (
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
                }}>No items found</h3>
                <p style={{
                  color: '#9ca3af',
                  margin: 0
                }}>No items match your search criteria</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {filteredItems.map((item) => (
                  <div key={item.itemId} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}>
                    <div style={{
                      height: '180px',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={item.imgUrl}
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
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: 0
                        }}>
                          {item.name}
                        </h3>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#10b981'
                        }}>
                          {item.price}
                        </span>
                      </div>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        marginBottom: '16px',
                        minHeight: '40px'
                      }}>
                        {item.description}
                      </p>
                      <button
                        onClick={() => handleDelete(item.itemId)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e: any) => {
                          e.target.style.backgroundColor = '#fecaca';
                        }}
                        onMouseLeave={(e: any) => {
                          e.target.style.backgroundColor = '#fee2e2';
                        }}
                      >
                        <Trash2 size={16} />
                        Delete Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemManagementDashboard;