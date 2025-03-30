import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import {TicketIcon, CurrencyDollarIcon, ShoppingBagIcon, ChartBarIcon } from '@heroicons/react/24/outline';

import api from '../api/axios';
import ServiceCenterDashboard from './ServiceCenterDashboard';
import SalesOutletDashboard from './SalesOutletDashboard';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('main'); // 'main', 'serviceCenter', or 'salesOutlet'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/dashboard');
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-600">
      <div>Error loading dashboard data: {error}</div>
    </div>;
  }

  if (view === 'serviceCenter') {
    return <ServiceCenterDashboard onBack={() => setView('main')} />;
  }

  if (view === 'salesOutlet') {
    return <SalesOutletDashboard onBack={() => setView('main')} />;
  }

  // Monthly Sales and Profits chart data
  const monthlyFinancialData = {
    labels: dashboardData.monthly_trends.map(item => item.month),
    datasets: [
      {
        label: 'Sales',
        data: dashboardData.monthly_trends.map(item => Number(item.sales)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      },
      {
        label: 'Service Revenue',
        data: dashboardData.monthly_trends.map(item => Number(item.service_revenue)),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  // Cost vs Profit breakdown
  const financialBreakdownData = {
    labels: ['Cost', 'Profit'],
    datasets: [{
      data: [
        Number(dashboardData.sales_metrics?.total_cost || dashboardData.total_cost || 0),
        Number(dashboardData.sales_metrics?.total_profit || dashboardData.total_profit || 0)
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',  // red for cost
        'rgba(75, 192, 192, 0.7)',   // teal for profit
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
      ],
      borderWidth: 1
    }]
  };

  // Ticket status data
  const ticketStatusData = {
    labels: ['Open', 'In Progress', 'Completed', 'Cancelled'],
    datasets: [{
      data: [
        dashboardData.ticket_status?.open || 0,
        dashboardData.ticket_status?.in_progress || 0,
        dashboardData.ticket_status?.completed || 0,
        dashboardData.ticket_status?.cancelled || 0
      ],
      backgroundColor: [
        'rgba(255, 159, 64, 0.7)',   // orange
        'rgba(54, 162, 235, 0.7)',    // blue
        'rgba(75, 192, 192, 0.7)',    // green
        'rgba(255, 99, 132, 0.7)',    // red
      ],
      borderColor: [
        'rgb(255, 159, 64)',
        'rgb(54, 162, 235)',
        'rgb(75, 192, 192)',
        'rgb(255, 99, 132)',
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-[#1D1D1F]">MyAppleCare Dashboard</h3>
        <div className="flex items-center space-x-2">
          <select 
            className="px-3 py-1 bg-white  border-gray-100 border rounded-md text-sm"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="main">Overview</option>
            <option value="serviceCenter">Service Center</option>
            <option value="salesOutlet">Sales Outlets</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Revenue" 
          value={`Rs. ${Number(dashboardData.total_sales).toLocaleString()}`} 
          icon={<CurrencyDollarIcon className="h-6 w-6 text-blue-600" />}
          subtext={`Rs. ${Number(dashboardData.total_sales_month).toLocaleString()} this month`}
        />
        <SummaryCard 
          title="Total Profit" 
          value={`Rs. ${Number(dashboardData.sales_metrics?.total_profit || dashboardData.total_profit || 0).toLocaleString()}`}
          icon={<ChartBarIcon className="h-6 w-6 text-green-600" />}
          subtext={`${(dashboardData.sales_metrics?.profit_margin || 0).toFixed(1)}% margin`}
        />
        <SummaryCard 
          title="Total Products" 
          value={dashboardData.total_products} 
          icon={<ShoppingBagIcon className="h-6 w-6 text-purple-600" />}
          subtext={`${dashboardData.total_units_sold} units sold`}
        />
        <SummaryCard 
          title="Total Invoices" 
          value={dashboardData.total_invoices} 
          icon={<TicketIcon className="h-6 w-6 text-amber-600" />}
          subtext={`${dashboardData.total_returns} returns`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales & Profit Chart */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg border-gray-100 border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Monthly Performance</h4>
          </div>
          <div className="h-72">
            <Bar
              data={monthlyFinancialData}
              options={{ 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { display: true, position: 'top' },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.parsed.y !== null) {
                          label += `Rs. ${context.parsed.y.toLocaleString()}`;
                        }
                        return label;
                      }
                    }
                  }
                },
                scales: { y: { beginAtZero: true } }
              }} 
            />
          </div>
        </div>

        {/* Financial Breakdown Pie Chart */}
        <div className="bg-white p-4 rounded-lg border-gray-100 border">
          <h4 className="font-medium text-gray-700 mb-4">Revenue Breakdown</h4>
          <div className="h-64 flex items-center justify-center">
            <Pie 
              data={financialBreakdownData}
              options={{ 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round(value / total * 100);
                        
                        return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sales Overview */}
        <div className="bg-white p-4 rounded-lg border-gray-100 border">
          <h4 className="font-medium text-gray-700 mb-4">Sales Overview</h4>
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500">Today</span>
              <p className="text-xl font-semibold mt-1">Rs. {Number(dashboardData.total_sales_today).toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500">Last 7 Days</span>
              <p className="text-xl font-semibold mt-1">Rs. {Number(dashboardData.total_sales_last_7_days).toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500">Last 30 Days</span>
              <p className="text-xl font-semibold mt-1">Rs. {Number(dashboardData.total_sales_last_30_days).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {/* Profit Overview */}
        <div className="bg-white p-4 rounded-lg border-gray-100 border">
          <h4 className="font-medium text-gray-700 mb-4">Profit Overview</h4>
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500">Total Cost</span>
              <p className="text-xl font-semibold mt-1">Rs. {Number(dashboardData.sales_metrics?.total_cost || dashboardData.total_cost || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500">Total Profit</span>
              <p className="text-xl font-semibold mt-1">Rs. {Number(dashboardData.sales_metrics?.total_profit || dashboardData.total_profit || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500">Profit Margin</span>
              <p className="text-xl font-semibold mt-1">{(dashboardData.sales_metrics?.profit_margin || 0).toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        {/* Service & Support */}
        <div className="bg-white p-4 rounded-lg border-gray-100 border">
          <h4 className="font-medium text-gray-700 mb-4">Service & Support</h4>
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500">Total Tickets</span>
              <p className="text-xl font-semibold mt-1">{dashboardData.total_tickets}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500">Service Revenue</span>
              <p className="text-xl font-semibold mt-1">Rs. {Number(dashboardData.service_metrics?.total_service_revenue || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500">Repair Revenue</span>
              <p className="text-xl font-semibold mt-1">Rs. {Number(dashboardData.service_metrics?.repair_revenue || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Business Overview */}
        <div className="bg-white p-4 rounded-lg border-gray-100 border">
          <h4 className="font-medium text-gray-700 mb-4">Business Overview</h4>
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500">Total Business Revenue</span>
              <p className="text-xl font-semibold mt-1">
                Rs. {Number(dashboardData.business_totals?.total_revenue || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500">Overall Profit Margin</span>
              <p className="text-xl font-semibold mt-1">
                {(dashboardData.business_totals?.profit_margin || 0).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Center */}
        <div className="bg-white p-4 rounded-lg border-gray-100 border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Service Center</h4>
            <button 
              onClick={() => setView('serviceCenter')}
              className="text-sm text-blue-600 hover:underline"
            >
              View Dashboard
            </button>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Tickets</p>
              <p className="text-lg font-semibold mt-1">{dashboardData.total_tickets}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-lg font-semibold mt-1">{dashboardData.ticket_status?.completed || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-lg font-semibold mt-1">Rs. {Number(dashboardData.service_metrics?.total_service_revenue || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {/* Sales Outlets */}
        <div className="bg-white p-4 rounded-lg border-gray-100 border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Sales Outlets</h4>
            <button 
              onClick={() => setView('salesOutlet')}
              className="text-sm text-blue-600 hover:underline"
            >
              View Dashboard
            </button>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Sales</p>
              <p className="text-lg font-semibold mt-1">Rs. {Number(dashboardData.total_sales).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Units Sold</p>
              <p className="text-lg font-semibold mt-1">{dashboardData.total_units_sold}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Profit</p>
              <p className="text-lg font-semibold mt-1">Rs. {Number(dashboardData.total_profit).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices and Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border-gray-100 border">
          <h4 className="font-medium text-gray-700 mb-4">Recent Invoices</h4>
          {dashboardData.recent_invoices.length > 0 ? (
            <div className="divide-y">
              {dashboardData.recent_invoices.map(invoice => (
                <div key={invoice.id} className="py-3">
                  <div className="flex justify-between">
                    <span>Invoice #{invoice.id}</span>
                    <span className="font-medium">Rs. {Number(invoice.total_amount).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent invoices</p>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg border-gray-100 border">
          <h4 className="font-medium text-gray-700 mb-4">Recent Tickets</h4>
          {dashboardData.recent_tickets.length > 0 ? (
            <div className="divide-y">
              {dashboardData.recent_tickets.map(ticket => (
                <div key={ticket.id} className="py-3">
                  <div className="flex justify-between">
                    <span>{ticket.first_name} {ticket.last_name}</span>
                    <span className="capitalize font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm">{ticket.device_model}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent tickets</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Summary card component
const SummaryCard = ({ title, value, icon, subtext }) => {
  return (
    <div className="bg-white p-4 rounded-lg border-gray-100 border">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-full">
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs text-gray-500">{subtext}</p>
      </div>
    </div>
  );
};

export default DashboardHome;