import React, { useState } from 'react';
import toyShopImg from '@/assets/images/toy-shop.png';


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
  onAddToBasket, // Function to call when "Add to Bag" is clicked
}) => {
  // State to manage the buy option: 'single' or 'set'
  const [buyOption, setBuyOption] = useState('single');
  const [quantity, setQuantity] = useState(1); // Initial quantity state
  // Determine the price to display based on the selected option
  const currentDisplayPrice = buyOption === 'single' ? productPrice : productSetPrice;
  const isFreeShipping = currentDisplayPrice >= freeShippingThreshold;

  const handleIncrease = () => {
      setQuantity(prevQuantity => prevQuantity + 1); // Increase quantity
  };

  const handleDecrease = () => {
      setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1)); // Decrease quantity, not below 1
  };

  const handleQuantityChange = (event) => {
      const value = event.target.value; // Get the current value
      // Update quantity only if the value is a valid number
      if (value === '' || value === null) {
          setQuantity(1); // Set to 1 if input is empty
      } else {
          const parsedValue = Math.max(1, parseInt(value, 10)); // Ensure quantity is at least 1
          setQuantity(parsedValue);
      }
  };

  const handleBlur = () => {
      if (quantity === '' || quantity === null) {
          setQuantity(1); // Set to 1 if input is empty on blur
      }
  };


  const handleBuyOptionChange = (event) => {
    setBuyOption(event.target.value);
  };

  const handleAddToBasketClick = () => {
    onAddToBasket({ option: buyOption, price: currentDisplayPrice, quantity: quantity});
  };

  return (
    <footer className="product-sticky-footer">
      <div className="product-sticky-footer__content">
        {/* Pricing & Delivery */}
        <img
          src={toyShopImg}
          alt={'toy shop'}
          className="product-sticy-footer__product-image"
        />
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
                <label className={`product-sticky-footer__buy-option ${buyOption === 'single' ? 'selected' : ''}`}>
                    <input type="radio" name="buyOption" value="single" checked={buyOption === 'single'} onChange={handleBuyOptionChange} />
                    <span className="icon">🐻</span> 
                    One Toy
                </label>
                <label className={`product-sticky-footer__buy-option ${buyOption === 'set' ? 'selected' : ''}`}>
                    <input type="radio" name="buyOption" value="set" checked={buyOption === 'set'} onChange={handleBuyOptionChange} disabled={!productSetPrice || productSetPrice <= 0} />
                    <span className="icon">🎁</span> 
                    Whole Collection
                </label>
            </div>
            <div className="quantity-selector">
                <button className="quantity-button" onClick={handleDecrease}>-</button>
                <input
                    type="number"
                    className="quantity-input"
                    value={quantity}
                    onChange={handleQuantityChange}
                    onBlur={handleBlur}  // New onBlur event
                    min="1" // Set minimum quantity
                    max="12"
                />
                <button className="quantity-button" onClick={handleIncrease}>+</button>
            </div>
            <button className="product-sticky-footer__add-to-bag-btn" onClick={handleAddToBasketClick}>
                <ShoppingBagIcon /> Add to Bag
            </button>
        </div>
      </div>
    </footer>
  );
};

export default ProductStickyFooter;