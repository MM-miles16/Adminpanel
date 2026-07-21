'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./addcardetails.css";

export default function AddCarDetails() {
  const router = useRouter();

  const [form, setForm] = useState({
    mileage: "",
    engineCC: "",
    registration: "",
    airbags: "",
    description: ""
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("add_car_step2");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved step 2 data:", e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.registration.trim()) {
      alert("Please enter the car registration number.");
      return;
    }
    sessionStorage.setItem("add_car_step2", JSON.stringify(form));
    router.push("/add-car-location");
  };

  return (
    <div className="adding-car-page">
      <div className="adding-car-card">
        <div className="adding-car-header">
          <h1 className="adding-car-title">
            Technical & Registration Details
          </h1>
          <p className="adding-car-subtitle">
            Provide specs and registration number for your vehicle.
          </p>
        </div>

        <form className="adding-car-form" onSubmit={handleSubmit}>
          <div className="adding-car-field">
            <label className="adding-car-label">Car Mileage (kmpl)</label>
            <input
              type="text"
              name="mileage"
              placeholder="Ex: 16 kmpl"
              className="adding-car-input"
              onChange={handleChange}
              value={form.mileage}
              required
            />
          </div>

          <div className="adding-car-field">
            <label className="adding-car-label">Engine CC</label>
            <input
              type="text"
              name="engineCC"
              placeholder="Ex: 1497 cc"
              className="adding-car-input"
              onChange={handleChange}
              value={form.engineCC}
            />
          </div>

          <div className="adding-car-field">
            <label className="adding-car-label">Car Registration Number</label>
            <input
              type="text"
              name="registration"
              placeholder="Ex: KA09UV3456"
              className="adding-car-input"
              onChange={handleChange}
              value={form.registration}
              required
            />
          </div>

          <div className="adding-car-field">
            <label className="adding-car-label">No of Airbags</label>
            <input
              type="number"
              name="airbags"
              placeholder="Ex: 6"
              className="adding-car-input"
              onChange={handleChange}
              value={form.airbags}
            />
          </div>

          <div className="adding-car-field" style={{ gridColumn: "1 / -1" }}>
            <label className="adding-car-label">Car Description</label>
            <textarea
              name="description"
              maxLength={300}
              rows={4}
              className="adding-car-description"
              placeholder="Write about your car (Maximum 300 characters)"
              onChange={handleChange}
              value={form.description}
            />
            <div className="adding-car-counter">
              {form.description.length}/300
            </div>
          </div>

          <div className="adding-car-bottom">
            <button className="adding-car-btn" type="submit">
              SAVE AND CONTINUE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}