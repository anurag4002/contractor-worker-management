import { useContext } from "react";
import { ReportContext } from "../context/ReportContext";

const useReport = () => {
    const ctx = useContext(ReportContext);
    if (!ctx) throw new Error("useReport must be used within ReportProvider");
    return ctx;
};

export default useReport;
