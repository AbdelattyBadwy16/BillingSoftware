import React, { useState, useEffect } from 'react';

interface CategoryFormData {
  name: string;
  description: string;
  bgColor: string;
}

interface FileWithPreview extends File {
  preview?: string;
}

interface Category {
  categoryId: string;
  name: string;
  description: string;
  bgColor: string;
  imgUrl?: string;
}

function getContrastColor(bgColor: string) {
  if (!bgColor) return '#000';
  const r = parseInt(bgColor.substr(1, 2), 16);
  const g = parseInt(bgColor.substr(3, 2), 16);
  const b = parseInt(bgColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000' : '#fff';
}

const CategoryManagementDashboard: React.FC = () => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    bgColor: '#000000'
  });

  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        const data = await response.json();
        setCategories(data);
        setError('');
      } catch (error: any) {
        console.error('Error:', error);
        setError(`Error fetching categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchData();
    } else {
      setError("No authentication token found");
    }

    return () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }

      setFile(Object.assign(selectedFile, {
        preview: URL.createObjectURL(selectedFile)
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Please enter a category name');
      return;
    }

    if (!file) {
      setError('Please select an image file');
      return;
    }

    if (!token) {
      setError("No authentication token found");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category', JSON.stringify(formData));
      formDataToSend.append('file', file);

      const response = await fetch('http://localhost:8080/api/v1.0/admin/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      setSuccess('Category created successfully!');
      
      // Refresh the categories list
      const refreshResponse = await fetch('http://localhost:8080/api/v1.0/categories', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setCategories(data);
      }

      setFormData({
        name: '',
        description: '',
        bgColor: '#000000'
      });
      setFile(null);
    } catch (error: any) {
      console.error('Error:', error);
      setError(`Error submitting category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!token) {
      setError("No authentication token found");
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1.0/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccess('Category deleted successfully!');
      // Refresh the categories list
      const refreshResponse = await fetch('http://localhost:8080/api/v1.0/categories', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setCategories(data);
      }
    } catch (error: any) {
      console.error('Error deleting category:', error.message);
      setError("Failed to delete category: " + error.message);
    }
  };

  const filteredCategories = categories.filter((category: Category) => 
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Main Content */}
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {(error || success) && (
          <div style={{
            backgroundColor: error ? '#f8d7da' : '#d4edda',
            color: error ? '#721c24' : '#155724',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: `1px solid ${error ? '#f5c6cb' : '#c3e6cb'}`
          }}>
            {error || success}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '3rem',
          alignItems: 'flex-start'
        }}>
          {/* Form Section */}
          <div style={{
            flex: '1',
            maxWidth: '500px'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '2.5rem',
              borderRadius: '16px',
              border: '1px solid #e9ecef',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{
                color: '#212529',
                marginBottom: '2rem',
                fontSize: '24px',
                fontWeight: '700',
                textAlign: 'center'
              }}>
                Add New Category
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: '#495057',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    fontSize: '16px'
                  }}>
                    Category Image
                  </label>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <label htmlFor="file-upload" style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '8px',
                      border: '2px dashed #e9ecef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}>
                      {file?.preview ? (
                        <img
                          src={file.preview}
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '1rem',
                          textAlign: 'center'
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 16L12 8M12 8L9 11M12 8L15 11" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span style={{ fontSize: '14px', color: '#6c757d', marginTop: '8px' }}>
                            Upload Image
                          </span>
                        </div>
                      )}
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      accept="image/*"
                    />
                    {file && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          color: '#495057',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {file.name}
                        </span>
                        <button
                          onClick={() => setFile(null)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#495057',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    fontSize: '16px'
                  }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Category Name"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #e9ecef',
                      borderRadius: '10px',
                      color: '#212529',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    required
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#495057',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    fontSize: '16px'
                  }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Write description here..."
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #e9ecef',
                      borderRadius: '10px',
                      color: '#212529',
                      fontSize: '16px',
                      resize: 'vertical',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#007bff'}
                    onBlur={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#e9ecef'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#495057',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    fontSize: '16px'
                  }}>
                    Background Color
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <input
                      type="color"
                      name="bgColor"
                      value={formData.bgColor}
                      onChange={handleInputChange}
                      style={{
                        width: '50px',
                        height: '40px',
                        padding: 0,
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      name="bgColor"
                      value={formData.bgColor}
                      onChange={handleInputChange}
                      style={{
                        flex: 1,
                        padding: '16px 20px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #e9ecef',
                        borderRadius: '10px',
                        color: '#212529',
                        fontSize: '16px',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007bff'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: formData.bgColor,
                        border: '2px solid #e9ecef'
                      }}
                    ></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: loading ? '#6c757d' : '#007bff',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '18px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.3s ease',
                    marginTop: '1rem'
                  }}
                  onMouseOver={(e: any) => {
                    if (!loading) e.target.style.backgroundColor = '#0056b3';
                  }}
                  onMouseOut={(e: any) => {
                    if (!loading) e.target.style.backgroundColor = '#007bff';
                  }}
                >
                  {loading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </div>
          </div>

          {/* Categories List Section */}
          <div style={{
            flex: '1',
            maxWidth: '600px'
          }}>
            {/* Search Section */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid #e9ecef',
              marginBottom: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{
                color: '#212529',
                marginBottom: '1.5rem',
                fontSize: '20px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Search Categories
              </h3>
              
              <div style={{
                position: 'relative',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                <input
                  type="text"
                  placeholder="Search by name or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 50px 16px 20px',
                    backgroundColor: '#f8f9fa',
                    border: '2px solid #e9ecef',
                    borderRadius: '25px',
                    color: '#212529',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                />
                <button style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#007bff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ffffff'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Categories List */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e9ecef',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef'
              }}>
                <h3 style={{
                  color: '#212529',
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  Categories List ({filteredCategories.length})
                </h3>
              </div>

              <div style={{
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {loading ? (
                  <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: '#6c757d'
                  }}>
                    Loading categories...
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: '#6c757d'
                  }}>
                    No categories found matching your search
                  </div>
                ) : (
                  filteredCategories.map((category: Category, index: number) => (
                    <div
                      key={category.categoryId}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1.5rem 2rem',
                        borderBottom: index === filteredCategories.length - 1 ? 'none' : '1px solid #f1f3f4',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flex: 1
                      }}>
                        {category.imgUrl && (
                          <img
                            src={category.imgUrl}
                            alt={category.name}
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                          />
                        )}
                        <div>
                          <div style={{
                            color: '#212529',
                            fontWeight: '600',
                            fontSize: '18px',
                            marginBottom: '4px'
                          }}>
                            {category.name || 'Unknown Category'}
                          </div>
                          <div style={{
                            color: '#6c757d',
                            fontSize: '15px'
                          }}>
                            {category.description || 'No description provided'}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <div
                          style={{
                            padding: '8px 12px',
                            borderRadius: '20px',
                            backgroundColor: category.bgColor,
                            color: getContrastColor(category.bgColor),
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          {category.bgColor}
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(category.categoryId)}
                          style={{
                            backgroundColor: '#dc3545',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px',
                            color: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.3s ease',
                            minWidth: '40px',
                            minHeight: '40px'
                          }}
                          onMouseOver={(e: any) => e.target.style.backgroundColor = '#c82333'}
                          onMouseOut={(e: any) => e.target.style.backgroundColor = '#dc3545'}
                          title="Delete Category"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M3 6H5H21"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagementDashboard;