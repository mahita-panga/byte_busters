import React from 'react';
import MaintenanceRow from './MaintenanceRow';
import { generateMaintenanceHistory } from './MaintanaceData';

const MaintenanceTable = ({flightNumber}) => {

  const maintenance = generateMaintenanceHistory(flightNumber);

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
      

<MaintenanceRow maintenance={maintenance} />
      </tbody>
    </table>
  );
};

export default MaintenanceTable;
