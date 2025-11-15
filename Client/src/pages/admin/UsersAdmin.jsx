import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminUsers, updateUserRole } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';

const UsersAdmin = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [roleChanges, setRoleChanges] = useState({});
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    dispatch(getAdminUsers());
  }, [dispatch]);

  const handleRoleChange = (userId, newRole) => {
    setRoleChanges((prev) => ({
      ...prev,
      [userId]: newRole,
    }));
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!newRole) {
      toast.error('Please select a role');
      return;
    }

    setUpdating((prev) => ({ ...prev, [userId]: true }));

    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      toast.success('User role updated successfully');
      setRoleChanges((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      // Refresh users list
      dispatch(getAdminUsers());
    } catch (error) {
      toast.error(error || 'Failed to update user role');
    } finally {
      setUpdating((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-glass bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
          Manage Users
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/80 text-glass text-xl">No users found</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20">
              <thead className="glass-card bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {users.map((user) => {
                  const isCurrentUser = currentUser?._id === user._id || currentUser?.id === user._id;
                  const selectedRole = roleChanges[user._id] !== undefined 
                    ? roleChanges[user._id] 
                    : user.role;
                  const hasChanges = roleChanges[user._id] !== undefined && roleChanges[user._id] !== user.role;

                  return (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-10 w-10 rounded-full mr-3 border-2 border-white/30"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full glass-button bg-green-500/40 flex items-center justify-center text-white font-bold mr-3 border border-green-300/50">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="text-sm font-medium text-white text-glass">
                            {user.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-white/60">(You)</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90 text-glass">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90 text-glass">
                        {user.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <select
                            value={selectedRole}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            disabled={isCurrentUser || updating[user._id]}
                            className={`glass-input text-sm rounded-xl px-3 py-2 text-white focus:outline-none ${
                              isCurrentUser 
                                ? 'bg-white/10 cursor-not-allowed opacity-50' 
                                : 'cursor-pointer'
                            } ${hasChanges ? 'border-green-300/50' : ''}`}
                          >
                            <option value="user" className="bg-gray-800">User</option>
                            <option value="admin" className="bg-gray-800">Admin</option>
                          </select>
                          {hasChanges && (
                            <span className="text-xs text-green-300 font-medium text-glass">
                              Changed
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-glass">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {hasChanges && !isCurrentUser && (
                          <button
                            onClick={() => handleUpdateRole(user._id, selectedRole)}
                            disabled={updating[user._id]}
                            className={`glass-button px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              updating[user._id]
                                ? 'bg-white/20 cursor-not-allowed text-white/50'
                                : 'bg-green-500/40 text-white hover:scale-105'
                            }`}
                          >
                            {updating[user._id] ? 'Updating...' : 'Update Role'}
                          </button>
                        )}
                        {isCurrentUser && (
                          <span className="text-xs text-white/60 italic text-glass">
                            Cannot change own role
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;