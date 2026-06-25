import DashboardLayout from "../../layouts/dashboardlayout/DashboardLayout";

import data from "./Dashboard.data.json";

import {
  DashboardWrapper,
  HeroSection,
  Title,
  Subtitle,
  StatsGrid,
  StatCard,
  CardIcon,
  CardTitle,
  CardValue,
  BottomGrid,
  AttendanceCard,
  ChartPlaceholder,
  ActivityCard,
  ActivityItem,
} from "./Dashboard.style";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <DashboardWrapper>
        <HeroSection>
          <Title>
            {data.title}
          </Title>

          <Subtitle>
            {data.subtitle}
          </Subtitle>
        </HeroSection>

        <StatsGrid>
          {data.stats.map((item, index) => (
            <StatCard key={index}>
              <CardIcon>
                {item.icon}
              </CardIcon>

              <CardTitle>
                {item.title}
              </CardTitle>

              <CardValue>
                {item.value}
              </CardValue>
            </StatCard>
          ))}
        </StatsGrid>

        <BottomGrid>
          <AttendanceCard>
            <h3>
              Attendance Overview
            </h3>

            <ChartPlaceholder />
          </AttendanceCard>

          <ActivityCard>
            <h3>
              Recent Activities
            </h3>

            {data.activities.map(
              (activity, index) => (
                <ActivityItem
                  key={index}
                >
                  {activity}
                </ActivityItem>
              )
            )}
          </ActivityCard>
        </BottomGrid>
      </DashboardWrapper>
    </DashboardLayout>
  );
};

export default Dashboard;