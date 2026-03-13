// ==========================================
//  Tab switching
// ==========================================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelector('.tab.active').classList.remove('active');
    document.querySelector('.panel.active').classList.remove('active');
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });
});

// ==========================================
//  JSON Formatter / Compressor
// ==========================================
function formatJSON() {
  const input = document.getElementById('json-input').value.trim();
  const output = document.getElementById('json-output');
  const errorEl = document.getElementById('json-error');
  errorEl.textContent = '';
  if (!input) { output.value = ''; return; }
  try {
    const obj = JSON.parse(input);
    output.value = JSON.stringify(obj, null, 2);
  } catch (e) {
    errorEl.textContent = '❌ ' + e.message;
    output.value = '';
  }
}

function compressJSON() {
  const input = document.getElementById('json-input').value.trim();
  const output = document.getElementById('json-output');
  const errorEl = document.getElementById('json-error');
  errorEl.textContent = '';
  if (!input) { output.value = ''; return; }
  try {
    const obj = JSON.parse(input);
    output.value = JSON.stringify(obj);
  } catch (e) {
    errorEl.textContent = '❌ ' + e.message;
    output.value = '';
  }
}

function copyJSON() {
  const output = document.getElementById('json-output');
  if (!output.value) return;
  navigator.clipboard.writeText(output.value);
}

function clearJSON() {
  document.getElementById('json-input').value = '';
  document.getElementById('json-output').value = '';
  document.getElementById('json-error').textContent = '';
}

// ==========================================
//  QR Code Generator (using qrcode-generator CDN)
// ==========================================
function generateQR() {
  const text = document.getElementById('qr-text').value;
  if (!text) return;
  const cellSize = parseInt(document.getElementById('qr-size').value);
  const fg = document.getElementById('qr-fg').value;
  const bg = document.getElementById('qr-bg').value;
  const container = document.getElementById('qr-result');
  container.innerHTML = '';

  try {
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();

    const modules = qr.getModuleCount();
    const cellPx = Math.max(2, Math.floor(cellSize / modules));
    const canvasSize = modules * cellPx;

    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = fg;

    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(col * cellPx, row * cellPx, cellPx, cellPx);
        }
      }
    }

    container.appendChild(canvas);
  } catch (e) {
    container.innerHTML = '<p style="color:var(--danger);font-size:0.85rem;">生成失败: ' + e.message + '</p>';
  }
}

function downloadQR() {
  const container = document.getElementById('qr-result');
  const canvas = container.querySelector('canvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ==========================================
//  Password Generator
// ==========================================
function generatePassword() {
  const length = parseInt(document.getElementById('pwd-length').value);
  const useUpper = document.getElementById('pwd-upper').checked;
  const useLower = document.getElementById('pwd-lower').checked;
  const useNumber = document.getElementById('pwd-number').checked;
  const useSymbol = document.getElementById('pwd-symbol').checked;

  let chars = '';
  if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (useNumber) chars += '0123456789';
  if (useSymbol) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars[arr[i] % chars.length];
  }

  document.getElementById('password-output').value = pwd;
}

function generatePasswords(count) {
  const length = parseInt(document.getElementById('pwd-length').value);
  const useUpper = document.getElementById('pwd-upper').checked;
  const useLower = document.getElementById('pwd-lower').checked;
  const useNumber = document.getElementById('pwd-number').checked;
  const useSymbol = document.getElementById('pwd-symbol').checked;

  let chars = '';
  if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (useNumber) chars += '0123456789';
  if (useSymbol) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  const container = document.getElementById('password-batch');
  container.innerHTML = '';

  for (let p = 0; p < count; p++) {
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let pwd = '';
    for (let i = 0; i < length; i++) pwd += chars[arr[i] % chars.length];

    const div = document.createElement('div');
    div.className = 'batch-item';
    div.innerHTML = `<span>${pwd}</span><button class="btn btn-ghost" onclick="this.previousElementSibling.textContent.length&&navigator.clipboard.writeText(this.previousElementSibling.textContent)">复制</button>`;
    container.appendChild(div);
  }
}

function copyPassword() {
  const pwd = document.getElementById('password-output').value;
  if (pwd) navigator.clipboard.writeText(pwd);
}

// ==========================================
//  Color Converter
// ==========================================
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function updateColorPreview(hex) {
  document.getElementById('color-preview').style.background = hex;
}

function syncColor(r, g, b) {
  const hex = rgbToHex(r, g, b);
  const [h, s, l] = rgbToHsl(r, g, b);
  document.getElementById('color-hex').value = hex;
  document.getElementById('color-r').value = r;
  document.getElementById('color-g').value = g;
  document.getElementById('color-b').value = b;
  document.getElementById('color-h').value = h;
  document.getElementById('color-s').value = s;
  document.getElementById('color-l').value = l;
  document.getElementById('color-picker').value = hex;
  updateColorPreview(hex);
}

function convertFromHex() {
  let hex = document.getElementById('color-hex').value.trim();
  if (!/^#?[0-9a-fA-F]{3,6}$/.test(hex)) return;
  if (!hex.startsWith('#')) hex = '#' + hex;
  const [r, g, b] = hexToRgb(hex);
  syncColor(r, g, b);
}

function convertFromRGB() {
  const r = Math.min(255, Math.max(0, parseInt(document.getElementById('color-r').value) || 0));
  const g = Math.min(255, Math.max(0, parseInt(document.getElementById('color-g').value) || 0));
  const b = Math.min(255, Math.max(0, parseInt(document.getElementById('color-b').value) || 0));
  syncColor(r, g, b);
}

function convertFromHSL() {
  const h = Math.min(360, Math.max(0, parseInt(document.getElementById('color-h').value) || 0));
  const s = Math.min(100, Math.max(0, parseInt(document.getElementById('color-s').value) || 0));
  const l = Math.min(100, Math.max(0, parseInt(document.getElementById('color-l').value) || 0));
  const [r, g, b] = hslToRgb(h, s, l);
  syncColor(r, g, b);
}

function convertFromPicker() {
  const hex = document.getElementById('color-picker').value;
  const [r, g, b] = hexToRgb(hex);
  syncColor(r, g, b);
}

function copyColorValue(type) {
  let text = '';
  if (type === 'hex') {
    text = document.getElementById('color-hex').value;
  } else if (type === 'rgb') {
    const r = document.getElementById('color-r').value;
    const g = document.getElementById('color-g').value;
    const b = document.getElementById('color-b').value;
    text = `rgb(${r}, ${g}, ${b})`;
  } else if (type === 'hsl') {
    const h = document.getElementById('color-h').value;
    const s = document.getElementById('color-s').value;
    const l = document.getElementById('color-l').value;
    text = `hsl(${h}, ${s}%, ${l}%)`;
  }
  if (text) navigator.clipboard.writeText(text);
}
