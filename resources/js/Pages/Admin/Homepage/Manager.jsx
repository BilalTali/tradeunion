import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextArea from '@/Components/TextArea';

export default function Manager({ auth, officeProfile, heroSlides, contents }) {
    const [activeTab, setActiveTab] = useState('global');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Homepage Manager (CMS)</h2>}
        >
            <Head title="Homepage Manager" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Tabs */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex">
                                <TabButton
                                    active={activeTab === 'global'}
                                    onClick={() => setActiveTab('global')}
                                    icon="🎨"
                                    label="Theme & Identity"
                                />
                                <TabButton
                                    active={activeTab === 'slider'}
                                    onClick={() => setActiveTab('slider')}
                                    icon="🖼️"
                                    label="Hero Slider"
                                />
                                <TabButton
                                    active={activeTab === 'sections'}
                                    onClick={() => setActiveTab('sections')}
                                    icon="📝"
                                    label="Content Sections"
                                />
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {activeTab === 'global' && <GlobalSettings profile={officeProfile} />}
                        {activeTab === 'slider' && <SliderManager slides={heroSlides} />}
                        {activeTab === 'sections' && <SectionsManager contents={contents} />}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// ------------------- SUB-COMPONENTS ------------------- //

function TabButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`
                w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200
                ${active
                    ? 'border-union-primary text-union-primary bg-indigo-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
        >
            <span className="mr-2">{icon}</span>
            {label}
        </button>
    );
}

// 1. GLOBAL SETTINGS (Theme + Identity Link) (Unchanged)
function GlobalSettings({ profile }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        primary_color: profile?.primary_color || '#dc2626',
        secondary_color: profile?.secondary_color || '#1e40af',
        font_family: profile?.font_family || 'sans-serif'
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('state.homepage.theme-update'));
    };

    return (
        <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6 border-b pb-2">Theme Configuration</h3>

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel htmlFor="primary_color" value="Primary Color (Buttons, Highlights)" />
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            type="color"
                            id="primary_color"
                            value={data.primary_color}
                            onChange={(e) => setData('primary_color', e.target.value)}
                            className="h-10 w-20 p-1 border rounded"
                        />
                        <TextInput
                            value={data.primary_color}
                            onChange={(e) => setData('primary_color', e.target.value)}
                            className="w-full"
                        />
                    </div>
                    {errors.primary_color && <div className="text-red-500 text-sm mt-1">{errors.primary_color}</div>}
                </div>

                <div>
                    <InputLabel htmlFor="secondary_color" value="Secondary Color (Accents, Footer)" />
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            type="color"
                            id="secondary_color"
                            value={data.secondary_color}
                            onChange={(e) => setData('secondary_color', e.target.value)}
                            className="h-10 w-20 p-1 border rounded"
                        />
                        <TextInput
                            value={data.secondary_color}
                            onChange={(e) => setData('secondary_color', e.target.value)}
                            className="w-full"
                        />
                    </div>
                    {errors.secondary_color && <div className="text-red-500 text-sm mt-1">{errors.secondary_color}</div>}
                </div>

                <div className="md:col-span-2">
                    <InputLabel htmlFor="font_family" value="Font Family (CSS Name)" />
                    <select
                        id="font_family"
                        value={data.font_family}
                        onChange={(e) => setData('font_family', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="sans-serif">System Sans-Serif (Default)</option>
                        <option value="'Inter', sans-serif">Inter</option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                        <option value="'Open Sans', sans-serif">Open Sans</option>
                        <option value="serif">System Serif</option>
                    </select>
                </div>

                <div className="md:col-span-2 flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save Theme Settings</PrimaryButton>
                    {recentlySuccessful && <span className="text-green-600 font-bold">Saved!</span>}
                </div>
            </form>

            <div className="mt-10 pt-6 border-t">
                <h4 className="font-bold text-gray-900 mb-2">Organization Identity</h4>
                <p className="text-gray-600 mb-4">
                    To update your Organization Name, Logo, Address, and Contact Details, please manage the Office Profile settings.
                </p>
                <a
                    href={route('state.office-profile.edit')}
                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                >
                    Manage Office Profile
                </a>
            </div>
        </div>
    );
}

// 2. SLIDER MANAGER (Unchanged)
function SliderManager({ slides }) {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        image: null,
        images: [],
        title: '',
        subtitle: '',
        button_text: 'Learn More',
        button_link: '/contact'
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('state.homepage.slides.store'), {
            onSuccess: () => reset()
        });
    };

    return (
        <div className="space-y-6">
            {/* Create Slide */}
            <div className="bg-white shadow sm:rounded-lg p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Slide(s)</h3>
                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="slide_image" value="Slide Image(s) (Landscape)" />
                        <input
                            type="file"
                            multiple
                            id="slide_image"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            onChange={e => setData('images', Array.from(e.target.files))}
                            accept="image/*"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">You can select multiple images to upload at once.</p>
                        {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Headline (Applied to all uploaded slides)" />
                            <TextInput
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full"
                                placeholder="Empowering Employees..."
                            />
                        </div>
                        <div>
                            <InputLabel value="Subtitle (Applied to all)" />
                            <TextInput
                                value={data.subtitle}
                                onChange={e => setData('subtitle', e.target.value)}
                                className="w-full"
                                placeholder="Join the movement..."
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <PrimaryButton disabled={processing} className="w-full md:w-auto justify-center">
                            Upload Slide(s)
                        </PrimaryButton>
                    </div>
                </form>
            </div>

            {/* Slide List */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                <h3 className="text-lg font-medium leading-6 text-gray-900 p-6 border-b">Active Slides</h3>
                {slides.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">No slides uploaded yet.</p>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {slides.map(slide => (
                            <SlideItem key={slide.id} slide={slide} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function SlideItem({ slide }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this slide?')) {
            destroy(route('state.homepage.slides.destroy', slide.id));
        }
    };

    return (
        <div className="p-6 flex items-center gap-6 group hover:bg-gray-50 transition">
            <div className="w-48 h-28 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img src={`/storage/${slide.image_path}`} alt="Slide" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-gray-900">{slide.title || '(No Title)'}</h4>
                <p className="text-sm text-gray-500">{slide.subtitle}</p>
                <div className="text-xs text-gray-400 mt-2">
                    Button: {slide.button_text || 'Default'} &rarr; {slide.button_link || '#'}
                </div>
            </div>
            <div>
                <DangerButton onClick={handleDelete} disabled={processing} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Delete
                </DangerButton>
            </div>
        </div>
    );
}

// 3. SECTIONS MANAGER (UPDATED)
const sectionSchemas = {
    mission_cards: {
        type: 'list',
        fields: [
            { key: 'icon', label: 'Icon (Emoji or Class)', type: 'text' },
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' }
        ]
    },
    structure: {
        type: 'list',
        fields: [
            { key: 'level', label: 'Level Name', type: 'text' },
            { key: 'description', label: 'Role Description', type: 'textarea' }
        ]
    },
    journey: {
        type: 'list',
        fields: [
            { key: 'step', label: 'Step #', type: 'text' },
            { key: 'title', label: 'Step Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' }
        ]
    },
    features: {
        type: 'list',
        fields: [
            { key: 'icon', label: 'Icon', type: 'text' },
            { key: 'title', label: 'Feature Title', type: 'text' },
            { key: 'description', label: 'Feature Description', type: 'textarea' }
        ]
    },
    about: { type: 'text' }
};

function SectionsManager({ contents }) {
    const sectionOrder = ['mission_cards', 'about', 'structure', 'journey', 'features'];
    const labels = {
        mission_cards: 'Mission & Key Pillars (What We Do)',
        about: 'About The Association',
        structure: 'Organizational Structure',
        journey: 'Membership Journey',
        features: 'Digital Features'
    };

    return (
        <div className="space-y-6">
            {sectionOrder.map(key => {
                const content = contents[key];
                if (!content) return null;
                return (
                    <SectionEditor
                        key={key}
                        contentKey={key}
                        label={labels[key]}
                        content={content}
                    />
                );
            })}
        </div>
    );
}

function SectionEditor({ contentKey, label, content }) {
    const [isOpen, setIsOpen] = useState(false);
    const schema = sectionSchemas[contentKey] || { type: 'text' };

    // Initial content parsing
    const initialContent = content.content;

    // Helper helper to safe parse JSON
    const parseList = (val) => {
        try {
            return typeof val === 'string' ? JSON.parse(val) : val;
        } catch (e) { return null; }
    };

    const isListSchema = schema.type === 'list';
    // Default mode: If formatted as array, use visual. Else raw.
    // If user says "keep text as default", we respect existing format.
    // Actually, force Visual for known lists IF they parse safely, unless user toggles.
    const [editorMode, setEditorMode] = useState(() => {
        if (!isListSchema) return 'raw';
        const parsed = parseList(initialContent);
        return Array.isArray(parsed) ? 'visual' : 'raw';
    });

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        title: content.title || '',
        subtitle: content.subtitle || '',
        content: (isListSchema && editorMode === 'visual') ? (parseList(initialContent) || []) : initialContent,
        settings: content.settings || { bg_color: '#ffffff' }
    });

    // Sync data.content when switching modes or just handle render logic?
    // It's tricky to sync string <-> array if syntax is broken.
    // Let's keep data.content as the SOURCE OF TRUTH.
    // If visual, it's Array. If raw, it's String.

    // Ensure data.content is consistent on init
    useEffect(() => {
        const parsed = parseList(initialContent);
        if (isListSchema && Array.isArray(parsed)) {
            setData('content', parsed);
        }
    }, []); // Empty dependency array means this runs once on mount

    const toggleMode = () => {
        if (editorMode === 'visual') {
            // Switching to Raw: Stringify content
            setData('content', JSON.stringify(data.content, null, 4));
            setEditorMode('raw');
        } else {
            // Switching to Visual: Parse content
            const parsed = parseList(data.content);
            if (Array.isArray(parsed)) {
                setData('content', parsed);
                setEditorMode('visual');
            } else {
                alert("Current content is not a valid list. Cannot switch to Visual Editor.");
            }
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('state.homepage.content-update', contentKey), {
            preserveScroll: true
        });
    };

    return (
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-6 py-4 bg-gray-50 hover:bg-gray-100 transition"
            >
                <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-gray-800">{label}</span>
                    <span className="text-xs font-mono text-gray-400">({contentKey})</span>
                </div>
                <span className="text-gray-500">{isOpen ? '▼' : '▶'}</span>
            </button>

            {isOpen && (
                <div className="p-6 border-t border-gray-100">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel value="Section Title" />
                                <TextInput
                                    className="w-full mt-1"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel value="Section Subtitle" />
                                <TextInput
                                    className="w-full mt-1"
                                    value={data.subtitle}
                                    onChange={e => setData('subtitle', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Background Color" />
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="color"
                                    value={data.settings?.bg_color || '#ffffff'}
                                    onChange={e => setData('settings', { ...data.settings, bg_color: e.target.value })}
                                    className="h-10 w-20 p-1 border rounded"
                                />
                                <span className="text-sm text-gray-500">Pick a background color for this section strip.</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <InputLabel value={editorMode === 'visual' ? "List Items" : "Content Text / JSON"} />
                                {isListSchema && (
                                    <button
                                        type="button"
                                        onClick={toggleMode}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                                    >
                                        {editorMode === 'visual' ? "Switch to Raw (Text/JSON)" : "Switch to Visual Editor"}
                                    </button>
                                )}
                            </div>

                            {editorMode === 'visual' ? (
                                <DynamicListEditor
                                    items={Array.isArray(data.content) ? data.content : []}
                                    onChange={newItems => setData('content', newItems)}
                                    fields={schema.fields}
                                />
                            ) : (
                                <TextArea
                                    className="w-full h-32 font-mono text-sm"
                                    value={typeof data.content === 'string' ? data.content : JSON.stringify(data.content, null, 4)}
                                    onChange={e => setData('content', e.target.value)}
                                />
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>
                            {recentlySuccessful && <span className="text-green-600 font-bold self-center">Saved!</span>}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

// 4. DYNAMIC LIST EDITOR (New Helper)
function DynamicListEditor({ items, onChange, fields }) {
    const addItem = () => {
        // Create empty object based on fields
        const newItem = {};
        fields.forEach(f => newItem[f.key] = '');
        onChange([...items, newItem]);
    };

    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        onChange(newItems);
    };

    const updateItem = (index, key, value) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: value };
        onChange(newItems);
    };

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative group">
                    <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Item"
                    >
                        ✕
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map(field => (
                            <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                                    {field.label}
                                </label>
                                {field.type === 'textarea' ? (
                                    <TextArea
                                        className="w-full text-sm"
                                        value={item[field.key] || ''}
                                        onChange={e => updateItem(index, field.key, e.target.value)}
                                        rows="2"
                                    />
                                ) : (
                                    <TextInput
                                        className="w-full text-sm"
                                        value={item[field.key] || ''}
                                        onChange={e => updateItem(index, field.key, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addItem}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 font-bold transition-colors"
            >
                + Add New Item
            </button>
        </div>
    );
}
