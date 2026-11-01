import { useEffect, useState } from "react";

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

const SalaryPaymentModal = ({
  open,
  worker,
  onClose,
  onSave,
}) => {
  const [paymentType, setPaymentType] = useState("PARTIAL");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [transactionId, setTransactionId] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setPaymentType("PARTIAL");
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
  const deduction = Number(worker.deduction || 0);
  const advanceDeduction = Number(worker.advanceDeduction || 0);
  const paid = Number(worker.paid || 0);

  const remainingBalance = Math.max(
    grossSalary - deduction - advanceDeduction - paid,
    0
  );

  const actualWorkerId =
    worker?.worker?.employeeCode ||
    worker?.worker?._id ||
    worker?.worker ||
    "-";

  const isCancelled = worker?.status === "CANCELLED";
  const isFullySettled =
    worker?.status === "PAID" || remainingBalance <= 0;

  const paymentAmount = Number(amount);

  const isAmountInvalid =
    !paymentAmount ||
    paymentAmount <= 0 ||
    paymentAmount > remainingBalance ||
    (paymentType === "FULL" && paymentAmount !== remainingBalance);

  const handlePaymentTypeChange = (e) => {
    const selectedType = e.target.value;
    setPaymentType(selectedType);

    if (selectedType === "FULL") {
      setAmount(remainingBalance > 0 ? remainingBalance.toFixed(2) : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (isCancelled) {
      setError("Cancelled salary cannot be paid.");
      return;
    }

    if (!paymentAmount || paymentAmount <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    if (paymentType === "FULL" && paymentAmount !== remainingBalance) {
      setError("Full payment amount must exactly match the outstanding balance.");
      return;
    }

    if (paymentType === "PARTIAL" && paymentAmount >= remainingBalance) {
      setError("Partial payment amount must be less than the outstanding balance. Please record a full payment for the remaining amount.");
      return;
    }

    if (paymentAmount > remainingBalance) {
      setError(`Payment cannot exceed the remaining balance of ₹${remainingBalance.toLocaleString("en-IN")}.`);
      return;
    }

    try {
      setSaving(true);
      await onSave(worker._id, {
        amount: paymentAmount,
        paymentType,
        paymentMethod: methodValues[method] || "CASH",
        transactionId,
        remark,
      });
      onClose();
    } catch {
      setSaving(false);
    }
  };

  const methodOptions = [
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "Cheque", label: "Cheque" },
  ];

  const methodValues = {
    Cash: "CASH",
    UPI: "UPI",
    "Bank Transfer": "BANK_TRANSFER",
    Cheque: "CHEQUE",
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>
            Record Salary Payment
          </Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Worker</Label>
            <Input value={worker.worker?.fullName || ""} disabled />
          </FormGroup>

          <FormGroup>
            <Label>Worker ID</Label>
            <Input value={actualWorkerId} disabled />
          </FormGroup>

          <FormGroup>
            <Label>Gross Salary</Label>
            <Input value={`₹${grossSalary.toLocaleString("en-IN")}`} disabled />
          </FormGroup>

          <FormGroup>
            <Label>Remaining Balance</Label>
            <Input value={`₹${remainingBalance.toLocaleString("en-IN")}`} disabled />
          </FormGroup>

          <FormGroup>
            <Label>Payment Type</Label>
            <Select value={paymentType} onChange={handlePaymentTypeChange} disabled={saving}>
              <option value="FULL">Full Payment</option>
              <option value="PARTIAL">Partial Payment</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Payment Amount</Label>
            <Input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError("");
              }}
              required
              min="0"
              step="0.01"
            />
            {amount && paymentAmount > remainingBalance && (
              <p style={{ color: "#DC2626", marginTop: ".35rem", fontSize: ".85rem" }}>
                Payment cannot exceed the remaining balance of ₹{remainingBalance.toLocaleString("en-IN")}.
              </p>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Payment Method</Label>
            <Select value={method} onChange={(e) => setMethod(e.target.value)} disabled={saving}>
              {methodOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Transaction ID</Label>
            <Input placeholder="Optional" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <Label>Remark</Label>
            <TextArea rows="4" placeholder="Remark" value={remark} onChange={(e) => setRemark(e.target.value)} maxLength={500} />
          </FormGroup>

          {error && (
            <p style={{ color: "#DC2626", marginBottom: "1rem", fontSize: ".9rem" }}>
              {error}
            </p>
          )}

          <Footer>
            <CancelButton type="button" onClick={onClose} disabled={saving}>
              Cancel
            </CancelButton>
            <SaveButton type="submit" disabled={saving || isAmountInvalid || isCancelled || isFullySettled}>
              {saving ? "Saving Payment..." : "Save Payment"}
            </SaveButton>
          </Footer>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default SalaryPaymentModal;
