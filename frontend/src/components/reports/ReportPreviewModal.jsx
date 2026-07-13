import React from "react";

import {
  FiDownload,
  FiFileText,
} from "react-icons/fi";

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
} from "./ReportPreviewModal.style";

const ReportPreviewModal = ({
  open,
  report,
  onClose,
}) => {

  if (!open || !report) return null;

  const attendance =
    Number(report.attendance || 0);

  const grossSalary =
    Number(report.grossSalary || 0);

  const netSalary =
    Number(report.netSalary || 0);

  const balance =
    Number(report.balance || 0);

  const paid =
    grossSalary - balance;

  const status =
    balance <= 0
      ? "Paid"
      : balance < grossSalary
      ? "Partial"
      : "Pending";

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Worker Report

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

                {report.id}

              </Value>

            </Item>

            <Item>

              <Label>

                Worker Name

              </Label>

              <Value>

                {report.name}

              </Value>

            </Item>

            <Item>

              <Label>

                Site

              </Label>

              <Value>

                {report.site}

              </Value>

            </Item>

            <Item>

              <Label>

                Attendance

              </Label>

              <Value>

                {attendance}%

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

                Net Salary

              </Label>

              <Value>

                ₹{netSalary.toLocaleString("en-IN")}

              </Value>

            </Item>

            <Item>

              <Label>

                Amount Paid

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

          <Button>

            <FiDownload />

            Export Excel

          </Button>

          <Button>

            <FiFileText />

            Export PDF

          </Button>

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

export default ReportPreviewModal;