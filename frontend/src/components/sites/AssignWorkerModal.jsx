import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import useWorkers from "../../hooks/useWorkers";

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
}) => {

  const {
    workers,
    assignWorkerToSite,
  } = useWorkers();

  const [search, setSearch] =
    useState("");

  const [selected, setSelected] =
    useState([]);

  useEffect(() => {

    if (!site) return;

    if (Array.isArray(site.workers)) {

      setSelected(site.workers);

    } else {

      setSelected([]);

    }

    setSearch("");

  }, [site]);

  const filteredWorkers = useMemo(() => {

    return workers.filter((worker) => {

      const keyword =
        search.toLowerCase();

      return (

        worker.name
          .toLowerCase()
          .includes(keyword)

        ||

        worker.id
          .toLowerCase()
          .includes(keyword)

        ||

        worker.mobile
          .includes(keyword)

        ||

        worker.skill
          .toLowerCase()
          .includes(keyword)

      );

    });

  }, [workers, search]);

  if (!open || !site) return null;

  const toggleWorker = (id) => {

    setSelected((prev) =>

      prev.includes(id)

        ? prev.filter(
            (item) => item !== id
          )

        : [...prev, id]

    );

  };

  const handleSave = () => {

    selected.forEach((workerId) => {

      assignWorkerToSite(
        site.id,
        workerId
      );

    });

    onClose();

  };

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Assign Workers

          </Title>

          <CloseButton
            onClick={onClose}
          >

            ×

          </CloseButton>

        </Header>

        <SearchInput

          type="text"

          placeholder="Search Worker..."

          value={search}

          onChange={(e)=>

            setSearch(e.target.value)

          }

        />

        <WorkerList>

          {

            filteredWorkers.length === 0 ? (

              <p
                style={{
                  padding: "1rem",
                  textAlign: "center",
                }}
              >

                No workers found.

              </p>

            ) : (

              filteredWorkers.map((worker) => (

                <WorkerItem
                  key={worker.id}
                >

                  <Checkbox>

                    <input

                      type="checkbox"

                      checked={
                        selected.includes(
                          worker.id
                        )
                      }

                      onChange={() =>
                        toggleWorker(
                          worker.id
                        )
                      }

                    />

                    <span>

                      <strong>

                        {worker.name}

                      </strong>

                      {" • "}

                      {worker.skill}

                      {" • "}

                      {worker.mobile}

                    </span>

                  </Checkbox>

                </WorkerItem>

              ))

            )

          }

        </WorkerList>

        <Footer>

          <CancelButton
            onClick={onClose}
          >

            Cancel

          </CancelButton>

          <SaveButton
            onClick={handleSave}
          >

            Assign Selected ({selected.length})

          </SaveButton>

        </Footer>

      </Modal>

    </Overlay>

  );

};

export default AssignWorkerModal;