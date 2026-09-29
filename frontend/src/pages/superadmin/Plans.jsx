import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiRefreshCw,
  FiAlertCircle,
  FiCheck,
  FiEdit2,
  FiX,
  FiSave,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import { showSuccess, showError } from "../../utils/toastService";

import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  Toolbar,
  ActionButton,
  TableWrapper,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  LoadingState,
  ErrorState,
  RetryButton,
  FeaturesList,
  FeatureItem,
  FeatureIcon,
  FeatureText,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  SectionCard,
  SectionTitle,
  FormGrid,
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
  FormError,
  PrimaryButton,
  SecondaryButton,
  LimitGroup,
  LimitToggle,
  LimitInputWrapper,
  LimitInput,
  ConfirmOverlay,
  ConfirmDialog,
  ConfirmButtons,
} from "./Plans.style";

const initialFormData = {
  name: "",
  code: "",
  description: "",
  pricing: {
    monthly: 0,
    annual: 0,
  },
  currency: "INR",
  features: [],
  limits: {
    maxWorkers: null,
    maxSites: null,
    maxAdmins: null,
  },
  status: "ACTIVE",
};

const Plans = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unlimited, setUnlimited] = useState({
    maxWorkers: false,
    maxSites: false,
    maxAdmins: false,
  });
  const formDataRef = useRef(initialFormData);

  // Unsaved changes confirmation
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/subscription-plans");
      if (data.success) {
        setPlans(data.data || []);
      } else {
        throw new Error(data.message || "Failed to load plans");
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role?.code !== "SUPER_ADMIN" && user?.role !== "SUPER_ADMIN") {
      navigate("/dashboard", { replace: true });
      return;
    }

    loadPlans();
  }, [isAuthenticated, user, navigate]);

  // Validation
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Plan name is required";
    }

    if (formData.pricing.monthly === "" || formData.pricing.monthly === null) {
      errors.monthly = "Monthly price is required";
    } else if (Number(formData.pricing.monthly) < 0) {
      errors.monthly = "Monthly price cannot be negative";
    }

    if (formData.pricing.annual === "" || formData.pricing.annual === null) {
      errors.annual = "Annual price is required";
    } else if (Number(formData.pricing.annual) < 0) {
      errors.annual = "Annual price cannot be negative";
    }

    if (!formData.status) {
      errors.status = "Status is required";
    }

    // Validate limits when not unlimited
    if (!unlimited.maxWorkers) {
      const val = Number(formData.limits.maxWorkers);
      if (isNaN(val) || val < 0) {
        errors.maxWorkers = "Maximum workers cannot be negative";
      }
    }

    if (!unlimited.maxSites) {
      const val = Number(formData.limits.maxSites);
      if (isNaN(val) || val < 0) {
        errors.maxSites = "Maximum sites cannot be negative";
      }
    }

    if (!unlimited.maxAdmins) {
      const val = Number(formData.limits.maxAdmins);
      if (isNaN(val) || val < 0) {
        errors.maxAdmins = "Maximum admins cannot be negative";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("limits.")) {
      const limitKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        limits: {
          ...prev.limits,
          [limitKey]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.startsWith("pricing.")) {
      const pricingKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [pricingKey]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleUnlimitedChange = (limitKey) => {
    setUnlimited((prev) => {
      const newValue = !prev[limitKey];
      const newUnlimited = { ...prev, [limitKey]: newValue };

      // If enabling unlimited, clear the limit value
      if (newValue) {
        setFormData((prevForm) => ({
          ...prevForm,
          limits: {
            ...prevForm.limits,
            [limitKey]: null,
          },
        }));
        setFormErrors((prevErrors) => ({ ...prevErrors, [limitKey]: undefined }));
      }

      return newUnlimited;
    });
  };

  const hasUnsavedChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(formDataRef.current);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    const initialData = {
      name: plan.name || "",
      code: plan.code || "",
      description: plan.description || "",
      pricing: {
        monthly: plan.pricing?.monthly || 0,
        annual: plan.pricing?.annual || 0,
      },
      currency: plan.currency || "INR",
      features: plan.features || [],
      limits: {
        maxWorkers: plan.limits?.maxWorkers ?? null,
        maxSites: plan.limits?.maxSites ?? null,
        maxAdmins: plan.limits?.maxAdmins ?? null,
      },
      status: plan.status || "ACTIVE",
    };

    setFormData(initialData);
    formDataRef.current = initialData;
    setFormErrors({});
    setUnlimited({
      maxWorkers: plan.limits?.maxWorkers === null,
      maxSites: plan.limits?.maxSites === null,
      maxAdmins: plan.limits?.maxAdmins === null,
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    if (hasUnsavedChanges()) {
      setShowConfirmDiscard(true);
      setPendingAction("close");
      return;
    }
    setEditModalOpen(false);
    setEditingPlan(null);
    setFormData(initialFormData);
    formDataRef.current = initialFormData;
    setFormErrors({});
    setUnlimited({ maxWorkers: false, maxSites: false, maxAdmins: false });
  };

  const handleCancel = () => {
    closeEditModal();
  };

  const confirmDiscard = () => {
    setShowConfirmDiscard(false);
    if (pendingAction === "close") {
      setEditModalOpen(false);
      setEditingPlan(null);
      setFormData(initialFormData);
      formDataRef.current = initialFormData;
      setFormErrors({});
      setUnlimited({ maxWorkers: false, maxSites: false, maxAdmins: false });
    }
    setPendingAction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        pricing: {
          monthly: Number(formData.pricing.monthly),
          annual: Number(formData.pricing.annual),
        },
        currency: formData.currency,
        features: formData.features,
        limits: {
          maxWorkers: unlimited.maxWorkers ? null : Number(formData.limits.maxWorkers) || null,
          maxSites: unlimited.maxSites ? null : Number(formData.limits.maxSites) || null,
          maxAdmins: unlimited.maxAdmins ? null : Number(formData.limits.maxAdmins) || null,
        },
        status: formData.status,
      };

      const { data } = await axios.put(
        `/subscription-plans/${editingPlan._id}`,
        updateData
      );

      if (data.success) {
        showSuccess("Subscription plan updated successfully.");
        closeEditModal();
        loadPlans();
      } else {
        throw new Error(data.message || "Failed to update plan");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError("Failed to update subscription plan. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Subscription Plans</PageTitle>
        <PageSubtitle>
          Manage available subscription plans
        </PageSubtitle>
      </PageHeader>

      <Toolbar>
        <ActionButton type="button" variant="secondary" onClick={loadPlans}>
          <FiRefreshCw /> Refresh
        </ActionButton>
      </Toolbar>

      {loading ? (
        <LoadingState>
          <div className="loading-spinner" />
          <p>Loading plans...</p>
        </LoadingState>
      ) : error ? (
        <ErrorState>
          <FiAlertCircle size={48} color="#dc2626" />
          <h3>Failed to load plans</h3>
          <p>Please check your connection and try again.</p>
          <RetryButton onClick={loadPlans}>
            <FiRefreshCw /> Retry
          </RetryButton>
        </ErrorState>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Plan</TableHeaderCell>
                <TableHeaderCell>Code</TableHeaderCell>
                <TableHeaderCell>Monthly</TableHeaderCell>
                <TableHeaderCell>Annual</TableHeaderCell>
                <TableHeaderCell>Features</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell style={{ width: "100px" }}>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>
                    <strong>{plan.name}</strong>
                  </TableCell>
                  <TableCell>{plan.code}</TableCell>
                  <TableCell>₹{plan.pricing?.monthly?.toLocaleString("en-IN") || "—"}</TableCell>
                  <TableCell>₹{plan.pricing?.annual?.toLocaleString("en-IN") || "—"}</TableCell>
                  <TableCell>
                    <FeaturesList>
                      {(plan.features || []).slice(0, 3).map((feature) => (
                        <FeatureItem key={feature}>
                          <FeatureIcon>
                            <FiCheck />
                          </FeatureIcon>
                          <FeatureText>{feature}</FeatureText>
                        </FeatureItem>
                      ))}
                      {(plan.features || []).length > 3 && (
                        <FeatureItem>
                          <FeatureText>+{(plan.features || []).length - 3} more</FeatureText>
                        </FeatureItem>
                      )}
                    </FeaturesList>
                  </TableCell>
                  <TableCell>
                    <Badge success={plan.status === "ACTIVE"} danger={plan.status === "INACTIVE"}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ActionButton
                      variant="ghost"
                      onClick={() => openEditModal(plan)}
                      aria-label={`Edit ${plan.name}`}
                      title="Edit Plan"
                    >
                      <FiEdit2 size={16} />
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
              {plans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                    No plans found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableWrapper>
      )}

      {/* Edit Plan Modal */}
      {editModalOpen && editingPlan && (
        <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="edit-plan-title">
          <ModalContainer>
            <ModalHeader>
              <ModalTitle id="edit-plan-title">Edit Subscription Plan</ModalTitle>
              <ModalCloseButton
                type="button"
                onClick={handleCancel}
                aria-label="Close dialog"
                disabled={isSubmitting}
              >
                <FiX size={20} />
              </ModalCloseButton>
            </ModalHeader>

            <ModalBody>
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <SectionCard>
                  <SectionTitle>Basic Information</SectionTitle>
                  <FormGrid>
                    <FormField>
                      <FormLabel $required>Plan Name</FormLabel>
                      <FormInput
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter plan name"
                        required
                        disabled={isSubmitting}
                      />
                      <FormError error={formErrors.name} />
                    </FormField>

                    <FormField>
                      <FormLabel>Plan Code</FormLabel>
                      <FormInput
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Auto-generated from name"
                        readOnly
                        disabled
                      />
                      <FormError error={formErrors.code} />
                    </FormField>

                    <FormField style={{ gridColumn: "1 / -1" }}>
                      <FormLabel>Description</FormLabel>
                      <FormInput
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Optional description"
                        disabled={isSubmitting}
                      />
                      <FormError error={formErrors.description} />
                    </FormField>
                  </FormGrid>
                </SectionCard>

                {/* Pricing */}
                <SectionCard>
                  <SectionTitle>Pricing</SectionTitle>
                  <FormGrid>
                    <FormField>
                      <FormLabel $required>Monthly Price (₹)</FormLabel>
                      <FormInput
                        type="number"
                        name="pricing.monthly"
                        value={formData.pricing.monthly}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        step="1"
                        required
                        disabled={isSubmitting}
                      />
                      <FormError error={formErrors.monthly} />
                    </FormField>

                    <FormField>
                      <FormLabel $required>Annual Price (₹)</FormLabel>
                      <FormInput
                        type="number"
                        name="pricing.annual"
                        value={formData.pricing.annual}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        step="1"
                        required
                        disabled={isSubmitting}
                      />
                      <FormError error={formErrors.annual} />
                    </FormField>

                    <FormField>
                      <FormLabel>Currency</FormLabel>
                      <FormInput
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      <FormError error={formErrors.currency} />
                    </FormField>
                  </FormGrid>
                </SectionCard>

                {/* Limits */}
                <SectionCard>
                  <SectionTitle>Limits & Features</SectionTitle>
                  <FormGrid>
                    <FormField>
                      <FormLabel>Workers</FormLabel>
                      <LimitGroup>
                        <LimitToggle>
                          <input
                            type="checkbox"
                            name="unlimitedMaxWorkers"
                            checked={unlimited.maxWorkers}
                            onChange={() => handleUnlimitedChange("maxWorkers")}
                            disabled={isSubmitting}
                          />
                          <span>Unlimited</span>
                        </LimitToggle>
                        <LimitInputWrapper>
                          <LimitInput
                            type="number"
                            name="limits.maxWorkers"
                            value={formData.limits.maxWorkers ?? ""}
                            onChange={handleChange}
                            placeholder="Max workers"
                            min="0"
                            step="1"
                            disabled={unlimited.maxWorkers || isSubmitting}
                          />
                          <FormError error={formErrors.maxWorkers} />
                        </LimitInputWrapper>
                      </LimitGroup>
                    </FormField>

                    <FormField>
                      <FormLabel>Sites</FormLabel>
                      <LimitGroup>
                        <LimitToggle>
                          <input
                            type="checkbox"
                            name="unlimitedMaxSites"
                            checked={unlimited.maxSites}
                            onChange={() => handleUnlimitedChange("maxSites")}
                            disabled={isSubmitting}
                          />
                          <span>Unlimited</span>
                        </LimitToggle>
                        <LimitInputWrapper>
                          <LimitInput
                            type="number"
                            name="limits.maxSites"
                            value={formData.limits.maxSites ?? ""}
                            onChange={handleChange}
                            placeholder="Max sites"
                            min="0"
                            step="1"
                            disabled={unlimited.maxSites || isSubmitting}
                          />
                          <FormError error={formErrors.maxSites} />
                        </LimitInputWrapper>
                      </LimitGroup>
                    </FormField>

                    <FormField>
                      <FormLabel>Admins</FormLabel>
                      <LimitGroup>
                        <LimitToggle>
                          <input
                            type="checkbox"
                            name="unlimitedMaxAdmins"
                            checked={unlimited.maxAdmins}
                            onChange={() => handleUnlimitedChange("maxAdmins")}
                            disabled={isSubmitting}
                          />
                          <span>Unlimited</span>
                        </LimitToggle>
                        <LimitInputWrapper>
                          <LimitInput
                            type="number"
                            name="limits.maxAdmins"
                            value={formData.limits.maxAdmins ?? ""}
                            onChange={handleChange}
                            placeholder="Max admins"
                            min="0"
                            step="1"
                            disabled={unlimited.maxAdmins || isSubmitting}
                          />
                          <FormError error={formErrors.maxAdmins} />
                        </LimitInputWrapper>
                      </LimitGroup>
                    </FormField>
                  </FormGrid>
                </SectionCard>

                {/* Status */}
                <SectionCard>
                  <SectionTitle>Status</SectionTitle>
                  <FormGrid>
                    <FormField>
                      <FormLabel $required>Status</FormLabel>
                      <FormSelect
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </FormSelect>
                      <FormError error={formErrors.status} />
                    </FormField>
                  </FormGrid>
                </SectionCard>

                <ModalFooter>
                  <SecondaryButton type="button" onClick={handleCancel} disabled={isSubmitting}>
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <FiSave size={16} />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FiSave size={16} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </PrimaryButton>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Confirm Discard Changes Dialog */}
      {showConfirmDiscard && (
        <ConfirmOverlay onClick={() => setShowConfirmDiscard(false)}>
          <ConfirmDialog onClick={(e) => e.stopPropagation()}>
            <h3>Discard Unsaved Changes?</h3>
            <p>You have unsaved changes. Are you sure you want to discard them?</p>
            <ConfirmButtons>
              <SecondaryButton onClick={() => setShowConfirmDiscard(false)}>
                Continue Editing
              </SecondaryButton>
              <PrimaryButton onClick={confirmDiscard} variant="danger">
                Discard Changes
              </PrimaryButton>
            </ConfirmButtons>
          </ConfirmDialog>
        </ConfirmOverlay>
      )}
    </PageWrapper>
  );
};

export default Plans;
