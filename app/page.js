export default function Home() {
  return (
    <div>

      <h1 className="title" id="title-main">Welcome To Admin Dashboard</h1>

      {/* TOP SECTION */}
      <div className="top-grid">

        <div className="card revenue" >
          <p className="gold" >Total Revenue</p>
          <h2>Rs. 2,50,000</h2>
          <span>Is the revenue in Last month</span>

          <div className="tabs">
            <span className="active">Last Day</span>
            <span>Last Week</span>
            <span>Last Month</span>
          </div>
        </div>

        <div className="card small red">
          <p className="smallp">Last</p>
          <h3>-2422 RS</h3>
          <span>Was the last Refund processed.</span>
          <button>Know More</button>
        </div>

        <div className="card small green">
          <p className="smallp">in Hub</p>
          <h3>10</h3>
          <span>Cars available in our website.</span>
          <button>Know More</button>
        </div>

        <div className="card small green" id="card3">
          <p className="smallp">in Use</p>
          <h3>12</h3>
          <span>Cars are currently in on road.</span>
          <button>Know More</button>
        </div>

        <div className="card small green" id="card3">
          <p className="smallp">Upcoming</p>
          <h3>22</h3>
          <span>cars pre-booked in this month.</span>
          <button>Know More</button>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="bottom-grid">

        {/* BOOKINGS */}
        <div className="split">
          <div className="split-top">TOTAL NUMBER OF BOOKINGS</div>
          <div className="split-bottom">
            <h2 className="split-maintainance">102</h2>
            <p>Sales in this week</p>

            <div className="tabs">
              <span className="active">This Week</span>
              <span>Last Month</span>
            </div>
          </div>
        </div>

        {/* MAINTENANCE */}
        <div className="split">
          <div className="split-top">CARS UNDER MAINTAINACE</div>
          <div className="split-bottom">
            <h2>12</h2>
            <p>Cars in Maintainance</p>
            <button>Know More</button>
          </div>
        </div>

        {/* ✅ ADD CARS (UPDATED) */}
        <div className="add-card" >

          <div className="add-left">
            <img src="/add-car.png" className="add-img" />
          </div>

          <div className="add-right" >
            <h3>ADD CARS</h3>
            <p>Add when you have all data about Car and Host</p>
            <button><span id="add-car-mobile">Click to</span> Add</button>
          </div>

        </div>

        {/* HOST REQUEST */}
        <div className="host-card">
          <h3>HOST REQUEST</h3>
          <p>Know more about Host Requests</p>
          <button>Click to View</button>
        </div>

      </div>

    </div>
  )
}