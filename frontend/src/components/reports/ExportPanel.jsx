import React from "react";
import styled, { keyframes } from "styled-components";
import {
    FiDownload, FiFileText, FiUsers, FiCalendar,
    FiDollarSign, FiMapPin, FiGrid, FiLoader
} from "react-icons/fi";
import useExport from "../../hooks/useExport";

/* ─── Animations ───────────────────────────────────────────────── */
const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;

/* ─── Styled Components ─────────────────────────────────────────── */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.4rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(15,23,42,0.05);
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 8px 24px rgba(15,23,42,0.1); }
`;

const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
`;

const IconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 0.65rem;
  background: ${({ $color }) => `${$color}1a`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const Meta = styled.div`
  p { margin: 0; font-size: 0.78rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
  h4 { margin: 0.2rem 0 0; font-size: 0.95rem; font-weight: 600; color: #0f172a; }
`;

const Btn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border: none;
  border-radius: 0.6rem;
  background: ${({ $loading }) => ($loading ? "#f1f5f9" : "#2563eb")};
  color: ${({ $loading }) => ($loading ? "#94a3b8" : "#fff")};
  font-size: 0.82rem;
  font-weight: 600;
  cursor: ${({ $loading }) => ($loading ? "not-allowed" : "pointer")};
  white-space: nowrap;
  transition: background 0.2s;
  &:hover:not(:disabled) { background: #1d4ed8; }
  svg.spin { animation: ${spin} 1s linear infinite; }
`;

const SectionTitle = styled.h3`
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

/* ─── Data ──────────────────────────────────────────────────────── */
const EXPORTS = [
    {
        group: "Dashboard",
        items: [
            {
                key: "dashboardExcel", label: "Dashboard", sub: "Full summary",
                icon: <FiGrid />, color: "#2563eb", format: "Excel",
                fn: "exportDashboardExcel",
            },
            {
                key: "dashboardPdf", label: "Dashboard", sub: "Full summary",
                icon: <FiGrid />, color: "#7c3aed", format: "PDF",
                fn: "exportDashboardPdf",
            },
        ],
    },
    {
        group: "Module Reports",
        items: [
            {
                key: "workersPdf", label: "Workers", sub: "All worker records",
                icon: <FiUsers />, color: "#16a34a", format: "PDF",
                fn: "exportWorkersPdf",
            },
            {
                key: "attendancePdf", label: "Attendance", sub: "Full attendance log",
                icon: <FiCalendar />, color: "#ca8a04", format: "PDF",
                fn: "exportAttendancePdf",
            },
            {
                key: "payrollPdf", label: "Payroll", sub: "All payroll records",
                icon: <FiDollarSign />, color: "#dc2626", format: "PDF",
                fn: "exportPayrollPdf",
            },
            {
                key: "sitesPdf", label: "Sites", sub: "All site records",
                icon: <FiMapPin />, color: "#0891b2", format: "PDF",
                fn: "exportSitesPdf",
            },
        ],
    },
];

/* ─── Component ──────────────────────────────────────────────────── */
const ExportPanel = () => {
    const exportHook = useExport();
    const { downloading } = exportHook;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {EXPORTS.map(({ group, items }) => (
                <div key={group}>
                    <SectionTitle>{group}</SectionTitle>
                    <Grid>
                        {items.map(({ key, label, sub, icon, color, format, fn }) => {
                            const isLoading = !!downloading[key];
                            return (
                                <Card key={key}>
                                    <CardLeft>
                                        <IconBox $color={color}>{icon}</IconBox>
                                        <Meta>
                                            <p>{format}</p>
                                            <h4>{label}</h4>
                                            <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{sub}</span>
                                        </Meta>
                                    </CardLeft>
                                    <Btn
                                        $loading={isLoading}
                                        disabled={isLoading}
                                        onClick={exportHook[fn]}
                                        title={`Download ${label} ${format}`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <FiLoader className="spin" />
                                                Downloading…
                                            </>
                                        ) : (
                                            <>
                                                {format === "PDF" ? <FiFileText /> : <FiDownload />}
                                                Download
                                            </>
                                        )}
                                    </Btn>
                                </Card>
                            );
                        })}
                    </Grid>
                </div>
            ))}
        </div>
    );
};

export default ExportPanel;
