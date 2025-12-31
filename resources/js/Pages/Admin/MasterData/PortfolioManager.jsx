import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function PortfolioManager({ auth, portfolios, allPortfolios }) {
    const [showModal, setShowModal] = useState(false);
    const [editingPortfolio, setEditingPortfolio] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        code: '',
        level: 'district',
        type: 'executive',
        authority_rank: 99,
        reports_to_portfolio_id: '',
        description: '',
        can_assign_portfolios: false,
        can_initiate_transfers: false,
        can_approve_transfers: false,
        can_conduct_elections: false,
        can_resolve_disputes: false,
        is_financial_role: false,
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingPortfolio(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEditModal = (portfolio) => {
        setEditingPortfolio(portfolio);
        setData({
            name: portfolio.name,
            code: portfolio.code,
            level: portfolio.level,
            type: portfolio.type,
            authority_rank: portfolio.authority_rank,
            reports_to_portfolio_id: portfolio.reports_to_portfolio_id || '',
            description: portfolio.description || '',
            can_assign_portfolios: Boolean(portfolio.can_assign_portfolios),
            can_initiate_transfers: Boolean(portfolio.can_initiate_transfers),
            can_approve_transfers: Boolean(portfolio.can_approve_transfers),
            can_conduct_elections: Boolean(portfolio.can_conduct_elections),
            can_resolve_disputes: Boolean(portfolio.can_resolve_disputes),
            is_financial_role: Boolean(portfolio.is_financial_role),
            is_active: Boolean(portfolio.is_active),
        });
        clearErrors();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingPortfolio) {
            put(route('state.portfolios.update', editingPortfolio.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('state.portfolios.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (portfolio) => {
        if (confirm('Are you sure you want to delete this portfolio? This cannot be undone.')) {
            destroy(route('state.portfolios.destroy', portfolio.id));
        }
    };

    const filteredPortfolios = portfolios.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Portfolio Master Data</h2>}
        >
            <Head title="Portfolio Manager" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="w-1/3">
                                <TextInput
                                    placeholder="Search Portfolios..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <PrimaryButton onClick={openCreateModal}>
                                + Add Portfolio
                            </PrimaryButton>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPortfolios.map((portfolio) => (
                                        <tr key={portfolio.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{portfolio.name}</div>
                                                <div className="text-sm text-gray-500">{portfolio.code}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{portfolio.level}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{portfolio.type.replace('_', ' ')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{portfolio.authority_rank}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openEditModal(portfolio)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(portfolio)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingPortfolio ? 'Edit Portfolio' : 'Add New Portfolio'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                            </div>
                            <div>
                                <InputLabel htmlFor="code" value="Code (Unique)" />
                                <TextInput
                                    id="code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.code && <div className="text-red-600 text-sm mt-1">{errors.code}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="level" value="Level" />
                                <select
                                    id="level"
                                    value={data.level}
                                    onChange={(e) => setData('level', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="state">State</option>
                                    <option value="district">District</option>
                                    <option value="tehsil">Tehsil</option>
                                    <option value="zone">Zone</option>
                                </select>
                                {errors.level && <div className="text-red-600 text-sm mt-1">{errors.level}</div>}
                            </div>
                            <div>
                                <InputLabel htmlFor="type" value="Type" />
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="executive">Executive</option>
                                    <option value="administrative">Administrative</option>
                                    <option value="financial">Financial</option>
                                    <option value="legal">Legal</option>
                                    <option value="election_commission">Election Commission</option>
                                </select>
                                {errors.type && <div className="text-red-600 text-sm mt-1">{errors.type}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="authority_rank" value="Rank (1=High)" />
                                <TextInput
                                    id="authority_rank"
                                    type="number"
                                    value={data.authority_rank}
                                    onChange={(e) => setData('authority_rank', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.authority_rank && <div className="text-red-600 text-sm mt-1">{errors.authority_rank}</div>}
                            </div>
                            <div>
                                <InputLabel htmlFor="reports_to" value="Reports To" />
                                <select
                                    id="reports_to"
                                    value={data.reports_to_portfolio_id}
                                    onChange={(e) => setData('reports_to_portfolio_id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    <option value="">None (Top Level)</option>
                                    {allPortfolios.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.level})</option>
                                    ))}
                                </select>
                                {errors.reports_to_portfolio_id && <div className="text-red-600 text-sm mt-1">{errors.reports_to_portfolio_id}</div>}
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <TextInput
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    checked={data.can_assign_portfolios}
                                    onChange={(e) => setData('can_assign_portfolios', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Can Assign Portfolios</span>
                            </label>
                            <label className="flex items-center">
                                <Checkbox
                                    checked={data.can_initiate_transfers}
                                    onChange={(e) => setData('can_initiate_transfers', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Can Initiate Transfers</span>
                            </label>
                            <label className="flex items-center">
                                <Checkbox
                                    checked={data.can_approve_transfers}
                                    onChange={(e) => setData('can_approve_transfers', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Can Approve Transfers</span>
                            </label>
                            <label className="flex items-center">
                                <Checkbox
                                    checked={data.can_conduct_elections}
                                    onChange={(e) => setData('can_conduct_elections', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Can Conduct Elections</span>
                            </label>
                            <label className="flex items-center">
                                <Checkbox
                                    checked={data.can_resolve_disputes}
                                    onChange={(e) => setData('can_resolve_disputes', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Can Resolve Disputes</span>
                            </label>
                            <label className="flex items-center">
                                <Checkbox
                                    checked={data.is_financial_role}
                                    onChange={(e) => setData('is_financial_role', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Is Financial Role</span>
                            </label>
                            <label className="flex items-center">
                                <Checkbox
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Is Active</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <SecondaryButton type="button" onClick={closeModal}>Cancel</SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {editingPortfolio ? 'Update Portfolio' : 'Create Portfolio'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
