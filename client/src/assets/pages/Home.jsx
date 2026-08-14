import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import Button from "../components/MyButton";
import { getAllRoom } from "../api//roomApi";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContact, setShowContact] = useState(false);

  // Owner contact info (replace with API data later)
  const ownerInfo = {
    name: "Bantony Singh",
    phone: "+91 91041 53677",
    email: "bantonysin95@gmail.com",
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllRoom();
      setRooms(response.data?.room || []);
    } catch (err) {
      setError("Failed to load rooms.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Use first room data for hero section
  const firstRoom = rooms[0];
  const heroImage = firstRoom?.roomImage[0]?.secure_url || "";
  const buildingName = firstRoom?.buildingName || "Our Property";
  const address = firstRoom?.address || "";
  const availableCount = rooms.filter((r) => r.Avaliablity).length;

  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative bg-zinc-950 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {heroImage && (
            <img
              src={heroImage}
              alt="property"
              className="w-full h-full object-cover opacity-20"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/80 to-zinc-950" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-12 md:pt-6 md:pb-1 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT */}
          <div>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs sm:text-sm font-medium mb-6">
              Trusted Property Management
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.1] mb-6">
              Comfortable Living
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Better Rental Experience
              </span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              Find your perfect rental home at {buildingName}. We offer
              well-maintained, spacious rooms with modern amenities in a secure
              environment.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/rooms">
                <Button className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 active:scale-95 transition duration-300 shadow-xl shadow-cyan-500/20">
                  View Rooms
                </Button>
              </Link>
              <Button
                onClick={() => setShowContact((prev) => !prev)}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl border border-zinc-700 bg-zinc-900/70 hover:border-cyan-500 hover:bg-zinc-900 transition duration-300 inline-flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                {showContact ? "Hide Contact" : "Contact Owner"}
              </Button>
            </div>

            {/* Contact Owner Panel */}
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

          {/* RIGHT SIDE CARD */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 blur-3xl rounded-full" />
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
              {heroImage && (
                <img
                  src={heroImage}
                  alt="property"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
              )}
              <div className="p-5 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black mb-1">
                      {buildingName}
                    </h2>
                    <p className="text-zinc-400 text-sm">{address}</p>
                  </div>
                  <span className="shrink-0 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-medium whitespace-nowrap">
                    {availableCount} Available
                  </span>
                </div>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Clean surroundings, secure management, and comfortable rooms
                  for tenants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ROOMS SECTION ==================== */}
      <section className="w-full bg-zinc-950 text-white py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10 sm:mb-14">
            <div>
              <p className="text-cyan-400 font-medium mb-2 text-sm sm:text-base">
                Available Rooms
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                Explore Property Rooms
              </h2>
            </div>
            <Link to="/rooms">
              <Button className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 active:scale-95 transition duration-300 shrink-0">
                View All
              </Button>
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900/40 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-zinc-800" />
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex justify-between">
                      <div className="h-6 w-20 bg-zinc-800 rounded-lg" />
                      <div className="h-6 w-20 bg-zinc-800 rounded-full" />
                    </div>
                    <div className="h-4 w-32 bg-zinc-800 rounded-lg" />
                    <div className="h-3 w-full bg-zinc-800/60 rounded-lg" />
                    <div className="border-t border-zinc-800 pt-4 flex justify-between">
                      <div className="h-6 w-24 bg-zinc-800 rounded-lg" />
                      <div className="h-9 w-28 bg-zinc-800 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-16">
              <p className="text-zinc-400 mb-6">{error}</p>
              <Button
                onClick={fetchRooms}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 active:scale-95 transition duration-300"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Room Cards */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="flex flex-col rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/40 hover:border-cyan-500/40 hover:bg-zinc-900/60 transition duration-300 group"
                >
                  {/* Room Image */}
                  <div className="overflow-hidden aspect-[4/3]">
                    <img
                      src={room.roomImage[0]?.secure_url}
                      alt={room.room}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  {/* Room Info */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    {/* Room name + Availability */}
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h3 className="text-xl sm:text-2xl font-bold">
                        {room.room}
                      </h3>
                      <span
                        className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${
                          room.Avaliablity
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {room.Avaliablity ? "Available" : "Occupied"}
                      </span>
                    </div>

                    {/* Building + Owner */}
                    <p className="text-zinc-400 text-sm font-medium mb-1">
                      {room.buildingName}
                    </p>
                    {room.ownerName && (
                      <p className="text-zinc-500 text-xs mb-4">
                        Owner: {room.ownerName}
                      </p>
                    )}

                    <p className="text-zinc-500 mb-5 text-sm sm:text-base line-clamp-2">
                      Spacious and clean room with modern facilities and secure
                      environment.
                    </p>

                    {/* Rent + View Details */}
                    <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-zinc-800">
                      <h4 className="text-lg sm:text-xl font-black text-cyan-400 whitespace-nowrap">
                        ₹{room.rent.toLocaleString()}
                        <span className="text-zinc-500 text-xs font-medium">
                          /mo
                        </span>
                      </h4>
                      <Link
                        to={`/room/${room._id}`}
                        className="w-full sm:w-auto"
                      >
                        <Button className="w-full px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium hover:scale-105 active:scale-95 transition duration-300 whitespace-nowrap">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
