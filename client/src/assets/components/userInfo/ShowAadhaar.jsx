import React from "react";
import { Upload, IdCard, ImageIcon } from "lucide-react";

function ShowAadhaar({
  openDocuments,
  setOpenDocuments,
  fetchAaddharImage,
  loadingImage,
  tenantDetail,
  isEdit,
  handleChange,
  formdata,
  setFetchRoomLoading,
}) {
  return !isEdit ? (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-800">Identity Documents</h2>

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
          openDocuments ? "max-h-[700px] opacity-100 mt-5" : "max-h-0 opacity-0"
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
                    window.open(
                      tenantDetail?.aadhaarFront?.secure_url,
                      "_blank",
                    )
                  }
                  src={tenantDetail?.aadhaarFront?.secure_url}
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
                    window.open(tenantDetail?.aadhaarBack?.secure_url, "_blank")
                  }
                  src={tenantDetail?.aadhaarBack?.secure_url}
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
  ) : (
    // this is will work on edit time
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {/* Aadhaar Front */}
      <div>
        <label
          htmlFor="aadhaarFront"
          className="group relative flex h-56 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-blue-400 hover:bg-blue-50/50"
        >
          {formdata?.aadhaarFront?.secure_url ? (
            <>
              <img
                src={
                  typeof formdata?.aadhaarFront?.secure_url === "string"
                    ? formdata?.aadhaarFront?.secure_url
                    : URL.createObjectURL(formdata?.aadhaarFront?.secure_url)
                }
                alt="Aadhaar Front"
                className="h-full w-full object-contain p-2"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow">
                  <Upload className="h-3.5 w-3.5" />
                  Change Image
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 transition group-hover:text-blue-500">
              <div className="rounded-full bg-white p-3 shadow-sm">
                <IdCard className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Upload Front Side</p>
              <p className="text-xs text-slate-400">Click to browse</p>
            </div>
          )}

          <input
            type="file"
            name="aadhaarFront"
            id="aadhaarFront"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600">
          <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
          Front Side
        </p>
      </div>

      {/* Aadhaar Back */}
      <div>
        <label
          htmlFor="aadhaarBack"
          className="group relative flex h-56 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-blue-400 hover:bg-blue-50/50"
        >
          {formdata?.aadhaarBack?.secure_url ? (
            <>
              <img
                src={
                  typeof formdata?.aadhaarBack?.secure_url === "string"
                    ? formdata?.aadhaarBack?.secure_url
                    : URL.createObjectURL(formdata?.aadhaarBack?.secure_url)
                }
                alt="Aadhaar Back"
                className="h-full w-full object-contain p-2"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow">
                  <Upload className="h-3.5 w-3.5" />
                  Change Image
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 transition group-hover:text-blue-500">
              <div className="rounded-full bg-white p-3 shadow-sm">
                <IdCard className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Upload Back Side</p>
              <p className="text-xs text-slate-400">Click to browse</p>
            </div>
          )}

          <input
            type="file"
            name="aadhaarBack"
            id="aadhaarBack"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600">
          <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
          Back Side
        </p>
      </div>
    </div>
  );
}

export default ShowAadhaar;
