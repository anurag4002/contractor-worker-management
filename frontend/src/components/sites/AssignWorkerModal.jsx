import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import workerService from "../../services/worker.service";
import siteService from "../../services/site.service";
import { showSuccess, showError } from "../../components/common/toast";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  SearchInput,
  WorkerList,
  WorkerItem,
  Checkbox,
  Footer,
  CancelButton,
  SaveButton,
} from "./AssignWorkerModal.style";

const AssignWorkerModal = ({
  open,
  site,
  onClose,
  onAssigned,
}) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!open || !site) return;

    setSelected([]);
    setSearch("");
    setError(null);
    setWorkers([]);

    const fetchAvailableWorkers = async () => {
      try {
        setLoading(true);
        const data = await workerService.getWorkers({
          available: "true",
          status: "ACTIVE",
          limit: 100,
        });
        const list = data?.data?.workers || data?.workers || data?.data || data || [];
        setWorkers(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err);
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableWorkers();
  }, [open, site]);

  const filteredWorkers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return workers;

    return workers.filter((worker) => {
      const name = (worker.fullName || worker.name || "").toLowerCase();
      const code = (worker.employeeCode || worker._id || "").toLowerCase();
      const mobile = (worker.mobileNumber || worker.mobile || "").toLowerCase();
      const trade = (worker.trade || worker.skill || "").toLowerCase();

      return (
        name.includes(keyword) ||
        code.includes(keyword) ||
        mobile.includes(keyword) ||
        trade.includes(keyword)
      );
    });
  }, [workers, search]);

  const toggleWorker = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!site || selected.length === 0) return;

    try {
      setAssigning(true);
      await siteService.assignWorkers(site._id, selected);
      showSuccess(`${selected.length} worker(s) assigned successfully.`);
      onAssigned && onAssigned();
      onClose();
    } catch (error) {
      showError(error);
    } finally {
      setAssigning(false);
    }
  };

  if (!open || !site) return null;

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>Assign Workers</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <SearchInput
          type="text"
          placeholder="Search by name, ID, phone, or trade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <WorkerList>
          {loading ? (
            <p style={{ padding: "1rem", textAlign: "center", color: "var(--text-secondary)" }}>
              Loading available workers...
            </p>
          ) : error ? (
            <p
              style={{
                padding: "1rem",
                textAlign: "center",
                color: "var(--danger)",
              }}
            >
              Unable to load available workers. Please try again.
            </p>
          ) : filteredWorkers.length === 0 ? (
            <p
              style={{
                padding: "1rem",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              No available workers found.
            </p>
          ) : (
            filteredWorkers.map((worker) => {
              const workerId = worker._id;
              const isSelected = selected.includes(workerId);

              return (
                <WorkerItem
                  key={workerId}
                  selected={isSelected}
                >
                  <Checkbox>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleWorker(workerId)}
                    />
                    <span>
                      <strong>{worker.fullName || worker.name}</strong>
                      {" • "}
                      {worker.employeeCode}
                      {" • "}
                      {worker.trade || worker.skill}
                      {" • "}
                      {worker.mobileNumber || worker.mobile}
                      {" • "}
                      <span style={{
                        color: worker.status === "ACTIVE" ? "#16A34A" : "#64748B"
                      }}>
                        {worker.status}
                      </span>
                    </span>
                  </Checkbox>
                </WorkerItem>
              );
            })
          )}
        </WorkerList>

        <Footer>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton
            onClick={handleSave}
            disabled={selected.length === 0 || assigning}
          >
            {assigning
              ? "Assigning..."
              : `Assign Selected (${selected.length})`}
          </SaveButton>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default AssignWorkerModal;
