'use client'

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Maintainance() {

  const [selectedCar, setSelectedCar] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [data, setData] = useState([
    { id: 1, car: "KA16ES3033", model: "Innova crysta", color: "White" },
    { id: 2, car: "KA16ES3033", model: "Innova crysta", color: "White" },
    { id: 3, car: "KA16ES3033", model: "Innova crysta", color: "White" },
    { id: 5, car: "KA16ES3033", model: "Innova crysta", color: "White" },
    { id: 6, car: "KA16ES3033", model: "Innova crysta", color: "White" },
    { id: 4, car: "KA16ES3033", model: "Innova crysta", color: "White" }
  ]);

  /* DELETE DIRECTLY */
  const handleDelete = () => {
    setData(prev => prev.filter(item => item.id !== selectedCar.id));
    setSelectedCar(null);

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <div className="maint2-container">

      <h1 className="maint2-title">Maintainance</h1>

      {/* TOP */}
      <div className="maint2-top-bar">
        <div className="maint2-search">
          <input placeholder="Type name, number plate, etc" />
          <span>🔍</span>
        </div>

        <button className="maint2-btn add">ADD CARS</button>
      </div>

      {/* LIST */}
      <div className="maint2-list">

        {data.map((item, index) => (
          <div className="maint2-row" key={item.id}>

            <div className="maint2-grid">
              <span className="maint2-gridp">{index + 1}.</span>
              <span className="maint2-gridp">{item.car}</span>
              <span className="maint2-gridp">{item.model}</span>
              <span className="maint2-gridp">{item.color}</span>
            </div>

            <div className="maint2-actions">
              <button
                className="maint2-btn"
                onClick={() => {
                  setSelectedCar(item);
                  setFromDate(null);
                  setToDate(null);
                }}
              >
                View Dates
              </button>

              <button className="maint2-btn">Contact Host</button>
            </div>

          </div>
        ))}

      </div>

      {/* ================= MAIN POPUP ================= */}
      {selectedCar && (
        <div
          className="maint2-popup-overlay"
          onClick={() => setSelectedCar(null)}
        >

          <div
            className="maint2-popup-box"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="maint2-popup-content">

              <h3 className="maint2-popup-title">
                Car Number : <span>{selectedCar.car}</span>
              </h3>

              <div className="maint2-date-row">

                <div className="maint2-date-field">
                  <label>FROM</label>
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    showTimeSelect
                    timeIntervals={5}
                    dateFormat="dd-MM-yyyy HH:mm:ss"
                    placeholderText="Start Date"
                    className="custom-datepicker"
                    popperClassName="custom-datepicker-popper"
                  />
                </div>

                <div className="maint2-date-field">
                  <label>TO</label>
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    showTimeSelect
                    timeIntervals={5}
                    dateFormat="dd-MM-yyyy HH:mm:ss"
                    placeholderText="End Date"
                    className="custom-datepicker"
                    popperClassName="custom-datepicker-popper"
                  />
                </div>

              </div>

              <div className="maint2-popup-buttons">

                <button
                  className="maint2-btn danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>

                <button
                  className="maint2-btn cancel"
                  onClick={() => setSelectedCar(null)}
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================= SUCCESS POPUP ================= */}
      {showSuccess && (
        <div className="maint2-popup-overlay">

          <div className="maint2-popup-box small">

            <div className="maint2-popup-content center success-box">

              <div className="success-icon">✔</div>

              <h3 className="maint2-popup-title success-text">
                Successfully Deleted
              </h3>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}