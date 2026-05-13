'use client'
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

export default function OfflineBooking() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [extendBooking, setExtendBooking] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // ADD OFFLINE BOOKING STATE
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [allCars, setAllCars] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [addFromDate, setAddFromDate] = useState(new Date());
  const [addToDate, setAddToDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLogs = async (isManual = false, targetPage = 1) => {
    if (isManual) setIsRefreshing(true);
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch(`/api/hub/bookings?reason=OFFLINE BOOKING&page=${targetPage}&limit=10&t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        const now = new Date();
        const mappedLogs = (json.bookings || []).map(b => {
          const start = new Date(b.start_time.replace(/[Z+].*$/, ''));
          const end = new Date(b.end_time.replace(/[Z+].*$/, ''));
          
          let calculatedStatus = 'upcoming';
          if (now > end) {
            calculatedStatus = 'completed';
          } else if (now >= start && now <= end) {
            calculatedStatus = 'ongoing';
          }

          return {
            id: b.id,
            car: b.vehicles?.registration_number || 'N/A',
            model: `${b.vehicles?.make} ${b.vehicles?.model}`,
            start_time: b.start_time,
            end_time: b.end_time,
            status: calculatedStatus
          };
        });
        setLogs(mappedLogs);
        setPage(targetPage);
        setHasMore(json.hasMore);
        sessionStorage.setItem('ap_offline_bookings', JSON.stringify({
          data: mappedLogs,
          page: targetPage,
          hasMore: json.hasMore
        }));
        if (isManual) toast.success("Logs updated");
      }
    } catch (error) {
      console.error("Failed to fetch offline bookings:", error);
    } finally {
      setIsLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  };

  const fetchAllCars = async () => {
    try {
      const res = await fetch('/api/hub/cars');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setAllCars(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch cars:", err);
    }
  };

  const handleCreateOfflineBooking = async () => {
    if (!selectedVehicleId) {
      toast.error("Please select a vehicle");
      return;
    }
    if (addToDate <= addFromDate) {
      toast.error("End time must be after start time");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem("admin_token");
      
      // Format to YYYY-MM-DDTHH:MM for the API's toFaceValueISO
      const formatLocal = (date) => {
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
      };

      const res = await fetch("/api/hub/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicle_id: selectedVehicleId,
          reason: "OFFLINE BOOKING",
          start_time: formatLocal(addFromDate),
          end_time: formatLocal(addToDate),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Offline booking created!");
        setShowAddPopup(false);
        fetchLogs(true, 1);
      } else {
        toast.error(data.error || "Failed to create booking");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const cached = sessionStorage.getItem('ap_offline_bookings');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setLogs(parsed.data || []);
        setPage(parsed.page || 1);
        setHasMore(parsed.hasMore || false);
        setIsLoading(false);
        fetchLogs(false, parsed.page || 1);
      } catch (e) {
        fetchLogs(false, 1);
      }
    } else {
      fetchLogs(false, 1);
    }
  }, []);

  const handleDelete = async () => {
    if (!selectedCar) return;
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch(`/api/hub/bookings?id=${selectedCar.id}&reason=OFFLINE BOOKING`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setLogs(prev => prev.filter(item => item.id !== selectedCar.id));
        setSelectedCar(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        toast.success("Offline booking deleted successfully");
      } else {
        toast.error("Failed to delete booking");
      }
    } catch (error) {
      toast.error("Error deleting booking");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    fetchLogs(true, newPage);
  };

  return (
    <div className="maint2-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="maint2-title" style={{ margin: 0 }}>Offline</h1>
        <button 
          onClick={() => fetchLogs(true, page)} 
          disabled={isRefreshing}
          style={{
            backgroundColor: '#c6a76e',
            color: 'black',
            borderRadius: '18px',
            padding: '6px 16px',
            fontSize: '12px',
            border: 'none',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            opacity: isRefreshing ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isRefreshing ? (
            <>
              <span className="spinner"></span>
              Syncing Database...
            </>
          ) : (
            '↻ Refresh Dashboard'
          )}
        </button>
      </div>

      <style jsx>{`
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #000;
          border-bottom-color: transparent;
          border-radius: 50%;
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* TOP */}
      <div className="maint2-top-bar">
        <div className="maint2-search">
          <input placeholder="Type name, number plate, etc" />
          <span>🔍</span>
        </div>
        <button 
          className="maint2-btn add" 
          onClick={() => {
            setShowAddPopup(true);
            if (allCars.length === 0) fetchAllCars();
          }}
        >
          ADD
        </button>
      </div>

      {/* ================= ADD POPUP ================= */}
      {showAddPopup && (
        <div className="popup-overlay" onClick={() => setShowAddPopup(false)}>
          <div className="form-popup" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <img src="/pause.png" className="form-icon" />
              <h3>OFFLINE BOOKING</h3>
            </div>
            <div className="form-group full">
              <label>SELECT VEHICLE</label>
              <select 
                value={selectedVehicleId} 
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="custom-select"
              >
                <option value="">Select a car...</option>
                {allCars.map(car => (
                  <option key={car.id} value={car.id}>
                    {car.make} {car.model} ({car.registration_number})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>FROM</label>
                <DatePicker
                  selected={addFromDate}
                  onChange={(date) => setAddFromDate(date)}
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
                  selected={addToDate}
                  onChange={(date) => setAddToDate(date)}
                  showTimeSelect
                  timeIntervals={60}
                  dateFormat="dd-MM-yyyy HH:mm:ss"
                  className="custom-datepicker"
                  popperClassName="custom-datepicker-popper"
                />
              </div>
            </div>
            <div className="form-group full">
              <label>REASON</label>
              <div style={{ 
                background: '#d4edda', 
                color: '#155724', 
                padding: '10px', 
                borderRadius: '8px', 
                fontSize: '12px', 
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #c3e6cb'
              }}>
                📅 OFFLINE BOOKING
              </div>
            </div>
            <div className="form-actions">
              <button className="cancel" onClick={() => setShowAddPopup(false)}>Cancel</button>
              <button 
                className="submit" 
                onClick={handleCreateOfflineBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="maint2-list">
        {isLoading ? (
          <p style={{ padding: "20px" }}>Loading logs...</p>
        ) : logs.length === 0 ? (
          <p style={{ padding: "20px" }}>No offline bookings found.</p>
        ) : (
          <>
            {logs.map((item, index) => (
              <div className="maint2-row" key={item.id}>
                <div className="maint2-grid" style={{ gridTemplateColumns: '40px 140px 1fr' }}>
                  <span className="maint2-gridp">{(page - 1) * 10 + index + 1}.</span>
                  <span className="maint2-gridp">{item.car}</span>
                  <span className="maint2-gridp">{item.model}</span>
                </div>
                <div className="maint2-actions" style={{ gap: '10px' }}>
                  <button
                    className="btn view"
                    onClick={() => {
                      setSelectedCar(item);
                      setFromDate(new Date(item.start_time.replace(/[Z+].*$/, '')));
                      setToDate(new Date(item.end_time.replace(/[Z+].*$/, '')));
                    }}
                  >
                    View Date
                  </button>

                  {item.status !== "completed" && (
                    <button
                      className="btn extend"
                      onClick={() => {
                        setExtendBooking(item);
                        setFromDate(new Date(item.start_time.replace(/[Z+].*$/, '')));
                        setToDate(new Date(item.end_time.replace(/[Z+].*$/, '')));
                      }}
                    >
                      EXTEND
                    </button>
                  )}

                  <button className={`btn status ${item.status}`}>
                    {item.status === "completed"
                      ? "Finished"
                      : item.status === "ongoing"
                      ? "Ongoing"
                      : "Upcoming"}
                  </button>

                  <button className="maint2-btn">Call Host</button>
                </div>
              </div>
            ))}

            {(page > 1 || hasMore) && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '0px', padding: '15px 0' }}>
                <button 
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isRefreshing}
                  style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #c6a76e', background: 'transparent', color: '#333', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, fontWeight: '500' }}
                >
                  Previous
                </button>
                <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>Page {page}</span>
                <button 
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!hasMore || isRefreshing}
                  style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #c6a76e', background: 'transparent', color: '#333', cursor: !hasMore ? 'not-allowed' : 'pointer', opacity: !hasMore ? 0.5 : 1, fontWeight: '500' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= VIEW POPUP ================= */}
      {selectedCar && (
        <div className="maint2-popup-overlay" onClick={() => setSelectedCar(null)}>
          <div className="maint2-popup-box" onClick={(e) => e.stopPropagation()}>
            <div className="maint2-popup-content">
              <h3 className="maint2-popup-title">Car Number : <span>{selectedCar.car}</span></h3>
              <div className="maint2-date-row">
                <div className="maint2-date-field">
                  <label>FROM</label>
                  <div className="custom-datepicker-display">
                    {fromDate ? fromDate.toLocaleString() : 'N/A'}
                  </div>
                </div>
                <div className="maint2-date-field">
                  <label>TO</label>
                  <div className="custom-datepicker-display">
                    {toDate ? toDate.toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
              <div className="maint2-popup-buttons">
                <button className="maint2-btn danger" onClick={handleDelete}>Delete Log</button>
                <button className="maint2-btn cancel" onClick={() => setSelectedCar(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= EXTEND POPUP ================= */}
      {extendBooking && (
        <div className="maint2-popup-overlay" onClick={() => setExtendBooking(null)}>
          <div className="maint2-popup-box" onClick={(e) => e.stopPropagation()}>
            <div className="maint2-popup-content">
              <h3 className="maint2-popup-title">Car Number : <span>{extendBooking.car}</span></h3>
              <div className="maint2-date-row">
                <div className="maint2-date-field">
                  <label>FROM</label>
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    showTimeSelect
                    timeIntervals={5}
                    dateFormat="dd-MM-yyyy HH:mm:ss"
                    className="custom-datepicker"
                    popperClassName="custom-datepicker-popper"
                    disabled
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
                    className="custom-datepicker"
                    popperClassName="custom-datepicker-popper"
                  />
                </div>
              </div>
              <div className="maint2-popup-buttons">
                <button
                  className="btn extend-btn"
                  disabled={isRefreshing}
                  onClick={async () => {
                    if (!toDate || toDate <= new Date(extendBooking.end_time.replace(/[Z+].*$/, ''))) {
                      toast.error("Please select a future end time");
                      return;
                    }

                    setIsRefreshing(true);
                    try {
                      const token = sessionStorage.getItem("admin_token");
                      const res = await fetch("/api/hub/bookings/extend", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          bookingId: extendBooking.id,
                          newEndTime: formatLocal(toDate),
                          type: 'offline'
                        }),
                      });

                      const data = await res.json();
                      if (res.ok) {
                        toast.success("Booking extended successfully!");
                        setExtendBooking(null);
                        fetchLogs(true, page);
                      } else {
                        toast.error(data.error || "Failed to extend booking");
                      }
                    } catch (err) {
                      toast.error("Network error");
                    } finally {
                      setIsRefreshing(false);
                    }
                  }}
                >
                  {isRefreshing ? "Extending..." : "Extend"}
                </button>
                <button className="maint2-btn cancel" onClick={() => setExtendBooking(null)}>Cancel</button>
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
              <h3 className="maint2-popup-title success-text">Successfully Deleted</h3>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-datepicker-display {
          background: #e8e6e1;
          padding: 10px 12px;
          border-radius: 8px;
          color: #333;
          font-size: 14px;
          font-weight: 500;
          width: 100%;
          box-sizing: border-box;
        }
        .custom-select {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: none;
          background: #e5e2dc;
          color: #1a1a1a;
          font-size: 14px;
          font-family: poppins;
          font-weight: 500;
          outline: none;
        }
      `}</style>
    </div>
  )
}