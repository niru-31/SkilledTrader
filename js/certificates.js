document.addEventListener("DOMContentLoaded", () => {

  const API = "https://skilled-trader.onrender.com/api";

  const token =
    localStorage.getItem("token");

  const certificatesGrid =
    document.getElementById("certificatesGrid");

  const totalCertificates =
    document.getElementById("totalCertificates");

  const earnedCertificates =
    document.getElementById("earnedCertificates");

  const lockedCertificates =
    document.getElementById("lockedCertificates");

  const achievementRate =
    document.getElementById("achievementRate");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  async function loadCertificates() {

    try {

      const response =
        await fetch(
          `${API}/certificates/my-certificates`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await response.json();

      if (!data.success) {

        certificatesGrid.innerHTML =
          "<p>Unable to load certificates.</p>";

        return;

      }

      const certificates =
        data.certificates || [];

      updateStats(certificates);

      renderCertificates(certificates);

    } catch (error) {

      console.log(error);

      certificatesGrid.innerHTML =
        "<p>Backend not connected.</p>";

    }

  }

  function updateStats(certificates) {

    const earned =
      certificates.length;

    totalCertificates.textContent =
      earned;

    earnedCertificates.textContent =
      earned;

    lockedCertificates.textContent =
      0;

    achievementRate.textContent =
      earned > 0 ? "100%" : "0%";

  }

  function renderCertificates(certificates) {

    if (certificates.length === 0) {

      certificatesGrid.innerHTML =
        `
        <div class="certificate-card locked">

          <div class="certificate-preview locked-preview">
            🔒
          </div>

          <div class="certificate-content">

            <div class="status locked-status">
              Locked
            </div>

            <h3>
              No Certificates Yet
            </h3>

            <p>
              Complete any course 100% to unlock your first certificate.
            </p>

            <div class="progress-track">
              <span style="width:0%"></span>
            </div>

            <small>
              0% completed
            </small>

          </div>

        </div>
        `;

      return;

    }

    certificatesGrid.innerHTML = "";

    certificates.forEach((certificate) => {

      const course =
        certificate.course;

      const issuedDate =
        new Date(
          certificate.issuedAt
        ).toLocaleDateString();

      const card =
        document.createElement("div");

      card.className =
        "certificate-card earned";

      card.innerHTML =
        `
        <div class="certificate-preview">

          <div class="certificate-inner">

            <span>
              Certificate Of Completion
            </span>

            <h2>
              ${course.title}
            </h2>

            <p>
              Certificate ID
            </p>

            <h3>
              ${certificate.certificateId}
            </h3>

            <small>
              Issued on ${issuedDate}
            </small>

          </div>

        </div>

        <div class="certificate-content">

          <div class="status earned-status">
            Earned
          </div>

          <h3>
            ${course.title} Certificate
          </h3>

          <p>
            Successfully completed ${course.title}.
          </p>

          <div class="progress-track">
            <span style="width:100%"></span>
          </div>

          <div class="certificate-actions">

            <button
              class="download-btn"
              data-url="${certificate.certificateUrl || ""}"
            >
              Download
            </button>

            <button
              class="share-btn"
              data-title="${course.title}"
            >
              Share
            </button>

          </div>

        </div>
        `;

      certificatesGrid.appendChild(card);

    });

    attachCertificateEvents();

  }

  function attachCertificateEvents() {

    const downloadButtons =
      document.querySelectorAll(".download-btn");

    downloadButtons.forEach((button) => {

      button.addEventListener("click", () => {

        const url =
          button.dataset.url;

        if (!url) {

          alert(
            "Certificate PDF is not uploaded yet."
          );

          return;

        }

        window.open(url, "_blank");

      });

    });


    const shareButtons =
      document.querySelectorAll(".share-btn");

    shareButtons.forEach((button) => {

      button.addEventListener("click", async () => {

        const title =
          button.dataset.title;

        const shareData = {

          title:
            "SkilledTrader Certificate",

          text:
            `I successfully completed ${title} on SkilledTrader.`,

          url:
            window.location.href

        };

        if (navigator.share) {

          try {

            await navigator.share(
              shareData
            );

          } catch (error) {

            console.log(error);

          }

        } else {

          await navigator.clipboard.writeText(
            window.location.href
          );

          alert(
            "Certificate link copied successfully."
          );

        }

      });

    });


    const certificateCards =
      document.querySelectorAll(
        ".certificate-card"
      );

    certificateCards.forEach((card) => {

      card.addEventListener("mouseenter", () => {

        card.style.transform =
          "translateY(-8px)";

      });

      card.addEventListener("mouseleave", () => {

        card.style.transform =
          "translateY(0)";

      });

    });

  }

  loadCertificates();

});