import React, { useEffect, useState } from "react";
import PropertiesCard from "./PropertiesCard";
import { getAllRoom } from "../api//roomApi";
import { Search } from "lucide-react";
import Button from "../components/MyButton";

const Properties = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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
      setError("Failed to load properties. Please try again.");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories from room data
  // Room prefixes (A, B, C...) + Availability filters
  const getCategories = () => {
    const prefixes = [
      ...new Set(rooms.map((r) => r.room?.split("-")[0]).filter(Boolean)),
    ];
    const buildings = [
      ...new Set(rooms.map((r) => r.buildingName).filter(Boolean)),
    ];

    const categories = ["All"];

    // Add room prefixes if more than one type exists
    if (prefixes.length > 1) {
      prefixes.forEach((p) => categories.push(`Type ${p}`));
    }

    // Add building names if more than one building
    if (buildings.length > 1) {
      buildings.forEach((b) => categories.push(b));
    }

    // Always add availability filters
    categories.push("Available", "Occupied");

    return categories;
  };

  const categories = getCategories();

  // Filter rooms based on search + active category
  const filteredRooms = rooms?.filter((room) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      room.room?.toLowerCase().includes(query) ||
      room.buildingName?.toLowerCase().includes(query) ||
      room.ownerName?.toLowerCase().includes(query) ||
      room.address?.toLowerCase().includes(query);

    let matchesCategory = true;
    if (activeCategory === "Available") {
      matchesCategory = room.Avaliablity === true;
    } else if (activeCategory === "Occupied") {
      matchesCategory = room.Avaliablity === false;
    } else if (activeCategory.startsWith("Type ")) {
      const prefix = activeCategory.replace("Type ", "");
      matchesCategory = room.room?.startsWith(prefix + "-");
    } else if (activeCategory !== "All") {
      // Building name filter
      matchesCategory = room.buildingName === activeCategory;
    }

    return matchesSearch && matchesCategory;
  });

  const availableCount = rooms.filter((r) => r.Avaliablity).length;

  return (
    <section className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-8">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs sm:text-sm font-medium mb-6">
          {availableCount} Rooms Available
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
          Browse All
          <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Properties
          </span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mb-8">
          Explore our collection of well-maintained rooms. Filter by type or
          availability to find your perfect rental.
        </p>

        {/* Search */}
        <div className="relative max-w-lg">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search rooms, buildings, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-300"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition duration-300 cursor-pointer ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:border-cyan-500/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20">
        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-zinc-400 mb-6">{error}</p>
            <Button
              onClick={fetchRooms}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 active:scale-95 transition duration-300 shadow-xl shadow-cyan-500/20"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredRooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-zinc-400 mb-2">
              {searchQuery || activeCategory !== "All"
                ? "No rooms match your filters."
                : "No rooms found."}
            </p>
            {(searchQuery || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer mt-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Room Cards */}
        {!loading && !error && filteredRooms.length > 0 && (
          <>
            <p className="text-sm text-zinc-500 mb-6">
              Showing{" "}
              <span className="text-zinc-300 font-semibold">
                {filteredRooms.length}
              </span>{" "}
              {filteredRooms.length === 1 ? "room" : "rooms"}
              {activeCategory !== "All" && (
                <span>
                  {" "}
                  in <span className="text-cyan-400">{activeCategory}</span>
                </span>
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredRooms.map((room) => (
                <PropertiesCard key={room._id} room={room} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Properties;
