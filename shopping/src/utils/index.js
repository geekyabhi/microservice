const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../config");

const GenerateSalt = async () => {
  try {
    return await bcrypt.genSalt();
  } catch (e) {
    throw new Error(`Unable to create Salt ${e}`);
  }
};

const GeneratePassword = async (password, salt) => {
  try {
    return await bcrypt.hash(password, salt);
  } catch (e) {
    throw new Error(`Unable to create Password ${e}`);
  }
};

const ValidatePassword = async (enteredPassword, savedPassword, salt) => {
  try {
    return await bcrypt.compare(enteredPassword, savedPassword);
  } catch (e) {
    throw new Error(`Unable to match password ${e}`);
  }
};

const GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
  } catch (e) {
    throw new Error(`Unable to generate signature ${e}`);
  }
};

const ValidateSignature = async (signature) => {
  try {
    const token = signature.split(" ")[1];
    const payload = await jwt.verify(token, APP_SECRET);
    return payload;
  } catch (e) {
    throw new Error(`Not Authorized ${e}`);
  }
};

const FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error(`Data Not found!`);
  }
};

const PublishCustomerEvent = async (payload) => {
  try {
    const data = await axios.post(`http://localhost:8000/customer/app-events`, {
      payload,
    });
  } catch (e) {
    console.log(`Error occured on publishing customer event ${e}`);
  }
};

module.exports = {
  GenerateSalt,
  GeneratePassword,
  ValidatePassword,
  GenerateSignature,
  ValidateSignature,
  FormateData,
  PublishCustomerEvent,
};
