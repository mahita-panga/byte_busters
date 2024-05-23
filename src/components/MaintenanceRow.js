// MaintenanceRow.js
import React from 'react';

const MaintenanceRow = ({ maintenance }) => {
  const {
    flightID,
    maintenanceDate,
    maintenanceType,
    partsReplaced,
    nextScheduledMaintenance,
    riskLevel,
  } = maintenance;

  return (
    <tr>
      <td>{flightID}</td>
      <td>{maintenanceDate.toLocaleDateString()}</td>
      <td>{maintenanceType}</td>
      <td>{partsReplaced}</td>
      <td>{nextScheduledMaintenance.toLocaleDateString()}</td>
      <td>{riskLevel.toFixed(2)}</td>
    </tr>
  );
};

export default MaintenanceRow;
