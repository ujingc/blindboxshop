
import PropType from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/actions/miscActions';
import ProductGalleryItem from './ProductGalleryItem'

const ProductGallery = (props) => {
  const {
    products, skeletonCount
  } = props;
  const [isFetching, setFetching] = useState(false);

  return (
    <div className="product-section-gellary">
      <ul>
        {(products.length === 0) ? new Array(skeletonCount).fill({}).map((product, index) => (
          <ProductGalleryItem
            // eslint-disable-next-line react/no-array-index-key
            key={`product-skeleton ${index}`}
            product={product}
          />
        )) : products.map((product) => (
          <ProductGalleryItem
            key={product.id}
            product={product}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProductGallery;


ProductGallery.defaultProps = {
  skeletonCount: 4
};

ProductGallery.propTypes = {
  products: PropType.array.isRequired,
  skeletonCount: PropType.number
};
