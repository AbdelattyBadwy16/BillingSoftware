import { Bell, Menu, Search, User, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("userRole")
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/login");
    setIsProfileOpen(false);
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-container">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}>
            <div className="logo-icon">📊</div>
            <h1 className="logo-text">AdminPanel</h1>
          </div>

          <div className="nav-links">
            <button
              onClick={() => handleNavigate("/")}
              className={`nav-button ${isActiveLink("/") ? "active" : ""}`}
            >
              DASHBOARD
            </button>
            <button
              onClick={() => handleNavigate("/Explore")}
              className={`nav-button ${isActiveLink("/Explore") ? "active" : ""}`}
            >
              EXPLORE
            </button>
            {
              role != "ROLE_USER" ? <>
                <button
                  onClick={() => handleNavigate("/ManageItem")}
                  className={`nav-button ${isActiveLink("/ManageItem") ? "active" : ""}`}
                >
                  MANAGE ITEMS
                </button>
                <button
                  onClick={() => handleNavigate("/ManageCategory")}
                  className={`nav-button ${isActiveLink("/ManageCategory") ? "active" : ""}`}
                >
                  MANAGE CATEGORIES
                </button>
                <button
                  onClick={() => handleNavigate("/UserManage")}
                  className={`nav-button ${isActiveLink("/UserManage") ? "active" : ""}`}
                >
                  MANAGE USERS
                </button> </> : ""
            }
            <button
              onClick={() => handleNavigate("/OrderHistory")}
              className={`nav-button ${isActiveLink("/OrderHistory") ? "active" : ""}`}
            >
              ORDER HISTORY
            </button>
          </div>

          <div className="nav-icons">
            <div className="profile-container">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="profile-button"
              >
                <User size={20} />
              </button>
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <p className="profile-name">John Doe</p>
                  <p className="profile-role">Administrator</p>
                  <button
                    onClick={handleLogout}
                    className="logout-button"
                  >
                    <LogOut size={16} className="logout-icon" />
                    Log Out
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="icon-button mobile-toggle">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <button
              onClick={() => handleNavigate("/")}
              className={`mobile-link ${isActiveLink("/") ? "active" : ""}`}
            >
              DASHBOARD
            </button>
            <button
              onClick={() => handleNavigate("/Explore")}
              className={`mobile-link ${isActiveLink("/Explore") ? "active" : ""}`}
            >
              EXPLORE
            </button>
            <button
              onClick={() => handleNavigate("/ManageItem")}
              className={`mobile-link ${isActiveLink("/ManageItem") ? "active" : ""}`}
            >
              MANAGE ITEMS
            </button>
            <button
              onClick={() => handleNavigate("/ManageCategory")}
              className={`mobile-link ${isActiveLink("/ManageCategory") ? "active" : ""}`}
            >
              MANAGE CATEGORIES
            </button>
            <button
              onClick={() => handleNavigate("/UserManage")}
              className={`mobile-link ${isActiveLink("/UserManage") ? "active" : ""}`}
            >
              MANAGE USERS
            </button>
            <button
              onClick={() => handleNavigate("/OrderHistory")}
              className={`mobile-link ${isActiveLink("/OrderHistory") ? "active" : ""}`}
            >
              ORDER HISTORY
            </button>
            <button
              onClick={handleLogout}
              className="mobile-link logout-mobile"
            >
              LOG OUT
            </button>
          </div>
        )}
      </nav>
      <style>{`
      .profile-dropdown {
        position: absolute;
        right: 0;
        top: 100%;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 10px;
        min-width: 200px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        z-index: 100;
      }

      .profile-name {
        font-weight: bold;
        margin-bottom: 5px;
      }

      .profile-role {
        color: #666;
        font-size: 0.9em;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }

      .logout-button {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 5px;
        background: none;
        border: none;
        cursor: pointer;
        color: #333;
      }

      .logout-button:hover {
        color: #000;
      }

      .logout-mobile {
        color: #ff4444;
      }
      `}</style>
    </header>
  );
};