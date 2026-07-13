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
  Input,
  Select,
  TextArea,
  Footer,
  CancelButton,
  SaveButton,
} from "./AdvancePaymentModal.style";

const AdvancePaymentModal = ({
  open,
  worker,
  onClose,
  onSave,
}) => {

  const [amount, setAmount] = useState("");

  const [method, setMethod] = useState("Cash");

  const [transactionId, setTransactionId] =
    useState("");

  const [remark, setRemark] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {

    if (open) {

      setAmount("");

      setMethod("Cash");

      setTransactionId("");

      setRemark("");

      setError("");

    }

  }, [open]);

  if (!open || !worker) return null;

  const handleSubmit = (e) => {

    e.preventDefault();

    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {

      setError(
        "Please enter a valid payment amount."
      );

      return;

    }

    if (paymentAmount > Number(worker.balance || 0)) {

      setError(
        "Payment amount cannot exceed remaining balance."
      );

      return;

    }

    onSave(worker.id, {

      paymentId: `PAY-${Date.now()}`,

      workerId: worker.id,

      workerName: worker.name,

      date: new Date()

        .toISOString()

        .split("T")[0],

      amount: paymentAmount,

      method,

      transactionId,

      remark,

    });

    onClose();

  };

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Advance Payment

          </Title>

          <CloseButton onClick={onClose}>

            ×

          </CloseButton>

        </Header>

        <Form onSubmit={handleSubmit}>

          <FormGroup>

            <Label>

              Worker

            </Label>

            <Input

              value={worker.name}

              disabled

            />

          </FormGroup>

          <FormGroup>

            <Label>

              Worker ID

            </Label>

            <Input

              value={worker.id}

              disabled

            />

          </FormGroup>

          <FormGroup>

            <Label>

              Gross Salary

            </Label>

            <Input

              value={`₹${Number(worker.grossSalary || 0).toLocaleString("en-IN")}`}

              disabled

            />

          </FormGroup>

          <FormGroup>

            <Label>

              Remaining Balance

            </Label>

            <Input

              value={`₹${Number(worker.balance || 0).toLocaleString("en-IN")}`}

              disabled

            />

          </FormGroup>

          <FormGroup>

            <Label>

              Advance Amount

            </Label>

            <Input

              type="number"

              placeholder="Enter Amount"

              value={amount}

              onChange={(e) =>
                setAmount(e.target.value)
              }

              required

            />

          </FormGroup>

          <FormGroup>

            <Label>

              Payment Method

            </Label>

            <Select

              value={method}

              onChange={(e) =>
                setMethod(e.target.value)
              }

            >

              <option>Cash</option>

              <option>UPI</option>

              <option>Bank Transfer</option>

              <option>Cheque</option>

            </Select>

          </FormGroup>

          <FormGroup>

            <Label>

              Transaction ID

            </Label>

            <Input

              placeholder="Optional"

              value={transactionId}

              onChange={(e) =>
                setTransactionId(
                  e.target.value
                )
              }

            />

          </FormGroup>

          <FormGroup>

            <Label>

              Remark

            </Label>

            <TextArea

              rows="4"

              placeholder="Remark"

              value={remark}

              onChange={(e) =>
                setRemark(e.target.value)
              }

            />

          </FormGroup>

          {

            error && (

              <p
                style={{
                  color: "#DC2626",
                  marginBottom: "1rem",
                  fontSize: ".9rem",
                }}
              >

                {error}

              </p>

            )

          }

          <Footer>

            <CancelButton

              type="button"

              onClick={onClose}

            >

              Cancel

            </CancelButton>

            <SaveButton type="submit">

              Save Payment

            </SaveButton>

          </Footer>

        </Form>

      </Modal>

    </Overlay>

  );

};

export default AdvancePaymentModal;