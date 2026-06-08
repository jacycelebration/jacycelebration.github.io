const eventConfig = {
  pageTitle: "Birthday & Christening Celebration",
  eventLabel: "Birthday & Christening Celebration",
  eventTitle: "Baby Name's 1st Birthday & Christening",
  eventSummary: "A joyful day of prayer, family, and sweet celebration.",
  eventDateIso: "2026-12-19T10:30:00+08:00",
  dateText: "Saturday, December 19, 2026",
  timeText: "10:30 AM ceremony - 12:00 PM reception",
  venueText: "St. Michael Parish & Garden Hall",
  venueAddress: "123 Celebration Street, Quezon City",
  rsvpDeadlineText: "December 5, 2026",
  rsvpUrl: "#rsvp-form",
  mapUrl: "#details",
  googleSheetScriptUrl: "https://script.google.com/macros/s/AKfycbwkUunyS-vvQ6Q38WIg3QrL0h65zpZRrgs7xfl-XmZJHcxufd08ZSHHS71UHUqowGVWUA/exec",
  coverImage: "assets/images/cover-placeholder.svg",
  invitationMessage:
    "We would be honored to have you join us as we gather in faith for a christening and continue the celebration with a joyful birthday party after the ceremony.",
  ceremonyTitle: "St. Michael Parish",
  ceremonyDetail: "A short christening service with family and godparents.",
  receptionTitle: "Garden Hall",
  receptionDetail: "Lunch, cake, games, and time to celebrate together.",
  dressCodeTitle: "Soft Garden Tones",
  dressCodeDetail: "Cream, sage, champagne, or warm neutrals are welcome.",
  rsvpTitle: "Please respond by December 5",
  rsvpDetail: "Let us know if you can make it so we can prepare your seat.",
  giftNote:
    "If you would like to bring something, a simple book or handwritten blessing note would be deeply appreciated.",
  contactNote:
    "Reach out to Nina at +63 9XX XXX XXXX for RSVP questions, dietary notes, or directions.",
  hashtagNote:
    "Use #BabyNameBlessedAndOne when you post so everyone can relive the day together.",
  hostLine: "With love from the [Family Name] family",
  schedule: [
    {
      time: "10:00 AM",
      title: "Guest arrival",
      detail: "Please arrive a little early so everyone can settle in before the ceremony.",
    },
    {
      time: "10:30 AM",
      title: "Christening ceremony",
      detail: "A short service with family, godparents, and a blessing for Baby Name.",
    },
    {
      time: "12:00 PM",
      title: "Lunch reception",
      detail: "Join us for food, conversation, and a relaxed afternoon together.",
    },
    {
      time: "1:30 PM",
      title: "Cake and birthday program",
      detail: "Candles, cake, photos, and a few fun moments for the little celebrant.",
    },
  ],
};

const bindText = (id, value) => {
  const element = document.getElementById(id);
  if (element && value) {
    element.textContent = value;
  }
};

const bindLink = (id, url) => {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  if (!url) {
    element.classList.add("is-hidden");
    return;
  }

  element.classList.remove("is-hidden");
  element.href = url;
  if (/^https?:/i.test(url)) {
    element.target = "_blank";
    element.rel = "noreferrer";
  }
};

const renderSchedule = () => {
  const scheduleList = document.getElementById("schedule-list");
  if (!scheduleList) {
    return;
  }

  scheduleList.innerHTML = "";

  eventConfig.schedule.forEach((item) => {
    const wrapper = document.createElement("article");
    wrapper.className = "timeline-item";

    const time = document.createElement("div");
    time.className = "timeline-time";
    time.textContent = item.time;

    const content = document.createElement("div");
    content.className = "timeline-content";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const detail = document.createElement("p");
    detail.textContent = item.detail;

    content.append(title, detail);
    wrapper.append(time, content);
    scheduleList.append(wrapper);
  });
};

const updateCountdown = () => {
  const note = document.getElementById("countdown-note");
  const date = new Date(eventConfig.eventDateIso);

  if (Number.isNaN(date.getTime())) {
    if (note) {
      note.textContent = "Add a valid event date in script.js to activate this countdown.";
    }
    return;
  }

  const tick = () => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff <= 0) {
      bindText("days", "0");
      bindText("hours", "0");
      bindText("minutes", "0");
      if (note) {
        note.textContent = "The celebration day is here.";
      }
      return;
    }

    const totalMinutes = Math.floor(diff / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    bindText("days", String(days));
    bindText("hours", String(hours));
    bindText("minutes", String(minutes));

    if (note) {
      note.textContent = `Counting down to ${eventConfig.dateText}.`;
    }
  };

  tick();
  window.setInterval(tick, 30000);
};

const setupReveals = () => {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
};

const setFormStatus = (message, tone = "warning") => {
  const status = document.getElementById("form-status");
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.remove("is-warning", "is-success", "is-error");

  if (tone) {
    status.classList.add(`is-${tone}`);
  }
};

const setupRsvpForm = () => {
  const form = document.getElementById("rsvp-form-element");
  const submitButton = document.getElementById("submit-button");
  if (!form || !submitButton) {
    return;
  }

  if (!eventConfig.googleSheetScriptUrl) {
    setFormStatus(
      "Add your Apps Script Web App URL in script.js to activate sheet submissions.",
      "warning"
    );
  } else {
    setFormStatus(
      "This form is ready if your Apps Script deployment is public and set to Anyone.",
      "success"
    );
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    if (!eventConfig.googleSheetScriptUrl) {
      setFormStatus(
        "The form is on the page, but submissions are still disabled until you add the Apps Script URL.",
        "warning"
      );
      return;
    }

    const fullName = form.elements.fullName.value.trim();
    const message = form.elements.message.value.trim();
    const attendanceField = form.querySelector("input[name='attendance']:checked");
    const website = form.elements.website.value.trim();

    if (!attendanceField) {
      setFormStatus("Please choose whether you can attend.", "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    setFormStatus("Submitting your RSVP...", "warning");

    const payload = new URLSearchParams({
      fullName,
      attendance: attendanceField.value,
      message,
      source: window.location.href,
      submittedAt: new Date().toISOString(),
      website,
    });

    try {
      await fetch(eventConfig.googleSheetScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: payload.toString(),
      });

      form.reset();
      setFormStatus(
        "Thanks for the RSVP! If your Apps Script deployment is live and set to Anyone, the response should now be in your sheet.",
        "success"
      );
    } catch (error) {
      setFormStatus(
        "We couldn't submit the RSVP just yet. Double-check the Apps Script URL and deployment access.",
        "error"
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send RSVP";
    }
  });
};

const init = () => {
  document.title = eventConfig.pageTitle;

  bindText("event-label", eventConfig.eventLabel);
  bindText("event-title", eventConfig.eventTitle);
  bindText("event-summary", eventConfig.eventSummary);
  bindText("hero-date", eventConfig.dateText);
  bindText("hero-time", eventConfig.timeText);
  bindText("hero-venue", eventConfig.venueText);
  bindText("rsvp-deadline-inline", eventConfig.rsvpDeadlineText);
  bindText("invitation-message", eventConfig.invitationMessage);
  bindText("ceremony-title", eventConfig.ceremonyTitle);
  bindText("ceremony-detail", eventConfig.ceremonyDetail);
  bindText("reception-title", eventConfig.receptionTitle);
  bindText("reception-detail", eventConfig.receptionDetail);
  bindText("dress-code-title", eventConfig.dressCodeTitle);
  bindText("dress-code-detail", eventConfig.dressCodeDetail);
  bindText("rsvp-title", eventConfig.rsvpTitle);
  bindText("rsvp-detail", eventConfig.rsvpDetail);
  bindText("gift-note", eventConfig.giftNote);
  bindText("contact-note", eventConfig.contactNote);
  bindText("hashtag-note", eventConfig.hashtagNote);
  bindText("host-line", eventConfig.hostLine);

  const coverImage = document.getElementById("cover-image");
  if (coverImage && eventConfig.coverImage) {
    coverImage.src = eventConfig.coverImage;
  }

  bindLink("rsvp-link", eventConfig.rsvpUrl);
  bindLink("map-link", eventConfig.mapUrl);

  renderSchedule();
  updateCountdown();
  setupRsvpForm();
  setupReveals();
};

init();
