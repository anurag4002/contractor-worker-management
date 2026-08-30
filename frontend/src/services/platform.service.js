import axios from "../api/axios";

const platformService = {
  getPlatformDashboard: async () => {
    const { data } = await axios.get("/platform/dashboard");

    return data.data;
  },

  getTenants: async (params = {}) => {
    const { data } = await axios.get("/platform/tenants", { params });

    return data.data;
  },

  getTenantById: async (tenantId) => {
    const { data } = await axios.get(`/platform/tenants/${tenantId}`);

    return data.data;
  },

  getTenantSubscription: async (tenantId) => {
    const { data } = await axios.get(`/platform/tenants/${tenantId}/subscription`);

    return data.data;
  },

  getPayments: async (params = {}) => {
    const { data } = await axios.get("/platform/payments", { params });

    return data.data;
  },

  getPaymentById: async (paymentId) => {
    const { data } = await axios.get(`/platform/payments/${paymentId}`);

    return data.data;
  },

  getExpiringSubscriptions: async (params = {}) => {
    const { data } = await axios.get("/platform/expiring-subscriptions", { params });

    return data.data;
  },

  getRecentUsers: async (limit = 10) => {
    const { data } = await axios.get("/platform/recent-users", { params: { limit } });

    return data.data;
  },

  getRecentPayments: async (limit = 10) => {
    const { data } = await axios.get("/platform/recent-payments", { params: { limit } });

    return data.data;
  },
};

export default platformService;
