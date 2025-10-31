import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'recharts';
import { ArrowRight } from 'lucide-react';

export interface InsightDataPoint {
  name: string;
  value: number;
  previousValue?: number;
}

interface WorkspaceInsightsProps {
  data: InsightDataPoint[];
  yoyData?: InsightDataPoint[];
  loading?: boolean;
}

// Shorten labels for mobile
const shortenLabel = (label: string, isMobile: boolean): string => {
  if (!isMobile) return label;
  const shortMap: Record<string, string> = {
    'Learning Progress': 'Learning',
    'Project Completion': 'Projects',
    'Collaboration Index': 'Collab',
    'Support Closed': 'Support',
    'Innovation Launches': 'Innovation',
  };
  return shortMap[label] || label;
};

export const WorkspaceInsights: React.FC<WorkspaceInsightsProps> = ({ 
  data, 
  yoyData,
  loading = false 
}) => {
  const [showComparison, setShowComparison] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect mobile on mount
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoize merged data
  const chartData = useMemo(() => {
    if (showComparison && yoyData) {
      return data.map((item, index) => ({
        ...item,
        name: shortenLabel(item.name, isMobile),
        previousValue: yoyData[index]?.previousValue || item.previousValue || 0,
      }));
    }
    return data.map(item => ({
      ...item,
      name: shortenLabel(item.name, isMobile),
    }));
  }, [data, yoyData, showComparison, isMobile]);

  return (
    <section
      id="insights"
      className="bg-[#F8FAFC] py-16 md:py-24"
      aria-labelledby="insights-heading"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* White Card Container */}
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(14,20,70,0.08)] border border-neutral-200 p-8 md:p-10">
          
          {loading ? (
            /* Skeleton State */
            <div className="animate-pulse">
              <div className="flex items-baseline justify-between mb-10">
                <div className="h-10 bg-gray-200 rounded w-80"></div>
                <div className="h-6 bg-gray-200 rounded w-64"></div>
              </div>
              <div className="h-96 bg-gray-100 rounded-lg"></div>
              <div className="mt-10 flex justify-center">
                <div className="h-12 bg-gray-200 rounded-full w-48"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Header with Title and Toggle - Baseline Aligned */}
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 mb-8 md:mb-10">
            <div>
              <h2
                id="insights-heading"
                className="text-3xl md:text-4xl font-bold tracking-tight text-[#0E1446] leading-none"
              >
                DQ DNA Growth Potential
              </h2>
              <p className="text-neutral-600 mt-3 text-sm md:text-base">
                Data-driven signals of how DQ teams learn, deliver, and collaborate across the seven DNA dimensions...
              </p>
            </div>

                {/* iOS-style Toggle */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <label
                    htmlFor="yoy-toggle"
                    className="text-sm font-medium text-neutral-700 cursor-pointer select-none whitespace-nowrap"
                  >
                    Show Year-over-Year
                  </label>
                  <button
                    id="yoy-toggle"
                    role="switch"
                    aria-checked={showComparison}
                    aria-label="Toggle year-over-year comparison"
                    onClick={() => setShowComparison(!showComparison)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1447FF] focus-visible:ring-offset-2 ${
                      showComparison ? 'bg-[#1447FF]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                        showComparison ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Chart */}
              <div className="w-full" style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 30, right: 20, left: 0, bottom: isMobile ? 70 : 50 }}
                    barCategoryGap="18%"
                    onMouseMove={(state: any) => {
                      if (state.activeTooltipIndex !== undefined) {
                        setHoveredBar(chartData[state.activeTooltipIndex]?.name || null);
                      }
                    }}
                    onMouseLeave={() => setHoveredBar(null)}
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

              {/* Footer CTA */}
              <div className="text-center mt-6 pt-6 border-t border-neutral-100">
                <button
                  onClick={() => navigate('/marketplace/growth-areas')}
                  className="dws-btn-primary inline-flex items-center gap-2"
                  aria-label="Explore Growth Sectors"
                >
                  Explore Growth Sectors
                  <ArrowRight size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkspaceInsights;
