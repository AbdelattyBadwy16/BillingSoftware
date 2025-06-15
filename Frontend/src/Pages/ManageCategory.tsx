import React, { useState, useEffect } from 'react';

// TypeScript interfaces
interface CategoryFormData {
  name: string;
  description: string;
  bgColor: string;
}

interface FileWithPreview extends File {
  preview?: string;
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [AllCategory, setAllCategory] = useState([]);
  useEffect(() => {
    const fetchData = async () => {


      try {


        const response = await fetch('http://localhost:8080/api/v1.0/categories', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        setAllCategory(data);
      } catch (error) {
        console.error('Error:', error);
        alert(`Error submitting category: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsSubmitting(false);
      }
    };
    fetchData();
    return () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

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

      // Revoke previous file URL if exists
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
      alert('Please enter a category name');
      return;
    }

    if (!file) {
      alert('Please select an image file');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category', JSON.stringify(formData));
      formDataToSend.append('file', file);


      const response = await fetch('http://localhost:8080/api/v1.0/categories', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      setSubmitSuccess(true);

      setFormData({
        name: '',
        description: '',
        bgColor: '#000000'
      });
      setFile(null);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error submitting category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search term:', searchTerm);
    // Add your search logic here
  };

  async function handelDelete(id:any){
    const response = await fetch(`http://localhost:8080/api/v1.0/categories/${id}`, {
        method: 'DELETE',
      });
      window.location.reload(); 

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  }
  return (
    <div style={styles.dashboard}>


      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.contentContainer}>
          {/* Form Section */}
          <div style={styles.formSection}>
            <div style={styles.formCard}>
              <div style={styles.formHeader}>
                <label htmlFor="file-upload" style={styles.uploadIcon}>
                  {file?.preview ? (
                    <img
                      src={file.preview}
                      alt="Preview"
                      style={styles.uploadPreview}
                    />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 16L12 8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  style={styles.fileInput}
                  accept="image/*"
                />
                {file && (
                  <div style={styles.fileInfo}>
                    <span style={styles.fileName}>{file.name}</span>
                    <button
                      onClick={() => setFile(null)}
                      style={styles.removeFileButton}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div style={styles.itemForm}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Category Name"
                    style={styles.formInput}
                    required
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

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Background color</label>
                  <div style={styles.colorPickerContainer}>
                    <input
                      type="text"
                      name="bgColor"
                      value={formData.bgColor}
                      onChange={handleInputChange}
                    />
                    <div
                      style={{
                        ...styles.colorPreview,
                        backgroundColor: formData.bgColor
                      }}
                    ></div>
                    <span style={styles.colorValue}>{formData.bgColor}</span>
                  </div>
                </div>

                <div style={styles.formActions}>
                  <button
                    onClick={handleSubmit}
                    style={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span style={styles.buttonLoader}></span>
                    ) : (
                      'Submit'
                    )}
                  </button>
                  {submitSuccess && (
                    <div style={styles.successMessage}>
                      Category submitted successfully!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div style={styles.searchSection}>
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <div style={styles.searchContainer}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by keyword"
                  style={styles.searchInput}
                />
                <button type="submit" style={styles.searchButton}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </form>

            <div style={styles.toggleContainer}>
              {AllCategory.map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    display: 'inline-block',
                    margin: '0 10px',
                    padding: '10px 15px',
                    borderRadius: '20px',
                    backgroundColor: item?.bgColor || '#f5f5f5',
                    color: getContrastColor(item?.bgColor || '#f5f5f5'),
                    whiteSpace: 'nowrap',
                    position: 'relative',
                  }}
                >
                  {item?.imgUrl && (
                    <img
                      src={item.imgUrl}
                      alt={item.name}
                      style={{
                        width: '20px',
                        height: '20px',
                        verticalAlign: 'middle',
                        marginRight: '8px'
                      }}
                    />
                  )}
                  <span>{item?.name}</span>

                  {/* زرار الحذف */}
                  <button
                    style={{
                      marginLeft: '10px',
                      background: 'transparent',
                      border: 'none',
                      color: getContrastColor(item?.bgColor || '#f5f5f5'),
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    onClick={()=>handelDelete(item?.categoryId)}
                    title="Delete"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>




          </div>
        </div>
      </div>
    </div>
  );
};

// Styles object
const styles: { [key: string]: React.CSSProperties } = {
  dashboard: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    lineHeight: '1.5',
  },

  navbar: {
    backgroundColor: '#2d2d2d',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    borderBottom: '1px solid #404040',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },

  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  logo: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoIcon: {
    width: '24px',
    height: '24px',
    background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
    borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },

  brandName: {
    fontWeight: '600',
    fontSize: '18px',
    color: '#ffffff',
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
    borderBottom: '2px solid #FFA726',
  },

  navProfile: {
    display: 'flex',
    alignItems: 'center',
  },

  profileAvatar: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #6B73FF, #9575CD)',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px',
  },

  mainContent: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#1a1a1a',
  },

  contentContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },

  formSection: {
    width: '100%',
  },

  formCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid #404040',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },

  formHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
    gap: '12px',
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
    overflow: 'hidden',
  },

  uploadPreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  fileInput: {
    display: 'none',
  },

  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#e0e0e0',
  },

  fileName: {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  removeFileButton: {
    background: 'transparent',
    border: 'none',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '0 4px',
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

  colorPickerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  colorPicker: {
    opacity: 0,
    position: 'absolute',
    width: '50px',
    height: '40px',
    cursor: 'pointer',
  },

  colorPreview: {
    width: '50px',
    height: '40px',
    borderRadius: '8px',
    border: '2px solid #555555',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',

  },

  colorValue: {
    fontSize: '14px',
    color: '#b0b0b0',
  },

  formActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1rem',
  },

  submitButton: {
    background: 'linear-gradient(135deg, #FFA726, #FF9800)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.875rem 2rem',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '120px',

  },

  buttonLoader: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTopColor: '#ffffff',
    animation: 'spin 1s ease-in-out infinite',
  },

  successMessage: {
    color: '#4CAF50',
    fontSize: '14px',
    fontWeight: '500',
  },

  searchSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
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
    flexDirection: 'column',
    gap: '0.5rem',
    backgroundColor: '#2d2d2d',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid #404040',
  },

  toggleLabelText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#ffffff',
  },

  toggleSwitch: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  toggleInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },

  toggleLabel: {
    position: 'relative',
    cursor: 'pointer',
    width: '60px',
    height: '34px',
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

  statsCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: '8px',
    padding: '1.5rem',
    border: '1px solid #404040',
  },

  statsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '1rem',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
  },

  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#FFA726',
  },

  statLabel: {
    fontSize: '12px',
    color: '#b0b0b0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

export default CategoryManagementDashboard;