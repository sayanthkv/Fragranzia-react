import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AdminService from '../../services/admin-api-services/AdminService';
import AdminNavbar from "../../Components/admin/AdminNavbar"; 

import {
  LuDollarSign,
  LuPackage,
  LuBoxes,
  LuUsers,
  LuActivity
} from 'react-icons/lu';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

import './AdminDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { getOrders, getProduct, fetchUserdetails, getCategory } = AdminService();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    aov: 0,
    totalProducts: 0,
    totalCustomers: 0
  });

  const [weeklyData, setWeeklyData] = useState({
    labels: [],
    values: []
  });

  const [categoryData, setCategoryData] = useState({
    labels: [],
    values: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [ordersRes, productsRes, usersRes] = await Promise.allSettled([
        getOrders(),
        getProduct(),
        fetchUserdetails(),
        getCategory()
      ]);

      const rawOrders = ordersRes.status === 'fulfilled' ? ordersRes.value : [];
      const orders = Array.isArray(rawOrders?.orders)
        ? rawOrders.orders
        : Array.isArray(rawOrders)
        ? rawOrders
        : [];

      const rawProducts = productsRes.status === 'fulfilled' ? productsRes.value : [];
      const products = Array.isArray(rawProducts?.products)
        ? rawProducts.products
        : Array.isArray(rawProducts)
        ? rawProducts
        : [];

      const rawUsers = usersRes.status === 'fulfilled' ? usersRes.value : [];
      const users = Array.isArray(rawUsers?.users)
        ? rawUsers.users
        : Array.isArray(rawUsers?.data)
        ? rawUsers.data
        : Array.isArray(rawUsers)
        ? rawUsers
        : [];

      const totalSales = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
      const totalOrdersCount = orders.length;
      const aov = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;
      const totalProductsCount = products.length;
      const totalCustomersCount = users.length;

      setStats({
        totalSales,
        totalOrders: totalOrdersCount,
        aov,
        totalProducts: totalProductsCount,
        totalCustomers: totalCustomersCount
      });

      const days = [];
      const orderCounts = {};

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        days.push(dateKey);
        orderCounts[dateKey] = 0;
      }

      orders.forEach((order) => {
        if (order.createdAt) {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          if (orderCounts[orderDate] !== undefined) {
            orderCounts[orderDate] += 1;
          }
        }
      });

      setWeeklyData({
        labels: days,
        values: days.map((day) => orderCounts[day])
      });

      const categoryCounts = {};
      products.forEach((prod) => {
        const catName = prod.category?.name || 'General';
        categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
      });

      const catLabels = Object.keys(categoryCounts);
      const catValues = Object.values(categoryCounts);

      setCategoryData({
        labels: catLabels.length > 0 ? catLabels : ['Home & Kitchen', 'Dress'],
        values: catValues.length > 0 ? catValues : [6, 4]
      });
    } catch (error) {
      console.error('Failed to load dashboard metrics:', error);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const lineChartData = {
    labels: weeklyData.labels.length > 0 ? weeklyData.labels : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Orders',
        data: weeklyData.values.length > 0 ? weeklyData.values : [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.08)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#4361ee',
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Orders: ${ctx.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: '#94a3b8' },
        grid: { color: '#f1f5f9' }
      },
      x: {
        ticks: { color: '#94a3b8', font: { size: 10 } },
        grid: { display: false }
      }
    }
  };

  const doughnutData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.values,
        backgroundColor: ['#2ec4b6', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          padding: 12,
          color: '#475569',
          font: { size: 11 }
        }
      }
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ top: 85, zIndex: 99999 }}
      />

      <div className="product-main-container">
        {/* Navigation Sidebar / Mobile Topbar */}
        <AdminNavbar />

        {/* Main Content Area */}
        <main className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h2 className="dashboard-title">Dashboard</h2>
              <span className="dashboard-date">{formattedDate}</span>
            </div>

            <div className="system-status-pill">
              <LuActivity className="status-pulse-icon" />
              <span>System Status: Online</span>
            </div>
          </div>

          {loading ? (
            <div className="d-flex flex-column justify-content-center align-items-center py-5 my-5 gap-3">
              <div
                className="spinner-border"
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  color: '#10b981',
                  borderWidth: '3px'
                }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
                Loading dashboard metrics...
              </span>
            </div>
          ) : (
            <>
              {/* Stat Cards Grid */}
              <div className="stat-cards-grid">
                <div className="stat-card">
                  <div className="stat-card-body">
                    <span className="stat-card-label">TOTAL SALES</span>
                    <h3 className="stat-card-value">
                      ₹{stats.totalSales.toLocaleString('en-IN')}
                    </h3>
                    <span className="stat-card-sub text-emerald">
                      ↗ Store Total
                    </span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-green">
                    <LuDollarSign />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-body">
                    <span className="stat-card-label">TOTAL ORDERS</span>
                    <h3 className="stat-card-value">{stats.totalOrders}</h3>
                    <span className="stat-card-sub text-blue">
                      ⏱ AOV: ₹{stats.aov.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-blue">
                    <LuPackage />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-body">
                    <span className="stat-card-label">PRODUCTS</span>
                    <h3 className="stat-card-value">{stats.totalProducts}</h3>
                    <span className="stat-card-sub text-purple">
                      ● Live in Catalog
                    </span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-purple">
                    <LuBoxes />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-body">
                    <span className="stat-card-label">CUSTOMERS</span>
                    <h3 className="stat-card-value">{stats.totalCustomers}</h3>
                    <span className="stat-card-sub text-amber">
                      👥 Registered Accounts
                    </span>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-amber">
                    <LuUsers />
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="dashboard-charts-grid">
                <div className="chart-card">
                  <div className="chart-card-header">
                    <h4>Weekly Orders Overview</h4>
                    <span className="chart-badge">Realtime</span>
                  </div>
                  <div className="chart-container-line">
                    <Line data={lineChartData} options={lineChartOptions} />
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-card-header">
                    <h4>Sales by Category</h4>
                  </div>
                  <div className="chart-container-donut">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;