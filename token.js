const MAX_STAMPS = 10;

// Luhnチェック
function isValidToken(token) {
  const digits = token.split('').reverse().map(Number);
  const checksum = digits.reduce((sum, digit, i) => {
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    return sum + digit;
  }, 0);
  return checksum % 10 === 0;
}

// Customer側: トークン処理
function submitToken() {
  const token = document.getElementById('tokenInput').value.trim();
  if (isValidToken(token)) {
    let stamps = parseInt(localStorage.getItem('tata_stamps') || '0', 10);
    if (stamps < MAX_STAMPS) {
      stamps += 1;
      localStorage.setItem('tata_stamps', stamps);
      alert('スタンプが追加されました！');
      location.reload();
    } else {
      alert('すでに最大数です');
    }
  } else {
    alert('無効なコードです');
  }
}

// Customer側: スタンプ表示
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('stamps')) {
    const container = document.getElementById('stamps');
    let stamps = parseInt(localStorage.getItem('tata_stamps') || '0', 10);
    for (let i = 1; i <= MAX_STAMPS; i++) {
      const el = document.createElement('div');
      el.className = 'stamp' + (i <= stamps ? ' filled' : '');
      el.textContent = i <= stamps ? '★' : i;
      container.appendChild(el);
    }
    if (stamps >= MAX_STAMPS) {
      document.getElementById('message').textContent = '🎉 ケーキ1つ無料！';
    }
  }
});

// Staff側: トークン生成とQR表示
function generateToken() {
  const random = () => Math.floor(Math.random() * 9) + 1;
  let digits = Array.from({ length: 7 }, random);
  const sum = digits
    .slice()
    .reverse()
    .map((d, i) => {
      if (i % 2 === 0) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      return d;
    })
    .reduce((a, b) => a + b, 0);
  const checkDigit = (10 - (sum % 10)) % 10;
  digits.push(checkDigit);
  const token = digits.join('');

  document.getElementById('token').textContent = token;

  const qr = new QRious({
    element: document.getElementById('qrcode'),
    value: token,
    size: 200
  });
}