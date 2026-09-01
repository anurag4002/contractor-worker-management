import { createContext, useState, useCallback } from "react";
import siteService from "../services/site.service";
import { showSuccess, showError } from "../components/common/toast";

const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
    const [sites, setSites] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(false);
    const [selectedSite, setSelectedSite] = useState(null);

    const fetchSites = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            const data = await siteService.getSites(params);
            setSites(data?.data || data?.sites || data || []);
            if (data?.pagination) {
                setPagination(data.pagination);
            }
        } catch (error) {
            showError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSiteById = useCallback(async (id) => {
        try {
            setLoading(true);
            const data = await siteService.getSiteById(id);
            return data?.data || data?.site || data;
        } catch (error) {
            showError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const addSite = useCallback(async (payload) => {
        try {
            setLoading(true);
            await siteService.createSite(payload);
            showSuccess("Site created successfully.");
            await fetchSites();
        } catch (error) {
            showError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchSites]);

    const updateSite = useCallback(async (id, payload) => {
        try {
            setLoading(true);
            await siteService.updateSite(id, payload);
            showSuccess("Site updated successfully.");
            await fetchSites();
        } catch (error) {
            showError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchSites]);

    const deleteSite = useCallback(async (id) => {
        try {
            setLoading(true);
            await siteService.deleteSite(id);
            showSuccess("Site deleted successfully.");
            await fetchSites();
        } catch (error) {
            showError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchSites]);

    const changeStatus = useCallback(async (id, status) => {
        try {
            setLoading(true);
            await siteService.changeSiteStatus(id, status);
            showSuccess("Site status updated");
            await fetchSites();
        } catch (error) {
            showError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchSites]);

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
