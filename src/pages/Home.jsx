import React, { useState, useEffect } from 'react';
import { FaWater, FaChartLine, FaBell, FaArrowRight, FaUser, FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const isToday = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
  </div>
);

const ParameterValue = ({ label, value, unit, threshold, tooltip }) => (
  <div className="text-center relative group">
    <div data-tooltip-id={`tooltip-${label}`} className="cursor-help">
      <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
        {label} <FaInfoCircle className="text-gray-400 h-3 w-3" />
      </p>
      <p className={`font-bold text-lg ${
        threshold ? (value >= threshold.min && value <= threshold.max ? 'text-green-600' : 'text-red-600') : ''
      }`}>
        {value}{unit}
      </p>
    </div>
    <Tooltip id={`tooltip-${label}`}>
      {tooltip}
    </Tooltip>
  </div>
);

const StatusCard = ({ title, value, unit, quality }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
    quality === 'BAD' ? 'border-l-4 border-red-500' : quality === 'GOOD' ? 'border-l-4 border-green-500' : ''
  }`}>
    <div className="text-center space-y-2">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className="flex items-center justify-center space-x-2">
        <p className="text-4xl font-bold text-blue-600">{value}</p>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
      {quality && (
        <div className={`flex items-center justify-center ${quality === 'GOOD' ? 'text-green-500' : 'text-red-500'}`}>
          {quality === 'GOOD' ? <FaCheckCircle className="h-4 w-4" /> : <FaExclamationTriangle className="h-4 w-4" />}
          <span className="text-sm ml-1">{quality}</span>
        </div>
      )}
    </div>
  </div>
);

const DormStatus = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-lg">{data.DormName}</h3>
      <span className={`px-3 py-1 rounded-full text-sm ${
        data.quality === 'GOOD' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {data.quality}
      </span>
    </div>
    <div className="grid grid-cols-3 gap-6">
      <ParameterValue 
        label="pH" 
        value={data.pH} 
        unit=""
        threshold={{ min: 6.5, max: 8.5 }}
        tooltip="Safe pH range: 6.5-8.5"
      />
      <ParameterValue 
        label="Temperature" 
        value={data.temperature} 
        unit="°C"
        threshold={{ min: 20, max: 30 }}
        tooltip="Optimal range: 20-30°C"
      />
      <ParameterValue 
        label="ORP" 
        value={data.ORP} 
        unit="mV"
        threshold={{ min: 400, max: 500 }}
        tooltip="Ideal ORP: 400-500mV"
      />
    </div>
    <div className="mt-4 pt-4 border-t text-sm text-gray-500">
      Last updated: {new Date(data.timestamp).toLocaleTimeString()}
    </div>
  </div>
);

const QuickStats = ({ data }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <p className="text-sm text-gray-500">Total Locations</p>
        <p className="text-2xl font-bold text-blue-600">{data.length}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Good Status</p>
        <p className="text-2xl font-bold text-green-600">
          {data.filter(d => d.quality === 'GOOD').length}
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Need Attention</p>
        <p className="text-2xl font-bold text-red-600">
          {data.filter(d => d.quality === 'BAD').length}
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Avg Temperature</p>
        <p className="text-2xl font-bold text-blue-600">
          {(data.reduce((acc, curr) => acc + curr.temperature, 0) / data.length).toFixed(1)}°C
        </p>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [waterData, setWaterData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://otbbh4v81j.execute-api.us-east-1.amazonaws.com/items'); 
        const data = await response.json();
        setWaterData(data);
      } catch (error) {
        console.error('Error fetching water data:', error);
      }
    };

    fetchData();
    // Add polling if you want real-time updates
    const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaWater className="h-8 w-8 text-blue-600 animate-pulse" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                AquaGuard
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Dashboard</a>
              <a href="/history" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">History</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Smart Water Quality <br/> 
              <span className="text-blue-600">Monitoring System</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Real-time monitoring of water quality parameters for your safety and peace of mind.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/dashboard" 
                 className="group inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                View Dashboard
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-inner">
          <h2 className="text-2xl font-semibold text-center mb-8">Water Quality Monitor</h2>
          
          {waterData.length > 0 ? (
            <>
              <QuickStats data={waterData.filter(dorm => isToday(dorm.timestamp))} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {waterData.filter(dorm => isToday(dorm.timestamp)).length > 0 ? (
                  waterData
                    .filter(dorm => isToday(dorm.timestamp))
                    .map((dorm) => (
                      <DormStatus key={dorm.DormName} data={dorm} />
                    ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No data available for today
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <LoadingSkeleton key={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <FaWater className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Real-time Monitoring</h3>
              <p className="text-gray-600 leading-relaxed">24/7 continuous monitoring of pH, turbidity, and temperature levels.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <FaChartLine className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Data Analytics</h3>
              <p className="text-gray-600 leading-relaxed">Advanced analytics and historical data tracking for informed decisions.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <FaBell className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Instant Alerts</h3>
              <p className="text-gray-600 leading-relaxed">Real-time notifications for any water quality issues detected.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} AquaGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    
  );
};

export default Home;