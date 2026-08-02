import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import {
  FiDownload,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import useWorkers from "../../hooks/useWorkers";

import WorkerTable from "../../components/workertable/WorkerTable";
import AddWorkerModal from "../../components/workermodal/AddWorkerModal";
import DeleteWorkerModal from "../../components/workermodal/DeleteWorkerModal";

import {
  WorkersContainer,
  Header,
  TitleSection,
  ActionSection,
  SearchBox,
  Button,
} from "./Workers.style";

const Workers = () => {
  const navigate = useNavigate();

  const {
    workers = [],
    addWorker,
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

  const [addModal, setAddModal] =
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

        String(worker._id || "")
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
    navigate(`/workers/${worker._id}`);
  };

  const handleEdit = (worker) => {
    navigate(`/workers/${worker._id}/edit`);
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

      <DeleteWorkerModal

        open={deleteModal}

        worker={selectedWorker}

        onClose={() =>

          setDeleteModal(false)

        }

        onDeleteWorker={deleteWorker}

      />

    </WorkersContainer>

  );

};

export default Workers;