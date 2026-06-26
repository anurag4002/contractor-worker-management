import React, { useMemo, useState } from "react";

import {
  FiSearch,
  FiPlus,
  FiMapPin,
  FiUsers,
  FiUser,
  FiEye,
} from "react-icons/fi";

import sitesData from "./Sites.data.json";

import {
  SitesContainer,
  Header,
  TitleSection,
  ActionSection,
  SearchBox,
  Button,
  SiteGrid,
  SiteCard,
  SiteHeader,
  StatusBadge,
  SiteInfo,
  ProgressWrapper,
  ProgressTop,
  ProgressBar,
  ProgressFill,
  CardFooter,
  WorkerCount,
  ViewButton,
} from "./Sites.style";

const Sites = () => {
  const [search, setSearch] = useState("");

  const filteredSites = useMemo(() => {
    return sitesData.sites.filter(
      (site) =>
        site.name.toLowerCase().includes(search.toLowerCase()) ||
        site.location.toLowerCase().includes(search.toLowerCase()) ||
        site.supervisor.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <SitesContainer>

      {/* Header */}

      <Header>

        <TitleSection>

          <h2>{sitesData.title}</h2>

          <p>{sitesData.description}</p>

        </TitleSection>

        <ActionSection>

          <SearchBox>

            <FiSearch />

            <input
              type="text"
              placeholder="Search Site..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </SearchBox>

          <Button>

            <FiPlus />

            Add Site

          </Button>

        </ActionSection>

      </Header>

      {/* Site Cards */}

      <SiteGrid>

        {filteredSites.map((site) => (

          <SiteCard key={site.id}>

            <SiteHeader>

              <h3>{site.name}</h3>

              <StatusBadge status={site.status}>

                {site.status}

              </StatusBadge>

            </SiteHeader>

            <SiteInfo>

              <p>

                <FiMapPin />

                {site.location}

              </p>

              <p>

                <FiUser />

                Supervisor : {site.supervisor}

              </p>

              <p>

                <FiUsers />

                {site.workers} Workers

              </p>

            </SiteInfo>

            <ProgressWrapper>

              <ProgressTop>

                <span>Project Progress</span>

                <span>{site.progress}%</span>

              </ProgressTop>

              <ProgressBar>

                <ProgressFill progress={site.progress} />

              </ProgressBar>

            </ProgressWrapper>

            <CardFooter>

              <WorkerCount>

                {site.workers} Assigned

              </WorkerCount>

              <ViewButton>

                <FiEye />

                &nbsp;

                View

              </ViewButton>

            </CardFooter>

          </SiteCard>

        ))}

      </SiteGrid>

    </SitesContainer>
  );
};

export default Sites;