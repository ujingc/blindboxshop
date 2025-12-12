import React, { useState, useEffect } from 'react';

// You'd pass these images as a prop to the component
// Example usage: <ProductImageCarousel images={['url1.jpg', 'url2.jpg', 'url3.jpg']} />

const ChevronLeftIcon = () => <i className="fa fa-chevron-left" aria-hidden="true" style={{ fontSize: '1rem' }}></i>;
const ChevronRightIcon = () =>  <i className="fa fa-chevron-right" aria-hidden="true" style={{ fontSize: '1rem' }}></i>;

const ProductImageCarousel = ({ images }) => {
  // State to keep track of the currently displayed main image
  const [mainImage, setMainImage] = useState(images[0] || '');
  // State to keep track of the index of the selected preview
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (images && images.length > 0) {
      // Only update if the images array or the first image has actually changed
      if (images[0] !== mainImage || selectedIndex !== 0) {
        setMainImage(images[0]);
        setSelectedIndex(0);
      }
    } else {
      setMainImage('');
      setSelectedIndex(0);
    }
  }, [images]); // Dependency array: re-run if 'images' prop changes

  const handlePreviewClick = (imageSrc, index) => {
    setMainImage(imageSrc);
    setSelectedIndex(index);
  };

  const handlePrevClick = () => {
    if (images.length <= 1) return; // No navigation needed for 1 or fewer images

    const newIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(newIndex);
    setMainImage(images[newIndex]);
  };

  const handleNextClick = () => {
    if (images.length <= 1) return; // No navigation needed for 1 or fewer images

    const newIndex = (selectedIndex + 1) % images.length;
    setSelectedIndex(newIndex);
    setMainImage(images[newIndex]);
  };

  if (!images || images.length === 0) {
    return <div className="product-carousel-empty">No product images available.</div>;
  }

  // Only show navigation buttons if there's more than one image
  const showNavButtons = images.length > 1;

  return (
    <div className="product-carousel">
      {/* Main Image Section */}
      <div className="product-carousel__main-image-wrapper">
        <img
          src={mainImage}
          alt="Main product view"
          className="product-carousel__main-image"
        />

        {/* Navigation Buttons */}
        {showNavButtons && (
          <>
            <button className="product-carousel__nav-button product-carousel__nav-button--prev" onClick={handlePrevClick}>
              <ChevronLeftIcon /> {/* Replace with your actual icon component */}
            </button>
            <button className="product-carousel__nav-button product-carousel__nav-button--next" onClick={handleNextClick}>
              <ChevronRightIcon /> {/* Replace with your actual icon component */}
            </button>
          </>
        )}
      </div>

      {/* Small Image Previews Section */}
      <div className="product-carousel__previews">
        {images.map((image, index) => (
          <div
            key={index}
            className={`product-carousel__preview-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => handlePreviewClick(image, index)}
          >
            <img
              src={image}
              alt={`Product preview ${index + 1}`}
              className="product-carousel__preview-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarousel;