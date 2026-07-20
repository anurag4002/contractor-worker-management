import {
  createContext,
  useContext,
  useState,
} from "react";

const WorkerContext = createContext(null);

export default WorkerContext;

export const WorkerProvider = ({
  children,
}) => {
  const [workers, setWorkers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  const value = {
    workers,
    setWorkers,

    loading,
    setLoading,

    selectedWorker,
    setSelectedWorker,
  };

  return (
    <WorkerContext.Provider value={value}>
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorkers = () => {
  const context =
    useContext(WorkerContext);

  if (!context) {
    throw new Error(
      "useWorkers must be used within WorkerProvider."
    );
  }

  return context;
};