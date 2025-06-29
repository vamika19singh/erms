import React, { useEffect, useState } from 'react';
import api from '../api';
import EngineerList from '../components/EngineerList';

const ManagerDashboard = () => {
  const [engineers, setEngineers] = useState([]);

  useEffect(() => {
    api.get('/engineers').then(res => setEngineers(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manager Dashboard</h2>
      <EngineerList engineers={engineers} />
      {/* You can add more manager features here */}
    </div>
  );
};

export default ManagerDashboard;