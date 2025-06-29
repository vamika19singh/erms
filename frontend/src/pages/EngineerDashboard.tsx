import React, { useEffect, useState } from 'react';
import api from '../api';

const EngineerDashboard = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    api.get('/assignments?engineerId=me') // maybe backend supports this, else get user id
       .then(res => setAssignments(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Assignments</h2>
      {assignments.length === 0 && <p>No assignments yet.</p>}
      <ul>
        {assignments.map((a: any) => (
          <li key={a._id} className="border p-2 mb-2 rounded">
            <strong>{a.projectId.name}</strong> - {a.allocationPercentage}%, Role: {a.role}
            <br />
            {new Date(a.startDate).toLocaleDateString()} - {new Date(a.endDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EngineerDashboard;