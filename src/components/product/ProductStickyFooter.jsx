import React, { useState } from 'react';

// Placeholder icons - replace these with actual icons from your library
// Example using react-icons:
// import { FaTruck, FaShoppingBag } from 'react-icons/fa';
const TruckIcon = () => <span style={{ marginRight: '5px' }}>🚚</span>; // Replace with your Truck icon component
const ShoppingBagIcon = () => <span style={{ marginRight: '5px' }}>🛍️</span>; // Replace with your Shopping Bag icon component


const ProductStickyFooter = ({
  productPrice, // e.g., 25.00
  productSetPrice, // e.g., 100.00 (price for the whole collection)
  deliveryEstimate, // e.g., "Arrives by Dec 24th"
  freeShippingThreshold, // e.g., 50.00
  onAddToBag, // Function to call when "Add to Bag" is clicked
}) => {
  // State to manage the buy option: 'single' or 'set'
  const [buyOption, setBuyOption] = useState('single');

  // Determine the price to display based on the selected option
  const currentDisplayPrice = buyOption === 'single' ? productPrice : productSetPrice;
  const isFreeShipping = currentDisplayPrice >= freeShippingThreshold;

  const handleBuyOptionChange = (event) => {
    setBuyOption(event.target.value);
  };

  const handleAddToBagClick = () => {
    // Call the provided onAddToBag function, passing the selected option and price
    onAddToBag({ option: buyOption, price: currentDisplayPrice });
    alert(`Added ${buyOption === 'single' ? 'one toy' : 'the whole collection'} to bag for $${currentDisplayPrice.toFixed(2)}`);
    // In a real app, you'd dispatch an action to a cart/store
  };

  return (
    <footer className="product-sticky-footer">
      <div className="product-sticky-footer__content">
        {/* Pricing & Delivery */}
        <div className="product-sticky-footer__left-section">
          <div className="product-sticky-footer__price">
            <span>$</span>{currentDisplayPrice.toFixed(2)}
          </div>
          <div className="product-sticky-footer__delivery-info">
            <TruckIcon />
            <span>{deliveryEstimate}</span>
          </div>
          {isFreeShipping ? (
            <div className="product-sticky-footer__shipping-discount">
              Free Shipping!
            </div>
          ) : (
            <div className="product-sticky-footer__shipping-discount product-sticky-footer__shipping-discount--cta">
              Spend ${(freeShippingThreshold - currentDisplayPrice).toFixed(2)} more for Free Shipping!
            </div>
          )}
        </div>

        {/* Buy Option & Add to Bag */}
        <div className="product-sticky-footer__right-section">
          <div className="product-sticky-footer__buy-options">
            <label className="product-sticky-footer__buy-option">
              <input
                type="radio"
                name="buyOption"
                value="single"
                checked={buyOption === 'single'}
                onChange={handleBuyOptionChange}
              />
              One Toy
            </label>
            <label className="product-sticky-footer__buy-option">
              <input
                type="radio"
                name="buyOption"
                value="set"
                checked={buyOption === 'set'}
                onChange={handleBuyOptionChange}
                disabled={!productSetPrice || productSetPrice <= 0} // Disable if set price isn't available
              />
              Whole Collection
            </label>
          </div>

          <button
            className="product-sticky-footer__add-to-bag-btn"
            onClick={handleAddToBagClick}
          >
            <ShoppingBagIcon />
            Add to Bag
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ProductStickyFooter;