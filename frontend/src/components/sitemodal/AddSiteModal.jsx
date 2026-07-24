import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import useSites from "../../hooks/useSites";
import {
    Overlay as ModalOverlay,
    Modal as ModalContent,
    Header as ModalHeader,
    Title as ModalTitle,
    CloseButton,
    Form as ModalBody,
    Footer as ModalFooter,
    SaveButton as Button,
    CancelButton,
    FormGroup,
    Label,
    Input,
} from "../workermodal/WorkerModal.style";
import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../ui/FormError";
import LoadingButton from "../ui/LoadingButton";

const AddSiteModal = ({ open, onClose }) => {
    const { addSite, loading } = useSites();
    const [formData, setFormData] = useState({
        siteName: "", clientName: "", projectName: "", address: "", city: "",
        district: "", state: "", pincode: "", contactPerson: "", contactNumber: "",
        startDate: "", description: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { errors: apiErrors, clearFieldError, handleError } = useFormErrors();

    useEffect(() => {
        if (open) {
            setFormData({
                siteName: "", clientName: "", projectName: "", address: "", city: "",
                district: "", state: "", pincode: "", contactPerson: "", contactNumber: "",
                startDate: "", description: ""
            });
        }
    }, [open]);

    if (!open) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        clearFieldError(e.target.name);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await addSite(formData);
            onClose();
        } catch (error) {
            handleError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Add New Site</ModalTitle>
                    <CloseButton type="button" onClick={onClose}><FiX /></CloseButton>
                </ModalHeader>
                <ModalBody onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormGroup>
                        <Label>Site Name *</Label>
                        <Input name="siteName" value={formData.siteName} onChange={handleChange} required />
                        <FormError error={apiErrors.siteName} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Project Name *</Label>
                        <Input name="projectName" value={formData.projectName} onChange={handleChange} required />
                        <FormError error={apiErrors.projectName} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Client Name *</Label>
                        <Input name="clientName" value={formData.clientName} onChange={handleChange} required />
                        <FormError error={apiErrors.clientName} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Address *</Label>
                        <Input name="address" value={formData.address} onChange={handleChange} required />
                        <FormError error={apiErrors.address} />
                    </FormGroup>
                    <FormGroup>
                        <Label>City *</Label>
                        <Input name="city" value={formData.city} onChange={handleChange} required />
                        <FormError error={apiErrors.city} />
                    </FormGroup>
                    <FormGroup>
                        <Label>District *</Label>
                        <Input name="district" value={formData.district} onChange={handleChange} required />
                        <FormError error={apiErrors.district} />
                    </FormGroup>
                    <FormGroup>
                        <Label>State *</Label>
                        <Input name="state" value={formData.state} onChange={handleChange} required />
                        <FormError error={apiErrors.state} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Pincode *</Label>
                        <Input name="pincode" value={formData.pincode} onChange={handleChange} required />
                        <FormError error={apiErrors.pincode} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Contact Person *</Label>
                        <Input name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
                        <FormError error={apiErrors.contactPerson} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Contact Number *</Label>
                        <Input name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                        <FormError error={apiErrors.contactNumber} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Start Date *</Label>
                        <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                        <FormError error={apiErrors.startDate} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Description</Label>
                        <Input name="description" value={formData.description} onChange={handleChange} />
                        <FormError error={apiErrors.description} />
                    </FormGroup>
                    <ModalFooter style={{ gridColumn: '1 / -1' }}>
                        <CancelButton type="button" onClick={onClose} disabled={isSubmitting || loading}>Cancel</CancelButton>
                        <LoadingButton
                            type="submit"
                            loading={isSubmitting}
                            loadingText="Saving..."
                            style={{
                                background: "#2563EB", color: "white", padding: "0.55rem 1.25rem",
                                borderRadius: "0.6rem", fontSize: "0.95rem", fontWeight: 600,
                                border: "none", cursor: "pointer", transition: "all 0.2s"
                            }}
                        >
                            Add Site
                        </LoadingButton>
                    </ModalFooter>
                </ModalBody>
            </ModalContent>
        </ModalOverlay>
    );
};

export default AddSiteModal;
