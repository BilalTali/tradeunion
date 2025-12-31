import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function FeedbacksSection({ feedbacks = [] }) {
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    // If no feedbacks, return null (parent handles empty state)
    if (!feedbacks || feedbacks.length === 0) return null;

    // Logic: If few items (less than screen width approx), distinct static view
    const isFewItems = feedbacks.length <= 4;

    // Use a large enough multiplier to ensure smooth infinite scroll
    // For proper Right-to-Left (standard marquee), we duplicate and scroll 0 -> -50%
    const duplicatedFeedbacks = isFewItems ? feedbacks : [...feedbacks, ...feedbacks, ...feedbacks, ...feedbacks];

    return (
        <div className="w-full relative overflow-hidden py-4">
            {/* Gradient Masks for fading effect - Only show if scrolling */}
            {!isFewItems && (
                <>
                    <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[var(--page-bg)] to-transparent pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[var(--page-bg)] to-transparent pointer-events-none"></div>
                </>
            )}

            <div className={`flex ${isFewItems ? 'justify-center flex-wrap gap-6' : 'animate-marquee-standard whitespace-nowrap hover:pause-animation'}`}>
                {duplicatedFeedbacks.map((feedback, index) => (
                    <div
                        key={`${feedback.id}-${index}`}
                        onClick={() => setSelectedFeedback(feedback)}
                        className="inline-block w-[350px] mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 whitespace-normal flex flex-col justify-between h-[220px] transform transition-transform hover:scale-105 hover:shadow-md cursor-pointer group"
                    >
                        <div>
                            {/* Header: User Info */}
                            <div className="flex items-center gap-3 mb-3 border-b border-gray-50 pb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-green-700 font-bold text-lg shadow-inner">
                                    {(feedback.user?.name?.[0] || 'A').toUpperCase()}
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{feedback.user?.name || 'Anonymous'}</h4>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500 truncate">{feedback.user?.member?.designation || 'Member'}</p>
                                        {/* Status Badge */}
                                        {feedback.admin_response && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                Replied
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Body: Feedback Text */}
                            <div className="relative">
                                {/* Quote Icon */}
                                <div className="absolute -top-1 -left-1 text-gray-100 opacity-50 pointer-events-none">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.8738 16 15.931 16H19.931V7H14.017V4H21.931V16.7487C21.931 19.3892 18.0673 21 14.017 21ZM5.01697 21L5.01697 18C5.01697 16.8954 5.87383 16 6.931 16H10.931V7H5.01697V4H12.931V16.7487C12.931 19.3892 9.06733 21 5.01697 21Z" /></svg>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 relative z-10 pl-2">
                                    {feedback.message}
                                </p>
                            </div>
                        </div>

                        {/* Footer: Read More & Date */}
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-dashed border-gray-100">
                            <button className="text-xs font-bold text-green-600 hover:text-green-800 transition-colors flex items-center gap-1">
                                Read Story
                                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </button>
                            <span className="text-xs text-gray-400">{new Date(feedback.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* FEEDBACK DETAIL MODAL - PORTAL TO BODY to escape stacking contexts */}
            {selectedFeedback && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedFeedback(null)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-fade-in-up">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-orange-50 to-white px-6 py-4 border-b border-orange-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9933] to-[#FF6D00] flex items-center justify-center text-white font-bold text-lg shadow">
                                    {(selectedFeedback.user?.name?.[0] || 'A').toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{selectedFeedback.user?.name}</h4>
                                    <p className="text-xs text-gray-500">{selectedFeedback.user?.member?.designation || 'Member'}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedFeedback(null)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold leading-4 ${selectedFeedback.category === 'Transfer' ? 'bg-blue-100 text-blue-800' :
                                        selectedFeedback.category === 'Pay Related' ? 'bg-green-100 text-green-800' :
                                            'bg-orange-100 text-orange-800'
                                        }`}>
                                        {selectedFeedback.category}
                                    </span>
                                    <span className="text-xs text-gray-400">{new Date(selectedFeedback.created_at).toLocaleDateString()}</span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-3">{selectedFeedback.subject || 'Member Feedback'}</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedFeedback.message}</p>
                            </div>

                            {/* Admin Response Section */}
                            {selectedFeedback.admin_response ? (
                                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2 text-[#138808]">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span className="font-bold text-sm uppercase tracking-wide">Official Response</span>
                                    </div>
                                    <p className="text-gray-800 text-sm font-medium leading-relaxed pl-7">
                                        {selectedFeedback.admin_response}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <p className="text-sm text-gray-400 italic">Response pending...</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setSelectedFeedback(null)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <style>{`
                @keyframes marquee-standard {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-standard {
                    animation: marquee-standard 60s linear infinite;
                }
                .hover\\:pause-animation:hover {
                    animation-play-state: paused;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
