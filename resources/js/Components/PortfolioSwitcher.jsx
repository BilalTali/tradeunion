import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    BriefcaseIcon,
    CheckIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function PortfolioSwitcher({ portfolios, activePortfolioId }) {
    const [switching, setSwitching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSwitch = async (portfolioId) => {
        if (portfolioId === activePortfolioId) return;

        setSwitching(true);

        router.post('/api/switch-portfolio',
            { leadership_position_id: portfolioId },
            {
                onSuccess: (page) => {
                    const redirectUrl = page.props.redirect_url || '/dashboard';
                    window.location.href = redirectUrl;
                },
                onError: () => {
                    alert('Failed to switch portfolio. Please try again.');
                    setSwitching(false);
                },
            }
        );
    };

    if (!portfolios || portfolios.length === 0) {
        return null;
    }

    const activePortfolio = portfolios.find(p => p.id === activePortfolioId);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                disabled={switching}
            >
                <BriefcaseIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">
                    {activePortfolio?.portfolio?.name || 'Select Portfolio'}
                </span>
                <ArrowPathIcon className={`w-4 h-4 text-gray-400 ${switching ? 'animate-spin' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="p-3 border-b border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                                Switch Portfolio
                            </p>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {portfolios.map(portfolio => {
                                const isActive = portfolio.id === activePortfolioId;
                                return (
                                    <button
                                        key={portfolio.id}
                                        onClick={() => handleSwitch(portfolio.id)}
                                        disabled={isActive || switching}
                                        className={`
                                            w-full px-4 py-3 flex items-center justify-between
                                            hover:bg-gray-50 transition text-left
                                            ${isActive ? 'bg-blue-50' : ''}
                                            ${switching ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">
                                                {portfolio.portfolio.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {portfolio.level.charAt(0).toUpperCase() + portfolio.level.slice(1)} Level
                                            </p>
                                        </div>
                                        {isActive && (
                                            <CheckIcon className="w-5 h-5 text-blue-600" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
