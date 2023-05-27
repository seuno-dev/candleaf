import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../../components/Elements/Pagination";
import FilterSideBar from "../components/filter";
import useProducts from "../hooks/useProducts";

function ProductSearch() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [category, setCategory] = useState<string>();
  const { data } = useProducts({
    page,
    title,
    category,
    priceMax,
    priceMin,
  });
  const navigate = useNavigate();

  const handlePageClick = (e: { selected: number }) => {
    const newPage = e.selected + 1;
    setPage(newPage);

    const url = new URL(window.location.toString());
    url.searchParams.set("page", newPage.toString());
    window.history.pushState(null, "", url.toString());
  };

  const handleCategorySelect = (id: number | null) => {
    searchParams.set("category", id ? id.toString() : "");
    navigate({
      pathname: "/products",
      search: searchParams.toString(),
    });
  };

  const handlePriceFilter = (
    minPrice: number | null,
    maxPrice: number | null
  ) => {
    searchParams.set("price_min", minPrice ? minPrice.toString() : "");
    searchParams.set("price_max", maxPrice ? maxPrice.toString() : "");
    navigate({
      pathname: "/products",
      search: searchParams.toString(),
    });
  };

  useEffect(() => {
    setTitle(searchParams.get("search") || "");
    setPage(parseInt(searchParams.get("page") || "1"));
    setCategory(searchParams.get("category") || "");
    setPriceMin(searchParams.get("price_min") || "");
    setPriceMax(searchParams.get("price_max") || "");
  }, [searchParams]);

  return (
    <div className="container mx-auto mt-5 flex flex-row">
      <div className="w-[480px]">
        <FilterSideBar
          minPrice={priceMin}
          maxPrice={priceMax}
          onCategorySelect={handleCategorySelect}
          onPriceFilter={handlePriceFilter}
          selectedCategory={category}
        />
      </div>
      <div className="ml-5">
        <ul className="flex flex-row flex-wrap gap-1">
          {data?.results.map((product) => (
            <Link key={product.id} to={`/products/${product.slug}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </ul>
        <div className="mt-5 flex flex-row justify-center">
          <Pagination
            onPageChange={handlePageClick}
            pageCount={data?.totalPages || 0}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductSearch;
