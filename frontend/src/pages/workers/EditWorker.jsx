import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiLoader, FiSave } from "react-icons/fi";
import styled from "styled-components";

import workerService from "../../services/worker.service";
import { showSuccess, showError } from "../../components/common/toast";

const Page = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
`;

const Card = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: var(--text);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
`;

const Subtitle = styled.p`
  margin: 0.35rem 0 0;
  color: var(--text-secondary);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 0.45rem;
`;

const Label = styled.label`
  color: var(--text-secondary);
  font-size: 0.86rem;
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.9rem;
  margin-top: 1.6rem;
`;

const Button = styled.button`
  border: none;
  border-radius: 0.9rem;
  padding: 0.9rem 1.2rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
`;

const SecondaryButton = styled(Button)`
  background: var(--border);
  color: var(--text);
`;

const PrimaryButton = styled(Button)`
  background: var(--primary);
  color: white;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--danger);
`;

const EmptyState = styled.div`
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem;
`;

const getWorkerPayload = (payload) => payload?.data || payload?.worker || payload?.workerData || payload || {};

const EditWorker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    site: "",
    department: "",
    role: "",
    status: "Active",
    joiningDate: "",
    address: "",
    emergencyContact: "",
  });

  const loadWorker = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await workerService.getWorkerById(id);
      const nextWorker = getWorkerPayload(response);
      setWorker(nextWorker);
      setForm({
        name: nextWorker.name || nextWorker.fullName || "",
        mobile: nextWorker.mobile || nextWorker.mobileNumber || "",
        email: nextWorker.email || "",
        site: nextWorker.site || nextWorker.siteName || "",
        department: nextWorker.department || "",
        role: nextWorker.role || nextWorker.workType || "",
        status: nextWorker.status || "Active",
        joiningDate: nextWorker.joiningDate || nextWorker.joining_date || "",
        address: nextWorker.address || "",
        emergencyContact: nextWorker.emergencyContact || nextWorker.emergencyPhone || "",
      });
    } catch (err) {
      if (err?.response?.status === 404) {
        setError("Worker not found.");
      } else if (!err?.response && err?.message?.toLowerCase().includes("network")) {
        setError("Network Error. Unable to connect to server.");
      } else {
        setError("Something went wrong while loading worker details.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadWorker();
    }
  }, [id]);

  const isSubmitDisabled = useMemo(() => {
    return saving || !form.name.trim() || !form.mobile.trim();
  }, [saving, form.name, form.mobile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.mobile.trim()) {
      showError("Worker name and mobile number are required.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      showError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      setSaving(true);
      await workerService.updateWorker(id, {
        fullName: form.name.trim(),
        mobileNumber: form.mobile.trim(),
        email: form.email.trim(),
        site: form.site.trim(),
        department: form.department.trim(),
        role: form.role.trim(),
        status: form.status,
        joiningDate: form.joiningDate,
        address: form.address.trim(),
        emergencyContact: form.emergencyContact.trim(),
      });

      showSuccess("Worker updated successfully.");
      navigate(`/workers/${id}`);
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.errors?.[0] || err?.message || "Something went wrong.";
      if (!err?.response && err?.message?.toLowerCase().includes("network")) {
        showError("Network Error\nUnable to connect to server.\nPlease check your internet connection.");
      } else if (err?.response?.status === 500) {
        showError("Something went wrong.\nPlease try again later.");
      } else {
        showError(`Worker Update Failed\n${message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <Card>
        {loading ? (
          <EmptyState>
            <FiLoader size={20} style={{ animation: "spin 1s linear infinite", marginRight: "0.5rem" }} />
            Loading worker details...
          </EmptyState>
        ) : error ? (
          <ErrorState>
            <div>{error}</div>
            <ButtonRow>
              <SecondaryButton type="button" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Back
              </SecondaryButton>
              <PrimaryButton type="button" onClick={loadWorker}>
                Retry
              </PrimaryButton>
            </ButtonRow>
          </ErrorState>
        ) : (
          <>
            <Header>
              <div>
                <Title>Edit Worker</Title>
                <Subtitle>Update the selected worker profile.</Subtitle>
              </div>
            </Header>

            <form onSubmit={handleSubmit}>
              <FormGrid>
                <Field>
                  <Label>Worker Name</Label>
                  <Input name="name" value={form.name} onChange={handleChange} />
                </Field>
                <Field>
                  <Label>Mobile Number</Label>
                  <Input name="mobile" value={form.mobile} onChange={handleChange} maxLength={10} />
                </Field>
                <Field>
                  <Label>Email</Label>
                  <Input name="email" value={form.email} onChange={handleChange} />
                </Field>
                <Field>
                  <Label>Site</Label>
                  <Input name="site" value={form.site} onChange={handleChange} />
                </Field>
                <Field>
                  <Label>Department</Label>
                  <Input name="department" value={form.department} onChange={handleChange} />
                </Field>
                <Field>
                  <Label>Role</Label>
                  <Input name="role" value={form.role} onChange={handleChange} />
                </Field>
                <Field>
                  <Label>Status</Label>
                  <Select name="status" value={form.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Select>
                </Field>
                <Field>
                  <Label>Joining Date</Label>
                  <Input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} />
                </Field>
                <Field style={{ gridColumn: "1 / -1" }}>
                  <Label>Address</Label>
                  <Input name="address" value={form.address} onChange={handleChange} />
                </Field>
                <Field>
                  <Label>Emergency Contact</Label>
                  <Input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} />
                </Field>
              </FormGrid>

              <ButtonRow>
                <SecondaryButton type="button" onClick={() => navigate(`/workers/${id}`)}>
                  <FiArrowLeft /> Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={isSubmitDisabled}>
                  <FiSave /> {saving ? "Saving..." : "Save Changes"}
                </PrimaryButton>
              </ButtonRow>
            </form>
          </>
        )}
      </Card>
    </Page>
  );
};

export default EditWorker;
