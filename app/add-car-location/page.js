'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./addcarlocation.css";

export default function AddCarLocation() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    doorNo: "",
    street: "",
    area: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    baseDailyRate: "2000"
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("add_car_step3");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved step 3 data:", e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.city.trim()) {
      alert("Please enter the city.");
      return;
    }
    sessionStorage.setItem("add_car_step3", JSON.stringify(formData));
    router.push("/add-car-images");
  };

  return (
    <div className="adding-car-page">
      <div className="adding-car-card">
        {/* Header */}
        <div className="adding-car-header">
          <h1 className="adding-car-title">
            Location & Base Daily Rate
          </h1>
          <p className="adding-car-subtitle">
            Provide the car location address and daily rental pricing.
          </p>
        </div>

        {/* Form */}
        <form className="adding-car-form" onSubmit={handleSubmit}>
          {/* Base Daily Rate */}
          <div className="adding-car-field">
            <label className="adding-car-label">Base Daily Rate (₹)</label>
            <input
              type="number"
              name="baseDailyRate"
              placeholder="Ex: 2500"
              value={formData.baseDailyRate}
              onChange={handleChange}
              className="adding-car-input"
              required
            />
          </div>

          {/* Door No */}
          <div className="adding-car-field">
            <label className="adding-car-label">Flat or Door No</label>
            <input
              type="text"
              name="doorNo"
              placeholder="Enter Flat or Door No"
              value={formData.doorNo}
              onChange={handleChange}
              className="adding-car-input"
            />
          </div>

          {/* Street */}
          <div className="adding-car-field">
            <label className="adding-car-label">Enter Street</label>
            <input
              type="text"
              name="street"
              placeholder="Enter Street"
              value={formData.street}
              onChange={handleChange}
              className="adding-car-input"
            />
          </div>

          {/* Area */}
          <div className="adding-car-field">
            <label className="adding-car-label">Enter Area Name</label>
            <input
              type="text"
              name="area"
              placeholder="Enter Area / Hub Name"
              value={formData.area}
              onChange={handleChange}
              className="adding-car-input"
            />
          </div>

          {/* City */}
          <div className="adding-car-field">
            <label className="adding-car-label">Enter City</label>
            <input
              type="text"
              name="city"
              placeholder="Ex: Bengaluru, Chennai"
              value={formData.city}
              onChange={handleChange}
              className="adding-car-input"
              required
            />
          </div>

          {/* District */}
          <div className="adding-car-field">
            <label className="adding-car-label">Enter District</label>
            <input
              type="text"
              name="district"
              placeholder="Enter District"
              value={formData.district}
              onChange={handleChange}
              className="adding-car-input"
            />
          </div>

          {/* State */}
          <div className="adding-car-field">
            <label className="adding-car-label">Enter State</label>
            <input
              type="text"
              name="state"
              placeholder="Enter State"
              value={formData.state}
              onChange={handleChange}
              className="adding-car-input"
            />
          </div>

          {/* Pincode */}
          <div className="adding-car-field">
            <label className="adding-car-label">Enter Pincode</label>
            <input
              type="text"
              name="pincode"
              placeholder="Enter Pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="adding-car-input"
            />
          </div>

          {/* Button */}
          <div className="adding-car-bottom">
            <button type="submit" className="adding-car-btn">
              SAVE AND CONTINUE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}