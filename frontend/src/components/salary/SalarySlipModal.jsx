import React from "react";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Grid,
  Item,
 Label,
  Value,
  Footer,
  Button,
} from "./SalarySlipModal.style";

const SalarySlipModal = ({
  open,
  worker,
  onClose,
}) => {

  if (!open || !worker) return null;

  const grossSalary =
    Number(worker.grossSalary || 0);

  const advance =
    Number(worker.advanceDeduction || 0);

  const paid =
    worker.status === "PAID" ? Number(worker.netSalary || 0) : 0;

  const balance =
    worker.status === "PAID" ? 0 : Number(worker.netSalary || 0);

  const netSalary =
    grossSalary - advance;

  const status =
    balance <= 0
      ? "Paid"
      : paid > 0
      ? "Partial"
      : "Pending";

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Salary Slip

          </Title>

          <CloseButton
            onClick={onClose}
          >

            ×

          </CloseButton>

        </Header>

        <Body>

          <Grid>

            <Item>

              <Label>

                Worker ID

              </Label>

              <Value>

                {worker._id}

              </Value>

            </Item>

            <Item>

              <Label>

                Worker Name

              </Label>

              <Value>

                {worker.worker?.fullName || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Mobile

              </Label>

              <Value>

                {worker.mobile || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Site

              </Label>

              <Value>

                {worker.site?.siteName || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Work Type

              </Label>

              <Value>

                {worker.worker?.trade || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Wage Type

              </Label>

              <Value>

                {

                  "Daily Wage"

                }

              </Value>

            </Item>

            <Item>

              <Label>

                Wage Rate

              </Label>

              <Value>

                {

                  `₹${Number(worker.dailyWage || 0).toLocaleString("en-IN")} / Day`

                }

              </Value>

            </Item>

            <Item>

              <Label>

                Days Worked

              </Label>

              <Value>

                {worker.workingDays || 0}

              </Value>

            </Item>

            <Item>

              <Label>

                Gross Salary

              </Label>

              <Value>

                ₹{grossSalary.toLocaleString("en-IN")}

              </Value>

            </Item>

            <Item>

              <Label>

                Advance Paid

              </Label>

              <Value>

                ₹{advance.toLocaleString("en-IN")}

              </Value>

            </Item>

            <Item>

              <Label>

                Net Salary

              </Label>

              <Value>

                ₹{netSalary.toLocaleString("en-IN")}

              </Value>

            </Item>

            <Item>

              <Label>

                Salary Paid

              </Label>

              <Value>

                ₹{paid.toLocaleString("en-IN")}

              </Value>

            </Item>

            <Item>

              <Label>

                Remaining Balance

              </Label>

              <Value>

                ₹{balance.toLocaleString("en-IN")}

              </Value>

            </Item>

            <Item>

              <Label>

                Payment Status

              </Label>

              <Value>

                {status}

              </Value>

            </Item>

          </Grid>

        </Body>

        <Footer>

          <Button
            onClick={onClose}
          >

            Close

          </Button>

        </Footer>

      </Modal>

    </Overlay>

  );

};

export default SalarySlipModal;