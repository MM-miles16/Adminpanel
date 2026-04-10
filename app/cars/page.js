'use client'
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Cars() {

  const [selectedCar, setSelectedCar] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false); // ✅ NEW

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const cars = [
    { id: 1, name: "Maruthi suzuki swift", year: 2025, plate: "TN-11-ES-3022", status: "live" },
    { id: 2, name: "Maruthi suzuki swift", year: 2023, plate: "TN-11-ES-4444", status: "blocked" },
    { id: 3, name: "Maruthi suzuki swift", year: 2025, plate: "TN-11-ES-3022", status: "paused" },
    { id: 4, name: "Maruthi suzuki swift", year: 2025, plate: "TN-11-ES-3022", status: "maintain" },
  ];

  return (
    <div className="container">

      <h1 className="title">Cars</h1>

      <div className="cars-grid">

        {cars.map((car) => (
          <div className="car-card" key={car.id}>

            <div className="car-top-section">

              <img src="/cars.jpg" className="car-img" />

              <div className="car-right">

                <h3 className="car-title">
                  {car.name} <span>( {car.year} )</span>
                </h3>

                <span className="plate">{car.plate}</span>

                <div className="status-row">
                  <span className={`status ${car.status}`}>
                    {car.status}
                  </span>

                  <span
                    className="menu-dot"
                    onClick={() => {
                      setSelectedCar(car);
                      setActionType(null);
                    }}
                  >
                    ⋮
                  </span>
                </div>

              </div>

            </div>

            <div className="divider"></div>

            <div className="car-details">

              <div className="details-col left">
                <p><b>Host ID:</b> #24</p>
                <p><b>Host Name:</b> Harisha</p>
                <p><b>Host Phone:</b> 9945686287</p>
              </div>

              <div className="details-col right">
                <p>
                  <b>Host Address:</b> Plot No: 51, VGN Nagar phase-4,
                  No: 62, Gurusamy Road, Nolambur, Ambattur Taluk,
                  Tiruvallur district, Chennai-95, Tamilnadu
                </p>
              </div>

            </div>

          </div>
        ))}

      </div>

      {/* ================= POPUP 1 ================= */}
      {selectedCar && !actionType && (
        <div className="popup-overlay" onClick={() => setSelectedCar(null)}>

          <div className="popup-box" onClick={(e) => e.stopPropagation()}>

            <h3 className="popup-title">
              {selectedCar.name} <span>( {selectedCar.year} )</span>
            </h3>

            <div className="popup-plate">
              {selectedCar.plate}
            </div>

            <div className="popup-actions">

              <div className="popup-item">
                <img src="/block.png" />
                <span>BLOCK</span>
              </div>

              <div
                className="popup-item"
                onClick={() => setActionType("maintain")}
              >
                <img src="/maintain.png" />
                <span>MAINTAINANCE</span>
              </div>

              <div
                className="popup-item"
                onClick={() => setActionType("pause")}
              >
                <img src="/pause.png" />
                <span>PAUSE</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================= POPUP 2 ================= */}
      {selectedCar && actionType && (
        <div className="popup-overlay" onClick={() => setActionType(null)}>

          <div className="form-popup" onClick={(e) => e.stopPropagation()}>

            <div className="form-header">
              <img
                src={actionType === "pause" ? "/pause.png" : "/maintain.png"}
                className="form-icon"
              />
              <h3>{actionType === "pause" ? "PAUSE" : "MAINTAINANCE"}</h3>
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>FROM</label>
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  showTimeSelect
                  timeIntervals={60}
                  dateFormat="dd-MM-yyyy HH:mm:ss"
                  className="custom-datepicker"
                  popperClassName="custom-datepicker-popper"
                />
              </div>

              <div className="form-group">
                <label>TO</label>
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  showTimeSelect
                  timeIntervals={60}
                  dateFormat="dd-MM-yyyy HH:mm:ss"
                  className="custom-datepicker"
                  popperClassName="custom-datepicker-popper"
                />
              </div>

            </div>

            <div className="form-group full">
              <label>DESC</label>
              <input type="text" />
            </div>

            <div className="form-actions">

              <button
                className="cancel"
                onClick={() => setActionType(null)}
              >
                Cancel
              </button>

              {/* ✅ UPDATED */}
              <button
                className="submit"
                onClick={() => setShowConfirm(true)}
              >
                Submit
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= CONFIRM POPUP ================= */}
      {showConfirm && (
        <div className="popup-overlay" onClick={() => setShowConfirm(false)}>

          <div
            className="confirm-box"
            onClick={(e) => e.stopPropagation()}
          >

            <h3>SUCCESS</h3>

            <p>Request submitted successfully</p>

            <div className="confirm-details">
              <div>
                <span>FROM</span>
                <p>{fromDate.toLocaleString()}</p>
              </div>

              <div>
                <span>TO</span>
                <p>{toDate.toLocaleString()}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowConfirm(false);
                setSelectedCar(null);
                setActionType(null);
              }}
            >
              Done
            </button>

          </div>

        </div>
      )}

    </div>
  );
}