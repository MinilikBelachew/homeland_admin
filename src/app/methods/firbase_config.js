

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9MI276uUlVZcM4hzd_NUC1atJ1yGtntk",
  authDomain: "homeland-95f19.firebaseapp.com",
  databaseURL: "https://homeland-95f19-default-rtdb.firebaseio.com",
  projectId: "homeland-95f19",
  storageBucket: "homeland-95f19.appspot.com",
  messagingSenderId: "771185889083",
  appId: "1:771185889083:web:1dbf8580ad6fb92c12b11e",
  measurementId: "G-H1BMYC95EM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

export { database };













// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyD9MI276uUlVZcM4hzd_NUC1atJ1yGtntk",
//   authDomain: "homeland-95f19.firebaseapp.com",
//   databaseURL: "https://homeland-95f19-default-rtdb.firebaseio.com",
//   projectId: "homeland-95f19",
//   storageBucket: "homeland-95f19.appspot.com",
//   messagingSenderId: "771185889083",
//   appId: "1:771185889083:web:1dbf8580ad6fb92c12b11e",
//   measurementId: "G-H1BMYC95EM"
// };

// function getMyDatabase() {
//   return getDatabase(app); // Use getDatabase to retrieve the database instance
// }

// const app = initializeApp(firebaseConfig);
// const database = getMyDatabase();
// //export const database = getDatabase(app);


// export { database };
