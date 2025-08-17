import React from "react";
import { FaArrowDown, FaArrowUp, FaPercent } from "react-icons/fa";
import { MdCheckCircle, MdPending } from "react-icons/md";
import { SiTether } from "react-icons/si";

const Transactions = () => {
  const transactions = [
    {
      id: 1,
      date: "2025-08-10",
      type: "Add Funds",
      asset: "USDT",
      amount: "500",
      status: "Completed",
    },
    {
      id: 2,
      date: "2025-08-11",
      type: "Daily Interest",
      asset: "USDT",
      amount: "1.25", // 0.25% of balance
      status: "Completed",
    },
    {
      id: 3,
      date: "2025-08-13",
      type: "Withdraw",
      asset: "USDT",
      amount: "200",
      status: "Pending",
    },
  ];

  // Transaction type icons
  const renderTypeIcon = (type) => {
    switch (type) {
      case "Add Funds":
        return <FaArrowDown className="icon add" />;
      case "Withdraw":
        return <FaArrowUp className="icon withdraw" />;
      case "Daily Interest":
        return <FaPercent className="icon interest" />;
      default:
        return null;
    }
  };

  // Only USDT
  const renderAssetIcon = () => <SiTether className="icon usdt" />;

  // Status icons
  const renderStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <MdCheckCircle className="icon status completed" />;
      case "Pending":
        return <MdPending className="icon status pending" />;
      default:
        return null;
    }
  };

  return (
    <div className="transactions-container">
      <h2 className="transactions-title">Transactions</h2>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Asset</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>
                {renderTypeIcon(tx.type)}{" "}
                <span className="label">{tx.type}</span>
              </td>
              <td>
                {renderAssetIcon()} <span className="label">{tx.asset}</span>
              </td>
              <td>{tx.amount}</td>
              <td>
                {renderStatusIcon(tx.status)}{" "}
                <span className={`label status-text ${tx.status.toLowerCase()}`}>
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
