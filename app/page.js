"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "../lib/RoleContext";

export default function Home() {
  const router = useRouter();
  const { isAdmin } = useRole();
  const [revenueStats, setRevenueStats] = useState({
    last_day_revenue: 0,
    last_week_revenue: 0,
    last_month_revenue: 0
  });
  const [revenueTab, setRevenueTab] = useState("Last Month");
  const [lastTransaction, setLastTransaction] = useState(0);
  const [occupancyStats, setOccupancyStats] = useState({
    cars_on_trip_now: 0,
    future_booked_cars: 0,
    sales_this_week: 0,
    sales_last_month: 0,
    cars_in_maintenance_now: 0
  });
  const [inventoryStats, setInventoryStats] = useState({ available_vehicles: 0 });
  const [bookingsTab, setBookingsTab] = useState("This Week");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/hub/dashboard/stats');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          if (json.data?.revenue) {
            setRevenueStats(json.data.revenue);
            sessionStorage.setItem('ap_revenue', JSON.stringify(json.data.revenue));
          }
          if (json.data?.latestTransaction !== undefined) {
            setLastTransaction(json.data.latestTransaction);
            sessionStorage.setItem('ap_lastTx', json.data.latestTransaction);
          }
          if (json.data?.occupancy) {
            setOccupancyStats(json.data.occupancy);
            sessionStorage.setItem('ap_occupancy', JSON.stringify(json.data.occupancy));
          }
          if (json.data?.inventory) {
            setInventoryStats(json.data.inventory);
            sessionStorage.setItem('ap_inventory', JSON.stringify(json.data.inventory));
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const cachedRevenue = sessionStorage.getItem('ap_revenue');
    const cachedTx = sessionStorage.getItem('ap_lastTx');
    const cachedOcc = sessionStorage.getItem('ap_occupancy');
    const cachedInv = sessionStorage.getItem('ap_inventory');

    if (cachedRevenue && cachedTx && cachedOcc && cachedInv) {
      setRevenueStats(JSON.parse(cachedRevenue));
      setLastTransaction(Number(cachedTx));
      setOccupancyStats(JSON.parse(cachedOcc));
      setInventoryStats(JSON.parse(cachedInv));
      setIsLoading(false); 
    }

    fetchStats(false);
  }, []);

  const getDisplayRevenue = () => {
    if (revenueTab === "Last Day") return revenueStats.last_day_revenue;
    if (revenueTab === "Last Week") return revenueStats.last_week_revenue;
    return revenueStats.last_month_revenue;
  };

  const getDisplayBookings = () => {
    return bookingsTab === "This Week" ? occupancyStats.sales_this_week : occupancyStats.sales_last_month;
  };

  const formattedRevenue = new Intl.NumberFormat('en-IN').format(getDisplayRevenue() || 0);

  const onNavigate = (path) => {
    router.push(`/${path}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }} id="refresh-button-mobile-ui">
        <h1 className="title" style={{ margin: 0 }}>Welcome <span className="mobile-admin-word-remove">Admin</span> </h1>
        <button 
          
          onClick={() => fetchStats(true)} 
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

      {/* TOP SECTION */}
      <div className="top-grid">

        <div className="card revenue">
          <p className="gold">Total Revenue</p>
          <h2>{isLoading ? '...' : `Rs. ${formattedRevenue}`}</h2>
          <span>Is the revenue in {revenueTab}</span>

          <div className="tabs">
            <span 
              className={revenueTab === "Last Day" ? "active" : ""} 
              onClick={() => setRevenueTab("Last Day")}
              style={{ cursor: "pointer" }}
            >Last Day</span>
            <span 
              className={revenueTab === "Last Week" ? "active" : ""} 
              onClick={() => setRevenueTab("Last Week")}
              style={{ cursor: "pointer" }}
            >Last Week</span>
            <span 
              className={revenueTab === "Last Month" ? "active" : ""} 
              onClick={() => setRevenueTab("Last Month")}
              style={{ cursor: "pointer" }}
            >Last Month</span>
          </div>
        </div>

        <div className="card small green">
          <p className="smallp">Last </p>
          <h3>{isLoading ? '...' : `Rs. ${lastTransaction}`}</h3>
          <span>Was the last amount received.</span>
          <button onClick={() => onNavigate('bookings')}>Know More</button>
        </div>

        <div className="card small green">
          <p className="smallp">in Hub</p>
          <h3>{isLoading ? '...' : inventoryStats.available_vehicles}</h3>
          <span>Cars available in our website.</span>
          <button onClick={() => onNavigate('cars')}>Know More</button>
        </div>

        <div className="card small green">
          <p className="smallp">in Use</p>
          <h3>{isLoading ? '...' : occupancyStats.cars_on_trip_now}</h3>
          <span>Cars are currently in on road.</span>
          <button onClick={() => onNavigate('bookings')}>Know More</button>
        </div>

        <div className="card small green">
          <p className="smallp">Upcoming</p>
          <h3>{isLoading ? '...' : occupancyStats.future_booked_cars}</h3>
          <span>cars pre-booked in this month.</span>
          <button onClick={() => onNavigate('bookings')}>Know More</button>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="bottom-grid">

        {/* BOOKINGS */}
        <div className="split">
          <div className="split-top">TOTAL NUMBER OF BOOKINGS</div>
          <div className="split-bottom">
            <h2 className="split-maintainance">{isLoading ? '...' : getDisplayBookings()}</h2>
            <p>Sales {bookingsTab === "This Week" ? "in this week" : "in last month"}</p>

            <div className="tabs">
              <span 
                id="mobile-number-Maintenance"
                className={bookingsTab === "This Week" ? "active" : ""}
                onClick={() => setBookingsTab("This Week")}
                style={{ cursor: "pointer" }}
              >This Week</span>
              <span 
                className={bookingsTab === "Last Month" ? "active" : ""}
                onClick={() => setBookingsTab("Last Month")}
                style={{ cursor: "pointer" }}
              >Last Month</span>
            </div>
          </div>
        </div>

        {/* MAINTENANCE */}
        <div className="split">
          <div className="split-top">CARS UNDER MAINTENANCE</div>
          <div className="split-bottom">
            <h2>{isLoading ? '...' : occupancyStats.cars_in_maintenance_now}</h2>
            <p>Cars <span id="mobile-number-Maintenance">in Maintenance</span></p>
            <button onClick={() => onNavigate('maintainance')}>Know More</button>
          </div>
        </div>

        {/* ✅ ADD CARS */}
        {isAdmin && (
        <div className="add-card">
          <div className="add-left">
            <img src="/add-car.png" className="add-img" />
          </div>
          <div className="add-right">
            <h3>ADD CARS</h3>
            <p>Add when you have all data about Car and Host</p>
            <button>Add now</button>
          </div>
        </div>
        )}

        {/* HOST REQUEST */}
        {isAdmin && (
        <div className="host-card">
          <h3>Hosh Request</h3>
          <p>Know more<span id="mobile-number-Maintenance"> about Host</span>  Requests</p>
          <button>Click to View</button>
        </div>
        )}

      </div>
    </div>
  )
}