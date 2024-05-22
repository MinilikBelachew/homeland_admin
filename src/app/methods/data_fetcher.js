// dataFetcher.js
import { database } from './firbase_config';
import { ref, get } from "firebase/database";

export const fetchData = async () => {
  const dbRef = ref(database);
  const snapshot = await get(dbRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    const driversCount = Object.keys(data.drivers || {}).length;
    const usersCount = Object.keys(data.users || {}).length;
    const carOwnersCount = Object.keys(data.car_owners || {}).length;
    const rideRequestsCount = Object.keys(data['Ride Request'] || {}).length;
    const availableDriversCount = Object.keys(data.anAvailabeDrivers || {}).length;

    return {
      driversCount,
      usersCount,
      carOwnersCount,
      rideRequestsCount,
      availableDriversCount
    };
  } else {
    console.log("No data available");
    return {};
  }
};
