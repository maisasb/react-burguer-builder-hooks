import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from '../../hoc/Content/Content';
import Burguer from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import interceptorsHandler from '../../hoc/interceptorsHandler/interceptorsHandler';
import * as actions from '../../store/actions/index';

const BurgerBuilder = props => {

    const [ purchasing, setPurchasing ] = useState(false);    

    const dispatch = useDispatch();

     const ing =  useSelector(state => {
        return state.burgerBuilder.ingredients;
    });
    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuthenticated = useSelector(state => state.auth.token !== null);


    const onIngredientAdded = (name) => dispatch(actions.addIngredient(name));
    const onIngredientRemoved = (name) => dispatch(actions.removeIngredient(name));
    const onInitIngredients = useCallback(() => dispatch(actions.iniIngredients()), []);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
    }

    const purchaseHandler = () =>  {
        if (isAuthenticated){
            setPurchasing(true);            
        }else{
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
        
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);               
    }

    const purchaseContinueHandler = () => {                
        onInitPurchase();
        props.history.push({pathname: '/checkout'});
    }

    
    const disabledInfo ={
        ...ing
    };
    for(let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null;
    let burger =  null;

    if (error){
        burger = <p>Ingredients can't be loaded</p>;
    }

    if (ing){
        
        burger = (
            <Content>
                <Burguer ingredients={ing}/>
                <BuildControls 
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disabledInfo}
                    price={price}
                    purchaseable={updatePurchaseState(ing)}
                    ordered={purchaseHandler}
                    isAuth={isAuthenticated}/>
            </Content>
        );

        orderSummary =  <OrderSummary  
        price={price}
        ingredients={ing}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}/>;
    }
    console.log()
    return (
        <Content>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Content>
    );
    
}

export default interceptorsHandler(BurgerBuilder, axios);