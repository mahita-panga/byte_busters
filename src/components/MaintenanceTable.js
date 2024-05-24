import React from 'react';
import MaintenanceRow from './MaintenanceRow';
import { generateMaintenanceHistory } from './MaintanaceData';

const maintenanceData = Array.from({ length: 1 }, (_, index) =>
  generateMaintenanceHistory(index + 1)
).sort((a, b) => b.maintenanceDate - a.maintenanceDate); 

const MaintenanceTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Flight No.</th>
          <th>Maintenance Date</th>
          <th>Maintenance Type</th>
          <th>Parts Replaced</th>
          <th>Next Scheduled Maintenance</th>
          <th>Risk Level</th>
        </tr>
      </thead>
      <tbody>
        {maintenanceData.map((maintenance, index) => (
          <MaintenanceRow key={index} maintenance={maintenance} />
        ))}
      </tbody>
    </table>
  );
};

export default MaintenanceTable;
