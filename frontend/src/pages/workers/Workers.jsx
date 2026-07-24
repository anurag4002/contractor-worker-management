import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import {
  FiDownload,
  FiPlus,
} from "react-icons/fi";

import useWorkers from "../../hooks/useWorkers";

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

  const {
    workers = [],
    addWorker,
    updateWorker,
    deleteWorker,
    fetchWorkers,
    loading,
  } = useWorkers();

  useEffect(() => {
    fetchWorkers();
  }, []);

  const [search, setSearch] =
    useState("");

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

    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {

      return workers;

    }

    return workers.filter((worker) => {

      return (

        String(worker.id || "")
          .toLowerCase()
          .includes(keyword)

        ||

        String(worker.name || "")
          .toLowerCase()
          .includes(keyword)

        ||

        String(worker.mobile || "")
          .toLowerCase()
          .includes(keyword)

        ||

        String(worker.skill || "")
          .toLowerCase()
          .includes(keyword)

        ||

        String(worker.workType || "")
          .toLowerCase()
          .includes(keyword)

        ||

        String(worker.site || "")
          .toLowerCase()
          .includes(keyword)

      );

    });

  }, [

    workers,

    search,

  ]);

  const handleView = (worker) => {

    setSelectedWorker(worker);

    setViewModal(true);

  };

  const handleEdit = (worker) => {

    setSelectedWorker(worker);

    setEditModal(true);

  };

  const handleDelete = (worker) => {

    setSelectedWorker(worker);

    setDeleteModal(true);

  };

  return (

    <WorkersContainer>

      <Header>

        <TitleSection>

          <h2>

            Worker Management

          </h2>

          <p>

            Manage contractor workers, profiles and records.

          </p>

        </TitleSection>

        <ActionSection>

          <SearchBox>

            <input

              type="text"

              placeholder="Search by ID, Name, Mobile, Skill, Site..."

              value={search}

              onChange={(e) =>

                setSearch(e.target.value)

              }

            />

          </SearchBox>

          <Button
            type="button"
          >

            <FiDownload />

            Export

          </Button>

          <Button

            type="button"

            onClick={() =>

              setAddModal(true)

            }

          >

            <FiPlus />

            Add Worker

          </Button>

        </ActionSection>

      </Header>

      <WorkerTable

        workers={filteredWorkers}

        loading={loading}

        onView={handleView}

        onEdit={handleEdit}

        onDelete={handleDelete}

      />

      <AddWorkerModal

        open={addModal}

        onClose={() =>

          setAddModal(false)

        }

        onAddWorker={addWorker}

      />

      <EditWorkerModal

        open={editModal}

        worker={selectedWorker}

        onClose={() =>

          setEditModal(false)

        }

        onUpdateWorker={(worker) =>

          updateWorker(

            worker.id,

            worker

          )

        }

      />

      <DeleteWorkerModal

        open={deleteModal}

        worker={selectedWorker}

        onClose={() =>

          setDeleteModal(false)

        }

        onDeleteWorker={deleteWorker}

      />

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