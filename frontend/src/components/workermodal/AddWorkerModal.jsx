import React, { useState } from "react";

import Modal from "../modal/Modal";
import WorkerForm from "../workerform/WorkerForm";

const defaultWorker = {
  name: "",
  phone: "",
  skill: "Helper",
  dailyWage: "",
  site: "",
  joiningDate: "",
  photo: "",
};

const AddWorkerModal = ({
  open,
  onClose,
  onAddWorker,
}) => {
  const [worker, setWorker] = useState(defaultWorker);

  const handleChange = (field, value) => {
    setWorker((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !worker.name ||
      !worker.phone ||
      !worker.skill ||
      !worker.dailyWage ||
      !worker.site
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onAddWorker({
      ...worker,
      id: Date.now(),
      status: "Present",
      salary: `₹${worker.dailyWage}`,
    });

    setWorker(defaultWorker);

    onClose();
  };

  return (
    <Modal
      open={open}
      title="Add New Worker"
      submitText="Add Worker"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <WorkerForm
        initialValues={worker}
        onChange={handleChange}
      />
    </Modal>
  );
};

export default AddWorkerModal;