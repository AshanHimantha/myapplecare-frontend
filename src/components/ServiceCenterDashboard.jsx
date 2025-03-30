import React, { useState, useEffect } from "react";
// Add DatePicker imports
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import {
  TicketIcon,
  CurrencyDollarIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  CubeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import api from "../api/axios";

// Register ChartJS components - add LineElement and PointElement
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ServiceCenterDashboard = ({ onBack, centerId }) => {
  // Replace timeframe with date range state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Default to last 30 days
    endDate: new Date(),
  });
  const [metrics, setMetrics] = useState(null);
  const [ticketCharts, setTicketCharts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setIsLoading(true);

        // Format dates for API
        const startDateStr = formatDateForAPI(dateRange.startDate);
        const endDateStr = formatDateForAPI(dateRange.endDate);

        // Create an array of promises for parallel requests
        const promises = [
          api.get(
            `/dashboard/service-metrics?start_date=${startDateStr}&end_date=${endDateStr}`
          ),
          api.get("/dashboard/ticket-charts"),
        ];

        // Wait for both requests to complete
        const [metricsResponse, ticketChartsResponse] = await Promise.all(
          promises
        );

        setMetrics(metricsResponse.data);
        setTicketCharts(ticketChartsResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching service data:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceData();
  }, [centerId, dateRange.startDate, dateRange.endDate]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <div>Error loading service metrics: {error}</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>No service metrics available</div>
      </div>
    );
  }

  // Helper functions to get the correct values based on timeframe
  const getMetricValue = (metricKey) => {
    if (!metrics) return 0;

    // Handle nested properties like repair_stats.total_repairs
    if (metricKey.includes(".")) {
      const [parentKey, childKey] = metricKey.split(".");
      if (!metrics[parentKey]) return 0;
      return Number(metrics[parentKey][childKey] || 0);
    }

    // For regular properties
    return Number(metrics[metricKey] || 0);
  };

  // Data for ticket status chart
  const ticketStatusData = {
    labels: ["Open", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          metrics.open_tickets || 0,
          metrics.in_progress_tickets || 0,
          metrics.completed_tickets || 0,
        ],
        backgroundColor: [
          "rgba(255, 159, 64, 0.7)", // orange
          "rgba(54, 162, 235, 0.7)", // blue
          "rgba(75, 192, 192, 0.7)", // green
        ],
        borderColor: [
          "rgb(255, 159, 64)",
          "rgb(54, 162, 235)",
          "rgb(75, 192, 192)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare revenue data for chart
  const revenueChartData = {
    labels: ["Service", "Repairs", "Parts"],
    datasets: [
      {
        label: "Revenue Breakdown",
        data: [
          Number(metrics.service_revenue || 0),
          Number(metrics.repair_revenue || 0),
          Number(metrics.parts_revenue || 0),
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)", // blue
          "rgba(75, 192, 192, 0.7)", // green
          "rgba(255, 159, 64, 0.7)", // orange
        ],
        borderColor: [
          "rgb(54, 162, 235)",
          "rgb(75, 192, 192)",
          "rgb(255, 159, 64)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Revenue by type data for chart
  const revenueByTypeData = {
    labels: ["This Month", "This Year"],
    datasets: [
      {
        label: "Service",
        data: [
          Number(metrics.service_revenue_month || 0),
          Number(metrics.service_revenue_year || 0),
        ],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
      },
      {
        label: "Repairs",
        data: [
          Number(metrics.repair_revenue_month || 0),
          Number(metrics.repair_revenue_year || 0),
        ],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
      {
        label: "Parts",
        data: [
          Number(metrics.parts_revenue_month || 0),
          Number(metrics.parts_revenue_year || 0),
        ],
        backgroundColor: "rgba(255, 159, 64, 0.7)",
        borderColor: "rgb(255, 159, 64)",
        borderWidth: 1,
      },
    ],
  };

  const getDateRangeText = () => {
    const start = dateRange.startDate.toLocaleDateString();
    const end = dateRange.endDate.toLocaleDateString();
    return `${start} to ${end}`;
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
          <h3 className="text-lg font-medium text-[#1D1D1F]">
            Service Center Dashboard
          </h3>
        </div>
        <div className="w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex flex-col sm:flex-row border border-gray-200 rounded-md overflow-hidden">
              <div className=" flex">
                <DatePicker
                  selected={dateRange.startDate}
                  onChange={(date) =>
                    setDateRange({ ...dateRange, startDate: date })
                  }
                  selectsStart
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  className="w-full py-1 border-none text-sm focus:outline-none text-center"
                  dateFormat="yyyy-MM-dd"
                />

                <div className="flex items-center justify-center py-1 px-2 sm:px-4 bg-gray-100 text-gray-400">
                  to
                </div>

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
              <option value="" disabled>
                Quick select
              </option>
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
          title="Total Tickets"
          value={metrics.total_tickets}
          icon={<TicketIcon className="h-6 w-6 text-blue-600" />}
          subtext={`${metrics.completed_tickets} tickets completed`}
        />
        <SummaryCard
          title="Total Revenue"
          value={`Rs.${getMetricValue(
            "total_service_revenue"
          ).toLocaleString()}`}
          icon={<CurrencyDollarIcon className="h-6 w-6 text-green-600" />}
          subtext={`Based on data from ${getDateRangeText()}`}
        />
        <SummaryCard
          title="Total Profit"
          value={`Rs.${getMetricValue(
            "total_service_profit"
          ).toLocaleString()}`}
          icon={<ShieldCheckIcon className="h-6 w-6 text-purple-600" />}
          subtext={`From service, repairs, and parts`}
        />
        <SummaryCard
          title="Repairs"
          value={getMetricValue("repair_stats.total_repairs")}
          icon={<WrenchScrewdriverIcon className="h-6 w-6 text-amber-600" />}
          subtext={`Rs.${getMetricValue(
            "repair_revenue"
          ).toLocaleString()} revenue`}
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
                  legend: { position: "right" },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0
                        );
                        const percentage =
                          total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                },
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
                  legend: { position: "right" },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0
                        );
                        const percentage =
                          total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                      },
                    },
                  },
                },
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
                legend: { position: "top" },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let label = context.dataset.label || "";
                      if (label) {
                        label += ": ";
                      }
                      if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(context.parsed.y);
                      }
                      return label;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Add Daily Ticket Activity Chart */}
      {ticketCharts && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium text-gray-700 mb-4">
            Daily Ticket Activity
          </h4>
          <div className="h-72">
            <Line
              data={{
                labels: ticketCharts.daily_tickets.map((item) => item.date),
                datasets: [
                  {
                    label: "Created Tickets",
                    data: ticketCharts.daily_tickets.map(
                      (item) => item.created
                    ),
                    borderColor: "rgb(54, 162, 235)",
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                    tension: 0.1,
                  },
                  {
                    label: "Completed Tickets",
                    data: ticketCharts.daily_tickets.map(
                      (item) => item.completed
                    ),
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                    tension: 0.1,
                  },
                  {
                    label: "Revenue (Rs.)",
                    data: ticketCharts.daily_tickets.map(
                      (item) => item.revenue
                    ),
                    borderColor: "rgb(255, 159, 64)",
                    backgroundColor: "rgba(255, 159, 64, 0.5)",
                    tension: 0.1,
                    yAxisID: "y1",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Ticket Count",
                    },
                  },
                  y1: {
                    beginAtZero: true,
                    position: "right",
                    title: {
                      display: true,
                      text: "Revenue (Rs.)",
                    },
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Add Device Categories & Models Section */}
      {ticketCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Categories */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700 mb-4">
              Device Categories
            </h4>
            <div className="h-64 flex items-center justify-center">
              <Pie
                data={{
                  labels: ticketCharts.device_categories.map(
                    (item) => item.device_category
                  ),
                  datasets: [
                    {
                      data: ticketCharts.device_categories.map(
                        (item) => item.count
                      ),
                      backgroundColor: [
                        "rgba(54, 162, 235, 0.7)",
                        "rgba(75, 192, 192, 0.7)",
                        "rgba(255, 159, 64, 0.7)",
                        "rgba(255, 99, 132, 0.7)",
                      ],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "right" },
                  },
                }}
              />
            </div>
          </div>

          {/* Top Models & Resolution Time */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700 mb-4">
              Service Statistics
            </h4>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">
                    Average Resolution Time
                  </span>
                  <p className="text-xl font-semibold mt-1">
                    {Math.floor(ticketCharts.avg_resolution_time)} hours
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-full">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Completion Rate</span>
                  <p className="text-xl font-semibold mt-1">
                    {ticketCharts.completion_rate}%
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-full">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-lg">
                <div className="p-3 border-b border-gray-100">
                  <h5 className="text-sm font-medium text-gray-700">
                    Top Device Models
                  </h5>
                </div>
                <div className="p-2">
                  {ticketCharts.top_models.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {ticketCharts.top_models.map((model, index) => (
                        <li
                          key={index}
                          className="py-2 px-1 flex justify-between items-center"
                        >
                          <span className="text-sm">{model.device_model}</span>
                          <span className="text-sm font-medium">
                            {model.count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 py-2 text-center">
                      No data available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Repairs & Parts */}
      {ticketCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Repairs */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700 mb-4">
              Top Repair Services
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Repair Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ticketCharts.top_repairs.map((repair, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {repair.repair_name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {repair.count}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        Rs.{Number(repair.unit_cost).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Parts */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700 mb-4">Top Parts Used</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Part Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ticketCharts.top_parts.map((part, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {part.part_name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {part.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        Rs.{Number(part.revenue).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        Rs.{Number(part.profit).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Back button remains unchanged */}
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
        <div className="p-2 bg-gray-50 rounded-full">{icon}</div>
      </div>
      <div className="mt-2">
        <p className="text-xs text-gray-500">{subtext}</p>
      </div>
    </div>
  );
};

export default ServiceCenterDashboard;
