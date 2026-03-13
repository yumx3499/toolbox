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

// ==========================================
//  OpenClaw Config Generator
// ==========================================

const OC_PROVIDER_DEFAULTS = {
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    model: 'anthropic/claude-sonnet-4'
  },
  google: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.5-pro-preview'
  },
  dashscope: {
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-max'
  },
  custom: {
    baseURL: '',
    model: ''
  }
};

// Provider 切换时自动填充默认值
document.getElementById('oc-provider').addEventListener('change', function () {
  const defaults = OC_PROVIDER_DEFAULTS[this.value];
  if (defaults) {
    document.getElementById('oc-model-id').placeholder = defaults.model || '输入模型 ID';
    document.getElementById('oc-api-base').placeholder = defaults.baseURL || '输入 API Base URL';
  }
});

// 渠道开关联动
document.getElementById('oc-discord-enabled').addEventListener('change', function () {
  document.getElementById('oc-discord-fields').style.display = this.checked ? '' : 'none';
});
document.getElementById('oc-telegram-enabled').addEventListener('change', function () {
  document.getElementById('oc-telegram-fields').style.display = this.checked ? '' : 'none';
});
document.getElementById('oc-websearch-enabled').addEventListener('change', function () {
  document.getElementById('oc-websearch-fields').style.display = this.checked ? '' : 'none';
});
document.getElementById('oc-webfetch-enabled').addEventListener('change', function () {
  document.getElementById('oc-webfetch-fields').style.display = this.checked ? '' : 'none';
});

// 初始化隐藏子字段
(function initOpenClawFields() {
  document.getElementById('oc-discord-fields').style.display = 'none';
  document.getElementById('oc-telegram-fields').style.display = 'none';
})();

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
  if (!apiBase) apiBase = OC_PROVIDER_DEFAULTS[provider].baseURL;

  const port = parseInt(document.getElementById('oc-port').value) || 18789;
  const mode = document.getElementById('oc-mode').value;
  const authToken = document.getElementById('oc-auth-token').value.trim();

  const discordEnabled = document.getElementById('oc-discord-enabled').checked;
  const discordToken = document.getElementById('oc-discord-token').value.trim();
  const telegramEnabled = document.getElementById('oc-telegram-enabled').checked;
  const telegramToken = document.getElementById('oc-telegram-token').value.trim();

  const websearchEnabled = document.getElementById('oc-websearch-enabled').checked;
  const braveKey = document.getElementById('oc-brave-key').value.trim();
  const webfetchEnabled = document.getElementById('oc-webfetch-enabled').checked;
  const webfetchMaxChars = parseInt(document.getElementById('oc-webfetch-maxchars').value) || 50000;

  const config = {
    models: {
      default: {
        provider: provider,
        model: modelId,
        apiKey: apiKey,
        temperature: 0.7,
        maxTokens: 8192,
        contextWindow: 200000
      }
    },
    gateway: {
      port: port,
      mode: mode,
      authToken: authToken || undefined
    },
    channels: {},
    tools: {}
  };

  if (apiBase) config.models.default.baseURL = apiBase;

  if (discordEnabled && discordToken) {
    config.channels.discord = {
      enabled: true,
      token: discordToken
    };
  }

  if (telegramEnabled && telegramToken) {
    config.channels.telegram = {
      enabled: true,
      token: telegramToken
    };
  }

  if (websearchEnabled) {
    config.tools.webSearch = {
      enabled: true,
      braveApiKey: braveKey || undefined
    };
  }

  if (webfetchEnabled) {
    config.tools.webFetch = {
      enabled: true,
      maxChars: webfetchMaxChars
    };
  }

  // 清理 undefined
  return JSON.parse(JSON.stringify(config));
}

function generateOpenClawConfig() {
  const config = getOpenClawConfig();
  const output = document.getElementById('oc-output');
  output.value = JSON.stringify(config, null, 2);
}

function copyOpenClawConfig() {
  const output = document.getElementById('oc-output');
  if (!output.value) {
    generateOpenClawConfig();
  }
  if (output.value) navigator.clipboard.writeText(output.value);
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

  // 解析模型配置
  if (json.models && json.models.default) {
    const m = json.models.default;
    if (m.provider) {
      document.getElementById('oc-provider').value = m.provider;
    }
    if (m.model) {
      document.getElementById('oc-model-id').value = m.model;
    }
    if (m.apiKey) {
      document.getElementById('oc-api-key').value = m.apiKey;
    }
    if (m.baseURL) {
      document.getElementById('oc-api-base').value = m.baseURL;
    }
  }

  // 解析网关配置
  if (json.gateway) {
    if (json.gateway.port) {
      document.getElementById('oc-port').value = json.gateway.port;
    }
    if (json.gateway.mode) {
      document.getElementById('oc-mode').value = json.gateway.mode;
    }
    if (json.gateway.authToken) {
      document.getElementById('oc-auth-token').value = json.gateway.authToken;
    }
  }

  // 解析渠道配置
  if (json.channels) {
    if (json.channels.discord) {
      document.getElementById('oc-discord-enabled').checked = json.channels.discord.enabled !== false;
      document.getElementById('oc-discord-fields').style.display = json.channels.discord.enabled !== false ? '' : 'none';
      if (json.channels.discord.token) {
        document.getElementById('oc-discord-token').value = json.channels.discord.token;
      }
    }
    if (json.channels.telegram) {
      document.getElementById('oc-telegram-enabled').checked = json.channels.telegram.enabled !== false;
      document.getElementById('oc-telegram-fields').style.display = json.channels.telegram.enabled !== false ? '' : 'none';
      if (json.channels.telegram.token) {
        document.getElementById('oc-telegram-token').value = json.channels.telegram.token;
      }
    }
  }

  // 解析工具配置
  if (json.tools) {
    if (json.tools.webSearch) {
      document.getElementById('oc-websearch-enabled').checked = json.tools.webSearch.enabled !== false;
      document.getElementById('oc-websearch-fields').style.display = json.tools.webSearch.enabled !== false ? '' : 'none';
      if (json.tools.webSearch.braveApiKey) {
        document.getElementById('oc-brave-key').value = json.tools.webSearch.braveApiKey;
      }
    }
    if (json.tools.webFetch) {
      document.getElementById('oc-webfetch-enabled').checked = json.tools.webFetch.enabled !== false;
      document.getElementById('oc-webfetch-fields').style.display = json.tools.webFetch.enabled !== false ? '' : 'none';
      if (json.tools.webFetch.maxChars) {
        document.getElementById('oc-webfetch-maxchars').value = json.tools.webFetch.maxChars;
      }
    }
  }

  // 同步生成输出
  generateOpenClawConfig();
}
