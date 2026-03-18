// ==========================================
//  Toast 通知
// ==========================================
function showToast(msg, duration = 1800) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), duration);
}

function copyText(id) {
  const el = document.getElementById(id);
  const val = el.value || el.textContent;
  if (!val) return;
  navigator.clipboard.writeText(val).then(() => showToast('✅ 已复制'));
}

// ==========================================
//  Sidebar switching
// ==========================================
document.querySelectorAll('.sidebar-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelector('.sidebar-item.active').classList.remove('active');
    document.querySelector('.panel.active').classList.remove('active');
    item.classList.add('active');
    document.getElementById('panel-' + item.dataset.tab).classList.add('active');
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

function clearJSON() {
  document.getElementById('json-input').value = '';
  document.getElementById('json-output').value = '';
  document.getElementById('json-error').textContent = '';
}

// ==========================================
//  QR Code Generator
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
    showToast('✅ QR 码已生成');
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
    div.innerHTML = `<span>${pwd}</span><button class="btn btn-ghost" onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent).then(()=>showToast('✅ 已复制'))">复制</button>`;
    container.appendChild(div);
  }
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
  if (text) navigator.clipboard.writeText(text).then(() => showToast('✅ 已复制'));
}

// ==========================================
//  Base64 编解码
// ==========================================
function base64Encode() {
  const input = document.getElementById('base64-input').value;
  const errorEl = document.getElementById('base64-error');
  errorEl.textContent = '';
  if (!input) { document.getElementById('base64-output').value = ''; return; }
  try {
    document.getElementById('base64-output').value = btoa(unescape(encodeURIComponent(input)));
  } catch (e) {
    errorEl.textContent = '❌ 编码失败: ' + e.message;
  }
}

function base64Decode() {
  const input = document.getElementById('base64-input').value.trim();
  const errorEl = document.getElementById('base64-error');
  errorEl.textContent = '';
  if (!input) { document.getElementById('base64-output').value = ''; return; }
  try {
    document.getElementById('base64-output').value = decodeURIComponent(escape(atob(input)));
  } catch (e) {
    errorEl.textContent = '❌ 解码失败，输入不是有效的 Base64';
  }
}

function swapBase64() {
  const a = document.getElementById('base64-input');
  const b = document.getElementById('base64-output');
  [a.value, b.value] = [b.value, a.value];
}

// ==========================================
//  时间戳转换
// ==========================================
function pad2(n) { return String(n).padStart(2, '0'); }

function fillTimestampFields(ts) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return;
  document.getElementById('ts-seconds').value = Math.floor(ts / 1000);
  document.getElementById('ts-millis').value = ts;
  document.getElementById('ts-utc').value = d.toISOString().replace('T', ' ').replace('Z', ' UTC');
  // Beijing time (UTC+8)
  const cst = new Date(ts + 8 * 3600000);
  const y = cst.getUTCFullYear();
  const m = pad2(cst.getUTCMonth() + 1);
  const day = pad2(cst.getUTCDate());
  const h = pad2(cst.getUTCHours());
  const min = pad2(cst.getUTCMinutes());
  const s = pad2(cst.getUTCSeconds());
  document.getElementById('ts-cst').value = `${y}-${m}-${day} ${h}:${min}:${s}`;
  document.getElementById('ts-iso').value = d.toISOString();
}

function tsNow() {
  fillTimestampFields(Date.now());
}

function tsFromInput() {
  const secVal = document.getElementById('ts-seconds').value.trim();
  const msVal = document.getElementById('ts-millis').value.trim();
  if (msVal) {
    fillTimestampFields(parseInt(msVal));
  } else if (secVal) {
    fillTimestampFields(parseInt(secVal) * 1000);
  }
}

function tsFromManual() {
  const val = document.getElementById('ts-manual').value.trim();
  if (!val) return;
  const ts = new Date(val.replace(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})/, '$1T$2+08:00')).getTime();
  if (!isNaN(ts)) fillTimestampFields(ts);
}

// ==========================================
//  URL 编解码
// ==========================================
function urlEncode() {
  const input = document.getElementById('url-input').value;
  const errorEl = document.getElementById('url-error');
  errorEl.textContent = '';
  if (!input) { document.getElementById('url-output').value = ''; return; }
  try {
    document.getElementById('url-output').value = encodeURIComponent(input);
  } catch (e) {
    errorEl.textContent = '❌ 编码失败: ' + e.message;
  }
}

function urlDecode() {
  const input = document.getElementById('url-input').value.trim();
  const errorEl = document.getElementById('url-error');
  errorEl.textContent = '';
  if (!input) { document.getElementById('url-output').value = ''; return; }
  try {
    document.getElementById('url-output').value = decodeURIComponent(input);
  } catch (e) {
    errorEl.textContent = '❌ 解码失败: ' + e.message;
  }
}

function swapUrl() {
  const a = document.getElementById('url-input');
  const b = document.getElementById('url-output');
  [a.value, b.value] = [b.value, a.value];
}

// ==========================================
//  UUID 生成器
// ==========================================
function generateUUID() {
  const uuid = crypto.randomUUID();
  document.getElementById('uuid-output').value = uuid;
}

function generateUUIDs(count) {
  const container = document.getElementById('uuid-batch');
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const uuid = crypto.randomUUID();
    const div = document.createElement('div');
    div.className = 'batch-item';
    div.innerHTML = `<span>${uuid}</span><button class="btn btn-ghost" onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent).then(()=>showToast('✅ 已复制'))">复制</button>`;
    container.appendChild(div);
  }
}

// ==========================================
//  Hash 生成器
// ==========================================
let currentHashAlgo = 'sha256';

function setHashAlgo(btn) {
  document.querySelectorAll('.hash-algo-btns .btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentHashAlgo = btn.dataset.algo;
}

async function computeHash() {
  const input = document.getElementById('hash-input').value;
  if (!input) return;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  let hashBuffer;
  try {
    hashBuffer = await crypto.subtle.digest(currentHashAlgo, data);
  } catch (e) {
    // fallback for md5 not in SubtleCrypto
    document.getElementById('hash-output-lower').value = '❌ 不支持此算法: ' + e.message;
    document.getElementById('hash-output-upper').value = '';
    return;
  }

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  document.getElementById('hash-output-lower').value = hashHex;
  document.getElementById('hash-output-upper').value = hashHex.toUpperCase();
}

// MD5 fallback using a pure JS implementation
function md5(string) {
  function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);d = ff(d, a, b, c, k[1], 12, -389564586);c = ff(c, d, a, b, k[2], 17, 606105819);b = ff(b, c, d, a, k[3], 22, -1044525330);a = ff(a, b, c, d, k[4], 7, -176418897);d = ff(d, a, b, c, k[5], 12, 1200080426);c = ff(c, d, a, b, k[6], 17, -1473231341);b = ff(b, c, d, a, k[7], 22, -45705983);a = ff(a, b, c, d, k[8], 7, 1770035416);d = ff(d, a, b, c, k[9], 12, -1958414417);c = ff(c, d, a, b, k[10], 17, -42063);b = ff(b, c, d, a, k[11], 22, -1990404162);a = ff(a, b, c, d, k[12], 7, 1804603682);d = ff(d, a, b, c, k[13], 12, -40341101);c = ff(c, d, a, b, k[14], 17, -1502002290);b = ff(b, c, d, a, k[15], 22, 1236535329);a = gg(a, b, c, d, k[1], 5, -165796510);d = gg(d, a, b, c, k[6], 9, -1069501632);c = gg(c, d, a, b, k[11], 14, 643717713);b = gg(b, c, d, a, k[0], 20, -373897302);a = gg(a, b, c, d, k[5], 5, -701558691);d = gg(d, a, b, c, k[10], 9, 38016083);c = gg(c, d, a, b, k[15], 14, -660478335);b = gg(b, c, d, a, k[4], 20, -405537848);a = gg(a, b, c, d, k[9], 5, 568446438);d = gg(d, a, b, c, k[14], 9, -1019803690);c = gg(c, d, a, b, k[3], 14, -187363961);b = gg(b, c, d, a, k[8], 20, 1163531501);a = gg(a, b, c, d, k[13], 5, -1444681467);d = gg(d, a, b, c, k[2], 9, -51403784);c = gg(c, d, a, b, k[7], 14, 1735328473);b = gg(b, c, d, a, k[12], 20, -1926607734);a = hh(a, b, c, d, k[5], 4, -378558);d = hh(d, a, b, c, k[8], 11, -2022574463);c = hh(c, d, a, b, k[11], 16, 1839030562);b = hh(b, c, d, a, k[14], 23, -35309556);a = hh(a, b, c, d, k[1], 4, -1530992060);d = hh(d, a, b, c, k[4], 11, 1272893353);c = hh(c, d, a, b, k[7], 16, -155497632);b = hh(b, c, d, a, k[10], 23, -1094730640);a = hh(a, b, c, d, k[13], 4, 681279174);d = hh(d, a, b, c, k[0], 11, -358537222);c = hh(c, d, a, b, k[3], 16, -722521979);b = hh(b, c, d, a, k[6], 23, 76029189);a = hh(a, b, c, d, k[9], 4, -640364487);d = hh(d, a, b, c, k[12], 11, -421815835);c = hh(c, d, a, b, k[15], 16, 530742520);b = hh(b, c, d, a, k[2], 23, -995338651);a = ii(a, b, c, d, k[0], 6, -198630844);d = ii(d, a, b, c, k[7], 10, 1126891415);c = ii(c, d, a, b, k[14], 15, -1416354905);b = ii(b, c, d, a, k[5], 21, -57434055);a = ii(a, b, c, d, k[12], 6, 1700485571);d = ii(d, a, b, c, k[3], 10, -1894986606);c = ii(c, d, a, b, k[10], 15, -1051523);b = ii(b, c, d, a, k[1], 21, -2054922799);a = ii(a, b, c, d, k[8], 6, 1873313359);d = ii(d, a, b, c, k[15], 10, -30611744);c = ii(c, d, a, b, k[6], 15, -1560198380);b = ii(b, c, d, a, k[13], 21, 1309151649);a = ii(a, b, c, d, k[4], 6, -145523070);d = ii(d, a, b, c, k[11], 10, -1120210379);c = ii(c, d, a, b, k[2], 15, 718787259);b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);x[1] = add32(b, x[1]);x[2] = add32(c, x[2]);x[3] = add32(d, x[3]);
  }
  function cmn(q,a,b,x,s,t){a=add32(add32(a,q),add32(x,t));return add32((a<<s)|(a>>>(32-s)),b);}
  function ff(a,b,c,d,x,s,t){return cmn((b&c)|((~b)&d),a,b,x,s,t);}
  function gg(a,b,c,d,x,s,t){return cmn((b&d)|(c&(~d)),a,b,x,s,t);}
  function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t);}
  function ii(a,b,c,d,x,s,t){return cmn(c^(b|(~d)),a,b,x,s,t);}
  function add32(a,b){return(a+b)&0xFFFFFFFF;}
  function md5blk(s){var md5blks=[],i;for(i=0;i<64;i+=4){md5blks[i>>2]=s.charCodeAt(i)+(s.charCodeAt(i+1)<<8)+(s.charCodeAt(i+2)<<16)+(s.charCodeAt(i+3)<<24);}return md5blks;}
  var n=s.length,s=[1732584193,-271733879,-1732584194,271733878],i;
  for(i=64;i<=n;i+=64){md5cycle(s,md5blk(s.substring(i-64,i)));}
  s=md5cycle(s,md5blk(s.substring(i-64,s.length+((17+n)%64))));
  var r='';
  for(i=0;i<4;i++)for(var j=0;j<4;j++)r+=hex.charAt((s[i]>>(j*8+4))&0x0F)+hex.charAt((s[i]>>(j*8))&0x0F);
  return r;
  var hex='0123456789abcdef';
}

// Override computeHash to include MD5 fallback
async function computeHash() {
  const input = document.getElementById('hash-input').value;
  if (!input) return;

  let hashHex;
  try {
    if (currentHashAlgo === 'md5') {
      hashHex = md5(input);
    } else {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest(currentHashAlgo, data);
      hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    document.getElementById('hash-output-lower').value = hashHex;
    document.getElementById('hash-output-upper').value = hashHex.toUpperCase();
  } catch (e) {
    document.getElementById('hash-output-lower').value = '❌ ' + e.message;
    document.getElementById('hash-output-upper').value = '';
  }
}

// ==========================================
//  JWT 解码器
// ==========================================
function decodeJWT() {
  const input = document.getElementById('jwt-input').value.trim();
  const errorEl = document.getElementById('jwt-error');
  const headerEl = document.getElementById('jwt-header');
  const payloadEl = document.getElementById('jwt-payload');
  errorEl.textContent = '';
  headerEl.value = '';
  payloadEl.value = '';

  if (!input) return;

  const parts = input.split('.');
  if (parts.length !== 3) {
    errorEl.textContent = '❌ JWT 格式错误，应由 3 个 Base64 段组成';
    return;
  }

  function decodeB64Url(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return decodeURIComponent(escape(atob(str)));
  }

  try {
    const header = JSON.parse(decodeB64Url(parts[0]));
    headerEl.value = JSON.stringify(header, null, 2);
  } catch (e) {
    errorEl.textContent = '❌ Header 解码失败: ' + e.message;
    return;
  }

  try {
    const payload = JSON.parse(decodeB64Url(parts[1]));
    payloadEl.value = JSON.stringify(payload, null, 2);
  } catch (e) {
    errorEl.textContent = '❌ Payload 解码失败: ' + e.message;
    return;
  }
}

function clearJWT() {
  document.getElementById('jwt-input').value = '';
  document.getElementById('jwt-header').value = '';
  document.getElementById('jwt-payload').value = '';
  document.getElementById('jwt-error').textContent = '';
}

// ==========================================
//  OpenClaw Config Generator (v2 schema)
// ==========================================
const OC_PROVIDER_DEFAULTS = {
  openrouter: { baseURL: 'https://openrouter.ai/api/v1', model: 'anthropic/claude-sonnet-4' },
  dashscope: { baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-max' },
  google: { baseURL: 'https://generativelanguage.googleapis.com/v1beta', model: 'gemini-2.5-pro-preview' },
  siliconflow: { baseURL: 'https://api.siliconflow.cn/v1', model: 'deepseek-ai/DeepSeek-V3' },
  custom: { baseURL: '', model: '' }
};

document.getElementById('oc-provider').addEventListener('change', function () {
  const d = OC_PROVIDER_DEFAULTS[this.value];
  if (d) {
    document.getElementById('oc-model-id').placeholder = d.model;
    document.getElementById('oc-api-base').placeholder = d.baseURL;
  }
});

document.getElementById('oc-nextcloud-enabled').addEventListener('change', function () {
  document.getElementById('oc-nextcloud-fields').style.display = this.checked ? '' : 'none';
});

function generateAuthToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const arr = new Uint32Array(32);
  crypto.getRandomValues(arr);
  let token = '';
  for (let i = 0; i < 32; i++) token += chars[arr[i] % chars.length];
  document.getElementById('oc-auth-token').value = token;
}

function getOpenClawConfig() {
  const provider = document.getElementById('oc-provider').value;
  const modelId = document.getElementById('oc-model-id').value.trim() || OC_PROVIDER_DEFAULTS[provider].model;
  const apiKey = document.getElementById('oc-api-key').value.trim();
  let apiBase = document.getElementById('oc-api-base').value.trim();
  if (!apiBase && OC_PROVIDER_DEFAULTS[provider]) apiBase = OC_PROVIDER_DEFAULTS[provider].baseURL;

  const port = parseInt(document.getElementById('oc-port').value) || 18789;
  const mode = document.getElementById('oc-mode').value;
  const authToken = document.getElementById('oc-auth-token').value.trim();

  const ncEnabled = document.getElementById('oc-nextcloud-enabled').checked;
  const ncUrl = document.getElementById('oc-nextcloud-url').value.trim();
  const ncSecret = document.getElementById('oc-nextcloud-secret').value.trim();
  const ncUser = document.getElementById('oc-nextcloud-user').value.trim() || 'admin';
  const ncPass = document.getElementById('oc-nextcloud-pass').value.trim();
  const ncRoom = document.getElementById('oc-nextcloud-room').value.trim();
  const ncWebhook = document.getElementById('oc-nextcloud-webhook').value.trim();

  const websearchEnabled = document.getElementById('oc-websearch-enabled').checked;
  const braveKey = document.getElementById('oc-brave-key').value.trim();

  // Build in-memory provider config format (matches actual openclaw.json)
  const config = {
    meta: {
      lastTouchedVersion: '',
      lastTouchedAt: new Date().toISOString()
    },
    models: {
      mode: 'merge',
      providers: {}
    },
    agents: {
      defaults: {
        model: {
          primary: `${provider === 'dashscope' ? 'dashscope' : provider}/${modelId.replace(/.*\//, '')}`
        }
      }
    },
    tools: {
      web: {
        search: {
          enabled: websearchEnabled,
          provider: 'brave',
          apiKey: braveKey || undefined
        }
      }
    },
    gateway: {
      port: port,
      mode: mode,
      auth: {
        mode: authToken ? 'token' : undefined,
        token: authToken || undefined
      }
    },
    channels: {}
  };

  // Fix primary model reference
  if (provider === 'openrouter') {
    config.agents.defaults.model.primary = 'openrouter/' + modelId.replace('openrouter/', '');
  } else if (provider === 'dashscope') {
    config.agents.defaults.model.primary = 'dashscope/' + modelId.replace('dashscope/', '');
  } else {
    config.agents.defaults.model.primary = modelId;
  }

  // Build provider entry
  const providerEntry = {
    baseUrl: apiBase || OC_PROVIDER_DEFAULTS[provider]?.baseURL || '',
    apiKey: apiKey || '__YOUR_API_KEY__',
    api: 'openai-completions',
    models: [{
      id: modelId,
      name: modelId,
      contextWindow: 200000,
      maxTokens: 65536
    }]
  };
  config.models.providers[provider] = providerEntry;

  // Nextcloud Talk channel
  if (ncEnabled && ncUrl && ncSecret) {
    config.channels['nextcloud-talk'] = {
      enabled: true,
      baseUrl: ncUrl,
      botSecret: ncSecret,
      apiUser: ncUser,
      apiPassword: ncPass || undefined,
      dmPolicy: 'open',
      groupPolicy: 'open',
      rooms: ncRoom ? { [ncRoom]: { requireMention: false } } : undefined,
      webhookPublicUrl: ncWebhook || undefined
    };
    config.channels.modelByChannel = {
      'nextcloud-talk': {
        '*': config.agents.defaults.model.primary
      }
    };
  }

  return JSON.parse(JSON.stringify(config)); // clean undefined
}

function generateOpenClawConfig() {
  const config = getOpenClawConfig();
  document.getElementById('oc-output').value = JSON.stringify(config, null, 2);
}

function downloadOpenClawConfig() {
  const output = document.getElementById('oc-output');
  if (!output.value) generateOpenClawConfig();
  if (!output.value) return;
  const blob = new Blob([output.value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'openclaw.json';
  a.click();
  URL.revokeObjectURL(url);
}

function parseOpenClawJson() {
  const input = document.getElementById('oc-paste-input').value.trim();
  if (!input) return;
  let json;
  try {
    json = JSON.parse(input);
  } catch (e) {
    alert('JSON 解析失败: ' + e.message);
    return;
  }

  // Parse providers
  if (json.models && json.models.providers) {
    const providers = json.models.providers;
    const firstKey = Object.keys(providers)[0];
    if (firstKey) {
      document.getElementById('oc-provider').value = firstKey;
      const p = providers[firstKey];
      if (p.apiKey) document.getElementById('oc-api-key').value = p.apiKey;
      if (p.baseUrl) document.getElementById('oc-api-base').value = p.baseUrl;
      if (p.models && p.models[0] && p.models[0].id) {
        document.getElementById('oc-model-id').value = p.models[0].id;
      }
    }
  }

  // Parse gateway
  if (json.gateway) {
    if (json.gateway.port) document.getElementById('oc-port').value = json.gateway.port;
    if (json.gateway.mode) document.getElementById('oc-mode').value = json.gateway.mode;
    if (json.gateway.auth && json.gateway.auth.token) {
      document.getElementById('oc-auth-token').value = json.gateway.auth.token;
    }
  }

  // Parse nextcloud-talk
  if (json.channels && json.channels['nextcloud-talk']) {
    const nc = json.channels['nextcloud-talk'];
    document.getElementById('oc-nextcloud-enabled').checked = true;
    document.getElementById('oc-nextcloud-fields').style.display = '';
    if (nc.baseUrl) document.getElementById('oc-nextcloud-url').value = nc.baseUrl;
    if (nc.botSecret) document.getElementById('oc-nextcloud-secret').value = nc.botSecret;
    if (nc.apiUser) document.getElementById('oc-nextcloud-user').value = nc.apiUser;
    if (nc.apiPassword) document.getElementById('oc-nextcloud-pass').value = nc.apiPassword;
    if (nc.rooms) {
      const roomKey = Object.keys(nc.rooms)[0];
      if (roomKey) document.getElementById('oc-nextcloud-room').value = roomKey;
    }
    if (nc.webhookPublicUrl) document.getElementById('oc-nextcloud-webhook').value = nc.webhookPublicUrl;
  }

  // Parse web search
  if (json.tools && json.tools.web && json.tools.web.search) {
    const ws = json.tools.web.search;
    document.getElementById('oc-websearch-enabled').checked = ws.enabled !== false;
    document.getElementById('oc-websearch-fields').style.display = ws.enabled !== false ? '' : 'none';
    if (ws.apiKey) document.getElementById('oc-brave-key').value = ws.apiKey;
  }

  generateOpenClawConfig();
}

// ==========================================
//  Init
// ==========================================
(function init() {
  document.getElementById('oc-nextcloud-fields').style.display = 'none';
})();
