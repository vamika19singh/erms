import React from 'react';

const EngineerList = ({ engineers }: { engineers: any[] }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-2 py-1">Name</th>
          <th className="border border-gray-300 px-2 py-1">Skills</th>
          <th className="border border-gray-300 px-2 py-1">Seniority</th>
          <th className="border border-gray-300 px-2 py-1">Capacity %</th>
        </tr>
      </thead>
      <tbody>
        {engineers.map(e => (
          <tr key={e._id} className="hover:bg-gray-50">
            <td className="border border-gray-300 px-2 py-1">{e.name}</td>
            <td className="border border-gray-300 px-2 py-1">
              {e.skills?.map((skill: string) => (
                <span
                  key={skill}
                  className="inline-block bg-blue-200 text-blue-800 rounded-full px-2 py-0.5 mr-1 text-sm"
                >
                  {skill}
                </span>
              ))}
            </td>
            <td className="border border-gray-300 px-2 py-1 capitalize">{e.seniority}</td>
            <td className="border border-gray-300 px-2 py-1">{e.maxCapacity}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EngineerList;