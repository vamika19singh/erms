import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout, name, role } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">Engineering Resource Management</div>
      {token && (
        <div>
          <span className="mr-4">Hello, {name} ({role})</span>
          <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;