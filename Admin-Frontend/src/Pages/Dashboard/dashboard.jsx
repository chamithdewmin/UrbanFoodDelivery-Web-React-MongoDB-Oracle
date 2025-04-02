import React, { useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./dashboard.css";
import { AdminContext } from "../../context/AdminContext";

const Dashboard = () => {
  const { token } = useContext(AdminContext);
  const dailyData = [
    { date: "2023-09-01", amount: 2450 },
    { date: "2023-09-02", amount: 3120 },
    { date: "2023-09-03", amount: 2780 },
    { date: "2023-09-04", amount: 2890 },
    { date: "2023-09-05", amount: 3310 },
    { date: "2023-09-06", amount: 2950 },
    { date: "2023-09-07", amount: 3080 },
  ];

  const incomeData = [
    { id: 1, date: "2023-09-01", source: "Product Sales", amount: 2450 },
    { id: 2, date: "2023-09-02", source: "Services", amount: 3120 },
    { id: 3, date: "2023-09-03", source: "Subscriptions", amount: 2780 },
    { id: 4, date: "2023-09-04", source: "Product Sales", amount: 2890 },
    { id: 5, date: "2023-09-05", source: "Consulting", amount: 3310 },
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Income Report", 20, 20);
    doc.autoTable({
      startY: 30,
      head: [["Date", "Source", "Amount"]],
      body: incomeData.map((item) => [
        item.date,
        item.source,
        `$${item.amount.toLocaleString()}`,
      ]),
    });
    doc.save("income-report.pdf");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Income Dashboard</h1>
        <button onClick={downloadPDF} className="download-button">
          Download Report
        </button>
      </header>

      <div className="stats-container">
        <div className="chart-card">
          <h2>Daily Income Overview</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#4CAF50"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-income">
          <h2>Recent Transactions</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {incomeData.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{item.source}</td>
                    <td>${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
