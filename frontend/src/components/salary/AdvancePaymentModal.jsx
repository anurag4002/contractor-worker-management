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

  const [saving, setSaving] = useState(false);

  useEffect(() => {

    if (open) {

      setAmount("");

      setMethod("Cash");

      setTransactionId("");

      setRemark("");

      setError("");

      setSaving(false);

    }

  }, [open]);

  if (!open || !worker) return null;

  const grossSalary = Number(worker.grossSalary || 0);

  const advanceDeduction = Number(worker.advanceDeduction || 0);

  const paid = Number(worker.paid || 0);

  const remainingBalance = Math.max(
    grossSalary -
    (worker.deduction || 0) -
    advanceDeduction -
    paid,
    0
  );

  const paymentAmount = Number(amount);

  const isAmountInvalid =
    !paymentAmount ||
    paymentAmount <= 0 ||
    paymentAmount > remainingBalance;

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!paymentAmount || paymentAmount <= 0) {

      setError(
        "Please enter a valid advance amount."
      );

      return;

    }

    if (paymentAmount > remainingBalance) {

      setError(
        `Advance payment cannot exceed the remaining balance of ₹${remainingBalance.toLocaleString("en-IN")}.`
      );

      return;

    }

    try {

      setSaving(true);

      const paymentMethodMap = {

        'Cash': 'CASH',

        'UPI': 'UPI',

        'Bank Transfer': 'BANK_TRANSFER',

        'Cheque': 'CHEQUE',

      };

      await onSave(worker._id, {

        amount: paymentAmount,

        paymentMethod: paymentMethodMap[method] || 'CASH',

        transactionId,

        remark,

      });

      onClose();

    } catch (err) {

      setSaving(false);

    }

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

                value={worker.worker?.fullName || ""}

                disabled

              />

          </FormGroup>

          <FormGroup>

            <Label>

              Worker ID

            </Label>

            <Input

              value={worker._id}

              disabled

            />

          </FormGroup>

          <FormGroup>

            <Label>

              Gross Salary

            </Label>

            <Input

              value={`₹${grossSalary.toLocaleString("en-IN")}`}

              disabled

            />

          </FormGroup>

          <FormGroup>

            <Label>

              Remaining Balance

            </Label>

              <Input

                value={`₹${remainingBalance.toLocaleString("en-IN")}`}

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

              onChange={(e) => {

                setAmount(e.target.value);

                if (error) {

                  setError("");

                }

              }}

              required

              min="0"

              step="0.01"

            />

            {
              amount &&
              paymentAmount > remainingBalance && (

                <p
                  style={{
                    color: "#DC2626",
                    marginTop: ".35rem",
                    fontSize: ".85rem",
                  }}
                >

                  Advance payment cannot exceed the remaining balance of ₹{remainingBalance.toLocaleString("en-IN")}.

                </p>

              )
            }

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

              maxLength={500}

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
              disabled={saving}
            >
              Cancel
            </CancelButton>

            <SaveButton type="submit" disabled={saving || isAmountInvalid}>
              {saving ? "Saving Payment..." : "Save Payment"}
            </SaveButton>

          </Footer>

        </Form>

      </Modal>

    </Overlay>

  );

};

export default AdvancePaymentModal;
