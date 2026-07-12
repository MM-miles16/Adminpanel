'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import "./addcar.css";

export default function AddCar() {

  const [formData, setFormData] = useState({
    brand: "",
    carName: "",
    year: "",
    color: "",
    vehicleType: "",
    fuelType: "",
    transmission: "",
    seats: ""
  });

  const brands = [
    "Maruti Suzuki",
    "Hyundai",
    "Honda",
    "Toyota",
    "Mahindra",
    "Tata",
    "Kia",
    "MG",
    "Volkswagen",
    "Skoda",
    "Renault",
    "Nissan"
  ];

  const years = Array.from(
    { length: 6 },
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
    "Hybrid"
  ];

  const transmissions = [
    "Manual",
    "Automatic"
  ];

  

  
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

     // Later you can save to localStorage or API

    router.push("/add-car-details");
  };

  return (
    <div className="adding-car-page">

      <div className="adding-car-card">

        {/* ================= HEADER ================= */}

        <div className="adding-car-header">

          <h1 className="adding-car-title">
            Let's Start with Your Car Details
          </h1>

          <p className="adding-car-subtitle">
            These car details will be shown to users when they book your car.
          </p>

        </div>

        {/* ================= FORM ================= */}

        <form
          className="adding-car-form"
          onSubmit={handleSubmit}
        >

          {/* Car Brand */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Car Brand
            </label>

            <input
              type="text"
              name="carName"
              value={formData.carName}
              onChange={handleChange}
              placeholder="Ex: Mahindra"
              className="adding-car-input"
            />

          </div>

          {/* Car Name */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Car Name
            </label>

            <input
              type="text"
              name="carName"
              value={formData.carName}
              onChange={handleChange}
              placeholder="Enter Car Name"
              className="adding-car-input"
            />

          </div>

          {/* Car Year */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Car Year
            </label>

            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="adding-car-select"
            >

              <option value="">
                Select Car Year
              </option>

              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}

            </select>

          </div>

          {/* Color */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Color
            </label>
             
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Enter Car Color"
              className="adding-car-input"
            />
            

          </div>

          {/* Vehicle Type */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Vehicle Type
            </label>

            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="adding-car-select"
            >

              <option value="">
                Select Vehicle Type
              </option>

              {vehicleTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}

            </select>

          </div>

          {/* Fuel Type */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Fuel Type
            </label>

            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="adding-car-select"
            >

              <option value="">
                Select Fuel Type
              </option>

              {fuelTypes.map((fuel) => (
                <option
                  key={fuel}
                  value={fuel}
                >
                  {fuel}
                </option>
              ))}

            </select>

          </div>

          {/* Transmission */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              Transmission
            </label>

            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="adding-car-select"
            >

              <option value="">
                Select Transmission
              </option>

              {transmissions.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

          </div>

          {/* Seats */}

          <div className="adding-car-field">

            <label className="adding-car-label">
              No of Seats
            </label>

            <input
              type="text"
              name="Seats"
              value={formData.carName}
              onChange={handleChange}
              placeholder="Enter No of seats"
              className="adding-car-input"
            />

          </div>

          {/* BUTTON */}

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