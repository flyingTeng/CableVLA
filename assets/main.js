"use strict";

const copyButton = document.querySelector("#copy-citation");
const citation = document.querySelector("#bibtex");
const copyStatus = document.querySelector("#copy-status");

if (copyButton && citation && copyStatus) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(citation.textContent.trim());
      copyButton.textContent = "Copied";
      copyStatus.textContent = "Citation copied to clipboard.";
      window.setTimeout(() => { copyButton.textContent = "Copy citation"; }, 2000);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(citation);
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = "Citation selected. Use Ctrl+C or ⌘C to copy.";
    }
  });
}

// Only the three overview videos play automatically, while they are visible.
const overviewVideos = document.querySelectorAll('.domain-videos video[data-autoplay="overview"]');
if (overviewVideos.length && "IntersectionObserver" in window) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const states = new Map();

  function pauseOffscreen(video, state) {
    if (!video.paused) {
      state.managedPauses += 1;
      video.pause();
    }
  }

  function updatePlayback(video, state) {
    if (!state.visible || document.hidden) {
      pauseOffscreen(video, state);
      return;
    }
    if (reducedMotion.matches || state.userPaused || state.blocked || state.pending || !video.paused) return;
    state.pending = true;
    video.play().catch((error) => {
      // Keep the native play button available if the browser blocks autoplay.
      if (error.name !== "AbortError") state.blocked = true;
    }).finally(() => {
      state.pending = false;
      updatePlayback(video, state);
    });
  }

  overviewVideos.forEach((video) => {
    const state = { visible: false, userPaused: false, blocked: false, pending: false, managedPauses: 0 };
    states.set(video, state);
    video.muted = true;
    video.addEventListener("pause", () => {
      if (state.managedPauses) state.managedPauses -= 1;
      else state.userPaused = true;
    });
    video.addEventListener("play", () => {
      state.userPaused = false;
      state.blocked = false;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const state = states.get(entry.target);
      state.visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      updatePlayback(entry.target, state);
    });
  }, { threshold: [0, 0.5] });
  overviewVideos.forEach((video) => observer.observe(video));
  document.addEventListener("visibilitychange", () => {
    states.forEach((state, video) => updatePlayback(video, state));
  });
}
