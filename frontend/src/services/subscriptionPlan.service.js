import axios from "../api/axios";

const subscriptionPlanService = {
  getPlans: async (params = {}) => {
    const { data } = await axios.get("/subscription-plans", { params });
    return data.data || [];
  },

  getPlanById: async (planId) => {
    const { data } = await axios.get(`/subscription-plans/${planId}`);
    return data.data;
  },

  updatePlan: async (planId, updateData) => {
    const { data } = await axios.put(`/subscription-plans/${planId}`, updateData);
    return data.data;
  },

  createPlan: async (planData) => {
    const { data } = await axios.post("/subscription-plans", planData);
    return data.data;
  },

  deletePlan: async (planId) => {
    const { data } = await axios.delete(`/subscription-plans/${planId}`);
    return data.data;
  },
};

export default subscriptionPlanService;
