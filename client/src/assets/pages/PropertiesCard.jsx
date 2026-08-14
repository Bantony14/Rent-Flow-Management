import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import Button from "../components/MyButton";

const PropertiesCard = ({ room }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = room?.roomImage || [];

  const nextImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/40 hover:border-cyan-500/40 hover:bg-zinc-900/60 transition duration-300 group">
      {/* Image with Carousel */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {images.length > 0 ? (
          <img
            src={images[currentImage]?.secure_url}
            alt={`${room.room} - ${currentImage + 1}`}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600 text-sm">
            No Image
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Carousel Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setCurrentImage(index);
                }}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentImage
                    ? "w-5 h-1.5 bg-cyan-400"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
            {currentImage + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {room.room}
          </h3>
          <span
            className={`shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
              room.Avaliablity
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {room.Avaliablity ? <Check size={12} /> : <X size={12} />}
            {room.Avaliablity ? "Available" : "Occupied"}
          </span>
        </div>

        <p className="text-zinc-500 text-sm mb-1 font-medium">
          {room.buildingName}
        </p>
        <p className="text-zinc-600 text-xs line-clamp-1 mb-4">
          {room.address}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-zinc-800">
          <h4 className="text-lg sm:text-xl font-black text-cyan-400 whitespace-nowrap">
            ₹{room.rent?.toLocaleString("en-IN")}
            <span className="text-zinc-500 text-xs font-medium">/mo</span>
          </h4>
          <Link to={`/room/${room._id}`} className="w-full sm:w-auto">
            <Button className="w-full px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium hover:scale-105 active:scale-95 transition duration-300 whitespace-nowrap">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertiesCard;
