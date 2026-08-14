import React, { useEffect, useState, useRef } from "react";
import TenantProfileHeader from "../../components/userInfo/ProfileCard";
import PersonalDetails from "../../components/userInfo/PersonalDetailCard";
import PropertyDetails from "../../components/userInfo/PropertyDetailCard";
import RentInformation from "../../components/userInfo/RentInfoCard";
import UserAccountDetailCard from "../../components/userInfo/UserAccountDetailCard";
import RentInfoCard from "../../components/userInfo/RentInfoCard";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  deleteUser,
  fetchImage,
  getRoomByBuilding,
  getUser,
  updateUser,
} from "../../api/authApi";
import ProfileCard from "../../components/userInfo/ProfileCard";
import { useNavigate } from "react-router-dom";
import DeleteCard from "../../components/allTenantsdetails/DeleteCard";
import MemberDetailCard from "../../components/userInfo/memberDetailsCard";
import ShowAadhaar from "../../components/userInfo/ShowAadhaar";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { updateRoomAvailability } from "../../api/roomApi";

function UserInfoPage() {
  const { user } = useContext(AuthContext);
  const { tenantid } = useParams();
  const [tenantDetail, setTenantDetail] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [formdata, setFormData] = useState();
  const [editdata, setEditData] = useState({});
  const [deleteTenant, setDeleteTenant] = useState("");
  const [openDocuments, setOpenDocuments] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [uploadDataloading, setUploadDataLoading] = useState(null);
  const [fetchRoomLoading, setFetchRoomLoading] = useState(null);
  const [buildingName, setBuildingName] = useState();
  const [room, setRoom] = useState([]);
  const navigate = useNavigate();
  const roomRef = useRef({});
  const params = {};
  if (formdata?.building) {
    params.building = formdata?.building;
  }
  if (formdata?.roomNumber) {
    params.roomNumber = formdata?.roomNumber;
  }

  // this api is get data from using use params there is tenant id
  useEffect(() => {
    async function get() {
      try {
        const res = await getUser(tenantid);

        setTenantDetail(res.data.user);
        roomRef.current = res.data.user;

        toast.success(res?.data?.message);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
    get();
  }, []);

  // this api for updating room availibilty
  const handleRoomUpdate = async () => {
    const { building, roomNumber } = roomRef.current;

    const roomData = {
      oldBuilding: building,
      oldRoom: roomNumber,
      id: formdata._id,
    };

    if (editdata.roomNumber) {
      roomData.newBuilding = formdata?.building;
      roomData.newRoom = editdata?.roomNumber;

      try {
        const res = await updateRoomAvailability(roomData);

        toast.success(res?.data?.message);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // rent via building and room
  useEffect(() => {
    if (!formdata?.roomNumber) return;

    (async () => {
      try {
        const res = await getRoomByBuilding(params);

        setFormData((prev) => ({
          ...prev,
          rentPrice: res?.data?.building[0]?.rent || formdata?.rentPrice,
        }));

        setEditData((prev) => ({
          ...prev,
          rentPrice: res?.data?.building[0]?.rent || formdata?.rentPrice,
        }));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch rent");
      }
    })();
  }, [formdata?.roomNumber]);

  // this api is for building Name value
  useEffect(() => {
    setBuildingName(user.properties);
  }, [user]);

  useEffect(() => {
    setFormData(structuredClone(tenantDetail));
  }, [tenantDetail]);

  async function fetchAaddharImage() {
    if (
      typeof tenantDetail?.aadhaarFront?.secure_url === "string" &&
      typeof tenantDetail?.aadhaarBack?.secure_url === "string"
    ) {
      return;
    }

    try {
      setLoadingImage(true);

      const res = await fetchImage(tenantDetail._id);

      setTenantDetail((prev) => ({
        ...prev,
        aadhaarFront: {
          ...prev.aadhaarFront,
          secure_url: res.data.aadhaarFrontUrl,
        },
        aadhaarBack: {
          ...prev.aadhaarBack,
          secure_url: res.data.aadhaarBackUrl,
        },
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoadingImage(false);
    }
  }

  function editOn() {
    setIsEdit(!isEdit);
  }

  const fetchRoom = async (building) => {
    try {
      setFetchRoomLoading(true);
      setRoom([]);

      const selectedBuilding = building || formdata?.building;

      const res = await getRoomByBuilding({
        building: selectedBuilding,
      });

      const allRoom = res?.data?.building?.flatMap((item) => item.room) ?? [];

      setRoom(allRoom);
    } finally {
      setFetchRoomLoading(false);
    }
  };
  // this api for edit mode on
  function handleChange(e) {
    const { name } = e.target;

    if (
      name === "profileImage" ||
      name === "aadhaarFront" ||
      name === "aadhaarBack"
    ) {
      setFormData((prev) => {
        return {
          ...prev,
          [name]: {
            public_id: formdata[name]?.public_id,
            secure_url: e.target.files[0],
          },
        };
      });
    } else {
      setFormData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }

    setEditData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.files ? e.target.files[0] : e.target.value,
      };
    });
  }

  // sending api for updating the value of user
  async function sendApiForUpdate(id) {
    const updatedData = new FormData();
    Object.keys(editdata).forEach((value) => {
      updatedData.set([value], editdata[value]);
    });

    try {
      setUploadDataLoading(true);
      const res = await updateUser(id, updatedData);
      toast.success(res.data.message);
      setTenantDetail(structuredClone(formdata));
      setEditData({});
      setOpenDocuments(false);
      editOn(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setUploadDataLoading(false);
    }
  }

  function cancelUpdate() {
    setFormData(structuredClone(tenantDetail));
    setEditData({});
  }

  // updating deleteTenants details
  const updateDeleteTenants = () => {
    setDeleteTenant(structuredClone(tenantDetail));
  };

  // removing deleteTenants card details

  const cancelDeleteTenants = () => setDeleteTenant("");

  // This Api is for deleting the data
  const deleteTenantApi = async (id) => {
    try {
      const res = await deleteUser(id);
      setDeleteTenant("");
      toast.success(res.data.message);

      navigate("/all-tenants");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

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

      <div className="min-h-screen bg-slate-100 p-4 md:p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* ==================== PROFILE HEADER ==================== */}

          <ProfileCard
            user={formdata}
            edit={isEdit}
            onEditToggle={editOn}
            handleChange={handleChange}
            onSave={() => sendApiForUpdate(formdata._id)}
            onCancel={cancelUpdate}
            onDelete={updateDeleteTenants}
            uploadDataloading={uploadDataloading}
            fetchRoom={fetchRoom}
            handleRoomUpdate={handleRoomUpdate}
          />

          {/* ==================== INFORMATION CARDS ==================== */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* ==================== PERSONAL DETAILS CARD ==================== */}

            <PersonalDetails
              user={formdata}
              edit={isEdit}
              onChange={handleChange}
            />

            {/* ==================== PROPERTY DETAILS CARD ==================== */}

            <PropertyDetails
              user={formdata}
              edit={isEdit}
              onChange={handleChange}
              buildingName={buildingName}
              room={room}
              fetchRoom={fetchRoom}
              setFetchRoomLoading={setFetchRoomLoading}
            />
            {/* ==================== RENT INFORMATION CARD ==================== */}
            <RentInfoCard
              user={formdata}
              edit={isEdit}
              onChange={handleChange}
            />

            {/* ==================== ACCOUNT INFORMATION CARD ==================== */}

            <UserAccountDetailCard
              user={formdata}
              edit={isEdit}
              onChange={handleChange}
            />
          </div>

          {/* ====================  Aadhaar  CARD ==================== */}
          <ShowAadhaar
            openDocuments={openDocuments}
            setOpenDocuments={setOpenDocuments}
            fetchAaddharImage={fetchAaddharImage}
            loadingImage={loadingImage}
            tenantDetail={tenantDetail}
            isEdit={isEdit}
            handleChange={handleChange}
            formdata={formdata}
          />

          {/* ==================== FAMILY MEMBERS CARD ==================== */}
          <MemberDetailCard tenantDetails={tenantDetail} />
        </div>
      </div>
    </>
  );
}

export default UserInfoPage;
