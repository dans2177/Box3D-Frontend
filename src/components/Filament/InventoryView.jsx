import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFilaments } from "../../slices/filamentSlice.jsx";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import Loading from "../../components/Others/Loading.jsx";
import FilamentForm from "../../components/Filament/FilamentForm.jsx";
import Modal from "react-modal";

const InventoryView = () => {
  const dispatch = useDispatch();
  const filaments = useSelector((state) => state.filament.items);
  const { getToken } = useKindeAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchTokenAndDispatch = async () => {
      const token = await getToken();
      dispatch(fetchFilaments(token));
    };

    fetchTokenAndDispatch();
  }, [dispatch, getToken]);

  if (filaments.status === "loading") {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Filament Inventory</h2>
      <div className="space-y-2">
        {filaments.data && Array.isArray(filaments.data) ? (
          filaments.data.map((filament) => (
            <div key={filament._id} className="border p-2">
              <h3 className="font-semibold">{filament.name}</h3>
            </div>
          ))
        ) : (
          <p>No filaments data available.</p>
        )}
      </div>

      <button
        onClick={() => setModalIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Filament Form
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal" // Add your modal styles here
        overlayClassName="modal-overlay" // Add your overlay styles here
      >
        <FilamentForm
          initialData={null}
          onSubmit={() => setModalIsOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default InventoryView;
