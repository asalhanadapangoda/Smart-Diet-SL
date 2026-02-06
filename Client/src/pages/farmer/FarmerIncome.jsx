import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchFarmerIncome } from '../../store/slices/farmerSlice';

const FarmerIncome = () => {
  const dispatch = useDispatch();
  const { income, loading, error } = useSelector((s) => s.farmer);

  useEffect(() => {
    dispatch(fetchFarmerIncome());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          My Income
        </h1>
        <p className="text-gray-700 mt-2">Income is calculated when admin marks related orders as <b>Completed</b>.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          <div className="glass-card rounded-2xl p-6 backdrop-blur-xl mb-6">
            <div className="text-sm text-gray-600">Total Income</div>
            <div className="text-3xl font-bold text-green-700">
              Rs. {(income?.totalIncome || 0).toFixed(2)}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-glass">Payout History</h2>
            {(income?.payouts || []).length === 0 ? (
              <p className="text-gray-700">No payouts yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">Paid At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(income?.payouts || []).map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {String(p.order).slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-700">
                          Rs. {Number(p.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {p.paymentStatus}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {p.paidAt ? new Date(p.paidAt).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FarmerIncome;

