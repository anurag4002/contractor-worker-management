import axios from "../api/axios";

const subscriptionService = {
  getCurrentSubscription: async () => {
    const { data } = await axios.get("/subscriptions/current");

    return data.data;
  },

  getPlans: async () => {
    const { data } = await axios.get("/subscription-plans/public");

    return data.data;
  },

  createPaymentOrder: async (billingCycle) => {
    const { data } = await axios.post("/subscription-payments/orders", {
      billingCycle,
    });

    return data.data;
  },

  verifyPayment: async (paymentData) => {
    const { data } = await axios.post("/subscription-payments/verify", paymentData);

    return data.data;
  },

  getPaymentHistory: async (params = {}) => {
    const { data } = await axios.get("/subscription-payments", { params });

    return data.data;
  },
};

export default subscriptionService;
