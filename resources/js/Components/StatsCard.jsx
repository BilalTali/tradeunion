import { Link } from '@inertiajs/react';

export default function StatsCard({ title, value, subtitle, icon, color = 'blue', trend, href }) {
    const colorClasses = {
        blue: 'bg-blue-500 text-blue-100',
        green: 'bg-green-500 text-green-100',
        purple: 'bg-purple-500 text-purple-100',
        orange: 'bg-orange-500 text-orange-100',
        red: 'bg-red-500 text-red-100',
        indigo: 'bg-indigo-500 text-indigo-100',
    };

    const Card = () => (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">{title}</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                        {subtitle && (
                            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                        )}
                        {trend && (
                            <div className={`mt-2 flex items-center text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{trend.positive ? '↑' : '↓'} {trend.value}</span>
                                <span className="ml-2 text-gray-500">{trend.label}</span>
                            </div>
                        )}
                    </div>
                    <div className={`flex-shrink-0 ${colorClasses[color]} rounded-lg p-4`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );

    return href ? (
        <Link href={href} className="block">
            <Card />
        </Link>
    ) : (
        <Card />
    );
}
