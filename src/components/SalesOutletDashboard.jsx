import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { CurrencyDollarIcon, ShoppingBagIcon, TicketIcon, ChartBarIcon, WrenchIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../api/axios';
// Add DatePicker imports
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const SalesOutletDashboard = ({ onBack }) => {
  const [salesData, setSalesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Replace timeframe with dateRange
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Default to last 30 days
    endDate: new Date(),
  });
  
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setIsLoading(true);
        
        // Format dates for API
        const startDateStr = formatDateForAPI(dateRange.startDate);
        const endDateStr = formatDateForAPI(dateRange.endDate);
        
        // Update API call to include date range parameters
        const response = await api.get(`/dashboard/sales-metrics?start_date=${startDateStr}&end_date=${endDateStr}`);
        setSalesData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalesData();
  }, [dateRange.startDate, dateRange.endDate]); // Update dependencies

  // Helper function to format date for API
  const formatDateForAPI = (date) => {
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  // Helper to set predefined date ranges
  const setPresetDateRange = (preset) => {
    const endDate = new Date();
    let startDate = new Date();

    switch (preset) {
      case "today":
        // Just today
        startDate = new Date();
        break;
      case "week":
        // Last 7 days
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "month":
        // Last 30 days
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "year":
        // This year
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    setDateRange({ startDate, endDate });
  };

  // Get date range text for display
  const getDateRangeText = () => {
    const start = dateRange.startDate.toLocaleDateString();
    const end = dateRange.endDate.toLocaleDateString();
    return `${start} to ${end}`;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-600">
      <div>Error loading sales data: {error}</div>
    </div>;
  }
  
  if (!salesData) {
    return <div className="flex justify-center items-center h-64">
      <div>No sales data available</div>
    </div>;
  }

  // Prepare monthly performance chart data
  const monthlyPerformanceData = {
    labels: salesData.monthly_sales.map(item => item.month),
    datasets: [
      {
        label: 'Sales',
        data: salesData.monthly_sales.map(item => Number(item.sales)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      },
      {
        label: 'Profit',
        data: salesData.monthly_profits.map(item => Number(item.profit)),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  // Prepare revenue sources data
  const revenueSources = [
    { source: 'Product Sales', value: Number(salesData.total_sales) - Number(salesData.service_revenue) - Number(salesData.repair_revenue) },
    { source: 'Service Revenue', value: Number(salesData.service_revenue) },
    { source: 'Repair Revenue', value: Number(salesData.repair_revenue) }
  ];
  
  const revenueSourceData = {
    labels: revenueSources.map(item => item.source),
    datasets: [{
      label: 'Revenue Sources',
      data: revenueSources.map(item => item.value),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Ticket status data
  const ticketStatusData = {
    labels: ['Open', 'In Progress', 'Completed'],
    datasets: [{
      label: 'Ticket Status',
      data: [
        salesData.open_tickets, 
        salesData.in_progress_tickets, 
        salesData.completed_tickets
      ],
      backgroundColor: [
        'rgba(255, 206, 86, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(75, 192, 192, 0.5)'
      ],
      borderColor: [
        'rgba(255, 206, 86, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back to main dashboard"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-medium text-[#1D1D1F]">Sales Dashboard</h3>
        </div>
        <div className="w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex flex-col sm:flex-row border border-gray-200 rounded-md overflow-hidden">
              <div className="flex-1 sm:flex-initial">
                <DatePicker
                  selected={dateRange.startDate}
                  onChange={(date) => setDateRange({...dateRange, startDate: date})}
                  selectsStart
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  className="w-full py-1 border-none text-sm focus:outline-none text-center"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div className="flex items-center justify-center py-1 px-2 sm:px-4 bg-gray-50 text-gray-400">
                to
              </div>
              <div className="flex-1 sm:flex-initial">
                <DatePicker
                  selected={dateRange.endDate}
                  onChange={(date) => setDateRange({...dateRange, endDate: date})}
                  selectsEnd
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  minDate={dateRange.startDate}
                  className="w-full py-1 border-none text-sm focus:outline-none text-center"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
            <select 
              className="w-full sm:w-auto px-3 py-1 bg-white border border-gray-200 rounded-md text-sm"
              onChange={(e) => setPresetDateRange(e.target.value)}
              value=""
            >
              <option value="" disabled>Quick select</option>
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">This year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Revenue" 
          value={`Rs. ${Number(salesData.total_sales || 0).toLocaleString('en-IN')}`} 
          icon={<CurrencyDollarIcon className="h-6 w-6 text-blue-600" />}
          change={`${salesData.profit_margin.toFixed(2)}% profit margin`}
          isPositive={salesData.profit_margin > 30}
        />
        <SummaryCard 
          title="Total Profit" 
          value={`Rs. ${Number(salesData.total_profit || 0).toLocaleString('en-IN')}`}
          icon={<ChartBarIcon className="h-6 w-6 text-green-600" />}
          change={`From ${getDateRangeText()}`}
          isPositive={Number(salesData.total_profit) > 0}
        />
        <SummaryCard 
          title="Products Sold" 
          value={salesData.total_units_sold} 
          icon={<ShoppingBagIcon className="h-6 w-6 text-purple-600" />}
          change={`${salesData.total_returns} returns`}
          isPositive={salesData.total_returns < 5}
        />
        <SummaryCard 
          title="Service Tickets" 
          value={salesData.total_tickets} 
          icon={<TicketIcon className="h-6 w-6 text-amber-600" />}
          change={`${salesData.completed_tickets} completed`}
          isPositive={salesData.completed_tickets > 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Performance Chart */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Monthly Sales & Profit</h4>
          </div>
          <div className="h-72">
            <Bar
              data={monthlyPerformanceData}
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
                          label += `Rs. ${context.parsed.y.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}`;
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

        {/* Revenue Sources */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium text-gray-700 mb-4">Revenue Sources</h4>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={revenueSourceData}
              options={{ 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        let label = context.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.raw !== null) {
                          label += `Rs. ${context.raw.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}`;
                        }
                        return label;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Metrics Table */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium text-gray-700 mb-4">Sales Metrics</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Total Invoices</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{salesData.total_invoices}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Total Products</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{salesData.total_products}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Last 7 Days Sales</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Rs. {Number(salesData.total_sales_last_7_days).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Last 30 Days Sales</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Rs. {Number(salesData.total_sales_last_30_days).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Returns Value</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Rs. {Number(salesData.returns_value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Ticket Status */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium text-gray-700 mb-4">Service Ticket Status</h4>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={ticketStatusData}
              options={{ 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { position: 'bottom' },
                }
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Add Back Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Main Dashboard
        </button>
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
      <div className="flex items-center mt-2">
        <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
    </div>
  );
};

export default SalesOutletDashboard;