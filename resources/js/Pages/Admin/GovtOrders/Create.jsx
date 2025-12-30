import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        department: '',
        order_date: '',
        file: null,
        description: '',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('state.govt-orders.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Upload Government Order</h2>}
        >
            <Head title="Upload Order" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6 max-w-xl">
                                <div>
                                    <InputLabel htmlFor="title" value="Title" />
                                    <TextInput
                                        id="title"
                                        className="mt-1 block w-full"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                        isFocused
                                    />
                                    <InputError className="mt-2" message={errors.title} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="department" value="Department" />
                                    <TextInput
                                        id="department"
                                        className="mt-1 block w-full"
                                        value={data.department}
                                        onChange={(e) => setData('department', e.target.value)}
                                        required
                                        placeholder="e.g. Education, Finance"
                                    />
                                    <InputError className="mt-2" message={errors.department} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="order_date" value="Order Date" />
                                    <TextInput
                                        id="order_date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.order_date}
                                        onChange={(e) => setData('order_date', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.order_date} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="file" value="Order File (PDF/Image)" />
                                    <input
                                        type="file"
                                        id="file"
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={(e) => setData('file', e.target.files[0])}
                                        accept=".pdf,image/*"
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.file} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description (Optional)" />
                                    <textarea
                                        id="description"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows="3"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    ></textarea>
                                    <InputError className="mt-2" message={errors.description} />
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                        />
                                        <span className="ml-2 text-gray-600">Is Active</span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Upload Order</PrimaryButton>
                                    <Link href={route('state.govt-orders.index')} className="text-gray-600 hover:text-gray-900">Cancel</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
