import React, { useEffect, useState } from 'react';

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
  const [categorys, setAllCategory] = useState([]);
  const [items, setItems] = useState<ItemFormData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
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

      } catch (error) {
        console.error('Error:', error);
        alert(`Error submitting category: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  const handleDelete = async (id : any) => {
    if(!id)return;
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

  return (
    <div style={{ height: '100vh', padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'flex', height: '70vh', gap: '3rem', justifyContent: 'center', alignItems: 'center' }}>
        {/* Form */}
        <div style={{ width: '45%', background: '#2d2d2d', padding: '2rem', borderRadius: '12px', overflowY: 'auto' }}>
          <h2>Add Item</h2>
          <input name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} style={inputStyle} />
          <select name="category" value={formData.category} onChange={handleInputChange} style={inputStyle}>
            <option value="">--SELECT CATEGORY--</option>
            {
              categorys.map((cat: any) => <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>)
            }
          </select>
          <input name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} style={inputStyle} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} style={{ ...inputStyle, height: '100px' }} />
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '1.25rem' }} />
          <button onClick={handleSave} style={buttonStyle}>Save</button>
        </div>

        {/* Item List */}
        <div style={{ width: '45%', background: '#2d2d2d', padding: '2rem', borderRadius: '12px', overflowY: 'auto', maxHeight: '70vh' }}>
          <h2>Items</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {items.map((item: any, index) => (
              <div key={index} style={{ background: '#3a3a3a', padding: '1rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={item.imgUrl} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.75rem' }} />
                <h4 style={{ color: '#FFA726', margin: '0.5rem 0' }}>{item.name}</h4>
                <p style={{ margin: '0.25rem 0', fontSize: '14px' }}>Price: {item.price}</p>
                <p style={{ margin: '0.25rem 0 0.75rem 0', fontSize: '13px', textAlign: 'center' }}>{item.description}</p>
                <button onClick={() => handleDelete(item.itemId)} style={{ ...buttonStyle, background: '#e53935', width: '100%', fontSize: '14px' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '0.75rem 1rem',
  marginBottom: '1.25rem',
  borderRadius: '8px',
  border: '1px solid #555',
  backgroundColor: '#404040',
  color: 'white',
  fontSize: '15px',
};

const buttonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #FFA726, #FF9800)',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '15px',
};

export default ItemManagementDashboard;