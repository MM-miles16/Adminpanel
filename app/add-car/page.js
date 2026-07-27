'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useRole } from "../../lib/RoleContext";
import "./addcar.css";
import "../add-car-flow.css";

export default function AddCar() {
  const router = useRouter();
  const { isAdmin } = useRole();

  const [formData, setFormData] = useState({
    brand: "",
    carName: "",
    year: "",
    color: "",
    vehicleType: "",
    fuelType: "",
    transmission: "",
    seats: "",
    hostId: ""
  });
  const [formError, setFormError] = useState("");
  const [hosts, setHosts] = useState([]);
  const [hostSearch, setHostSearch] = useState("");
  const [hostsLoading, setHostsLoading] = useState(false);
  const [hostsError, setHostsError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("add_car_step1");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved step 1 data:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    setHostsLoading(true);
    fetch("/api/hub/hosts")
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Unable to load hosts");
        return data.data || [];
      })
      .then((data) => active && setHosts(data))
      .catch((error) => active && setHostsError(error.message))
      .finally(() => active && setHostsLoading(false));
    return () => { active = false; };
  }, [isAdmin]);

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );

  const vehicleTypes = [
    "Hatchback",
    "Sedan",
    "SUV",
    "MUV"
  ];

  const fuelTypes = [
    "Petrol",
    "Diesel",
    "CNG",
    "Hybrid",
    "Electric"
  ];

  const transmissions = [
    "Manual",
    "Automatic"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdmin && !formData.hostId) {
      setFormError("Select the host who will own this vehicle before continuing.");
      return;
    }
    if (!formData.brand.trim() || !formData.carName.trim()) {
      setFormError("Enter the make and model to continue.");
      return;
    }
    setFormError("");
    sessionStorage.setItem("add_car_step1", JSON.stringify(formData));
    router.push("/add-car-details");
  };

  const visibleHosts = hosts.filter((host) => {
    const query = hostSearch.trim().toLowerCase();
    return !query || [host.full_name, host.phone, host.email].some((value) => value?.toLowerCase().includes(query));
  });

  return (
    <div className="adding-car-page">
      <div className="adding-car-card">
        <div className="adding-car-progress" aria-label="Step 1 of 4"><span className="active">1</span><i></i><span>2</span><i></i><span>3</span><i></i><span>4</span><b>Vehicle details</b></div>
        {/* ================= HEADER ================= */}
        <div className="adding-car-header">
          <h1 className="adding-car-title">
            Let's Start with Your Car Details
          </h1>
          <p className="adding-car-subtitle">
            Tell us about the vehicle. You can review everything before submitting it for approval.
          </p>
        </div>

        {/* ================= FORM ================= */}
        <form className="adding-car-form" onSubmit={handleSubmit}>
          {formError && <div className="adding-car-alert" role="alert">{formError}</div>}
          {isAdmin && (
            <div className="adding-car-host-picker">
              <h2>Assign vehicle to a host</h2>
              <p>Select the host account that will own and manage this car.</p>
              <input className="adding-car-input" type="search" value={hostSearch} onChange={(e) => setHostSearch(e.target.value)} placeholder="Search by host name, phone, or email" aria-label="Search hosts" />
              <select className="adding-car-select" value={formData.hostId} onChange={handleChange} name="hostId" required>
                <option value="">{hostsLoading ? "Loading hosts..." : "Select a host"}</option>
                {visibleHosts.map((host) => <option key={host.id} value={host.id}>{host.full_name} · {host.phone}</option>)}
              </select>
              {hostsError && <div className="adding-car-alert" role="alert">{hostsError}</div>}
            </div>
          )}
          {/* Car Brand */}
          <div className="adding-car-field">
            <label className="adding-car-label">Car Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Ex: Mahindra, Toyota"
              className="adding-car-input"
              required
            />
          </div>

          {/* Car Name */}
          <div className="adding-car-field">
            <label className="adding-car-label">Car Name / Model</label>
            <input
              type="text"
              name="carName"
              value={formData.carName}
              onChange={handleChange}
              placeholder="Ex: Thar, Fortuner, Innova Crysta"
              className="adding-car-input"
              required
            />
          </div>

          {/* Car Year */}
          <div className="adding-car-field">
            <label className="adding-car-label">Car Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="adding-car-select"
              required
            >
              <option value="">Select Car Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div className="adding-car-field">
            <label className="adding-car-label">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Ex: White, Black, Red"
              className="adding-car-input"
              required
            />
          </div>

          {/* Vehicle Type */}
          <div className="adding-car-field">
            <label className="adding-car-label">Vehicle Type</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="adding-car-select"
              required
            >
              <option value="">Select Vehicle Type</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Fuel Type */}
          <div className="adding-car-field">
            <label className="adding-car-label">Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="adding-car-select"
              required
            >
              <option value="">Select Fuel Type</option>
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div className="adding-car-field">
            <label className="adding-car-label">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="adding-car-select"
              required
            >
              <option value="">Select Transmission</option>
              {transmissions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Seats */}
          <div className="adding-car-field">
            <label className="adding-car-label">No of Seats</label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              placeholder="Enter No of seats (e.g. 5, 7)"
              className="adding-car-input"
              min="2"
              max="15"
              required
            />
          </div>

          {/* BUTTON */}
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
