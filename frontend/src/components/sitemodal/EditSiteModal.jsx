import React, { useState, useEffect } from "react";
import useSites from "../../hooks/useSites";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormGrid,
  FormField,
  FormLabel,
  FormInput,
  FormDatePicker,
  FormTextarea,
  SectionCard,
  SectionTitle,
  SecondaryButton,
  PrimaryButton,
} from "../ui/form";
import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../ui/FormError";

const EditSiteModal = ({ open, onClose, site }) => {
  const { updateSite, loading } = useSites();
  const [formData, setFormData] = useState({
    siteName: "", clientName: "", projectName: "", address: "", city: "",
    district: "", state: "", pincode: "", contactPerson: "", contactNumber: "",
    startDate: "", description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors: apiErrors, clearFieldError, handleError } = useFormErrors();

  useEffect(() => {
    if (open && site) {
      setFormData({
        siteName: site.siteName || "", clientName: site.clientName || "",
        projectName: site.projectName || "", address: site.address || "",
        city: site.city || "", district: site.district || "", state: site.state || "",
        pincode: site.pincode || "", contactPerson: site.contactPerson || "",
        contactNumber: site.contactNumber || "",
        startDate: site.startDate ? site.startDate.split('T')[0] : "",
        description: site.description || ""
      });
    }
  }, [open, site]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearFieldError(e.target.name);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updateSite(site._id, formData);
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleId = "edit-site-modal-title";

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id={titleId}>Edit Site</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Close dialog">×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <SectionCard>
              <SectionTitle>Site Information</SectionTitle>
              <FormGrid>
                <FormField>
                  <FormLabel $required>Site Name</FormLabel>
                  <FormInput name="siteName" value={formData.siteName} onChange={handleChange} placeholder="Enter site name" required />
                  <FormError error={apiErrors.siteName} />
                </FormField>

                <FormField>
                  <FormLabel $required>Project Name</FormLabel>
                  <FormInput name="projectName" value={formData.projectName} onChange={handleChange} placeholder="Enter project name" required />
                  <FormError error={apiErrors.projectName} />
                </FormField>

                <FormField>
                  <FormLabel $required>Client Name</FormLabel>
                  <FormInput name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Enter client name" required />
                  <FormError error={apiErrors.clientName} />
                </FormField>

                <FormField style={{ gridColumn: "1 / -1" }}>
                  <FormLabel $required>Address</FormLabel>
                  <FormTextarea name="address" value={formData.address} onChange={handleChange} placeholder="Full address" required />
                  <FormError error={apiErrors.address} />
                </FormField>

                <FormField>
                  <FormLabel $required>City</FormLabel>
                  <FormInput name="city" value={formData.city} onChange={handleChange} placeholder="Enter city" required />
                  <FormError error={apiErrors.city} />
                </FormField>

                <FormField>
                  <FormLabel $required>District</FormLabel>
                  <FormInput name="district" value={formData.district} onChange={handleChange} placeholder="Enter district" required />
                  <FormError error={apiErrors.district} />
                </FormField>

                <FormField>
                  <FormLabel $required>State</FormLabel>
                  <FormInput name="state" value={formData.state} onChange={handleChange} placeholder="Enter state" required />
                  <FormError error={apiErrors.state} />
                </FormField>

                <FormField>
                  <FormLabel $required>Pincode</FormLabel>
                  <FormInput name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6-digit PIN" maxLength={6} required />
                  <FormError error={apiErrors.pincode} />
                </FormField>

                <FormField>
                  <FormLabel $required>Contact Person</FormLabel>
                  <FormInput name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Enter contact person" required />
                  <FormError error={apiErrors.contactPerson} />
                </FormField>

                <FormField>
                  <FormLabel $required>Contact Number</FormLabel>
                  <FormInput name="contactNumber" value={formData.contactNumber} onChange={handleChange} type="tel" placeholder="10-digit mobile number" maxLength={10} required />
                  <FormError error={apiErrors.contactNumber} />
                </FormField>

                <FormField>
                  <FormLabel $required>Start Date</FormLabel>
                  <FormDatePicker type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                  <FormError error={apiErrors.startDate} />
                </FormField>

                <FormField style={{ gridColumn: "1 / -1" }}>
                  <FormLabel>Description</FormLabel>
                  <FormTextarea name="description" value={formData.description} onChange={handleChange} placeholder="Optional site description" rows="3" />
                  <FormError error={apiErrors.description} />
                </FormField>
              </FormGrid>
            </SectionCard>

            <ModalFooter>
              <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting || loading}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Site"}
              </PrimaryButton>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditSiteModal;
