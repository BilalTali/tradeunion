import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

export default function Vote({ election, candidates, hasVoted }) {
    const { data, setData, post, processing, errors } = useForm({
        candidate_id: '',
        live_photo: null,
    });

    const { auth } = usePage().props;
    const getRoutePrefix = () => {
        const role = auth.user?.role || '';
        if (role === 'super_admin') return 'state';
        if (role.includes('district') && !role.includes('member')) return 'district';
        if (role.includes('tehsil') && !role.includes('member')) return 'tehsil';
        return 'member';
    };
    const prefix = getRoutePrefix();

    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [step, setStep] = useState(1); // 1: OTP Request, 2: OTP Verify, 3: Photo, 4: Select Candidate
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const webcamRef = useRef(null);

    // CRITICAL: Force step 1 on component mount to prevent skipping OTP
    useEffect(() => {

        setStep(1);
        setOtpSent(false);
        setOtpVerified(false);
        setPhoto(null);
        setShowCamera(false);
        setSelectedCandidate(null);
        setOtp('');
    }, []);

    // Request OTP
    const handleRequestOtp = async () => {
        try {
            const response = await axios.post(route('elections.vote.request-otp', election.id));

            if (response.data.success) {
                setOtpSent(true);
                setStep(2);
                alert('OTP sent to your registered email address');
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to send OTP');
        }
    };

    // Verify OTP
    const handleVerifyOtp = async () => {
        try {

            const response = await axios.post(route('elections.vote.verify-otp', election.id), { otp });
            if (response.data.verified) {

                setOtpVerified(true);
                setStep(3);
            }
        } catch (error) {

            alert(error.response?.data?.error || 'Invalid OTP');
        }
    };

    // Capture photo from webcam
    const capturePhoto = () => {
        // Safety check: Ensure OTP is verified
        if (!otpVerified) {
            alert('Please verify OTP first');
            setStep(1);
            return;
        }

        const imageSrc = webcamRef.current.getScreenshot();
        setPhoto(imageSrc);
        setShowCamera(false);
        setStep(4);
    };

    // Retake photo
    const retakePhoto = () => {
        setPhoto(null);
        setShowCamera(true);
        setStep(3);
    };

    // Submit vote with photo
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCandidate) {
            alert('Please select a candidate');
            return;
        }

        if (!photo) {
            alert('Please capture your photo');
            return;
        }

        if (!confirm(`Confirm your vote for ${selectedCandidate.member.name}?\n\nThis action cannot be undone.`)) {
            return;
        }

        // Convert base64 to blob
        const res = await fetch(photo);
        const blob = await res.blob();

        // Create FormData
        const formData = new FormData();
        formData.append('candidate_id', selectedCandidate.id);
        formData.append('live_photo', blob, 'live-photo.jpg');

        // Submit using axios (Inertia doesn't handle FormData well)
        try {
            await axios.post(route('elections.vote.submit', election.id), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Redirect to Dashboard with success flag
            window.location.href = route('dashboard') + '?vote_cast=1';
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit vote');
        }
    };

    const handleCandidateSelect = (candidate) => {
        setSelectedCandidate(candidate);
        setData('candidate_id', candidate.id);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Cast Your Vote" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Already Voted Message */}
                    {hasVoted ? (
                        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-8 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">✅</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">You have cast your vote</h2>
                            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
                                Thank you! Your vote has been submitted for verification.
                            </p>
                            <a
                                href={route('dashboard')}
                                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                            >
                                Back to Dashboard
                            </a>
                        </div>
                    ) : (
                        <>
                            {/* Progress Steps */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                                <div className="flex items-center justify-between">
                                    {[
                                        { num: 1, label: 'Request OTP' },
                                        { num: 2, label: 'Verify OTP' },
                                        { num: 3, label: 'Capture Photo' },
                                        { num: 4, label: 'Cast Vote' },
                                    ].map((s, idx) => (
                                        <div key={s.num} className="flex items-center">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                {step > s.num ? '✓' : s.num}
                                            </div>
                                            <span className={`ml-2 text-sm font-medium ${step >= s.num ? 'text-blue-600' : 'text-gray-600'}`}>{s.label}</span>
                                            {idx < 3 && <div className={`w-12 h-1 mx-2 ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Step 1: Request OTP */}
                            {step === 1 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Verify Your Identity</h2>
                                    <p className="text-gray-600 mb-6">
                                        To ensure secure voting, we'll send an OTP to your registered email address.
                                    </p>
                                    <button
                                        onClick={handleRequestOtp}
                                        className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                                    >
                                        Send OTP
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Verify OTP */}
                            {step === 2 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Enter OTP</h2>
                                    <p className="text-gray-600 mb-6">
                                        Enter the 6-digit OTP sent to your email address
                                    </p>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                        placeholder="Enter 6-digit OTP"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-mono mb-4"
                                    />
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleVerifyOtp}
                                            disabled={otp.length !== 6}
                                            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                                        >
                                            Verify OTP
                                        </button>
                                        <button
                                            onClick={handleRequestOtp}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                                        >
                                            Resend OTP
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Capture Photo */}
                            {step === 3 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                    {!otpVerified ? (
                                        <div className="text-center py-8">
                                            <p className="text-red-600 font-semibold mb-4">⚠️ OTP verification required</p>
                                            <button
                                                onClick={() => setStep(1)}
                                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
                                            >
                                                Go to OTP Verification
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Capture Your Photo</h2>
                                            <p className="text-gray-600 mb-6">
                                                Take a clear selfie for verification by the Election Commission
                                            </p>

                                            {!photo && !showCamera && (
                                                <button
                                                    onClick={() => setShowCamera(true)}
                                                    className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                                                >
                                                    Open Camera
                                                </button>
                                            )}

                                            {showCamera && (
                                                <div className="space-y-4">
                                                    <Webcam
                                                        audio={false}
                                                        ref={webcamRef}
                                                        screenshotFormat="image/jpeg"
                                                        className="w-full rounded-lg border-4 border-blue-600"
                                                    />
                                                    <button
                                                        onClick={capturePhoto}
                                                        className="w-full px-8 py-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                                                    >
                                                        📸 Capture Photo
                                                    </button>
                                                </div>
                                            )}

                                            {photo && !showCamera && (
                                                <div className="space-y-4">
                                                    <img src={photo} alt="Captured" className="w-full rounded-lg border-4 border-green-600" />
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => setStep(4)}
                                                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                                                        >
                                                            Use This Photo
                                                        </button>
                                                        <button
                                                            onClick={retakePhoto}
                                                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                                                        >
                                                            Retake
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Candidate Selection */}
                            {step === 4 && !hasVoted && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Captured Photo Preview */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="text-sm text-green-800 font-semibold mb-2">✓ Photo Captured</p>
                                        <img src={photo} alt="Your photo" className="w-32 h-32 rounded-lg border-2 border-green-600 object-cover" />
                                    </div>

                                    {/* Candidates */}
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Step 4: Select Your Candidate</h2>

                                        {candidates.length === 0 ? (
                                            <p className="text-center text-gray-500 py-8">No approved candidates available</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {candidates.map((candidate) => (
                                                    <div
                                                        key={candidate.id}
                                                        onClick={() => handleCandidateSelect(candidate)}
                                                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md flex items-center gap-4 ${selectedCandidate?.id === candidate.id
                                                            ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                                                            : 'border-gray-200 hover:border-blue-300'
                                                            }`}
                                                    >
                                                        <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                                            {candidate.member?.photo_path ? (
                                                                <img src={`/storage/${candidate.member.photo_path}`} alt={candidate.member.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xl">
                                                                    {candidate.member?.name?.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-gray-900">{candidate.member?.name}</h3>
                                                            <p className="text-sm text-gray-600">{candidate.member?.designation || 'Candidate'}</p>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedCandidate?.id === candidate.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                                                            }`}>
                                                            {selectedCandidate?.id === candidate.id && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || !selectedCandidate}
                                        className="w-full py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {processing ? 'Submitting Vote...' : '✅ CONFIRM & CAST VOTE'}
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

