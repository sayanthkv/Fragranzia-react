
const { Address } = require("../models/addressModel");

const addAddress = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);
    console.log("Address request body:", req.body);

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({
        message: "Authenticated user ID not found",
      });
    }

    const {
      fullName,
      phone,
      street,
      city,
      state,
      country,
      zip,
      landmark,
      alternativePhone,
      addressType,
    } = req.body;

    const newAddress = await Address.create({
      user: userId,
      fullName,
      phone,
      street,
      city,
      state,
      country,
      zip,
      landmark,
      alternativePhone,
      addressType,
    });

    return res.status(201).json({
      message: "Address saved successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Address saving failed:", error);

    return res.status(500).json({
      message: "Failed to save address",
      error: error.message,
    });
  }
};


const getaddress = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const addresses = await Address.find({ user: userId });

    return res.status(200).json({
      message: "Addresses fetched successfully",
      addresses,
    });
  } catch (error) {
    console.error("Fetching addresses failed:", error);

    return res.status(500).json({
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};


const updateAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      country,
    } = req.body;

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: id, user: userId },
      {
        fullName,
        phone,
        street: address,
        city,
        state,
        zip: pincode,
        country,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    return res.status(200).json({
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Address update failed:", error);

    return res.status(500).json({
      message: "Failed to update address",
      error: error.message,
    });
  }
};


const primaryaddress = async (req,res)=>{

  const {id} = req.params
  const userId = req.userId;
  
  await Address.findOneAndUpdate(
      { user: userId, isPrimary: true },
      { $set: { isPrimary: false } }
    );
    
  const updateprimary = await Address.findOneAndUpdate({ _id: id, user: userId },
    {isPrimary:true},
    {new:true}
  )

  return res.status(200).json(updateprimary)



}

module.exports = { addAddress,getaddress,updateAddress,primaryaddress };
