import React from 'react';

interface CapacityBarProps {
  allocated: number; // (0-100)
  available: number; // (0-100)
}

const CapacityBar: React.FC<CapacityBarProps> = ({ allocated, available }) => {
  return (
    <div className="w-full bg-gray-200 rounded h-6 flex overflow-hidden">
      <div
        style={{ width: `${allocated}%` }}
        className="bg-red-500 h-full"
        title={`Allocated: ${allocated}%`}
      />
      <div
        style={{ width: `${available}%` }}
        className="bg-green-500 h-full"
        title={`Available: ${available}%`}
      />
    </div>
  );
};

export default CapacityBar;