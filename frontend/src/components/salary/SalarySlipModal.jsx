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
    Number(worker.advance || 0);

  const paid =
    Number(worker.paid || 0);

  const balance =
    Number(worker.balance || 0);

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

                {worker.id}

              </Value>

            </Item>

            <Item>

              <Label>

                Worker Name

              </Label>

              <Value>

                {worker.name}

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

                {worker.site || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Work Type

              </Label>

              <Value>

                {worker.workType || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Wage Type

              </Label>

              <Value>

                {worker.wageType}

              </Value>

            </Item>

            <Item>

              <Label>

                Wage Rate

              </Label>

              <Value>

                {

                  worker.wageType === "Monthly"

                    ? `₹${Number(
                        worker.monthlySalary ||
                        worker.dailyWage ||
                        0
                      ).toLocaleString("en-IN")} / Month`

                    : `₹${Number(
                        worker.dailyWage || 0
                      ).toLocaleString("en-IN")} / Day`

                }

              </Value>

            </Item>

            <Item>

              <Label>

                Days Worked

              </Label>

              <Value>

                {worker.daysWorked || 0}

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