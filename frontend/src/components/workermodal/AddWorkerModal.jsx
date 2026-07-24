import React, {
  useEffect,
  useState,
} from "react";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Form,
  Grid,
  FormGroup,
  Label,
  Input,
  Select,
  Footer,
  CancelButton,
} from "./WorkerModal.style";
import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../ui/FormError";
import LoadingButton from "../ui/LoadingButton";

const initialState = {
  name: "",
  mobile: "",
  photo: "",
  skill: "",
  workType: "",
  wageType: "Daily",
  dailyWage: "",
  monthlySalary: "",
  joiningDate: "",
  site: "Site A",
  status: "Active",
};

const AddWorkerModal = ({
  open,
  onClose,
  onAddWorker,
}) => {

  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors: apiErrors, clearFieldError, handleError } = useFormErrors();

  useEffect(() => {

    if (open) {

      setForm(initialState);

    }

  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {

    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      form.name.trim() === "" ||
      form.mobile.trim() === "" ||
      form.skill.trim() === "" ||
      form.workType.trim() === ""
    ) {
      handleError({ response: { data: { message: "Please fill all required fields." } } });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      handleError({ response: { data: { message: "Enter a valid mobile number.", errors: { mobile: "Invalid mobile number" } } } });
      return;
    }

    const worker = {
      fullName: form.name,
      mobileNumber: form.mobile,
      trade: form.skill,
      workType: form.workType,
      site: form.site || null,
      salaryType: form.wageType === "Daily" ? "DAILY" : "MONTHLY",
      dailyWage: form.wageType === "Daily" ? Number(form.dailyWage) : 0,
      monthlySalary: form.wageType === "Monthly" ? Number(form.monthlySalary) : 0,
      joiningDate: form.joiningDate || new Date().toISOString().split("T")[0],
      fatherName: "Not Provided", // Assuming fatherName is required in backend
      gender: "MALE", // Defaulting as UI doesn't have it
      dateOfBirth: "2000-01-01", // Defaulting as UI doesn't have it
      aadhaarNumber: "000011112222", // Defaulting
      address: "Not Provided",
      state: "State",
      district: "District",
      city: "City",
      pincode: "000000",
      emergencyContactName: "Not Provided",
      emergencyContactNumber: "9999999999",
      photo: form.photo || "",
    };

    try {
      setIsSubmitting(true);
      await onAddWorker(worker);
      setForm(initialState);
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }

  };

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Add New Worker

          </Title>

          <CloseButton
            onClick={onClose}
          >

            ×

          </CloseButton>

        </Header>

        <Form
          onSubmit={handleSubmit}
        >

          <Grid>

            <FormGroup>

              <Label>

                Worker Name *

              </Label>

              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter worker name"
                required
              />
              <FormError error={apiErrors.name || apiErrors.fullName} />

            </FormGroup>

            <FormGroup>

              <Label>

                Mobile Number *

              </Label>

              <Input
                type="tel"
                maxLength={10}
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                required
              />
              <FormError error={apiErrors.mobile || apiErrors.mobileNumber} />

            </FormGroup>

            <FormGroup>

              <Label>

                Photo URL

              </Label>

              <Input
                name="photo"
                value={form.photo}
                onChange={handleChange}
                placeholder="https://image-url"
              />
              <FormError error={apiErrors.photo} />

            </FormGroup>

            <FormGroup>

              <Label>

                Skill

              </Label>

              <Input
                name="skill"
                value={form.skill}
                onChange={handleChange}
                placeholder="Electrician"
                required
              />
              <FormError error={apiErrors.skill || apiErrors.trade} />

            </FormGroup>

            <FormGroup>

              <Label>

                Work Type

              </Label>

              <Input
                name="workType"
                value={form.workType}
                onChange={handleChange}
                placeholder="Electrical Work"
                required
              />
              <FormError error={apiErrors.workType} />

            </FormGroup>

            <FormGroup>

              <Label>

                Wage Type

              </Label>

              <Select
                name="wageType"
                value={form.wageType}
                onChange={handleChange}
              >

                <option value="Daily">

                  Daily

                </option>

                <option value="Monthly">

                  Monthly

                </option>

              </Select>
              <FormError error={apiErrors.wageType || apiErrors.salaryType} />

            </FormGroup>

            {

              form.wageType === "Daily"

                ? (

                  <FormGroup>

                    <Label>

                      Daily Wage

                    </Label>

                    <Input
                      type="number"
                      name="dailyWage"
                      value={form.dailyWage}
                      onChange={handleChange}
                      required
                    />
                    <FormError error={apiErrors.dailyWage} />

                  </FormGroup>

                )

                : (

                  <FormGroup>

                    <Label>

                      Monthly Salary

                    </Label>

                    <Input
                      type="number"
                      name="monthlySalary"
                      value={form.monthlySalary}
                      onChange={handleChange}
                      required
                    />
                    <FormError error={apiErrors.monthlySalary} />

                  </FormGroup>

                )

            }

            <FormGroup>

              <Label>

                Joining Date

              </Label>

              <Input
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                required
              />
              <FormError error={apiErrors.joiningDate} />

            </FormGroup>

            <FormGroup>

              <Label>

                Site

              </Label>

              <Select
                name="site"
                value={form.site}
                onChange={handleChange}
              >

                <option>

                  Site A

                </option>

                <option>

                  Site B

                </option>

                <option>

                  Site C

                </option>

                <option>

                  Site D

                </option>

              </Select>

            </FormGroup>

            <FormGroup>

              <Label>

                Status

              </Label>

              <Select
                name="status"
                value={form.status}
                onChange={handleChange}
              >

                <option>

                  Active

                </option>

                <option>

                  Inactive

                </option>

              </Select>

            </FormGroup>

          </Grid>

          {

            form.photo && (

              <div
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >

                <img
                  src={form.photo}
                  alt="Preview"
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #e2e8f0",
                  }}
                />

              </div>

            )

          }

          <Footer>

            <CancelButton
              type="button"
              onClick={onClose}
            >

              Cancel

            </CancelButton>

            <LoadingButton
              type="submit"
              loading={isSubmitting}
              loadingText="Adding..."
              style={{
                background: "#2563EB", color: "white", padding: "0.55rem 1.25rem",
                borderRadius: "0.6rem", fontSize: "0.95rem", fontWeight: 600,
                border: "none", cursor: "pointer", transition: "all 0.2s"
              }}
            >
              Add Worker
            </LoadingButton>

          </Footer>

        </Form>

      </Modal>

    </Overlay>

  );

};

export default AddWorkerModal;