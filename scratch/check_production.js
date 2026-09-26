const https = require('https');

https.get('https://souq-al-ishtirakat.vercel.app/assets/index-BKU-Ke3k.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Script size:', data.length);
    console.log('Includes souq_master_admin_session:', data.includes('souq_master_admin_session'));
    console.log('Includes لوحة الإدارة:', data.includes('لوحة الإدارة'));
    console.log('Includes 01554826209:', data.includes('01554826209'));
    console.log('Includes لوحة المشرف:', data.includes('لوحة المشرف'));
    console.log('Includes tab=admin support:', data.includes('tabParam'));
  });
}).on('error', err => console.error(err));
