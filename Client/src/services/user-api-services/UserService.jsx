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
  
const Addproducttocart = async (id, quantity = 1) => {
  const response = await axiosPrivate.post(`/Cart/add/${id}`, {
    quantity,
  });

  return response.data;
};

 const regUser = async (data)=>{
    const response = await axiosPrivate.post("/api/auth/register",data);
    return response.data
  }

  const logUser = async (data) => {
    const response = await axiosPrivate.post("/api/auth/login",data);
    return response.data;
    
  };

const getCart = async () => {
  const response = await axiosPrivate.get("/Cart/");
  return response.data;
};


const removeProductFromCart = async (id) => {
  const response = await axiosPrivate.delete(`/Cart/remove/${id}`);
  return response.data;
};


  const addToWishlist = async (id)=>{
    const response = await axiosPrivate.post(`/Wishlist/add/${id}`);
    return response.data
  }

  const getWishlist = async () => {
  const response = await axiosPrivate.get("/Wishlist/");
  return response.data;
};

const removeProductFromWishlist = async (id) => {
  const response = await axiosPrivate.delete(`/Wishlist/remove/${id}`);
  return response.data;
};


const saveaddress = async (data) => {

        const response = await axiosPrivate.post("/address/saveaddress",data);
        return response.data;
    };

    const fetchdata = async () => {
  const response = await axiosPrivate.get("/address/getdata");
  return response.data;}

  
const updateaddress = async (id, data) => {
  const response = await axiosPrivate.put(
    `/address/updateaddress/${id}`,
    data
  );

  return response.data;
};

 const getUserdata = async () => {
  const response = await axiosPrivate.get("/api/auth/getdata");
  return response.data
 }

 const updatedetails = async (data)=>{
  const response = await axiosPrivate.put("/api/auth/updatedata",data)
  return response.data
 }

return{
  regUser,
  logUser,
    getProduct,
  getDetailedProduct,
  Addproducttocart,
  getCart,
  removeProductFromCart,
  addToWishlist,
  getWishlist,
  removeProductFromWishlist,
  saveaddress,
  fetchdata,
  updateaddress,
  getUserdata,
  updatedetails
}

 }

 export default UserService