import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useProductFilters = (products) => {
  const [searchParams] = useSearchParams();

  const gradeFilter = searchParams.get("grade");
  const categoryFilter = searchParams.get("category");
  const searchFilter = searchParams.get("search");
  const sortFilter = searchParams.get("sort");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesGrade = gradeFilter
        ? product.grade === gradeFilter
        : true;

      const matchesCategory = categoryFilter
        ? product.category === categoryFilter
        : true;

      const matchesSearch = searchFilter
        ? product.name
            .toLowerCase()
            .includes(searchFilter.toLowerCase())
        : true;

      const matchesMinPrice = minPrice
        ? product.price >= Number(minPrice)
        : true;

      const matchesMaxPrice = maxPrice
        ? product.price <= Number(maxPrice)
        : true;

      return (
        matchesGrade &&
        matchesCategory &&
        matchesSearch &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    if (sortFilter === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortFilter === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    products,
    gradeFilter,
    categoryFilter,
    searchFilter,
    sortFilter,
    minPrice,
    maxPrice,
  ]);

  return {
    filteredProducts,
    gradeFilter,
    categoryFilter,
    searchFilter,
    sortFilter,
    minPrice,
    maxPrice,
    searchParams,
  };
};