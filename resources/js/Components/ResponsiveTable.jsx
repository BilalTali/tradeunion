import React from 'react';

/**
 * Responsive Table Component
 * Renders traditional table on desktop, card-based layout on mobile
 * 
 * @param {Array} columns - Table column definitions [{key, label, render}]
 * @param {Array} data - Array of data objects
 * @param {Function} mobileCardRenderer - Custom renderer for mobile cards
 * @param {String} keyField - Unique identifier for each row (default: 'id')
 */
export default function ResponsiveTable({
    columns,
    data,
    mobileCardRenderer,
    keyField = 'id',
    className = ''
}) {
    return (
        <div className={className}>
            {/* Desktop: Traditional Table */}
            <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={column.key || index}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-12 text-center text-sm text-gray-500"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={row[keyField] || rowIndex} className="hover:bg-gray-50">
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={column.key || colIndex}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            {column.render ? column.render(row) : row[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile: Card-Based Layout */}
            <div className="md:hidden space-y-4">
                {data.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">No data available</p>
                    </div>
                ) : (
                    data.map((row, index) => (
                        <div key={row[keyField] || index}>
                            {mobileCardRenderer ? (
                                mobileCardRenderer(row)
                            ) : (
                                <DefaultMobileCard row={row} columns={columns} />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

/**
 * Default Mobile Card Renderer
 * Used when no custom renderer is provided
 */
function DefaultMobileCard({ row, columns }) {
    return (
        <div className="bg-white shadow rounded-lg p-4 space-y-3">
            {columns.map((column, index) => (
                <div key={column.key || index} className="flex justify-between items-start">
                    <dt className="text-sm font-medium text-gray-500 flex-shrink-0 w-1/3">
                        {column.label}
                    </dt>
                    <dd className="text-sm text-gray-900 text-right flex-1">
                        {column.render ? column.render(row) : row[column.key]}
                    </dd>
                </div>
            ))}
        </div>
    );
}
