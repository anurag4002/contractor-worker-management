import React from "react";
import { FiDollarSign, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { SummaryGrid, Card, IconBox, Info } from "./Payroll.style";

const cards = [
    { key: "totalPayrolls", label: "Total Payrolls", icon: <FiDollarSign />, color: "#2563eb" },
    { key: "paid", label: "Paid", icon: <FiCheckCircle />, color: "#16a34a" },
    { key: "pending", label: "Pending", icon: <FiClock />, color: "#ca8a04" },
    { key: "totalNetPayable", label: "Total Net Payable", icon: <FiAlertCircle />, color: "#7c3aed" },
];

const PayrollSummary = ({ summary = {} }) => (
    <SummaryGrid>
        {cards.map(({ key, label, icon, color }) => (
            <Card key={key}>
                <IconBox color={color}>{icon}</IconBox>
                <Info>
                    <p>{label}</p>
                    <h3>
                        {key === "totalNetPayable"
                            ? `₹${(summary[key] || 0).toLocaleString("en-IN")}`
                            : summary[key] ?? 0}
                    </h3>
                </Info>
            </Card>
        ))}
    </SummaryGrid>
);

export default PayrollSummary;
