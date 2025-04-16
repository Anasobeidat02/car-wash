// JavaScript source code
import React, { useState } from 'react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // التحقق من صحة المدخلات
        if (!email || !password) {
            setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
            return;
        }

        // تحقق من إسم المستخدم وكلمة المرور (مثال بسيط)
        if (email === 'user@example.com' && password === 'password123') {
            setError('');
            // إعادة التوجيه إلى الصفحة الرئيسية (يمكنك تعديلها بما يتناسب مع التطبيق)
            window.location.href = '/home';
        } else {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
    };

    return (
        <div>
            <h2>تسجيل الدخول</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">البريد الإلكتروني</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">كلمة المرور</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">تسجيل الدخول</button>
            </form>
        </div>
    );
};

export default LoginPage;
