import React from 'react'

import useAxiosPrivate from '../../hooks/useAxiosprivate';

const AdminService = () => {

    const axiosPrivate = useAxiosPrivate()


    const addToProduct = async (data) => {

        const response = await axiosPrivate.post("/product/admin",data);
        return response.data;
    };

    const AddCategory = async (data) => {

        const response = await axiosPrivate.post("/Category",data);
        return response.data;
    };
    const EditCategory = async (categoryId, data) => {

        const response = await axiosPrivate.put(`category/admin/${categoryId}`, data)
        return response?.data
    };

    const EditProduct = async (editProductId, data) => {

        const response = await axiosPrivate.put(`product/admin/${editProductId}`, data)
        return response?.data
    };

    const getCategory = async () => {
    const response = await axiosPrivate.get("/Category");
    return response.data;
  };

    return {
        // getHomePageData,
        // postRegister,
        addToProduct,
        AddCategory,
        EditCategory,
        EditProduct,
        getCategory
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