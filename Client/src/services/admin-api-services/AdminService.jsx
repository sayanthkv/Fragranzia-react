import React from 'react';
import useAxiosPrivate from '../../hooks/useAxiosprivate';

const AdminService = () => {
  const axiosPrivate = useAxiosPrivate();

  const addToProduct = async (data) => {
    const response = await axiosPrivate.post("/Products", data);
    return response.data;
  };

  const AddCategory = async (data) => {
    const response = await axiosPrivate.post("/Category", data);
    return response.data;
  };

  const EditCategory = async (categoryId, data) => {
    const response = await axiosPrivate.put(`Category/${categoryId}/editdetails`, data);
    return response?.data;
  };

  const EditProduct = async (editProductId, data) => {
    const response = await axiosPrivate.put(`/Products/${editProductId}`, data);
    return response?.data;
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
    const response = await axiosPrivate.put(`Category/${categoryId}/status`, data);
    return response?.data;
  };

  const editProductStatus = async (productId, data) => {
    const response = await axiosPrivate.put(`Products/${productId}/status`, data);
    return response?.data;
  };

  const fetchUsers = async () => {
    const response = await axiosPrivate.get("/api/auth/getallusers");
    return response.data;
  };

  const toggleUserBlockStatus = async (userId, data) => {
    const response = await axiosPrivate.put(`/api/auth/users/${userId}/status`, data);
    return response.data;
  };

  const getOrders = async () => {
    const response = await axiosPrivate.get("/api/orders/admin/all");
    return response.data;
  };

  const updateStatus = async (orderId, data) => {
    const response = await axiosPrivate.put(`/api/orders/admin/status/${orderId}`, data);
    return response.data;
  };

  // Approve or Reject Return Requests
  const processReturnStatus = async (orderId, status) => {
    const response = await axiosPrivate.put(`/api/orders/admin/return-status/${orderId}`, {
      status,
    });
    return response.data;
  };

  return {
    addToProduct,
    AddCategory,
    EditCategory,
    EditProduct,
    getCategory,
    editStatus,
    getProduct,
    editProductStatus,
    fetchUsers,
    fetchUserdetails: fetchUsers,
    toggleUserBlockStatus,
    getOrders,
    updateStatus,
    processReturnStatus, // Exported return status handler
  };
};

export default AdminService;