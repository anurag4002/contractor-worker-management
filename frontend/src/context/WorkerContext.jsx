import { createContext, useContext, useState, useEffect } from "react";
import workerService from "../services/worker.service";
import { showSuccess, showError } from "../components/common/toast";

const WorkerContext = createContext(null);

export const WorkerProvider = ({ children }) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const fetchWorkers = async (params = {}) => {
    try {
      setLoading(true);
      const data = await workerService.getWorkers(params);
      // Depending on API structure, it might be data, data.data, or data.workers
      setWorkers(data?.data || data?.workers || data || []);
    } catch (error) {
      showError(error.response?.data?.message || "Failed to fetch workers.");
    } finally {
      setLoading(false);
    }
  };

  const addWorker = async (payload) => {
    try {
      setLoading(true);
      await workerService.createWorker(payload);
      showSuccess("Worker created successfully");
      await fetchWorkers();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to create worker.");
      throw error; // Throwing error so modal form can catch it and handle loading state
    } finally {
      setLoading(false);
    }
  };

  const updateWorker = async (id, payload) => {
    try {
      setLoading(true);
      await workerService.updateWorker(id, payload);
      showSuccess("Worker updated successfully");
      await fetchWorkers();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to update worker.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteWorker = async (id) => {
    try {
      setLoading(true);
      await workerService.deleteWorker(id);
      showSuccess("Worker deleted successfully");
      await fetchWorkers();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to delete worker.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      setLoading(true);
      await workerService.changeWorkerStatus(id, status);
      showSuccess("Worker status updated");
      await fetchWorkers();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to update status.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkerContext.Provider
      value={{
        workers,
        setWorkers,
        loading,
        setLoading,
        selectedWorker,
        setSelectedWorker,
        fetchWorkers,
        addWorker,
        updateWorker,
        deleteWorker,
        changeStatus,
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorkers = () => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error("useWorkers must be used within WorkerProvider.");
  }
  return context;
};

export default WorkerContext;