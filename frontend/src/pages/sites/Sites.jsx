import { useMemo, useState, useEffect } from "react";
import { FiDownload, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useWorkers from "../../hooks/useWorkers";
import useSites from "../../hooks/useSites";
import useExport from "../../hooks/useExport";
import { useSearch } from "../../context/SearchContext";

import SiteSummary from "../../components/sites/SiteSummary";
import SiteFilter from "../../components/sites/SiteFilter";
import SiteTable from "../../components/sites/SiteTable";

import SiteDetailsModal from "../../components/sites/SiteDetailsModal";
import AssignWorkerModal from "../../components/sites/AssignWorkerModal";
import SiteAttendanceModal from "../../components/sites/SiteAttendanceModal";
import AddSiteModal from "../../components/sitemodal/AddSiteModal";
import EditSiteModal from "../../components/sitemodal/EditSiteModal";
import DeleteSiteModal from "../../components/sitemodal/DeleteSiteModal";

import { SitesContainer, Header, TitleSection, ActionSection, Button } from "./Sites.style";

const Sites = () => {
  const { workers, fetchWorkers } = useWorkers();
  const { sites, loading, pagination, fetchSites, changeStatus } = useSites();
  const { exportSitesPdf, downloading } = useExport();
  const { searchQuery } = useSearch();

  const sitesData = Array.isArray(sites) ? sites : [];
  const workersData = Array.isArray(workers) ? workers : [];

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    console.log("Sites: MOUNTED");
    return () => console.log("Sites: UNMOUNTED");
  }, []);

  useEffect(() => {
    const params = { page, limit };
    if (search) params.search = search;
    if (status && status !== "All") params.status = status;

    fetchSites(params);
  }, [page, search, status, fetchSites]);

  const [selectedSite, setSelectedSite] = useState(null);

  // Modals
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleToggleStatus = (id, newStatus) => {
    changeStatus(id, newStatus);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleAssigned = async () => {
    const params = { page, limit };
    if (search) params.search = search;
    if (status && status !== "All") params.status = status;
    await Promise.all([
      fetchSites(params),
      fetchWorkers(),
    ]);
  };

  const filteredSites = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const globalKeyword = searchQuery.trim().toLowerCase();
    const effectiveKeyword = globalKeyword || keyword;

    if (!effectiveKeyword) {
      return sitesData;
    }

    return sitesData.filter((site) => {
      return (
        String(site.siteName || "")
          .toLowerCase()
          .includes(effectiveKeyword) ||
        String(site._id || "")
          .toLowerCase()
          .includes(effectiveKeyword) ||
        String(site.clientName || "")
          .toLowerCase()
          .includes(effectiveKeyword) ||
        String(site.projectName || "")
          .toLowerCase()
          .includes(effectiveKeyword) ||
        String(site.location || "")
          .toLowerCase()
          .includes(effectiveKeyword) ||
        String(site.supervisor || "")
          .toLowerCase()
          .includes(effectiveKeyword)
      );
    });
  }, [sitesData, search, searchQuery]);

  return (
    <SitesContainer>
      <Header>
        <TitleSection>
          <h2>Site Management</h2>
          <p>Manage projects, supervisors and workers</p>
        </TitleSection>
        <ActionSection>
          <Button
            onClick={() => exportSitesPdf()}
            disabled={downloading.sitesPdf}
          >
            <FiDownload />
            {downloading.sitesPdf ? "Exporting…" : "Export"}
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <FiPlus /> Add Site
          </Button>
        </ActionSection>
      </Header>

      {loading && !sitesData.length ? (
        <div style={{ padding: "var(--content-padding)", textAlign: "center", color: "var(--text-secondary)" }}>
          Loading sites...
        </div>
      ) : (
        <>
          <SiteSummary sites={sitesData} workers={workersData} />

          <SiteFilter
            search={search}
            setSearch={(val) => { setSearch(val); setPage(1); }}
            status={status}
            setStatus={(val) => { setStatus(val); setPage(1); }}
          />

          <SiteTable
            sites={filteredSites}
            onView={(site) => {
              setSelectedSite(site);
              setDetailsOpen(true);
            }}
            onAssign={(site) => {
              setSelectedSite(site);
              setAssignOpen(true);
            }}
            onAttendance={(site) => {
              setSelectedSite(site);
              setAttendanceOpen(true);
            }}
            onEdit={(site) => {
              setSelectedSite(site);
              setEditOpen(true);
            }}
            onDelete={(site) => {
              setSelectedSite(site);
              setDeleteOpen(true);
            }}
            onToggleStatus={handleToggleStatus}
          />

          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
                <FiChevronLeft /> Prev
              </Button>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                Page {page} of {pagination.totalPages}
              </span>
              <Button disabled={page === pagination.totalPages} onClick={() => handlePageChange(page + 1)}>
                Next <FiChevronRight />
              </Button>
            </div>
          )}

          <SiteDetailsModal
            open={detailsOpen}
            site={selectedSite}
            onClose={() => setDetailsOpen(false)}
          />

          <AssignWorkerModal
            open={assignOpen}
            site={selectedSite}
            onAssigned={handleAssigned}
            onClose={() => setAssignOpen(false)}
          />

          <SiteAttendanceModal
            key={`${selectedSite?._id}-${attendanceOpen}`}
            open={attendanceOpen}
            site={selectedSite}
            onSaved={handleAssigned}
            onClose={() => setAttendanceOpen(false)}
          />

          <AddSiteModal open={addOpen} onClose={() => setAddOpen(false)} />

          <EditSiteModal open={editOpen} site={selectedSite} onClose={() => setEditOpen(false)} />

          <DeleteSiteModal open={deleteOpen} site={selectedSite} onClose={() => setDeleteOpen(false)} />
        </>
      )}
    </SitesContainer>
  );
};

export default Sites;