import React from 'react'

import useAxiosPrivate from '../../hooks/useAxiosprivate';

const UserService = () => {

     const axiosPrivate = useAxiosPrivate()

     const getProduct = async () => {
    const response = await axiosPrivate.get("/Products");
    return response.data;
    
  };

  const getDetailedProduct = async (id) => {
  const response = await axiosPrivate.get(`/Products/${id}`);
  return response.data;
};

  const Addproducttocart = async (id)=>{
    const response = await axiosPrivate.post(`/Cart/add/${id}`);
    return response.data

return{
    getProduct,
    getDetailedProduct,
    Addproducttocart
}

 }

 export default UserService