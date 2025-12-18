import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { ColorChooser, ImageLoader, MessageDisplay } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { RECOMMENDED_PRODUCTS, SHOP } from '@/constants/routes';
import { displayMoney } from '@/helpers/utils';
import {
  useBasket,
  useDocumentTitle,
  useProduct,
  useRecommendedProducts,
  useScrollTop
} from '@/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';
import ProductImageCarousel from '@/components/product/ProductImageCarousel';
import ProductStickyFooter from '@/components/product/ProductStickyFooter';

const ViewProduct = () => {
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id);
  const { collection } = useProduct(product?.collectionId)
  const { addToBasket, isItemOnBasket } = useBasket(id);
  useScrollTop();
  useDocumentTitle(`View ${product?.name || 'Item'}`);

  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured
  } = useRecommendedProducts(6);
  const colorOverlay = useRef(null);

  useEffect(() => {
    setSelectedImage(product?.image);
  }, [product]);

  const onSelectedSizeChange = (newValue) => {
    setSelectedSize(newValue.value);
  };

  const onSelectedColorChange = (color) => {
    setSelectedColor(color);
    if (colorOverlay.current) {
      colorOverlay.current.value = color;
    }
  };

  const handleAddToBasket = (args) => {
    const { option, price, quantity } = args;
    if(product){
      addToBasket({ ...product, selectedColor, quantity: quantity});
    }
  };

  return (
    <main className="content">
      {isLoading && (
        <div className="loader">
          <h4>Loading Product...</h4>
          <br />
          <LoadingOutlined style={{ fontSize: '3rem' }} />
        </div>
      )}
      {error && (
        <MessageDisplay message={error} />
      )}
      {(product && !isLoading) && (
        <div className="product-view">
          <Link to={SHOP}>
            <h3 className="button-link d-inline-flex zIndex99">
              <ArrowLeftOutlined />
              &nbsp;
            </h3>
          </Link>
          <div className="product-modal">
              <ProductImageCarousel
                images={[...product?.images || ''
                ]}
              /> 
              <ProductStickyFooter
                productPrice={25.00}
                productSetPrice={100.00} // Example: price for 5 toys in a set
                deliveryEstimate="Arrives by Tuesday, Dec 24th"
                freeShippingThreshold={50.00}
                onAddToBasket={handleAddToBasket}
              />
          </div>
          <div> 
          </div>

          <div className='product-modal-action'>

            <hr></hr>
          </div>

          <div style={{ marginTop: '10rem' }}>
            <div className="display-header">
              <h1>Recommended</h1>
              <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
            </div>
            {errorFeatured && !isLoadingFeatured ? (
              <MessageDisplay
                message={error}
                action={fetchRecommendedProducts}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid products={recommendedProducts} skeletonCount={3} />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default ViewProduct;
