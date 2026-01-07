import { createPortal } from 'react-dom';
import './AccountMenu.css';
import { useNavigate } from 'react-router-dom';

function AccountMenu({ isOpen, closeMenu, user }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        closeMenu();
        navigate('/login');
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return createPortal(
    <div onClick={closeMenu} className="account-menu-overlay">
      <div onClick={(e) => e.stopPropagation()} className="account-menu-content">
            <p>Welcome, {user.username}!</p>
            <button onClick={() => { navigate('/settings'); closeMenu()}}>Settings</button>
            <button className="account-menu-logout" onClick={handleLogout}>
              Logout
            </button>
      </div>
    </div>,
    document.body
  );
}

export default AccountMenu;
