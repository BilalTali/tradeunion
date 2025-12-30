import { useRef, useEffect, useState } from 'react';

// World-Class Rich Text Editor Component
export default function RichTextEditor({ content, onChange, placeholder = 'Start writing your masterpiece...' }) {
    const editorRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageSize, setImageSize] = useState('medium'); // small, medium, large, full
    const [imagePosition, setImagePosition] = useState('center'); // left, center, right
    const [selectedImage, setSelectedImage] = useState(null); // Currently selected image element
    const [imageToolbarPos, setImageToolbarPos] = useState({ top: 0, left: 0 });
    const imageInputRef = useRef(null);

    // Initialize content
    useEffect(() => {
        if (editorRef.current && content && !editorRef.current.innerHTML) {
            editorRef.current.innerHTML = content;
            updateCounts();
        }
    }, [content]);

    // Execute formatting command
    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleContentChange();
    };

    // Update word and character counts
    const updateCounts = () => {
        if (editorRef.current) {
            const text = editorRef.current.innerText || '';
            setCharCount(text.length);
            setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
        }
    };

    // Handle content change
    const handleContentChange = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
            updateCounts();
        }
    };

    // Close all dropdowns
    const closeAllDropdowns = () => {
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        setShowLinkModal(false);
        setShowImageModal(false);
    };

    // Handle click in editor to detect image selection
    const handleEditorClick = (e) => {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
            const rect = img.getBoundingClientRect();
            const editorRect = editorRef.current.getBoundingClientRect();
            setSelectedImage(img);
            setImageToolbarPos({
                top: rect.top - editorRect.top - 50,
                left: rect.left - editorRect.left + rect.width / 2 - 150,
            });
        } else {
            setSelectedImage(null);
        }
    };

    // Update selected image size
    const updateSelectedImageSize = (size) => {
        if (!selectedImage) return;
        const sizes = {
            small: '200px',
            medium: '400px',
            large: '600px',
            full: '100%',
        };
        selectedImage.style.maxWidth = sizes[size];
        handleContentChange();
    };

    // Update selected image position with float for text wrapping
    const updateSelectedImagePosition = (position) => {
        if (!selectedImage) return;

        if (position === 'left') {
            selectedImage.style.float = 'left';
            selectedImage.style.margin = '0 20px 10px 0';
            selectedImage.style.display = 'block';
        } else if (position === 'right') {
            selectedImage.style.float = 'right';
            selectedImage.style.margin = '0 0 10px 20px';
            selectedImage.style.display = 'block';
        } else {
            selectedImage.style.float = 'none';
            selectedImage.style.margin = '20px auto';
            selectedImage.style.display = 'block';
            selectedImage.style.clear = 'both';
        }
        handleContentChange();
    };

    // Delete selected image
    const deleteSelectedImage = () => {
        if (!selectedImage) return;
        selectedImage.remove();
        setSelectedImage(null);
        handleContentChange();
    };

    // Handle link insertion
    const handleAddLink = () => {
        if (linkUrl) {
            execCommand('createLink', linkUrl);
            setLinkUrl('');
            setShowLinkModal(false);
        }
    };

    // Get image size and position styles with float for text wrapping
    const getImageStyles = () => {
        const sizes = {
            small: 'max-width: 200px;',
            medium: 'max-width: 400px;',
            large: 'max-width: 600px;',
            full: 'max-width: 100%;',
        };
        let positionStyle;
        if (imagePosition === 'left') {
            positionStyle = 'float: left; margin-right: 20px;';
        } else if (imagePosition === 'right') {
            positionStyle = 'float: right; margin-left: 20px;';
        } else {
            positionStyle = 'display: block; margin-left: auto; margin-right: auto;';
        }
        return `${sizes[imageSize]} ${positionStyle} border-radius: 12px; margin-top: 16px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);`;
    };

    // Insert image with styling
    const insertStyledImage = (src) => {
        const sizeValue = {
            small: '200px',
            medium: '300px',
            large: '400px',
            full: '100%',
        }[imageSize];

        let html;
        if (imagePosition === 'left') {
            html = `<img src="${src}" draggable="true" style="float: left; max-width: ${sizeValue}; margin: 0 20px 10px 0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: move;" alt="Image" />`;
        } else if (imagePosition === 'right') {
            html = `<img src="${src}" draggable="true" style="float: right; max-width: ${sizeValue}; margin: 0 0 10px 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: move;" alt="Image" />`;
        } else {
            html = `<img src="${src}" draggable="true" style="display: block; max-width: ${sizeValue}; margin: 20px auto; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: move;" alt="Image" />`;
        }

        document.execCommand('insertHTML', false, html);
        editorRef.current?.focus();
        handleContentChange();
        setShowImageModal(false);
        setImageUrl('');
        setImageSize('medium');
        setImagePosition('center');
    };

    // Handle image URL insertion
    const handleAddImageUrl = () => {
        if (imageUrl) {
            insertStyledImage(imageUrl);
        }
    };

    // Handle image file upload
    const handleImageFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                insertStyledImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Color palettes
    const textColors = [
        { color: '#000000', name: 'Black' },
        { color: '#374151', name: 'Gray' },
        { color: '#dc2626', name: 'Red' },
        { color: '#ea580c', name: 'Orange' },
        { color: '#ca8a04', name: 'Yellow' },
        { color: '#16a34a', name: 'Green' },
        { color: '#0891b2', name: 'Cyan' },
        { color: '#2563eb', name: 'Blue' },
        { color: '#7c3aed', name: 'Purple' },
        { color: '#db2777', name: 'Pink' },
    ];

    const highlightColors = [
        { color: '#fef08a', name: 'Yellow' },
        { color: '#bbf7d0', name: 'Green' },
        { color: '#bae6fd', name: 'Blue' },
        { color: '#ddd6fe', name: 'Purple' },
        { color: '#fce7f3', name: 'Pink' },
        { color: '#fed7aa', name: 'Orange' },
        { color: '#fecaca', name: 'Red' },
        { color: '#d1fae5', name: 'Teal' },
        { color: '#e0e7ff', name: 'Indigo' },
        { color: 'transparent', name: 'None' },
    ];

    // Toolbar button component
    const ToolButton = ({ onClick, active, children, tooltip, shortcut }) => (
        <div className="relative group">
            <button
                type="button"
                onClick={onClick}
                className={`
                    w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200
                    ${active
                        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                `}
            >
                {children}
            </button>
            {tooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {tooltip}
                    {shortcut && <span className="ml-1 opacity-60">({shortcut})</span>}
                </div>
            )}
        </div>
    );

    // Toolbar divider
    const Divider = () => <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-1" />;

    // Toolbar group
    const ToolGroup = ({ children, label }) => (
        <div className="flex items-center gap-0.5 px-1">
            {children}
        </div>
    );

    return (
        <div className={`
            ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'rounded-2xl overflow-hidden'}
            border border-gray-200 shadow-xl transition-all duration-300
        `}>
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-white/80 text-sm font-medium">Content Editor</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Rich Text</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-white/60 text-xs flex gap-4">
                        <span>{wordCount} words</span>
                        <span>{charCount} characters</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="text-white/60 hover:text-white transition p-1"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                        {isFullscreen ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 p-2" onClick={closeAllDropdowns}>
                <div className="flex flex-wrap items-center gap-1">
                    {/* Text Formatting */}
                    <ToolGroup>
                        <ToolButton onClick={() => execCommand('bold')} tooltip="Bold" shortcut="Ctrl+B">
                            <span className="font-bold text-sm">B</span>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('italic')} tooltip="Italic" shortcut="Ctrl+I">
                            <span className="italic text-sm">I</span>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('underline')} tooltip="Underline" shortcut="Ctrl+U">
                            <span className="underline text-sm">U</span>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('strikeThrough')} tooltip="Strikethrough">
                            <span className="line-through text-sm">S</span>
                        </ToolButton>
                    </ToolGroup>

                    <Divider />

                    {/* Font Size */}
                    <select
                        onChange={(e) => execCommand('fontSize', e.target.value)}
                        className="h-9 px-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
                        defaultValue=""
                    >
                        <option value="" disabled>Size</option>
                        <option value="1">Tiny</option>
                        <option value="2">Small</option>
                        <option value="3">Normal</option>
                        <option value="4">Medium</option>
                        <option value="5">Large</option>
                        <option value="6">X-Large</option>
                        <option value="7">Huge</option>
                    </select>

                    <Divider />

                    {/* Headings */}
                    <ToolGroup>
                        <ToolButton onClick={() => execCommand('formatBlock', 'h1')} tooltip="Heading 1">
                            <span className="text-xs font-bold">H1</span>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('formatBlock', 'h2')} tooltip="Heading 2">
                            <span className="text-xs font-bold">H2</span>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('formatBlock', 'h3')} tooltip="Heading 3">
                            <span className="text-xs font-bold">H3</span>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('formatBlock', 'p')} tooltip="Paragraph">
                            <span className="text-xs">¶</span>
                        </ToolButton>
                    </ToolGroup>

                    <Divider />

                    {/* Lists & Quote */}
                    <ToolGroup>
                        <ToolButton onClick={() => execCommand('insertUnorderedList')} tooltip="Bullet List">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('insertOrderedList')} tooltip="Numbered List">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('formatBlock', 'blockquote')} tooltip="Quote Block">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8m-5 0h2m0 0v2m0-2l3-3" />
                            </svg>
                        </ToolButton>
                    </ToolGroup>

                    <Divider />

                    {/* Alignment */}
                    <ToolGroup>
                        <ToolButton onClick={() => execCommand('justifyLeft')} tooltip="Align Left">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
                            </svg>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('justifyCenter')} tooltip="Center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
                            </svg>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('justifyRight')} tooltip="Align Right">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
                            </svg>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('justifyFull')} tooltip="Justify">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </ToolButton>
                    </ToolGroup>

                    <Divider />

                    {/* Colors */}
                    <ToolGroup>
                        {/* Text Color */}
                        <div className="relative">
                            <ToolButton
                                onClick={(e) => { e.stopPropagation(); setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }}
                                tooltip="Text Color"
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-bold">A</span>
                                    <div className="w-4 h-1 bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 rounded-full mt-0.5"></div>
                                </div>
                            </ToolButton>
                            {showColorPicker && (
                                <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-48" onClick={e => e.stopPropagation()}>
                                    <p className="text-xs font-semibold text-gray-500 mb-2">Text Color</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {textColors.map(({ color, name }) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => {
                                                    execCommand('foreColor', color);
                                                    setShowColorPicker(false);
                                                }}
                                                title={name}
                                                className="w-7 h-7 rounded-lg border-2 border-gray-100 hover:border-gray-400 hover:scale-110 transition-all shadow-sm"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Highlight */}
                        <div className="relative">
                            <ToolButton
                                onClick={(e) => { e.stopPropagation(); setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }}
                                tooltip="Highlight"
                            >
                                <div className="flex flex-col items-center">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4.649 3.084A1 1 0 015.618 2.5h8.764a1 1 0 01.969.584l2.143 5a1 1 0 01-.153 1.054l-7.5 8.5a1 1 0 01-1.5 0l-7.5-8.5a1 1 0 01-.153-1.054l2.143-5z" />
                                    </svg>
                                    <div className="w-4 h-1 bg-yellow-300 rounded-full mt-0.5"></div>
                                </div>
                            </ToolButton>
                            {showHighlightPicker && (
                                <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-48" onClick={e => e.stopPropagation()}>
                                    <p className="text-xs font-semibold text-gray-500 mb-2">Highlight</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {highlightColors.map(({ color, name }) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => {
                                                    execCommand('hiliteColor', color === 'transparent' ? 'white' : color);
                                                    setShowHighlightPicker(false);
                                                }}
                                                title={name}
                                                className={`w-7 h-7 rounded-lg border-2 border-gray-100 hover:border-gray-400 hover:scale-110 transition-all shadow-sm ${color === 'transparent' ? 'flex items-center justify-center text-xs' : ''}`}
                                                style={{ backgroundColor: color === 'transparent' ? '#fff' : color }}
                                            >
                                                {color === 'transparent' && '✕'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ToolGroup>

                    <Divider />

                    {/* Insert */}
                    <ToolGroup>
                        {/* Link */}
                        <div className="relative">
                            <ToolButton
                                onClick={(e) => { e.stopPropagation(); setShowLinkModal(!showLinkModal); }}
                                tooltip="Insert Link"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m0.586-6.899a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.1-1.1" />
                                </svg>
                            </ToolButton>
                            {showLinkModal && (
                                <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-72" onClick={e => e.stopPropagation()}>
                                    <p className="text-xs font-semibold text-gray-500 mb-2">Insert Link</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddLink}
                                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition shadow-md"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => execCommand('unlink')}
                                        className="mt-2 text-xs text-gray-500 hover:text-red-600 transition"
                                    >
                                        Remove link
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Image */}
                        <div className="relative">
                            <ToolButton
                                onClick={(e) => { e.stopPropagation(); setShowImageModal(!showImageModal); }}
                                tooltip="Insert Image"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </ToolButton>
                            {showImageModal && (
                                <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] w-80 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                    <p className="text-sm font-semibold text-gray-700 mb-4">📷 Insert Image</p>

                                    {/* Size Selection */}
                                    <div className="mb-4">
                                        <label className="block text-xs text-gray-500 mb-2 font-medium">📐 Image Size</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[
                                                { value: 'small', label: 'S', desc: '200px' },
                                                { value: 'medium', label: 'M', desc: '400px' },
                                                { value: 'large', label: 'L', desc: '600px' },
                                                { value: 'full', label: 'Full', desc: '100%' },
                                            ].map(({ value, label, desc }) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => setImageSize(value)}
                                                    className={`py-2 px-2 rounded-lg text-center transition-all ${imageSize === value
                                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <span className="block text-sm font-bold">{label}</span>
                                                    <span className="block text-[10px] opacity-75">{desc}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Position Selection */}
                                    <div className="mb-4">
                                        <label className="block text-xs text-gray-500 mb-2 font-medium">📍 Position</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 'left', icon: '◀️', label: 'Left' },
                                                { value: 'center', icon: '⏺️', label: 'Center' },
                                                { value: 'right', icon: '▶️', label: 'Right' },
                                            ].map(({ value, icon, label }) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => setImagePosition(value)}
                                                    className={`py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${imagePosition === value
                                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <span>{icon}</span>
                                                    <span className="text-sm font-medium">{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-200 my-4"></div>

                                    {/* File Upload */}
                                    <div className="mb-4">
                                        <label className="block text-xs text-gray-500 mb-2 font-medium">📤 Upload from computer</label>
                                        <input
                                            ref={imageInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageFileChange}
                                            className="w-full text-sm border border-gray-200 rounded-lg p-2 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-red-500 file:to-red-600 file:text-white file:font-medium file:cursor-pointer file:shadow-md hover:file:from-red-600 hover:file:to-red-700"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 my-3">
                                        <div className="flex-1 h-px bg-gray-200"></div>
                                        <span className="text-xs text-gray-400 font-medium">OR</span>
                                        <div className="flex-1 h-px bg-gray-200"></div>
                                    </div>

                                    {/* URL Input */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-2 font-medium">🔗 From URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                placeholder="https://..."
                                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddImageUrl}
                                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition shadow-md"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowImageModal(false)}
                                        className="mt-4 w-full py-2 text-center text-xs text-gray-500 hover:text-gray-700 border-t border-gray-100 pt-3"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Horizontal Rule */}
                        <ToolButton onClick={() => execCommand('insertHorizontalRule')} tooltip="Horizontal Line">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
                            </svg>
                        </ToolButton>
                    </ToolGroup>

                    <Divider />

                    {/* Clear & History */}
                    <ToolGroup>
                        <ToolButton onClick={() => execCommand('removeFormat')} tooltip="Clear Formatting">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 00-2-2H9a2 2 0 00-2 2" />
                            </svg>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('undo')} tooltip="Undo" shortcut="Ctrl+Z">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                        </ToolButton>
                        <ToolButton onClick={() => execCommand('redo')} tooltip="Redo" shortcut="Ctrl+Y">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                            </svg>
                        </ToolButton>
                    </ToolGroup>
                </div>
            </div>

            {/* Editor Content Container */}
            <div className="relative">
                {/* Floating Image Toolbar */}
                {selectedImage && (
                    <div
                        className="fixed z-[200] bg-white border border-gray-300 rounded-xl shadow-2xl p-2 flex flex-col gap-2"
                        style={{
                            top: Math.max(100, imageToolbarPos.top + 200),
                            left: Math.max(20, Math.min(imageToolbarPos.left, window.innerWidth - 350))
                        }}
                    >
                        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-3 py-1.5 rounded-t-lg -mt-2 -mx-2 mb-1 text-xs font-semibold">
                            🖼️ Image Properties
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Size buttons */}
                            <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
                                <span className="text-xs text-gray-500 mr-1">Size:</span>
                                {[
                                    { value: 'small', label: 'S' },
                                    { value: 'medium', label: 'M' },
                                    { value: 'large', label: 'L' },
                                    { value: 'full', label: '100%' },
                                ].map(({ value, label }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => updateSelectedImageSize(value)}
                                        className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition font-medium"
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Position buttons */}
                            <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
                                <span className="text-xs text-gray-500 mr-1">Align:</span>
                                {[
                                    { value: 'left', icon: '◀' },
                                    { value: 'center', icon: '⬌' },
                                    { value: 'right', icon: '▶' },
                                ].map(({ value, icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => updateSelectedImagePosition(value)}
                                        className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition"
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>

                            {/* Delete button */}
                            <button
                                type="button"
                                onClick={deleteSelectedImage}
                                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition"
                                title="Delete image"
                            >
                                🗑️
                            </button>

                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => setSelectedImage(null)}
                                className="px-2 py-1 text-xs text-gray-400 hover:text-gray-600 transition"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Editor */}
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleContentChange}
                    onBlur={handleContentChange}
                    onClick={handleEditorClick}
                    className={`
                        ${isFullscreen ? 'h-[calc(100vh-140px)]' : 'min-h-[450px]'}
                        p-8 focus:outline-none overflow-y-auto bg-white
                        prose prose-lg max-w-none
                        prose-headings:text-gray-900 prose-headings:font-bold prose-headings:leading-tight
                        prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-6
                        prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-5
                        prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-4
                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-3
                        prose-a:text-red-600 prose-a:font-medium prose-a:underline prose-a:decoration-red-300 hover:prose-a:decoration-red-600
                        prose-strong:text-gray-900 prose-strong:font-bold
                        prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
                        prose-li:my-1
                        prose-blockquote:border-l-4 prose-blockquote:border-red-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-red-50 prose-blockquote:to-transparent prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-gray-700
                        prose-img:cursor-pointer
                        prose-hr:border-gray-200 prose-hr:my-8
                    `}
                    data-placeholder={placeholder}
                    suppressContentEditableWarning
                />
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                    <span>📝 {wordCount} words</span>
                    <span>🔤 {charCount} chars</span>
                    <span>⏱️ ~{Math.ceil(wordCount / 200)} min read</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-green-600">● Auto-saved</span>
                </div>
            </div>

            <style>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                    font-style: italic;
                }
                [contenteditable] img {
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
                }
                [contenteditable] img:not([style*="float"]) {
                    display: block;
                    margin: 1.5rem auto;
                }
                [contenteditable] img[style*="float: left"] {
                    margin-right: 20px;
                    margin-bottom: 10px;
                }
                [contenteditable] img[style*="float: right"] {
                    margin-left: 20px;
                    margin-bottom: 10px;
                }
                [contenteditable] blockquote {
                    border-left: 4px solid #ef4444;
                    background: linear-gradient(to right, #fef2f2, transparent);
                    padding: 1rem 1.5rem;
                    font-style: italic;
                    margin: 1.5rem 0;
                    border-radius: 0 0.75rem 0.75rem 0;
                }
                [contenteditable] h1 { font-size: 2.5rem; font-weight: 800; margin: 1.5rem 0 1rem; line-height: 1.2; }
                [contenteditable] h2 { font-size: 2rem; font-weight: 700; margin: 1.25rem 0 0.75rem; line-height: 1.25; }
                [contenteditable] h3 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
                [contenteditable] hr { border: none; height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent); margin: 2rem 0; }
                [contenteditable] a { color: #dc2626; text-decoration: underline; text-decoration-color: #fca5a5; }
                [contenteditable] a:hover { text-decoration-color: #dc2626; }
                [contenteditable]:focus { outline: none; }
            `}</style>
        </div>
    );
}
