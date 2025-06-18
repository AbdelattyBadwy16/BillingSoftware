import React, { useEffect, useState } from 'react';
import '../Styles/ManageUser.css';

interface User {
  id: string;
  name: string;
  email: string;
}

const UserManagement: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'Jhon Doe',
    email: 'yourname@example.com',
    password: '**************',
    role: "ROLE_USER"
  });
  const token = localStorage.getItem("authToken");

  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1.0/admin/users", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        setUsers(data);
      } catch (error: any) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1.0/admin/register", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });


      const data = await response.json();
      window.location.reload();
    } catch (error: any) {
      console.error("Registration error:", error.message);
      alert("Failed to register user: " + error.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1.0/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });

      window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="user-management">

      <div className="main-content">
        <div className="content-wrapper">
          <div style={{
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            margin: 'auto',
            color :"black"
          }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="name" style={{ marginBottom: '6px', fontWeight: '600' }}>Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="email" style={{ marginBottom: '6px', fontWeight: '600' }}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="password" style={{ marginBottom: '6px', fontWeight: '600' }}>Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                style={{
                  padding: '12px',
                  backgroundColor: '#222',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '15px'
                }}
              >
                Save
              </button>
            </form>
          </div>


          <div className="sidebar">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <div
                className="search-container"
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "20px",
                  padding: "4px 8px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  maxWidth: "300px",
                  width: "100%",
                }}
              >
                <input
                  type="text"
                  placeholder="Search by keyword"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    padding: "6px 8px",
                    flex: 1,
                    fontSize: "14px",
                  }}
                />
                <button
                  style={{
                    backgroundColor: "#4A90E2",
                    border: "none",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                >
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


            <div
              className="users-list"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                backgroundColor: "#fafafa",
              }}
            >
              {users.map((user: any) => (
                <div
                  key={user?.userId}
                  className="user-item"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div className="user-info">
                    <div
                      className="user-name"
                      style={{ fontWeight: "bold", fontSize: "15px", color: "#333" }}
                    >
                      {user?.name}
                    </div>
                    <div
                      className="user-email"
                      style={{ fontSize: "13px", color: "#777" }}
                    >
                      {user?.email}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user?.userId)}
                    className="delete-btn"
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#e74c3c",
                    }}
                    title="Delete User"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
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
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;