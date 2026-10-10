/* =====================================================
   SnapDrop - main.js
   Real API: AllTube / Social Video Downloader via RapidAPI
   Replace RAPIDAPI_KEY with your actual key from rapidapi.com
   ===================================================== */

const RAPIDAPI_KEY = 'YOUR_RAPIDAPI_KEY_HERE'; // 🔑 Replace this

let selectedFormat = 'mp4';
let selectedQuality = null;
let currentVideoData = null;

// ─── FORMAT SWITCHER ─────────────────────────────────
function setFormat(btn, format) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedFormat = format;
  if (currentVideoData) renderQualities(currentVideoData);
}

// ─── PASTE EXAMPLES ─────────────────────────────────
function pasteExample(platform) {
  const examples = {
    youtube:   'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tiktok:    'https://www.tiktok.com/@khaby.lame/video/7110682961197478149',
    instagram: 'https://www.instagram.com/reel/CqFz5oPIbXU/',
    twitter:   'https://twitter.com/NASA/status/1661402897832583169',
    facebook:  'https://www.facebook.com/watch?v=496814454966438',
  };
  const input = document.getElementById('videoUrl');
  if (input) {
    input.value = examples[platform] || '';
    input.focus();
  }
}

// ─── DETECT PLATFORM ────────────────────────────────
function detectPlatform(url) {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return { name: 'YouTube', emoji: '🎥', api: 'youtube' };
  if (u.includes('tiktok.com'))       return { name: 'TikTok',    emoji: '🎵', api: 'tiktok' };
  if (u.includes('instagram.com'))    return { name: 'Instagram', emoji: '📸', api: 'instagram' };
  if (u.includes('twitter.com') || u.includes('x.com')) return { name: 'X / Twitter', emoji: '🐦', api: 'twitter' };
  if (u.includes('facebook.com') || u.includes('fb.watch')) return { name: 'Facebook', emoji: '📘', api: 'facebook' };
  if (u.includes('vimeo.com'))        return { name: 'Vimeo',     emoji: '🎞', api: 'vimeo' };
  if (u.includes('reddit.com') || u.includes('redd.it')) return { name: 'Reddit', emoji: '🤖', api: 'reddit' };
  if (u.includes('twitch.tv'))        return { name: 'Twitch',    emoji: '🎮', api: 'twitch' };
  if (u.includes('soundcloud.com'))   return { name: 'SoundCloud',emoji: '🔊', api: 'soundcloud' };
  if (u.includes('dailymotion.com'))  return { name: 'Dailymotion',emoji: '📺', api: 'dailymotion' };
  if (u.includes('linkedin.com'))     return { name: 'LinkedIn',  emoji: '💼', api: 'linkedin' };
  if (u.includes('pinterest.com') || u.includes('pin.it')) return { name: 'Pinterest', emoji: '📌', api: 'pinterest' };
  if (u.includes('bilibili.com'))     return { name: 'Bilibili',  emoji: '📡', api: 'bilibili' };
  if (u.includes('snapchat.com'))     return { name: 'Snapchat',  emoji: '👻', api: 'snapchat' };
  return null;
}

// ─── MAIN ANALYZE FUNCTION ───────────────────────────
async function analyzeVideo() {
  const urlInput = document.getElementById('videoUrl');
  const url = urlInput ? urlInput.value.trim() : '';
  const btn = document.getElementById('analyzeBtn');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('spinner');
  const errorBox = document.getElementById('errorBox');
  const resultBox = document.getElementById('resultBox');

  // Reset
  if (errorBox) errorBox.style.display = 'none';
  if (resultBox) resultBox.style.display = 'none';

  // Validate
  if (!url) { showError('Please paste a video URL to continue.'); return; }
  let parsedUrl;
  try { parsedUrl = new URL(url); } catch { showError('Invalid URL. Please copy the full link including https://'); return; }
  const platform = detectPlatform(url);
  if (!platform) { showError('Platform not supported. Try YouTube, TikTok, Instagram, Twitter, or Facebook.'); return; }

  // Loading state
  if (btn) btn.disabled = true;
  if (btnText) btnText.style.display = 'none';
  if (spinner) spinner.style.display = 'block';

  try {
    const data = await fetchVideoData(url, platform);
    currentVideoData = data;
    displayResult(data, platform);
  } catch (err) {
    showError(err.message || 'Failed to fetch video. Please try again or use a different URL.');
  } finally {
    if (btn) btn.disabled = false;
    if (btnText) btnText.style.display = 'inline';
    if (spinner) spinner.style.display = 'none';
  }
}

// ─── FETCH VIDEO INFO (Real API) ─────────────────────
async function fetchVideoData(url, platform) {
  /* 
    Using: Social Media Video Downloader API on RapidAPI
    Endpoint: https://social-media-video-downloader.p.rapidapi.com/smvd/get/all
    Sign up at: https://rapidapi.com/smvd-v1/api/social-media-video-downloader
    Free tier: 500 requests/month
  */
  const response = await fetch(
    `https://social-media-video-downloader.p.rapidapi.com/smvd/get/all?url=${encodeURIComponent(url)}`,
    {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'social-media-video-downloader.p.rapidapi.com'
      }
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `API Error ${response.status}. Check your RapidAPI key.`);
  }

  const data = await response.json();

  if (!data.success || !data.links || data.links.length === 0) {
    throw new Error('No downloadable links found. The video may be private or region-restricted.');
  }

  return {
    title: data.title || 'Video',
    thumbnail: data.thumbnail || null,
    duration: data.duration || null,
    platform: platform,
    links: data.links,
    raw: data
  };
}

// ─── DISPLAY RESULT ─────────────────────────────────
function displayResult(data, platform) {
  const resultBox  = document.getElementById('resultBox');
  const thumb      = document.getElementById('resultThumb');
  const title      = document.getElementById('resultTitle');
  const platformEl = document.getElementById('resultPlatform');
  const duration   = document.getElementById('resultDuration');

  if (thumb) {
    if (data.thumbnail) {
      thumb.innerHTML = `<img src="${data.thumbnail}" alt="thumbnail" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`;
    } else {
      thumb.textContent = platform.emoji;
    }
  }
  if (title) title.textContent = data.title;
  if (platformEl) platformEl.textContent = `📍 ${platform.name}`;
  if (duration) duration.textContent = data.duration ? `⏱ Duration: ${data.duration}` : '';

  renderQualities(data);

  if (resultBox) resultBox.style.display = 'block';
}

// ─── RENDER QUALITY OPTIONS ─────────────────────────
function renderQualities(data) {
  const grid = document.getElementById('qualityGrid');
  if (!grid) return;
  grid.innerHTML = '';
  selectedQuality = null;

  const isAudio = selectedFormat === 'mp3' || selectedFormat === 'aac';

  // Filter links by format
  let links = data.links || [];

  if (selectedFormat === 'mp4') {
    links = links.filter(l => l.quality && (l.extension === 'mp4' || !l.extension));
  } else if (selectedFormat === 'mp3') {
    links = links.filter(l => l.extension === 'mp3' || l.quality?.toLowerCase().includes('mp3') || l.quality?.toLowerCase().includes('audio'));
  } else if (selectedFormat === 'aac') {
    links = links.filter(l => l.extension === 'aac' || l.quality?.toLowerCase().includes('aac'));
  } else if (selectedFormat === 'webm') {
    links = links.filter(l => l.extension === 'webm');
  }

  // Fallback: show all
  if (links.length === 0) links = data.links || [];

  if (links.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;">No links available for this format.</p>';
    return;
  }

  links.forEach((link, i) => {
    const div = document.createElement('div');
    div.className = 'q-option' + (i === 0 ? ' selected' : '');
    if (i === 0) selectedQuality = link;

    const qualityLabel = link.quality || link.extension?.toUpperCase() || `Option ${i + 1}`;
    const size = link.size ? `~${link.size}` : '';
    const isFirst = i === 0;

    div.innerHTML = `
      <div>
        <div class="q-label">${qualityLabel}</div>
        <div class="q-size">${size}</div>
      </div>
      ${isFirst ? '<div class="q-badge">Best</div>' : ''}
    `;
    div.onclick = () => {
      document.querySelectorAll('.q-option').forEach(o => o.classList.remove('selected'));
      div.classList.add('selected');
      selectedQuality = link;
    };
    grid.appendChild(div);
  });
}

// ─── DOWNLOAD ────────────────────────────────────────
async function downloadVideo() {
  if (!selectedQuality || !selectedQuality.link) {
    showError('Please select a quality option first.');
    return;
  }

  const btn = document.getElementById('downloadBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Starting download...';
  }

  try {
    // Open the download link directly
    const a = document.createElement('a');
    a.href = selectedQuality.link;
    a.download = (currentVideoData?.title || 'video') + '.' + (selectedQuality.extension || 'mp4');
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast('✅ Download started!');
  } catch (err) {
    showError('Download failed. Try right-clicking the link and "Save As".');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '⬇️ Download Now';
    }
  }
}

// ─── SHOW ERROR ─────────────────────────────────────
function showError(msg) {
  const box = document.getElementById('errorBox');
  const text = document.getElementById('errorText');
  if (box && text) {
    text.textContent = msg;
    box.style.display = 'flex';
    setTimeout(() => { box.style.display = 'none'; }, 6000);
  }
}

// ─── TOAST ──────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.style.cssText = `
      position:fixed;bottom:28px;right:24px;background:#111827;
      border:1px solid #10B981;border-radius:12px;padding:14px 20px;
      font-family:var(--font,sans-serif);font-size:0.875rem;color:#F1F5F9;
      box-shadow:0 8px 32px rgba(0,0,0,0.4);z-index:9999;
      transform:translateY(80px);opacity:0;transition:transform 0.3s,opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.transform = 'translateY(80px)';
    toast.style.opacity = '0';
  }, 3500);
}

// ─── FAQ ACCORDION ──────────────────────────────────
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const icon = btn.querySelector('span');
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q span').forEach(s => s.textContent = '+');
  if (!isOpen) {
    answer.classList.add('open');
    if (icon) icon.textContent = '−';
  }
}

// ─── HAMBURGER MENU ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('navLinks');
  if (ham && nav) {
    ham.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Enter key on input
  const input = document.getElementById('videoUrl');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') analyzeVideo();
    });
  }
});
