import React, { useEffect, useState } from 'react';
import { getToken } from '../../App';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ReportsPage() {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setError('');
    try {
      const res = await fetch('/api/sales', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to fetch sales');
      const data = await res.json();
      setSales(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Group sales by month
  const salesByMonth = {};
  sales.forEach(sale => {
    if (!sale.date) return;
    const d = new Date(sale.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    salesByMonth[key] = (salesByMonth[key] || 0) + (sale.total || 0);
  });
  const months = Object.keys(salesByMonth).sort();
  const totals = months.map(m => salesByMonth[m]);

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Sales per Month',
        data: totals,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { title: { display: true, text: 'Total Sales' }, beginAtZero: true },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: 900 }}>
      <h2>Sales Reports</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Bar data={data} options={options} />
    </div>
  );
}

export default ReportsPage;
