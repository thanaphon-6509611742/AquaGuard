import React, { useState, useEffect } from 'react';
import { FaWater, FaThermometerHalf, FaBolt, FaBuilding, FaBell, FaCircle } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'top',
      labels: {
        padding: 20,
        font: {
          size: 14
        }
      }
    },
    title: {
      display: true,
      text: 'Water Quality Trends',
      font: {
        size: 16,
        weight: 'bold'
      },
      padding: 20
    },
  },
  scales: {
    y: {
      min: 6.0,
      max: 8.0,
      grid: {
        color: 'rgba(0,0,0,0.05)'
      },
      ticks: {
        font: {
          size: 12
        }
      },
      title: {
        display: true,
        text: 'pH Level',
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 12
        }
      }
    }
  },
  animation: {
    duration: 750,
    easing: 'easeInOutQuart'
  }
};

const QualityBanner = ({ quality }) => (
  <div className={`mb-8 p-4 rounded-xl shadow-sm ${
    quality === 'EXCELLENT' ? 'bg-green-50 border border-green-200' :
    quality === 'GOOD' ? 'bg-blue-50 border border-blue-200' :
    quality === 'WARNING' ? 'bg-yellow-50 border border-yellow-200' :
    'bg-red-50 border border-red-200'
  }`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <FaCircle className={`h-3 w-3 ${
          quality === 'EXCELLENT' ? 'text-green-500' :
          quality === 'GOOD' ? 'text-blue-500' :
          quality === 'WARNING' ? 'text-yellow-500' :
          'text-red-500'
        }`} />
        <h2 className="ml-2 text-lg font-semibold">Overall Water Quality: {quality}</h2>
      </div>
    </div>
  </div>
);

const StatusCard = ({ icon, title, value, timestamp }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center mb-4">
      {React.cloneElement(icon, { className: "h-7 w-7 text-blue-600" })}
      <h3 className="ml-3 text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-4xl font-bold text-gray-900 mb-2">{value}</p>
    <p className="text-sm text-gray-500">
      Updated: {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </p>
  </div>
);

const BuildingDetails = ({ dormName, dormData }) => {
  const latestData = dormData[0] || {};
  
  const chartData = {
    labels: dormData.map(d => new Date(d.timestamp).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })),
    datasets: [{
      label: 'pH Level',
      data: dormData.map(d => d.pH),
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.4,
    }],
  };

  return (
    <div className="space-y-8">
      <QualityBanner quality={latestData.quality} />
      <div className="grid grid-cols-2 gap-8">
        <StatusCard
          icon={<FaWater />}
          title="pH Level"
          value={latestData.pH?.toFixed(1)}
          timestamp={latestData.timestamp}
          quality={latestData.quality}
        />
        <StatusCard
          icon={<FaThermometerHalf />}
          title="Temperature"
          value={`${latestData.temperature}°C`}
          timestamp={latestData.timestamp}
          quality={latestData.quality}
        />
        <StatusCard
          icon={<FaBolt />}
          title="ORP"
          value={`${latestData.ORP} mV`}
          timestamp={latestData.timestamp}
          quality={latestData.quality}
        />
        <StatusCard
          icon={<FaBuilding />}
          title="Location"
          value={dormName}
          timestamp={latestData.timestamp}
          quality={latestData.quality}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="h-[400px]">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Status Log</h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          {dormData.map((reading, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Reading {index + 1}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(reading.timestamp).toLocaleString()}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                reading.quality === 'GOOD' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {reading.quality}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDorm, setSelectedDorm] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://otbbh4v81j.execute-api.us-east-1.amazonaws.com/items');
        const result = await response.json();
        setData(result);
        if (!selectedDorm && result.length > 0) {
          setSelectedDorm(result[0].DormName);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  const dormGroups = data.reduce((groups, item) => {
    const group = (groups[item.DormName] || []);
    group.push(item);
    groups[item.DormName] = group;
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold text-gray-900">Water Quality Dashboard</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Buildings</h2>
              <ul className="space-y-3">
                {Object.keys(dormGroups).map(dorm => (
                  <li 
                    key={dorm}
                    onClick={() => setSelectedDorm(dorm)}
                    className={`flex items-center cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                      selectedDorm === dorm 
                        ? 'bg-blue-50 text-blue-600 shadow-sm' 
                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FaBuilding className={`h-5 w-5 mr-3 ${
                      selectedDorm === dorm ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className="font-medium">{dorm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="col-span-9">
            {selectedDorm && dormGroups[selectedDorm] && (
              <BuildingDetails 
                dormName={selectedDorm} 
                dormData={dormGroups[selectedDorm]} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;