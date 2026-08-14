import { useState, useEffect, useContext } from "react";
import { getAadhaarImage } from "../../api/authApi";
import { AuthContext } from "../../context/authContext";

function MemberCard() {
  const { user, setUser } = useContext(AuthContext);
  const [showDocuments, setShowDocuments] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">Family Members</h1>
      </div>

      {/* Cards */}
      <div className="flex flex-row gap-5 overflow-x-auto pb-2">
        {user?.member?.map(
          (member) =>
            member.isActive && (
              <div
                key={member._id}
                className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl relative"
              >
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-center text-white">
                  {member?.profileImage?.secure_url ? (
                    <img
                      src={member.profileImage.secure_url}
                      alt={member.name || "Member"}
                      className="w-20 h-20 rounded-full border-4 border-white/80 object-cover mx-auto shadow-md cursor-pointer"
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
                                className="w-full h-28 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
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
                                className="w-full h-28 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
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
            ),
        )}
      </div>
    </>
  );
}

export default MemberCard;
