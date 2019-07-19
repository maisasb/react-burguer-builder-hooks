import React, { Component } from 'react';
import axios from '../../axios-orders';
import Order from '../../components/Order/Order';
import interceptorsHandler from '../../hoc/interceptorsHandler/interceptorsHandler';

class Orders extends Component {

    state = {
        orders: []        
    }

    componentDidMount(){
        axios.get('orders.json')
            .then(res => {
                let fetchedOrders = [];                
                for (let id in res.data){                    
                    fetchedOrders.push({
                        ...res.data[id],
                        id: id
                    });    
                }
                this.setState({orders: fetchedOrders});
            })
            .catch(err => {

            });
    }

    render(){

        let orders = this.state.orders.map((order) => {
           return  <Order key={order.id} 
                        price={order.price} 
                        ingredients={order.ingredients}/>
        });      

        return (
            <div>
                {orders}
            </div>
        );

    }
}

export default interceptorsHandler(Orders, axios);