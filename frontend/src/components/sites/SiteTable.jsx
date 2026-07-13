import React from "react";

import {
  FiEye,
  FiUsers,
  FiClipboard,
} from "react-icons/fi";

import {
  TableCard,
  Table,
  Status,
  ActionButtons,
  IconButton,
} from "./SiteTable.style";

const SiteTable = ({
  sites = [],
  onView,
  onAssign,
  onAttendance,
}) => {

  return (

    <TableCard>

      <Table>

        <thead>

          <tr>

            <th>#</th>

            <th>Site ID</th>

            <th>Site Name</th>

            <th>Location</th>

            <th>Supervisor</th>

            <th>Assigned Workers</th>

            <th>Present Today</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {

            sites.length === 0 ? (

              <tr>

                <td

                  colSpan="9"

                  style={{

                    textAlign: "center",

                    padding: "2rem",

                    color: "#64748B",

                  }}

                >

                  No sites found.

                </td>

              </tr>

            ) : (

              sites.map((site, index) => {

                const workerCount =

                  Array.isArray(site.workers)

                    ? site.workers.length

                    : Number(site.workers || 0);

                const presentCount =

                  Number(site.present || 0);

                return (

                  <tr key={site.id}>

                    <td>

                      {index + 1}

                    </td>

                    <td>

                      {site.id}

                    </td>

                    <td>

                      {site.name}

                    </td>

                    <td>

                      {site.location || "-"}

                    </td>

                    <td>

                      {site.supervisor || "-"}

                    </td>

                    <td>

                      {workerCount}

                    </td>

                    <td>

                      {presentCount} / {workerCount}

                    </td>

                    <td>

                      <Status

                        status={site.status}

                      >

                        {site.status}

                      </Status>

                    </td>

                    <td>

                      <ActionButtons>

                        <IconButton

                          title="View Details"

                          onClick={() =>

                            onView(site)

                          }

                        >

                          <FiEye />

                        </IconButton>

                        <IconButton

                          title="Assign Workers"

                          onClick={() =>

                            onAssign(site)

                          }

                        >

                          <FiUsers />

                        </IconButton>

                        <IconButton

                          title="Site Attendance"

                          onClick={() =>

                            onAttendance(site)

                          }

                        >

                          <FiClipboard />

                        </IconButton>

                      </ActionButtons>

                    </td>

                  </tr>

                );

              })

            )

          }

        </tbody>

      </Table>

    </TableCard>

  );

};

export default SiteTable;