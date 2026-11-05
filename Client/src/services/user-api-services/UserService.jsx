import useAxiosPrivate from "../../hooks/useAxiosprivate";

const UserService = () => {
  const axiosPrivate = useAxiosPrivate();

  const getProduct = async (params = {}) => {
    const response = await axiosPrivate.get("/Products", { params });
    return response.data;
  };

  const getDetailedProduct = async (id) => {
    const response = await axiosPrivate.get(`/Products/${id}`);
    return response.data;
  };

  const Addproducttocart = async (id, quantity = 1) => {
    const response = await axiosPrivate.post(`/Cart/add/${id}`, { quantity });
    return response.data;
  };

  const regUser = async (data) => {
    const response = await axiosPrivate.post("/api/auth/register", data);
    return response.data;
  };

  const logUser = async (data) => {
    const response = await axiosPrivate.post("/api/auth/login", data);
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

  const addToWishlist = async (id) => {
    const response = await axiosPrivate.post(`/Wishlist/add/${id}`);
    return response.data;
  };

  const getWishlist = async () => {
    const response = await axiosPrivate.get("/Wishlist/");
    return response.data;
  };

  const removeProductFromWishlist = async (id) => {
    const response = await axiosPrivate.delete(`/Wishlist/remove/${id}`);
    return response.data;
  };

  const saveaddress = async (data) => {
    const response = await axiosPrivate.post("/address/saveaddress", data);
    return response.data;
  };

  const fetchdata = async () => {
    const response = await axiosPrivate.get("/address/getdata");
    return response.data;
  };

  const updateaddress = async (id, data) => {
    const response = await axiosPrivate.put(`/address/updateaddress/${id}`, data);
    return response.data;
  };

  const getUserdata = async () => {
    const response = await axiosPrivate.get("/api/auth/getdata");
    return response.data;
  };

  const updatedetails = async (data) => {
    const response = await axiosPrivate.put("/api/auth/updatedata", data);
    return response.data;
  };

  const setprimary = async (id) => {
    const response = await axiosPrivate.put(`/address/primaryaddress/${id}`);
    return response.data;
  };

  const fetchprimaryaddress = async () => {
    const response = await axiosPrivate.get("/address/getprimaryaddress");
    return response.data;
  };

  const updateCartQuantity = async (id, quantity) => {
    const response = await axiosPrivate.put(`/Cart/update/${id}`, { quantity });
    return response.data;
  };

  // --- Step 1 Online: Create Razorpay Order token ---
  const createRazorpayOrder = async (amount) => {
    const response = await axiosPrivate.post("/api/orders/create-razorpay-order", { amount });
    return response.data;
  };

  // --- Step 2 Online: Verify signature and place order ---
  const verifyAndPlaceOrder = async (orderPayload) => {
    const response = await axiosPrivate.post("/api/orders/verify-order", orderPayload);
    return response.data;
  };

  // --- Direct COD Placement ---
  const placeCodOrder = async (orderPayload) => {
    const response = await axiosPrivate.post("/api/orders/place-cod", orderPayload);
    return response.data;
  };

  const getOrders = async () => {
    const response = await axiosPrivate.get("/api/orders/my-orders");
    return response.data;
  };

  const getOrderById = async (id) => {
    const response = await axiosPrivate.get(`/api/orders/${id}`);
    return response.data;
  };

  const cancelOrder = async (id) => {
    const response = await axiosPrivate.put(`/api/orders/cancel/${id}`);
    return response.data;
  };

  const returnOrder = async (orderId, returnReason) => {
    const response = await axiosPrivate.put(`/api/orders/return/${orderId}`, {
      returnReason,
    });
    return response.data;
  };

  const googleAuthUser = async (credentialToken) => {
  const response = await axiosPrivate.post("/api/auth/google", { token: credentialToken });
  return response.data;
};

  return {
    googleAuthUser,
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
    updatedetails,
    setprimary,
    fetchprimaryaddress,
    updateCartQuantity,
    createRazorpayOrder,
    verifyAndPlaceOrder,
    placeCodOrder,
    getOrders,
    getOrderById,
    cancelOrder,
    returnOrder,
  };
};

export default UserService;