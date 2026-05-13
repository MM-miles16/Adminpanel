'use client'
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

export default function Bookings() {
  const [viewBooking, setViewBooking] = useState(null);
  const [extendBooking, setExtendBooking] = useState(null);
  const [successPopup, setSuccessPopup] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchBookings = async (isManual = false, targetPage = 1) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/hub/bookings/list?page=${targetPage}&limit=10&t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const now = new Date();
          const mappedBookings = json.data.map(b => {
            const start = new Date(b.start_time.replace(/[Z+].*$/, ''));
            const end = new Date(b.end_time.replace(/[Z+].*$/, ''));
            
            const diffInMs = end - start;
            const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60));
            
            const days = Math.floor(diffInHours / 24);
            const remainingHours = diffInHours % 24;
            let durationStr = '';
            if (days > 0) durationStr += `${days}d `;
            if (remainingHours > 0 || days === 0) durationStr += `${remainingHours}h`;

            let calculatedStatus = 'upcoming';
            if (b.status === 'completed' || b.status === 'cancelled' || now > end) {
              calculatedStatus = 'completed';
            } else if (now >= start && now <= end) {
              calculatedStatus = 'ongoing';
            }

            return {
              id: b.id,
              name: `${b.first_name || ''} ${b.last_name || ''}`.trim() || 'Unknown',
              phone: b.phone || 'N/A',
              duration: durationStr.trim(),
              car: b.registration_number || 'N/A',
              price: `Rs. ${b.total_amount || 0}`,
              status: calculatedStatus,
              start_time: b.start_time,
              end_time: b.end_time
            };
          });
          
          setBookings(mappedBookings);
          setPage(targetPage);
          setHasMore(json.hasMore);
          
          sessionStorage.setItem('ap_bookings', JSON.stringify({
            data: mappedBookings,
            page: targetPage,
            hasMore: json.hasMore
          }));
          if (isManual) toast.success("Dashboard updated");
        }
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const cached = sessionStorage.getItem('ap_bookings');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setBookings(parsed.data || []);
        setPage(parsed.page || 1);
        setHasMore(parsed.hasMore || false);
        setIsLoading(false);
        fetchBookings(false, parsed.page || 1);
      } catch (e) {
        fetchBookings(false, 1);
      }
    } else {
      fetchBookings(false, 1);
    }
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    fetchBookings(true, newPage);
  };

  return (
    <div className="booking-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="booking-title" style={{ margin: 0 }}>Bookings</h1>
        <button 
          onClick={() => fetchBookings(true, page)} 
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

      {/* SEARCH */}
      <div className="booking-search">
        <input placeholder="Type name, number plate, etc" />
        <span>🔍</span>
      </div>

      {/* LIST */}
      <div className="booking-list">
        {isLoading ? (
          <p style={{ padding: "20px" }}>Loading bookings...</p>
        ) : (
          <>
            {bookings.map((b, index) => (
              <div className="booking-row" key={b.id}>
                {/* LEFT */}
                <div className="booking-left">
                  <span className="col index">{(page - 1) * 10 + index + 1}.</span>
                  <span className="col name">{b.name}</span>
                  <span className="col phone">{b.phone}</span>
                  <span className="col duration">{b.duration}</span>
                  <span className="col car" id="booking-mobile-remove">{b.car}</span>
                  <span className="col price">{b.price}</span>
                </div>

                {/* RIGHT */}
                <div className="booking-actions">
                  <button
                    className="btn view"
                    onClick={() => {
                      setViewBooking(b);
                      setFromDate(new Date(b.start_time.replace(/[Z+].*$/, '')));
                      setToDate(new Date(b.end_time.replace(/[Z+].*$/, '')));
                    }}
                  >
                    View
                  </button>

                  {b.status !== "completed" && (
                    <button
                      className="btn extend"
                      onClick={() => {
                        setExtendBooking(b);
                        setFromDate(new Date(b.start_time.replace(/[Z+].*$/, '')));
                        setToDate(new Date(b.end_time.replace(/[Z+].*$/, '')));
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

                  <button className="btn contact">Call Host</button>
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
      {viewBooking && (
        <div className="popup-overlay" onClick={() => setViewBooking(null)}>
          <div className="popup-box date-view-popup" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup-title">Car Number : <span>{viewBooking.car}</span></h3>
            <div className="date-row">
              <div className="date-field">
                <label>FROM</label>
                <div className="custom-datepicker-display">
                  {fromDate ? fromDate.toLocaleString() : 'N/A'}
                </div>
              </div>
              <div className="date-field">
                <label>TO</label>
                <div className="custom-datepicker-display">
                  {toDate ? toDate.toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>
            <div className="popup-buttons">
              <button className="btn cancel" onClick={() => setViewBooking(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EXTEND POPUP ================= */}
      {extendBooking && (
        <div className="popup-overlay" onClick={() => setExtendBooking(null)}>
          <div className="popup-box date-view-popup" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup-title">Car Number : <span>{extendBooking.car}</span></h3>
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
                  disabled
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
                        type: 'online'
                      }),
                    });

                    const data = await res.json();
                    if (res.ok) {
                      toast.success("Booking extended successfully!");
                      setExtendBooking(null);
                      fetchBookings(true, page);
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
              <button className="btn cancel" onClick={() => setExtendBooking(null)}>Cancel</button>
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
      `}</style>
    </div>
  );

  function formatLocal(date) {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}