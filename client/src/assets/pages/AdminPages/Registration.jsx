import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { getRoomByBuilding, userRegistrationApi } from "../../api/authApi.js";
import toast from "react-hot-toast";
import {
  rooms,
  errorMsg,
  validation,
  input,
} from "../../utils/formValidation.js";
import { AuthContext } from "../../context/authContext.jsx";
import { useContext } from "react";

function Registration() {
  const initialState = {
    fullName: "",
    aadhaarNumber: "",
    mobileNumber: "",
    dob: "",
    password: "",
    roomNumber: "",
    building: "",
    email: "",
    joiningDate: "",
    rentPrice: "",
  };
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [roomOptions, setRoomOptions] = useState([]);
  const [buildingOption, setBuildingOption] = useState([]);
  const strongPassword =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  const strongEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const [profileImage, setProfileImage] = useState("");
  const [addhaarFront, setAddhaarFront] = useState("");
  const [addhaarBack, setAddhaarBack] = useState("");
  const [loading, setloading] = useState(false);
  const params = {};
  if (formData.building) {
    params.building = formData.building;
  }
  if (formData.roomNumber) {
    params.roomNumber = formData.roomNumber;
  }

  // fetching room via building name

  useEffect(() => {
    const fetchRooms = async () => {
      setBuildingOption(user.properties);

      if (!formData.building) {
        setRoomOptions("");
        return;
      }
      try {
        const res = await getRoomByBuilding(params);
        const rooms = res.data.building.map((room) => room.room);
        setRoomOptions(rooms);
      } catch (error) {
        setRoomOptions("");
        toast.error(error?.response?.data?.message);
      }
    };

    fetchRooms();
  }, [formData.building, user]);

  // rent via building and room
  useEffect(() => {
    if (!formData.roomNumber) return;

    (async () => {
      try {
        const res = await getRoomByBuilding(params);

        setFormData((prev) => ({
          ...prev,
          rentPrice: res.data.building[0].rent,
        }));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch rent");
      }
    })();
  }, [formData.roomNumber]);

  const inputs = input(roomOptions, buildingOption);
  const validations = validation(formData, strongPassword, strongEmail);

  //  changing value of form data
  function handleChange(e) {
    if (
      (e.target.name === "aadhaarNumber" || e.target.name === "mobileNumber") &&
      !/^\d*$/.test(e.target.value)
    ) {
      return;
    }

    if (e.target.name === "building") {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        roomNumber: "",
        rentPrice: "",
      }));

      return;
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // submit form and registration tanant
  async function handleSubmit(e) {
    e.preventDefault();

    if (!strongPassword.test(formData.password)) {
      return;
    }
    if (!strongEmail.test(formData.email)) {
      return;
    }

    if (!profileImage || !addhaarFront || !addhaarBack) {
      toast.error("please upload all image");
      return;
    }

    // tenantDetails add

    const tenantDetails = new FormData(); // reset value

    function tenant() {
      tenantDetails.set("profileImage", profileImage);
      tenantDetails.set("aadhaarFront", addhaarFront);
      tenantDetails.set("aadhaarBack", addhaarBack);

      Object.keys(formData).forEach((key) => {
        tenantDetails.set(key, formData[key]);
      });
    }

    tenant();

    setloading(true);

    try {
      const response = await userRegistrationApi(tenantDetails);
      toast.success(response.data.message);
      setFormData(initialState);
      setaddhaarFront("");
      setAddhaarBack("");
      setProfileImage("");
    } catch (error) {
      return toast.error(error.response.data.message);
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="
                        w-full 
                        max-w-2xl 
                        p-6 
                        sm:p-8
                        bg-white 
                        rounded-2xl 
                        border border-gray-200
                        shadow-lg 
                        shadow-gray-200/60
                        "
      >
        {/* Title */}
        <div className="mb-2 md:mb-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Registration Form
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Fill in Tenant details to create account
          </p>
        </div>

        {/* profile image upload here */}

        <div className="flex flex-col items-center mb-4">
          <label
            htmlFor="profileImage"
            className="cursor-pointer flex flex-col items-center group"
          >
            <div className="w-32 h-38 rounded-full overflow-hidden border-2 border-gray-300 group-hover:border-blue-500 transition-all duration-300">
              <img
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                alt="Profile"
                className="w-full h-full object-stretch"
              />
            </div>

            <p className="mt-3 text-sm font-medium text-gray-600 group-hover:text-blue-500 transition-colors">
              {profileImage
                ? "Click to change profile picture"
                : "Click to upload profile picture"}
            </p>
          </label>

          <input
            id="profileImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {inputs.map((value, index) => {
            if (value.name === "building" || value.name === "roomNumber") {
              return (
                <div key={index}>
                  <select
                    name={value.name}
                    value={formData[value.name]}
                    onChange={handleChange}
                    required
                    className="
                                                    w-full
                                                    h-12
                                                    px-4
                                                    border border-gray-300
                                                    rounded-xl
                                                    bg-white
                                                    text-gray-700
                                                    outline-none
                                                    transition-all
                                                    duration-200
                                                    focus:border-cyan-500
                                                    focus:ring-4
                                                    focus:ring-cyan-100
                                                "
                  >
                    <option value="">
                      {value.name === "building"
                        ? "Select Building"
                        : "Select Room Number"}
                    </option>

                    {value.options.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {validations[value.name] && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      ⚠ {errorMsg[value.name]}
                    </p>
                  )}
                </div>
              );
            }

            return (
              <div key={index} className="relative">
                <input
                  type={
                    value.type === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : value.type
                  }
                  name={value.name}
                  value={formData[value.name]}
                  onChange={handleChange}
                  placeholder={value.placeholder}
                  minLength={value.minLength}
                  maxLength={value.maxLength}
                  readOnly={value.name === "rentPrice" ? true : false}
                  max={
                    value.type === "date"
                      ? new Date().toISOString().split("T")[0]
                      : undefined
                  }
                  required
                  className="
                                                    w-full
                                                    h-12
                                                    px-4
                                                    border border-gray-300
                                                    rounded-xl
                                                    outline-none
                                                    text-gray-700
                                                    placeholder:text-gray-400
                                                    transition-all
                                                    duration-200
                                                    focus:border-cyan-500
                                                    focus:ring-4
                                                    focus:ring-cyan-100
                                                    "
                />

                {validations[value.name] && formData[value.name] && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    ⚠ {errorMsg[value.name]}
                  </p>
                )}

                {value.type === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                                                        absolute
                                                        right-4
                                                        top-3.5
                                                        text-gray-500
                                                        hover:text-cyan-600
                                                        transition
                                                        "
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                )}
              </div>
            );
          })}

          {/* addhaar Image uplode front and back */}
          {/* addhaar Image uplode front */}

          <div className="flex justify-center">
            <label
              htmlFor="aadhaarFront"
              className="w-100 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all duration-300"
            >
              <img
                src={
                  addhaarFront
                    ? URL.createObjectURL(addhaarFront)
                    : "https://www.freeiconspng.com/thumbs/plus-icon/plus-icon-black-2.png"
                }
                alt="Aadhaar Front"
                className={
                  addhaarFront
                    ? "w-full h-full object-cover rounded-xl"
                    : "w-12 h-12 opacity-60"
                }
              />

              {!addhaarFront && (
                <p className="mt-3 text-sm text-gray-500 font-medium">
                  Click to upload Aadhaar Front
                </p>
              )}
            </label>

            <input
              id="aadhaarFront"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setAddhaarFront(e.target.files[0])}
            />
          </div>

          {/* addhaar Image uplode back */}
          <div className="flex justify-center">
            <label
              htmlFor="aadhaarBack"
              className="w-100 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all duration-300"
            >
              <img
                src={
                  addhaarBack
                    ? URL.createObjectURL(addhaarBack)
                    : "https://www.freeiconspng.com/thumbs/plus-icon/plus-icon-black-2.png"
                }
                alt="Aadhaar Back"
                className={`${
                  addhaarBack
                    ? "w-full h-full object-cover rounded-xl"
                    : "w-12 h-12 opacity-60"
                }`}
              />

              {!addhaarBack && (
                <p className="mt-3 text-sm text-gray-500 font-medium">
                  Click to upload Aadhaar Back
                </p>
              )}
            </label>

            <input
              id="aadhaarBack"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setAddhaarBack(e.target.files[0])}
            />
          </div>

          {/* Submit Button */}

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="
    w-full
    h-12
    rounded-xl
    font-semibold
    text-white
    bg-gradient-to-r
    from-blue-600
    to-cyan-500
    transition-all
    duration-200
    hover:scale-[1.01]
    active:scale-95
    shadow-lg
    shadow-cyan-200/50
    disabled:opacity-70
    disabled:cursor-not-allowed
    flex
    items-center
    justify-center
    gap-2
  "
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Registration;
