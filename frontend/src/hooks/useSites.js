import { useContext } from "react";
import SiteContext from "../context/SiteContext";

const useSites = () => {
    const context = useContext(SiteContext);

    if (!context) {
        throw new Error("useSites must be used inside SiteProvider");
    }

    return context;
};

export default useSites;
