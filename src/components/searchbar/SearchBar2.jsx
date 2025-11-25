import { Boundary, Modal } from '@/components/common';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { clearRecentSearch, removeSelectedRecent } from '@/redux/actions/filterActions';
import Badge from '../common/Badge';
import React, { useEffect, useState, useRef } from 'react';
import { useDidMount, useModal } from '@/hooks';

const SearchBar2 = () => {
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();
  const [searchInput, setSearchInput] = useState('');
  const { filter, isLoading } = useSelector((state) => ({
    filter: state.filter,
    isLoading: state.app.loading
  }));
  const searchbarRef = useRef(null);
  const history = useHistory();

  const dispatch = useDispatch();
  const isMobile = window.screen.width <= 800;

  const onSearchChange = (e) => {
    const val = e.target.value.trimStart();
    setSearchInput(val);
  };

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      // dispatch(setTextFilter(searchInput));
      e.target.blur();
      searchbarRef.current.classList.remove('is-open-recent-search');

      if (isMobile) {
        history.push('/');
      }

      history.push(`/search/${searchInput.trim().toLowerCase()}`);
    }
  };

  const recentSearchClickHandler = (e) => {
    const searchBar = e.target.closest('.searchbar');

    if (!searchBar) {
      searchbarRef.current.classList.remove('is-open-recent-search');
      document.removeEventListener('click', recentSearchClickHandler);
    }
  };

  const onFocusInput = (e) => {
    e.target.select();

    if (filter.recent.length !== 0) {
      searchbarRef.current.classList.add('is-open-recent-search');
      document.addEventListener('click', recentSearchClickHandler);
    }
  };

  const onClickRecentSearch = (keyword) => {
    // dispatch(setTextFilter(keyword));
    searchbarRef.current.classList.remove('is-open-recent-search');
    history.push(`/search/${keyword.trim().toLowerCase()}`);
  };

  const onClearRecent = () => {
    dispatch(clearRecentSearch());
  };

  return (
    <Boundary>
      <Modal
        isOpen={isOpenModal}
        onRequestClose={onCloseModal}
      >
        <div className="d-flex-center">
          <button
            className="button button-border button-border-gray button-small"
            onClick={onCloseModal}
            type="button"
          >
            Continue shopping
          </button>
          &nbsp;
          <button
            className="button button-small"
            onClick={()=>console.log('sign in')}
            type="button"
          >
            Sign in to checkout
          </button>
        </div>
      </Modal>

      <div className="searchbar" ref={searchbarRef}>
        <div className='searchbar-content'>
          <SearchOutlined className="searchbar-icon" />
          <input
            className="search-input searchbar-input"
            onChange={onSearchChange}
            onKeyUp={onKeyUp}
            onFocus={onFocusInput}
            placeholder="Search product..."
            readOnly={isLoading}
            type="text"
            value={searchInput}
          />
          {filter.recent.length !== 0 && (
            <div className="searchbar-recent">
              <div className="searchbar-recent-header">
                <h5>Recent Search</h5>
                <h5
                  className="searchbar-recent-clear text-subtle"
                  onClick={onClearRecent}
                  role="presentation"
                >
                  Clear
                </h5>
              </div>
              {filter.recent.map((item, index) => (
                <div
                  className="searchbar-recent-wrapper"
                  key={`search-${item}-${index}`}
                >
                  <h5
                    className="searchbar-recent-keyword margin-0"
                    onClick={() => onClickRecentSearch(item)}
                    role="presentation"
                  >
                    {item}
                  </h5>
                  <span
                    className="searchbar-recent-button text-subtle"
                    onClick={() => dispatch(removeSelectedRecent(item))}
                    role="presentation"
                  >
                    X
                  </span>
                </div>
              ))}
              
            </div>
          )}
        </div>
      </div>
    </Boundary>
  )
}

export default SearchBar2;
