import { useState, useEffect, useCallback, useMemo } from "react";
import { FiArrowLeft, FiSave, FiRefreshCw, FiUsers } from "react-icons/fi";

import workerService from "../../services/worker.service";
import attendanceService from "../../services/attendance.service";
import { showSuccess, showError } from "../../components/common/toast";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Summary,
  SummaryCard,
  Controls,
  Field,
  Input,
  SearchInput,
  WorkerList,
  WorkerCard,
  WorkerIdentity,
  MetaCell,
  StatusGroup,
  StatusPill,
  Footer,
  Button,
  EmptyState,
  Message,
} from "./SiteAttendanceModal.style";

const STATUS_OPTIONS = [
  { value: "PRESENT", label: "Present", color: "#16A34A" },
  { value: "ABSENT", label: "Absent", color: "#DC2626" },
  { value: "HALF_DAY", label: "Half Day", color: "#D97706" },
  { value: "LEAVE", label: "Leave", color: "#2563EB" },
  { value: "HOLIDAY", label: "Holiday", color: "#7C3AED" },
];

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

const SiteAttendanceModal = ({ open, site, onClose, onSaved }) => {
  const [workers, setWorkers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [date, setDate] = useState(() => toLocalDate());
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
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
        status: "ACTIVE",
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
      const [siteWorkers, attBody] = await Promise.all([
        loadSiteWorkers(siteId),
        attendanceService.getAttendance({
          site: siteId,
          attendanceDate: date,
          limit: 100,
        }),
      ]);

      const w = Array.isArray(siteWorkers) ? siteWorkers : [];
      const records = extractArray(attBody);

      setWorkers(w);
      setAttendance(records);

      const byWorker = {};
      records.forEach((r) => {
        const wid = r.worker?._id || r.worker;
        if (wid) byWorker[wid] = r;
      });

      const map = {};
      w.forEach((wk) => {
        const wid = wk._id;
        map[wid] = byWorker[wid]?.status || "PRESENT";
      });
      setStatusMap(map);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load attendance."
      );
      showError(err);
    } finally {
      setLoading(false);
    }
  }, [siteId, date, loadSiteWorkers]);

  useEffect(() => {
    if (!open || !site) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [open, site, loadData, refreshKey]);

  const selectStatus = (wid, status) => {
    setStatusMap((prev) => ({ ...prev, [wid]: status }));
  };

  const handleSave = async () => {
    if (!siteId || workers.length === 0) return;
    setSaving(true);
    try {
      const byWorker = {};
      attendance.forEach((r) => {
        const wid = r.worker?._id || r.worker;
        if (wid) byWorker[wid] = r;
      });

      const calls = workers.map((wk) => {
        const wid = wk._id;
        const status = statusMap[wid] || "PRESENT";
        const existing = byWorker[wid];
        if (existing && existing._id) {
          return attendanceService.updateAttendance(existing._id, {
            status,
          });
        }
        return attendanceService.markAttendance({
          worker: wid,
          site: siteId,
          attendanceDate: date,
          status,
        });
      });

      await Promise.all(calls);
      showSuccess("Attendance saved successfully.");
      setRefreshKey((k) => k + 1);
      if (onSaved) onSaved();
    } catch (err) {
      showError(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredWorkers = useMemo(() => {
    const kw = search.toLowerCase().trim();
    if (!kw) return workers;
    return workers.filter((w) => {
      return (
        (w.fullName || "").toLowerCase().includes(kw) ||
        (w.employeeCode || "").toLowerCase().includes(kw) ||
        (w.trade || "").toLowerCase().includes(kw)
      );
    });
  }, [workers, search]);

  const summary = useMemo(() => {
    const acc = {};
    workers.forEach((w) => {
      const s = statusMap[w._id] || "PRESENT";
      acc[s] = (acc[s] || 0) + 1;
    });
    return acc;
  }, [workers, statusMap]);

  if (!open || !site) return null;

  return (
    <Overlay role="dialog" aria-modal="true" aria-label="Site Attendance">
      <Modal>
        <Header>
          <Title>{site.siteName || site.name || "Site"} Attendance</Title>
          <CloseButton onClick={onClose} aria-label="Close dialog">
            ×
          </CloseButton>
        </Header>

        {loading ? (
          <Message>Loading attendance...</Message>
        ) : error ? (
          <EmptyState>
            <p>Unable to load attendance.</p>
            <Button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              disabled={loading}
            >
              <FiRefreshCw /> Retry
            </Button>
          </EmptyState>
        ) : (
          <>
            <Summary>
              {STATUS_OPTIONS.map((opt) => (
                <SummaryCard key={opt.value}>
                  <h4>{opt.label}</h4>
                  <span>{summary[opt.value] || 0}</span>
                </SummaryCard>
              ))}
            </Summary>

            <Controls>
              <Field>
                <label htmlFor="sa-date">Date</label>
                <Input
                  id="sa-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Field>
              <Field>
                <label htmlFor="sa-search">Search Worker</label>
                <SearchInput
                  id="sa-search"
                  type="text"
                  placeholder="Search by name, ID, or trade..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Field>
            </Controls>

            {workers.length === 0 ? (
              <EmptyState>
                <p>No workers are assigned to this site.</p>
                <Button type="button" onClick={onClose}>
                  <FiUsers /> Close
                </Button>
              </EmptyState>
            ) : filteredWorkers.length === 0 ? (
              <EmptyState>
                <p>No workers match your search.</p>
              </EmptyState>
            ) : (
              <WorkerList>
                {filteredWorkers.map((wk) => {
                  const wid = wk._id;
                  const current = statusMap[wid] || "PRESENT";
                  return (
                    <WorkerCard key={wid}>
                      <WorkerIdentity>
                        <strong>{wk.fullName || "-"}</strong>
                        <span>{wk.employeeCode || ""}</span>
                      </WorkerIdentity>
                      <MetaCell data-label="Worker ID">
                        {wk.employeeCode || "-"}
                      </MetaCell>
                      <MetaCell data-label="Work Type">
                        {wk.trade || "-"}
                      </MetaCell>
                      <StatusGroup>
                        {STATUS_OPTIONS.map((opt) => (
                          <StatusPill
                            key={opt.value}
                            type="button"
                            $selected={current === opt.value}
                            $color={opt.color}
                            onClick={() => selectStatus(wid, opt.value)}
                            aria-pressed={current === opt.value}
                          >
                            {opt.label}
                          </StatusPill>
                        ))}
                      </StatusGroup>
                    </WorkerCard>
                  );
                })}
              </WorkerList>
            )}

            <Footer>
              <Button type="button" onClick={onClose} disabled={saving}>
                <FiArrowLeft /> Cancel
              </Button>
              {workers.length > 0 && (
                <Button
                  type="button"
                  $primary
                  onClick={handleSave}
                  disabled={saving}
                >
                  <FiSave />
                  {saving ? "Saving..." : "Save Attendance"}
                </Button>
              )}
            </Footer>
          </>
        )}
      </Modal>
    </Overlay>
  );
};

export default SiteAttendanceModal;
