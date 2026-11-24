import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    useQuery,
    useQueryClient,
    keepPreviousData,
} from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

import StarRating from '../../components/StarRating';
import Pagination from '../components/Pagination';
import { getAdminReviews, deleteReview } from '../../services/reviewServices';
import { getErrorMessage } from '../../utils/getErrorMessage';

const PAGE_SIZE = 8;
const RATING_TABS = ['all', '5', '4', '3', '2', '1'];

function AdminReviews() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const urlSearch = searchParams.get('search') || '';
    const ratingFilter = searchParams.get('rating') || 'all';
    const sortOption = searchParams.get('sort') || 'newest';
    const page = Number(searchParams.get('page')) || 1;

    const [searchInput, setSearchInput] = useState(urlSearch);
    const [busyId, setBusyId] = useState(null);

    // change several URL params at once; null removes a param
    const updateParams = (changes) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            Object.entries(changes).forEach(([key, value]) => {
                if (value === null || value === '') params.delete(key);
                else params.set(key, String(value));
            });
            return params;
        });
    };

    // wait 400ms after typing, then put the search in the URL
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput.trim() === urlSearch) return;

            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                if (searchInput.trim()) params.set('search', searchInput.trim());
                else params.delete('search');
                params.set('page', '1');
                return params;
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput, urlSearch, setSearchParams]);

    const {
        data,
        isLoading,
        isError,
        error: loadError,
    } = useQuery({
        queryKey: ['admin-reviews', { page, rating: ratingFilter, search: urlSearch, sort: sortOption }],
        queryFn: () =>
            getAdminReviews({
                page,
                limit: PAGE_SIZE,
                rating: ratingFilter === 'all' ? undefined : ratingFilter,
                search: urlSearch || undefined,
                sort: sortOption,
            }),
        placeholderData: keepPreviousData,
    });

    const reviews = data?.reviews ?? [];
    const totalPages = data?.pages ?? 1;
    const ratingCounts = data?.ratingCounts ?? {};
    const totalCount = Object.values(ratingCounts).reduce((sum, n) => sum + n, 0);

    // if the last review on the last page was deleted, step back one page
    useEffect(() => {
        if (data && data.pages > 0 && page > data.pages) {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set('page', String(data.pages));
                return params;
            });
        }
    }, [data, page, setSearchParams]);

    const goToPage = (target) => updateParams({ page: target });
    const nextPage = () => page < totalPages && goToPage(page + 1);
    const previousPage = () => page > 1 && goToPage(page - 1);

    const handleDelete = async (review) => {
        if (busyId) return;

        const result = await Swal.fire({
            title: 'Delete this review?',
            text: `${review.user?.name || 'This customer'}'s review of "${
                review.product?.name || 'a deleted product'
            }" will be removed and the product rating recalculated.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
        });

        if (!result.isConfirmed) return;

        setBusyId(review._id);

        try {
            await deleteReview(review._id);
            toast.success('Review deleted');

            queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            queryClient.invalidateQueries({ queryKey: ['product'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        } catch (error) {
            toast.error(getErrorMessage(error, 'Failed to delete review'));
        } finally {
            setBusyId(null);
        }
    };

    if (isLoading) {
        return <p className="text-sm text-gray-500">Loading reviews...</p>;
    }

    if (isError) {
        return (
            <p className="text-sm text-red-600">
                Error: {getErrorMessage(loadError)}
            </p>
        );
    }

    return (
        <div className="w-full min-w-0">
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Reviews</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Moderate customer reviews. Deleting one recalculates the product rating.
                </p>
            </div>

            {/* Search and sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search comment, customer or product..."
                    className="flex-1 border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />

                <select
                    value={sortOption}
                    onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                    className="border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none cursor-pointer focus:border-orange-400"
                >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="lowest">Lowest rating</option>
                    <option value="highest">Highest rating</option>
                </select>
            </div>

            {/* Rating tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
                {RATING_TABS.map((tab) => {
                    const count = tab === 'all' ? totalCount : ratingCounts[tab] ?? 0;
                    const isActive = ratingFilter === tab;

                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => updateParams({ rating: tab === 'all' ? null : tab, page: 1 })}
                            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
                                isActive
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-400'
                            }`}
                        >
                            {tab === 'all' ? 'All' : `${tab} ★`} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {reviews.length === 0 ? (
                    <p className="px-6 py-12 text-center text-sm text-gray-500">No reviews found.</p>
                ) : (
                    <div className="overflow-x-auto scrollbar-none">
                        <table className="w-full min-w-[800px] text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                                    <th className="px-4 sm:px-5 py-3 font-medium text-gray-500">Product</th>
                                    <th className="px-4 sm:px-5 py-3 font-medium text-gray-500">Customer</th>
                                    <th className="px-4 sm:px-5 py-3 font-medium text-gray-500">Rating</th>
                                    <th className="px-4 sm:px-5 py-3 font-medium text-gray-500">Review</th>
                                    <th className="px-4 sm:px-5 py-3 font-medium text-gray-500">Date</th>
                                    <th className="px-4 sm:px-5 py-3 font-medium text-gray-500">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reviews.map((review) => (
                                    <tr
                                        key={review._id}
                                        className="border-b border-gray-100 last:border-b-0 hover:bg-orange-50/40 transition align-top"
                                    >
                                        <td className="px-4 sm:px-5 py-3.5">
                                            <div className="flex items-center gap-3 min-w-[160px]">
                                                {review.product?.image && (
                                                    <img
                                                        src={review.product.image}
                                                        alt=""
                                                        className="w-10 h-10 object-contain rounded bg-gray-50 shrink-0"
                                                    />
                                                )}
                                                {review.product ? (
                                                    <a
                                                        href={`/product/${review.product._id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="font-medium text-gray-900 hover:text-orange-600 break-words"
                                                    >
                                                        {review.product.name}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">Deleted product</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-4 sm:px-5 py-3.5">
                                            <p className="font-medium text-gray-900">
                                                {review.user?.name || 'Unknown'}
                                            </p>
                                            <p className="text-gray-500 break-all">{review.user?.email}</p>
                                        </td>

                                        <td className="px-4 sm:px-5 py-3.5">
                                            <StarRating value={review.rating} size="text-base" />
                                        </td>

                                        <td className="px-4 sm:px-5 py-3.5 text-gray-700 max-w-[320px] break-words whitespace-pre-line">
                                            {review.comment}
                                        </td>

                                        <td className="px-4 sm:px-5 py-3.5 text-gray-500 whitespace-nowrap">
                                            {new Date(review.createdAt).toLocaleDateString('en-IN')}
                                        </td>

                                        <td className="px-4 sm:px-5 py-3.5">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(review)}
                                                disabled={busyId === review._id}
                                                className="text-red-600 hover:text-red-700 font-medium disabled:opacity-60"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    nextPage={nextPage}
                    previousPage={previousPage}
                />
            </div>
        </div>
    );
}

export default AdminReviews;