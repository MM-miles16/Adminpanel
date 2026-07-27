'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./addcarlocation.css";
import "../add-car-flow.css";

export default function AddCarLocation() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    doorNo: "",
    street: "",
    area: "",
    city: "",
    district: "",
    state: "",
    pincode: ""
  });
  const [formError, setFormError] = useState("");

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
    if (!formData.area.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      setFormError("Enter the area, city, and pincode so we can place the vehicle accurately.");
      return;
    }
    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      setFormError("Enter a valid 6-digit pincode.");
      return;
    }
    setFormError("");
    sessionStorage.setItem("add_car_step3", JSON.stringify(formData));
    router.push("/add-car-images");
  };

  return (
    <div className="adding-car-page">
      <div className="adding-car-card">
        <div className="adding-car-progress" aria-label="Step 3 of 4"><span className="complete">1</span><i className="complete"></i><span className="complete">2</span><i className="complete"></i><span className="active">3</span><i></i><span>4</span><b>Location</b></div>
        {/* Header */}
        <div className="adding-car-header">
          <h1 className="adding-car-title">
            Location Details
          </h1>
          <p className="adding-car-subtitle">
            Use the full pickup address. It is used to place this car correctly, even when several cars are in the same city.
          </p>
        </div>

        {/* Form */}
        <form className="adding-car-form" onSubmit={handleSubmit}>
          {formError && <div className="adding-car-alert" role="alert">{formError}</div>}
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
              autoComplete="address-line1"
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
              autoComplete="address-line2"
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
              autoComplete="address-level2"
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
              autoComplete="address-level1"
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
              autoComplete="address-level1"
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
              autoComplete="address-level1"
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
              inputMode="numeric"
              maxLength="6"
              pattern="[0-9]{6}"
              autoComplete="postal-code"
            />
          </div>

          {/* Button */}
          <div className="adding-car-bottom">
            <button className="adding-car-back" type="button" onClick={() => router.back()}>Back</button>
            <button type="submit" className="adding-car-btn">
              SAVE AND CONTINUE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
