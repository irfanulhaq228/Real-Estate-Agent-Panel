import axios from "axios";
import { URL } from "../url";

// ====================Agent Apis

export const signupAgentApi = async (data: any) => {
  try {
    const result = await axios.post(`${URL}/agent`, data);
    return result;
  } catch (error) {
    return error;
  }
};

export const signinAgentApi = async (data: any) => {
  try {
    const result = await axios.post(`${URL}/agent/login`, data);
    return result;
  } catch (error) {
    return error;
  }
};

// ====================Rent Home Apis

export const homeForRentApi = async (data: any) => {
  try {
    const result = await axios.post(`${URL}/home-for-rent/create`, data);
    return result;
  } catch (error) {
    return error;
  }
};

export const getRentalHomes = async () => {
  try {
    const storedData = localStorage.getItem("agent");
    let id = "";
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      id = parsedData._id;
    }
    const result = await axios.get(`${URL}/home-for-rent/${id}`);
    return result;
  } catch (error) {
    return error;
  }
};

export const getRentalHomesByAgentId = async () => {
  try {
    const storedData = localStorage.getItem("agent");
    let id = "";
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      id = parsedData._id;
    }
    const result = await axios.get(`${URL}/home-for-rent/by-agent/${id}`);
    return result;
  } catch (error) {
    return error;
  }
};

export const deleteRentalHomeById = async (id: string) => {
  try {
    const result = await axios.delete(`${URL}/home-for-rent/${id}`);
    return result;
  } catch (error) {
    return error;
  }
};

export const getRentalHomebyId = async (id: string) => {
  try {
    const result = await axios.get(`${URL}/home-for-rent/${id}`);
    return result;
  } catch (error) {
    return error;
  }
};

// ====================Sale Home Apis

export const homeForSaleApi = async (data: any) => {
  try {
    const result = await axios.post(`${URL}/home-for-sale/create`, data);
    return result;
  } catch (error) {
    return error;
  }
};

export const getSaleHomes = async () => {
  try {
    const result = await axios.get(`${URL}/home-for-sale`);
    return result;
  } catch (error) {
    return error;
  }
};

export const getSaleHomesByAgentId = async () => {
  try {
    const storedData = localStorage.getItem("agent");
    let id = "";
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      id = parsedData._id;
    }
    const result = await axios.get(`${URL}/home-for-sale/by-agent/${id}`);
    return result;
  } catch (error) {
    return error;
  }
};

// ====================Contact

export const getUsersFromAgentId = async (id: any) => {
  try {
    const result = await axios.post(`${URL}/message/agent/${id}`);
    return result;
  } catch (error) {
    return error;
  }
};

export const getUserMessages = async (id: any) => {
  try {
    const storedData = localStorage.getItem("agent");
    let agent = "";
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      agent = parsedData._id;
    }
    const result = await axios.post(`${URL}/message/user/${id}`, { agent });
    return result;
  } catch (error) {
    return error;
  }
};

export const sendMessage = async (data: any) => {
  try {
    const result = await axios.post(`${URL}/message`, data);
    return result;
  } catch (error) {
    return error;
  }
};
