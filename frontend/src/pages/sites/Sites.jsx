import React, {
  useMemo,
  useState,
} from "react";

import {
  FiDownload,
  FiPlus,
} from "react-icons/fi";

import useWorkers from "../../hooks/useWorkers";

import SiteSummary from "../../components/sites/SiteSummary";
import SiteFilter from "../../components/sites/SiteFilter";
import SiteTable from "../../components/sites/SiteTable";

import SiteDetailsModal from "../../components/sites/SiteDetailsModal";
import AssignWorkerModal from "../../components/sites/AssignWorkerModal";
import SiteAttendanceModal from "../../components/sites/SiteAttendanceModal";

import {
  SitesContainer,
  Header,
  TitleSection,
  ActionSection,
  Button,
} from "./Sites.style";

const Sites = () => {

  const {

    sites,

    workers,

    attendance,

    loading,

    assignWorkerToSite,

  } = useWorkers();

  const sitesData =
    Array.isArray(sites) ? sites : [];

  const workersData =
    Array.isArray(workers) ? workers : [];

  const attendanceData =
    Array.isArray(attendance) ? attendance : [];

  const isLoading = loading ?? false;

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [selectedSite, setSelectedSite] =
    useState(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [assignOpen, setAssignOpen] =
    useState(false);

  const [attendanceOpen, setAttendanceOpen] =
    useState(false);

  const filteredSites = useMemo(() => {

    return sitesData.filter((site) => {

      const keyword =
        search.toLowerCase();

      const searchMatch =

        site.name
          ?.toLowerCase()
          .includes(keyword)

        ||

        site.location
          ?.toLowerCase()
          .includes(keyword)

        ||

        site.supervisor
          ?.toLowerCase()
          .includes(keyword);

      const statusMatch =

        status === "All"

          ? true

          : site.status === status;

      return (

        searchMatch &&

        statusMatch

      );

    });

  }, [

    sitesData,

    search,

    status,

  ]);

  return (

    <SitesContainer>

      <Header>

        <TitleSection>

          <h2>

            Site Management

          </h2>

          <p>

            Manage projects, supervisors and workers

          </p>

        </TitleSection>

        <ActionSection>

          <Button>

            <FiDownload />

            Export

          </Button>

          <Button>

            <FiPlus />

            Add Site

          </Button>

        </ActionSection>

      </Header>

      {isLoading ? (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          Loading sites...
        </div>
      ) : (
        <>
          <SiteSummary
            sites={sitesData}
            workers={workersData}
          />

          <SiteFilter

        search={search}

        setSearch={setSearch}

        status={status}

        setStatus={setStatus}

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

      />

          <SiteDetailsModal

            open={detailsOpen}

            site={selectedSite}

            workers={workersData}

            attendance={attendanceData}

            onClose={() =>

              setDetailsOpen(false)

            }

          />

          <AssignWorkerModal

            open={assignOpen}

            site={selectedSite}

            workers={workersData}

            onAssign={assignWorkerToSite}

            onClose={() =>

              setAssignOpen(false)

            }

          />

          <SiteAttendanceModal

            open={attendanceOpen}

            site={selectedSite}

            attendance={attendanceData}

            onClose={() =>

              setAttendanceOpen(false)

            }

          />
        </>
      )}

    </SitesContainer>

  );

};

export default Sites;