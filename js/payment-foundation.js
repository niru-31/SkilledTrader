document.addEventListener("DOMContentLoaded", () => {

  const API = "http://localhost:5000/api";

  const payBtn = document.getElementById("payBtn");

  const studentName = document.getElementById("studentName");
  const studentEmail = document.getElementById("studentEmail");
  const studentPhone = document.getElementById("studentPhone");

  const courseCategory = document.getElementById("courseCategory");
  const courseTitle = document.getElementById("courseTitle");
  const courseDescription = document.getElementById("courseDescription");
  const coursePrice = document.getElementById("coursePrice");

  const successPopup = document.getElementById("successPopup");
  const goCourseBtn = document.getElementById("goCourseBtn");

  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("courseId");

  const token = localStorage.getItem("token");

  let selectedCourse = null;

  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  if (!courseId) {
    alert("Course ID missing.");
    window.location.href = "courses.html";
    return;
  }

  async function loadCourse() {
    try {
      const response = await fetch(`${API}/courses/${courseId}`);
      const data = await response.json();

      if (!data.success) {
        alert("Course not found.");
        return;
      }

      selectedCourse = data.course;

      courseCategory.textContent =
        selectedCourse.category || "COURSE";

      courseTitle.textContent =
        selectedCourse.title;

      courseDescription.textContent =
        selectedCourse.description;

      coursePrice.textContent =
        `₹${selectedCourse.price}`;

      payBtn.textContent =
        `Pay ₹${selectedCourse.price}`;

    } catch (error) {
      console.log(error);
      alert("Unable to load course.");
    }
  }

  function validateForm() {
    const name = studentName.value.trim();
    const email = studentEmail.value.trim();
    const phone = studentPhone.value.trim();

    if (!name) {
      alert("Please enter your full name.");
      studentName.focus();
      return false;
    }

    if (!email) {
      alert("Please enter your email.");
      studentEmail.focus();
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email.");
      studentEmail.focus();
      return false;
    }

    if (!phone || phone.length < 10) {
      alert("Please enter a valid mobile number.");
      studentPhone.focus();
      return false;
    }

    return {
      name,
      email,
      phone
    };
  }

  async function createOrder() {
    const response = await fetch(`${API}/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        courseId
      })
    });

    return await response.json();
  }

  async function verifyPayment(paymentResponse) {
    const response = await fetch(`${API}/payments/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        courseId,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature
      })
    });

    return await response.json();
  }

  function launchRazorpay(orderData, userDetails) {
    const options = {
      key: orderData.key,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "SkilledTrader",
      description: selectedCourse.title,
      order_id: orderData.order.id,

      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone
      },

      theme: {
        color: "#1b8c5f"
      },

      handler: async function (response) {
        try {
          payBtn.textContent = "Verifying Payment...";

          const verifyData = await verifyPayment(response);

          if (!verifyData.success) {
            alert(verifyData.message || "Payment verification failed.");
            payBtn.disabled = false;
            payBtn.textContent = `Pay ₹${selectedCourse.price}`;
            return;
          }

          localStorage.setItem(
            "foundationStudent",
            JSON.stringify({
              studentName: userDetails.name,
              studentEmail: userDetails.email,
              studentPhone: userDetails.phone,
              courseId,
              courseName: selectedCourse.title,
              amount: selectedCourse.price,
              paymentStatus: "paid",
              paymentDate: new Date().toLocaleString()
            })
          );

          if (successPopup) {
            successPopup.classList.add("active");
          } else {
            alert("Payment successful! Course unlocked.");
            window.location.href =
              `foundation-program.html?courseId=${courseId}`;
          }

        } catch (error) {
          console.log(error);
          alert("Payment verification failed.");
          payBtn.disabled = false;
          payBtn.textContent = `Pay ₹${selectedCourse.price}`;
        }
      },

      modal: {
        ondismiss: function () {
          payBtn.disabled = false;
          payBtn.textContent = `Pay ₹${selectedCourse.price}`;
        }
      }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  }

  if (payBtn) {
    payBtn.addEventListener("click", async () => {
      const userDetails = validateForm();

      if (!userDetails) return;

      if (!selectedCourse) {
        alert("Course is still loading.");
        return;
      }

      try {
        payBtn.disabled = true;
        payBtn.textContent = "Creating Order...";

        const orderData = await createOrder();

        if (!orderData.success) {
          alert(orderData.message || "Unable to create payment order.");
          payBtn.disabled = false;
          payBtn.textContent = `Pay ₹${selectedCourse.price}`;
          return;
        }

        launchRazorpay(orderData, userDetails);

      } catch (error) {
        console.log(error);
        alert("Unable to start payment.");
        payBtn.disabled = false;
        payBtn.textContent = `Pay ₹${selectedCourse.price}`;
      }
    });
  }

  if (goCourseBtn) {
    goCourseBtn.addEventListener("click", () => {
      window.location.href =
        `foundation-program.html?courseId=${courseId}`;
    });
  }

  loadCourse();

});