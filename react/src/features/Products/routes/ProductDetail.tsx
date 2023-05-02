import React, { useEffect, useState } from "react";
import { Alert, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatCurrency } from "../../../utils/currency";
import { createCartItem, retrieveProductDetail } from "../api";
import { Product } from "../types";
import ProductRating from "../components/ProductRating";

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
    ratingCount: 0,
  });

  const { slug } = useParams();
  const [showCartSuccessAlert, setShowCartSuccessAlert] = useState(false);
  const [showCartFailedAlert, setShowCartFailedAlert] = useState(false);

  const navigate = useNavigate();
  if (!slug) {
    navigate("/");
    return <></>;
  }

  useEffect(() => {
    retrieveProductDetail(slug).then((product) => setProduct(product));
  }, []);

  const showAlertTemporarily = (setShowAlert: (show: boolean) => void) => {
    setShowAlert(true);
    const timer = setTimeout(() => {
      setShowAlert(false);
      clearTimeout(timer);
    }, 3000);
  };

  const onAddToCart = () => {
    createCartItem(product.id).then((isSuccess) => {
      if (isSuccess) {
        showAlertTemporarily(setShowCartSuccessAlert);
      } else {
        showAlertTemporarily(setShowCartFailedAlert);
      }
    });
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
        <div className="w-[350px] h-full">
          <img
            src={
              product.images.length > 0
                ? product.images[0].image
                : "logo512.png"
            }
            alt={`Image of product ${product.title}`}
          />
        </div>
        <div className="w-[480px] ml-4 flex flex-col">
          <Typography variant="h4" className="break-words">
            {product.title}
          </Typography>
          {product.averageRating && <ProductRating product={product} />}
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
        </div>
        <div className="w-[270px] ml-4">
          <Button fullWidth={true} color="light-green" onClick={onAddToCart}>
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
