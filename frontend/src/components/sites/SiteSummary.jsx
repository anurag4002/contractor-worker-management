import React from "react";

import {
  FiMapPin,
  FiCheckCircle,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";

import SiteCard from "./SiteCard";

import {
  SummaryGrid,
} from "./SiteSummary.style";

const SiteSummary = ({
  sites = [],
  workers = [],
}) => {

  const totalSites = sites.length;

  const activeSites = sites.filter(
    (site) => site.status === "Active"
  ).length;

  const totalWorkers = sites.reduce(
    (total, site) => {

      if (Array.isArray(site.workers)) {

        return total + site.workers.length;

      }

      if (typeof site.workers === "number") {

        return total + site.workers;

      }

      return total;

    },
    0
  );

  const totalCapacity = sites.reduce(
    (total, site) =>

      total + Number(site.capacity || 0),

    0
  );

  const utilization = totalCapacity
    ? Math.round(
        (totalWorkers / totalCapacity) * 100
      )
    : 0;

  return (

    <SummaryGrid>

      <SiteCard
        title="Total Sites"
        value={totalSites}
        icon={<FiMapPin />}
        color="#2563EB"
      />

      <SiteCard
        title="Active Sites"
        value={activeSites}
        icon={<FiCheckCircle />}
        color="#16A34A"
      />

      <SiteCard
        title="Assigned Workers"
        value={totalWorkers}
        icon={<FiUsers />}
        color="#F59E0B"
      />

      <SiteCard
        title="Site Utilization"
        value={`${utilization}%`}
        icon={<FiBarChart2 />}
        color="#8B5CF6"
      />

    </SummaryGrid>

  );

};

export default SiteSummary;