import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AccountPageProps {
  token: string | null;
}

export const AccountPage: React.FC<AccountPageProps> = ({ token }) => {
  const [userInfo, setUserInfo] = useState<{ username: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        setError('You need to be logged in to view this page.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/api/account', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(response.data);
      } catch (err) {
        setError('Failed to fetch user info. Please try again later.');
      }
    };

    fetchUserInfo();
  }, [token]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!userInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="account-page">
      <h2>Account Information</h2>
      <div className="user-info">
        <p><strong>Username:</strong> {userInfo.username}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
      </div>
      {/* คุณสามารถเพิ่มฟอร์มสำหรับแก้ไขข้อมูลหรือเปลี่ยนรหัสผ่านที่นี่ */}
    </div>
  );
};
