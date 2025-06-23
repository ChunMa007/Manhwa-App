import { useState, useRef, useEffect } from "react";
import '../Css/DropDownProfile.css'
import { ACCESS_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
import useUserInfo from "../hooks/useUserInfo";

function DropDownProfile() {
  const [open, setOpen] = useState(false);
  const userInfo = useUserInfo()
  const dropdownRef = useRef();
  const navigate = useNavigate()

  function logout() {
    localStorage.clear()
    navigate('/login')
  }

  function settings() {
    navigate('/settings')
  }


  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button className="profile-button" onClick={() => setOpen(!open)}>
        {userInfo ? (
          <img
          src={userInfo.profile}
          className="button-image"
          />
        ) : (
          <p>loading...</p>
        )}
      </button>

      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={settings}>Settings</div>
          <div className="dropdown-item" onClick={logout}>Logout</div>
        </div>
      )}
    </div>
  );
}

export default DropDownProfile;
