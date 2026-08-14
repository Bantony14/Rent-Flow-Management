import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import AddRoomForm from "../../components/AllRoom/AddRoomForm.jsx";
import RoomCard from "../../components/AllRoom/RoomCard.jsx";
import {
  deleteRoomApi,
  getAllRoom,
  roomDetailsUpdate,
  updateRoomImageApi,
  removeRoomImageApi,
  addRoomImageApi,
} from "../../api/roomApi.js";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import toast from "react-hot-toast";
import DeletePopup from "../../components/AllRoom/DeleteCard.jsx";

function AllRoom() {
  const [rooms, setRooms] = useState([]);
  const [roomLoading, setRoomLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState([]);
  const [editDataDetails, setEditDataDetails] = useState({});
  const [editImageDetails, setEditImageDetails] = useState([]);
  const [sendDataLoading, setSendDataLoading] = useState(false);
  const [showDeleteCard, setShowDeleteCard] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [getDeleteRoom, setGetDeleteRoom] = useState(null);
  const [sendImageLoading, setSendImageLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // NEW: loading states for add/delete image
  const [addImageLoading, setAddImageLoading] = useState(false);
  const [deleteImageLoading, setDeleteImageLoading] = useState(null); // holds imageId being deleted

  const fetchRooms = async () => {
    setRoomLoading(true);
    setError("");
    try {
      const res = await getAllRoom();
      setRooms(res.data.room);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setRoomLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    setFormData(structuredClone(rooms));
  }, [rooms]);

  const handleChangeDetails = (e, id) => {
    const { name, value } = e.target;
    const finalValue = name === "Avaliablity" ? value === "true" : value;

    setFormData((prev) =>
      prev.map((room) =>
        room._id === id ? { ...room, [name]: finalValue } : room,
      ),
    );

    setEditDataDetails((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  function handleCancel() {
    setFormData(structuredClone(rooms));
  }

  async function updateRoomData(id) {
    try {
      setSendDataLoading(true);
      const res = await roomDetailsUpdate(id, editDataDetails);
      toast.success(res?.data?.message);
      setEditingId(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Room details Not changes");
    } finally {
      setSendDataLoading(false);
    }
  }

  function updateRoomImage(e, roomId, imageId) {
    const findRoom = formData.find((rooms) => rooms._id === roomId);

    const updateImage = findRoom.roomImage.map((image) =>
      image._id === imageId
        ? { ...image, secure_url: e.target.files[0] }
        : image,
    );
    setFormData((prev) =>
      prev.map((rooms) =>
        rooms._id === roomId ? { ...rooms, roomImage: updateImage } : rooms,
      ),
    );

    setEditImageDetails((prev) => {
      const exists = prev.some((img) => img.imageId === imageId);
      if (exists) {
        return prev.map((img) =>
          img.imageId === imageId ? { ...img, file: e.target.files[0] } : img,
        );
      }
      return [...prev, { imageId, file: e.target.files[0] }];
    });
  }

  async function handleUpdateImage(id) {
    try {
      setSendImageLoading(true);
      const data = new FormData();

      editImageDetails.forEach((img) => {
        data.append("roomImage", img.file);
        data.append("imageIds", img.imageId);
      });

      const res = await updateRoomImageApi(id, data);
      toast.success(res.data.message);
      setEditingId(null);
      setEditImageDetails([]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update room images",
      );
    } finally {
      setSendImageLoading(false);
    }
  }

  // Delete a single image from a room
  async function handleDeleteImage(roomId, imageId) {
    try {
      setDeleteImageLoading(imageId);
      const res = await removeRoomImageApi(roomId, imageId);
      toast.success(res?.data?.message || "Image removed");

      // Update rooms state with the returned room data
      setRooms((prev) =>
        prev.map((room) => (room._id === roomId ? res.data.room : room)),
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove image");
    } finally {
      setDeleteImageLoading(null);
    }
  }

  // Add new images to a room
  async function handleAddImage(roomId, files) {
    try {
      setAddImageLoading(true);
      const data = new FormData();

      for (let i = 0; i < files.length; i++) {
        data.append("roomImage", files[i]);
      }

      const res = await addRoomImageApi(roomId, data);
      toast.success(res?.data?.message || "Image added");

      // Update rooms state with the returned room data
      setRooms((prev) =>
        prev.map((room) => (room._id === roomId ? res.data.room : room)),
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add image");
    } finally {
      setAddImageLoading(false);
    }
  }

  async function deleteRoom() {
    try {
      setDeleteLoading(true);
      const res = await deleteRoomApi(deleteRoomId);
      toast.success(res?.data?.message);
      setRooms((prev) => prev.filter((rooms) => rooms._id !== deleteRoomId));
      setShowDeleteCard(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  function deleteRoomDetails(id) {
    setGetDeleteRoom(rooms.find((rooms) => rooms._id === id));
  }

  if (roomLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {showAddForm ? "Add New Room" : "All Rooms"}
        </h1>

        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
            transition-all duration-200 shadow-sm active:scale-95
            ${
              showAddForm
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          {showAddForm ? (
            <>
              <X size={16} />
              Close
            </>
          ) : (
            <>
              <Plus size={16} />
              Add Room
            </>
          )}
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          showAddForm ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6 pt-4">
            <AddRoomForm />
          </div>
        </div>
      </div>

      {!showAddForm && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
          {rooms.length === 0 ? (
            <h2>No Rooms Found</h2>
          ) : (
            formData.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                editingId={editingId}
                setEditingId={setEditingId}
                handleChange={handleChangeDetails}
                handleUpdate={updateRoomData}
                sendDataLoading={sendDataLoading}
                setShowDeleteCard={setShowDeleteCard}
                setDeleteRoomId={setDeleteRoomId}
                handleCancel={handleCancel}
                deleteRoomDetails={deleteRoomDetails}
                updateRoomImage={updateRoomImage}
                handleUpdateImage={handleUpdateImage}
                sendImageLoading={sendImageLoading}
                handleDeleteImage={handleDeleteImage}
                handleAddImage={handleAddImage}
                deleteImageLoading={deleteImageLoading}
                addImageLoading={addImageLoading}
              />
            ))
          )}
          <DeletePopup
            open={showDeleteCard}
            setShowDeleteCard={setShowDeleteCard}
            onDelete={deleteRoom}
            loading={deleteLoading}
            room={getDeleteRoom}
          />
        </div>
      )}
    </>
  );
}

export default AllRoom;
