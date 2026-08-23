import { useState, useEffect, useCallback } from "react";
import { FiRefreshCw } from "react-icons/fi";

import workerService from "../../services/worker.service";
import attendanceService from "../../services/attendance.service";
import { showError } from "../../components/common/toast";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Grid,
  Item,
  Label,
  Value,
  Footer,
  Button,
  WorkerList,
  WorkerItem,
  Message,
  ErrorText,
} from "./SiteDetailsModal.style";

const toLocalDate = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const extractArray = (res) => {
  if (!res) return [];
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
};

const SiteDetailsModal = ({ open, site, onClose }) => {
  const [assignedWorkers, setAssignedWorkers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const siteId = site?._id;

  const loadSiteWorkers = useCallback(async (id) => {
    const all = [];
    let page = 1;
    const limit = 100;
    // Paginate to safely exceed the API limit cap (100).
    for (;;) {
      const body = await workerService.getWorkers({
        site: id,
        limit,
        page,
      });
      const list = extractArray(body);
      all.push(...list);
      const totalPages = body?.pagination?.totalPages || 1;
      if (page >= totalPages || list.length === 0) break;
      page += 1;
    }
    return all;
  }, []);

  const loadData = useCallback(async () => {
    if (!siteId) return;
    setLoading(true);
    setError(null);
    try {
      const workers = await loadSiteWorkers(siteId);
      setAssignedWorkers(Array.isArray(workers) ? workers : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load assigned workers."
      );
      showError(err);
    }
    try {
      const aBody = await attendanceService.getAttendance({
        site: siteId,
        attendanceDate: toLocalDate(),
        limit: 100,
      });
      setAttendance(extractArray(aBody));
    } catch (err) {
      // Attendance failure must not block worker display.
      showError(err);
    } finally {
      setLoading(false);
    }
  }, [siteId, loadSiteWorkers]);

  useEffect(() => {
    if (!open || !site) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [open, site, loadData, refreshKey]);

  const present = attendance.filter((r) => r.status === "PRESENT").length;
  const absent = attendance.filter((r) => r.status === "ABSENT").length;
  const leave = attendance.filter((r) => r.status === "LEAVE").length;

  let workerListContent;
  if (loading) {
    workerListContent = <Message>Loading workers...</Message>;
  } else if (error) {
    workerListContent = <ErrorText>{error}</ErrorText>;
  } else if (assignedWorkers.length === 0) {
    workerListContent = <Message>No Workers Assigned</Message>;
  } else {
    workerListContent = (
      <WorkerList>
        {assignedWorkers.map((w) => (
          <WorkerItem key={w._id}>
            {w.fullName || w.name || "Unknown"}
            <span>
              {w.employeeCode || ""}
              {w.trade ? ` • ${w.trade}` : ""}
            </span>
          </WorkerItem>
        ))}
      </WorkerList>
    );
  }

  if (!open || !site) return null;

  return (
    <Overlay role="dialog" aria-modal="true" aria-label="Site Details">
      <Modal>
        <Header>
          <Title>Site Details</Title>
          <CloseButton onClick={onClose} aria-label="Close dialog">
            ×
          </CloseButton>
        </Header>
        <Body>
          <Grid>
            <Item>
              <Label>Site ID</Label>
              <Value>{site._id}</Value>
            </Item>
            <Item>
              <Label>Site Name</Label>
              <Value>{site.siteName}</Value>
            </Item>
            <Item>
              <Label>Location</Label>
              <Value>
                {site.city && site.state ? `${site.city}, ${site.state}` : "-"}
              </Value>
            </Item>
            <Item>
              <Label>Supervisor</Label>
              <Value>{site.supervisor || "-"}</Value>
            </Item>
            <Item>
              <Label>Start Date</Label>
              <Value>
                {site.startDate ? site.startDate.split("T")[0] : "-"}
              </Value>
            </Item>
            <Item>
              <Label>Client Name</Label>
              <Value>{site.clientName || "-"}</Value>
            </Item>
            <Item>
              <Label>Assigned Workers</Label>
              <Value>
                {loading ? "-" : assignedWorkers.length}
              </Value>
            </Item>
            <Item>
              <Label>Present Today</Label>
              <Value>{present}</Value>
            </Item>
            <Item>
              <Label>Absent</Label>
              <Value>{absent}</Value>
            </Item>
            <Item>
              <Label>Leave</Label>
              <Value>{leave}</Value>
            </Item>
            <Item>
              <Label>Site Status</Label>
              <Value>{site.status}</Value>
            </Item>
            <Item>
              <Label>Assigned Worker List</Label>
              <Value as="div">{workerListContent}</Value>
            </Item>
          </Grid>
        </Body>
        <Footer>
          {error && (
            <Button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              style={{ marginRight: "auto", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              <FiRefreshCw /> Retry
            </Button>
          )}
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default SiteDetailsModal;
