import React from 'react';
import PropTypes from 'prop-types';
import Item from './item';
import './css/test.css';

var page = 'Cart page';


const CartPage = ({items, onAddOne, onRemoveOne, calculatePrice, totalprice}) => {

    return(
        <ul className='CartPage-items'>
            {items.map(item =>
            <li key={item.id} className='CartPage-item' onLoad={() =>  calculatePrice(item.price, item.count)}>
                <Item item={item}>
                <div className='CartItem-controls'>
                    <button className='CartItem-removeOne' onClick={() => {onRemoveOne(item); calculatePrice(item.price, item.count)}}>&ndash;</button>
                    <span className='CartItem-count' >{item.count}</span>
                    <button className='CartItem-addOne' onClick={() => {onAddOne(item, page);  calculatePrice(item.price, item.count)}}>+</button>
                </div>
                </Item>
                
            </li>    
            )}
            <div className='Totalprice'>
                Total Price: ${totalprice()}
            </div>
        </ul>
    );
}
CartPage.propTypes ={
    items: PropTypes.array.isRequired,
    onAddOne: PropTypes.func.isRequired,
    onRemoveOne: PropTypes.func.isRequired,
    calculatePrice: PropTypes.func,
    totalprice: PropTypes.func
};

export default CartPage;