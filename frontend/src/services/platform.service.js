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
};

export default platformService;
