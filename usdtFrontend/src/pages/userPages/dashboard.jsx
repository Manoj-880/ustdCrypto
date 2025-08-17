import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaPercent } from "react-icons/fa";
import { SiTether } from "react-icons/si";
import { Modal } from "antd";
import PaymentQr from "./components/walletQr";
import { getUserTransactionsById } from "../../api_calls/transactions";
import { getuserDetailsById } from "../../api_calls/user";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // Dummy data (replace with API later)
  const dailyProfit = 6.36;

  useEffect(() => {
    fetchData();

    // const interval = setInterval(() => {
    //   fetchData(); // fetch again every 60s
    // }, 60 * 1000);

    // return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const fetchData = async () => {
  let localUser = JSON.parse(localStorage.getItem("user"));
  let userDetails = await getuserDetailsById(localUser._id);
  setUser(userDetails.data);
  let latestTransactions = []
  let allTransactions = await getUserTransactionsById(localUser._id);
  console.log(allTransactions);
  if (allTransactions.success && allTransactions.data.length > 5) {
    latestTransactions = allTransactions.data.slice(0, 5); // first 5
  }
  setTransactions(latestTransactions);
};

  // const recentTransactions = [
  //   { id: 1, type: "Add Funds", amount: 500, currency: "USDT", date: "2025-08-10" },
  //   { id: 2, type: "Daily Interest", amount: 6.36, currency: "USDT", date: "2025-08-15" },
  //   { id: 3, type: "Withdraw", amount: 200, currency: "USDT", date: "2025-08-13" },
  // ];

  // // Transaction type icons
  // const renderTypeIcon = (type) => {
  //   switch (type) {
  //     case "Add Funds":
  //       return <FaArrowDown className="icon add" />;
  //     case "Withdraw":
  //       return <FaArrowUp className="icon withdraw" />;
  //     case "Daily Interest":
  //       return <FaPercent className="icon interest" />;
  //     default:
  //       return null;
  //   }
  // };

  const renderAssetIcon = () => <SiTether className="icon usdt" />;

  return (
    <div className="dashboard-container">
      {/* Wallet Balance Card */}
      <div className="wallet-card">
        <h2>Wallet Balance</h2>
        <p className="balance">${user?.balance ?? 0} USDT</p>

        <div className="wallet-actions">
          {/* ✅ Open Modal on click */}
          <button className="btn add-funds" onClick={() => setIsModalOpen(true)}>
            Add Funds
          </button>
          <button className="btn withdraw-funds">Withdraw</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Daily Profit</h4>
          <p className="profit">+${dailyProfit.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h4>Total Profit</h4>
          <p className="profit">+${user?.profit ?? 0}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="transactions-card">
        <h3>Recent Transactions</h3>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{tx.transactionId}</td>
                  <td>{tx.quantity}</td>
                  <td>
                    {renderAssetIcon()} <span>USDT</span>
                  </td>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No recent transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Ant Design Modal with PaymentQR */}
      <Modal
        title="Transfer USDTs to the Wallet ID or scan the QR"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} // ✅ Hide default footer
        centered
      >
        {<PaymentQr />}
      </Modal>
    </div>
  );
};

export default Dashboard;
