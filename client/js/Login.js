document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("Email").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageBox = document.getElementById("message");

  if (!email || !password) {
    messageBox.textContent = "Please fill in all fields.";
    messageBox.classList.add("error");
    return;
  }

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      messageBox.textContent = "Login successful! Redirecting...";
      messageBox.classList.remove("error");
      setTimeout(() => {
        window.location.href = "home1.html";
      }, 1500);
    } else {
      messageBox.textContent = data.message || "Incorrect email or password.";
      messageBox.classList.add("error");
    }
  } catch (err) {
    messageBox.textContent = "An error occurred. Please try again.";
    messageBox.classList.add("error");
  }
});
