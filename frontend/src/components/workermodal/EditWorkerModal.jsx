import React, { useEffect, useState } from "react";

import Modal from "../modal/Modal";
import WorkerForm from "../workerform/WorkerForm";

const EditWorkerModal = ({
  open,
  worker,
  onClose,
  onUpdateWorker,
}) => {

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    skill: "",
    dailyWage: "",
    site: "",
    joiningDate: "",
    photo: "",
    status: "",
    salary: "",
  });

  useEffect(() => {

    if (worker) {

      setFormData(worker);

    }

  }, [worker]);

  const handleChange = (field, value) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

  };

  const handleSubmit = () => {

    if (
      !formData.name ||
      !formData.phone ||
      !formData.skill ||
      !formData.site
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onUpdateWorker(formData);

    onClose();

  };

  return (

    <Modal
      open={open}
      title="Edit Worker"
      submitText="Update Worker"
      onClose={onClose}
      onSubmit={handleSubmit}
    >

      <WorkerForm
        initialValues={formData}
        onChange={handleChange}
      />

    </Modal>

  );

};

export default EditWorkerModal;