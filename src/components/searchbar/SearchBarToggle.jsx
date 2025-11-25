import PropType from 'prop-types';

const SearchBarToggle = ({ children }) => {
  const onClickToggle = () => {
    if (document.body.classList.contains('is-searchbar-open')) {
      document.body.classList.remove('is-searchbar-open');
      document.body.querySelector('.content').classList.remove('blurred');
    } else {
      document.body.classList.add('is-searchbar-open');
      document.body.querySelector('.content').classList.add('blurred');
    }
  };

  document.addEventListener('click', (e) => {
    const closest = e.target.closest('.searchbar');
    const toggle = e.target.closest('.searchbar-toggle');
    const closeToggle = e.target.closest('.searchbar-item-remove');

    if (!closest && document.body.classList.contains('is-searchbar-open') && !toggle && !closeToggle) {
      document.body.classList.remove('is-searchbar-open');
      document.body.querySelector('.content').classList.remove('blurred');
    }
  });

  return children({ onClickToggle });
};

SearchBarToggle.propTypes = {
  children: PropType.oneOfType([
    PropType.arrayOf(PropType.node),
    PropType.func,
    PropType.node
  ]).isRequired
};

export default SearchBarToggle;
