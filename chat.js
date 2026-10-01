// Stellas assistant: a floating chat that answers common questions instantly
// and hands visitors over to Stella on WhatsApp. Runs fully in the browser,
// so it works on any static host with no server or API key.
(function () {
  var ID = document.documentElement.lang === 'id';
  var WA = 'https://wa.me/62811181901?text=';
  function t(en, id) { return ID ? id : en; }
  function wa(msg) { return WA + encodeURIComponent(msg); }

  // Each answer: keywords (both languages), reply text, optional links.
  var KB = [
    { k: ['price', 'pricing', 'cost', 'how much', 'harga', 'biaya', 'berapa', 'tarif', 'paket', 'package'],
      a: t('Websites are a one-time price: Starter Rp 3.000.000, Business Rp 5.000.000 and Pro Rp 7.000.000, with domain and hosting for the first year included.',
           'Website sekali bayar: Starter Rp 3.000.000, Business Rp 5.000.000, dan Pro Rp 7.000.000, sudah termasuk domain dan hosting tahun pertama.'),
      l: [{ h: 'pricing.html', x: t('See all prices', 'Lihat semua harga') }] },
    { k: ['whatsapp bot', 'chatbot', 'bot', 'assistant', 'asisten', 'ai', 'auto reply', 'balas otomatis', 'otomatis'],
      a: t('The WhatsApp AI assistant answers customers, takes orders and books appointments. Plans start at Rp 500.000/month plus a one-time setup from Rp 2.000.000.',
           'Asisten AI WhatsApp menjawab pelanggan, menerima pesanan, dan mencatat janji temu. Paket mulai Rp 500.000/bulan plus biaya setup sekali mulai Rp 2.000.000.'),
      l: [{ h: 'pricing.html', x: t('Compare assistant plans', 'Bandingkan paket asisten') }] },
    { k: ['how long', 'time', 'timeline', 'days', 'fast', 'when', 'lama', 'berapa hari', 'waktu', 'cepat', 'kapan'],
      a: t('Most websites go live in about 7 working days: a free call on day 1, your materials on day 2, build and review on days 3 to 6, launch on day 7.',
           'Kebanyakan website online dalam sekitar 7 hari kerja: konsultasi gratis di hari 1, kirim materi di hari 2, pengerjaan dan review di hari 3–6, online di hari 7.') },
    { k: ['own', 'ownership', 'domain', 'my name', 'milik', 'punya', 'atas nama'],
      a: t('Yes, you own everything. The domain is registered in your name, and if you ever leave, I hand over every file and login.',
           'Ya, semuanya milik Anda. Domain didaftarkan atas nama Anda, dan jika suatu saat Anda berhenti, semua file dan akses login saya serahkan.') },
    { k: ['pay', 'payment', 'qris', 'transfer', 'deposit', 'bayar', 'pembayaran', 'dp'],
      a: t('You pay 50% to start and 50% at launch, by bank transfer or QRIS. Monthly plans are billed at the start of each month.',
           'Bayar 50% di awal dan 50% saat online, via transfer bank atau QRIS. Paket bulanan ditagih setiap awal bulan.') },
    { k: ['care', 'maintenance', 'hosting', 'update', 'backup', 'perawatan', 'maintenance bulanan'],
      a: t('Care plans keep your site fast and safe: Basic Care Rp 300.000/month (hosting, backups, 1 small edit) or Plus Care Rp 500.000/month (up to 4 edits and a visitor report).',
           'Paket perawatan menjaga website tetap cepat dan aman: Basic Care Rp 300.000/bulan (hosting, backup, 1 revisi kecil) atau Plus Care Rp 500.000/bulan (hingga 4 revisi dan laporan pengunjung).') },
    { k: ['portfolio', 'work', 'example', 'client', 'project', 'contoh', 'portofolio', 'klien', 'proyek', 'hasil'],
      a: t('Recent projects include Padi Villa Ubud (a Bali villa with direct booking), Playhouse Academy (a Jakarta preschool with tour booking) and FlaviaLux (an international luxury store).',
           'Proyek terbaru antara lain Padi Villa Ubud (vila di Bali dengan booking langsung), Playhouse Academy (prasekolah di Jakarta dengan booking tur), dan FlaviaLux (toko barang mewah internasional).'),
      l: [{ h: 'work.html', x: t('See the case studies', 'Lihat studi kasus') }] },
    { k: ['prepare', 'need', 'materials', 'send', 'siapkan', 'perlu', 'butuh', 'materi', 'kirim'],
      a: t('Just your logo, some photos and your list of services or products with prices. I write the text with AI help, and you approve every word.',
           'Cukup logo, beberapa foto, dan daftar layanan atau produk beserta harganya. Teksnya saya tulis dengan bantuan AI, dan Anda menyetujui setiap katanya.') },
    { k: ['cancel', 'stop', 'contract', 'berhenti', 'kontrak', 'batal'],
      a: t('You can cancel a monthly plan anytime with 30 days\' notice. There are no long contracts.',
           'Paket bulanan bisa dihentikan kapan saja dengan pemberitahuan 30 hari. Tanpa kontrak panjang.') },
    { k: ['official', 'meta', 'banned', 'safe', 'resmi', 'aman', 'blokir'],
      a: t('The assistant runs on the official WhatsApp Business Platform, so your number stays safe. Meta\'s small per-conversation fees are passed on at cost.',
           'Asisten berjalan di WhatsApp Business Platform resmi, jadi nomor Anda aman. Biaya kecil per percakapan dari Meta diteruskan sesuai tagihan, tanpa markup.') },
    { k: ['bundle', 'discount', 'promo', 'hemat', 'diskon', 'paket hemat'],
      a: t('The launch bundle combines a Business website and the Sell assistant for Rp 7.500.000 one-time instead of Rp 8.500.000, then Rp 1.300.000/month.',
           'Paket hemat menggabungkan website Business dan asisten Sell seharga Rp 7.500.000 sekali bayar (normalnya Rp 8.500.000), lalu Rp 1.300.000/bulan.'),
      l: [{ h: 'pricing.html', x: t('See the bundle', 'Lihat paket hemat') }] },
    { k: ['who', 'about', 'stella', 'experience', 'siapa', 'tentang', 'pengalaman'],
      a: t('I\'m Stella. I\'ve worked in digital since 2012, starting at GroupM (WPP) in Jakarta on websites and campaigns for brands like Unilever and HSBC.',
           'Saya Stella. Saya berkarier di dunia digital sejak 2012, berawal di GroupM (WPP) Jakarta untuk website dan kampanye brand seperti Unilever dan HSBC.'),
      l: [{ h: 'about.html', x: t('More about me', 'Tentang saya') }] },
    { k: ['human', 'talk', 'call', 'contact', 'consult', 'meeting', 'hubungi', 'ngobrol', 'konsultasi', 'telepon', 'bicara'],
      a: t('Happy to talk it through. Tap below to message me on WhatsApp, and I usually reply within a few hours on weekdays.',
           'Dengan senang hati. Klik di bawah untuk chat dengan saya di WhatsApp. Biasanya saya balas dalam beberapa jam di hari kerja.'),
      wa: true }
  ];

  var CHIPS = [
    { x: t('Prices', 'Harga'), q: 'price' },
    { x: t('WhatsApp assistant', 'Asisten WhatsApp'), q: 'chatbot' },
    { x: t('How long?', 'Berapa lama?'), q: 'how long' },
    { x: t('See past work', 'Lihat portofolio'), q: 'portfolio' },
    { x: t('Talk to Stella', 'Chat dengan Stella'), q: 'human' }
  ];

  function match(text) {
    var s = text.toLowerCase();
    var best = null, score = 0;
    KB.forEach(function (e) {
      var n = 0;
      e.k.forEach(function (k) {
        // whole-word match, so "ai" does not fire on "Bali" or "detail"
        var re = new RegExp('(^|[^a-z])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z]|$)');
        if (re.test(s)) n += k.length > 4 ? 2 : 1;
      });
      if (n > score) { score = n; best = e; }
    });
    return best;
  }

  // ---- UI ----
  var root = document.createElement('div');
  root.className = 'sa';
  root.innerHTML =
    '<div class="sa-panel" id="sa-panel" role="dialog" aria-label="' + t('Stellas assistant', 'Asisten Stellas') + '" hidden>' +
      '<div class="sa-head"><div class="sa-avatar" aria-hidden="true">S</div>' +
        '<div class="sa-title"><strong>' + t('Stellas assistant', 'Asisten Stellas') + '</strong>' +
        '<small>' + t('Instant answers · Stella on WhatsApp', 'Jawaban instan · Stella di WhatsApp') + '</small></div>' +
        '<button type="button" class="sa-close" aria-label="' + t('Close chat', 'Tutup chat') + '">×</button></div>' +
      '<div class="sa-log" aria-live="polite"></div>' +
      '<div class="sa-chips"></div>' +
      '<form class="sa-form"><label class="sa-sr" for="sa-input">' + t('Your question', 'Pertanyaan Anda') + '</label>' +
        '<input id="sa-input" type="text" autocomplete="off" placeholder="' + t('Ask about prices, timing…', 'Tanya soal harga, waktu…') + '">' +
        '<button type="submit" aria-label="' + t('Send', 'Kirim') + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>' +
    '</div>' +
    '<button type="button" class="sa-fab" aria-controls="sa-panel" aria-expanded="false" aria-label="' + t('Open chat', 'Buka chat') + '">' +
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"/><path d="M9 10h6M9 13.5h4"/></svg>' +
      '<span class="sa-dot" aria-hidden="true">1</span></button>';
  document.body.appendChild(root);

  var panel = root.querySelector('.sa-panel');
  var fab = root.querySelector('.sa-fab');
  var log = root.querySelector('.sa-log');
  var chips = root.querySelector('.sa-chips');
  var form = root.querySelector('.sa-form');
  var input = root.querySelector('#sa-input');
  var dot = root.querySelector('.sa-dot');
  var started = false;

  function bubble(who, text, links, showWa, lastQ) {
    var b = document.createElement('div');
    b.className = 'sa-msg ' + who;
    var p = document.createElement('p');
    p.textContent = text;
    b.appendChild(p);
    if (links || showWa) {
      var row = document.createElement('div');
      row.className = 'sa-links';
      (links || []).forEach(function (l) {
        var a = document.createElement('a'); a.href = l.h; a.textContent = l.x; row.appendChild(a);
      });
      if (showWa) {
        var w = document.createElement('a');
        w.href = wa(lastQ ? t('Hi Stella, I have a question: ', 'Halo Stella, saya mau tanya: ') + lastQ : t('Hi Stella, I\'d like a free consultation', 'Halo Stella, saya mau konsultasi gratis'));
        w.target = '_blank'; w.rel = 'noopener'; w.className = 'sa-wa';
        w.textContent = t('Chat on WhatsApp', 'Chat via WhatsApp');
        row.appendChild(w);
      }
      b.appendChild(row);
    }
    log.appendChild(b);
    log.scrollTop = log.scrollHeight;
  }

  function answer(q, label) {
    bubble('me', label || q);
    var e = match(q);
    setTimeout(function () {
      if (e) bubble('bot', e.a, e.l, !!e.wa || !e.l);
      else bubble('bot', t('Good question. I\'ll let Stella answer that one personally.', 'Pertanyaan bagus. Biar Stella yang menjawab langsung ya.'), null, true, q);
    }, 350);
  }

  CHIPS.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = c.x;
    b.addEventListener('click', function () { answer(c.q, c.x); });
    chips.appendChild(b);
  });

  function open() {
    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    dot.hidden = true;
    if (!started) {
      started = true;
      bubble('bot', t('Hi! I\'m the Stellas assistant. Ask me about prices, timing or past work, or pick a topic below.', 'Halo! Saya asisten Stellas. Tanyakan soal harga, waktu pengerjaan, atau portofolio, atau pilih topik di bawah.'));
    }
    input.focus();
  }
  function close() { panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); fab.focus(); }

  fab.addEventListener('click', function () { panel.hidden ? open() : close(); });
  root.querySelector('.sa-close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = '';
    answer(q);
  });
})();
