import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import Products from "../models/productModel.js";
import MESSAGES from "../constants/messages.js";

const SORT_OPTIONS = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    lowest: { rating: 1, createdAt: -1 },
    highest: { rating: -1, createdAt: -1 }
};

export const getAdminReviews = async (req, res, next) => {
    try {
        const { search, rating, sort } = req.query;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

        const match = {};
        // aggregate() does not convert strings for us, so rating becomes a real number
        if (rating) match.rating = Number(rating);

        const pipeline = [
            { $match: match },
            // join the reviewer and the product, like a SQL JOIN
            {
                $lookup: {
                    from: User.collection.name,
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: Products.collection.name,
                    localField: "product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } }
        ];

        if (search) {
            const safe = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = { $regex: safe, $options: "i" };

            pipeline.push({
                $match: {
                    $or: [
                        { comment: regex },
                        { "user.name": regex },
                        { "user.email": regex },
                        { "product.name": regex }
                    ]
                }
            });
        }

        pipeline.push(
            { $sort: SORT_OPTIONS[sort] || SORT_OPTIONS.newest },
            {
                // one pass gives both the page of results and the total count
                $facet: {
                    items: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        {
                            $project: {
                                rating: 1,
                                comment: 1,
                                createdAt: 1,
                                "user._id": 1,
                                "user.name": 1,
                                "user.email": 1,
                                "product._id": 1,
                                "product.name": 1,
                                "product.image": { $arrayElemAt: ["$product.images", 0] }
                            }
                        }
                    ],
                    total: [{ $count: "count" }]
                }
            }
        );

        const [[result], ratingGroups] = await Promise.all([
            Review.aggregate(pipeline),
            Review.aggregate([{ $group: { _id: "$rating", count: { $sum: 1 } } }])
        ]);

        const total = result.total[0]?.count || 0;

        // { 5: 3, 4: 1, 3: 0, ... } for the filter tabs
        const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        ratingGroups.forEach(({ _id, count }) => {
            ratingCounts[_id] = count;
        });

        res.status(200).json({
            success: true,
            message: MESSAGES.REVIEW.ADMIN_LIST_FETCHED,
            data: {
                reviews: result.items,
                total,
                page,
                pages: Math.ceil(total / limit),
                ratingCounts
            }
        });
    } catch (error) {
        next(error);
    }
};