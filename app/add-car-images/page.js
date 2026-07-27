'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./addcarimages.css";
import "../add-car-flow.css";

export default function AddCarImages() {
  const router = useRouter();

  const [agree, setAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [images, setImages] = useState({
    main: null,
    front: null,
    back: null,
    side: null,
    inside: null
  });

  const [preview, setPreview] = useState({
    main: "",
    front: "",
    back: "",
    side: "",
    inside: ""
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => () => {
    Object.values(preview).forEach((url) => url && URL.revokeObjectURL(url));
  }, [preview]);

  const handleImage = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Choose an image file (JPG, PNG, or WebP).");
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFormError("Each image must be 10 MB or smaller.");
      e.target.value = "";
      return;
    }

    setFormError("");
    if (preview[key]) URL.revokeObjectURL(preview[key]);

    setImages((prev) => ({
      ...prev,
      [key]: file
    }));

    setPreview((prev) => ({
      ...prev,
      [key]: URL.createObjectURL(file)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!images.main) {
      setFormError("Add a main cover image before submitting your vehicle.");
      return;
    }
    if (!agree) {
      setFormError("Confirm that the vehicle insurance is active before submitting.");
      return;
    }

    // Retrieve saved steps from sessionStorage
    const step1Raw = sessionStorage.getItem("add_car_step1");
    const step2Raw = sessionStorage.getItem("add_car_step2");
    const step3Raw = sessionStorage.getItem("add_car_step3");

    if (!step1Raw || !step2Raw || !step3Raw) {
      setFormError("Your saved details are incomplete. Please start again from vehicle details.");
      router.push("/add-car");
      return;
    }

    try {
      const step1 = JSON.parse(step1Raw);
      const step2 = JSON.parse(step2Raw);
      const step3 = JSON.parse(step3Raw);

      setIsSubmitting(true);

      const formData = new FormData();

      // Step 1 fields
      formData.append("make", step1.brand || "");
      formData.append("model", step1.carName || "");
      formData.append("model_year", step1.year || new Date().getFullYear().toString());
      formData.append("color", step1.color || "");
      formData.append("vehicle_type", step1.vehicleType || "SUV");
      formData.append("fuel_type", step1.fuelType || "Petrol");
      formData.append("transmission_type", step1.transmission || "Manual");
      formData.append("seating_capacity", step1.seats || "5");
      if (step1.hostId) formData.append("host_id", step1.hostId);

      // Step 2 fields
      formData.append("mileage_kmpl", step2.mileage || "15");
      formData.append("registration_number", step2.registration || "");
      formData.append("description", step2.description || "");
      if (step2.baseDailyRate) formData.append("base_daily_rate", step2.baseDailyRate);

      // Step 3 fields
      formData.append("city", step3.city || "Bengaluru");
      formData.append("door_no", step3.doorNo || "");
      formData.append("street", step3.street || "");
      formData.append("area", step3.area || "");
      formData.append("district", step3.district || "");
      formData.append("state", step3.state || "");
      formData.append("pincode", step3.pincode || "");
      formData.append(
        "location_name",
        [step3.doorNo, step3.street, step3.area, step3.city, step3.district, step3.state, step3.pincode]
          .filter(Boolean)
          .join(", ") || "Hub Location"
      );

      // Image files
      if (images.main) formData.append("main", images.main);
      if (images.front) formData.append("front", images.front);
      if (images.back) formData.append("rear", images.back); // map back to rear
      if (images.side) formData.append("side", images.side);
      if (images.inside) formData.append("interior", images.inside); // map inside to interior

      const res = await fetch("/api/hub/cars/add", {
        method: "POST",
        body: formData
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        // Clear wizard state
        sessionStorage.removeItem("add_car_step1");
        sessionStorage.removeItem("add_car_step2");
        sessionStorage.removeItem("add_car_step3");

        setShowSuccess(true);
        setTimeout(() => {
          router.push("/cars");
        }, 2200);
      } else {
        setFormError(data.error || "We could not add this vehicle. Your details and photos are still here, so you can try again.");
      }
    } catch (err) {
      console.error("Add vehicle submit error:", err);
      setFormError("The upload could not reach the server. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const UploadBox = (title, key, required = false) => (
    <div className="adding-car-upload-field">
      <label className="adding-car-label">{title}{required && <span className="adding-car-required">Required</span>}</label>
      <label className="adding-car-upload-box">
        {preview[key] ? (
          <img src={preview[key]} className="adding-car-preview" alt={`${title} preview`} />
        ) : (
          <>
            <div className="adding-car-upload-icon">☁</div>
            <span className="adding-car-upload-btn">Upload File</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleImage(e, key)}
        />
      </label>
    </div>
  );

  return (
    <div className="adding-car-page">
      <div className="adding-car-card">
        <div className="adding-car-progress" aria-label="Step 4 of 4"><span className="complete">1</span><i className="complete"></i><span className="complete">2</span><i className="complete"></i><span className="complete">3</span><i className="complete"></i><span className="active">4</span><b>Photos and submission</b></div>
        <div className="adding-car-header">
          <h1 className="adding-car-title">Provide Your Vehicle Photos</h1>
          <p className="adding-car-subtitle">
            Add a clear cover photo and any additional angles you have. Your car stays unavailable until an admin reviews and prices it.
          </p>
        </div>

        <form className="adding-car-form" onSubmit={handleSubmit}>
          {formError && <div className="adding-car-alert" role="alert">{formError}</div>}
          {UploadBox("Add Main Cover Image", "main", true)}
          {UploadBox("Add Front Car Image", "front")}
          {UploadBox("Add Back Car Image", "back")}
          {UploadBox("Add Side Car Image", "side")}
          {UploadBox("Add Inside Car Image", "inside")}

          <div className="adding-car-terms">
            <label>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                I agree to the Company's Terms & Conditions and confirm that my car insurance is active and valid.
              </span>
            </label>
          </div>

          <div className="adding-car-bottom">
            <button className="adding-car-back" type="button" disabled={isSubmitting} onClick={() => router.back()}>Back</button>
            <button
              type="submit"
              className="adding-car-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "UPLOADING & SAVING..." : "FINALIZE AND ADD"}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className="adding-car-success-overlay">
          <div className="adding-car-success-box">
            <div className="adding-car-success-icon">✓</div>
            <h2 className="adding-car-success-h">Car Added Successfully</h2>
            <p className="adding-car-success-p">
              Your vehicle has been added successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
