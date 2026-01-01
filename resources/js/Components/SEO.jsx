import { Head } from '@inertiajs/react';

/**
 * SEO component for meta tags, Open Graph, and JSON-LD schema
 * Usage: <SEO title="Page Title" description="..." />
 */
export default function SEO({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
    schema,
}) {
    const fullTitle = title ? `${title} | JKECC` : 'JKECC - Jammu and Kashmir Employees Coordination Committee';
    const defaultDescription = 'Official portal for Jammu and Kashmir Employees Coordination Committee. Empowering employees through democratic representation, member services, and advocacy.';
    const finalDescription = description || defaultDescription;
    const defaultImage = url ? `${url}/images/og-image.jpg` : '/images/og-image.jpg';
    const finalImage = image || defaultImage;
    const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    // Default organization schema
    const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Jammu and Kashmir Employees Coordination Committee",
        "url": canonicalUrl,
        "logo": `${url}/images/logo.png`,
        "description": finalDescription,
        "address": {
            "@type": "PostalAddress",
            "addressRegion": "Jammu and Kashmir",
            "addressCountry": "IN"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "General Inquiries",
            "availableLanguage": ["English", "Hindi", "Urdu"]
        }
    };

    const finalSchema = schema || defaultSchema;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={finalDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author || 'Teachers Union Portal'} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:site_name" content="JKECC" />
            <meta property="og:locale" content="en_IN" />

            {/* Article specific OG tags */}
            {type === 'article' && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {type === 'article' && modifiedTime && (
                <meta property="article:modified_time" content={modifiedTime} />
            )}
            {type === 'article' && author && (
                <meta property="article:author" content={author} />
            )}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />

            {/* Additional SEO */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />

            {/* JSON-LD Schema */}
            <script type="application/ld+json">
                {JSON.stringify(finalSchema)}
            </script>
        </Head>
    );
}
