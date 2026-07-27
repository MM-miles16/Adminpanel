'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./addcardetails.css";
import "../add-car-flow.css";

export default function AddCarDetails() {
  const router = useRouter();

  const [form, setForm] = useState({
    mileage: "",
    engineCC: "",
    registration: "",
    airbags: "",
    description: "",
    baseDailyRate: ""
  });
  const [formError, setFormError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

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

  useEffect(() => {
    try {
      setIsAdmin(JSON.parse(sessionStorage.getItem("admin_info") || "{}").role === "admin");
    } catch {
      setIsAdmin(false);
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
      setFormError("Enter the vehicle registration number to continue.");
      return;
    }
    if (isAdmin && (!form.baseDailyRate || Number(form.baseDailyRate) <= 0)) {
      setFormError("Enter a valid base daily price for this vehicle.");
      return;
    }
    setFormError("");
    sessionStorage.setItem("add_car_step2", JSON.stringify(form));
    router.push("/add-car-location");
  };

  return (
    <div className="adding-car-page">
      <div className="adding-car-card">
        <div className="adding-car-progress" aria-label="Step 2 of 4"><span className="complete">1</span><i className="complete"></i><span className="active">2</span><i></i><span>3</span><i></i><span>4</span><b>Registration</b></div>
        <div className="adding-car-header">
          <h1 className="adding-car-title">
            Technical & Registration Details
          </h1>
          <p className="adding-car-subtitle">
            Provide specs and registration number for your vehicle.
          </p>
        </div>

        <form className="adding-car-form" onSubmit={handleSubmit}>
          {formError && <div className="adding-car-alert" role="alert">{formError}</div>}
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

          {isAdmin && (
            <div className="adding-car-field">
              <label className="adding-car-label">Base Daily Price (Rs.)</label>
              <input type="number" name="baseDailyRate" min="1" step="1" inputMode="numeric" placeholder="Ex: 1800" className="adding-car-input" onChange={handleChange} value={form.baseDailyRate || ""} required />
            </div>
          )}

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
            <button className="adding-car-back" type="button" onClick={() => router.back()}>Back</button>
            <button className="adding-car-btn" type="submit">
              SAVE AND CONTINUE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
