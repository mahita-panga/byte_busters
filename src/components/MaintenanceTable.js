// // MaintenanceTable.js
// import React from 'react';
// import MaintenanceRow from './MaintenanceRow';
// import { generateMaintenanceHistory } from './MaintanaceData';

// const maintenanceData = Array.from({ length: 10 }, (_, index) =>
//   generateMaintenanceHistory(index + 1)
// );

// const MaintenanceTable = () => {
//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>Flight ID</th>
//           <th>Maintenance Date</th>
//           <th>Maintenance Type</th>
//           <th>Parts Replaced</th>
//           <th>Next Scheduled Maintenance</th>
//           <th>Risk Level</th>
//         </tr>
//       </thead>
//       <tbody>
//         {maintenanceData.map((maintenance, index) => (
//           <MaintenanceRow key={index} maintenance={maintenance} />
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default MaintenanceTable;

// MaintenanceTable.js
import React from 'react';
import MaintenanceRow from './MaintenanceRow';
import { generateMaintenanceHistory } from './MaintanaceData';

const maintenanceData = Array.from({ length: 10 }, (_, index) =>
  generateMaintenanceHistory(index + 1)
).sort((a, b) => b.maintenanceDate - a.maintenanceDate); // Sort maintenance data by date

const MaintenanceTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Flight ID</th>
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
