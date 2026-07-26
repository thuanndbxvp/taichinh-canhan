import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/contexts/AuthContext';

interface UserData {
  id: string;
  email: string;
  created_at: string;
}

export const AdminPanelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkAdminAndLoadUsers();
    }
  }, [isOpen]);

  const checkAdminAndLoadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi Edge Function để lấy danh sách user
      const { data, error } = await supabase.functions.invoke('manage-users', {
        method: 'GET'
      });

      if (error) throw error;
      
      setUsers(data.users || []);
      setIsAdmin(true);
    } catch (err: any) {
      console.error(err);
      setError('Bạn không có quyền truy cập hoặc có lỗi xảy ra.');
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword) return;

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.functions.invoke('manage-users', {
        method: 'POST',
        body: { email: newEmail, password: newPassword }
      });

      if (error) throw error;

      setNewEmail('');
      setNewPassword('');
      await checkAdminAndLoadUsers();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi tạo user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa user này?')) return;

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.functions.invoke('manage-users', {
        method: 'DELETE',
        body: { id }
      });

      if (error) throw error;
      
      await checkAdminAndLoadUsers();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi xóa user');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (id: string) => {
    const newPass = window.prompt('Nhập mật khẩu mới:');
    if (!newPass) return;

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.functions.invoke('manage-users', {
        method: 'PUT',
        body: { id, password: newPass }
      });

      if (error) throw error;
      
      alert('Đổi mật khẩu thành công!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-white">Quản Trị Người Dùng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800 text-red-200 rounded-md">
              {error}
            </div>
          )}

          {!isAdmin && !loading ? (
            <div className="text-center py-8 text-gray-400">
              Bạn không có quyền truy cập trang này.
            </div>
          ) : (
            <>
              <div className="mb-8 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Tạo Tài Khoản Mới</h3>
                <form onSubmit={handleCreateUser} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Mật khẩu</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-md disabled:opacity-50 transition-colors"
                  >
                    Tạo mới
                  </button>
                </form>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Danh sách Tài Khoản</h3>
                {loading && users.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">Đang tải...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800 text-gray-400 text-sm">
                          <th className="pb-3 font-medium">Email</th>
                          <th className="pb-3 font-medium">Ngày tạo</th>
                          <th className="pb-3 font-medium">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {users.map(u => (
                          <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                            <td className="py-3 text-gray-200">{u.email}</td>
                            <td className="py-3 text-gray-400">{new Date(u.created_at).toLocaleString('vi-VN')}</td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleChangePassword(u.id)}
                                  disabled={loading}
                                  className="px-3 py-1 bg-blue-900/50 text-blue-300 hover:bg-blue-800/50 rounded border border-blue-800 transition-colors"
                                >
                                  Đổi mật khẩu
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  disabled={loading || u.id === user?.id} // Không tự xóa mình
                                  className="px-3 py-1 bg-red-900/50 text-red-300 hover:bg-red-800/50 rounded border border-red-800 transition-colors disabled:opacity-50"
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && !loading && (
                          <tr>
                            <td colSpan={3} className="py-8 text-center text-gray-500">
                              Chưa có tài khoản nào.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
