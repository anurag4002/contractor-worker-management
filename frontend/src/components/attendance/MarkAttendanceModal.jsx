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
  FormGroup,
  Label,
  Select,
  TextArea,
  Footer,
  CancelButton,
  SaveButton,
} from "./MarkAttendanceModal.style";

const MarkAttendanceModal = ({
  open,
  worker,
  onClose,
  onSave,
}) => {

  const [status, setStatus] =
    useState("Present");

  const [remark, setRemark] =
    useState("");

  const [workingHours, setWorkingHours] =
    useState("8");

  const [overtime, setOvertime] =
    useState("0");

  useEffect(() => {

    if (worker) {

      setStatus(worker.status || "Present");

      setRemark(worker.remark || "");

      setWorkingHours(
        worker.workingHours || "8"
      );

      setOvertime(
        worker.overtime || "0"
      );

    }

  }, [worker]);

  if (!open || !worker) return null;

  const handleSubmit = (e) => {

    e.preventDefault();

    onSave(worker.id, {

      status,

      remark,

      workingHours: Number(
        workingHours
      ),

      overtime: Number(
        overtime
      ),

      date: new Date()
        .toISOString()
        .split("T")[0],

    });

    onClose();

  };

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Mark Attendance

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

          <FormGroup>

            <Label>

              Worker Name

            </Label>

            <Select disabled>

              <option>

                {worker.name}

              </option>

            </Select>

          </FormGroup>

          <FormGroup>

            <Label>

              Worker ID

            </Label>

            <Select disabled>

              <option>

                {worker.id}

              </option>

            </Select>

          </FormGroup>

          <FormGroup>

            <Label>

              Site

            </Label>

            <Select disabled>

              <option>

                {worker.site}

              </option>

            </Select>

          </FormGroup>

          <FormGroup>

            <Label>

              Attendance Date

            </Label>

            <Select disabled>

              <option>

                {

                  new Date()

                    .toLocaleDateString("en-IN")

                }

              </option>

            </Select>

          </FormGroup>

          <FormGroup>

            <Label>

              Attendance Status

            </Label>

            <Select

              value={status}

              onChange={(e) =>

                setStatus(e.target.value)

              }

            >

              <option value="Present">

                Present

              </option>

              <option value="Absent">

                Absent

              </option>

              <option value="Leave">

                Leave

              </option>

            </Select>

          </FormGroup>

          <FormGroup>

            <Label>

              Working Hours

            </Label>

            <Select

              value={workingHours}

              onChange={(e) =>

                setWorkingHours(
                  e.target.value
                )

              }

            >

              {[

                ...Array(13),

              ].map((_, i) => (

                <option
                  key={i}
                  value={i}
                >

                  {i} Hours

                </option>

              ))}

            </Select>

          </FormGroup>

          <FormGroup>

            <Label>

              Overtime Hours

            </Label>

            <Select

              value={overtime}

              onChange={(e) =>

                setOvertime(
                  e.target.value
                )

              }

            >

              {[

                ...Array(9),

              ].map((_, i) => (

                <option
                  key={i}
                  value={i}
                >

                  {i} Hours

                </option>

              ))}

            </Select>

          </FormGroup>

          <FormGroup>

            <Label>

              Remark

            </Label>

            <TextArea

              rows="4"

              placeholder="Optional Remark"

              value={remark}

              onChange={(e) =>

                setRemark(e.target.value)

              }

            />

          </FormGroup>

          <Footer>

            <CancelButton

              type="button"

              onClick={onClose}

            >

              Cancel

            </CancelButton>

            <SaveButton

              type="submit"

            >

              Save Attendance

            </SaveButton>

          </Footer>

        </Form>

      </Modal>

    </Overlay>

  );

};

export default MarkAttendanceModal;