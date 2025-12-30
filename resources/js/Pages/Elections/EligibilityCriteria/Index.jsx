import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function Index({
    auth,
    election,
    currentVotingCriteria,
    currentCandidacyCriteria,
    allZones,
    allDistricts,
    allDesignations,
    eligibleVotersPreview,
    eligibleCandidatesPreview
}) {
    const [activeTab, setActiveTab] = useState('voting');

    // Debug: Log what we received from backend



    // Determine route prefix (EC or admin)
    const getRoutePrefix = () => {
        // Check if user is accessing via EC portfolio route
        const currentPath = window.location.pathname;
        if (currentPath.includes('/election-commissioner/') || currentPath.includes('/chief-election-commissioner/')) {
            return `${election.level}.ec`;
        }
        // Otherwise use standard admin route
        return election.level;
    };

    const routePrefix = getRoutePrefix();

    // Helper function to convert null to empty string for form inputs
    const prepareFormData = (criteria) => {
        return {
            min_age: criteria?.min_age ?? '',
            max_age: criteria?.max_age ?? '',
            min_service_years: criteria?.min_service_years ?? '',
            min_union_years: criteria?.min_union_years ?? '',
            star_grade_min: criteria?.star_grade_min ?? '',
            star_grade_max: criteria?.star_grade_max ?? '',
            required_status: criteria?.required_status ?? [],
            required_designations: criteria?.required_designations ?? [],
            excluded_designations: criteria?.excluded_designations ?? [],
            require_leadership_position: criteria?.require_leadership_position ?? false,
            identity_verified_required: criteria?.identity_verified_required ?? false,
            specific_zones: criteria?.specific_zones ?? [],
            specific_districts: criteria?.specific_districts ?? [],
        };
    };

    // Voting criteria form
    const votingForm = useForm({
        criteria: prepareFormData(currentVotingCriteria)
    });

    // Candidacy criteria form
    const candidacyForm = useForm({
        criteria: prepareFormData(currentCandidacyCriteria)
    });

    const handleSaveVotingCriteria = (e) => {
        e.preventDefault();
        votingForm.put(route(`${routePrefix}.voting-criteria.update`, election.id), {
            onSuccess: () => {
                alert('Voting eligibility criteria updated successfully!');
            }
        });
    };

    const handleSaveCandidacyCriteria = (e) => {
        e.preventDefault();
        candidacyForm.put(route(`${routePrefix}.candidacy-criteria.update`, election.id), {
            onSuccess: () => {
                alert('Candidacy eligibility criteria updated successfully!');
            }
        });
    };

    const handleApplyCriteria = () => {
        if (confirm('This will populate delegates based on voting criteria. Continue?')) {
            router.post(route(`${routePrefix}.apply-criteria`, election.id));
        }
    };

    const activeForm = activeTab === 'voting' ? votingForm : candidacyForm;
    const handleSave = activeTab === 'voting' ? handleSaveVotingCriteria : handleSaveCandidacyCriteria;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Eligibility Criteria - {election.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Set rules for voting and candidacy eligibility
                    </p>
                </div>
            }
        >
            <Head title="Eligibility Criteria" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Tabs */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <button
                                    onClick={() => setActiveTab('voting')}
                                    className={`px-6 py-4 text-sm font-medium ${activeTab === 'voting'
                                        ? 'border-b-2 border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    🗳️ Voting Eligibility ({eligibleVotersPreview} eligible)
                                </button>
                                <button
                                    onClick={() => setActiveTab('candidacy')}
                                    className={`px-6 py-4 text-sm font-medium ${activeTab === 'candidacy'
                                        ? 'border-b-2 border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    📋 Candidacy Eligibility ({eligibleCandidatesPreview} eligible)
                                </button>
                            </nav>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleSave} className="p-6">
                            <div className="space-y-6">

                                {/* Age Criteria */}
                                <div className="border-b pb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Requirements</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Minimum Age (years)
                                            </label>
                                            <input
                                                type="number"
                                                min="18"
                                                max="100"
                                                value={activeForm.data.criteria.min_age || ''}
                                                onChange={(e) => activeForm.setData('criteria', {
                                                    ...activeForm.data.criteria,
                                                    min_age: e.target.value ? parseInt(e.target.value) : null
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                placeholder="e.g., 25"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Maximum Age (years)
                                            </label>
                                            <input
                                                type="number"
                                                min="18"
                                                max="100"
                                                value={activeForm.data.criteria.max_age || ''}
                                                onChange={(e) => activeForm.setData('criteria', {
                                                    ...activeForm.data.criteria,
                                                    max_age: e.target.value ? parseInt(e.target.value) : null
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                placeholder="e.g., 60"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Service & Union Years */}
                                <div className="border-b pb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience Requirements</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Minimum Service Years
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="50"
                                                value={activeForm.data.criteria.min_service_years || ''}
                                                onChange={(e) => activeForm.setData('criteria', {
                                                    ...activeForm.data.criteria,
                                                    min_service_years: e.target.value ? parseInt(e.target.value) : null
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                placeholder="e.g., 5"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Years since joining service</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Minimum Union Years
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="50"
                                                value={activeForm.data.criteria.min_union_years || ''}
                                                onChange={(e) => activeForm.setData('criteria', {
                                                    ...activeForm.data.criteria,
                                                    min_union_years: e.target.value ? parseInt(e.target.value) : null
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                placeholder="e.g., 2"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Years of union membership</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Star Grade */}
                                <div className="border-b pb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Star Grade</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Minimum Star Grade
                                            </label>
                                            <select
                                                value={activeForm.data.criteria.star_grade_min || ''}
                                                onChange={(e) => activeForm.setData('criteria', {
                                                    ...activeForm.data.criteria,
                                                    star_grade_min: e.target.value ? parseInt(e.target.value) : null
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="">No minimum</option>
                                                {[1, 2, 3, 4, 5].map(grade => (
                                                    <option key={grade} value={grade}>⭐ {grade} Star{grade > 1 ? 's' : ''}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Maximum Star Grade
                                            </label>
                                            <select
                                                value={activeForm.data.criteria.star_grade_max || ''}
                                                onChange={(e) => activeForm.setData('criteria', {
                                                    ...activeForm.data.criteria,
                                                    star_grade_max: e.target.value ? parseInt(e.target.value) : null
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="">No maximum</option>
                                                {[1, 2, 3, 4, 5].map(grade => (
                                                    <option key={grade} value={grade}>⭐ {grade} Star{grade > 1 ? 's' : ''}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Requirements */}
                                <div className="border-b pb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Requirements</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={activeForm.data.criteria.require_leadership_position || false}
                                                onChange={(e) => activeForm.setData('criteria', {
                                                    ...activeForm.data.criteria,
                                                    require_leadership_position: e.target.checked
                                                })}
                                                className="rounded border-gray-300 text-blue-600 mr-2"
                                            />
                                            <span className="text-sm text-gray-700">Require current leadership position</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={activeForm.data.criteria.identity_verified_required || false}
                                                onChange={(e) => activeForm.setData('criteria', {
                                                    ...activeForm.data.criteria,
                                                    identity_verified_required: e.target.checked
                                                })}
                                                className="rounded border-gray-300 text-blue-600 mr-2"
                                            />
                                            <span className="text-sm text-gray-700">Require identity verification</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-4">
                                    <div className="text-sm text-gray-600">
                                        {activeTab === 'voting' && (
                                            <p>✓ {eligibleVotersPreview} members meet current criteria</p>
                                        )}
                                        {activeTab === 'candidacy' && (
                                            <p>✓ {eligibleCandidatesPreview} members meet current criteria</p>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => router.visit(route(`${routePrefix}.elections.show`, election.id))}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={activeForm.processing}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                                        >
                                            {activeForm.processing ? 'Saving...' : 'Save Criteria'}
                                        </button>
                                        {activeTab === 'voting' && (
                                            <button
                                                type="button"
                                                onClick={handleApplyCriteria}
                                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            >
                                                Apply & Populate Delegates
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>

                    {/* View Eligible Members Link */}
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-blue-900">View Full Member List</p>
                                <p className="text-xs text-blue-700 mt-1">See all members with eligibility status</p>
                            </div>
                            <a
                                href={route(`${routePrefix}.eligible-members`, election.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            >
                                View Members →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
