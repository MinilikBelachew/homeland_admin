import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ref, get, DataSnapshot } from "firebase/database"; // Import for Firebase
import { database } from "../../app/methods/firbase_config"; // Import for Firebase config
import { ApexOptions } from "apexcharts";

const ChartOne: React.FC = () => {
  const [chartData, setChartData] = useState<{
    categories: string[];
    series: { name: string; data: number[] }[];
  }>({
    categories: [],
    series: [],
  });

  useEffect(() => {
    const fetchCustomerBehaviorData = async () => {
      try {
        const rideRequestsRef = ref(database, "Ride Request");
        const rideRequestsSnapshot = await get(rideRequestsRef);

        if (rideRequestsSnapshot.exists()) {
          const categories: string[] = [];

          rideRequestsSnapshot.forEach((childSnapshot: DataSnapshot) => {
            const packageDescription = childSnapshot
              .child("package_description")
              .val() as string;

            // Push package details to categories if not already present
            if (!categories.includes(packageDescription)) {
              categories.push(packageDescription);
            }
          });

          const seriesData = categories.map((category) => ({
            name: category,
            data: categories.map((innerCategory) => {
              // Count occurrences of package details
              let total = 0;
              rideRequestsSnapshot.forEach((childSnapshot: DataSnapshot) => {
                const childPackageDescription = childSnapshot
                  .child("package_description")
                  .val() as string;
                if (childPackageDescription === category) {
                  total++;
                }
              });
              return total;
            }),
          }));

          setChartData({ categories, series: seriesData });
        }
      } catch (error) {
        console.error("Error fetching customer behavior data:", error);
      }
    };

    fetchCustomerBehaviorData();
  }, []);

  const options: ApexOptions = {
    // Options for the ApexCharts configuration
    // You can customize this based on your requirements
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <h2 className="text-xl font-semibold mb-4">Customer Behavior Analysis</h2>
      <div id="chartOne" className="-ml-5">
        <ReactApexChart
          options={options}
          series={chartData.series}
          type="radar"
          height={350}
          width={"100%"}
        />
      </div>
    </div>
  );
};

export default ChartOne;
