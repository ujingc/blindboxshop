
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

  const onClickScrollLeft = () => {
    document.body.querySelector('.product-gellary').scrollLeft -= 300
  }

  const onClickScrollRight = () => {
    document.body.querySelector('.product-gellary').scrollLeft += 300
  }

  return (
    <div className='product-gallery-container'>
      <div className="product-gellary">
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
      <div className="product-gellary-footer">
          <div className='product-gallery-nav'>
            <ul>
              <li>
                <button
                  className="gallery-nav-button"
                  onClick={onClickScrollLeft}
                  type="button"
                >
                  <i className="fa fa-chevron-left" aria-hidden="true" style={{ fontSize: '1rem' }}></i>
                </button>
              </li>
              <li>
                <button
                  className="gallery-nav-button"
                  onClick={onClickScrollRight}
                  type="button"
                >
                  <i className="fa fa-chevron-right" aria-hidden="true" style={{ fontSize: '1rem' }}></i>
                </button>
              </li>
            </ul>
          </div>
      </div>
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
