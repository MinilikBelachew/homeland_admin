"use client"
import { database, storage, auth } from "@/app/methods/firbase_config"; // Adjust the import path as needed
import { useState, useEffect, ChangeEvent } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
// Adjust the import path as needed
import { ref, get, update } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

interface ProfileData {
  name: string;
  phoneNumber: string;
  email: string;
  profileImage: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    phoneNumber: "",
    email: "",
    profileImage: "" // Default profile image will be set dynamically
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchProfileData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProfileData = async (uid: string) => {
    const dbRef = ref(database, `admins/${uid}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setProfileData(snapshot.val());
    } else {
      console.log("No data available");
    }
  };
  
  const handleProfileImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userId) {
      try {
        const storageReference = storageRef(storage, `profileImages/${userId}/${file.name}`);
        await uploadBytes(storageReference, file);
        const downloadURL = await getDownloadURL(storageReference);
        setProfileData((prevData) => ({ ...prevData, profileImage: downloadURL }));
      } catch (error: any) { // Specify 'error: any' to explicitly type the 'error' variable
        console.error("Error uploading image:", error.message);
      }
    }
  };
  

  // const handleProfileImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file && userId) {
  //     try {
  //       const storageReference = storageRef(storage, `profileImages/${userId}/${file.name}`);
  //       await uploadBytes(storageReference, file);
  //       const downloadURL = await getDownloadURL(storageReference);
  //       setProfileData((prevData) => ({ ...prevData, profileImage: downloadURL }));
  //     } catch (error) {
  //       console.error("Error uploading image:", error.message);
  //     }
  //   }
  // };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    if (userId) {
      await update(ref(database, `admins/${userId}`), profileData);
      setIsEditing(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="Profile" />
        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="px-4 py-10 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden bg-gray-200">
              <Image
                src={profileData.profileImage || "/images/user/user-06.png"} // Use default image if profile image is not available
                layout="fill"
                objectFit="cover"
                alt="profile"
              />
              {isEditing && (
                <label
                  htmlFor="profile"
                  className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-6 sm:right-6"
                >
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>
              </svg>
              
                  <input
                    type="file"
                    name="profile"
                    id="profile"
                    className="sr-only"
                    onChange={handleProfileImageChange}
                  />
                </label>
              )}
            </div>
            <div className="mt-4">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="border-none bg-transparent text-center focus:outline-none mb-2 text-2xl font-semibold text-black dark:text-white"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleInputChange}
                    className="border-none bg-transparent text-center focus:outline-none mb-2 font-medium"
                    placeholder="Phone Number"
                  />
                  <input
                    type="text"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="border-none bg-transparent text-center focus:outline-none mb-2 font-medium"
                    placeholder="Email"
                  />
                  <button
                    onClick={handleSave}
                    className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-80"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
   <div className="flex flex-col items-center">
  <div className="flex items-center mb-1.5">
    <span className="text-xl font-semibold text-black dark:text-white mr-2">Name:</span>
    <span>{profileData.name}</span>
  </div>
  <div className="flex items-center mb-1.5">
    <span className="text-xl font-semibold text-black dark:text-white mr-2">Phone Number:</span>
    <span>{profileData.phoneNumber}</span>
  </div>
  <div className="flex items-center">
    <span className="text-xl font-semibold text-black dark:text-white mr-2">Email:</span>
    <span>{profileData.email}</span>
  </div>
</div>

                  <button
                    onClick={toggleEdit}
                    className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-80"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;



// "use client"
// import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
// import { ref as databaseRef, get, update } from "firebase/database";
// import { useState, useEffect, ChangeEvent } from "react";
// import { auth, storage, database } from "@/app/methods/firbase_config";

// type UserData = {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   profileImageUrl: string;
// };

// const Profile = () => {
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [editMode, setEditMode] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [profileImageUrl, setProfileImageUrl] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const user = auth.currentUser;
//         if (user) {
//           const uid = user.uid;
//           const userRef = databaseRef(database, `admins/${uid}`);
//           const snapshot = await get(userRef);
//           const data = snapshot.val();
//           if (data) {
//             setUserData(data);
//             setName(data.name);
//             setEmail(data.email);
//             setPhoneNumber(data.phoneNumber);
//             setProfileImageUrl(data.profileImageUrl);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleEdit = () => {
//     setEditMode(true);
//   };

//   const handleSave = async () => {
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         const uid = user.uid;
//         const userRef = databaseRef(database, `admins/${uid}`);
        
//         // If there's a new image file, upload it and get the URL
//         let newProfileImageUrl = profileImageUrl;
//         if (imageFile) {
//           const storageReference = storageRef(storage, `profileImages/${uid}/${imageFile.name}`);
//           await uploadBytes(storageReference, imageFile);
//           newProfileImageUrl = await getDownloadURL(storageReference);
//           setProfileImageUrl(newProfileImageUrl);
//         }

//         await update(userRef, {
//           name,
//           email,
//           phoneNumber,
//           profileImageUrl: newProfileImageUrl
//         });
//         setEditMode(false);
//         setUserData({ name, email, phoneNumber, profileImageUrl: newProfileImageUrl }); // Update local state
//       }
//     } catch (error) {
//       console.error("Error saving user data:", error);
//     }
//   };

//   const handleProfileImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImageFile(file);
//   };

//   if (!userData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Profile</h1>
//       <div>
//         <img src={profileImageUrl} alt="Profile" width={200} />
//         {editMode ? (
//           <div>
//             <input type="file" onChange={handleProfileImageUpload} />
//             <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
//             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
//             <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
//             <button onClick={handleSave}>Save</button>
//           </div>
//         ) : (
//           <div>
//             <p>Name: {userData.name}</p>
//             <p>Email: {userData.email}</p>
//             <p>Phone Number: {userData.phoneNumber}</p>
//             <button onClick={handleEdit}>Edit</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;
