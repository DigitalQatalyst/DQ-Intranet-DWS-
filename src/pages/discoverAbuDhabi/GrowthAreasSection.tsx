import React, { useEffect, useState, useRef } from 'react';
import SectorCard from './SectorCard';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from 'recharts';
import {
    TrendingUpIcon,
    ZapIcon,
    DatabaseIcon,
    GlobeIcon,
    ShoppingBagIcon,
    HeartIcon,
    ArrowRightIcon,
    CheckIcon,
} from 'lucide-react';
const sectorData = [
    {
        name: 'Technology',
        value: 85,
        previousValue: 70,
    },
    {
        name: 'Energy',
        value: 72,
        previousValue: 65,
    },
    {
        name: 'Finance',
        value: 68,
        previousValue: 61,
    },
    {
        name: 'Tourism',
        value: 60,
        previousValue: 48,
    },
    {
        name: 'Retail',
        value: 55,
        previousValue: 50,
    },
    {
        name: 'Healthcare',
        value: 50,
        previousValue: 42,
    },
];
const GrowthAreasSection = () => {
    const sectionRef = useRef(null);
    const chartRef = useRef(null);
    const [activeChartIndex, setActiveChartIndex] = useState(null);
    const [showComparison, setShowComparison] = useState(false);
    useEffect(() => {
        const sectionObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                }
            },
            {
                threshold: 0.1,
            },
        );
        const chartObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'scale-100');
                }
            },
            {
                threshold: 0.1,
            },
        );
        if (sectionRef.current) {
            sectionObserver.observe(sectionRef.current);
        }
        if (chartRef.current) {
            chartObserver.observe(chartRef.current);
        }
        return () => {
            if (sectionRef.current) {
                sectionObserver.unobserve(sectionRef.current);
            }
            if (chartRef.current) {
                chartObserver.unobserve(chartRef.current);
            }
        };
    }, []);
    const technologyDetails = (
        <div>
            <h4 className="font-display text-lg font-bold mb-4">Key Opportunities</h4>
            <ul className="space-y-3">
                <li className="flex">
                    <CheckIcon
                        size={18}
                        className="text-primary mr-3 mt-1 flex-shrink-0"
                    />
                    <span>AI and Machine Learning research partnerships with MBZUAI</span>
                </li>
                <li className="flex">
                    <CheckIcon
                        size={18}
                        className="text-primary mr-3 mt-1 flex-shrink-0"
                    />
                    <span>
                        Hub71 startup ecosystem with global connections and funding
                    </span>
                </li>
                <li className="flex">
                    <CheckIcon
                        size={18}
                        className="text-primary mr-3 mt-1 flex-shrink-0"
                    />
                    <span>Smart City initiatives with government backing</span>
                </li>
            </ul>
            <a
                href="#"
                className="inline-flex items-center text-primary font-medium mt-4 hover:underline"
            >
                View Technology Sector Report
                <ArrowRightIcon size={16} className="ml-2" />
            </a>
        </div>
    );
    const energyDetails = (
        <div>
            <h4 className="font-display text-lg font-bold mb-4">Key Opportunities</h4>
            <ul className="space-y-3">
                <li className="flex">
                    <CheckIcon size={18} className="text-teal mr-3 mt-1 flex-shrink-0" />
                    <span>Masdar City clean technology partnerships</span>
                </li>
                <li className="flex">
                    <CheckIcon size={18} className="text-teal mr-3 mt-1 flex-shrink-0" />
                    <span>Solar energy development with IRENA headquarters</span>
                </li>
                <li className="flex">
                    <CheckIcon size={18} className="text-teal mr-3 mt-1 flex-shrink-0" />
                    <span>
                        Energy transition consulting for traditional energy companies
                    </span>
                </li>
            </ul>
            <a
                href="#"
                className="inline-flex items-center text-teal font-medium mt-4 hover:underline"
            >
                View Energy Sector Report
                <ArrowRightIcon size={16} className="ml-2" />
            </a>
        </div>
    );
    const financeDetails = (
        <div>
            <h4 className="font-display text-lg font-bold mb-4">Key Opportunities</h4>
            <ul className="space-y-3">
                <li className="flex">
                    <CheckIcon
                        size={18}
                        className="text-purple mr-3 mt-1 flex-shrink-0"
                    />
                    <span>
                        Abu Dhabi Global Market (ADGM) financial services licensing
                    </span>
                </li>
                <li className="flex">
                    <CheckIcon
                        size={18}
                        className="text-purple mr-3 mt-1 flex-shrink-0"
                    />
                    <span>Sovereign wealth fund partnerships with ADIA</span>
                </li>
                <li className="flex">
                    <CheckIcon
                        size={18}
                        className="text-purple mr-3 mt-1 flex-shrink-0"
                    />
                    <span>Islamic Finance innovation hub</span>
                </li>
            </ul>
            <a
                href="#"
                className="inline-flex items-center text-purple font-medium mt-4 hover:underline"
            >
                View Finance Sector Report
                <ArrowRightIcon size={16} className="ml-2" />
            </a>
        </div>
    );
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
                    <p className="font-display font-bold text-gray-800">{label}</p>
                    {payload.map((entry, index) => (
                        <p
                            key={index}
                            className="font-body text-sm"
                            style={{
                                color: entry.color,
                            }}
                        >
                            {entry.name === 'value' ? 'Current: ' : 'Previous Year: '}
                            <span className="font-medium">{entry.value} points</span>
                        </p>
                    ))}
                    {payload[0].payload.value > payload[0].payload.previousValue && (
                        <p className="text-green-600 text-xs mt-1 font-medium">
                            ↑{' '}
                            {(
                                ((payload[0].payload.value - payload[0].payload.previousValue) /
                                    payload[0].payload.previousValue) *
                                100
                            ).toFixed(1)}
                            % growth
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };
    return (
        <section
            id="growth-areas"
            ref={sectionRef}
            className="py-28 px-6 md:px-12 bg-gray-50 opacity-0 -translate-y-4 transition-all duration-1000"
        >
            <div className="container mx-auto">
                <div className="text-center mb-20">
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Growth Areas
                    </h2>
                    <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Abu Dhabi offers exceptional opportunities across diverse sectors,
                        each supported by strategic initiatives and investment.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    <SectorCard
                        title="Technology"
                        description="Leading innovation hub for AI, fintech, and digital transformation with world-class infrastructure."
                        icon={<TrendingUpIcon size={28} className="text-primary" />}
                        growth="12.5%"
                        investment="$10B+"
                        color="bg-primary"
                        detailsContent={technologyDetails}
                    />
                    <SectorCard
                        title="Energy"
                        description="Pioneering sustainable energy solutions while leveraging traditional energy expertise."
                        icon={<ZapIcon size={28} className="text-teal" />}
                        growth="8.3%"
                        investment="$15B+"
                        color="bg-teal"
                        detailsContent={energyDetails}
                    />
                    <SectorCard
                        title="Finance"
                        description="International financial center with progressive regulatory frameworks and global connections."
                        icon={<DatabaseIcon size={28} className="text-purple" />}
                        growth="7.2%"
                        investment="$8B+"
                        color="bg-purple"
                        detailsContent={financeDetails}
                    />
                    <SectorCard
                        title="Tourism"
                        description="Luxury destination blending cultural heritage with modern attractions and world-class hospitality."
                        icon={<GlobeIcon size={28} className="text-primary-light" />}
                        growth="9.5%"
                        investment="$12B+"
                        color="bg-primary-light"
                    />
                    <SectorCard
                        title="Retail"
                        description="Premium shopping destination with innovative retail concepts and digital marketplace growth."
                        icon={<ShoppingBagIcon size={28} className="text-teal-light" />}
                        growth="6.8%"
                        investment="$5B+"
                        color="bg-teal-light"
                    />
                    <SectorCard
                        title="Healthcare"
                        description="Expanding medical tourism and healthcare innovation with state-of-the-art facilities."
                        icon={<HeartIcon size={28} className="text-purple-light" />}
                        growth="10.2%"
                        investment="$7B+"
                        color="bg-purple-light"
                    />
                </div>
                <div
                    ref={chartRef}
                    className="bg-white rounded-xl shadow-lg p-10 opacity-0 scale-95 transition-all duration-1000 delay-300"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <h3 className="font-display text-3xl font-bold tracking-tight">
                            Sector Growth Potential
                        </h3>
                        <div className="mt-4 md:mt-0 flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <span className="mr-2 text-gray-600 font-body">
                                    Show Year-over-Year Comparison
                                </span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={showComparison}
                                        onChange={() => setShowComparison(!showComparison)}
                                    />
                                    <div
                                        className={`block w-14 h-8 rounded-full ${showComparison ? 'bg-primary' : 'bg-gray-300'} transition-colors`}
                                    ></div>
                                    <div
                                        className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${showComparison ? 'transform translate-x-6' : ''}`}
                                    ></div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={sectorData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 50,
                                }}
                                onMouseMove={(data) => {
                                    if (data && data.activeTooltipIndex !== undefined) {
                                        setActiveChartIndex(data.activeTooltipIndex);
                                    }
                                }}
                                onMouseLeave={() => setActiveChartIndex(null)}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{
                                        fill: '#6B7280',
                                        fontFamily: 'Helvetica Neue',
                                        fontSize: 14,
                                    }}
                                    axisLine={{
                                        stroke: '#E5E7EB',
                                    }}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{
                                        fill: '#6B7280',
                                        fontFamily: 'Helvetica Neue',
                                        fontSize: 14,
                                    }}
                                    axisLine={{
                                        stroke: '#E5E7EB',
                                    }}
                                    tickLine={false}
                                    domain={[0, 100]}
                                    label={{
                                        value: 'Growth Index',
                                        angle: -90,
                                        position: 'insideLeft',
                                        style: {
                                            textAnchor: 'middle',
                                            fill: '#6B7280',
                                            fontFamily: 'Helvetica Neue',
                                            fontSize: 14,
                                        },
                                        dy: -40,
                                    }}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{
                                        fill: 'rgba(0, 48, 227, 0.05)',
                                    }}
                                />
                                {showComparison && (
                                    <Bar
                                        dataKey="previousValue"
                                        fill="#99B2FF"
                                        name="Previous Year"
                                        radius={[6, 6, 0, 0]}
                                        barSize={50}
                                        animationDuration={1500}
                                    />
                                )}
                                <Bar
                                    dataKey="value"
                                    fill="#0030E3"
                                    name="Current"
                                    radius={[6, 6, 0, 0]}
                                    barSize={showComparison ? 25 : 50}
                                    animationDuration={1500}
                                />
                                {showComparison && (
                                    <Legend
                                        wrapperStyle={{
                                            paddingTop: '20px',
                                        }}
                                    />
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 text-center">
                        <button
                            className="px-6 py-3 bg-white border-2 border-primary text-primary font-body font-medium rounded-lg hover:bg-primary  transition-colors"
                            onClick={() => {
                                // Scroll to directory section
                                const directorySection = document.getElementById('directory');
                                if (directorySection) {
                                    directorySection.scrollIntoView({
                                        behavior: 'smooth',
                                    });
                                }
                            }}
                        >
                            Explore Business Directory
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default GrowthAreasSection;
