import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react'; // Added this import
import PrimaryButton from '@/Components/PrimaryButton';


export default function Create({ states, districts, tehsils, userLevel, preSelected }) {
    const { auth } = usePage().props;
    const role = auth.user.role;

    const getRolePrefix = () => {
        // Check if user has an active portfolio - use portfolio routes
        if (auth.activePortfolio && auth.portfolioLevel) {
            const portfolioType = auth.activePortfolio.type;
            const level = auth.portfolioLevel;

            // If it's an election commission portfolio, use EC routes
            if (portfolioType === 'election_commission') {
                return `${level}.ec`;
            }
            // If it's a president portfolio, use president routes
            if (auth.activePortfolio.name?.includes('President')) {
                return `${level}.president`;
            }
            // Default to level-based routing for other portfolios
            return level;
        }

        // Fall back to role-based routing
        if (role === 'super_admin') return 'state';
        if (role.includes('district') && !role.includes('member')) return 'district';
        if (role.includes('tehsil') && !role.includes('member')) return 'tehsil';
        return 'member';
    };

    const rolePrefix = getRolePrefix();

    // Determine available levels based on userLevel
    // STRICT: Each admin level can ONLY create elections at their own level
    const getAvailableLevels = () => {
        if (userLevel === 'tehsil') return ['tehsil'];
        if (userLevel === 'district') return ['district'];
        if (userLevel === 'state') return ['state'];
        return ['state']; // Fallback to state
    };

    const availableLevels = getAvailableLevels();
    const defaultLevel = availableLevels[availableLevels.length - 1]; // Default to most specific level

    const { data, setData, post, processing, errors } = useForm({
        level: preSelected?.level || defaultLevel,
        entity_id: preSelected?.entity_id || '',
        election_type: defaultLevel === 'tehsil' ? 'tehsil_president' : defaultLevel === 'district' ? 'district_president' : 'state_president',
        title: '',
        description: '',
        nomination_start: '',
        nomination_end: '',
        voting_start: '',
        voting_end: '',
    });

    const [selectedLevel, setSelectedLevel] = useState(preSelected?.level || defaultLevel);

    // Set initial entity_id if preSelected
    useEffect(() => {
        if (preSelected?.entity_id && !data.entity_id) {
            setData('entity_id', preSelected.entity_id);
        }
    }, [preSelected]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route(`${rolePrefix}.elections.store`));
    };

    const handleLevelChange = (level) => {
        if (!availableLevels.includes(level)) return; // Prevent changing to unavailable level
        setSelectedLevel(level);
        setData('level', level);
        setData('entity_id', '');
        const electionTypes = {
            'tehsil': 'tehsil_president',
            'district': 'district_president',
            'state': 'state_president'
        };
        setData('election_type', electionTypes[level]);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={false} // Custom header below
        >
            <Head title="Create Election" />

            <div className="min-h-screen bg-gray-50 pb-12">
                {/* Tricolor Header */}
                <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 pb-24 pt-12 shadow-md border-b-4 border-blue-900">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link
                            href={route(`${rolePrefix}.elections.index`)}
                            className="inline-flex items-center text-blue-900 hover:text-blue-700 mb-6 transition-colors font-bold text-sm bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Elections
                        </Link>
                        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight drop-shadow-sm">Create Election</h1>
                        <p className="mt-2 text-blue-800 text-lg font-bold">
                            Set up and manage a new democratic process for your organization
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <form onSubmit={handleSubmit}>
                            {/* Form Header */}
                            <div className="bg-white border-b border-gray-100 px-8 py-6">
                                <h2 className="text-xl font-bold text-blue-900 flex items-center">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 mr-3 text-lg">📝</span>
                                    Election Details
                                </h2>
                            </div>

                            <div className="p-8 space-y-10">
                                {/* Pre-selected Info */}
                                {preSelected && (
                                    <div className="bg-gradient-to-r from-orange-50 to-green-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                                        <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Current Jurisdiction
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                            <div className="bg-white/80 p-3 rounded-lg border border-orange-100 shadow-sm">
                                                <span className="text-orange-600 font-semibold uppercase text-xs block mb-1">State</span>
                                                <span className="text-gray-900 font-bold text-lg">{preSelected.stateName}</span>
                                            </div>
                                            {preSelected.districtName && (
                                                <div className="bg-white/80 p-3 rounded-lg border border-white shadow-sm">
                                                    <span className="text-blue-600 font-semibold uppercase text-xs block mb-1">District</span>
                                                    <span className="text-gray-900 font-bold text-lg">{preSelected.districtName}</span>
                                                </div>
                                            )}
                                            {preSelected.zoneName && (
                                                <div className="bg-white/80 p-3 rounded-lg border border-green-100 shadow-sm">
                                                    <span className="text-green-600 font-semibold uppercase text-xs block mb-1">Tehsil</span>
                                                    <span className="text-gray-900 font-bold text-lg">{preSelected.zoneName}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Level Selection */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-4">
                                        Election Level <span className="text-red-600">*</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['state', 'district', 'tehsil'].map((level) => {
                                            const isAvailable = availableLevels.includes(level);
                                            // Conditional styling for tricolor levels
                                            let activeClass = '';
                                            if (level === 'state') activeClass = 'border-orange-500 bg-orange-50 text-orange-700';
                                            if (level === 'district') activeClass = 'border-blue-500 bg-blue-50 text-blue-700';
                                            if (level === 'tehsil') activeClass = 'border-green-500 bg-green-50 text-green-700';

                                            return (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    onClick={() => isAvailable && handleLevelChange(level)}
                                                    disabled={!isAvailable}
                                                    className={`relative p-5 border-2 rounded-xl font-bold capitalize transition-all duration-200 shadow-sm ${selectedLevel === level
                                                        ? `${activeClass} shadow-md transform scale-102`
                                                        : isAvailable
                                                            ? 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50 text-gray-700 hover:shadow-md'
                                                            : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-60'
                                                        }`}
                                                >
                                                    <span className="text-lg">{level}</span>
                                                    {selectedLevel === level && (
                                                        <span className="absolute top-2 right-2">
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.level && <p className="mt-2 text-sm text-red-600 font-bold">{errors.level}</p>}
                                </div>

                                {/* Main Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Entity Selection */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Select {selectedLevel && (selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1))} <span className="text-red-600">*</span>
                                        </label>
                                        <select
                                            value={data.entity_id}
                                            onChange={(e) => setData('entity_id', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-black bg-white font-medium h-12"
                                            required
                                        >
                                            <option value="" className="text-gray-500">Choose {selectedLevel}...</option>
                                            {selectedLevel === 'state' && states?.map((state) => (
                                                <option key={state.id} value={state.id}>{state.name}</option>
                                            ))}
                                            {selectedLevel === 'district' && districts?.map((district) => (
                                                <option key={district.id} value={district.id}>{district.name}</option>
                                            ))}
                                            {selectedLevel === 'tehsil' && tehsils?.map((tehsil) => (
                                                <option key={tehsil.id} value={tehsil.id}>{tehsil.name}</option>
                                            ))}
                                        </select>
                                        {errors.entity_id && <p className="mt-2 text-sm text-red-600 font-bold">{errors.entity_id}</p>}
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Election Title <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-black bg-white placeholder-gray-400 font-medium h-12"
                                            placeholder="e.g., Annual Executive Election 2024"
                                            required
                                        />
                                        {errors.title && <p className="mt-2 text-sm text-red-600 font-bold">{errors.title}</p>}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-black bg-white placeholder-gray-400 font-medium p-4"
                                        placeholder="Detailed description of the election purpose and rules..."
                                    />
                                    {errors.description && <p className="mt-2 text-sm text-red-600 font-bold">{errors.description}</p>}
                                </div>

                                {/* Timeline */}
                                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                    <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-800 mr-3 text-sm">📅</span>
                                        Election Schedule
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <h4 className="font-bold text-orange-700 border-b border-orange-200 pb-2">Nomination Phase</h4>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    Start Date & Time <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={data.nomination_start}
                                                    onChange={(e) => setData('nomination_start', e.target.value)}
                                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 text-black bg-white font-medium"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    End Date & Time <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={data.nomination_end}
                                                    onChange={(e) => setData('nomination_end', e.target.value)}
                                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 text-black bg-white font-medium"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="font-bold text-green-700 border-b border-green-200 pb-2">Voting Phase</h4>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    Start Date & Time <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={data.voting_start}
                                                    onChange={(e) => setData('voting_start', e.target.value)}
                                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 text-black bg-white font-medium"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    End Date & Time <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={data.voting_end}
                                                    onChange={(e) => setData('voting_end', e.target.value)}
                                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 text-black bg-white font-medium"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {(errors.nomination_start || errors.nomination_end || errors.voting_start || errors.voting_end) && (
                                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-bold border border-red-100">
                                            Please verify all dates and times are correct and in sequence.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex items-center justify-end space-x-4">
                                <Link
                                    href={route(`${rolePrefix}.elections.index`)}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:border-gray-400 transition-colors font-bold shadow-sm"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton
                                    disabled={processing}
                                    processing={processing}
                                    className="min-w-[160px]"
                                >
                                    Create Election
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

