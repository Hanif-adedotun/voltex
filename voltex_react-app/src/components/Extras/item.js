import React from 'react';
import PropTypes from 'prop-types';
import './css/test.css';
import Fileicon from './images/logo4.png';

const Item = ({item, children}) => (
    <div className='Item'>
        <div className='Item-left'>
            <div className='Item-image'><img className='Image' src={Fileicon} alt='Item Icon'/></div>
            <div className='Item-title'>
                {item.name}
            </div>
            <div className='Item-description'>
                {item.description}
            </div>
        </div>
        <div className='Item-right'>
            <div className='Item-price'>
                ${item.price}
            </div>
            {children}
        </div>
    </div>
);

Item.propTypes = {
    item: PropTypes.object.isRequired,
    children: PropTypes.node
}


export default Item;