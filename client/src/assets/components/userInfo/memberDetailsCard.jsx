import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import MemberForm from "./memberForm";
import toast from "react-hot-toast";
import {
  addMember,
  removeMember,
  updateMember,
  getAadhaarImage,
} from "../../api/authApi";
import { X, Trash2, Pencil, Camera } from "lucide-react";

function MemberDetailCard({ tenantDetails }) {
  const [user, setUser] = useState(tenantDetails);
  const [showDocuments, setShowDocuments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [sendDataLoading, setSendDataLoading] = useState(null);
  const [showform, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(null);
  const [editData, setEditData] = useState({});
  const [member, setMember] = useState({
    name: "",
    dob: "",
    aadhaarNumber: "",
    profileImage: null,
    aadhaarFront: null,
    aadhaarBack: null,
  });

  async function getAadhaar(memberId) {
    const member = user.member.find((m) => m._id === memberId);

    if (member?.aadhaarFront.secure_url && member?.aadhaarBack.secure_url)
      return;
    setLoading(true);

    try {
      const res = await getAadhaarImage(memberId, user._id);

      const updatedMembers = user.member.map((member) => {
        if (member._id !== memberId) return member;

        return {
          ...member,
          aadhaarFront: {
            private_url: member.aadhaarFront.public_id,
            secure_url: res.data.aadhaarFrontUrl,
          },
          aadhaarBack: {
            private_url: member.aadhaarBack.public_id,
            secure_url: res.data.aadhaarBackUrl,
          },
        };
      });

      setUser({
        ...user,
        member: updatedMembers,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tenantDetails) {
      setUser({ ...tenantDetails });
    }
  }, [tenantDetails]);

  // this is for form submit which is create new member
  function handleChange(e) {
    setMember((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function createMember(e) {
    e.preventDefault();
    const check = Object.values(member).every((value) => Boolean(value));
    if (!check) return;

    const memberDetail = new FormData();
    Object.keys(member).forEach((key) => {
      memberDetail.set(key, member[key]);
    });

    try {
      setSendDataLoading(true);
      const res = await addMember(user._id, memberDetail);
      setShowForm(false);
      await toast.success(res?.data?.message);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setSendDataLoading(false);
    }
  }

  //  this for edit mode on whne user edit data that will work
  function memberHandleChange(e, id) {
    const { name, files, value } = e.target;

    const updated = user.member.map((member) => {
      if (member._id !== id) return member;

      if (
        name === "profileImage" ||
        name === "aadhaarFront" ||
        name === "aadhaarBack"
      ) {
        return {
          ...member,
          [name]: {
            secure_url: URL.createObjectURL(files[0]),
          },
        };
      }

      return {
        ...member,
        [name]: value,
      };
    });

    setUser({
      ...user,
      member: updated,
    });

    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.files ? e.target.files[0] : e.target.value,
    }));
  }

  async function updateMemberDetails(memberId) {
    setUpdateLoading(true);
    const memberDetail = new FormData();
    Object.keys(editData).forEach((key) => {
      memberDetail.set(key, editData[key]);
    });

    try {
      const res = await updateMember(user._id, memberId, memberDetail);
      toast.success(res.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setUpdateLoading(false);
    }
  }

  async function deleteMember(memberId) {
    try {
      const res = await removeMember(user._id, memberId);
      await toast.success(res.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <>
      {showform && (
        <MemberForm
          member={member}
          setMember={setMember}
          handleChange={handleChange}
          loading={sendDataLoading}
          onSubmit={createMember}
          onClose={() => setShowForm(false)}
        />
      )}
      {/* Header */}
      {!showform && (
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">Family Members</h1>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + Add Member
          </button>
        </div>
      )}

      {/* Cards */}
      {!showform && (
        <div className="flex flex-row gap-5 overflow-x-auto pb-2">
          {user?.member?.map(
            (member) =>
              member.isActive &&
              (isEdit !== member._id ? (
                <div
                  key={member._id}
                  className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl relative"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-center text-white">
                    {/* Action Buttons */}
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                      <button
                        className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all duration-200 flex items-center justify-center shadow-lg"
                        onClick={() => setIsEdit(member._id)}
                      >
                        <Pencil size={17} className="text-white" />
                      </button>

                      <button
                        onClick={() => {
                          deleteMember(member._id);
                        }}
                        className="w-7 h-7 rounded-full bg-rose-500/80 backdrop-blur-md border border-rose-300/30 hover:bg-rose-500 transition-all duration-200 flex items-center justify-center shadow-lg"
                      >
                        <Trash2 size={17} className="text-white" />
                      </button>
                    </div>
                    {member?.profileImage?.secure_url ? (
                      <img
                        src={member.profileImage.secure_url}
                        alt={member.name || "Member"}
                        className="w-20 h-20 rounded-full border-4 border-white/80 object-cover mx-auto shadow-md"
                        onClick={() =>
                          window.open(member.profileImage.secure_url, "_blank")
                        }
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full border-4 border-white/80 bg-blue-800/40 flex items-center justify-center mx-auto shadow-md">
                        <span className="text-xl font-semibold text-white">
                          {member?.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                    )}

                    <h2 className="text-lg font-bold mt-3 tracking-tight truncate">
                      {member.name}
                    </h2>
                    <p className="text-blue-100 text-xs">Member Details</p>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="font-semibold text-gray-600 text-xs">
                        DOB
                      </span>
                      <span className="text-gray-900 text-xs">
                        {member.dob
                          ? new Date(member.dob).toLocaleDateString("en-GB")
                          : "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="font-semibold text-gray-600 text-xs">
                        Aadhaar
                      </span>
                      <span className="text-gray-900 text-xs tracking-wide">
                        {member.aadhaarNumber || "—"}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        showDocuments !== member._id && getAadhaar(member._id);
                        setShowDocuments(
                          showDocuments === member._id ? null : member._id,
                        );
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium py-2 rounded-lg shadow-sm transition-all duration-200"
                    >
                      {showDocuments === member._id
                        ? "Hide Documents"
                        : "Show Documents"}
                    </button>

                    {showDocuments === member._id && (
                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <h3 className="font-semibold text-sm mb-3 text-gray-800">
                          Aadhaar Documents
                        </h3>

                        {loading ? (
                          <div className="flex flex-col gap-3">
                            <div className="w-full h-28 rounded-lg bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-2 overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                              <svg
                                className="animate-spin h-6 w-6 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                              </svg>
                              <span className="text-xs font-medium text-gray-500">
                                Fetching photo...
                              </span>
                            </div>

                            <div className="w-full h-28 rounded-lg bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-2 overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                              <svg
                                className="animate-spin h-6 w-6 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                              </svg>
                              <span className="text-xs font-medium text-gray-500">
                                Fetching photo...
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            <div>
                              <p className="text-center font-medium text-gray-700 mb-1 text-xs">
                                Front
                              </p>
                              {member?.aadhaarFront?.secure_url ? (
                                <img
                                  src={member.aadhaarFront.secure_url}
                                  alt={`${member.name || "Member"} Aadhaar Front`}
                                  className="w-full h-28 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                                  onClick={() =>
                                    window.open(
                                      member.aadhaarFront.secure_url,
                                      "_blank",
                                    )
                                  }
                                />
                              ) : (
                                <div className="w-full h-28 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                                  Not uploaded
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="text-center font-medium text-gray-700 mb-1 text-xs">
                                Back
                              </p>
                              {member?.aadhaarBack?.secure_url ? (
                                <img
                                  src={member.aadhaarBack.secure_url}
                                  alt={`${member.name || "Member"} Aadhaar Back`}
                                  className="w-full h-28 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                                  onClick={() =>
                                    window.open(
                                      member.aadhaarBack.secure_url,
                                      "_blank",
                                    )
                                  }
                                />
                              ) : (
                                <div className="w-full h-28 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                                  Not uploaded
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // ============ EDIT MODE CARD ============
                <div
                  key={member._id}
                  className="flex-shrink-0 w-64 rounded-2xl shadow-xl border-2 overflow-hidden transition-all duration-500 relative bg-gradient-to-b from-amber-50 to-orange-50 border-amber-300/70 ring-2 ring-amber-200/50 animate-[fadeIn_0.3s_ease-out]"
                >
                  {/* Edit Mode Badge */}
                  <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-amber-200/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    Editing
                  </div>

                  {/* Cancel Button */}
                  <div className="absolute top-3 left-3 z-10">
                    <button
                      className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40 transition-all duration-200 flex items-center justify-center shadow-lg"
                      onClick={() => setIsEdit(null)}
                    >
                      <X size={15} className="text-white" />
                    </button>
                  </div>

                  {/* Header */}
                  <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 p-5 text-center text-white relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/5 rounded-full"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full"></div>

                    <label
                      htmlFor={`profileImage-${member._id}`}
                      className="cursor-pointer block mx-auto w-20 h-20 group relative"
                    >
                      {member?.profileImage?.secure_url ? (
                        <img
                          src={member.profileImage.secure_url}
                          alt={member.name || "Member"}
                          className="w-20 h-20 rounded-full border-4 border-white/90 object-cover mx-auto shadow-lg shadow-orange-900/30 group-hover:border-white transition-all duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full border-4 border-white/60 bg-orange-800/30 flex items-center justify-center mx-auto shadow-lg shadow-orange-900/30 group-hover:border-white/90 group-hover:bg-orange-800/50 transition-all duration-300 group-hover:scale-105">
                          <Camera
                            size={24}
                            className="text-white/80 group-hover:text-white transition-colors"
                          />
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <Camera
                          size={16}
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                      <input
                        type="file"
                        id={`profileImage-${member._id}`}
                        name="profileImage"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => memberHandleChange(e, member._id)}
                      />
                    </label>
                    <p className="text-orange-100 text-[10px] mt-2 tracking-wide uppercase">
                      Tap to change photo
                    </p>

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      value={member.name || ""}
                      onChange={(e) => memberHandleChange(e, member._id)}
                      className="mt-3 w-full text-center text-lg font-bold tracking-tight bg-white/10 border-2 border-white/30 focus:border-white focus:bg-white/15 rounded-lg outline-none text-white placeholder-white/40 py-1.5 px-2 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                      <span className="font-semibold text-amber-800 text-xs flex items-center gap-1">
                        📅 DOB
                      </span>
                      <input
                        type="date"
                        name="dob"
                        value={
                          member.dob
                            ? new Date(member.dob).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => memberHandleChange(e, member._id)}
                        className="text-gray-800 text-xs bg-white/60 outline-none border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 rounded-md px-2 py-1 transition-all duration-200"
                      />
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                      <span className="font-semibold text-amber-800 text-xs flex items-center gap-1">
                        🆔 Aadhaar
                      </span>
                      <input
                        type="text"
                        name="aadhaarNumber"
                        placeholder="Enter Aadhaar"
                        value={member.aadhaarNumber || ""}
                        onChange={(e) => memberHandleChange(e, member._id)}
                        className="text-gray-800 text-xs tracking-wide bg-white/60 outline-none border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 rounded-md px-2 py-1 transition-all duration-200 text-right w-28"
                        maxLength={12}
                      />
                    </div>

                    {/* Aadhaar Documents */}
                    <div className="border-t border-amber-200/60 pt-3 mt-3">
                      <h3 className="font-semibold text-sm mb-3 text-amber-900 flex items-center gap-1.5">
                        📄 Aadhaar Documents
                      </h3>

                      <div className="flex flex-col gap-3">
                        {/* Aadhaar Front */}
                        <div>
                          <p className="text-center font-semibold text-amber-700 mb-1.5 text-xs uppercase tracking-wider">
                            Front
                          </p>
                          <label
                            htmlFor={`aadhaarFront-${member._id}`}
                            className="cursor-pointer block group"
                          >
                            {member?.aadhaarFront?.secure_url ? (
                              <div className="relative overflow-hidden rounded-xl">
                                <img
                                  src={member.aadhaarFront.secure_url}
                                  alt={`${member.name || "Member"} Aadhaar Front`}
                                  className="w-full h-28 object-cover rounded-xl border-2 border-amber-200 shadow-sm group-hover:shadow-lg group-hover:border-amber-400 transition-all duration-300 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-300 flex items-center justify-center">
                                  <Camera
                                    size={20}
                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-28 rounded-xl border-2 border-dashed border-amber-300 flex flex-col items-center justify-center text-amber-400 text-xs gap-1.5 bg-amber-50/50 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-100/50 transition-all duration-300 group-hover:scale-[1.02]">
                                <Camera size={22} />
                                <span className="font-medium">
                                  Upload Front
                                </span>
                              </div>
                            )}
                            <input
                              type="file"
                              id={`aadhaarFront-${member._id}`}
                              name="aadhaarFront"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                memberHandleChange(e, member._id)
                              }
                            />
                          </label>
                        </div>

                        {/* Aadhaar Back */}
                        <div>
                          <p className="text-center font-semibold text-amber-700 mb-1.5 text-xs uppercase tracking-wider">
                            Back
                          </p>
                          <label
                            htmlFor={`aadhaarBack-${member._id}`}
                            className="cursor-pointer block group"
                          >
                            {member?.aadhaarBack?.secure_url ? (
                              <div className="relative overflow-hidden rounded-xl">
                                <img
                                  src={member.aadhaarBack.secure_url}
                                  alt={`${member.name || "Member"} Aadhaar Back`}
                                  className="w-full h-28 object-cover rounded-xl border-2 border-amber-200 shadow-sm group-hover:shadow-lg group-hover:border-amber-400 transition-all duration-300 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-300 flex items-center justify-center">
                                  <Camera
                                    size={20}
                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-28 rounded-xl border-2 border-dashed border-amber-300 flex flex-col items-center justify-center text-amber-400 text-xs gap-1.5 bg-amber-50/50 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-100/50 transition-all duration-300 group-hover:scale-[1.02]">
                                <Camera size={22} />
                                <span className="font-medium">Upload Back</span>
                              </div>
                            )}
                            <input
                              type="file"
                              id={`aadhaarBack-${member._id}`}
                              name="aadhaarBack"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                memberHandleChange(e, member._id)
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => updateMemberDetails(member._id)}
                      disabled={updateLoading}
                      className={`w-full text-white text-sm font-semibold py-2.5 rounded-xl shadow-lg transition-all duration-300 ${
                        updateLoading
                          ? "bg-gray-400 cursor-not-allowed shadow-none"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-amber-400/50 active:scale-[0.97] shadow-amber-300/40"
                      }`}
                    >
                      {updateLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </div>
                      ) : (
                        "Update Member"
                      )}
                    </button>
                  </div>
                </div>
              )),
          )}
        </div>
      )}
    </>
  );
}

export default MemberDetailCard;
