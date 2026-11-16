// Shared behaviour for all Pirx marketing pages. No tracking, no network requests.
(function () {
  "use strict";

  // Sign-up form: this build is a preview, so nothing is sent anywhere.
  var form = document.getElementById("joinForm");
  if (form) {
    form.addEventListener("submit", function (e) { e.preventDefault(); form.classList.add("sent"); });
  }

  // Sticky sign-up bar on phones: hide it while the form itself is on screen.
  var bar = document.getElementById("mcta"), join = document.getElementById("join");
  if (bar && join && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      bar.classList.toggle("hide", entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(join);
  }

  // Short film in a dialog.
  var film = document.getElementById("film");
  if (film && typeof film.showModal === "function") {
    var video = film.querySelector("video");
    document.querySelectorAll("[data-film]").forEach(function (btn) {
      btn.addEventListener("click", function () { film.showModal(); if (video) { video.currentTime = 0; var p = video.play(); if (p && p.catch) { p.catch(function () {}); } } });
    });
    var stop = function () { if (video) { video.pause(); } };
    film.addEventListener("close", stop);
    film.addEventListener("click", function (e) { if (e.target === film) { film.close(); } });
    film.querySelectorAll("[data-film-close]").forEach(function (btn) { btn.addEventListener("click", function () { film.close(); }); });
  } else {
    document.querySelectorAll("[data-film]").forEach(function (btn) { btn.hidden = true; });
  }

  // FAQ structured data for search engines and AI assistants, built from the visible questions.
  var items = [].slice.call(document.querySelectorAll(".faq details")).map(function (d) {
    var q = d.querySelector("summary"), a = d.querySelector("p");
    return q && a ? { "@type": "Question", name: q.textContent.trim(), acceptedAnswer: { "@type": "Answer", text: a.textContent.trim() } } : null;
  }).filter(Boolean);
  if (items.length) {
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items });
    document.head.appendChild(ld);
  }
})();
