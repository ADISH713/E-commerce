import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

import StarRating from './StarRating';
import Pagination from '../admin/components/Pagination';
import { useProductReviews, useMyReviewStatus } from '../hooks/useReviews';
import { createReview, updateReview, deleteReview } from '../services/reviewServices';
import { getErrorMessage } from '../utils/getErrorMessage';

const MAX_COMMENT = 1000;

function ProductReviews({ productId }) {
    const queryClient = useQueryClient();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [page, setPage] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [formError, setFormError] = useState('');

    const { data, isLoading, isError, error } = useProductReviews(productId, page);
    const { data: status } = useMyReviewStatus(productId, isAuthenticated);

    const myReview = status?.myReview || null;
    const showForm = Boolean(status?.canReview) || isEditing;

    // opening another product starts from a clean state
    useEffect(() => {
        setPage(1);
        setIsEditing(false);
        setRating(0);
        setComment('');
        setFormError('');
    }, [productId]);

    // if the last review on the last page was deleted, step back one page
    useEffect(() => {
        if (data && data.pages > 0 && page > data.pages) setPage(data.pages);
    }, [data, page]);

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
        queryClient.invalidateQueries({ queryKey: ['review-status', productId] });
        queryClient.invalidateQueries({ queryKey: ['product', productId] }); // rating at the top
        queryClient.invalidateQueries({ queryKey: ['products'] });           // rating on the cards
    };

    const saveMutation = useMutation({
        mutationFn: () =>
            isEditing && myReview
                ? updateReview(myReview._id, { rating, comment })
                : createReview(productId, { rating, comment }),
        onSuccess: () => {
            toast.success(isEditing ? 'Review updated' : 'Thanks for your review!');
            setIsEditing(false);
            setRating(0);
            setComment('');
            setFormError('');
            refresh();
        },
        onError: (err) => setFormError(getErrorMessage(err, 'Could not save your review')),
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating < 1) {
            setFormError('Please choose a star rating');
            return;
        }
        if (comment.trim().length < 3) {
            setFormError('Please write at least 3 characters');
            return;
        }

        setFormError('');
        saveMutation.mutate();
    };

    const startEdit = () => {
        setRating(myReview.rating);
        setComment(myReview.comment);
        setFormError('');
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setRating(0);
        setComment('');
        setFormError('');
    };

    const handleDelete = async (reviewId, isOwn) => {
        const result = await Swal.fire({
            title: isOwn ? 'Delete your review?' : 'Delete this review?',
            text: 'This cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
        });

        if (!result.isConfirmed) return;

        try {
            await deleteReview(reviewId);
            toast.success('Review deleted');
            setIsEditing(false);
            refresh();
        } catch (err) {
            toast.error(getErrorMessage(err, 'Failed to delete review'));
        }
    };

    const reviews = data?.reviews ?? [];
    const summary = data?.summary;

    return (
        <section>
            <h2 className='text-xl font-medium text-gray-900 mb-6'>Ratings & Reviews</h2>

            {isLoading && <p className='text-sm text-gray-500'>Loading reviews...</p>}

            {isError && (
                <p className='text-sm text-red-600'>Error: {getErrorMessage(error)}</p>
            )}

            {data && (
                <>
                    {/* SUMMARY */}
                    <div className='grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-10 mb-8'>
                        <div>
                            <p className='text-5xl font-medium text-gray-900'>
                                {summary.rating}
                                <span className='text-2xl text-gray-500'>/5</span>
                            </p>
                            <div className='mt-2'>
                                <StarRating value={summary.rating} size='text-2xl' />
                            </div>
                            <p className='text-sm text-gray-500 mt-1'>
                                {summary.count} {summary.count === 1 ? 'review' : 'reviews'}
                            </p>
                        </div>

                        <div className='space-y-2'>
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = summary.breakdown[star] ?? 0;
                                const percent = summary.count
                                    ? Math.round((count / summary.count) * 100)
                                    : 0;

                                return (
                                    <div key={star} className='flex items-center gap-3 text-sm'>
                                        <span className='w-10 text-gray-600'>{star} ★</span>
                                        <div className='flex-1 h-2 bg-gray-100 rounded-full overflow-hidden'>
                                            <div
                                                className='h-full bg-orange-500 rounded-full'
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <span className='w-8 text-right text-gray-500'>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* WRITE OR MANAGE YOUR REVIEW */}
                    <div className='mb-8'>
                        {!isAuthenticated ? (
                            <p className='text-sm text-gray-600'>
                                <Link to='/login' className='text-orange-600 font-medium hover:text-orange-700'>
                                    Log in
                                </Link>{' '}
                                to write a review.
                            </p>
                        ) : showForm ? (
                            <form
                                onSubmit={handleSubmit}
                                className='border border-gray-200 rounded-lg p-4 sm:p-5 space-y-4'
                            >
                                <h3 className='text-base font-medium text-gray-900'>
                                    {isEditing ? 'Edit your review' : 'Write a review'}
                                </h3>

                                <div>
                                    <p className='text-sm text-gray-600 mb-1'>Your rating</p>
                                    <StarRating value={rating} onChange={setRating} size='text-3xl' />
                                </div>

                                <div>
                                    <textarea
                                        rows={4}
                                        maxLength={MAX_COMMENT}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder='Share what you think about this car...'
                                        className='w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-orange-500'
                                    />
                                    <p className='text-xs text-gray-400 text-right mt-1'>
                                        {comment.length}/{MAX_COMMENT}
                                    </p>
                                </div>

                                {formError && <p className='text-sm text-red-600'>{formError}</p>}

                                <div className='flex gap-3'>
                                    <button
                                        type='submit'
                                        disabled={saveMutation.isPending}
                                        className='bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-orange-700 transition disabled:opacity-60'
                                    >
                                        {saveMutation.isPending
                                            ? 'Saving...'
                                            : isEditing
                                            ? 'Update review'
                                            : 'Submit review'}
                                    </button>

                                    {isEditing && (
                                        <button
                                            type='button'
                                            onClick={cancelEdit}
                                            className='text-sm text-gray-600 hover:text-gray-900 px-3'
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        ) : myReview ? (
                            <div className='border border-orange-200 bg-orange-50/40 rounded-lg p-4 sm:p-5'>
                                <div className='flex items-start justify-between gap-3'>
                                    <div>
                                        <p className='text-sm font-medium text-gray-900'>Your review</p>
                                        <StarRating value={myReview.rating} size='text-lg' />
                                    </div>

                                    <div className='flex gap-4 text-sm'>
                                        <button
                                            type='button'
                                            onClick={startEdit}
                                            className='text-orange-600 hover:text-orange-700 font-medium'
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => handleDelete(myReview._id, true)}
                                            className='text-red-600 hover:text-red-700 font-medium'
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <p className='text-sm text-gray-700 mt-2 break-words whitespace-pre-line'>
                                    {myReview.comment}
                                </p>
                            </div>
                        ) : status && !status.hasPurchased ? (
                            <p className='text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3'>
                                Only customers who have received this product can review it.
                            </p>
                        ) : null}
                    </div>

                    {/* REVIEWS LIST */}
                    {reviews.length === 0 ? (
                        <p className='text-sm text-gray-500'>
                            No reviews yet. Be the first to review this car once you receive it.
                        </p>
                    ) : (
                        <ul className='divide-y divide-gray-100'>
                            {reviews.map((review) => {
                                const isOwn = myReview && review._id === myReview._id;

                                return (
                                    <li key={review._id} className='py-4'>
                                        <div className='flex items-start justify-between gap-3'>
                                            <div className='min-w-0'>
                                                <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                                                    <p className='text-sm font-medium text-gray-900'>
                                                        {review.user?.name || 'Customer'}
                                                        {isOwn && (
                                                            <span className='text-xs text-orange-600'> (You)</span>
                                                        )}
                                                    </p>
                                                    <StarRating value={review.rating} size='text-base' />
                                                </div>
                                                <p className='text-xs text-gray-400 mt-0.5'>
                                                    {new Date(review.createdAt).toLocaleDateString('en-IN')}
                                                </p>
                                            </div>

                                            {user?.role === 'admin' && (
                                                <button
                                                    type='button'
                                                    onClick={() => handleDelete(review._id, false)}
                                                    className='text-xs text-red-600 hover:text-red-700 font-medium shrink-0'
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>

                                        <p className='text-sm text-gray-700 mt-2 break-words whitespace-pre-line'>
                                            {review.comment}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {data.pages > 1 && (
                        <div className='mt-4'>
                            <Pagination
                                currentPage={page}
                                totalPages={data.pages}
                                goToPage={setPage}
                                nextPage={() => page < data.pages && setPage(page + 1)}
                                previousPage={() => page > 1 && setPage(page - 1)}
                            />
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default ProductReviews;