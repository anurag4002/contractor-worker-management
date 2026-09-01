import React from "react";

import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  SecondaryButton,
  DangerButton,
} from "../ui/form";

import {
  Message,
  WorkerName,
} from "./DeleteWorkerModal.style";

const DeleteWorkerModal = ({
  open,
  worker,
  onClose,
  onDeleteWorker,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!open || !worker) return null;

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await onDeleteWorker(worker._id);
      onClose();
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleId = "delete-worker-modal-title";

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id={titleId} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--danger)" }}>
            Delete Worker
          </ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Close dialog">×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <Message>
            You are about to permanently delete the following worker.
            <br />
            <br />
            <WorkerName>
              {worker.fullName}
            </WorkerName>
            <br />
            <strong>Worker ID :</strong> {worker._id}
            <br />
            <strong>Mobile :</strong> {worker.mobileNumber}
            <br />
            <strong>Site :</strong> {worker.site || "-"}
            <br />
            <br />
            <span style={{ color: "var(--danger)", fontWeight: 600 }}>
              This action cannot be undone.
            </span>
          </Message>
        </ModalBody>

        <ModalFooter>
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <DangerButton type="button" disabled={isSubmitting} onClick={handleDelete}>
            {isSubmitting ? "Deleting..." : "Delete worker"}
          </DangerButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DeleteWorkerModal;
