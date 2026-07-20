import { useNavigate } from "react-router-dom";

import {
  Container,
  Section,
  Title,
  List,
  Item,
  Primary,
  Secondary,
  Status,
  Empty,
} from "./RecentActivity.style";

const RecentActivity = ({
  recentWorkers = [],
  recentAttendance = [],
  recentPayroll = [],
}) => {
  const navigate = useNavigate();

  return (
    <Container>

      <Section>
        <Title>Recent Workers</Title>

        <List>
          {recentWorkers.length === 0 ? (
            <Empty>No workers found.</Empty>
          ) : (
            recentWorkers.map((worker) => (
              <Item
                key={worker._id}
                onClick={() =>
                  navigate("/workers")
                }
              >
                <div>
                  <Primary>
                    {worker.fullName}
                  </Primary>

                  <Secondary>
                    {worker.employeeCode}
                  </Secondary>
                </div>

                <Status active>
                  {worker.status}
                </Status>
              </Item>
            ))
          )}
        </List>
      </Section>

      <Section>
        <Title>Recent Attendance</Title>

        <List>
          {recentAttendance.length === 0 ? (
            <Empty>No attendance found.</Empty>
          ) : (
            recentAttendance.map((item) => (
              <Item
                key={item._id}
                onClick={() =>
                  navigate("/attendance")
                }
              >
                <div>
                  <Primary>
                    {item.worker?.fullName}
                  </Primary>

                  <Secondary>
                    {item.site?.siteName}
                  </Secondary>
                </div>

                <Status>
                  {item.status}
                </Status>
              </Item>
            ))
          )}
        </List>
      </Section>

      <Section>
        <Title>Recent Payroll</Title>

        <List>
          {recentPayroll.length === 0 ? (
            <Empty>No payroll found.</Empty>
          ) : (
            recentPayroll.map((item) => (
              <Item
                key={item._id}
                onClick={() =>
                  navigate("/salary")
                }
              >
                <div>
                  <Primary>
                    {item.worker?.fullName}
                  </Primary>

                  <Secondary>
                    ₹
                    {Number(
                      item.netSalary
                    ).toLocaleString("en-IN")}
                  </Secondary>
                </div>

                <Status>
                  {item.status}
                </Status>
              </Item>
            ))
          )}
        </List>
      </Section>

    </Container>
  );
};

export default RecentActivity;