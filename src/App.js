import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth//Logout/Logout';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';

const Checkout = React.lazy(() => {
    return import('./containers/Checkout/Checkout');
})

const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
})

const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
})

const App = props => {

  const { onTryAutoSignup } = props;

  useEffect(() => {
    onTryAutoSignup();
    console.log("Production " + process.env.NODE_ENV === "production");
  }, [onTryAutoSignup]);

  let routes = (
      <Switch>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/auth" render={(props) => <Auth {...props} />} /> 
          <Redirect to="/" />
      </Switch>
  );

  if (props.isAuthenticated){
    routes = (
      <Switch>
        <Route path="/" exact component={BurgerBuilder} />
        <Route path="/checkout" render={(props) => <Checkout {...props} />} />   
        <Route path="/orders" render={(props) => <Orders {...props} />} />               
        <Route path="/logout" component={Logout} />  
        <Route path="/auth" component={(props) => <Auth {...props} />} /> 
        <Redirect to="/" />      
      </Switch>
    );
  }

  return (
    <BrowserRouter basename="react-burger-builder">
      <Layout>
          <Suspense fallback={<p>Loading</p>}>{routes}</Suspense>
      </Layout>
    </BrowserRouter>
  );
 
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
