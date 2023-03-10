import React from "react";
import { Button, Typography } from "@material-tailwind/react";
import { useProductDetail } from "../Products/hooks";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";

function ProductDetail() {
  const { slug } = useParams();

  const navigate = useNavigate();
  if (!slug) {
    navigate("/");
    return <></>;
  }

  const { title, description, price, images } = useProductDetail(slug);
  const mainImage = images.length > 0 ? images[0].image : "logo512.png";

  return (
    <div>
      <Navbar />
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
          <Button fullWidth={true} color="light-green">
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
