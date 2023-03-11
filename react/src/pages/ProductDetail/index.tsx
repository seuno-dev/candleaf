import React, { useState } from "react";
import { Alert, Button, Typography } from "@material-tailwind/react";
import { useProductDetail } from "../Products/hooks";
import { useNavigate, useParams } from "react-router-dom";

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

  const { id, title, description, price, images } = useProductDetail(slug);
  const mainImage = images.length > 0 ? images[0].image : "logo512.png";

  const showAlertTemporarily = (setShowAlert: (show: boolean) => void) => {
    setShowAlert(true);
    const timer = setTimeout(() => {
      setShowAlert(false);
      clearTimeout(timer);
    }, 3000);
  };

  const onAddToCart = () => {
    addToCart(id).then((isSuccess) => {
      if (isSuccess) {
        showAlertTemporarily(setShowCartSuccessAlert);
      } else {
        showAlertTemporarily(setShowCartFailedAlert);
      }
    });
  };

  return (
    <div>
      <div className="absolute w-full">
        <Alert
          className="w-80 mx-auto"
          show={showCartSuccessAlert}
          color="green"
          dismissible={{ onClose: () => setShowCartSuccessAlert(false) }}
        >
          Added to cart successfully.
        </Alert>
        <Alert
          className="w-80 mx-auto"
          show={showCartFailedAlert}
          color="red"
          dismissible={{ onClose: () => setShowCartFailedAlert(false) }}
        >
          Failed adding to cart.
        </Alert>
      </div>
      <div className="mt-5 mx-auto flex flex-row justify-center">
        <div className="w-[350px] h-full">
          <img src={mainImage} alt={`Image of product ${title}`} />
        </div>
        <div className="w-[480px] ml-4 flex flex-col">
          <Typography variant="h4" className="break-words">
            {title}
          </Typography>
          <Typography variant="h2" className="mt-6">
            ${price}
          </Typography>
          <div className="border-t-[0.5px] mt-5 border-gray-200">
            <Typography variant="paragraph">{description}</Typography>
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
