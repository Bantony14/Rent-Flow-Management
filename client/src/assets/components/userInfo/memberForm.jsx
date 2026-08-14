function MemberForm({
  member,
  setMember,
  handleChange,
  onSubmit,
  loading,
  onClose,
}) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center transition"
      >
        ✕
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* ================= Left Section ================= */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-8 sm:px-8 sm:py-10 flex flex-col justify-center items-center text-white gap-6">
          {/* Profile Image */}

          <label
            htmlFor="profileImage"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white/80 bg-blue-800/30 flex items-center justify-center overflow-hidden cursor-pointer transition hover:scale-105 hover:border-white pb-3"
          >
            {member.profileImage ? (
              <img
                src={URL.createObjectURL(member.profileImage)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl sm:text-5xl font-bold">+</span>
            )}
          </label>

          <input
            required
            id="profileImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              setMember((prev) => ({
                ...prev,
                profileImage: e.target.files[0],
              }))
            }
          />

          <p className="text-xs sm:text-sm text-blue-100">
            Click to upload Profile Image
          </p>

          {/* Aadhaar Images */}
          <div className="w-full grid grid-cols-2 gap-3 sm:gap-4">
            {/* Front */}
            <div className="text-center">
              <label
                htmlFor="aadhaarFront"
                className="cursor-pointer h-32 sm:h-40 border-2 border-dashed border-white/60 rounded-xl flex items-center justify-center overflow-hidden transition hover:bg-white/10 hover:border-white"
              >
                {member.aadhaarFront ? (
                  <img
                    src={URL.createObjectURL(member.aadhaarFront)}
                    alt="Front"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs sm:text-sm">Front</span>
                )}
              </label>

              <input
                required
                id="aadhaarFront"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setMember((prev) => ({
                    ...prev,
                    aadhaarFront: e.target.files[0],
                  }))
                }
              />

              <p className="mt-2 text-xs sm:text-sm">Aadhaar Front</p>
            </div>

            {/* Back */}
            <div className="text-center">
              <label
                htmlFor="aadhaarBack"
                className="cursor-pointer h-32 sm:h-40 border-2 border-dashed border-white/60 rounded-xl flex items-center justify-center overflow-hidden transition hover:bg-white/10 hover:border-white"
              >
                {member.aadhaarBack ? (
                  <img
                    src={URL.createObjectURL(member.aadhaarBack)}
                    alt="Back"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs sm:text-sm">Back</span>
                )}
              </label>

              <input
                required
                id="aadhaarBack"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setMember((prev) => ({
                    ...prev,
                    aadhaarBack: e.target.files[0],
                  }))
                }
              />

              <p className="mt-2 text-xs sm:text-sm">Aadhaar Back</p>
            </div>
          </div>
        </div>

        {/* ================= Right Section ================= */}
        <form
          onSubmit={onSubmit}
          className="p-6 sm:p-8 flex flex-col justify-center gap-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={member.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Date of Birth
            </label>

            <input
              type="date"
              name="dob"
              value={member.dob}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Aadhaar Number
            </label>

            <input
              type="text"
              name="aadhaarNumber"
              value={member.aadhaarNumber}
              onChange={handleChange}
              placeholder="XXXX XXXX XXXX"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
              maxLength={12}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-3 w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"
            }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Adding...
              </>
            ) : (
              "Add Member"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MemberForm;
