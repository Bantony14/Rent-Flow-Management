import {
  CalendarDays,
  Building2,
  IndianRupee,
  Phone,
  Mail,
  ShieldCheck,
  User2,
  Home,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useState } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import { fetchImage } from "../../api/authApi";
import MemberDetailCard from "../../components/userInfo/memberDetailsCard";
import MemberCard from "../../components/tenantPofile/MemberCard";

const TenantProfile = () => {
  const tenant = useContext(AuthContext).user;
  const loading = useContext(AuthContext).loading;
  const [openDocuments, setOpenDocuments] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  async function fetchAaddharImage() {
    if (!tenant.aadhaarFront.secure_url && !tenant.aadhaarBack.secure_url)
      try {
        setLoadingImage(true);
        const res = await fetchImage(tenant._id);
        tenant.aadhaarFront.secure_url = res.data.aadhaarFrontUrl;
        tenant.aadhaarBack.secure_url = res.data.aadhaarBackUrl;
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoadingImage(false);
      }
  }

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg">
          {/* Banner */}
          <div className="relative h-44 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500">
            <div className="absolute inset-0 bg-black/10"></div>

            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"></div>
            <div className="absolute right-20 bottom-0 h-40 w-40 rounded-full bg-white/10"></div>
          </div>

          <div className="relative px-6 pb-8 md:px-10">
            <div className="-mt-20 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              {/* Left */}
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end">
                <div className="relative">
                  <img
                    src={tenant.profileImage?.secure_url}
                    alt={tenant.fullName}
                    className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-2xl"
                  />

                  <div
                    className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-white ${
                      tenant.paymentStatus === "Paid"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                </div>

                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-slate-800">
                    {tenant.fullName}
                  </h1>

                  <p className="mt-1 text-slate-500">{tenant.email}</p>

                  <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                    <span className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-700">
                      {tenant.role}
                    </span>

                    <span
                      className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                        tenant.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tenant.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <p className="text-sm font-medium text-slate-500">
                  Monthly Rent
                </p>

                <h2 className="mt-2 text-4xl font-bold text-blue-600">
                  ₹{tenant?.rentPrice?.toLocaleString("en-IN")}
                </h2>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${
                      tenant.paymentStatus === "Paid"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: tenant.paymentStatus === "Paid" ? "100%" : "35%",
                    }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  Payment Status :
                  <span
                    className={`ml-2 font-semibold ${
                      tenant.paymentStatus === "Paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tenant.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*  Details*/}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Personal */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Personal Information
            </h2>

            <div className="space-y-5">
              <Info
                icon={<User2 size={18} />}
                label="Full Name"
                value={tenant.fullName}
              />

              <Info
                icon={<Mail size={18} />}
                label="Email"
                value={tenant.email}
              />

              <Info
                icon={<Phone size={18} />}
                label="Mobile"
                value={tenant.mobileNumber}
              />
              <Info
                icon={<Phone size={18} />}
                label="Aadhaar Number"
                value={tenant.aadhaarNumber.match(/.{1,4}/g).join("-")}
              />

              <Info
                icon={<CalendarDays size={18} />}
                label="Date of Birth"
                value={new Date(tenant.dob)?.toLocaleDateString("en-IN")}
              />

              <Info
                icon={<CalendarDays size={18} />}
                label="Joining Date"
                value={new Date(tenant.joiningDate)?.toLocaleDateString(
                  "en-IN",
                )}
              />
            </div>
          </div>

          {/* Property */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Property Details
            </h2>

            <div className="space-y-5">
              <Info
                icon={<Building2 size={18} />}
                label="Building"
                value={tenant.building}
              />

              <Info
                icon={<Home size={18} />}
                label="Room Number"
                value={tenant.roomNumber}
              />

              <Info
                icon={<IndianRupee size={18} />}
                label="Monthly Rent"
                value={`₹${tenant?.rentPrice?.toLocaleString("en-IN")}`}
              />

              <Info
                icon={<IndianRupee size={18} />}
                label="Due Amount"
                value={`₹${tenant?.dueAmount?.toLocaleString("en-IN")}`}
              />

              <Info
                icon={<ShieldCheck size={18} />}
                label="Payment Status"
                value={tenant.paymentStatus}
              />

              <Info
                icon={<CalendarDays size={18} />}
                label="Next Rent Month"
                value={tenant.nextRentGeneratedMonth}
              />
            </div>
          </div>
        </div>

        {/* Aadhaar  */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-slate-800">
              Identity Documents
            </h2>

            <button
              onClick={() => {
                if (!openDocuments) {
                  fetchAaddharImage();
                }
                setOpenDocuments((prev) => !prev);
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              {openDocuments ? "Hide Documents" : "View Documents"}

              <svg
                className={`h-4 w-4 transition-transform ${
                  openDocuments ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Dropdown panel */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openDocuments
                ? "max-h-[700px] opacity-100 mt-5"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-slate-200 pt-5">
              <p className="mb-4 text-sm font-medium text-slate-600">
                Aadhaar Card
              </p>

              {loadingImage ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-pulse">
                  <div>
                    <div className="w-full h-56 rounded-2xl bg-stone-200"></div>
                    <div className="mt-3 h-4 w-24 mx-auto rounded bg-slate-200"></div>
                  </div>

                  <div>
                    <div className="w-full h-56 rounded-2xl bg-stone-200"></div>
                    <div className="mt-3 h-4 w-24 mx-auto rounded bg-slate-200"></div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <img
                      onClick={() =>
                        window.open(tenant?.aadhaarFront?.secure_url, "_blank")
                      }
                      src={tenant?.aadhaarFront?.secure_url}
                      alt="Aadhaar Front"
                      className="w-full h-56 rounded-2xl border border-slate-200 object-contain bg-white p-3 shadow-sm transition duration-300 hover:shadow-lg hover:scale-[1.02]"
                    />
                    <p className="mt-2 text-center text-sm font-medium text-slate-600">
                      Front Side
                    </p>
                  </div>

                  <div>
                    <img
                      onClick={() =>
                        window.open(tenant?.aadhaarBack?.secure_url, "_blank")
                      }
                      src={tenant?.aadhaarBack?.secure_url}
                      alt="Aadhaar Back"
                      className="w-full h-56 rounded-2xl border border-slate-200 object-contain bg-white p-3 shadow-sm transition duration-300 hover:shadow-lg hover:scale-[1.02]"
                    />
                    <p className="mt-2 text-center text-sm font-medium text-slate-600">
                      Back Side
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="bg-white rounded-2xl shadow p-6">
          <MemberCard />
        </div>
      </div>
    </div>
  );
};

const Info = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default TenantProfile;
