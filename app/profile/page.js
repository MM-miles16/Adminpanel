"use client";
import { useState, useEffect } from "react";
import { useRole } from "../../lib/RoleContext";

export default function Profile() {
  const { role } = useRole();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("admin_info");
      if (stored) {
        setUserInfo(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load user info:", e);
    }
  }, []);

  if (!userInfo) {
    return (
      <div className="profile-container">
        <h1 className="profile-title">Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  // Display user role label
  const getRoleLabel = () => {
    if (role === "admin") return "Administrator";
    if (role === "operator") return "Operations Team";
    if (role === "host") return "Host";
    return role || "User";
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>

      {/* TOP CARD */}
      <div className="profile-header-card">
        <div className="profile-user">
          <div className="profile-avatar">
            <img 
              src="/user.jpg" 
              alt="user" 
              onError={(e) => {
                e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
              }}
            />
          </div>

          <div className="profile-info">
            <h2>{userInfo.name || "Unknown User"}</h2>
            <p>{getRoleLabel()}</p>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="profile-grid">
        <div className="profile-box">
          <label>Full Name</label>
          <h3>{userInfo.name || "N/A"}</h3>
        </div>

        <div className="profile-box">
          <label>Phone Number</label>
          <h3>+{userInfo.phone || "N/A"}</h3>
        </div>

        <div className="profile-box">
          <label>User Role</label>
          <h3>{getRoleLabel()}</h3>
        </div>

        <div className="profile-box">
          <label>Account ID</label>
          <h3>#{userInfo.id || "N/A"}</h3>
        </div>

        <div className="profile-box">
          <label>Aadhar Number</label>
          <h3>4244-3455-8905</h3>
        </div>
      </div>
    </div>
  );
}
