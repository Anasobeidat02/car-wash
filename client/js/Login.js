
import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور.');
      return;
    }
    if (password.length < 8) {
      setError('يجب أن تكون كلمة المرور 8 أحرف على الأقل.');
      return;
    }
    // هنا يمكن إضافة منطق لتسجيل الدخول مثل إرسال الطلب إلى الخادم
    alert('تم تسجيل الدخول بنجاح!');
  };

  return (
    <div>
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="اسم المستخدم"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور"
        />
        <button type="submit">تسجيل الدخول</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
