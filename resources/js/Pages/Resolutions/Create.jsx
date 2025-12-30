import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Create({ committees }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const getRolePrefix = () => {
        if (userRole === 'super_admin' || userRole.includes('state')) return 'state';
        if (userRole.includes('district')) return 'district';
        if (userRole.includes('tehsil')) return 'tehsil';
        return 'state';
    };

    const rolePrefix = getRolePrefix();

    const { data, setData, post, processing, errors } = useForm({
        committee_id: '',
        type: 'administrative',
        category: '',
        title: '',
        proposal_text: '',
        rationale: '',
        proposed_action: '',
        effective_date: '',
        expires_date: '',
        vote_scheduled_date: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route(`${rolePrefix}.resolutions.store`));
    };

    const resolutionTypes = {
        disciplinary: 'Disciplinary',
        administrative: 'Administrative',
        financial: 'Financial',
        election: 'Election',
        policy: 'Policy',
    };

    const categoryOptions = {
        disciplinary: [
            { value: 'member_suspension', label: 'Member Suspension' },
            { value: 'member_termination', label: 'Member Termination' },
            { value: 'member_warning', label: 'Member Warning' },
            { value: 'code_violation', label: 'Code Violation' },
        ],
        administrative: [
            { value: 'portfolio_removal', label: 'Portfolio Removal' },
            { value: 'transfer_approval', label: 'Transfer Approval' },
            { value: 'appointment', label: 'Appointment' },
            { value: 'general', label: 'General Administrative' },
        ],
        financial: [
            { value: 'budget_approval', label: 'Budget Approval' },
            { value: 'expenditure', label: 'Expenditure Authorization' },
            { value: 'audit', label: 'Audit Directive' },
        ],
        election: [
            { value: 'election_annulment', label: 'Election Annulment' },
            { value: 'election_approval', label: 'Election Approval' },
            { value: 'result_certification', label: 'Result Certification' },
        ],
        policy: [
            { value: 'policy_change', label: 'Policy Change' },
            { value: 'constitutional_amendment', label: 'Constitutional Amendment' },
            { value: 'rule_adoption', label: 'Rule Adoption' },
        ],
    };

    const proposedActionTemplates = {
        member_suspension: {
            member_id: 0,
            duration_days: 30,
            reason: '',
            effective_date: '',
        },
        member_termination: {
            member_id: 0,
            reason: '',
            effective_date: '',
        },
        portfolio_removal: {
            leadership_position_id: 0,
            member_id: 0,
            reason: '',
            immediate: true,
        },
        transfer_approval: {
            transfer_id: 0,
            from_zone_id: 0,
            to_zone_id: 0,
            reason: '',
        },
    };

    const handleTypeChange = (type) => {
        setData('type', type);
        setData('category', ''); // Reset category when type changes
    };

    const handleCategoryChange = (category) => {
        setData('category', category);
        // Auto-populate proposed_action template if available
        if (proposedActionTemplates[category]) {
            setData('proposed_action', JSON.stringify(proposedActionTemplates[category], null, 2));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Propose Resolution" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route(`${rolePrefix}.resolutions.index`)}
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Resolutions
                        </Link>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Propose Resolution</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Submit a proposal for committee consideration and voting
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                            {/* Committee Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Committee <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.committee_id}
                                    onChange={(e) => setData('committee_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    required
                                >
                                    <option value="">Select a committee...</option>
                                    {committees && committees.map((committee) => (
                                        <option key={committee.id} value={committee.id}>
                                            {committee.name} ({committee.level})
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Choose the committee that will vote on this resolution</p>
                                {errors.committee_id && <p className="mt-2 text-sm text-red-600">{errors.committee_id}</p>}
                            </div>

                            {/* Resolution Type */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Resolution Type <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {Object.entries(resolutionTypes).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => handleTypeChange(value)}
                                            className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${data.type === value
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                {errors.type && <p className="mt-2 text-sm text-red-600">{errors.type}</p>}
                            </div>

                            {/* Category */}
                            {data.type && categoryOptions[data.type] && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        required
                                    >
                                        <option value="">Select a category...</option>
                                        {categoryOptions[data.type].map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
                                </div>
                            )}

                            {/* Title */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Resolution Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="e.g., Resolution on Member Suspension for Misconduct"
                                    required
                                />
                                {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            {/* Proposal Text */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Proposal Text <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.proposal_text}
                                    onChange={(e) => setData('proposal_text', e.target.value)}
                                    rows="6"
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 font-mono text-sm"
                                    placeholder="WHEREAS... [background]&#10;&#10;BE IT RESOLVED THAT... [specific action]"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">Full text of the resolution proposal</p>
                                {errors.proposal_text && <p className="mt-2 text-sm text-red-600">{errors.proposal_text}</p>}
                            </div>

                            {/* Rationale */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rationale
                                </label>
                                <textarea
                                    value={data.rationale}
                                    onChange={(e) => setData('rationale', e.target.value)}
                                    rows="4"
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="Explain the reasoning behind this resolution..."
                                />
                                <p className="mt-1 text-xs text-gray-500">Why this resolution is necessary</p>
                                {errors.rationale && <p className="mt-2 text-sm text-red-600">{errors.rationale}</p>}
                            </div>

                            {/* Proposed Action (JSON) */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Proposed Action (JSON)
                                </label>
                                <textarea
                                    value={data.proposed_action}
                                    onChange={(e) => setData('proposed_action', e.target.value)}
                                    rows="8"
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 font-mono text-sm"
                                    placeholder='{\n  "member_id": 123,\n  "action": "suspend",\n  "duration_days": 30\n}'
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    JSON object describing the specific action to execute. Templates auto-populate based on category.
                                </p>
                                {errors.proposed_action && <p className="mt-2 text-sm text-red-600">{errors.proposed_action}</p>}
                            </div>

                            {/* Dates */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Effective Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.effective_date}
                                            onChange={(e) => setData('effective_date', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">When resolution takes effect</p>
                                        {errors.effective_date && <p className="mt-2 text-sm text-red-600">{errors.effective_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.expires_date}
                                            onChange={(e) => setData('expires_date', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Optional expiration</p>
                                        {errors.expires_date && <p className="mt-2 text-sm text-red-600">{errors.expires_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Vote Scheduled
                                        </label>
                                        <input
                                            type="date"
                                            value={data.vote_scheduled_date}
                                            onChange={(e) => setData('vote_scheduled_date', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Planned voting date</p>
                                        {errors.vote_scheduled_date && <p className="mt-2 text-sm text-red-600">{errors.vote_scheduled_date}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex">
                                    <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="text-sm text-blue-900">
                                        <p className="font-medium mb-1">Resolution Workflow:</p>
                                        <ol className="list-decimal ml-4 space-y-1 text-blue-800">
                                            <li>Resolution created in <strong>draft</strong> status</li>
                                            <li>Proposer or committee chair opens voting</li>
                                            <li>Committee members cast votes</li>
                                            <li>Voting closed and results calculated</li>
                                            <li>If passed, authorized portfolio executes</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                <Link
                                    href={route(`${rolePrefix}.resolutions.index`)}
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
                                >
                                    {processing ? 'Submitting...' : 'Propose Resolution'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

