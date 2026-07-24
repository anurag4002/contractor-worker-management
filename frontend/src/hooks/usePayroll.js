import { useContext } from "react";
import PayrollContext from "../context/PayrollContext";

const usePayroll = () => {
    const context = useContext(PayrollContext);
    if (!context) throw new Error("usePayroll must be used inside PayrollProvider");
    return context;
};

export default usePayroll;
