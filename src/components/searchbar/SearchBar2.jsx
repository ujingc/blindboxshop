import { Boundary, Modal } from '@/components/common';

import React, { useEffect } from 'react';
import { useDidMount, useModal } from '@/hooks';

const SearchBar2 = () => {
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();
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
    </Boundary>
  )
}

export default SearchBar2;
