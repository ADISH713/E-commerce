import React, { useState } from 'react';

// display only by default; pass onChange to make the stars clickable
function StarRating({ value = 0, onChange, size = 'text-2xl' }) {
    const [hover, setHover] = useState(0);

    const interactive = typeof onChange === 'function';
    const shown = Math.round(hover || value);

    return (
        <div
            className={`inline-flex ${size} leading-none`}
            onMouseLeave={() => setHover(0)}
        >
            {[1, 2, 3, 4, 5].map((star) => {
                const color = star <= shown ? 'text-orange-500' : 'text-gray-300';

                if (!interactive) {
                    return (
                        <span key={star} className={color}>
                            ★
                        </span>
                    );
                }

                return (
                    <button
                        key={star}
                        type='button'
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHover(star)}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        className={`${color} hover:scale-110 transition`}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
}

export default StarRating;