import React from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Content from '../Content/Content';
import Spinner from '../../components/UI/Spinner/Spinner';
import useInterceptorsHandler from '../../hooks/interceptors-handler';

const interceptorsHandler = (WrappedComponent, axios) => {
    return props => {

        const {error, loading} = useInterceptorsHandler(axios);
      console.log(error);
        let spinner = null;
        if (loading){
            spinner = <Spinner />;
        }
    
        return (
            <Content>
                {spinner}
                <Modal 
                    show={error.errorMessage}
                    modalClosed={error.clearError}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </Content>
        );
        
    }
    
    
}

export default interceptorsHandler;