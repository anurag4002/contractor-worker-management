import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import useSites from "../../hooks/useSites";
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

const DeleteSiteModal = ({ open, onClose, site }) => {
  const { deleteSite, loading } = useSites();

  if (!open) return null;

  const handleDelete = async () => {
    try {
      await deleteSite(site._id);
      onClose();
    } catch { }
  };

  const titleId = "delete-site-modal-title";

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id={titleId} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--danger)" }}>
            <FiAlertTriangle /> Delete Site
          </ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Close dialog">×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <p>Are you sure you want to delete the site <strong>{site?.siteName}</strong>?</p>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>This action cannot be undone.</p>
        </ModalBody>

        <ModalFooter>
          <SecondaryButton type="button" onClick={onClose} disabled={loading}>
            Cancel
          </SecondaryButton>
          <DangerButton
            type="button"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Site"}
          </DangerButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DeleteSiteModal;
