import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const { state, district, tehsil, districts, tehsils } = usePage().props;

    // Check if user has member profile picture, otherwise check user's own photo_path (for admins)
    const currentPhotoUrl = user.member?.photo_path
        ? `/storage/${user.member.photo_path}`
        : (user.photo_path ? `/storage/${user.photo_path}` : null);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            mobile: user.mobile || '',
            institute: user.institute || '',
            residence: user.residence || '',
            district_id: user.district_id || '',
            tehsil_id: user.tehsil_id || '',
            photo: null,
            _method: 'PATCH', // Spoof PATCH for file upload support
        });

    // Filter tehsils based on selected district
    const filteredZones = tehsils?.filter(z =>
        data.district_id ? z.district_id === parseInt(data.district_id) : true
    ) || [];

    // Handle district change - clear tehsil if it doesn't belong to new district
    const handleDistrictChange = (e) => {
        const newDistrictId = e.target.value;
        setData('district_id', newDistrictId);

        // Clear tehsil if current tehsil doesn't belong to new district
        if (data.tehsil_id) {
            const currentZone = tehsils?.find(z => z.id === parseInt(data.tehsil_id));
            if (currentZone && currentZone.district_id !== parseInt(newDistrictId)) {
                setData('tehsil_id', '');
            }
        }
    };

    const submit = (e) => {
        e.preventDefault();

        // Use POST for file uploads
        post(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Profile Photo UI */}
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        {currentPhotoUrl ? (
                            <img src={currentPhotoUrl} alt="Profile" className="h-16 w-16 rounded-full object-cover border border-gray-300" />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                📷
                            </div>
                        )}
                    </div>
                    <div>
                        <InputLabel htmlFor="photo" value="Profile Photo" />
                        <input
                            id="photo"
                            type="file"
                            className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            onChange={(e) => setData('photo', e.target.files[0])}
                            accept="image/*"
                        />
                        <InputError className="mt-2" message={errors.photo} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Mobile Number */}
                <div>
                    <InputLabel htmlFor="mobile" value="Mobile Number" />

                    <TextInput
                        id="mobile"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.mobile}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setData('mobile', val);
                        }}
                        autoComplete="tel"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        pattern="\d{10}"
                        title="Please enter exactly 10 digits"
                    />

                    <InputError className="mt-2" message={errors.mobile} />
                </div>

                {/* Institute/School */}
                <div>
                    <InputLabel htmlFor="institute" value="Institute/School Name" />

                    <TextInput
                        id="institute"
                        className="mt-1 block w-full"
                        value={data.institute}
                        onChange={(e) => setData('institute', e.target.value)}
                        placeholder="Your institute or school name"
                    />

                    <InputError className="mt-2" message={errors.institute} />
                </div>

                {/* Residence/Address */}
                <div>
                    <InputLabel htmlFor="residence" value="Residence Address" />

                    <textarea
                        id="residence"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.residence}
                        onChange={(e) => setData('residence', e.target.value)}
                        placeholder="Your residential address"
                        rows="3"
                    />

                    <InputError className="mt-2" message={errors.residence} />
                </div>

                {/* State - Read Only */}
                <div>
                    <InputLabel htmlFor="state" value="State" />

                    <TextInput
                        id="state"
                        className="mt-1 block w-full bg-gray-100 cursor-not-allowed"
                        value={state?.name || 'Jammu & Kashmir'}
                        readOnly
                    />
                    <p className="mt-1 text-xs text-gray-500">State is fixed to Jammu & Kashmir</p>
                </div>

                {/* District - Editable Select */}
                <div>
                    <InputLabel htmlFor="district_id" value="District" />

                    <select
                        id="district_id"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.district_id}
                        onChange={handleDistrictChange}
                    >
                        <option value="">Select District</option>
                        {districts && districts.map((dist) => (
                            <option key={dist.id} value={dist.id}>
                                {dist.name}
                            </option>
                        ))}
                    </select>

                    <InputError className="mt-2" message={errors.district_id} />
                </div>

                {/* tehsil - Editable Select (filtered by district) */}
                <div>
                    <InputLabel htmlFor="tehsil_id" value="tehsil" />

                    <select
                        id="tehsil_id"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.tehsil_id}
                        onChange={(e) => setData('tehsil_id', e.target.value)}
                        disabled={!data.district_id}
                    >
                        <option value="">{data.district_id ? 'Select tehsil' : 'Select District First'}</option>
                        {filteredZones.map((z) => (
                            <option key={z.id} value={z.id}>
                                {z.name}
                            </option>
                        ))}
                    </select>

                    <InputError className="mt-2" message={errors.tehsil_id} />
                    {!data.district_id && (
                        <p className="mt-1 text-xs text-gray-500">Please select a district first to see available tehsils</p>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

