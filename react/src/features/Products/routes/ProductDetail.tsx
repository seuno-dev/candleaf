import React, { useEffect, useState } from "react";
import { Alert, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatCurrency } from "../../../utils/currency";
import { Product, ProductImage } from "../types";
import ProductRatingLabel from "../components/ProductRatingLabel";
import ProductReview from "../components/ProductReview";
import useAddCartItem from "../../Cart/hooks/useAddCartItem";
import { retrieveProductDetail } from "../api";

function ProductDetail() {
  const [product, setProduct] = useState<Product>({
    category: null,
    description: "",
    id: 0,
    images: [],
    inventory: 0,
    title: "",
    slug: "",
    unitPrice: 0,
    averageRating: null,
    reviewCount: 0,
    reviews: [],
  });
  const { mutate, isSuccess, isError } = useAddCartItem();

  const { slug } = useParams();
  const [showCartSuccessAlert, setShowCartSuccessAlert] = useState(false);
  const [showCartFailedAlert, setShowCartFailedAlert] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ProductImage | undefined>(
    undefined
  );

  const defaultImagesClassName = "w-16 h-16 mr-3 rounded-lg";

  const navigate = useNavigate();
  if (!slug) {
    navigate("/");
    return <></>;
  }

  useEffect(() => {
    retrieveProductDetail(slug).then((product) => setProduct(product));
  }, []);

  useEffect(() => {
    setSelectedImage(product.images.length > 0 ? product.images[0] : undefined);
  }, [product]);

  useEffect(() => {
    if (isSuccess) {
      showAlertTemporarily(setShowCartSuccessAlert);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      showAlertTemporarily(setShowCartFailedAlert);
    }
  }, [isError]);

  const showAlertTemporarily = (setShowAlert: (show: boolean) => void) => {
    setShowAlert(true);
    const timer = setTimeout(() => {
      setShowAlert(false);
      clearTimeout(timer);
    }, 3000);
  };

  const onAddToCart = () => {
    mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <div className="container mx-auto">
      <div className="absolute container flex justify-center">
        <Alert
          className="w-80"
          show={showCartSuccessAlert}
          color="green"
          dismissible={{ onClose: () => setShowCartSuccessAlert(false) }}
        >
          Added to cart successfully.
        </Alert>
        <Alert
          className="w-80"
          show={showCartFailedAlert}
          color="red"
          dismissible={{ onClose: () => setShowCartFailedAlert(false) }}
        >
          Failed adding to cart.
        </Alert>
      </div>
      <div className="mt-5 flex flex-row justify-center">
        <div className="w-[380px] h-full flex flex-col items-center">
          <img
            className="object-cover w-[350px] h-[350px]"
            src={selectedImage ? selectedImage.image : "logo512.png"}
            alt={`Image of product ${product.title}`}
          />
          <div className="overflow-x-auto flex flex-row pt-10">
            {product.images.map((image) => (
              <img
                className={
                  image === selectedImage
                    ? defaultImagesClassName +
                      " border-light-green-500 border-2"
                    : defaultImagesClassName
                }
                key={image.id}
                src={image.image}
                onPointerEnter={() => setSelectedImage(image)}
                alt={`Image of product ${product.title}`}
              />
            ))}
          </div>
        </div>
        <div className="w-[480px] ml-4 flex flex-col">
          <Typography variant="h4" className="break-words">
            {product.title}
          </Typography>
          {product.averageRating && <ProductRatingLabel product={product} />}
          <Typography variant="h2" className="mt-6">
            {formatCurrency(product.unitPrice)}
          </Typography>
          <div className="border-t-[0.5px] mt-5 border-gray-200">
            {product.category && (
              <Typography>
                Category:{" "}
                <Link
                  className="text-light-green-700 font-bold"
                  to={`/products/?category=${product.category.id}`}
                >
                  {product.category.title}
                </Link>
              </Typography>
            )}
            <Typography className="mt-5" variant="paragraph">
              {product.description}
            </Typography>
          </div>
          <div className="border-t-[0.5px] mt-5 border-gray-200 flex flex-col gap-4">
            <Typography variant="h6">Reviews</Typography>
            {product.reviews.map((review) => (
              <ProductReview review={review} key={review.id} />
            ))}
          </div>
        </div>
        <div className="w-[270px] ml-4 flex flex-col items-center">
          <Button
            fullWidth={true}
            color="light-green"
            onClick={onAddToCart}
            disabled={product.inventory === 0}
          >
            Add to cart
          </Button>
          {product.inventory === 0 && (
            <Typography className="mt-3" color="red" variant="h6">
              Out of stock
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
