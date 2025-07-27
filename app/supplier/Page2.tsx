import React from 'react'

function Page2() {
  return (
    <div>
      <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{order.vendor}</p>
                      <p className="text-xs text-gray-500 mb-2">{order.items}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{order.amount}</span>
                        <span className="text-xs text-gray-500">{order.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
    </div>
  )
}

export default Page2
