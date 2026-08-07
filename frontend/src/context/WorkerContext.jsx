import { createContext, useContext, useState, useEffect, useCallback } from "react";
import workerService from "../services/worker.service";
import siteService from "../services/site.service";
import { showSuccess, showError } from "../components/common/toast";

const WorkerContext = createContext(null);

export const WorkerProvider = ({ children }) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const fetchWorkers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const data = await workerService.getWorkers(params);
      setWorkers(data?.data || data?.workers || data || []);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addWorker = useCallback(async (payload) => {
    try {
      setLoading(true);
      await workerService.createWorker(payload);
      showSuccess("Worker added successfully");
      await fetchWorkers();
    } catch (error) {
      showError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkers]);

  const updateWorker = useCallback(async (id, payload) => {
    try {
      setLoading(true);
      await workerService.updateWorker(id, payload);
      showSuccess("Worker updated successfully");
      await fetchWorkers();
    } catch (error) {
      showError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkers]);

  const deleteWorker = useCallback(async (id) => {
    try {
      setLoading(true);
      await workerService.deleteWorker(id);
      showSuccess("Worker deleted successfully");
      await fetchWorkers();
    } catch (error) {
      showError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkers]);

  const changeStatus = useCallback(async (id, status) => {
    try {
      setLoading(true);
      await workerService.changeWorkerStatus(id, status);
      showSuccess("Worker status updated");
      await fetchWorkers();
    } catch (error) {
      showError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkers]);

  const assignWorkerToSite = useCallback(async (siteId, workerId) => {
    try {
      setLoading(true);
      await siteService.assignWorkers(siteId, [workerId]);
      showSuccess("Worker assigned successfully");
      await fetchWorkers();
    } catch (error) {
      showError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkers]);

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
        assignWorkerToSite,
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
