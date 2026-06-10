const puppeteer = require('puppeteer');
const fs = require('fs');

async function runTests() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const report = {
    public_pages: {},
    admin_dashboard: {},
    guru_dashboard: {},
    siswa_dashboard: {},
    wali_dashboard: {},
    errors: []
  };

  const baseUrl = 'http://localhost:3000';

  // Catch JS errors
  page.on('pageerror', err => {
    report.errors.push({ type: 'JS_ERROR', message: err.toString() });
  });

  page.on('response', response => {
    if (response.status() >= 400 && response.url().startsWith(baseUrl)) {
      report.errors.push({ type: 'HTTP_ERROR', status: response.status(), url: response.url() });
    }
  });

  async function visit(url) {
    console.log(`Visiting ${url}...`);
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle2' });
      return response.status();
    } catch (e) {
      report.errors.push({ type: 'NAV_ERROR', url, message: e.message });
      return 500;
    }
  }

  // 1. Test Public Pages
  const publicPaths = ['/', '/profil', '/visi-misi', '/berita', '/galeri', '/kontak', '/ppdb', '/login'];
  for (const p of publicPaths) {
    report.public_pages[p] = await visit(baseUrl + p);
  }

  // Helper to Login
  async function login(email, password) {
    await visit(baseUrl + '/login');
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', password);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);
  }

  // Helper to Logout
  async function logout() {
    const cookies = await page.cookies(baseUrl);
    await page.deleteCookie(...cookies);
  }

  // 2. Test Admin
  console.log('Testing Admin...');
  try {
    await login('admin@sdiasih.com', 'password123');
    const adminPaths = [
      '/dashboard/admin',
      '/dashboard/admin/siswa',
      '/dashboard/admin/guru',
      '/dashboard/admin/kelas',
      '/dashboard/admin/mapel',
      '/dashboard/admin/tahun-ajaran',
      '/dashboard/admin/jadwal',
      '/dashboard/admin/ppdb',
      '/dashboard/admin/pengumuman',
      '/dashboard/admin/berita',
      '/dashboard/admin/galeri',
      '/dashboard/admin/settings'
    ];
    for (const p of adminPaths) {
      report.admin_dashboard[p] = await visit(baseUrl + p);
    }
    await logout();
  } catch (e) {
    report.errors.push({ type: 'ADMIN_TEST_ERROR', message: e.message });
  }

  // 3. Test Guru
  console.log('Testing Guru...');
  try {
    await login('ahmad@sdiasih.com', 'password123');
    const guruPaths = [
      '/dashboard/guru',
      '/dashboard/guru/absensi',
      '/dashboard/guru/jadwal',
      '/dashboard/guru/materi',
      '/dashboard/guru/nilai'
    ];
    for (const p of guruPaths) {
      report.guru_dashboard[p] = await visit(baseUrl + p);
    }
    await logout();
  } catch (e) {
    report.errors.push({ type: 'GURU_TEST_ERROR', message: e.message });
  }

  // 4. Test Siswa
  console.log('Testing Siswa...');
  try {
    await login('budi@siswa.sdiasih.com', 'password123');
    const siswaPaths = [
      '/dashboard/siswa',
      '/dashboard/siswa/jadwal',
      '/dashboard/siswa/materi',
      '/dashboard/siswa/nilai',
      '/dashboard/siswa/pengumuman'
    ];
    for (const p of siswaPaths) {
      report.siswa_dashboard[p] = await visit(baseUrl + p);
    }
    await logout();
  } catch (e) {
    report.errors.push({ type: 'SISWA_TEST_ERROR', message: e.message });
  }

  // 5. Test Wali
  console.log('Testing Wali...');
  try {
    await login('ayah.budi@gmail.com', 'password123');
    const waliPaths = [
      '/dashboard/wali',
      '/dashboard/wali/absensi',
      '/dashboard/wali/nilai',
      '/dashboard/wali/pengumuman'
    ];
    for (const p of waliPaths) {
      report.wali_dashboard[p] = await visit(baseUrl + p);
    }
    await logout();
  } catch (e) {
    report.errors.push({ type: 'WALI_TEST_ERROR', message: e.message });
  }

  await browser.close();
  
  fs.writeFileSync('test_report.json', JSON.stringify(report, null, 2));
  console.log('Tests completed. Wrote test_report.json');
}

runTests().catch(console.error);
