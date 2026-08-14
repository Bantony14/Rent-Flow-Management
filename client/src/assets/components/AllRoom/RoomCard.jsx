import { useState } from "react";
import { Pencil, LoaderCircle, Save, Trash2, X, ImagePlus } from "lucide-react";

const RoomCard = ({
  room,
  editingId,
  setEditingId,
  handleChange,
  handleUpdate,
  sendDataLoading,
  setShowDeleteCard,
  setDeleteRoomId,
  handleCancel,
  deleteRoomDetails,
  updateRoomImage,
  handleUpdateImage,
  sendImageLoading,
  handleDeleteImage,
  handleAddImage,
  deleteImageLoading,
  addImageLoading,
}) => {
  const isEditing = editingId === room._id;

  return (
    <>
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
        {/* Top action bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
            {isEditing ? "Editing" : "Room Details"}
          </span>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() =>
                  setEditingId(editingId === room._id ? null : room._id)
                }
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm rounded-xl font-medium transition-all duration-150 shadow-sm"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
            {isEditing && (
              <button
                onClick={() => {
                  handleCancel();
                  setEditingId(editingId === room._id ? null : room._id);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-sm rounded-xl font-medium transition-all duration-150"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
            <button
              onClick={() => {
                deleteRoomDetails(room._id);
                setDeleteRoomId(room._id);
                setShowDeleteCard((prev) => !prev);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 text-sm rounded-xl font-medium transition-all duration-150"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="p-6 space-y-6">
            {/* ✅ Image grid with DELETE button on each image */}
            <div className="grid grid-cols-2 gap-3">
              {room.roomImage.map((image) => (
                <div key={image._id} className="relative group">
                  {/* Image change label (click to replace) */}
                  <label
                    htmlFor={image._id}
                    className="block cursor-pointer overflow-hidden rounded-2xl border border-gray-200"
                  >
                    <img
                      src={
                        typeof image.secure_url === "string"
                          ? image.secure_url
                          : URL.createObjectURL(image.secure_url)
                      }
                      alt=""
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-200 rounded-2xl">
                      <Pencil className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>

                    <input
                      id={image._id}
                      type="file"
                      className="hidden"
                      onChange={(e) => updateRoomImage(e, room._id, image._id)}
                    />
                  </label>

                  {/* ✅ DELETE image button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(room._id, image._id)}
                    disabled={deleteImageLoading === image._id}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-all duration-150 active:scale-90 z-10"
                    title="Remove image"
                  >
                    {deleteImageLoading === image._id ? (
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}

              {/* ✅ ADD image button */}
              <label
                htmlFor={`add-image-${room._id}`}
                className={`flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 ${
                  addImageLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {addImageLoading ? (
                  <LoaderCircle className="w-6 h-6 text-blue-500 animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400 font-medium">
                      Add Image
                    </span>
                  </>
                )}
                <input
                  id={`add-image-${room._id}`}
                  type="file"
                  multiple
                  className="hidden"
                  disabled={addImageLoading}
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      handleAddImage(room._id, e.target.files);
                    }
                  }}
                />
              </label>
            </div>

            {/* Form fields (unchanged) */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">
                  Room
                </label>
                <input
                  type="text"
                  value={room.room}
                  name="room"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-150"
                  onChange={(e) => handleChange(e, room._id)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">
                  Rent
                </label>
                <input
                  type="text"
                  value={room.rent}
                  name="rent"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-150"
                  onChange={(e) => handleChange(e, room._id)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">
                  Building Name
                </label>
                <input
                  type="text"
                  value={room.buildingName}
                  name="buildingName"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-150"
                  onChange={(e) => handleChange(e, room._id)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">
                  Address
                </label>
                <textarea
                  value={room.address}
                  name="address"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-150"
                  onChange={(e) => handleChange(e, room._id)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">
                  Availability
                </label>
                <select
                  value={room.Avaliablity}
                  name="Avaliablity"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-150"
                  onChange={(e) => handleChange(e, room._id)}
                >
                  <option value="">Select Avaliability</option>
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                handleUpdate(room._id);
                handleUpdateImage(room._id);
              }}
              disabled={sendDataLoading || sendImageLoading}
              className={`w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-sm
    ${
      sendDataLoading || sendImageLoading
        ? "bg-green-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700 active:scale-95"
    }`}
            >
              {sendDataLoading || sendImageLoading ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {room.roomImage.map((image) => (
                <img
                  key={image._id}
                  src={
                    typeof image.secure_url === "string"
                      ? image.secure_url
                      : URL.createObjectURL(image.secure_url)
                  }
                  alt=""
                  className="w-full h-32 object-cover rounded-2xl border border-gray-100"
                />
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">Room</span>
                <span className="text-sm font-semibold text-gray-800">
                  {room.room}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">
                  Building
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {room.buildingName}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">
                  Address
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {room.address}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium text-gray-400">
                  Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    room.Avaliablity
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.Avaliablity ? "Available" : "Occupied"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-400">Rent</span>
                <span className="text-lg text-blue-600 font-bold">
                  ₹{room.rent}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RoomCard;
