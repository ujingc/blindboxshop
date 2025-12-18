import { displayActionMessage } from '@/helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
import { addToBasket as dispatchAddToBasket, removeFromBasket, updateQuantityToBasket } from '@/redux/actions/basketActions';

const useBasket = () => {
  const { basket } = useSelector((state) => ({ basket: state.basket }));
  const dispatch = useDispatch();

  const isItemOnBasket = (id) => !!basket.find((item) => item.id === id);

  const addToBasket = (product) => {
    console.log('addToBasket is called')
    if (isItemOnBasket(product.id)) {
      dispatch(updateQuantityToBasket(product.id));
      displayActionMessage('Item added to basket', 'success');
    } else {
      dispatch(dispatchAddToBasket(product));
      displayActionMessage('Item added to basket', 'success');
    }
  };

  return { basket, isItemOnBasket, addToBasket };
};

export default useBasket;
