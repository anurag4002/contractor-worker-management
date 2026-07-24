import axios from "../api/axios";

const workerService = {
  getWorkers: async (params) => {
    const { data } = await axios.get("/workers", { params });
    return data;
  },

  getWorkerById: async (id) => {
    const { data } = await axios.get(`/workers/${id}`);
    return data;
  },

  createWorker: async (payload) => {
    const { data } = await axios.post("/workers", payload);
    return data;
  },

  updateWorker: async (id, payload) => {
    const { data } = await axios.put(`/workers/${id}`, payload);
    return data;
  },

  changeWorkerStatus: async (id, status) => {
    const { data } = await axios.patch(`/workers/${id}/status`, { status });
    return data;
  },

  deleteWorker: async (id) => {
    const { data } = await axios.delete(`/workers/${id}`);
    return data;
  },
};

export default workerService;
