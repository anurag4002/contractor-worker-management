import React from "react";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Table,
  EmptyState,
} from "./AttendanceHistoryModal.style";

const AttendanceHistoryModal = ({
  open,
  worker,
  onClose,
}) => {

  if (!open || !worker) return null;

  const history = worker.history || [];

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Attendance History

          </Title>

          <CloseButton
            onClick={onClose}
          >

            ×

          </CloseButton>

        </Header>

        <div
          style={{
            marginBottom: "1.5rem",
          }}
        >

          <h3
            style={{
              marginBottom: ".25rem",
            }}
          >

            {worker.name}

          </h3>

          <p
            style={{
              color: "#64748b",
              margin: 0,
            }}
          >

            Worker ID : {worker.id}

          </p>

          <p
            style={{
              color: "#64748b",
              margin: ".25rem 0 0",
            }}
          >

            Site : {worker.site || "-"}

          </p>

        </div>

        {

          history.length > 0

          ? (

            <Table>

              <thead>

                <tr>

                  <th>Date</th>

                  <th>Status</th>

                  <th>Working Hours</th>

                  <th>Overtime</th>

                  <th>Remark</th>

                </tr>

              </thead>

              <tbody>

                {

                  history.map((item, index) => (

                    <tr key={index}>

                      <td>

                        {

                          item.date

                            ? new Date(item.date)
                                .toLocaleDateString("en-IN")

                            : "-"

                        }

                      </td>

                      <td>

                        {item.status}

                      </td>

                      <td>

                        {item.workingHours ?? 8} hrs

                      </td>

                      <td>

                        {item.overtime ?? 0} hrs

                      </td>

                      <td>

                        {item.remark || "-"}

                      </td>

                    </tr>

                  ))

                }

              </tbody>

            </Table>

          )

          : (

            <EmptyState>

              No attendance history available for this worker.

            </EmptyState>

          )

        }

      </Modal>

    </Overlay>

  );

};

export default AttendanceHistoryModal;