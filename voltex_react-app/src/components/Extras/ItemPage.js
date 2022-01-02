import React from 'react';
import PropTypes from 'prop-types';
import Item from './item';
import './css/test.css';

var page = 'Item Page';
const ItemPage = ({items, onAddToCart}) => {
    return(
        <ul className='ItemPage-items'>
            {items.map(item =>
            <li key={item.id} className='ItemPage-item'>
                <Item item={item}>
                <button className='Item-AddToCart' onClick={() => onAddToCart(item, page)}>
                Add To Cart
                </button>
                </Item>
            </li>    
            )}
        </ul>
    );
}

ItemPage.propTypes = {
    items: PropTypes.array.isRequired,
    onAddToCart: PropTypes.func.isRequired,
};

export default ItemPage;