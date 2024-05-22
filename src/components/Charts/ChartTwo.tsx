import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ref, get, DataSnapshot } from 'firebase/database'; // Import for Firebase
import { database } from '../../app/methods/firbase_config'; // Import for Firebase config

const RideRequestFrequencyChart: React.FC = () => {
  const [chartData, setChartData] = useState<{ x: string; y: number }[]>([]);

  const formatDateAsDailyInterval = (timestamp: string): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
  };
  
  useEffect(() => {
    const fetchRideRequests = async () => {
      try {
        const rideRequestsRef = ref(database, 'Ride Request');
        const rideRequestsSnapshot = await get(rideRequestsRef);
  
        if (rideRequestsSnapshot.exists()) {
          const rideRequestsData: { [timestamp: string]: number } = {};
          rideRequestsSnapshot.forEach((childSnapshot: DataSnapshot) => {
            const timestamp = childSnapshot.child('created_at').val();
            const timeInterval = formatDateAsDailyInterval(timestamp);
            rideRequestsData[timeInterval] = (rideRequestsData[timeInterval] || 0) + 1;
          });
  
          const formattedChartData = Object.entries(rideRequestsData).map(
            ([timeInterval, count]) => ({
              x: timeInterval,
              y: count,
            })
          );
  
          setChartData(formattedChartData);
        }
      } catch (error) {
        console.error('Error fetching ride requests:', error);
      }
    };
  
    fetchRideRequests();
  }, []);
  
  const formatDateAsHourlyInterval = (timestamp: string): string => {
    // Implement your logic to format the timestamp as an hourly interval
    // (e.g., new Date(timestamp).getHours())
    return timestamp; // Placeholder implementation, replace with your logic
  };

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: chartData.map(item => item.x),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
      max: Math.max(...chartData.map(item => item.y)) + 10,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h2 className="text-xl font-semibold mb-4">Ride Request Frequency Over Time</h2>
      <ReactApexChart
        options={options}
        series={[{ name: "Ride Requests", data: chartData.map(item => item.y) }]}
        type="area"
        height={350}
        width={"100%"}
      />
    </div>
  );
};

export default RideRequestFrequencyChart;
