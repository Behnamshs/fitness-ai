
const form = document.getElementById("workoutForm");
const result = document.getElementById("result");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  result.innerHTML = "<em>⏳ در حال تولید برنامه...</em>";
  submitBtn.disabled = true;

  const payload = {
    height: document.getElementById("height").value,
    weight: document.getElementById("weight").value,
    gender: document.getElementById("gender").value,
    goal: document.getElementById("goal").value
  };

  try {
    const res = await fetch("/api/workout", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data && data.plan) {
      result.innerHTML = data.plan;
    } else if (data && data.error) {
      result.innerHTML = `<div class="error">خطا: ${data.error}</div>`;
    } else {
      result.innerHTML = "<div class='error'>خطای ناشناخته</div>";
    }
  } catch (err) {
    console.error(err);
    result.innerHTML = "<div class='error'>اتصال به سرور برقرار نشد.</div>";
  } finally {
    submitBtn.disabled = false;
  }
});
