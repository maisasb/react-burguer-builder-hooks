import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Content from '../Content/Content';
import Spinner from '../../components/UI/Spinner/Spinner';

const interceptorsHandler = (WrappedComponent, axios) => {
    return class extends Component {

        state = { 
            error: null,
            loading: false
        }

        constructor(props) {
            super(props);
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null, loading: true});                
                return req;
            })
            this.resInterceptor = axios.interceptors.response.use(res => {
                this.setState({loading: false});
                return res;
            }, error => {
                this.setState({error: error, loading: false});                
            });
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render() {

            let spinner = null;
            if (this.state.loading){
                spinner = <Spinner />;
            }
        
            return (
                <Content>
                    {spinner}
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Content>
            );
            
        }
    }
    
}

export default interceptorsHandler;