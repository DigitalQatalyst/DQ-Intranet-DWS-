import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  Cell,
} from "recharts";

interface ChartDataPoint {
  name: string;
  value: number;
  previousValue: number;
}

interface GrowthAreasChartProps {
  chartData: ChartDataPoint[];
  showComparison: boolean;
  onHoverChange: (hoveredBar: string | null) => void;
  hoveredBar: string | null;
}

const GrowthAreasChart: React.FC<GrowthAreasChartProps> = ({
  chartData,
  showComparison,
  onHoverChange,
  hoveredBar,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full" style={{ height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 20, left: 0, bottom: isMobile ? 70 : 50 }}
          barCategoryGap="18%"
          onMouseMove={(state: any) => {
            if (state.activeTooltipIndex !== undefined) {
              onHoverChange(chartData[state.activeTooltipIndex]?.name || null);
            }
          }}
          onMouseLeave={() => onHoverChange(null)}
        >
          <CartesianGrid
            strokeDasharray="0"
            stroke="#E9EDF5"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748B', fontSize: isMobile ? 11 : 13, fontWeight: 500 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            interval={0}
            angle={isMobile ? -30 : 0}
            textAnchor={isMobile ? 'end' : 'middle'}
            height={isMobile ? 70 : 50}
          />
          <YAxis
            label={{
              value: 'Growth Index',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#94A3B8', fontSize: 12, fontWeight: 500 },
            }}
            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            cursor={{ fill: 'rgba(20, 71, 255, 0.04)' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
                  <div className="text-[#0E1446] font-semibold text-sm mb-1">
                    {payload[0].payload.name}
                  </div>
                  {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-neutral-600">
                        {entry.name === 'value' ? 'Current' : 'Previous'}:
                      </span>
                      <span className="font-semibold text-neutral-900">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          
          {/* Legend - only show Previous when toggle is ON */}
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => {
              if (value === 'value') return 'Current';
              if (value === 'previousValue') return 'Previous Year';
              return value;
            }}
            content={({ payload }) => {
              if (!payload) return null;
              const items = showComparison 
                ? payload 
                : payload.filter((item: any) => item.dataKey === 'value');
              
              return (
                <div className="flex items-center justify-center gap-6 mt-4">
                  {items.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs md:text-[13px] font-medium text-neutral-700">
                        {entry.dataKey === 'value' ? 'Current' : 'Previous Year'}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          
          {/* Previous Year Bars - animated in when toggle is ON */}
          {showComparison && (
            <Bar
              dataKey="previousValue"
              fill="#131E42"
              radius={[6, 6, 0, 0]}
              barSize={24}
              animationDuration={600}
              animationBegin={0}
            />
          )}
          
          {/* Current Year Bars */}
          <Bar
            dataKey="value"
            fill="#131E42"
            radius={[6, 6, 0, 0]}
            barSize={24}
            animationDuration={600}
            animationBegin={0}
          >
            {chartData.map((entry, index) => {
              const cellOpacity = hoveredBar
                ? entry.name === hoveredBar
                  ? 0.85
                  : 1
                : 1;
              return (
                <Cell
                  key={`current-bar-${entry.name}-${index}`}
                  opacity={cellOpacity}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthAreasChart;

