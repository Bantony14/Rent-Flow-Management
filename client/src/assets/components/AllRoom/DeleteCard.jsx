import { Trash2 } from "lucide-react";

const DeletePopup = ({
  open,
  setShowDeleteCard,
  onDelete,
  title = "Delete Room?",
  message = "This action cannot be undone.",
  loading = false,
  room,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[320px] rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="h-7 w-7 text-red-600" />
        </div>

        <h2 className="mt-4 text-center text-xl font-bold">Delete Room?</h2>

        <div className="mt-3 rounded-xl bg-gray-100 p-3 text-sm">
          <p>
            <span className="font-semibold">Room:</span> {room?.room}
          </p>
          <p>
            <span className="font-semibold">Building:</span>{" "}
            {room?.buildingName}
          </p>
          <p>
            <span className="font-semibold">Rent:</span> ₹{room?.rent}
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          This room will be permanently deleted and this action cannot be
          undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowDeleteCard((prev) => !prev)}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-300 py-2.5 font-medium hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 py-2.5 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
