
import PropType from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/actions/miscActions';


const ProductGallery = (props) => {
  const {
    products, filteredProducts, isLoading, requestStatus
  } = props;
  const [isFetching, setFetching] = useState(false);


  return (
    <div className="scroll-container">
      <ul>
        {/* {(products.length === 0) ? new Array(skeletonCount).fill({}).map((product, index) => (
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
        ))} */}
      </ul>
    </div>
  );
};

export default ProductGallery;


ProductGallery.propTypes = {
  // products: PropType.object.isRequired,
  // isLoading: PropType.bool.isRequired,
  // requestStatus: PropType.string,
  // children: PropType.oneOfType([
  //   PropType.arrayOf(PropType.node),
  //   PropType.node
  // ]).isRequired
};