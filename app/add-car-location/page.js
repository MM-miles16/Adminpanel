'use client'

import { useState } from "react";
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
    pincode: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // Next Step
    router.push("/add-car-images");
  };

  return (
    <div className="adding-car-page">

      <div className="adding-car-card">

        {/* Header */}

        <div className="adding-car-header">

          <h1 className="adding-car-title">
            Tell Us Where Your Car Is Located
          </h1>

          <p className="adding-car-subtitle">
            These car address will be shown to users when they book your car.
          </p>

        </div>

        {/* Form */}

        <form
          className="adding-car-form"
          onSubmit={handleSubmit}
        >

          {/* Left */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Flat or Door No
            </label>

            <input
              type="text"
              name="doorNo"
              placeholder="Enter Flat or Door No"
              value={formData.doorNo}
              onChange={handleChange}
              className="adding-car-input"
            />

          </div>

          {/* Right */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Enter Street
            </label>

            <input
              type="text"
              name="street"
              placeholder="Enter Street"
              value={formData.street}
              onChange={handleChange}
              className="adding-car-input"
            />

          </div>

          {/* Left */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Enter Area Name
            </label>

            <input
              type="text"
              name="area"
              placeholder="Enter Area"
              value={formData.area}
              onChange={handleChange}
              className="adding-car-input"
            />

          </div>

          {/* Right */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Enter City
            </label>

            <input
              type="text"
              name="city"
              placeholder="Enter City"
              value={formData.city}
              onChange={handleChange}
              className="adding-car-input"
            />

          </div>

          {/* Left */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Enter District
            </label>

            <input
              type="text"
              name="district"
              placeholder="Enter District"
              value={formData.district}
              onChange={handleChange}
              className="adding-car-input"
            />

          </div>

          {/* Right */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Enter State
            </label>

            <input
              type="text"
              name="state"
              placeholder="Enter State"
              value={formData.state}
              onChange={handleChange}
              className="adding-car-input"
            />

          </div>

          {/* Left */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Enter Pincode
            </label>

            <input
              type="number"
              name="pincode"
              placeholder="Enter Pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="adding-car-input"
            />

          </div>

          {/* Empty Grid Item */}

          <div></div>

          {/* Button */}

          <div className="adding-car-bottom">

            <button
              type="submit"
              className="adding-car-btn"
            >
              SAVE AND CONTINUE
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}