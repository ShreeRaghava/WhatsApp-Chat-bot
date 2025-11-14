import fetch from 'node-fetch';
(async () => {
  const url = 'http://localhost:8080/';
  const payload = { order_id: 'ORD-TEST-123', phone_number: '9999999999' };
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    console.log('status', res.status);
    console.log(await res.text());
  } catch (e) {
    console.error('error connecting to local function', e);
  }
})();
