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
  SaveButton,
} from "./WorkerModal.style";

const defaultWorker = {
  id: "",
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

const EditWorkerModal = ({
  open,
  worker,
  onClose,
  onUpdateWorker,
}) => {

  const [form, setForm] =
    useState(defaultWorker);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {

    if (worker) {

      setForm({

        ...defaultWorker,

        ...worker,

      });

    }

  }, [worker]);

  if (!open || !worker) return null;

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({

      ...prev,

      [name]: value,

    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      form.name.trim() === "" ||
      form.mobile.trim() === "" ||
      form.skill.trim() === "" ||
      form.workType.trim() === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      alert("Please enter a valid mobile number.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdateWorker(form.id, {
        fullName: form.name,
        mobileNumber: form.mobile,
        trade: form.skill,
        salaryType: form.wageType === "Daily" ? "DAILY" : "MONTHLY",
        dailyWage: form.wageType === "Daily" ? Number(form.dailyWage) : 0,
        monthlySalary: form.wageType === "Monthly" ? Number(form.monthlySalary) : 0,
      });
      onClose();
    } catch (err) {
      // Handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Edit Worker

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

                Worker ID

              </Label>

              <Input

                value={form.id}

                disabled

              />

            </FormGroup>

            <FormGroup>

              <Label>

                Worker Name *

              </Label>

              <Input

                name="name"

                value={form.name}

                onChange={handleChange}

                required

              />

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

                required

              />

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

            </FormGroup>

            <FormGroup>

              <Label>

                Skill

              </Label>

              <Input

                name="skill"

                value={form.skill}

                onChange={handleChange}

                required

              />

            </FormGroup>

            <FormGroup>

              <Label>

                Work Type

              </Label>

              <Input

                name="workType"

                value={form.workType}

                onChange={handleChange}

                required

              />

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

                    />

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

                    />

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

              />

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

                  alt={form.name}

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

            <SaveButton

              type="submit"
              disabled={isSubmitting}

            >

              {isSubmitting ? "Updating..." : "Update Worker"}

            </SaveButton>

          </Footer>

        </Form>

      </Modal>

    </Overlay>

  );

};

export default EditWorkerModal;