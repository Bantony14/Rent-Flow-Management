import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { nanoid } from "nanoid";
import { addRoom } from "../../api/roomApi";
import toast from "react-hot-toast";
import { LoaderCircle, Trash, ImagePlus } from "lucide-react";

function AddRoomForm() {
  const { user } = useContext(AuthContext);
  const [roomImage, setRoomImage] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [buildingName, setBuildingName] = useState("");
  const [loading, setLoading] = useState(null);
  const [roomdetails, setRoomDetails] = useState({
    rent: "",
    room: "",
    buildingName: "",
    address: "",
    ownerName: "",
  });

  function addImage() {
    setRoomImage((prev) => [...prev, { id: nanoid(), roomImage: "" }]);
  }

  function handleImageChange(e, id) {
    setRoomImage((prev) =>
      prev.map((value) =>
        value.id === id ? { ...value, roomImage: e.target.files[0] } : value,
      ),
    );
  }

  function removeSelectedImage(id) {
    setRoomImage((prev) => prev.filter((value) => value.id !== id));
  }

  function handleChange(e) {
    setRoomDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  //   ============== call api to save room in database ==============
  async function addRoomApi(e) {
    e.preventDefault();
    if (roomImage.every((image) => !image?.roomImage)) {
      toast.error("please select one image Atleast ");
      return;
    }
    if (Object.keys(roomdetails).some((key) => !roomdetails[key])) {
      toast.error("please fill all field");
      return;
    }
    // creating a data using formdata
    const data = new FormData();
    // if there is no image that will not work
    if (roomImage) {
      roomImage.forEach((value) => {
        data.append("roomImage", value.roomImage);
      });
    }
    // this will add key value to formdata
    Object.keys(roomdetails).forEach((key) => {
      data.set([key], roomdetails[key]);
    });
    data.set("id", user._id);

    try {
      setLoading(true);
      const res = await addRoom(data);
      console.log("res>>>>", res);
      toast.success(res?.data?.message);
    } catch (error) {
      console.log("error>>>>", error.message);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <form className="max-w-3xl mx-auto bg-white shadow-lg shadow-slate-200/60 rounded-2xl border border-slate-100 p-8 sm:p-10 space-y-8">
        {/* Header */}
        <div className="space-y-1 border-b border-slate-100 pb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Add New Room
          </h2>
          <p className="text-sm text-slate-500">
            Fill in the room details and upload photos to list a new room.
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Room Images
          </label>
          <div className="flex flex-wrap gap-4">
            {roomImage.map((v) => (
              <label
                key={v.id}
                htmlFor={v.id}
                className="w-36 h-36 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer overflow-hidden hover:border-blue-500 hover:bg-blue-50/40 transition-colors duration-200 flex items-center justify-center bg-slate-50 relative group"
              >
                {v.roomImage ? (
                  <>
                    <img
                      src={URL.createObjectURL(v.roomImage)}
                      alt="room"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full shadow-sm transition-colors duration-200 opacity-0 group-hover:opacity-100"
                      onClick={() => removeSelectedImage(v.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </>
                ) : (
                  <span className="flex flex-col items-center gap-1.5 text-slate-400 group-hover:text-blue-500 transition-colors duration-200">
                    <ImagePlus size={26} strokeWidth={1.5} />
                    <span className="text-xs font-medium">Add Photo</span>
                  </span>
                )}

                <input
                  id={v.id}
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, v.id)}
                />
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            + Add another image
          </button>
        </div>

        {/* =============== from here input box ================ */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Room Number
            </label>
            <input
              type="text"
              placeholder="e.g. 204"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors duration-200"
              name="room"
              value={roomdetails.room}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Rent
            </label>
            <input
              type="text"
              placeholder="e.g. 12000"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors duration-200"
              name="rent"
              value={roomdetails.rent}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Building
            </label>

            <select
              name="buildingName"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 mb-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors duration-200"
              value={roomdetails.buildingName}
              onChange={(e) => handleChange(e)}
            >
              <option>Select Building</option>

              {user?.properties?.map((building) => (
                <option key={building} value={building}>
                  {building}
                </option>
              ))}
            </select>

            {showInput && (
              <input
                type="text"
                placeholder="Enter building name"
                value={buildingName}
                onChange={(e) => {
                  setBuildingName(e.target.value);
                  setRoomDetails((prev) => ({
                    ...prev,
                    buildingName: e.target.value,
                  }));
                }}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 mb-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors duration-200"
              />
            )}

            <button
              type="button"
              onClick={() => setShowInput((prev) => !prev)}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              {showInput ? "Cancel" : "+ Add Building"}
            </button>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Owner Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Patel"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors duration-200"
              name="ownerName"
              value={roomdetails.ownerName}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Address
            </label>

            <textarea
              name="address"
              rows={4}
              placeholder="Enter full address..."
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 resize-none text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors duration-200"
              value={roomdetails.address}
              onChange={(e) => handleChange(e)}
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          onClick={addRoomApi}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
            loading
              ? "bg-blue-300 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-blue-200"
          }`}
        >
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Adding Room...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}

export default AddRoomForm;
