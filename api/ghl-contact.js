// api/ghl-contact.js — Vercel serverless function
// Proxies lead submissions to GoHighLevel so the private token
// never touches the browser.

module.exports = async function handler(req, res) {
  // Allow requests from the same domain (Vercel handles CORS automatically,
  // but explicit headers protect against misconfigured deployments)
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const { firstName, lastName, email, source,resourceName } = req.body || {};

  // Validate required fields
  if (!firstName || !firstName.trim()) {
    return res.status(400).json({ error: 'firstName is required' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  const token      = process.env.GHL_PRIVATE_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!token || !locationId) {
    console.error('[ghl-contact] Missing env vars GHL_PRIVATE_TOKEN / GHL_LOCATION_ID');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const ghlRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
        'Version':       '2021-07-28'
      },
      body: JSON.stringify({
        firstName:  firstName.trim(),
        lastName:   (lastName || '').trim(),
        email:      email.toLowerCase().trim(),
        locationId: locationId,
        source:     source || 'ai-savvy-founders-website',
        tags:       ['website-lead', 'ai-savvy-founders', `resource-${resourceName}`]
      })
    });

    // 201 = created, 422 = duplicate contact (both are fine for us)
    if (ghlRes.ok || ghlRes.status === 422) {
      return res.status(200).json({ ok: true });
    }

    const body = await ghlRes.text();
    console.error('[ghl-contact] GHL error', ghlRes.status, body);
    // Return 200 to the client — don't block the UX on a CRM error
    return res.status(200).json({ ok: false, message: 'CRM save failed' });

  } catch (err) {
    console.error('[ghl-contact] Fetch error:', err.message);
    return res.status(200).json({ ok: false, message: 'Network error' });
  }
};
