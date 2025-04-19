import React, { useState } from 'react';
import { useEventListener } from '../hooks/useEventListener';

// Helper to create segmented bar
const Bar = ({ value, segments = 10, color = 'bg-white', bgColor = 'bg-white/20' }) => {
  const percentage = Math.max(0, Math.min(100, value));
  const filledSegments = Math.round((percentage / 100) * segments);

  return (
    <div className={`flex h-1.5 space-x-0.5 overflow-hidden rounded-sm ${bgColor}`}>
      {[...Array(segments)].map((_, i) => (
        <div
          key={i}
          className={`flex-1 ${i < filledSegments ? color : 'opacity-0'}`}
          style={{ transition: 'background-color 0.2s ease-out' }}
        />
      ))}
    </div>
  );
};

const Speedometer = () => {
  const [speed, setSpeed] = useState(0);
  const [gear, setGear] = useState('N');
  const [rpm, setRpm] = useState(0);
  const [fuel, setFuel] = useState(100);

  // Listen for NUI messages using the boilerplate hook
  useEventListener('message', (event) => {
    const data = event.data;

    if (data.type === 'updateVehicleData') {
      setSpeed(Math.round(data.speed));
      setGear(data.gear);
      setRpm(data.rpm);
      setFuel(data.fuel || 100);
    }
  });

  // Normalize RPM (0-1) and scale for display (0-100)
  const normalizedRpm = (rpm / 9000) * 100;
  const fuelLevel = fuel; // Already 0-100

  // Determine fuel bar color
  const fuelColor = fuelLevel <= 20 ? 'bg-red-500' : fuelLevel <= 50 ? 'bg-yellow-400' : 'bg-green-500';
  
  // Determine RPM bar color (redline effect)
  const rpmColor = normalizedRpm > 85 ? 'bg-red-500' : 'bg-white';

  return (
    <div className="flex w-full items-center justify-between space-x-3">
      {/* Left Side: Speed & Gear */}
      <div className="flex items-end space-x-1.5">
        <span className="text-3xl font-bold leading-none tracking-tight text-white" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
          {speed}
        </span>
        <span className="mb-0.5 text-xs font-medium text-white/80">
          MPH
        </span>
        <span className="mb-0.5 text-lg font-semibold text-white/90">
          {gear}
        </span>
      </div>

      {/* Right Side: Bars */}
      <div className="flex w-16 flex-col space-y-1.5">
        {/* RPM Bar */}
        <Bar value={normalizedRpm} segments={12} color={rpmColor} bgColor="bg-white/20"/>
        {/* Fuel Bar */}
        <Bar value={fuelLevel} segments={12} color={fuelColor} bgColor="bg-white/20"/>
      </div>
    </div>
  );
};

export default Speedometer; 