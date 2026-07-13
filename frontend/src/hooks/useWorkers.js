import { useContext } from "react";

import WorkerContext from "../context/WorkerContext";

const useWorkers = () => {

  const context = useContext(
    WorkerContext
  );

  if (!context) {

    throw new Error(
      "useWorkers must be used inside WorkerProvider"
    );

  }

  return context;

};

export default useWorkers;