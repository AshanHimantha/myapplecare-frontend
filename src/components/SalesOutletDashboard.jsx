import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { CurrencyDollarIcon, ShoppingBagIcon, UserGroupIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import api from '../api/axios';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const SalesOutletDashboard = ({ outletId }) => {
  const [outletData, setOutletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOutletData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/sales-outlets/${outletId}/dashboard`);
        setOutletData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching sales outlet data:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (outletId) {
      fetchOutletData();
    }
  }, [outletId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-600">
      <div>Error loading sales outlet data: {error}</div>
    </div>;
  }
  
  if (!outletData) {
    return <div className="flex justify-center items-center h-64">
      <div>No data available for this sales outlet</div>
    </div>;
  }

  // Prepare monthly performance chart data
  const monthlyPerformanceData = {
    labels: outletData.monthly_performance.map(item => item.month),
    datasets: [
      {
        label: 'Sales',
        data: outletData.monthly_performance.map(item => Number(item.sales)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      },
      {
        label: 'Target',
        data: outletData.monthly_performance.map(item => Number(item.target)),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 1
      }
    ]
  };

  // Prepare product category breakdown data
  const productCategoryData = {
    labels: outletData.product_categories.map(item => item.category),
    datasets: [{
      label: 'Sales by Category',
      data: outletData.product_categories.map(item => Number(item.sales)),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-[#1D1D1F]">{outletData.outlet_name} Dashboard</h3>
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
          title="Total Revenue" 
          value={`$${Number(outletData.total_revenue).toLocaleString()}`} 
          icon={<CurrencyDollarIcon className="h-6 w-6 text-blue-600" />}
          change={`${outletData.revenue_growth}% vs last period`}
          isPositive={outletData.revenue_growth > 0}
        />
        <SummaryCard 
          title="Products Sold" 
          value={outletData.products_sold.toLocaleString()}
          icon={<ShoppingBagIcon className="h-6 w-6 text-green-600" />}
          change={`${outletData.sales_growth}% vs last period`}
          isPositive={outletData.sales_growth > 0}
        />
        <SummaryCard 
          title="Customer Traffic" 
          value={outletData.customer_traffic.toLocaleString()} 
          icon={<UserGroupIcon className="h-6 w-6 text-purple-600" />}
          change={`${outletData.traffic_growth}% vs last period`}
          isPositive={outletData.traffic_growth > 0}
        />
        <SummaryCard 
          title="Conversion Rate" 
          value={`${outletData.conversion_rate}%`} 
          icon={<BuildingStorefrontIcon className="h-6 w-6 text-amber-600" />}
          change={`${outletData.conversion_growth}% vs last period`}
          isPositive={outletData.conversion_growth > 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Performance Chart */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Monthly Performance vs Target</h4>
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
                          label += new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(context.parsed.y);
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

        {/* Product Category Breakdown */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium text-gray-700 mb-4">Sales by Product Category</h4>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={productCategoryData}
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
                          label += new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(context.raw);
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
        {/* Top Products */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium text-gray-700 mb-4">Top Selling Products</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {outletData.top_products.map((product, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{product.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{product.units_sold}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">${Number(product.revenue).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Staff Performance */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium text-gray-700 mb-4">Staff Performance</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {outletData.staff_performance.map((staff, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{staff.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">${Number(staff.sales).toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{staff.conversion}%</td>
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