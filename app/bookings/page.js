'use client'

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Bookings() {

  const [viewBooking, setViewBooking] = useState(null);
  const [extendBooking, setExtendBooking] = useState(null);
  const [successPopup, setSuccessPopup] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const bookings = [
    {
      id: 1,
      name: "Harish",
      phone: "9945686287",
      duration: "32hours",
      car: "KA16ES3033",
      price: "Rs. 2999",
      status: "completed"
    },
    {
      id: 2,
      name: "Dilip",
      phone: "9945686287",
      duration: "22hours",
      car: "KA16ES3022",
      price: "Rs. 2099",
      status: "ongoing"
    },
    {
      id: 3,
      name: "Tushara",
      phone: "9945686287",
      duration: "14hours",
      car: "TN16ES3022",
      price: "Rs. 1099",
      status: "in2days"
    }
  ];

  return (
    <div className="booking-container">

      <h1 className="booking-title">Bookings</h1>

      {/* SEARCH */}
      <div className="booking-search">
        <input placeholder="Type name, number plate, etc" />
        <span>🔍</span>
      </div>

      {/* LIST */}
      <div className="booking-list">

        {bookings.map((b, index) => (
          <div className="booking-row" key={b.id}>

            {/* LEFT */}
            <div className="booking-left">
              <span className="col index">{index + 1}.</span>
              <span className="col name">{b.name}</span>
              <span className="col phone">{b.phone}</span>
              <span className="col duration">{b.duration}</span>
              <span className="col car">{b.car}</span>
              <span className="col price">{b.price}</span>
            </div>

            {/* RIGHT */}
            <div className="booking-actions">

              {/* VIEW DATE */}
              <button
                className="btn view"
                onClick={() => {
                  setViewBooking(b);
                  setFromDate(null);
                  setToDate(null);
                }}
              >
                View Date
              </button>

              {/* EXTEND */}
              {b.status !== "completed" && (
                <button
                  className="btn extend"
                  onClick={() => {
                    setExtendBooking(b);
                    setFromDate(null);
                    setToDate(null);
                  }}
                >
                  EXTEND
                </button>
              )}

              <button className={`btn status ${b.status}`}>
                {b.status === "completed"
                  ? "Finished"
                  : b.status === "ongoing"
                  ? "Ongoing"
                  : "Upcoming"}
              </button>

              <button className="btn contact">Contact Host</button>

            </div>

          </div>
        ))}

      </div>

      {/* ================= VIEW POPUP ================= */}
      {viewBooking && (
        <div className="popup-overlay" onClick={() => setViewBooking(null)}>
          <div
            className="popup-box date-view-popup"
            onClick={(e) => e.stopPropagation()}
          >

            <h3 className="popup-title">
              Car Number : <span>{viewBooking.car}</span>
            </h3>

            <div className="date-row">

              <div className="date-field">
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
                  isClearable
                />
              </div>

              <div className="date-field">
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
                  isClearable
                />
              </div>

            </div>

            <div className="popup-buttons">
              <button
                className="btn cancel"
                onClick={() => setViewBooking(null)}
              >
                Cancel
              </button>

              <button className="btn delete">
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= EXTEND POPUP ================= */}
      {extendBooking && (
        <div className="popup-overlay" onClick={() => setExtendBooking(null)}>
          <div
            className="popup-box date-view-popup"
            onClick={(e) => e.stopPropagation()}
          >

            <h3 className="popup-title">
              Car Number : <span>{extendBooking.car}</span>
            </h3>

            <div className="date-row">

              <div className="date-field">
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

              <div className="date-field">
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

            <div className="popup-buttons">

              {/* GOLD EXTEND */}
              <button
                className="btn extend-btn"
                onClick={() => {
                  setExtendBooking(null);
                  setSuccessPopup(true);

                  setTimeout(() => {
                    setSuccessPopup(false);
                  }, 2000);
                }}
              >
                Extend
              </button>

              <button
                className="btn cancel"
                onClick={() => setExtendBooking(null)}
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= SUCCESS POPUP ================= */}
      {successPopup && (
        <div className="popup-overlay">
          <div className="popup-box success-popup">
            <h3 className="success-text">
              Successfully Extended the Car
            </h3>
          </div>
        </div>
      )}

    </div>
  )
}