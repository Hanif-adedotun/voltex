import React from 'react';
import './css/test.css';



const Nav = ({activeTab, onTabChange}) =>(
    <nav className='eCommerse-nav'>
        <ul>
            <li className={`eCommerse-nav-item ${activeTab === 0 && 'selected'}`}>
                <span onClick={() => onTabChange(0)}>Items</span>
            </li>
            <li className={`eCommerse-nav-item ${activeTab === 1 && 'selected'}`}>
                <span onClick={() => onTabChange(1)}>Cart</span>
            </li>
        </ul>
    </nav>
);

export default Nav;