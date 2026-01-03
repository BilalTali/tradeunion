import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';

export default function Edit({ member, states, districts, tehsils, departments, authScope }) {
    const { auth } = usePage().props;
    // Get user role from authScope or fallback
    const role = authScope?.role || 'member';

    // Determine route prefix
    const getRoutePrefix = () => {
        if (!role) return 'member';
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        if (role.toLowerCase().includes('tehsil')) return 'tehsil';
        return 'member';
    };

    const prefix = getRoutePrefix();

    // Map Role to Member Status Label
    const getInitialStatus = () => {
        const role = member.user?.role || 'member';
        const map = {
            'member': 'Member',
            'tehsil_member': 'Tehsil Member',
            'district_member': 'District Member',
            'state_member': 'State Member'
        };
        return map[role] || 'Member';
    };

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        tehsil_id: member.tehsil_id || '',
        department_id: member.department_id || '',
        employee_category_id: member.employee_category_id || '',
        designation_id: member.designation_id || '',
        member_status: getInitialStatus(),
        name: member.name || '',
        parentage: member.parentage || '',
        photo: null,
        dob: member.dob ? member.dob.split('T')[0].substring(0, 10) : '',
        contact_email: member.contact_email || '',
        contact_phone: member.contact_phone || '',
        school_name: member.school_name || '',
        union_join_date: member.union_join_date ? member.union_join_date.split('T')[0].substring(0, 10) : '',
    });

    const [selectedDistrict, setSelectedDistrict] = useState(member.tehsil?.district_id || '');
    const [photoPreview, setPhotoPreview] = useState(member.photo_path ? `/storage/${member.photo_path}` : null);

    // Get initial posting label
    const getInitialPostingLabel = () => {
        const dept = departments.find(d => d.id == member.department_id);
        return dept?.posting_label || 'School';
    };
    const [postingLabel, setPostingLabel] = useState(getInitialPostingLabel());
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableDesignations, setAvailableDesignations] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingDesignations, setLoadingDesignations] = useState(false);

    useEffect(() => {
        if (authScope?.district_id) {
            setSelectedDistrict(authScope.district_id);
        }
        if (authScope?.tehsil_id) {
            setData('tehsil_id', authScope.tehsil_id); // Force tehsil if scoped
        }
    }, [authScope]);

    const handleDistrictChange = (districtId) => {
        setSelectedDistrict(districtId);
        setData('tehsil_id', ''); // Reset tehsil when district changes
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleDepartmentChange = async (departmentId) => {
        setData('department_id', departmentId);
        setData('employee_category_id', ''); // Reset category
        setData('designation_id', ''); // Reset designation
        setAvailableCategories([]);
        setAvailableDesignations([]);

        const selectedDept = departments.find(d => d.id == departmentId);
        if (selectedDept && selectedDept.posting_label) {
            setPostingLabel(selectedDept.posting_label);
        } else {
            setPostingLabel('School');
        }

        // Fetch categories for this department
        if (departmentId) {
            setLoadingCategories(true);
            try {
                const response = await fetch(`/api/departments/${departmentId}/categories`);
                const categories = await response.json();
                setAvailableCategories(categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        }
    };

    const handleCategoryChange = async (categoryId) => {
        setData('employee_category_id', categoryId);
        setData('designation_id', ''); // Reset designation
        setAvailableDesignations([]);

        // Fetch designations for this category
        if (categoryId) {
            setLoadingDesignations(true);
            try {
                const response = await fetch(`/api/categories/${categoryId}/designations`);
                const designations = await response.json();
                setAvailableDesignations(designations);
            } catch (error) {
                console.error('Error fetching designations:', error);
            } finally {
                setLoadingDesignations(false);
            }
        }
    };

    // Load initial categories and designations on mount
    useEffect(() => {
        if (member.department_id) {
            fetch(`/api/departments/${member.department_id}/categories`)
                .then(res => res.json())
                .then(categories => setAvailableCategories(categories))
                .catch(err => console.error('Error loading categories:', err));
        }

        if (member.employee_category_id) {
            fetch(`/api/categories/${member.employee_category_id}/designations`)
                .then(res => res.json())
                .then(designations => setAvailableDesignations(designations))
                .catch(err => console.error('Error loading designations:', err));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use post with _method: 'PUT' for file uploads to work with Inertia
        post(route(`${prefix}.members.update`, member.id), {
            forceFormData: true,
        });
    };

    const filteredZones = selectedDistrict
        ? tehsils.filter(z => z.district_id == selectedDistrict)
        : [];

    return (
        <AuthenticatedLayout user={auth.user} header="Edit Member">
            <Head title="Edit Member" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Member Photo
                                </label>
                                <div className="flex items-center gap-4">
                                    {photoPreview && (
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
                                        />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-union-primary file:text-white hover:file:bg-red-700"
                                    />
                                </div>
                                {errors.photo && (
                                    <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
                                )}
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Member Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.member_status}
                                    onChange={(e) => setData('member_status', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="Member">Member</option>
                                    <option value="Tehsil Member">Tehsil Member</option>
                                    <option value="District Member">District Member</option>
                                    <option value="State Member">State Member</option>
                                </select>
                                {errors.member_status && (
                                    <p className="mt-1 text-sm text-red-600">{errors.member_status}</p>
                                )}
                            </div>

                            {/* Personal Information */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Parentage (Father/Mother/Guardian) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.parentage}
                                            onChange={(e) => setData('parentage', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg"
                                            required
                                        />
                                        {errors.parentage && (
                                            <p className="mt-1 text-sm text-red-600">{errors.parentage}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={data.dob}
                                            onChange={(e) => setData('dob', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg"
                                        />
                                        {errors.dob && (
                                            <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.contact_email}
                                            onChange={(e) => setData('contact_email', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg"
                                        />
                                        {errors.contact_email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={data.contact_phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setData('contact_phone', val);
                                            }}
                                            className="w-full border-gray-300 rounded-lg"
                                            maxLength={10}
                                            pattern="\d{10}"
                                            title="Please enter exactly 10 digits"
                                        />
                                        {errors.contact_phone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Location
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            District <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={selectedDistrict}
                                            onChange={(e) => handleDistrictChange(e.target.value)}
                                            className="w-full border-gray-300 rounded-lg disabled:bg-gray-100"
                                            required
                                            disabled={!!authScope?.district_id}
                                        >
                                            <option value="">Select District</option>
                                            {districts.map(d => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            tehsil <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.tehsil_id}
                                            onChange={(e) => setData('tehsil_id', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg disabled:bg-gray-100"
                                            disabled={!selectedDistrict || !!authScope?.tehsil_id}
                                            required
                                        >
                                            <option value="">Select tehsil</option>
                                            {filteredZones.map(z => (
                                                <option key={z.id} value={z.id}>{z.name}</option>
                                            ))}
                                        </select>
                                        {errors.tehsil_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.tehsil_id}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Professional Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Department <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={data.department_id}
                                                onChange={(e) => handleDepartmentChange(e.target.value)}
                                                className="w-full border-gray-300 rounded-lg"
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {departments && departments.map(dept => (
                                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                ))}
                                            </select>
                                            {errors.department_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Employee Category <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={data.employee_category_id}
                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                className="w-full border-gray-300 rounded-lg"
                                                required
                                                disabled={!data.department_id || loadingCategories}
                                            >
                                                <option value="">
                                                    {loadingCategories ? 'Loading...' : 'Select Category'}
                                                </option>
                                                {availableCategories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name} ({cat.code})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.employee_category_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.employee_category_id}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Designation <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={data.designation_id}
                                                onChange={(e) => setData('designation_id', e.target.value)}
                                                className="w-full border-gray-300 rounded-lg"
                                                required
                                                disabled={!data.employee_category_id || loadingDesignations}
                                            >
                                                <option value="">
                                                    {loadingDesignations ? 'Loading...' : 'Select Designation'}
                                                </option>
                                                {availableDesignations.map(desig => (
                                                    <option key={desig.id} value={desig.id}>
                                                        {desig.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.designation_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.designation_id}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Place of Posting / {postingLabel} <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.school_name}
                                                onChange={(e) => setData('school_name', e.target.value)}
                                                className="w-full border-gray-300 rounded-lg"
                                                required
                                                placeholder={`e.g. Govt High ${postingLabel} Srinagar`}
                                            />
                                            {errors.school_name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.school_name}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Union Join Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.union_join_date}
                                            onChange={(e) => setData('union_join_date', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg"
                                            required
                                        />
                                        {errors.union_join_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.union_join_date}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4 border-t pt-6">
                                <Link
                                    href={route(`${prefix}.members.index`)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-union-primary text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

