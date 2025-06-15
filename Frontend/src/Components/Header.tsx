import { Bell, Menu, Search, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // إغلاق القائمة المحمولة عند تغيير الصفحة
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // دالة للتحقق من الرابط النشط
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  // دالة التنقل مع إغلاق القائمة المحمولة
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-container">
          <div className="" style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"15px"}}>
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
            </button>
            <button 
              onClick={() => handleNavigate("/OrderHistory")} 
              className={`nav-button ${isActiveLink("/OrderHistory") ? "active" : ""}`}
            >
              ORDER HISTORY
            </button>
          </div>

          <div className="nav-icons">
            <div className="search-container">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="icon-button">
                <Search size={20} />
              </button>
              {isSearchOpen && (
                <div className="search-dropdown">
                  <input type="text" placeholder="Search..." className="search-input" autoFocus />
                </div>
              )}
            </div>

            <button className="icon-button">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="profile-container">
              <button className="profile-button">
                <User size={20} />
              </button>
              <div className="profile-dropdown">
                <p className="profile-name">John Doe</p>
                <p className="profile-role">Administrator</p>
              </div>
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
          </div>
        )}
      </nav>
    </header>
  );
};