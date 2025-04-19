import React from 'react';
import { useNui } from './providers/NuiProvider';
import Speedometer from './components/Speedometer';

const App = () => {
  const { visible } = useNui();

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-8 mx-auto w-44 select-none">
      <div className="relative flex flex-col items-center justify-center rounded-xl bg-black/70 p-2.5 text-white shadow-xl border border-white/10">
        <Speedometer />
      </div>
    </div>
  );
};

export default App; 