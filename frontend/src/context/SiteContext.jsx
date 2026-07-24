import { createContext, useContext, useState } from "react";
import siteService from "../services/site.service";
import { showSuccess, showError } from "../components/common/toast";

const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
    const [sites, setSites] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(false);
    const [selectedSite, setSelectedSite] = useState(null);

    const fetchSites = async (params = {}) => {
        try {
            setLoading(true);
            const data = await siteService.getSites(params);
            setSites(data?.data || data?.sites || data || []);
            if (data?.pagination) {
                setPagination(data.pagination);
            }
        } catch (error) {
            showError(error.response?.data?.message || "Failed to fetch sites.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSiteById = async (id) => {
        try {
            setLoading(true);
            const data = await siteService.getSiteById(id);
            return data?.data || data?.site || data;
        } catch (error) {
            showError(error.response?.data?.message || "Failed to fetch site details.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const addSite = async (payload) => {
        try {
            setLoading(true);
            await siteService.createSite(payload);
            showSuccess("Site created successfully");
            await fetchSites();
        } catch (error) {
            showError(error.response?.data?.message || "Failed to create site.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateSite = async (id, payload) => {
        try {
            setLoading(true);
            await siteService.updateSite(id, payload);
            showSuccess("Site updated successfully");
            await fetchSites();
        } catch (error) {
            showError(error.response?.data?.message || "Failed to update site.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteSite = async (id) => {
        try {
            setLoading(true);
            await siteService.deleteSite(id);
            showSuccess("Site deleted successfully");
            await fetchSites();
        } catch (error) {
            showError(error.response?.data?.message || "Failed to delete site.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const changeStatus = async (id, status) => {
        try {
            setLoading(true);
            await siteService.changeSiteStatus(id, status);
            showSuccess("Site status updated");
            await fetchSites();
        } catch (error) {
            showError(error.response?.data?.message || "Failed to update status.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <SiteContext.Provider
            value={{
                sites,
                setSites,
                pagination,
                setPagination,
                loading,
                setLoading,
                selectedSite,
                setSelectedSite,
                fetchSites,
                fetchSiteById,
                addSite,
                updateSite,
                deleteSite,
                changeStatus,
            }}
        >
            {children}
        </SiteContext.Provider>
    );
};

export default SiteContext;
