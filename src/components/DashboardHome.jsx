import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ArrowUpIcon, ArrowDownIcon, TicketIcon, CurrencyDollarIcon, ShoppingBagIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import api from '../api/axios';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('daily');

  useEffect(() => {
    // Function to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dashboard summary data using axios
        const dashboardResponse = await api.get('/dashboard');
        
        // Fetch chart data using axios
        const chartResponse = await api.get('/dashboard/charts');
        
        // Update state with fetched data
        // Axios automatically parses JSON and puts result in response.data
        setDashboardData(dashboardResponse.data.data);
        setChartData(chartResponse.data.data);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-[#1D1D1F]">Dashboard Overview</h3>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm">
            <option>Last 30 days</option>
            <option>Last week</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Today's Revenue" 
          value={`$${dashboardData.invoices.today.total.toLocaleString()}`} 
          icon={<CurrencyDollarIcon className="h-6 w-6 text-blue-600" />}
          change="+15.3%"
          isPositive={true}
        />
        <SummaryCard 
          title="Today's Invoices" 
          value={dashboardData.invoices.today.count} 
          icon={<ShoppingBagIcon className="h-6 w-6 text-green-600" />}
          change="+8.2%"
          isPositive={true}
        />
        <SummaryCard 
          title="Today's Tickets" 
          value={dashboardData.tickets.today} 
          icon={<TicketIcon className="h-6 w-6 text-amber-600" />}
          change="-2.5%"
          isPositive={false}
        />
        <SummaryCard 
          title="Monthly Revenue" 
          value={`$${dashboardData.invoices.month.total.toLocaleString()}`} 
          icon={<ChartBarIcon className="h-6 w-6 text-purple-600" />}
          change="+23.1%"
          isPositive={true}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Revenue Overview</h4>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveChart('daily')}
                className={`px-3 py-1 text-sm rounded-md ${activeChart === 'daily' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}>
                Daily
              </button>
              <button 
                onClick={() => setActiveChart('monthly')}
                className={`px-3 py-1 text-sm rounded-md ${activeChart === 'monthly' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}>
                Monthly
              </button>
            </div>
          </div>
          <div className="h-72">
            {activeChart === 'daily' ? (
              <Line 
                data={chartData.daily_revenue}
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: false } }
                }} 
              />
            ) : (
              <Bar
                data={chartData.monthly_revenue}
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: false } }
                }} 
              />
            )}
          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium text-gray-700 mb-4">Product Categories</h4>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={chartData.category_distribution}
              options={{ 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { position: 'bottom' }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-medium text-gray-700 mb-4">Top Selling Products</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.top_products.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.total_sold}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(product.total_sold / 24) * 100}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Summary card component
const SummaryCard = ({ title, value, icon, change, isPositive }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-full">
          {icon}
        </div>
      </div>
      <div className={`flex items-center mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? 
          <ArrowUpIcon className="h-4 w-4 mr-1" /> : 
          <ArrowDownIcon className="h-4 w-4 mr-1" />
        }
        <span className="text-sm">{change} from yesterday</span>
      </div>
    </div>
  );
};

export default DashboardHome;