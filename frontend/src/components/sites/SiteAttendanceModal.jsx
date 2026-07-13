import React from "react";

import useWorkers from "../../hooks/useWorkers";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Summary,
  SummaryCard,
  Table,
  Footer,
  Button,
} from "./SiteAttendanceModal.style";

const SiteAttendanceModal = ({
  open,
  site,
  onClose,
}) => {

  const {
    workers,
    attendance,
  } = useWorkers();

  if (!open || !site) return null;

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const todayAttendance = attendance.filter(
    (item) =>
      item.site === site.name &&
      item.date === today
  );

  const present =
    todayAttendance.filter(
      (item) => item.status === "Present"
    ).length;

  const absent =
    todayAttendance.filter(
      (item) => item.status === "Absent"
    ).length;

  const leave =
    todayAttendance.filter(
      (item) => item.status === "Leave"
    ).length;

  const attendanceRows = todayAttendance.map(
    (record) => {

      const worker = workers.find(
        (item) =>
          item.id === record.workerId
      );

      return {
        id: worker?.id || record.workerId,
        name: worker?.name || "-",
        status: record.status,
      };

    }
  );

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            {site.name} Attendance

          </Title>

          <CloseButton
            onClick={onClose}
          >
            ×
          </CloseButton>

        </Header>

        <Summary>

          <SummaryCard>

            <h4>

              Present

            </h4>

            <span>

              {present}

            </span>

          </SummaryCard>

          <SummaryCard>

            <h4>

              Absent

            </h4>

            <span>

              {absent}

            </span>

          </SummaryCard>

          <SummaryCard>

            <h4>

              Leave

            </h4>

            <span>

              {leave}

            </span>

          </SummaryCard>

        </Summary>

        <Table>

          <thead>

            <tr>

              <th>Worker ID</th>

              <th>Name</th>

              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {

              attendanceRows.length === 0 ? (

                <tr>

                  <td
                    colSpan="3"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                    }}
                  >

                    No attendance found for today.

                  </td>

                </tr>

              ) : (

                attendanceRows.map((worker) => (

                  <tr key={worker.id}>

                    <td>

                      {worker.id}

                    </td>

                    <td>

                      {worker.name}

                    </td>

                    <td>

                      {worker.status}

                    </td>

                  </tr>

                ))

              )

            }

          </tbody>

        </Table>

        <Footer>

          <Button
            onClick={onClose}
          >

            Close

          </Button>

        </Footer>

      </Modal>

    </Overlay>

  );

};

export default SiteAttendanceModal;