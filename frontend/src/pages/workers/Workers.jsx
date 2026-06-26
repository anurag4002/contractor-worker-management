import React, { useMemo, useState } from "react";

import workersData from "./Workers.data.json";

import {
  FiDownload,
  FiPlus,
} from "react-icons/fi";

import WorkerTable from "../../components/workertable/WorkerTable";
import AddWorkerModal from "../../components/workermodal/AddWorkerModal";
import EditWorkerModal from "../../components/workermodal/EditWorkerModal";
import DeleteWorkerModal from "../../components/workermodal/DeleteWorkerModal";
import WorkerProfileModal from "../../components/workertable/WorkerProfileModal";

import {
  WorkersContainer,
  Header,
  TitleSection,
  ActionSection,
  SearchBox,
  Button,
} from "./Workers.style";

const Workers = () => {

  const [workers, setWorkers] = useState(
    workersData.workers
  );

  const [search, setSearch] = useState("");

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  const [viewModal, setViewModal] =
    useState(false);

  const [addModal, setAddModal] =
    useState(false);

  const [editModal, setEditModal] =
    useState(false);

  const [deleteModal, setDeleteModal] =
    useState(false);

  const filteredWorkers = useMemo(() => {

    return workers.filter((worker) => {

      return (

        worker.name
          .toLowerCase()
          .includes(search.toLowerCase())

        ||

        worker.skill
          .toLowerCase()
          .includes(search.toLowerCase())

        ||

        worker.site
          .toLowerCase()
          .includes(search.toLowerCase())

      );

    });

  }, [workers, search]);

  const addWorker = (worker) => {

    setWorkers((prev) => [

      {
        ...worker,

        id: `CW${Date.now()}`,

      },

      ...prev,

    ]);

  };

  const updateWorker = (updatedWorker) => {

    setWorkers((prev) =>
      prev.map((worker) =>

        worker.id === updatedWorker.id

          ? updatedWorker

          : worker

      )
    );

  };

  const deleteWorker = (id) => {

    setWorkers((prev) =>
      prev.filter(
        (worker) =>
          worker.id !== id
      )
    );

  };
    return (

    <WorkersContainer>

      {/* ================= Header ================= */}

      <Header>

        <TitleSection>

          <h2>{workersData.title}</h2>

          <p>{workersData.description}</p>

        </TitleSection>

        <ActionSection>

          <SearchBox>

            <input
              type="text"
              placeholder="Search workers..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </SearchBox>

          <Button>

            <FiDownload />

            Export

          </Button>

          <Button
            onClick={() =>
              setAddModal(true)
            }
          >

            <FiPlus />

            Add Worker

          </Button>

        </ActionSection>

      </Header>

      {/* ================= Worker Table ================= */}

      <WorkerTable

        workers={filteredWorkers}

        onView={(worker) => {

          setSelectedWorker(worker);

          setViewModal(true);

        }}

        onEdit={(worker) => {

          setSelectedWorker(worker);

          setEditModal(true);

        }}

        onDelete={(worker) => {

          setSelectedWorker(worker);

          setDeleteModal(true);

        }}

      />

      {/* ================= Add Worker ================= */}

      <AddWorkerModal

        open={addModal}

        onClose={() =>
          setAddModal(false)
        }

        onAddWorker={addWorker}

      />

      {/* ================= Edit Worker ================= */}

      <EditWorkerModal

        open={editModal}

        worker={selectedWorker}

        onClose={() =>
          setEditModal(false)
        }

        onUpdateWorker={updateWorker}

      />

      {/* ================= Delete Worker ================= */}

      <DeleteWorkerModal

        open={deleteModal}

        worker={selectedWorker}

        onClose={() =>
          setDeleteModal(false)
        }

        onDeleteWorker={deleteWorker}

      />

      {/* ================= View Worker ================= */}

      <WorkerProfileModal

        open={viewModal}

        worker={selectedWorker}

        onClose={() =>
          setViewModal(false)
        }

      />

    </WorkersContainer>

  );

};

export default Workers;