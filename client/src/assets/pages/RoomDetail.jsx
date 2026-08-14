import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Users,
  Check,
  X,
  Phone,
  Loader2,
} from "lucide-react";
import Button from "../components/MyButton";
import { getAllRoom, bookRoom } from "../api/roomApi";

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toggle panels
  const [showContact, setShowContact] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  // Booking form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  const ownerInfo = {
    name: "Bantony Singh",
    phone: "+91 91041 53677",
    email: "bantonysin95@gmail.com",
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllRoom();
      const rooms = response.data?.room || [];
      setRoom(rooms.find((r) => r._id === id) || null);
    } catch (err) {
      setError("Failed to load room details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuery = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate
    if (!name.trim()) return setFormError("Please enter your name.");
    if (!email.trim() || !email.includes("@"))
      return setFormError("Please enter a valid email.");
    if (!mobile.trim() || mobile.length < 10)
      return setFormError("Please enter a valid 10-digit mobile number.");

    try {
      setSending(true);
      await bookRoom({
        roomId: room._id,
        roomName: room.room,
        buildingName: room.buildingName,
        rent: room.rent,
        userName: name,
        userEmail: email,
        userMobile: mobile,
      });
      setSent(true);
      setName("");
      setEmail("");
      setMobile("");
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to send. Try again.");
    } finally {
      setSending(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <section className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
          <div className="h-5 w-36 bg-zinc-800 rounded-lg mb-8 animate-pulse" />
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 animate-pulse">
            <div>
              <div className="rounded-3xl bg-zinc-800 aspect-[4/3]" />
              <div className="grid grid-cols-4 gap-3 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-zinc-800 aspect-square"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between">
                <div className="h-10 w-32 bg-zinc-800 rounded-xl" />
                <div className="h-8 w-24 bg-zinc-800 rounded-full" />
              </div>
              <div className="h-4 w-64 bg-zinc-800 rounded-lg" />
              <div className="h-12 w-44 bg-zinc-800 rounded-xl" />
              <div className="rounded-2xl bg-zinc-800 h-32" />
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-zinc-800 h-20" />
                <div className="rounded-2xl bg-zinc-800 h-20" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 h-12 bg-zinc-800 rounded-2xl" />
                <div className="flex-1 h-12 bg-zinc-800 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4">
        <p className="text-zinc-400 mb-6">{error}</p>
        <Button
          onClick={fetchRoom}
          className="px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 active:scale-95 transition duration-300 shadow-xl shadow-cyan-500/20"
        >
          Try Again
        </Button>
      </section>
    );
  }

  // Not Found
  if (!room) {
    return (
      <section className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4">
        <p className="text-zinc-400 mb-6">Room not found.</p>
        <Link
          to="/"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold"
        >
          Back to Home
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition mb-6 sm:mb-8 text-sm sm:text-base cursor-pointer"
        >
          <ArrowLeft size={18} />
          Back to Rooms
        </button>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* LEFT: Images */}
          <div>
            <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/40 aspect-[4/3]">
              <img
                src={room.roomImage[activeImage]?.secure_url}
                alt={room.room}
                className="w-full h-full object-cover"
              />
            </div>
            {room.roomImage.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-4">
                {room.roomImage.map((img, idx) => (
                  <button
                    key={img.secure_url}
                    onClick={() => setActiveImage(idx)}
                    className={`rounded-xl overflow-hidden aspect-square border-2 transition cursor-pointer ${
                      activeImage === idx
                        ? "border-cyan-500"
                        : "border-zinc-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.secure_url}
                      alt={`${room.room}-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div>
            {/* Room name + badge */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">
                {room.room}
              </h1>
              <span
                className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border ${
                  room.Avaliablity
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {room.Avaliablity ? <Check size={14} /> : <X size={14} />}
                {room.Avaliablity ? "Available" : "Occupied"}
              </span>
            </div>

            {/* Address */}
            <div className="flex items-center gap-2 text-zinc-400 mb-6">
              <MapPin size={16} className="text-cyan-400 shrink-0" />
              <p className="text-sm sm:text-base">{room.address}</p>
            </div>

            {/* Rent */}
            <div className="flex items-baseline gap-2 mb-8">
              <h2 className="text-4xl sm:text-5xl font-black text-cyan-400">
                ₹{room.rent.toLocaleString()}
              </h2>
              <span className="text-zinc-500 text-lg">/month</span>
            </div>

            {/* About */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 mb-6">
              <h3 className="text-lg font-bold mb-3">About this room</h3>
              <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                Spacious and clean room with modern facilities and a secure
                environment at {room.buildingName}. Ideal for individuals or
                small families looking for a comfortable rental stay.
              </p>
            </div>

            {/* Building + Tenants */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
                <p className="text-zinc-500 text-xs sm:text-sm mb-1">
                  Building
                </p>
                <p className="font-semibold text-sm sm:text-base">
                  {room.buildingName}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
                <p className="text-zinc-500 text-xs sm:text-sm mb-1 flex items-center gap-1">
                  <Users size={14} /> Tenants
                </p>
                <p className="font-semibold text-sm sm:text-base">
                  {room.tenantsId?.length || 0} Assigned
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                disabled={!room.Avaliablity}
                onClick={() => {
                  if (room.Avaliablity) {
                    setShowBooking((prev) => !prev);
                    setShowContact(false);
                    setSent(false);
                    setFormError("");
                  }
                }}
                className={`flex-1 px-7 py-3.5 rounded-2xl font-semibold transition duration-300 ${
                  room.Avaliablity
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 active:scale-95 shadow-xl shadow-cyan-500/20"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {room.Avaliablity
                  ? showBooking
                    ? "Hide Booking Form"
                    : "Book This Room"
                  : "Currently Occupied"}
              </Button>

              <Button
                onClick={() => {
                  setShowContact((prev) => !prev);
                  setShowBooking(false);
                }}
                className="flex-1 px-7 py-3.5 rounded-2xl border border-zinc-700 bg-zinc-900/70 hover:border-cyan-500 hover:bg-zinc-900 transition duration-300 inline-flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                {showContact ? "Hide Contact" : "Contact Owner"}
              </Button>
            </div>

            {/* ===== BOOKING FORM (slide down) ===== */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showBooking
                  ? "max-h-[500px] opacity-100 mt-5"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 sm:p-6">
                {sent ? (
                  // Success
                  <div className="text-center py-4">
                    <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                      <Check size={28} className="text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Query Sent!
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Confirmation email sent to you and the owner.
                    </p>
                  </div>
                ) : (
                  // Form
                  <form onSubmit={handleSendQuery} className="space-y-4">
                    <h3 className="text-base font-bold text-cyan-400 mb-1">
                      Book Room {room.room}
                    </h3>

                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setFormError("");
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-500/40 transition"
                    />

                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormError("");
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-500/40 transition"
                    />

                    <input
                      type="tel"
                      placeholder="Mobile Number (10 digits)"
                      value={mobile}
                      maxLength={10}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        setFormError("");
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-500/40 transition"
                    />

                    {formError && (
                      <p className="text-red-400 text-sm">{formError}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={sending}
                      className={`w-full px-7 py-3 rounded-2xl font-semibold transition duration-300 inline-flex items-center justify-center gap-2 ${
                        sending
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 active:scale-95 shadow-xl shadow-cyan-500/20"
                      }`}
                    >
                      {sending ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Query"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* ===== CONTACT INFO (slide down) ===== */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showContact ? "max-h-60 opacity-100 mt-5" : "max-h-0 opacity-0"
              }`}
            >
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 sm:p-6 space-y-3">
                <h3 className="text-base font-bold text-cyan-400 mb-2">
                  Owner Contact Details
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-zinc-400 text-sm">Name</p>
                  <p className="font-semibold text-sm sm:text-base">
                    {ownerInfo.name}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-zinc-400 text-sm">Phone</p>
                  <a
                    href={`tel:${ownerInfo.phone}`}
                    className="font-semibold text-sm sm:text-base text-cyan-400 hover:underline"
                  >
                    {ownerInfo.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-zinc-400 text-sm">Email</p>
                  <a
                    href={`mailto:${ownerInfo.email}`}
                    className="font-semibold text-sm sm:text-base text-cyan-400 hover:underline truncate max-w-[60%]"
                  >
                    {ownerInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoomDetails;
