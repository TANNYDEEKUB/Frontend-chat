import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar_styles.css'

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');  // นำผู้ใช้ไปยังหน้าแรกหลังจากออกจากระบบ
  };

  return (
    <div className="w-full bg-[#FFFAF0] text-jet fixed top-0 z-10 py-4">
      <div className="text-center">
        <h1 className="text-3xl">CHATBOT</h1>
      </div>
      <div id="help-menu" className="fixed top-2 right-0 z-20 flex">
        
        {isAuthenticated ? (
          <>
            <Link className="p-4 mx-2 hover:opacity-80 hover:bg-overlay hover:text-whitesmoke" to="/account">
              บัญชี
            </Link>
            <button 
              onClick={handleLogout} 
              className="p-4 mx-2 hover:opacity-80 hover:bg-overlay hover:text-whitesmoke"
            >
              ออกจากระบบ
            </button>
          </>
        ) : (
          <>
            <Link className="p-4 mx-2 hover:opacity-80 hover:bg-overlay hover:text-whitesmoke" to="/login">
              เข้าสู่ระบบ
            </Link>
            <Link className="p-4 mx-2 hover:opacity-80 hover:bg-overlay hover:text-whitesmoke" to="/register">
              สมัคร Account
            </Link>
          </>
        )}
      </div>
      <div id="nav-menu" className="w-[70%] mx-auto mt-4 pt-4 flex flex-row justify-evenly">
        <Link className="nav-link" to="/">
          
    
        </Link>
        
      </div>
    </div>
  );
};
