import React, { Component } from 'react';
import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import interceptorsHandler from '../../../hoc/interceptorsHandler/interceptorsHandler';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {

    state = {
       orderForm: {        
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                messageError: ''
            },            
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                messageError: ''
            }, 
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false,
                messageError: ''
            }, 
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                messageError: ''
            },             
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your e-mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                messageError: ''
            },      
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                valid:true,
                validation: {}
            }
       },
       formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for (let formElementId in this.state.orderForm){
            formData[formElementId] = this.state.orderForm[formElementId].value;
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price  ,
            orderData: formData          
        }

        axios.post('/orders.json', order).then(response => {
            this.props.history.push('/');
        });
        
    }

    checkValidity = (value, rules) => {

        let isValid = true;
        let message = '';

        if (rules.required){
            isValid = value.trim() !== '';
            if (!isValid){
                message = 'This field is required';

            }
        }

        if (rules.minLength && isValid) {
            isValid = value.length >= rules.minLength;
            if (!isValid){
                message = 'Min length is '+ rules.minLength;
            }
        }

        if (rules.maxLength && isValid) {
            isValid = value.length <= rules.maxLength;
            if (!isValid){
                message = 'Max length is '+ rules.maxLength;
            }
        }

        return {isValid: isValid, message: message};
    }

    inputChangedHandler = (event, inputIdentifier) => {
        //Clonei o objecto orderForm
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        //Clonei o objeto que eu quero alterar, exemplo "name"
        const updatedFormElement ={
            ...updatedOrderForm[inputIdentifier]
        };
        //Se fosse alterar as configurações do elemento "name" teria que clonar inclusive o elementConfig

        updatedFormElement.value = event.target.value;
        const validation = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.valid = validation.isValid;
        updatedFormElement.message = validation.message;
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        
        let formIsValid= true;
        for (let inputIdentifier in updatedOrderForm){
            if (!updatedOrderForm[inputIdentifier].valid){
                formIsValid = false;
                break;
            }            
        }
        
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    }

    render() {

        let formElementsArray = [];
        for (let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map((element) => {
                    return <Input 
                        key={element.id}
                        elementType={element.config.elementType} 
                        elementConfig={element.config.elementConfig}
                        value={element.config.value} 
                        changed={(event) => this.inputChangedHandler(event, element.id)}
                        invalid={!element.config.valid}
                        shouldValidate={element.config.validation}
                        touched={element.config.touched}
                        message={element.config.message}/>
                })}    
                <Button disabled={!this.state.formIsValid} btnType="Success">ORDER</Button>
            </form>
        )

        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        );
    }

}

export default interceptorsHandler(ContactData, axios);