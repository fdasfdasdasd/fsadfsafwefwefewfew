
import * as React from 'react';

// Map colors to prevent JIT issues
const CHART_COLORS: Record<string, any> = {
   emerald: { fill: 'fill-emerald-500', hover: 'group-hover:fill-emerald-400', text: 'text-emerald-500', stroke: 'text-emerald-500', dot: 'fill-emerald-200' },
   amber: { fill: 'fill-amber-500', hover: 'group-hover:fill-amber-400', text: 'text-amber-500', stroke: 'text-amber-500', dot: 'fill-amber-200' },
   cyan: { fill: 'fill-cyan-500', hover: 'group-hover:fill-cyan-400', text: 'text-cyan-500', stroke: 'text-cyan-500', dot: 'fill-cyan-200' },
   purple: { fill: 'fill-purple-500', hover: 'group-hover:fill-purple-400', text: 'text-purple-500', stroke: 'text-purple-500', dot: 'fill-purple-200' },
   rose: { fill: 'fill-rose-500', hover: 'group-hover:fill-rose-400', text: 'text-rose-500', stroke: 'text-rose-500', dot: 'fill-rose-200' },
   orange: { fill: 'fill-orange-500', hover: 'group-hover:fill-orange-400', text: 'text-orange-500', stroke: 'text-orange-500', dot: 'fill-orange-200' },
   pink: { fill: 'fill-pink-500', hover: 'group-hover:fill-pink-400', text: 'text-pink-500', stroke: 'text-pink-500', dot: 'fill-pink-200' },
};

interface BarChartProps {
  data: number[]; 
  labels: string[];
  maxVal?: number;
  color: string; 
}

export const BarChart: React.FC<BarChartProps> = ({ data, labels, maxVal = 6, color }) => {
  const height = 100;
  const width = 300;
  const barWidth = 20;
  // Prevent division by zero
  const spacing = data.length > 1 ? (width - (data.length * barWidth)) / (data.length - 1) : 0;
  const theme = CHART_COLORS[color] || CHART_COLORS['emerald'];

  return (
    <div className="w-full h-40 flex items-end justify-center">
      <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-full overflow-visible">
        {data.map((val, i) => {
          const barH = (val / Math.max(1, maxVal || 6)) * height;
          const x = data.length > 1 ? i * (barWidth + spacing) : width / 2 - barWidth / 2;
          
          return (
            <g key={i} className="group">
              {/* Bar */}
              <rect 
                x={x} 
                y={height - barH} 
                width={barWidth} 
                height={barH} 
                rx="6"
                className={`${theme.fill} transition-all duration-700 ease-out ${theme.hover}`}
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
                className="fill-gray-400 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
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
  if (!data || data.length < 2) return <div className="text-center text-gray-500 text-xs py-10 opacity-50">Not enough data to chart</div>;

  const width = 300;
  const height = 100;
  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.1;
  const range = Math.max(1, max - min);
  const theme = CHART_COLORS[color] || CHART_COLORS['emerald'];
  
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
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className={theme.text} />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" className={theme.text} />
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
           className={`${theme.stroke} drop-shadow-lg`}
           strokeLinecap="round"
           strokeLinejoin="round"
         />
         
         {/* Dots */}
         {data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * height;
            return (
              <circle key={i} cx={x} cy={y} r="3" className={theme.dot} />
            );
         })}
      </svg>
    </div>
  );
};
