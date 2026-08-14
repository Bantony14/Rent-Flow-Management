import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  Check,
  X,
  FileHeadphone,
} from "lucide-react";
import {
  deleteUser,
  getAllUser,
  getRoomByBuilding,
  updateUser,
} from "../../api/authApi";
import toast from "react-hot-toast";
import LoadingScreen from "../../components/LoadingScreen";
import DeleteCard from "../../components/allTenantsdetails/DeleteCard";
import { useNavigate } from "react-router-dom";
import AllTenantsHeader from "../../components/allTenantsdetails/Header";
import NumberOfUsers from "../../components/allTenantsdetails/NumberOfUser";
import { AuthContext } from "../../context/authContext";
import { updateRoomAvailability } from "../../api/roomApi";

export default function AllTenants() {
  const { user } = useContext(AuthContext);
  const [alltenantDetails, setAlltenantDetails] = useState([]);
  const [formData, setFormData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState("");
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [deleteTenant, setDeleteTenant] = useState("");
  const [building, setBuilding] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [room, setRoom] = useState([]);
  const roomRef = useRef({});
  const params = {}; // using for params which convert data in query for backend api
  const navigate = useNavigate();

  if (building) {
    params.building = building;
  }
  if (paymentStatus) {
    params.paymentStatus = paymentStatus;
  }

  //  this is for fetching all tanants data
  useEffect(() => {
    const func = async () => {
      try {
        setLoading(true);
        const res = await getAllUser(params);
        setAlltenantDetails(res.data.user);
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    func();
  }, [paymentStatus, building]);

  useEffect(() => {
    setFormData(structuredClone(alltenantDetails));
  }, [alltenantDetails]);

  // this update data real time in formdata

  const handleChange = (e, id) => {
    setFormData((prev) => {
      return prev.map((value) =>
        value._id === id
          ? { ...value, [e.target.name]: e.target.value }
          : value,
      );
    });

    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // finding available room to show on page
  const fetchRoom = async (building, id) => {
    try {
      setLoading2(true);
      setRoom([]);

      if (id) {
        const { building } = formData.find(
          (buildingName) => buildingName._id === id,
        );
        const res = await getRoomByBuilding({ building });

        const allRoom = res?.data?.building?.flatMap((item) => item.room) ?? [];

        setRoom(allRoom);
        setLoading2(false);
        return;
      }

      const res = await getRoomByBuilding({ building });

      const allRoom = res?.data?.building?.flatMap((item) => item.room) ?? [];

      setRoom(allRoom);
    } catch (error) {
    } finally {
      setLoading2(false);
    }
  };

  //  if dont want to update then cancel after real time data updated
  const handleCancel = () => {
    setFormData(structuredClone(alltenantDetails));
    setEditData({});
  };

  // This Api is for updating the data in database
  const sendApi = async (id) => {
    try {
      const res = await updateUser(id, editData);
      setAlltenantDetails(structuredClone(formData));
      setEditData({});
      setEditId("");
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // this updte the room availbilty in true or false and update tenantId in room
  const handleRoomUpdate = async (id) => {
    if (id) {
      roomRef.current = formData.find((value) => value._id === id);
    }
    const { building, roomNumber } = roomRef.current;

    const roomData = {
      oldBuilding: building,
      oldRoom: roomNumber,
      id: id,
    };

    if (editData.building && editData.roomNumber) {
      roomData.newBuilding = editData.building;
      roomData.newRoom = editData.roomNumber;

      try {
        const res = await updateRoomAvailability(roomData);
        toast.success(res.data.message);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // updating deleteTenants details
  const updateDeleteTenants = (id) => {
    const tenant = formData.filter((value) => value._id === id);
    setDeleteTenant(structuredClone(...tenant));
  };

  // removing deleteTenants card details

  const cancelDeleteTenants = () => setDeleteTenant("");

  // This Api is for deleting the data
  const deleteTenantApi = async (id) => {
    try {
      const res = await deleteUser(id);
      const updated = formData.filter((value) => value._id !== id);
      setFormData(updated);
      setAlltenantDetails(updated);
      setDeleteTenant("");
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  //  this filter is using for search by direct just type this filtered is using for showing user
  const filtered = formData.filter((u) =>
    [u.fullName, u.email, u.mobileNumber, u.building, u.roomNumber]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const totalUsers = formData.length;
  const admins = formData.filter((u) => u.role === "ADMIN").length;
  const tenants = formData.filter((u) => u.role === "USER").length;

  return (
    <>
      {deleteTenant ? (
        <DeleteCard
          data={deleteTenant}
          onCancel={cancelDeleteTenants}
          onDelete={() => deleteTenantApi(deleteTenant._id)}
        />
      ) : (
        ""
      )}

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <AllTenantsHeader />

        {/* total number of user */}
        <NumberOfUsers
          totalUsers={totalUsers}
          tenants={tenants}
          admins={admins}
        />

        {/*searchQuery*/}
        <div className="flex flex-col lg:flex-row gap-4 items-end mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-700 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Building Filter */}
          <div className="w-full lg:w-60">
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Building
            </label>

            <select
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">All Buildings</option>
              {user?.properties?.map((building) => {
                return <option value={building}> {building}</option>;
              })}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="w-full lg:w-60">
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Payment Status
            </label>

            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            >
              <option value="">All Status</option>
              <option value="Paid">🟢 Paid</option>
              <option value="Unpaid">🔴 Unpaid</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Tenant Name
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Email</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Mobile Number
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Building
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Room No.
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-center whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {/* loading screen if no data found */}
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <LoadingScreen />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500 text-base"
                  >
                    User not found
                  </td>
                </tr>
              ) : (
                filtered.map((value) => {
                  return value._id === editId ? (
                    <tr
                      key={value._id}
                      className="border-b border-slate-100 bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="text"
                          name="fullName"
                          value={value.fullName}
                          className="w-full min-w-[120px] rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          onChange={(e) => handleChange(e, value._id)}
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="email"
                          name="email"
                          value={value.email}
                          className="w-full min-w-[160px] rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          onChange={(e) => handleChange(e, value._id)}
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="text"
                          name="mobileNumber"
                          value={value.mobileNumber}
                          className="w-full min-w-[120px] rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          onChange={(e) => handleChange(e, value._id)}
                        />
                      </td>

                      <td className="px-4 py-4">
                        {/* building changing by select */}
                        <select
                          value={value.building}
                          name="building"
                          className="w-full min-w-[130px] rounded-lg border border-slate-300 px-3 py-2"
                          onChange={(e) => {
                            handleChange(e, value._id);
                            fetchRoom(e.target.value);
                          }}
                        >
                          {user.properties.map((building) => (
                            <option key={building} value={building}>
                              {building}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        {/* roomNumber changing by select */}
                        <select
                          name="roomNumber"
                          value={value.roomNumber}
                          className="w-full min-w-[80px] rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          onChange={(e) => {
                            handleChange(e, value._id);
                          }}
                        >
                          {loading2 ? (
                            <option value="loading..." disabled>
                              Loading...
                            </option>
                          ) : room.length > 0 ? (
                            room.map((room) => (
                              <option key={room} value={room}>
                                {room}
                              </option>
                            ))
                          ) : (
                            <>
                              <option value={value.roomNumber} disabled>
                                {value.roomNumber}
                              </option>
                              <option value="" disabled>
                                No Room Available
                              </option>
                            </>
                          )}
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={value.paymentStatus}
                          className="w-full min-w-[90px] rounded-lg border border-slate-300 px-3 py-2"
                          name="paymentStatus"
                          onChange={(e) => handleChange(e, value._id)}
                        >
                          <option>{value.paymentStatus}</option>

                          <option>
                            {value.paymentStatus === "Paid" ? "Unpaid" : "Paid"}
                          </option>
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            className="rounded-lg bg-green-600 px-3 py-2 text-xs sm:text-sm text-white hover:bg-green-700 whitespace-nowrap"
                            onClick={() => {
                              sendApi(value._id);
                              handleRoomUpdate();
                            }}
                          >
                            Save
                          </button>

                          <button
                            onClick={() => {
                              (setEditId(null), handleCancel());
                            }}
                            className="rounded-lg bg-slate-500 px-3 py-2 text-xs sm:text-sm text-white hover:bg-slate-600 whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={value._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-4 font-medium text-slate-800 whitespace-nowrap">
                        {value.fullName}
                      </td>

                      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                        {value.email}
                      </td>

                      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                        {value.mobileNumber}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 whitespace-nowrap">
                          {value.building}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-700 whitespace-nowrap">
                        {value.roomNumber}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                            value.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {value.paymentStatus}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="rounded-lg bg-sky-100 p-2 text-sky-600 hover:bg-sky-200"
                            onClick={() =>
                              navigate(`/view-tenant-detail/${value._id}`)
                            }
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() => {
                              setEditId(value._id);
                              fetchRoom("", value._id);
                              handleRoomUpdate(value._id);
                            }}
                            className="rounded-lg bg-amber-100 p-2 text-amber-600 hover:bg-amber-200"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                            onClick={() => updateDeleteTenants(value._id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
