import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import { ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { TicketIcon, CurrencyDollarIcon, ClockIcon, WrenchScrewdriverIcon, ShieldCheckIcon, CubeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import api from '../api/axios';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ServiceCenterDashboard = ({ onBack, centerId }) => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('month');
  
  useEffect(() => {
    const fetchServiceMetrics = async () => {
      try {
        setIsLoading(true);
        // If centerId is provided, fetch specific center metrics, otherwise fetch overall metrics
        const endpoint = centerId ? `/service-centers/${centerId}/metrics` : '/dashboard/service-metrics';
        const response = await api.get(endpoint);
        setMetrics(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching service metrics:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServiceMetrics();
  }, [centerId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-600">
      <div>Error loading service metrics: {error}</div>
    </div>;
  }
  
  if (!metrics) {
    return <div className="flex justify-center items-center h-64">
      <div>No service metrics available</div>
    </div>;
  }

  // Data for ticket status chart
  const ticketStatusData = {
    labels: ['Open', 'In Progress', 'Completed'],
    datasets: [{
      data: [
        metrics.open_tickets || 0, 
        metrics.in_progress_tickets || 0, 
        metrics.completed_tickets || 0
      ],
      backgroundColor: [
        'rgba(255, 159, 64, 0.7)',  // orange
        'rgba(54, 162, 235, 0.7)',   // blue
        'rgba(75, 192, 192, 0.7)',   // green
      ],
      borderColor: [
        'rgb(255, 159, 64)',
        'rgb(54, 162, 235)',
        'rgb(75, 192, 192)',
      ],
      borderWidth: 1
    }]
  };
  
  // Prepare revenue data for chart
  const revenueChartData = {
    labels: ['Service', 'Repairs', 'Parts'],
    datasets: [{
      label: 'Revenue Breakdown',
      data: [
        Number(metrics.service_revenue || 0),
        Number(metrics.repair_revenue || 0),
        Number(metrics.parts_revenue || 0)
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',   // blue
        'rgba(75, 192, 192, 0.7)',   // green
        'rgba(255, 159, 64, 0.7)',   // orange
      ],
      borderColor: [
        'rgb(54, 162, 235)',
        'rgb(75, 192, 192)',
        'rgb(255, 159, 64)',
      ],
      borderWidth: 1
    }]
  };

  // Revenue by type data for chart
  const revenueByTypeData = {
    labels: ['This Month', 'This Year'],
    datasets: [
      {
        label: 'Service',
        data: [
          Number(metrics.service_revenue_month || 0),
          Number(metrics.service_revenue_year || 0)
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      },
      {
        label: 'Repairs',
        data: [
          Number(metrics.repair_revenue_month || 0),
          Number(metrics.repair_revenue_year || 0)
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      },
      {
        label: 'Parts',
        data: [
          Number(metrics.parts_revenue_month || 0),
          Number(metrics.parts_revenue_year || 0)
        ],
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back to main dashboard"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-medium text-[#1D1D1F]">Service Center Dashboard</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">Last week</option>
            <option value="month">Last 30 days</option>
            <option value="year">This year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Tickets" 
          value={metrics.total_tickets} 
          icon={<TicketIcon className="h-6 w-6 text-blue-600" />}
          subtext={`${metrics.completed_tickets} tickets completed`}
        />
        <SummaryCard 
          title="Total Revenue" 
          value={`Rs.${Number(metrics.total_service_revenue || 0).toLocaleString()}`}
          icon={<CurrencyDollarIcon className="h-6 w-6 text-green-600" />}
          subtext={`Rs.${Number(metrics.total_service_revenue_month || 0).toLocaleString()} this month`}
        />
        <SummaryCard 
          title="Total Profit" 
          value={`Rs.${Number(metrics.total_service_profit || 0).toLocaleString()}`} 
          icon={<ShieldCheckIcon className="h-6 w-6 text-purple-600" />}
          subtext={`From service, repairs, and parts`}
        />
        <SummaryCard 
          title="Repairs" 
          value={metrics.repair_stats?.total_repairs || 0} 
          icon={<WrenchScrewdriverIcon className="h-6 w-6 text-amber-600" />}
          subtext={`Rs.${Number(metrics.repair_revenue || 0).toLocaleString()} revenue`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Status Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Ticket Status</h4>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={ticketStatusData}
              options={{ 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { position: 'right' },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? Math.round(value / total * 100) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
        
        {/* Revenue Breakdown */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Revenue Breakdown</h4>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Pie
              data={revenueChartData}
              options={{ 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { position: 'right' },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? Math.round(value / total * 100) : 0;
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

      {/* Revenue By Period Chart */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-medium text-gray-700 mb-4">Revenue By Period</h4>
        <div className="h-72">
          <Bar
            data={revenueByTypeData}
            options={{ 
              maintainAspectRatio: false,
              plugins: { 
                legend: { position: 'top' },
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
              }
            }} 
          />
        </div>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service & Repair Details */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium text-gray-700 mb-4">Repair Details</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm text-gray-500">Repair Revenue</span>
                <p className="text-xl font-semibold mt-1">Rs.{Number(metrics.repair_revenue || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">This Month: Rs.{Number(metrics.repair_revenue_month || 0).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm text-gray-500">Service Revenue</span>
                <p className="text-xl font-semibold mt-1">Rs.{Number(metrics.service_revenue || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">This Month: Rs.{Number(metrics.service_revenue_month || 0).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Total Repairs</span>
                  <p className="text-xl font-semibold mt-1">{metrics.repair_stats?.total_repairs || 0}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Repair Items</span>
                  <p className="text-xl font-semibold mt-1">{metrics.repair_stats?.total_repair_items || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              <div className="flex-1 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Completed Tickets</span>
                  <p className="text-lg font-semibold">{metrics.completed_tickets || 0}</p>
                </div>
              </div>
              <div className="flex-1 flex items-center">
                <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Repairs Performed</span>
                  <p className="text-lg font-semibold">{metrics.total_repairs_performed || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parts Revenue Details */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium text-gray-700 mb-4">Parts Revenue Details</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm text-gray-500">Revenue</span>
                <p className="text-xl font-semibold mt-1">Rs.{Number(metrics.parts_revenue || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">This Month: Rs.{Number(metrics.parts_revenue_month || 0).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm text-gray-500">Cost</span>
                <p className="text-xl font-semibold mt-1">Rs.{Number(metrics.parts_cost || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">This Month: Rs.{Number(metrics.parts_cost_month || 0).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-500">Profit</span>
              <p className="text-xl font-semibold mt-1">Rs.{Number(metrics.parts_profit || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">This Month: Rs.{Number(metrics.parts_profit_month || 0).toLocaleString()}</p>
            </div>
            
            <div className="flex items-center mt-4">
              <div className="flex-1 flex items-center">
                <CubeIcon className="h-5 w-5 mr-2 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Parts Used</span>
                  <p className="text-lg font-semibold">{metrics.total_parts_used || 0}</p>
                </div>
              </div>
              <div className="flex-1 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Profit Margin</span>
                  <p className="text-lg font-semibold">
                    {metrics.parts_revenue && metrics.parts_cost ? 
                      `${(((Number(metrics.parts_revenue) - Number(metrics.parts_cost)) / Number(metrics.parts_revenue)) * 100).toFixed(1)}%` : 
                      '0%'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Back Button at the bottom similar to SalesOutletDashboard */}
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
const SummaryCard = ({ title, value, icon, subtext }) => {
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
      <div className="mt-2">
        <p className="text-xs text-gray-500">{subtext}</p>
      </div>
    </div>
  );
};

export default ServiceCenterDashboard;