import React, { useMemo, useState, useEffect } from "react";
import { FiDownload, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useWorkers from "../../hooks/useWorkers";
import useSites from "../../hooks/useSites";

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
  const { workers, attendance, assignWorkerToSite } = useWorkers();
  const { sites, loading, pagination, fetchSites, changeStatus } = useSites();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    // Backend search/filter/pagination
    const params = { page, limit };
    if (search) params.search = search;
    if (status && status !== "All") params.status = status;

    fetchSites(params);
  }, [page, search, status]);

  const sitesData = Array.isArray(sites) ? sites : [];
  const workersData = Array.isArray(workers) ? workers : [];
  const attendanceData = Array.isArray(attendance) ? attendance : [];

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

  return (
    <SitesContainer>
      <Header>
        <TitleSection>
          <h2>Site Management</h2>
          <p>Manage projects, supervisors and workers</p>
        </TitleSection>
        <ActionSection>
          <Button>
            <FiDownload /> Export
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <FiPlus /> Add Site
          </Button>
        </ActionSection>
      </Header>

      {loading && !sitesData.length ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
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
            sites={sitesData}
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
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
            workers={workersData}
            attendance={attendanceData}
            onClose={() => setDetailsOpen(false)}
          />

          <AssignWorkerModal
            open={assignOpen}
            site={selectedSite}
            workers={workersData}
            onAssign={assignWorkerToSite}
            onClose={() => setAssignOpen(false)}
          />

          <SiteAttendanceModal
            open={attendanceOpen}
            site={selectedSite}
            attendance={attendanceData}
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