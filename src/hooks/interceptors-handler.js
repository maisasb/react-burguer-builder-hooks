import {useState, useEffect} from 'react';

export default axios  => {

    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    
    //Executa antes de renderizar jsx
    const reqInterceptor = axios.interceptors.request.use(req => {
        setError(null);
        setLoading(true);                
        return req;
    })
    const resInterceptor = axios.interceptors.response.use(res => {
        setLoading(false);
        return res;
    }, error => {
        setError(error);
        setLoading(false);              
    });
    
    //Função de cleanup, executa depois que terminar tudo
    useEffect(() => {
        return () => {
            axios.interceptors.request.eject(reqInterceptor);
            axios.interceptors.response.eject(resInterceptor);
        }
    }, [reqInterceptor, resInterceptor, axios.interceptors.request, axios.interceptors.response]);


    const errorConfirmedHandler = () => {
        setError(null);
    }

    return {
        error: {
            errorMessage: error,
            clearError: errorConfirmedHandler
        },
        loading: loading
    }
}
