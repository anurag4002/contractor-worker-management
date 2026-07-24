import { useContext } from "react";
import AttendanceContext from "../context/AttendanceContext";

const useAttendance = () => {
    const context = useContext(AttendanceContext);

    if (!context) {
        throw new Error("useAttendance must be used inside AttendanceProvider");
    }

    return context;
};

export default useAttendance;
