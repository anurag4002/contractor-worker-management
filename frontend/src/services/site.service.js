import axios from "../api/axios";

const siteService = {
    /*
    |--------------------------------------------------------------------------
    | Site Management
    |--------------------------------------------------------------------------
    */

    getSites: async (params = {}) => {
        const { data } = await axios.get("/sites", { params });
        return data;
    },

    getSiteById: async (id) => {
        const { data } = await axios.get(`/sites/${id}`);
        return data;
    },

    createSite: async (payload) => {
        const { data } = await axios.post("/sites", payload);
        return data;
    },

    updateSite: async (id, payload) => {
        const { data } = await axios.put(`/sites/${id}`, payload);
        return data;
    },

    changeSiteStatus: async (id, status) => {
        const { data } = await axios.patch(`/sites/${id}/status`, { status });
        return data;
    },

    deleteSite: async (id) => {
        const { data } = await axios.delete(`/sites/${id}`);
        return data;
    },
};

export default siteService;
