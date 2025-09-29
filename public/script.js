document.getElementById("fitnessForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const gender = document.getElementById("gender").value;
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;

  document.getElementById("result").innerText = "⏳ در حال بارگذاری...";

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gender, height, weight }),
  });

  const data = await res.json();
  document.getElementById("result").innerHTML = data.plan || "❌ خطا در تولید برنامه!";
});