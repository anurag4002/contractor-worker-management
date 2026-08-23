import React from "react";

import {
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

import {
  TableCard,
  Table,
  WorkerInfo,
  Avatar,
  Status,
  ActionButtons,
  IconButton,
  SkeletonRow,
  WorkerCardList,
  WorkerCard,
  WorkerCardHeader,
  WorkerCardIdentity,
  WorkerCardName,
  WorkerCardMeta,
  WorkerCardBody,
  WorkerCardField,
  WorkerCardLabel,
  WorkerCardValue,
  WorkerCardActions,
} from "./WorkerTable.style";

const WorkerTable = ({
  workers = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) => {

  const renderMobileCard = (worker, index) => (
    <WorkerCard key={`card-${worker._id}`}>
      <WorkerCardHeader>
        <WorkerCardIdentity>
          <Avatar>
            {worker.fullName?.charAt(0)?.toUpperCase() || "W"}
          </Avatar>
          <div>
            <WorkerCardName>{worker.fullName}</WorkerCardName>
            <WorkerCardMeta>{worker.employeeCode || worker._id}</WorkerCardMeta>
          </div>
        </WorkerCardIdentity>
        <Status $status={worker.status || "Active"}>
          {worker.status || "Active"}
        </Status>
      </WorkerCardHeader>
      <WorkerCardBody>
        <WorkerCardField>
          <WorkerCardLabel>Mobile</WorkerCardLabel>
          <WorkerCardValue>{worker.mobileNumber || "-"}</WorkerCardValue>
        </WorkerCardField>
        <WorkerCardField>
          <WorkerCardLabel>Trade</WorkerCardLabel>
          <WorkerCardValue>{worker.trade || "-"}</WorkerCardValue>
        </WorkerCardField>
        <WorkerCardField>
          <WorkerCardLabel>Skill</WorkerCardLabel>
          <WorkerCardValue>{worker.skillLevel || "-"}</WorkerCardValue>
        </WorkerCardField>
        <WorkerCardField>
          <WorkerCardLabel>Site</WorkerCardLabel>
          <WorkerCardValue>{worker.site || "-"}</WorkerCardValue>
        </WorkerCardField>
        <WorkerCardField>
          <WorkerCardLabel>Wage</WorkerCardLabel>
          <WorkerCardValue>
            {worker.salaryType === "DAILY"
              ? `₹${Number(worker.dailyWage || 0).toLocaleString("en-IN")}/Day`
              : `₹${Number(worker.monthlySalary || 0).toLocaleString("en-IN")}/Month`}
          </WorkerCardValue>
        </WorkerCardField>
        <WorkerCardField>
          <WorkerCardLabel>Joined</WorkerCardLabel>
          <WorkerCardValue>{worker.joiningDate || "-"}</WorkerCardValue>
        </WorkerCardField>
      </WorkerCardBody>
      <WorkerCardActions>
        <IconButton title="View Profile" onClick={() => onView(worker)}>
          <FiEye />
        </IconButton>
        <IconButton title="Edit Worker" onClick={() => onEdit(worker)}>
          <FiEdit />
        </IconButton>
        <IconButton title="Delete Worker" onClick={() => onDelete(worker)} style={{ color: 'var(--danger)' }}>
          <FiTrash2 />
        </IconButton>
      </WorkerCardActions>
    </WorkerCard>
  );

  return (

    <TableCard>

      <Table>

        <thead>

          <tr>

            <th>#</th>

            <th>Photo</th>

            <th>Worker ID</th>

            <th>Name</th>

            <th>Mobile</th>

            <th>Skill</th>

            <th>Work Type</th>

            <th>Site</th>

            <th>Wage Type</th>

            <th>Wage</th>

            <th>Joining Date</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {

            loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td colSpan={13} style={{ padding: "1rem" }}>
                    <SkeletonRow />
                  </td>
                </tr>
              ))
            ) : workers.length === 0 ? (

              <tr>

                <td
                  colSpan={13}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#64748b",
                  }}
                >

                  No workers found.

                </td>

              </tr>

            ) : (

              workers.map((worker, index) => (

                <tr key={worker._id}>

                  <td>

                    {index + 1}

                  </td>

                  <td>

                    <WorkerInfo>

                      {

                         worker.documents?.photo ? (

                           <img

                             src={worker.documents?.photo}

                             alt={worker.fullName}

                             width="42"

                             height="42"

                             style={

                               {

                                 borderRadius: "50%",

                                 objectFit: "cover",

                               }

                             }

                           />

                         ) : (

                           <Avatar>

                             {

                                worker.fullName

                                  ?.charAt(0)

                                 ?.toUpperCase() || "W"

                             }

                           </Avatar>

                         )

                       }

                    </WorkerInfo>

                  </td>

                  <td>

                      {worker._id}

                    </td>

                  <td>

                     {worker.fullName}

                  </td>

                  <td>

                     {worker.mobileNumber}

                  </td>

                  <td>

                    {worker.trade}

                  </td>

                  <td>

                    {worker.skillLevel}

                  </td>

                  <td>

                    {worker.site || "-"}

                  </td>

                  <td>

                    {worker.salaryType}

                  </td>

                  <td>

                    {

                      worker.salaryType === "DAILY"

                        ? `₹${Number(

                          worker.dailyWage || 0

                        ).toLocaleString("en-IN")}/Day`

                        : `₹${Number(

                          worker.monthlySalary || 0

                        ).toLocaleString("en-IN")}/Month`

                    }

                  </td>

                  <td>

                    {worker.joiningDate || "-"}

                  </td>

                  <td>

                    <Status

                      $status={

                        worker.status || "Active"

                      }

                    >

                      {

                        worker.status || "Active"

                      }

                    </Status>

                  </td>

                  <td>

                    <ActionButtons>

                      <IconButton

                        title="View Profile"

                        onClick={() =>

                          onView(worker)

                        }

                      >

                        <FiEye />

                      </IconButton>

                      <IconButton

                        title="Edit Worker"

                        onClick={() =>

                          onEdit(worker)

                        }

                      >

                        <FiEdit />

                      </IconButton>

                      <IconButton

                        title="Delete Worker"

                        onClick={() =>

                          onDelete(worker)

                        }

                      >

                        <FiTrash2 />

                      </IconButton>

                    </ActionButtons>

                  </td>

                </tr>

              ))

            )

          }

        </tbody>

      </Table>

      <WorkerCardList>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <WorkerCard key={`skel-${i}`}>
              <SkeletonRow />
            </WorkerCard>
          ))
        ) : (
          workers.map((worker, index) => renderMobileCard(worker, index))
        )}
      </WorkerCardList>

    </TableCard>

  );
};

export default WorkerTable;
