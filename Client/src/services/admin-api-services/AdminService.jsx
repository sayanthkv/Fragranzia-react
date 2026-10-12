import React from 'react'

import useAxiosPrivate from '../../hooks/useAxiosprivate';

const AdminService = () => {

    const axiosPrivate = useAxiosPrivate()


    const addToProduct = async (data) => {

        const response = await axiosPrivate.post("/Products",data);
        return response.data;
    };

    const AddCategory = async (data) => {

        const response = await axiosPrivate.post("/Category",data);
        return response.data;
    };

    const EditCategory = async (categoryId, data) => {

        const response = await axiosPrivate.put(`Category/${categoryId}/editdetails`, data)
        return response?.data
    };

    const EditProduct = async (editProductId, data) => {

        const response = await axiosPrivate.put(`/Products/${editProductId}`, data)
        return response?.data
    };

    const getCategory = async () => {
    const response = await axiosPrivate.get("/Category");
    return response.data;
  };

    const getProduct = async () => {
    const response = await axiosPrivate.get("/Products");
    return response.data;
  };


  const editStatus = async (categoryId, data) => {

        const response = await axiosPrivate.put(`Category/${categoryId}/status`, data)
        return response?.data
    };

    const editProductStatus = async (productId, data) => {

        const response = await axiosPrivate.put(`Products/${productId}/status`, data)
        return response?.data
    };

    return {
        // getHomePageData,
        // postRegister,
        addToProduct,
        AddCategory,
        EditCategory,
        EditProduct,
        getCategory,
        editStatus,
        getProduct,
        editProductStatus
        // handleToggleProduct,
        // handleToggleCategory,
        // handleToggleUser,
        // getUserData,
        // getCategoryeData,
        // getProductData,
        // AddOffer,
        // getOffer,
        // getOrder,
        // updateStatus,
        // handleToggleOffer,
        // getWeeklyOrder,
        // getsalesByCategory,
        // returnProcess
    };
};

export default AdminService