import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function HomeHeroSlider({ slides, defaultTitle, defaultSubtitle }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const activeSlides = slides && slides.length > 0 ? slides : [
        {
            image_path: null, // Forces default gradient
            title: defaultTitle || 'JKECC',
            subtitle: defaultSubtitle || 'Strengthening Educators. Protecting Rights. Building Unity.'
        }
    ];

    useEffect(() => {
        if (activeSlides.length > 1) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [activeSlides.length]);

    return (
        <section className="relative h-[650px] overflow-hidden bg-gray-50 border-b-4 border-[#FF9933]">

            {/* Ashoka Chakra Watermark (Spinning) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.05] pointer-events-none">
                <svg className="w-[600px] h-[600px] animate-spin-slow" viewBox="0 0 24 24" fill="#000080">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                    <path d="M12 4V2.5M12 21.5V20M4 12H2.5M21.5 12H20M6.34 6.34L5.28 5.28M18.72 18.72l-1.06-1.06M6.34 17.66L5.28 18.72M18.72 5.28l-1.06 1.06" stroke="#000080" strokeWidth="0.5" />
                </svg>
            </div>

            {/* Slides */}
            {activeSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Background Image or Gradient */}
                    {slide.image_path ? (
                        <>
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear transform scale-110"
                                style={{
                                    backgroundImage: `url(/storage/${slide.image_path})`,
                                    transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)' // Subtle zoom effect
                                }}
                            />
                            {/* Dark Overlay for Readability - Reduced Darkness */}
                            <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,#FF9933,#ffffff,#138808,#FF9933)] bg-[length:400%_100%] animate-flag-flow opacity-90" />
                    )}

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-10">
                        <div className="max-w-5xl mx-auto space-y-8">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-[0.2em] uppercase mb-4 animate-fade-in-up ${slide.image_path ? 'bg-white/10 text-white border border-white/20' : 'bg-orange-70 text-[#FF9933] border border-orange-200'}`}>
                                JKECC Official Portal
                            </span>

                            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-sm animate-fade-in-up font-serif ${slide.image_path ? 'text-white' : 'text-[#000080]'}`}>
                                {slide.title || defaultTitle}
                            </h1>

                            <div className={`h-1.5 w-32 mx-auto rounded-full ${slide.image_path ? 'bg-gradient-to-r from-[#FF9933] via-white to-[#138808]' : 'bg-[#FF9933]'}`}></div>

                            <p className={`text-base sm:text-lg md:text-xl font-medium max-w-4xl mx-auto animate-fade-in-up delay-100 leading-relaxed tracking-wide ${slide.image_path ? 'text-gray-200' : 'text-gray-700'}`}>
                                {slide.subtitle || defaultSubtitle}
                            </p>

                            {(slide.button_text && slide.button_link) ? (
                                <div className="mt-8 animate-fade-in-up delay-200">
                                    <Link
                                        href={slide.button_link}
                                        className="inline-block bg-[#FF9933] hover:bg-[#e08520] text-white px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1"
                                    >
                                        {slide.button_text}
                                    </Link>
                                </div>
                            ) : (
                                /* Default CTAs if no specific button */
                                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-10 animate-fade-in-up delay-200">
                                    <Link
                                        href="/contact"
                                        className={`w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-lg transition shadow-lg hover:-translate-y-1 ${slide.image_path
                                            ? 'bg-[#FF9933] text-white hover:bg-[#e68a00]'
                                            : 'bg-[#000080] text-white hover:bg-black'
                                            }`}
                                    >
                                        Join Mission
                                    </Link>
                                    <Link
                                        href="/login"
                                        className={`w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-lg transition hover:-translate-y-1 border-2 ${slide.image_path
                                            ? 'bg-transparent border-white text-white hover:bg-white/10'
                                            : 'bg-white border-[#000080] text-[#000080] hover:bg-gray-50'
                                            }`}
                                    >
                                        Member Login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            {activeSlides.length > 1 && (
                <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3 z-10">
                    {activeSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-[#FF9933] w-12' : 'bg-gray-300 w-2 hover:bg-gray-400'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 60s linear infinite;
                }
                @keyframes flag-flow {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 100% 50%; }
                }
                .animate-flag-flow {
                    animation: flag-flow 15s linear infinite;
                }
            `}</style>
        </section>
    );
}
