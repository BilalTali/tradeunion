import { useState, useEffect } from 'react';

export default function ResolutionSelector({
    requiredType,
    requiredCategory,
    targetValidation = {},
    value,
    onChange,
    error,
    label = "Select Approved Resolution"
}) {
    const [resolutions, setResolutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedResolution, setSelectedResolution] = useState(null);

    useEffect(() => {
        fetchEligibleResolutions();
    }, [requiredType, requiredCategory, JSON.stringify(targetValidation)]);

    const fetchEligibleResolutions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                type: requiredType,
                category: requiredCategory,
                target: JSON.stringify(targetValidation)
            });

            const response = await fetch(`/api/resolutions/eligible?${params}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch resolutions');
            }

            const data = await response.json();
            setResolutions(data.resolutions || []);

            // If a value is already set, find and set that resolution
            if (value && data.resolutions) {
                const existing = data.resolutions.find(r => r.id == value);
                if (existing) {
                    setSelectedResolution(existing);
                }
            }
        } catch (err) {

            setResolutions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (e) => {
        const resolutionId = e.target.value;
        const resolution = resolutions.find(r => r.id == resolutionId);
        setSelectedResolution(resolution || null);
        onChange(resolutionId);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                {label} <span className="text-red-500">*</span>
            </label>

            {loading ? (
                <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Loading eligible resolutions...</span>
                </div>
            ) : resolutions.length === 0 ? (
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                    <div className="flex">
                        <svg className="h-5 w-5 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-800">No Eligible Resolutions Found</p>
                            <p className="mt-1 text-xs text-yellow-700">
                                You must first create and approve a resolution of type <strong className="font-semibold">{requiredType}</strong> with category <strong className="font-semibold">{requiredCategory.replace(/_/g, ' ')}</strong> before executing this action.
                            </p>
                            <p className="mt-2 text-xs text-yellow-700">
                                <strong>Next steps:</strong>
                            </p>
                            <ol className="list-decimal ml-5 mt-1 text-xs text-yellow-700 space-y-1">
                                <li>Go to Resolutions → Create</li>
                                <li>Select the appropriate committee</li>
                                <li>Choose type: <strong>{requiredType}</strong></li>
                                <li>Choose category: <strong>{requiredCategory.replace(/_/g, ' ')}</strong></li>
                                <li>Complete proposal and submit</li>
                                <li>Committee votes and approves</li>
                                <li>Return here to execute</li>
                            </ol>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <select
                        value={value || ''}
                        onChange={handleSelect}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                        required
                    >
                        <option value="">Choose a resolution...</option>
                        {resolutions.map((resolution) => (
                            <option key={resolution.id} value={resolution.id}>
                                {resolution.resolution_number} - {resolution.title}
                            </option>
                        ))}
                    </select>

                    <p className="text-xs text-gray-500">
                        Found {resolutions.length} eligible resolution{resolutions.length !== 1 ? 's' : ''} for this action
                    </p>

                    {selectedResolution && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Resolution Details
                            </h4>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-800">
                                <div>
                                    <dt className="font-medium text-blue-700">Number</dt>
                                    <dd className="font-mono">{selectedResolution.resolution_number}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-blue-700">Status</dt>
                                    <dd className="capitalize">{selectedResolution.status}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-blue-700">Committee</dt>
                                    <dd>{selectedResolution.committee?.name || 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-blue-700">Passed On</dt>
                                    <dd>{selectedResolution.voting_closed_at ? new Date(selectedResolution.voting_closed_at).toLocaleDateString() : 'N/A'}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="font-medium text-blue-700">Voting Results</dt>
                                    <dd className="flex items-center gap-4 mt-1">
                                        <span className="inline-flex items-center text-green-700">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            For: {selectedResolution.votes_for}
                                        </span>
                                        <span className="inline-flex items-center text-red-700">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            Against: {selectedResolution.votes_against}
                                        </span>
                                        <span className="inline-flex items-center text-gray-600">
                                            Abstain: {selectedResolution.votes_abstain}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    )}
                </>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}
