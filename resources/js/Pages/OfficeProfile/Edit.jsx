import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ profile, entity, completionPercentage, stateOrgName, stateName, districtName, userLevel, stateProfile }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'basic';
    });
    const [uploadingAsset, setUploadingAsset] = useState(null);

    // Determine if fields should be read-only based on level
    const isState = userLevel === 'state';
    const isDistrict = userLevel === 'district';
    const isTehsil = userLevel === 'tehsil';

    // Helper: use inherited value from state or local value
    const inherited = (field) => profile?.[field] || stateProfile?.[field] || '';

    const { data, setData, put, processing, errors } = useForm({
        organization_name: isState ? (profile?.organization_name || '') : (stateOrgName || profile?.organization_name || ''),
        short_name: inherited('short_name'),
        affiliation_text: inherited('affiliation_text'),
        federation_name: inherited('federation_name'),
        tagline: inherited('tagline'),
        registration_number: inherited('registration_number'),
        established_date: inherited('established_date'),
        full_address: profile?.full_address || '',
        district: isTehsil ? (districtName || profile?.district || '') : (profile?.district || ''),
        state: (isDistrict || isTehsil) ? (stateName || profile?.state || '') : (profile?.state || ''),
        pin_code: inherited('pin_code'),
        primary_email: profile?.primary_email || '',
        secondary_email: inherited('secondary_email'),
        contact_numbers: profile?.contact_numbers || stateProfile?.contact_numbers || [''],
        website: inherited('website'),
        header_title: inherited('header_title'),
        header_subtitle: inherited('header_subtitle'),
        header_alignment: inherited('header_alignment') || 'center',
        border_style: inherited('border_style') || 'single',
        border_color: inherited('border_color') || '#000000',
        primary_color: inherited('primary_color') || '#1e40af',
        secondary_color: inherited('secondary_color') || '#075985',
        font_family: inherited('font_family') || 'Arial',
        footer_line_1: inherited('footer_line_1'),
        footer_line_2: inherited('footer_line_2'),
        footer_line_3: inherited('footer_line_3'),
        show_footer_separator: profile?.show_footer_separator ?? stateProfile?.show_footer_separator ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const rolePrefix = getRolePrefix();

        // For district/tehsil, don't send inherited fields
        const submitData = { ...data };
        if (!isState) {
            delete submitData.organization_name; // Inherited from state
        }
        if (isDistrict || isTehsil) {
            delete submitData.state; // Inherited from state seeder
        }
        if (isTehsil) {
            delete submitData.district; // Inherited from district seeder
        }

        put(route(`${rolePrefix}.office-profile.update`), {
            data: submitData
        });
    };

    const getRolePrefix = () => {
        const role = auth.user.role?.toLowerCase() || '';
        if (role === 'super_admin' || role.includes('state')) return 'state';
        if (role.includes('district')) return 'district';
        if (role.includes('tehsil')) return 'tehsil';
        return 'state';
    };

    const handleFileUpload = (assetType, file) => {
        if (!file) return;

        setUploadingAsset(assetType);
        const formData = new FormData();
        formData.append('file', file);

        const rolePrefix = getRolePrefix();

        router.post(route(`${rolePrefix}.office-profile.upload`, assetType), formData, {
            onSuccess: () => setUploadingAsset(null),
            onError: () => setUploadingAsset(null),
        });
    };

    const handleDeleteAsset = (assetType) => {
        if (!confirm('Are you sure you want to delete this asset?')) return;

        const rolePrefix = getRolePrefix();
        router.delete(route(`${rolePrefix}.office-profile.delete`, assetType));
    };

    const addContactNumber = () => {
        setData('contact_numbers', [...data.contact_numbers, '']);
    };

    const removeContactNumber = (index) => {
        const numbers = data.contact_numbers.filter((_, i) => i !== index);
        setData('contact_numbers', numbers.length > 0 ? numbers : ['']);
    };

    const updateContactNumber = (index, value) => {
        const numbers = [...data.contact_numbers];
        numbers[index] = value;
        setData('contact_numbers', numbers);
    };

    const tabs = [
        { id: 'basic', label: 'Basic Information', icon: '📋' },
        { id: 'affiliation', label: 'Affiliation', icon: '🤝' },
        { id: 'contact', label: 'Contact Details', icon: '📧' },
        { id: 'branding', label: 'Branding Assets', icon: '🎨' },
        { id: 'letterhead', label: 'Letterhead Settings', icon: '📄' },
        { id: 'footer', label: 'Footer Configuration', icon: '📌' },
        { id: 'preview', label: 'Live Preview', icon: '👁️' },
    ];

    const completion = completionPercentage || profile?.completion_percentage || 0;

    return (
        <AuthenticatedLayout>
            <Head title="Office Profile Setup" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Office Profile & Letterhead</h1>
                        <p className="mt-2 text-gray-600">
                            Configure your official identity and branding for all documents
                        </p>

                        {/* Completion Status */}
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-900">
                                    Profile Completion
                                </span>
                                <span className="text-lg font-bold text-blue-900">
                                    {completion}%
                                </span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${completion}%` }}
                                />
                            </div>
                            {completion < 80 && (
                                <p className="mt-2 text-xs text-blue-700">
                                    Complete at least 80% to access all features
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-t-lg border-b border-gray-200 overflow-x-auto">
                        <div className="flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="mr-2 text-lg">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-b-lg shadow-sm p-8">

                        {/* Basic Information Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Organization Name <span className="text-red-500">*</span>
                                            {!isState && <span className="text-xs text-gray-500 ml-2">(Inherited from State)</span>}
                                        </label>
                                        <input
                                            type="text"
                                            value={data.organization_name}
                                            onChange={e => isState && setData('organization_name', e.target.value)}
                                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isState ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            placeholder="Employees Union of Jammu & Kashmir"
                                            readOnly={!isState}
                                        />
                                        {errors.organization_name && <p className="mt-1 text-sm text-red-600">{errors.organization_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Short Name / Acronym
                                        </label>
                                        <input
                                            type="text"
                                            value={data.short_name}
                                            onChange={e => setData('short_name', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="TUJK"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            value={data.registration_number}
                                            onChange={e => setData('registration_number', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="REG/2024/001"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Established Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.established_date}
                                            onChange={e => setData('established_date', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Affiliation Tab */}
                        {activeTab === 'affiliation' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Affiliation & Constitutional Info</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Affiliation Text
                                    </label>
                                    <textarea
                                        value={data.affiliation_text}
                                        onChange={e => setData('affiliation_text', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Affiliated with All India Employees Federation"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">This will appear on official letterheads</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Federation / Apex Body Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.federation_name}
                                        onChange={e => setData('federation_name', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="All India Employees Federation"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tagline / Motto
                                    </label>
                                    <input
                                        type="text"
                                        value={data.tagline}
                                        onChange={e => setData('tagline', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Education for All, Excellence for Everyone"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Contact Details Tab */}
                        {activeTab === 'contact' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Details</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.full_address}
                                        onChange={e => setData('full_address', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Office Address Line 1, Line 2, City"
                                    />
                                    {errors.full_address && <p className="mt-1 text-sm text-red-600">{errors.full_address}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            District
                                            {isTehsil && <span className="text-xs text-gray-500 ml-2">(From District)</span>}
                                        </label>
                                        <input
                                            type="text"
                                            value={data.district}
                                            onChange={e => !isTehsil && setData('district', e.target.value)}
                                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isTehsil ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            readOnly={isTehsil}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State
                                            {(isDistrict || isTehsil) && <span className="text-xs text-gray-500 ml-2">(From State)</span>}
                                        </label>
                                        <input
                                            type="text"
                                            value={data.state}
                                            onChange={e => isState && setData('state', e.target.value)}
                                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${(isDistrict || isTehsil) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            readOnly={isDistrict || isTehsil}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            PIN Code
                                        </label>
                                        <input
                                            type="text"
                                            value={data.pin_code}
                                            onChange={e => setData('pin_code', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="190001"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Primary Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={data.primary_email}
                                            onChange={e => setData('primary_email', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {errors.primary_email && <p className="mt-1 text-sm text-red-600">{errors.primary_email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Secondary Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.secondary_email}
                                            onChange={e => setData('secondary_email', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Numbers
                                    </label>
                                    {data.contact_numbers.map((number, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={number}
                                                onChange={e => updateContactNumber(index, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="+91 1234567890"
                                            />
                                            {data.contact_numbers.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeContactNumber(index)}
                                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addContactNumber}
                                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        + Add Another Number
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        value={data.website}
                                        onChange={e => setData('website', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Branding Assets Tab - Continued in next message */}
                        {activeTab === 'branding' && (
                            <BrandingAssets
                                profile={profile}
                                uploadingAsset={uploadingAsset}
                                onFileUpload={handleFileUpload}
                                onDeleteAsset={handleDeleteAsset}
                            />
                        )}

                        {/* Letterhead Settings Tab - Will create component */}
                        {activeTab === 'letterhead' && (
                            <LetterheadSettings data={data} setData={setData} errors={errors} />
                        )}

                        {/* Footer Tab - Will create component */}
                        {activeTab === 'footer' && (
                            <FooterConfiguration data={data} setData={setData} errors={errors} />
                        )}

                        {/* Preview Tab - Will create component */}
                        {activeTab === 'preview' && (
                            <LivePreview data={data} profile={profile} />
                        )}

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md transition-all"
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Branding Assets Component
function BrandingAssets({ profile, uploadingAsset, onFileUpload, onDeleteAsset }) {
    const assets = [
        { type: 'primary_logo', label: 'Primary Logo', description: 'Main logo for all communications', accept: 'image/*' },
        { type: 'header_logo', label: 'Header Logo', description: 'Small-sized logo only (not full letterhead)', accept: 'image/*' },
        { type: 'watermark_logo', label: 'Watermark Logo', description: 'Background watermark for PDFs', accept: 'image/*' },
        { type: 'constitution', label: 'Constitution (PDF)', description: 'Official Constitution Document (PDF, Max 10MB)', accept: 'application/pdf' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Branding Assets</h2>
            <p className="text-sm text-gray-600 mb-6">
                Upload high-quality images (PNG, JPG, SVG). Max file size: 2MB
            </p>

            {assets.map(asset => (
                <AssetUploader
                    key={asset.type}
                    assetType={asset.type}
                    label={asset.label}
                    description={asset.description}
                    currentPath={profile?.[asset.type + '_path']}
                    isUploading={uploadingAsset === asset.type}
                    onFileUpload={onFileUpload}
                    onDelete={onDeleteAsset}
                    accept={asset.accept}
                />
            ))}
        </div>
    );
}

// Asset Uploader Component
function AssetUploader({ assetType, label, description, currentPath, isUploading, onFileUpload, onDelete, accept = 'image/*' }) {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileUpload(assetType, file);
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                </div>

                {currentPath && (
                    <div className="ml-4">
                        {assetType === 'constitution' ? (
                            <a
                                href={`/storage/${currentPath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center w-16 h-16 border border-gray-200 rounded text-red-600 hover:bg-red-50"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs font-bold mt-1">PDF</span>
                            </a>
                        ) : (
                            <img
                                src={`/storage/${currentPath}`}
                                alt={label}
                                className="w-16 h-16 object-contain border border-gray-200 rounded"
                            />
                        )}
                    </div>
                )}
            </div>

            <div className="mt-4 flex gap-2">
                <label className="flex-1">
                    <input
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                    />
                    <span className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50 w-full">
                        {isUploading ? 'Uploading...' : currentPath ? 'Replace' : 'Upload'}
                    </span>
                </label>

                {currentPath && !isUploading && (
                    <button
                        type="button"
                        onClick={() => onDelete(assetType)}
                        className="px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

// Letterhead Settings Component
function LetterheadSettings({ data, setData, errors }) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Letterhead Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Header Title
                    </label>
                    <input
                        type="text"
                        value={data.header_title}
                        onChange={e => setData('header_title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Leave blank to use organization name"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Header Subtitle
                    </label>
                    <input
                        type="text"
                        value={data.header_subtitle}
                        onChange={e => setData('header_subtitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Optional subtitle text"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Header Alignment
                    </label>
                    <select
                        value={data.header_alignment}
                        onChange={e => setData('header_alignment', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Border Style
                    </label>
                    <select
                        value={data.border_style}
                        onChange={e => setData('border_style', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="none">None</option>
                        <option value="single">Single Line</option>
                        <option value="double">Double Line</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={data.primary_color}
                            onChange={e => setData('primary_color', e.target.value)}
                            className="h-10 w-16 rounded border border-gray-300"
                        />
                        <input
                            type="text"
                            value={data.primary_color}
                            onChange={e => setData('primary_color', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={data.secondary_color}
                            onChange={e => setData('secondary_color', e.target.value)}
                            className="h-10 w-16 rounded border border-gray-300"
                        />
                        <input
                            type="text"
                            value={data.secondary_color}
                            onChange={e => setData('secondary_color', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Border Color
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={data.border_color}
                            onChange={e => setData('border_color', e.target.value)}
                            className="h-10 w-16 rounded border border-gray-300"
                        />
                        <input
                            type="text"
                            value={data.border_color}
                            onChange={e => setData('border_color', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Family
                    </label>
                    <select
                        value={data.font_family}
                        onChange={e => setData('font_family', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Helvetica">Helvetica</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

// Footer Configuration Component
function FooterConfiguration({ data, setData, errors }) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Footer Configuration</h2>
            <p className="text-sm text-gray-600">
                Configure footer content for official documents
            </p>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Line 1 (Address)
                </label>
                <input
                    type="text"
                    value={data.footer_line_1}
                    onChange={e => setData('footer_line_1', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Office Address, City, PIN"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Line 2 (Emails)
                </label>
                <input
                    type="text"
                    value={data.footer_line_2}
                    onChange={e => setData('footer_line_2', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email: [email protected]"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Line 3 (Contacts)
                </label>
                <input
                    type="text"
                    value={data.footer_line_3}
                    onChange={e => setData('footer_line_3', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phone: +91 1234567890 | Website: www.example.com"
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={data.show_footer_separator}
                    onChange={e => setData('show_footer_separator', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                    Show separator line above footer
                </label>
            </div>
        </div>
    );
}

// Live Preview Component
function LivePreview({ data, profile }) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Preview</h2>
            <p className="text-sm text-gray-600 mb-6">
                Preview how your letterhead will appear on official documents
            </p>

            <div
                className="bg-white border-2 rounded-lg p-8 shadow-lg"
                style={{
                    borderColor: data.border_color,
                    borderStyle: data.border_style === 'double' ? 'double' : 'solid',
                    borderWidth: data.border_style === 'none' ? '0' : '2px',
                    fontFamily: data.font_family
                }}
            >
                {/* Header */}
                <div
                    className="pb-4 mb-6"
                    style={{
                        textAlign: data.header_alignment,
                        borderBottom: `2px solid ${data.border_color}`
                    }}
                >
                    {profile?.header_logo_path && (
                        <img
                            src={`/storage/${profile.header_logo_path}`}
                            alt="Logo"
                            className="mb-3 max-h-16 inline-block"
                        />
                    )}

                    <h1
                        className="text-2xl font-bold mb-1"
                        style={{ color: data.primary_color }}
                    >
                        {data.header_title || data.organization_name}
                    </h1>

                    {data.header_subtitle && (
                        <p
                            className="text-sm"
                            style={{ color: data.secondary_color }}
                        >
                            {data.header_subtitle}
                        </p>
                    )}

                    {data.affiliation_text && (
                        <p className="text-xs text-gray-600 mt-2">
                            {data.affiliation_text}
                        </p>
                    )}
                </div>

                {/* Sample Content */}
                <div className="my-8">
                    <p className="text-sm text-gray-600 mb-2">Date: {new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-gray-800 mb-4">
                        This is a preview of how your official documents will appear with the configured letterhead settings.
                    </p>
                    <p className="text-sm text-gray-800">
                        [Document content will appear here]
                    </p>
                </div>

                {/* Footer */}
                <div
                    className="pt-4 mt-6 text-xs text-center text-gray-600"
                    style={{
                        borderTop: data.show_footer_separator ? `1px solid ${data.border_color}` : 'none'
                    }}
                >
                    {data.footer_line_1 && <p>{data.footer_line_1}</p>}
                    {data.footer_line_2 && <p className="mt-1">{data.footer_line_2}</p>}
                    {data.footer_line_3 && <p className="mt-1">{data.footer_line_3}</p>}
                </div>
            </div>
        </div>
    );
}

