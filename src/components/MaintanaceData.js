import { faker } from '@faker-js/faker';

const MAINTENANCE_TYPES = ["Routine", "Engine Check", "System Upgrade", "Emergency Repair"];
const PARTS_REPLACED = ["None", "Engine Part", "Landing Gear", "Avionics"];
const ENGINE_HEALTH = ["Good", "Fair", "Poor"];
const SYSTEM_CHECKS = ["Passed", "Minor Issues", "Major Issues"];
const SENSOR_READINGS = ["Normal", "Warnings", "Critical"];

export function generateMaintenanceHistory(flight_id) {
  const maintenanceDate = faker.date.past(1);
  const nextScheduledMaintenance = faker.date.future(0.5);
  const riskLevel = calculateRiskLevel(maintenanceDate);
  return {
    flightID: flight_id,
    maintenanceDate,
    maintenanceType: MAINTENANCE_TYPES[Math.floor(Math.random() * MAINTENANCE_TYPES.length)],
    partsReplaced: PARTS_REPLACED[Math.floor(Math.random() * PARTS_REPLACED.length)],
    nextScheduledMaintenance,
    riskLevel // risk level based on the time since the last maintenance.
  };
}

function calculateRiskLevel(maintenanceDate) {
  const daysSinceLast = (new Date() - maintenanceDate) / (1000 * 60 * 60 * 24);
  let riskLevel = (daysSinceLast / 365) * 100;

  const minRisk = 30;
  const maxRisk = 80;

  // return Math.min(riskLevel, 100);
  riskLevel = Math.min(Math.max(riskLevel, minRisk), maxRisk);
  
  return riskLevel;
}

export function generateFlightHealthConditions(flight_id) {
  return {
    flightID: flight_id,
    engineHealth: ENGINE_HEALTH[Math.floor(Math.random() * ENGINE_HEALTH.length)],
    systemChecks: SYSTEM_CHECKS[Math.floor(Math.random() * SYSTEM_CHECKS.length)],
    sensorReadings: SENSOR_READINGS[Math.floor(Math.random() * SENSOR_READINGS.length)]
  };
}
