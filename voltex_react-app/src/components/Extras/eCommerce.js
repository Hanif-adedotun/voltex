import React from 'react';
import './css/test.css';
import Nav from './Nav';
import ItemPage from './ItemPage';
import CartPage from './cart';

const items = [
    {
    id: 0,
    name: "Apple iPad Mini 2 16GB",
    description: "An iPad like no other. 16GB, WiFi, 4G.",
    price: 229.00
    },
    {
    id: 1,
    name: "Apple iPad Mini 2 32GB",
    description: "Even larger than the 16GB.",
    price: 279.00
    },
    {
    id: 2,
    name: "Canon T7i",
    description: "DSLR camera with lots of megapixels.",
    price: 749.99
    },
    {
    id: 3,
    name: "Apple Watch Sport",
    description: "A watch",
    price: 249.99
    },
    {
      id: 4,
      name: "Apple Watch Silver",
      description: "A more expensive watch",
      price: 599.99
      }
];



class eCommerse extends React.Component{
    state = {
        activeTab: 0,
        items: items,
        cart: [],
        popUpmessage: '',
        totalPrice: [],
        Numprice: 0
    };

    componentDidMount(){
        // fetch('/ecommerce/items')//fetch the data from our express server running on localhost:8080
        //  .then(res => res.json())//parse the data in json format
        //  .then(items => this.setState({items})) //, () => console.log('Dashboard updated', items)
        //  .catch( (error) =>{console.error('Unable to get data from database' + error);});
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    handleTabChange = (index) => {
        this.setState({
            activeTab: index
        });
    }

    handleAddToCart = (item, page) => {
        this.setState({
            cart: [...this.state.cart, item.id],//adds id to the other values in the array
        });

        if (page === 'Item Page'){
            this.setState({
                popUpmessage: 'Added to Cart!'
            });
        }
        console.log('Added to Cart');
        console.log('Items are: ' + this.state.cart);
    }

    handleRemoveOne = (item) => {
        let index = this.state.cart.indexOf(item.id);
        this.setState({
            cart: [
                ...this.state.cart.slice(0, index),
                ...this.state.cart.slice(index + 1)
            ]
        });
    }

    DisplayAddedMessage = () => {
        if (this.state.popUpmessage !== ''){
            return(
                <div className='popUpmessage'>
                   {this.state.popUpmessage}
                </div>
            )
        }
        this.interval = setInterval(() => this.setState({popUpmessage: ''}), 5000);
    };

    handleTotalPrice = (price, count) => {
        let unitprice = Number(price) * Number(count);

        this.setState({totalPrice: [...this.state.totalPrice, unitprice]}, () => {
            console.log(this.state.totalPrice);
            var total_price = this.state.totalPrice.reduce((sum, value) => {
                total_price = sum + value;
                this.setState({Numprice: total_price});
                return total_price;
            }, 0);
            console.log(total_price);
        });
        
            // , () => {
            // return this.state.totalPrice;
        
        
            // called after state has been updated
            // and the component has been re-rendered
            

            // let total_price = 0;
            // for(let i=0; i<this.state.totalPrice; i++){
            //     total_price += this.state.totalPrice[i];
            // }
            
    }
    returnTotalPrice = () =>{
        var totalprice = this.state.Numprice;
        console.log(totalprice);
        return Number(totalprice);
    }

    renderCart(){
        //Count number of elements in the CartPage
        let itemCounts = this.state.cart.reduce((itemCounts, itemId) => {
        itemCounts[itemId]= itemCounts[itemId] || 0;
        itemCounts[itemId]++;
        return itemCounts;
        }, {});

        //Create an array of items
        let cartItems = Object.keys(itemCounts).map(itemId =>{
            //Find element by its id
            var item = this.state.items.find(item =>
                item.id === parseInt(itemId, 10)
            );
               
            //Create a new item that has a count property
            return{
                ...item, 
                count: itemCounts[itemId]
            }
        });

        
        if(String(this.state.cart) === ''){
            console.log('Cart is Empty');
            return(
                <div className='emptyCart'>
                    <p>Your Cart is empty.</p> 
                    <p>Add new items to it now!</p>
                 </div>
            );
        }else{
            return (
                <CartPage items={cartItems} onAddOne={this.handleAddToCart} onRemoveOne={this.handleRemoveOne} calculatePrice = {this.handleTotalPrice} totalprice = {this.returnTotalPrice}/>
            );
        }
        
    }

    renderContent(){//Component to store all other smaller components
       switch(this.state.activeTab){
           default:
               case 0: return (<ItemPage items={this.state.items} onAddToCart={this.handleAddToCart}/>);
               case 1: return this.renderCart();
       }
    }
    render(){
        let {activeTab} = this.state;
        return(
            <div className='eCommerse'>
                <p className='eCommerse-header'>Voltex E-commerse Clone</p>
                <Nav activeTab={activeTab} onTabChange={this.handleTabChange}/>
                {this.DisplayAddedMessage()}
                <main className='eCommerse-content'>
                    {this.renderContent()}
                </main>
            </div>
        );
    }
}

export default eCommerse;