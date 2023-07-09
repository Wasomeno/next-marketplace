const ShopOrders = () => {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-slate-50 p-5">
      <div className="mb-4 flex h-20 items-center">
        <h1 className="text-2xl font-medium tracking-wider">Orders</h1>
      </div>
      <div className="h-5/6 w-full rounded-md bg-slate-50 p-6 drop-shadow-md">
        <div className="mb-6">
          <h5 className="font-medium tracking-wide">List of Orders</h5>
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="w-2/6 px-6 py-4 font-medium text-gray-900"
                >
                  Order Id
                </th>
                <th
                  scope="col"
                  className="w-1/6 py-4 text-center font-medium text-gray-900"
                >
                  Items
                </th>
                <th
                  scope="col"
                  className="w-1/6 py-4 text-center font-medium text-gray-900"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="w-1/6 py-4 text-center font-medium text-gray-900"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="w-1/6 py-4 text-center font-medium text-gray-900"
                >
                  Added
                </th>
                <th
                  scope="col"
                  className="w-1/6 py-4 text-center font-medium text-gray-900"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              <tr className="">
                <td className="px-6 py-4">
                  <p>12345</p>
                </td>
                <td className="py-4 text-center">10</td>
                <td className="py-4 text-center">Rp.1000000</td>
                <td className="py-4 text-center">@kevin</td>
                <td className="py-4 text-center">23-04-2023</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShopOrders;
