import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm_styles.css';

interface LoginFormProps {
  onLogin: (token: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username,
        password,
      });

      onLogin(response.data.token);
      navigate('/'); // หลังจากล็อกอินสำเร็จ ให้กลับไปที่หน้าแรก
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      } else {
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ. โปรดลองอีกครั้ง.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ชื่อผู้ใช้</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>รหัสผ่าน</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">เข้าสู่ระบบ</button>
      </form>
    </div>
  );
};
