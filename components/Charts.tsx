
import * as React from 'react';

// --- COMPONENTS ---

interface BarChartProps {
  data: number[]; // Array of values (e.g., [5, 6, 6, 5, 4, 6, 6])
  labels: string[]; // Array of labels (e.g., ["M", "T", "W", "T", "F", "S", "S"])
  maxVal?: number;
  color: string; // Tailwind color class prefix e.g. "emerald"
}

export const BarChart: React.FC<BarChartProps> = ({ data, labels, maxVal = 6, color }) => {
  const height = 100;
  const width = 300;
  const barWidth = 20;
  const spacing = (width - (data.length * barWidth)) / (data.length - 1);

  return (
    <div className="w-full h-40 flex items-end justify-center">
      <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-full overflow-visible">
        {data.map((val, i) => {
          const barH = (val / maxVal) * height;
          const x = i * (barWidth + spacing);
          return (
            <g key={i} className="group">
              {/* Bar */}
              <rect 
                x={x} 
                y={height - barH} 
                width={barWidth} 
                height={barH} 
                rx="6"
                className={`fill-${color}-500 transition-all duration-700 ease-out group-hover:fill-${color}-400`}
              >
                <animate attributeName="height" from="0" to={barH} dur="0.5s" />
                <animate attributeName="y" from={height} to={height - barH} dur="0.5s" />
              </rect>
              {/* Label */}
              <text 
                x={x + barWidth / 2} 
                y={height + 15} 
                textAnchor="middle" 
                className="fill-gray-500 text-[10px] font-bold"
              >
                {labels[i]}
              </text>
              {/* Value on Hover */}
              <text 
                x={x + barWidth / 2} 
                y={height - barH - 5} 
                textAnchor="middle" 
                className="fill-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {val}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

interface LineChartProps {
  data: number[];
  color: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, color }) => {
  if (data.length < 2) return <div className="text-center text-gray-500 text-xs py-10">Not enough data yet</div>;

  const width = 300;
  const height = 100;
  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.1;
  const range = max - min;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-32">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
         {/* Gradient Definition */}
         <defs>
            <linearGradient id={`grad-${color}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className={`text-${color}-500`} />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" className={`text-${color}-500`} />
            </linearGradient>
         </defs>

         {/* Area */}
         <path 
           d={`M0,${height} ${points.split(' ').map((p, i) => i === 0 ? `L${p}` : `L${p}`).join(' ')} L${width},${height} Z`} 
           fill={`url(#grad-${color})`} 
         />

         {/* Line */}
         <polyline 
           fill="none" 
           stroke="currentColor" 
           strokeWidth="3" 
           points={points} 
           className={`text-${color}-500 drop-shadow-lg`}
           strokeLinecap="round"
           strokeLinejoin="round"
         />
         
         {/* Dots */}
         {data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * height;
            return (
              <circle key={i} cx={x} cy={y} r="3" className={`fill-${color}-200`} />
            );
         })}
      </svg>
    </div>
  );
};
