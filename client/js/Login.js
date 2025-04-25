const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");
const form = document.getElementById("loginForm");
const messageBox = document.getElementById("message");

// تبديل إظهار/إخفاء كلمة المرور
if (togglePassword && passwordField) {
  togglePassword.addEventListener("click", () => {
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;
    togglePassword.classList.toggle("bx-show");
    togglePassword.classList.toggle("bx-hide");
  });
}

// تسجيل الدخول اليدوي
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("Email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    messageBox.textContent = "Please fill in all fields.";
    messageBox.classList.add("error");
    return;
  }

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      messageBox.textContent = "Login successful! Redirecting...";
      messageBox.classList.remove("error");
      // تخزين التوكن وبيانات المستخدم
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } else {
      messageBox.textContent = data.message || "Incorrect email or password.";
      messageBox.classList.add("error");
    }
  } catch (err) {
    messageBox.textContent = "An error occurred. Please try again.";
    messageBox.classList.add("error");
    console.error("Login Error:", err);
  }
});

// تسجيل الدخول عبر جوجل
window.loginCallback = async function (response) {
  if (typeof jwt_decode === "undefined") {
    console.error("jwt_decode is not defined.");
    messageBox.textContent = "Error loading authentication library.";
    messageBox.classList.add("error");
    return;
  }

  try {
    const userInfo = jwt_decode(response.credential);
    console.log("Google user info:", userInfo);

    const email = userInfo.email || "";
    if (!email) {
      messageBox.textContent = "Unable to retrieve email from Google.";
      messageBox.classList.add("error");
      return;
    }

    const res = await fetch("/login/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      messageBox.textContent = "Google login successful! Redirecting...";
      messageBox.classList.remove("error");
      // تخزين التوكن وبيانات المستخدم
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } else {
      messageBox.textContent = data.message || "Google login failed.";
      messageBox.classList.add("error");
    }
  } catch (err) {
    messageBox.textContent = "An error occurred. Please try again.";
    messageBox.classList.add("error");
    console.error("Google Login Error:", err);
  }
};