/**
 * ==========================================================================
 * MEDIA CONFIGURATION
 * Simply paste your file paths (local path or online URL) in the 'src' field.
 * Leave as "" if you want to keep the placeholder.
 * ==========================================================================
 */
const MEDIA_CONFIG = {
  // 1. IMAGES CONFIGURATION
  images: [
    { title: "Landscape 1", category: "landscape", src: "images/ld1.jpg" },
    { title: "Architecture 1", category: "architecture", src: "images/arch.jpeg" },
    { title: "Abstract 1", category: "abstract", src: "images/abs1.jpeg" },
    { title: "Landscape 2", category: "landscape", src: "images/ld2.jpeg" },
    { title: "Architecture 2", category: "architecture", src: "images/arch2.jpeg" },
    { title: "Abstract 2", category: "abstract", src: "images/abs2.avif" }
  ],

  // 2. AUDIOS CONFIGURATION
  audios: [
    { title: "Audio Track 1", artist: "Artist 1", src: "audios/music1.mp3", duration: "02:00" },
    { title: "Audio Track 2", artist: "Artist 2", src: "audios/music2.mp3", duration: "01:42" },
    { title: "Audio Track 3", artist: "Artist 3", src: "audios/music3.mp3", duration: "02:04" }
  ],

  // 3. VIDEOS CONFIGURATION
  videos: [
    { title: "Video 1", src: "videos/video1.mp4", duration: "00:40" },
    { title: "Video 2", src: "videos/video2.mp4", duration: "00:22" },
    { title: "Video 3", src: "videos/video3.mp4", duration: "00:32" }
  ]
};

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initImageGallery();
  initAudioPlayer();
  initVideoPlayer();
});

/* ==========================================================================
   1. Responsive Mobile Navigation
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML = '☰';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   2. Image Gallery & Lightbox Functionality
   ========================================================================== */
function initImageGallery() {
  const cards = document.querySelectorAll('.gallery-card');
  const modal = document.getElementById('imageLightbox');
  const closeBtn = document.querySelector('.lightbox-close');
  const modalTitle = document.getElementById('lightboxTitle');
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');

  // Load configured image src if provided
  cards.forEach((card, index) => {
    const imgData = MEDIA_CONFIG.images[index];
    if (imgData && imgData.src) {
      const mediaWrapper = card.querySelector('.gallery-media-wrapper');
      const placeholder = card.querySelector('.image-placeholder-box');
      if (placeholder && mediaWrapper) {
        const img = document.createElement('img');
        img.src = imgData.src;
        img.alt = imgData.title;
        img.style.width = '100%';
        img.style.aspectRatio = '16/10';
        img.style.objectFit = 'cover';
        mediaWrapper.replaceChild(img, placeholder);
      }
    }
  });

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Open Lightbox (supports button tap and full-card mobile tap)
  const openLightbox = (card, index) => {
    const title = card ? card.querySelector('.card-title')?.textContent : 'Image';
    const imgData = MEDIA_CONFIG.images[index];

    if (modalTitle) modalTitle.textContent = title;

    const modalContainer = modal.querySelector('.lightbox-preview-area') || modal.querySelector('div[style*="min-height"]');
    if (modalContainer) {
      if (imgData && imgData.src) {
        modalContainer.innerHTML = `<img src="${imgData.src}" alt="${title}" class="lightbox-img">`;
      } else {
        modalContainer.innerHTML = `
          <svg class="icon-placeholder" style="width: 64px; height: 64px;" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style="margin-top: 0.5rem; color: var(--text-muted);">Preview Placeholder</span>
        `;
      }
    }

    modal.classList.add('active');
  };

  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      openLightbox(card, index);
    });
  });

  const closeModal = () => modal?.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   3. Audio Player with Real Audio Element Support
   ========================================================================== */
function initAudioPlayer() {
  const playerCard = document.querySelector('.featured-player-card');
  const playBtn = document.querySelector('.play-pause-btn');
  const timeline = document.querySelector('.timeline-slider');
  const currentTimeEl = document.querySelector('.current-time');
  const totalTimeEl = document.querySelector('.total-time');
  const disk = document.querySelector('.player-artwork-box');
  const trackCards = document.querySelectorAll('.track-card');
  const playerTitle = document.querySelector('.featured-track-title');
  const playerArtist = document.querySelector('.featured-track-artist');
  const volumeSlider = document.querySelector('.volume-slider');
  const nativeAudio = document.querySelector('.native-audio-wrapper audio');

  if (!playerCard || !playBtn) return;

  // Real HTML5 Audio Object
  let realAudio = new Audio();
  let currentTrackIndex = 0;
  let isPlaying = false;
  let simInterval = null;

  // Load initial track
  loadTrack(0);

  function loadTrack(index) {
    currentTrackIndex = index;
    const track = MEDIA_CONFIG.audios[index];
    if (!track) return;

    if (playerTitle) playerTitle.textContent = track.title;
    if (playerArtist) playerArtist.textContent = track.artist;
    if (totalTimeEl) totalTimeEl.textContent = track.duration;

    if (track.src) {
      realAudio.src = track.src;
      if (nativeAudio) nativeAudio.src = track.src;
    }
  }

  function togglePlay() {
    const track = MEDIA_CONFIG.audios[currentTrackIndex];

    if (!isPlaying) {
      isPlaying = true;
      playBtn.innerHTML = '❚❚';
      playerCard.classList.add('is-playing');
      disk?.classList.add('playing');

      if (track && track.src) {
        realAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
      } else {
        // Simulated progress if no src provided
        startSimulation();
      }
    } else {
      isPlaying = false;
      playBtn.innerHTML = '▶';
      playerCard.classList.remove('is-playing');
      disk?.classList.remove('playing');

      if (track && track.src) {
        realAudio.pause();
      } else {
        clearInterval(simInterval);
      }
    }
  }

  function startSimulation() {
    clearInterval(simInterval);
    simInterval = setInterval(() => {
      let val = parseFloat(timeline?.value || 0);
      if (val < 100) {
        val += 0.5;
        if (timeline) timeline.value = val;
        updateTimeDisplay(val, 180);
      } else {
        clearInterval(simInterval);
        togglePlay();
      }
    }, 500);
  }

  playBtn.addEventListener('click', togglePlay);

  // Sync real audio progress
  realAudio.addEventListener('timeupdate', () => {
    if (realAudio.duration) {
      const pct = (realAudio.currentTime / realAudio.duration) * 100;
      if (timeline) timeline.value = pct;
      updateTimeDisplay(pct, realAudio.duration);
    }
  });

  realAudio.addEventListener('ended', () => {
    isPlaying = false;
    playBtn.innerHTML = '▶';
    playerCard.classList.remove('is-playing');
    disk?.classList.remove('playing');
  });

  if (timeline) {
    timeline.addEventListener('input', (e) => {
      const pct = parseFloat(e.target.value);
      if (realAudio.duration) {
        realAudio.currentTime = (pct / 100) * realAudio.duration;
      }
      updateTimeDisplay(pct, realAudio.duration || 180);
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      realAudio.volume = parseFloat(e.target.value) / 100;
    });
  }

  function updateTimeDisplay(pct, totalSecs) {
    if (!currentTimeEl) return;
    const curSecs = Math.floor((pct / 100) * totalSecs);
    const m = Math.floor(curSecs / 60);
    const s = curSecs % 60;
    currentTimeEl.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Playlist selection
  trackCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      trackCards.forEach(c => c.classList.remove('active-track'));
      card.classList.add('active-track');
      loadTrack(index);
      if (!isPlaying) togglePlay();
    });
  });
}

/* ==========================================================================
   4. Video Player Theater Controls
   ========================================================================== */
function initVideoPlayer() {
  const videoStage = document.querySelector('.theater-main-stage');
  const videoContainer = document.querySelector('.video-container');
  const theaterBtn = document.getElementById('btnTheaterMode');
  const speedBtn = document.getElementById('btnPlaybackSpeed');
  const playHugeBtn = document.querySelector('.video-play-huge-btn');
  const videoCards = document.querySelectorAll('.video-card');
  const mainTitle = document.getElementById('mainVideoTitle');

  let currentVideoIndex = 0;
  let videoElement = null;

  // Check if first video has src
  loadVideo(0);

  function loadVideo(index) {
    currentVideoIndex = index;
    const videoData = MEDIA_CONFIG.videos[index];
    if (!videoData) return;

    if (mainTitle) mainTitle.textContent = videoData.title;

    if (videoData.src && videoContainer) {
      videoContainer.innerHTML = `
        <video id="mainHtml5Video" controls style="width:100%; height:100%; object-fit:cover; background:#000;">
          <source src="${videoData.src}" type="video/mp4">
          Your browser does not support HTML5 video.
        </video>
      `;
      videoElement = document.getElementById('mainHtml5Video');
    }
  }

  if (playHugeBtn) {
    playHugeBtn.addEventListener('click', () => {
      const videoData = MEDIA_CONFIG.videos[currentVideoIndex];
      if (videoData && videoData.src) {
        loadVideo(currentVideoIndex);
        videoElement?.play();
      } else {
        alert("Please set a video 'src' in MEDIA_CONFIG inside script.js");
      }
    });
  }

  // Theater Mode
  if (theaterBtn && videoStage) {
    theaterBtn.addEventListener('click', () => {
      const isWide = videoStage.classList.toggle('theater-wide');
      theaterBtn.innerHTML = isWide ? '⊡ Normal View' : '⊞ Theater Mode';
    });
  }

  // Playback Speed
  if (speedBtn) {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    let idx = 0;
    speedBtn.addEventListener('click', () => {
      idx = (idx + 1) % speeds.length;
      const speed = speeds[idx];
      speedBtn.textContent = `⚡ ${speed}x`;
      if (videoElement) videoElement.playbackRate = speed;
    });
  }

  // Playlist click
  videoCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      loadVideo(index);
      videoStage?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      videoElement?.play();
    });
  });
}
