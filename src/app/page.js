import React from "react";

export default function Home() {
  return (
    <div className="ml-[290px] p-8 min-h-[calc(100vh-75px)] bg-white mb-[50px] font-[Satoshi]">
      {/* Main Dashboard */}{/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-gray-500 mt-1">Overview</p>
          </div>
      <main className="flex gap-6">
        {/* LEFT HALF */}
        <div className="w-1/2">
          

          {/* Stats Grid: 2x2 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { title: "Total", value: "1,234", change: "+12%", icon: "/DashboardTotalsIcon.svg" },
              { title: "Pending Queries", value: "56", change: "-3%", icon: "/DashboardQueries.svg" },
              { title: "Pending RFQs", value: "89", change: "+65%", icon: "/DashboardRFQs.svg" },
              { title: "Orders Confirmed", value: "95", change: "+22%", icon: "/DashboradConfirmed.svg" },
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between text-gray-600 text-sm mb-1">
                  <span>{item.title}</span>
                  <img src={item.icon} alt={item.title} />
                </div>
                <div className="text-[28px] font-semibold text-[#1b2a41]">{item.value}</div>
                <div className="text-sm text-blue-500">{item.change} from last month</div>
              </div>
            ))}
          </div>

          {/* Chat Section Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="mb-4 font-medium text-gray-600">Chat Section</h3>
            <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400">
              Chat content goes here
            </div>
          </div>
        </div>

        {/* RIGHT HALF */}
        <div className="w-1/2 flex flex-col gap-6">
          {/* Recent Requests */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-gray-700 font-medium">Recent requests</h4>
              <a className="text-blue-500 text-sm cursor-pointer">View all</a>
            </div>
            <ul className="space-y-4 text-sm">
              {[1, 2, 3, 4].map((_, idx) => (
                <li key={idx} className="flex justify-between text-gray-600">
                  <div className="flex items-center space-x-2">
                    <img src="RecentRequestIcon.svg" />
                    <div>
                      <p>Order #1234</p>
                      <p className="text-xs text-gray-400">app · $156</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">2h ago</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Products */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-gray-700 font-medium">Active Products</h4>
              <a className="text-blue-500 text-sm cursor-pointer">View all</a>
            </div>
            <ul className="space-y-4">
              {[1, 2, 3].map((_, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img src="/ActiveProductIcon.svg" />
                    <div className="text-sm">
                      <p>Product ID</p>
                      <p className="text-xs text-gray-400">Product name</p>
                    </div>
                  </div>
                  <p className="text-blue-500 text-sm">$4-9/pc</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
