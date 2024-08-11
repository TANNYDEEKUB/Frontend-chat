import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterForm_styles.css';

export const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // ล้างข้อผิดพลาดก่อนที่จะทำการสมัครใหม่
    setSuccess(''); // ล้างข้อความสำเร็จก่อนที่จะทำการสมัครใหม่
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        username,
        password,
      });

      if (response.status === 201) {
        setSuccess('การสมัครสำเร็จแล้ว! คุณสามารถเข้าสู่ระบบได้.');
        setTimeout(() => {
          navigate('/login'); // นำผู้ใช้ไปที่หน้าเข้าสู่ระบบหลังจากสมัครสำเร็จ
        }, 2000); // รอ 2 วินาทีก่อนที่จะนำผู้ใช้ไปยังหน้าเข้าสู่ระบบ
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError('ชื่อผู้ใช้นี้มีอยู่แล้ว โปรดลองชื่ออื่น.');
      } else {
        setError('การสมัครไม่สำเร็จ. โปรดลองอีกครั้ง.');
      }
    }
  };

  return (
    <div className="register-container">
      <h2>สมัคร Account</h2>
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
        {success && <p className="success">{success}</p>}
        <button type="submit">สมัคร</button>
      </form>
    </div>
  );
};

export default RegisterForm;
