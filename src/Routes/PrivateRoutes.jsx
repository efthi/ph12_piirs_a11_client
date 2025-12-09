import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import Loader from '../components/shared/Loader';

const PrivateRoutes = ({children}) => {
    
    const {user, loading} = useAuth();
    let location = useLocation();
    if(user){
        return children;
    }
    if(loading){
        return <Loader></Loader>;
    }
    return <Navigate state={location?.pathname} to="/login"></Navigate>;
};

export default PrivateRoutes;