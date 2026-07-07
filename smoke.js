// #37 CI smoke test — mounts index.html headlessly and asserts it boots clean.
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');
const errs = [];
const vc = new VirtualConsole().on('jsdomError', e => errs.push(e.detail ? e.detail.message : e.message));
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'https://coachmile.local/' });
setTimeout(() => {
  const root = dom.window.document.getElementById('root');
  const txt = root ? root.textContent : '';
  const mounted = /Welcome to CoachMile|How's your energy/.test(txt);
  const bootGone = !/LOADING COACHMILE/.test(txt);
  if (errs.length) { console.error('FAIL: runtime errors:\n' + errs.join('\n')); process.exit(1); }
  if (!mounted) { console.error('FAIL: app did not mount'); process.exit(1); }
  if (!bootGone) { console.error('FAIL: stuck on boot screen'); process.exit(1); }
  console.log('PASS: CoachMile mounts clean, no errors');
  process.exit(0);
}, 1500);
