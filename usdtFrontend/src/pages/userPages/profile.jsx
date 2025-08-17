import React from "react";
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaWallet, FaArrowDown, FaArrowUp, FaPercent } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  // Dummy user data (replace with API later)
  const user = {
    name: "Manoj Inamanamelluri",
    email: "manoj@example.com",
    walletId: "0xA1B2C3D4E5F6",
    joinDate: "2025-06-01",
  };

  const walletSummary = {
    balance: 2543.67,
    totalDeposits: 5000,
    totalWithdrawals: 2456.33,
    totalProfit: 450.25,
  };

  const logout = async () => {
    localStorage.removeItem("user");
    navigate('/login')
  }

  return (
    <div className="profile-container">
      {/* User Info Card */}
      <div className="profile-card">
        <FaUserCircle className="profile-avatar" />
        <h2>{user.name}</h2>
        <p><FaEnvelope /> {user.email}</p>
        <p><FaWallet /> Wallet ID: {user.walletId}</p>
        <p><FaCalendarAlt /> Joined: {user.joinDate}</p>
      </div>

      {/* Wallet Summary */}
      <div className="summary-grid">
        <div className="summary-card">
          <h4>Wallet Balance</h4>
          <p className="balance">${walletSummary.balance.toFixed(2)} USDT</p>
        </div>
        <div className="summary-card">
          <h4>Total Deposits</h4>
          <p className="deposit"><FaArrowDown /> ${walletSummary.totalDeposits.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h4>Total Withdrawals</h4>
          <p className="withdraw"><FaArrowUp /> ${walletSummary.totalWithdrawals.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h4>Total Profit</h4>
          <p className="profit"><FaPercent /> ${walletSummary.totalProfit.toFixed(2)}</p>
        </div>
      </div>

      {/* Settings */}
      <div className="settings-card">
        <h3>Settings</h3>
        <button className="btn change-password">Change Password</button>
        <button className="btn logout" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
