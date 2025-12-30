import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Ballot({ election, candidates, member }) {
    const [selectedVotes, setSelectedVotes] = useState({});
    const { data, setData, post, processing } = useForm({
        votes: [],
    });

    const groupedCandidates = candidates.reduce((acc, candidate) => {
        if (!acc[candidate.position_title]) {
            acc[candidate.position_title] = [];
        }
        acc[candidate.position_title].push(candidate);
        return acc;
    }, {});

    const handleVoteSelection = (positionTitle, candidateId) => {
        setSelectedVotes(prev => ({
            ...prev,
            [positionTitle]: candidateId
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const votes = Object.values(selectedVotes);
        post(route('elections.vote', election.id), {
            data: { votes },
        });
    };

    const selectedCount = Object.keys(selectedVotes).length;
    const totalPositions = Object.keys(groupedCandidates).length;

    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Vote - ${election.title}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
                        <h1 className="text-3xl font-bold">🗳️ Cast Your Ballot</h1>
                        <p className="mt-2 text-green-100">{election.title}</p>
                        <div className="mt-4 flex items-center space-x-6">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                </svg>
                                <span>{member.name}</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span>{selectedCount} of {totalPositions} selected</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Ballot */}
                        <div className="space-y-8">
                            {Object.entries(groupedCandidates).map(([position, positionCandidates]) => (
                                <div key={position} className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <div className="bg-blue-50 px-6 py-4 border-b">
                                        <h2 className="text-xl font-semibold text-gray-900">{position}</h2>
                                        <p className="text-sm text-gray-600 mt-1">Select one candidate</p>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {positionCandidates.map((candidate) => (
                                            <label
                                                key={candidate.id}
                                                className={`block cursor-pointer transition-all duration-200 ${selectedVotes[position] === candidate.id
                                                    ? 'ring-2 ring-blue-500 bg-blue-50'
                                                    : 'hover:bg-gray-50'
                                                    } rounded-lg border-2 border-gray-200 p-4`}
                                            >
                                                <div className="flex items-start">
                                                    <input
                                                        type="radio"
                                                        name={position}
                                                        value={candidate.id}
                                                        checked={selectedVotes[position] === candidate.id}
                                                        onChange={() => handleVoteSelection(position, candidate.id)}
                                                        className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <div className="ml-4 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {candidate.member.name}
                                                            </h3>
                                                            {selectedVotes[position] === candidate.id && (
                                                                <span className="ml-2 text-blue-600 font-medium">✓ Selected</span>
                                                            )}
                                                        </div>
                                                        {candidate.member.designation && (
                                                            <p className="text-sm text-gray-600 mt-1">{candidate.member.designation}</p>
                                                        )}
                                                        {candidate.vision_statement && (
                                                            <p className="text-sm text-gray-700 mt-3">{candidate.vision_statement}</p>
                                                        )}
                                                        {candidate.qualifications && (
                                                            <div className="mt-3">
                                                                <p className="text-xs font-medium text-gray-500 uppercase">Qualifications</p>
                                                                <p className="text-sm text-gray-600 mt-1">{candidate.qualifications}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit */}
                        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        You have selected {selectedCount} out of {totalPositions} positions
                                    </p>
                                    {selectedCount < totalPositions && (
                                        <p className="text-sm text-orange-600 mt-1">
                                            ⚠️ Please select a candidate for all positions
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing || selectedCount < totalPositions}
                                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg"
                                >
                                    {processing ? 'Submitting...' : 'Submit Ballot 🗳️'}
                                </button>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium">Secure Voting</p>
                                    <p className="mt-1">Your vote is encrypted and anonymous. You can only vote once per election.</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
