import { useState } from 'react';

/**
 * LazyImage component with loading states and fallback
 * Implements native lazy loading for improved Core Web Vitals (LCP)
 */
export default function LazyImage({
    src,
    alt,
    className = '',
    fallback = '/placeholder.png',
    loading = 'lazy',
    decoding = 'async',
    ...props
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <img
            src={imageError ? fallback : src}
            alt={alt}
            className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            loading={loading} // Native lazy loading
            decoding={decoding} // Async decode for better performance
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            {...props}
        />
    );
}
