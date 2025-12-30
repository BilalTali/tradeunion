import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

import { usePage } from '@inertiajs/react';

export default function DashboardCharts({ charts, role }) {
    if (!charts) return null;

    const { props } = usePage();
    const theme = props.office_profile?.theme_preferences || {};

    // Dynamic Chart Colors
    const primaryColor = theme.chart_primary || theme.primary_button || '#4F46E5'; // Default indigo
    const chartColors = theme.chart_colors || ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

    const COLORS = chartColors;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Member Growth Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Member Growth Trend</h3>
                    <p className="text-sm text-gray-500">New registrations over last 6 months</p>
                </div>
                <div className="h-72 min-h-[288px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={charts.memberGrowth}>
                            <defs>
                                <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                cursor={{ stroke: '#4F46E5', strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="members"
                                stroke={primaryColor}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorMembers)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Distribution Chart (Bar or Pie depending on data) */}
            {charts.distribution && charts.distribution.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800">{charts.distributionLabel}</h3>
                        <p className="text-sm text-gray-500">Breakdown of active members</p>
                    </div>
                    <div className="h-72 min-h-[288px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.distribution} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {charts.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
