import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../../components/Elements/Pagination";
import { formatCurrency } from "../../../utils/currency";
import { retrieveProductList } from "../api";
import { Product } from "../types";
import FilterSideBar from "../components/filter";

function ProductSearch() {
  const [searchParams] = useSearchParams();
  const [products, setProductList] = useState<Product[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadPage = (page: number) => {
    const title = searchParams.get("title");
    const category = searchParams.get("category");
    const priceMin = searchParams.get("price_min");
    const priceMax = searchParams.get("price_max");

    retrieveProductList({
      page,
      title,
      category,
      priceMin,
      priceMax,
    }).then((productList) => {
      setProductList(productList.results);
      setPageCount(productList.totalPages);
    });
  };

  const handlePageClick = (e: { selected: number }) => {
    const newPage = e.selected + 1;
    loadPage(newPage);
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
    loadPage(1);
    setSelectedCategory(searchParams.get("category"));
    setMinPrice(searchParams.get("price_min") || "");
    setMaxPrice(searchParams.get("price_max") || "");
  }, [searchParams]);

  return (
    <div className="container mx-auto mt-5 flex flex-row">
      <div className="w-[480px]">
        <FilterSideBar
          minPrice={minPrice}
          maxPrice={maxPrice}
          onCategorySelect={handleCategorySelect}
          onPriceFilter={handlePriceFilter}
          selectedCategory={selectedCategory}
        />
      </div>
      <div className="ml-5">
        <ul className="flex flex-row flex-wrap gap-1">
          {products.map((product) => (
            <Link key={product.id} to={`/products/${product.slug}`}>
              <ProductCard
                title={product.title}
                price={formatCurrency(product.unitPrice)}
                imageUrl={
                  product.images.length > 0
                    ? product.images[0].image
                    : "logo512.png"
                }
              />
            </Link>
          ))}
        </ul>
        <div className="mt-5 flex flex-row justify-center">
          <Pagination onPageChange={handlePageClick} pageCount={pageCount} />
        </div>
      </div>
    </div>
  );
}

export default ProductSearch;
