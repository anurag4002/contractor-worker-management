import React from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import useSites from "../../hooks/useSites";
import {
    Overlay as ModalOverlay,
    Modal as ModalContent,
    Header as ModalHeader,
    Title as ModalTitle,
    CloseButton,
    Footer as ModalFooter,
    SaveButton,
    CancelButton,
} from "../workermodal/WorkerModal.style";

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
            <ModalContent>
                <ModalHeader>
                    <ModalTitle id={titleId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}>
                        <FiAlertTriangle /> Delete Site
                    </ModalTitle>
                    <CloseButton type="button" onClick={onClose} aria-label="Close dialog"><FiX /></CloseButton>
                </ModalHeader>
                <div style={{ padding: '1.5rem' }}>
                    <p>Are you sure you want to delete the site <strong>{site?.siteName}</strong>?</p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>This action cannot be undone.</p>
                </div>
                <ModalFooter>
                    <CancelButton type="button" onClick={onClose} disabled={loading}>Cancel</CancelButton>
                    <SaveButton
                        type="button"
                        style={{ background: '#dc2626' }}
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete Site"}
                    </SaveButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default DeleteSiteModal;
