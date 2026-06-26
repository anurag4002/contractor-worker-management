import React from "react";

import Modal from "../modal/Modal";

const DeleteWorkerModal = ({
  open,
  worker,
  onClose,
  onDeleteWorker,
}) => {

  const handleDelete = () => {

    if (!worker) return;

    onDeleteWorker(worker.id);

    onClose();

  };

  return (
    <Modal
      open={open}
      title="Delete Worker"
      submitText="Delete"
      onClose={onClose}
      onSubmit={handleDelete}
    >

      <div
        style={{
          textAlign: "center",
          padding: "1rem",
        }}
      >

        <div
          style={{
            width: "5rem",
            height: "5rem",
            margin: "0 auto 1rem",
            borderRadius: "50%",
            background: "#FEE2E2",
            color: "#DC2626",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "2rem",
            fontWeight: "700",
          }}
        >
          !
        </div>

        <h3
          style={{
            marginBottom: ".75rem",
            color: "#0F172A",
          }}
        >
          Delete Worker
        </h3>

        <p
          style={{
            color: "#64748B",
            lineHeight: "1.7",
          }}
        >
          Are you sure you want to delete
          <br />

          <strong>
            {worker?.name}
          </strong>

          ?

          <br /><br />

          This action cannot be undone.
        </p>

      </div>

    </Modal>
  );
};

export default DeleteWorkerModal;