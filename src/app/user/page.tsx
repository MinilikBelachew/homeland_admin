"use client"

import { database } from '../methods/firbase_config'; // Adjust the import path as needed
import { useEffect, useState } from 'react';
import { get, ref, update, remove } from 'firebase/database';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
// Adjust the import path as needed

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  frontImage: string;
  backImage: string;
}

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = ref(database, 'users');

      try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const usersData: User[] = Object.entries(snapshot.val()).map(([id, user]) => ({ id, ...user }));
          setUsers(usersData);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditOpen = (user: User) => {
    setEditUser(user);
    setOpen(true);
  };

  const handleEditClose = () => {
    setEditUser(null);
    setOpen(false);
  };

  const handleEditSave = async () => {
    if (editUser) {
      const userRef = ref(database, `users/${editUser.id}`);
      await update(userRef, editUser);
      setUsers(users.map(user => (user.id === editUser.id ? editUser : user)));
      handleEditClose();
    }
  };

  const handleDelete = (userId: string) => {
    setConfirmDelete(true);
    setUserIdToDelete(userId);
  };

  const handleConfirmDelete = async () => {
    if (userIdToDelete) {
      const userRef = ref(database, `users/${userIdToDelete}`);
      await remove(userRef);
      setUsers(users.filter(user => user.id !== userIdToDelete));
      setConfirmDelete(false);
      setUserIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setUserIdToDelete(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editUser) {
      setEditUser({ ...editUser, [e.target.name]: e.target.value });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  return (
    <DefaultLayout>
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Information</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">Front Image</th>
              <th className="py-2 px-4 border-b">Back Image</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.phone}</td>
                <td className="py-2 px-4 border-b">{user.address}</td>
                <td className="py-2 px-4 border-b">
                  <img className="w-16 h-16 object-cover" src={user.frontImage} alt={`${user.name}'s front`} />
                </td>
                <td className="py-2 px-4 border-b">
                  <img className="w-16 h-16 object-cover" src={user.backImage} alt={`${user.name}'s back`} />
                </td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleEditOpen(user)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="bg-red text-white px-2 py-1 rounded ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <input className="border p-2 w-full mb-4" type="text" name="name" value={editUser.name} onChange={handleChange} placeholder="Name" />
            <input className="border p-2 w-full mb-4" type="email" name="email" value={editUser.email} onChange={handleChange} placeholder="Email" />
            <input className="border p-2 w-full mb-4" type="text" name="phone" value={editUser.phone} onChange={handleChange} placeholder="Phone" />
            <input className="border p-2 w-full mb-4" type="text" name="address" value={editUser.address} onChange={handleChange} placeholder="Address" />
            <div className="flex justify-between">
              <button onClick={handleEditSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              <button onClick={handleEditClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this user?</h3>
            <p className="text-gray-700 mb-4">This action cannot be undone.</p>
            <div className="flex justify-between">
              <button onClick={handleConfirmDelete} className="bg-red text-white px-4 py-2 rounded">Delete</button>
              <button onClick={handleCancelDelete} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DefaultLayout>
  );
};

export default UserPage;

