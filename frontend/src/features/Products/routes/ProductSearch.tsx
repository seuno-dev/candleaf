import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import FilterSideBar from "../components/filter";
import useProducts from "../hooks/useProducts";
import {
  Box,
  Container,
  HStack,
  SimpleGrid,
  Stack,
  VStack,
} from "@chakra-ui/react";
import {
  Pagination,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  usePagination,
} from "@ajna/pagination";

const BURNING_TIME_MIN_KEY = "bt_min";
const BURNING_TIME_MAX_KEY = "bt_max";
const PRICE_MIN_KEY = "price_min";
const PRICE_MAX_KEY = "price_max";

function ProductSearch() {
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [burningTimeMin, setBurningTimeMin] = useState("");
  const [burningTimeMax, setBurningTimeMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const { currentPage, setCurrentPage, pages } = usePagination({
    pagesCount: totalPages,
    initialState: { currentPage: 1 },
  });
  const { data } = useProducts({
    page: currentPage,
    title,
    burningTimeMin,
    burningTimeMax,
    priceMax,
    priceMin,
  });
  const navigate = useNavigate();

  const handleBurningTimeFilter = (
    minPrice: number | null,
    maxPrice: number | null
  ) => {
    searchParams.set(BURNING_TIME_MIN_KEY, minPrice ? minPrice.toString() : "");
    searchParams.set(BURNING_TIME_MAX_KEY, maxPrice ? maxPrice.toString() : "");
    navigate({
      pathname: "/products",
      search: searchParams.toString(),
    });
  };

  const handlePriceFilter = (
    minBurningTime: number | null,
    maxBurningTime: number | null
  ) => {
    searchParams.set(
      PRICE_MIN_KEY,
      minBurningTime ? minBurningTime.toString() : ""
    );
    searchParams.set(
      PRICE_MAX_KEY,
      maxBurningTime ? maxBurningTime.toString() : ""
    );
    navigate({
      pathname: "/products",
      search: searchParams.toString(),
    });
  };

  useEffect(() => {
    setTotalPages(data?.totalPages || 0);
  }, [data]);

  useEffect(() => {
    const url = new URL(window.location.toString());
    url.searchParams.set("page", currentPage.toString());
    window.history.pushState(null, "", url.toString());
  }, [currentPage]);

  useEffect(() => {
    // Reset to the first page
    setCurrentPage(1);

    setTitle(searchParams.get("search") || "");
    setPriceMin(searchParams.get(PRICE_MIN_KEY) || "");
    setPriceMax(searchParams.get(PRICE_MAX_KEY) || "");
    setBurningTimeMin(searchParams.get(BURNING_TIME_MIN_KEY) || "");
    setBurningTimeMax(searchParams.get(BURNING_TIME_MAX_KEY) || "");
  }, [searchParams]);

  return (
    <Container maxW="container.xl" py={{ base: "20px", lg: "40px" }}>
      <Stack
        direction={{ base: "column", lg: "row" }}
        alignItems={{ base: "center", lg: "start" }}
        spacing={{ base: 0, lg: "100px" }}
      >
        <Box w={{ base: "full", lg: "256px" }}>
          <FilterSideBar
            minBurningTime={burningTimeMin}
            maxBurningTime={burningTimeMax}
            onBurningTimeFilter={handleBurningTimeFilter}
            minPrice={priceMin}
            maxPrice={priceMax}
            onPriceFilter={handlePriceFilter}
          />
        </Box>
        <VStack w="full" mt={{ base: "60px", lg: 0 }} alignItems="center">
          <SimpleGrid w="full" spacing="40px" minChildWidth="256px">
            {data?.results.map((product) => (
              <Box w="full" mx="auto" key={product.id}>
                <Link to={`/products/${product.slug}`}>
                  <ProductCard product={product} />
                </Link>
              </Box>
            ))}
          </SimpleGrid>
          <Box mt="24px">
            <Pagination
              pagesCount={data?.totalPages || 0}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              isDisabled={false}
            >
              <HStack spacing="10px">
                <PaginationPrevious size="sm" p="20px">
                  {"< previous"}
                </PaginationPrevious>
                <PaginationPageGroup align="center" spacing="10px">
                  {pages.map((page: number) => (
                    <PaginationPage
                      key={`pagination_page_${page}`}
                      page={page}
                      size="sm"
                      p="20px"
                      _current={{
                        isActive: true,
                      }}
                    />
                  ))}
                </PaginationPageGroup>
                <PaginationNext>{"next >"}</PaginationNext>
              </HStack>
            </Pagination>
          </Box>
        </VStack>
      </Stack>
    </Container>
  );
}

export default ProductSearch;
