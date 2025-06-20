import React, { useEffect, useState } from 'react';

interface User {
  userId: string;
  name: string;
  email: string;
}

const UserManagement: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'yourname@example.com',
    password: '**************',
    role: "ROLE_USER"
  });

  const [users, setUsers] = useState<User[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/v1.0/admin/users", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: User[] = await response.json();
        console.log(data);
        setUsers(data);
        setError('');
      } catch (error: any) {
        console.error("Error fetching users:", error.message);
        setError("Failed to fetch users: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      setError("No authentication token found");
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (): Promise<void> => {
    if (!token) {
      alert("No authentication token found");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1.0/admin/register", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User registered successfully:", data);
      
      // Refresh the users list
      window.location.reload();
    } catch (error: any) {
      console.error("Registration error:", error.message);
      alert("Failed to register user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    if (!token) {
      alert("No authentication token found");
      return;
    }

    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1.0/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("User deleted successfully");
      // Refresh the users list
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting user:', error.message);
      alert("Failed to delete user: " + error.message);
    }
  };

  const filteredUsers = users.filter((user: User) => 
    user.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Main Content */}
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #f5c6cb'
          }}>
            {error}
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
                Add New User
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
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
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
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
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
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
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
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSave}
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
                  onMouseOver={(e : any) => {
                    if (!loading) e.target.style.backgroundColor = '#0056b3';
                  }}
                  onMouseOut={(e : any) => {
                    if (!loading) e.target.style.backgroundColor = '#007bff';
                  }}
                >
                  {loading ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </div>
          </div>

          {/* Users List Section */}
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
                Search Users
              </h3>
              
              <div style={{
                position: 'relative',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
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

            {/* Users List */}
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
                  Users List ({filteredUsers.length})
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
                    Loading users...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: '#6c757d'
                  }}>
                    No users found matching your search
                  </div>
                ) : (
                  filteredUsers.map((user: User, index: number) => (
                    <div
                      key={user.userId}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1.5rem 2rem',
                        borderBottom: index === filteredUsers.length - 1 ? 'none' : '1px solid #f1f3f4',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{
                          color: '#212529',
                          fontWeight: '600',
                          fontSize: '18px',
                          marginBottom: '4px'
                        }}>
                          {user.name || 'Unknown User'}
                        </div>
                        <div style={{
                          color: '#6c757d',
                          fontSize: '15px'
                        }}>
                          {user.email || 'No email provided'}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteUser(user.userId)}
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
                        onMouseOver={(e :any) => e.target.style.backgroundColor = '#c82333'}
                        onMouseOut={(e : any) => e.target.style.backgroundColor = '#dc3545'}
                        title="Delete User"
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

export default UserManagement;