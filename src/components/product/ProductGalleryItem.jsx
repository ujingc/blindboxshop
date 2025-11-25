import { CheckOutlined } from '@ant-design/icons';
import { ImageLoader } from '@/components/common';
import { displayMoney } from '@/helpers/utils';
import PropType from 'prop-types';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';

const ProductGalleryItem = ({ product, isItemOnBasket, addToBasket }) => {
  const history = useHistory();

  const onClickItem = () => {
    if (!product) return;

    if (product.id) {
      history.push(`/product/${product.id}`);
    }
  };

  const imgsrc = 'https://www.popcornstore.com.hk/cdn/shop/products/IMG_5772_002__clipped_rev_1.jpg?v=1655953045'
  const itemOnBasket = isItemOnBasket ? isItemOnBasket(product.id) : false;

  const handleAddToBasket = () => {
    if (addToBasket && product) addToBasket({ ...product, selectedSize: '0' });
  };

  return (
    <li>
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div
        className={`product-card ${!product.id ? 'product-loading' : ''}`}
        style={{
          border: product && itemOnBasket ? '1px solid #a6a5a5' : '',
          boxShadow: product && itemOnBasket ? '0 10px 15px rgba(0, 0, 0, .07)' : 'none'
        }}
      >
        {itemOnBasket && <CheckOutlined className="fa fa-check product-card-check" />}
        <div
          className="product-card-content"
          onClick={onClickItem}
          role="presentation"
        >
          <div className="product-card-img-wrapper">
            {imgsrc ? (
              <ImageLoader
                alt={product.name}
                className="product-card-img"
                src={imgsrc}
              />
            ) : <Skeleton width="100%" height="90%" />}
          </div>
          <div className="product-details">
            <h5 className="product-card-name text-overflow-ellipsis margin-auto">
              {product.name || <Skeleton width={80} />}
            </h5>
            <p className="product-card-brand">
              {product.type || <Skeleton width={60} />}
            </p>
            <h4 className="product-card-price">
              {product.price ? displayMoney(product.price) : <Skeleton width={40} />}
            </h4>
          </div>
        </div>
        {product.id && (
          <button
            className={`product-card-button button-small button button-block ${itemOnBasket ? 'button-border button-border-gray' : ''}`}
            onClick={handleAddToBasket}
            type="button"
          >
            {itemOnBasket ? 'Remove from basket' : 'Add to basket'}
          </button>
        )}

      </div>
    </SkeletonTheme>
    </li>
  );
};

ProductGalleryItem.defaultProps = {
  isItemOnBasket: undefined,
  addToBasket: undefined
};

ProductGalleryItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  product: PropType.object.isRequired,
  isItemOnBasket: PropType.func,
  addToBasket: PropType.func
};

export default ProductGalleryItem;
