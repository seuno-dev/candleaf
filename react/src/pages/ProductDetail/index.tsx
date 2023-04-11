import React, { useState } from "react";
import { Alert, Button, Typography } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { toCurrencyString } from "../../utils/currency";
import { useProductDetail } from "./hooks";

type ProductDetailProps = {
  addToCart: (productId: number) => Promise<boolean>;
};

function ProductDetail({ addToCart }: ProductDetailProps) {
  const { slug } = useParams();
  const [showCartSuccessAlert, setShowCartSuccessAlert] = useState(false);
  const [showCartFailedAlert, setShowCartFailedAlert] = useState(false);

  const navigate = useNavigate();
  if (!slug) {
    navigate("/");
    return <></>;
  }

  const { product } = useProductDetail(slug);
  const mainImage =
    product.images.length > 0 ? product.images[0].url : "logo512.png";

  const showAlertTemporarily = (setShowAlert: (show: boolean) => void) => {
    setShowAlert(true);
    const timer = setTimeout(() => {
      setShowAlert(false);
      clearTimeout(timer);
    }, 3000);
  };

  const onAddToCart = () => {
    addToCart(product.id).then((isSuccess) => {
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
          <img src={mainImage} alt={`Image of product ${product.title}`} />
        </div>
        <div className="w-[480px] ml-4 flex flex-col">
          <Typography variant="h4" className="break-words">
            {product.title}
          </Typography>
          <Typography variant="h2" className="mt-6">
            {toCurrencyString(product.unitPrice)}
          </Typography>
          <div className="border-t-[0.5px] mt-5 border-gray-200">
            <Typography variant="paragraph">{product.description}</Typography>
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
