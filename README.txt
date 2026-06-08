LOREMHOST BADAK WA - Vercel + Supabase

Domain target:
https://loremhostbadakwa.vercel.app

Endpoint APK:
https://loremhostbadakwa.vercel.app/osea/datauser.json

1. Buat project Supabase.
2. Buka SQL Editor Supabase.
3. Jalankan file:
   sql/supabase.sql

4. Upload/deploy folder ini ke Vercel.

5. Isi Environment Variables di Vercel:
   SUPABASE_URL=isi_url_project_supabase
   SUPABASE_SERVICE_ROLE_KEY=isi_service_role_key_supabase
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=lrmhstzz123
   ADMIN_SECRET=isi_random_panjang_bebas

6. Redeploy project.

7. Buka admin:
   https://loremhostbadakwa.vercel.app

8. Buka endpoint data user:
   https://loremhostbadakwa.vercel.app/osea/datauser.json

Format JSON yang keluar:
[
  {
    "username": "gioperm88",
    "password": "3180bot",
    "isActive": true,
    "isVip": false,
    "durationDays": 30,
    "expiresAt": "2026-06-04T00:00:00.000Z",
    "createdAt": "2026-05-05T00:00:00.000Z"
  }
]

Catatan:
- Jangan taruh SUPABASE_SERVICE_ROLE_KEY di client/public.
- Untuk APK lama yang membaca password plaintext, kolom password masih plaintext supaya cocok.
- Setelah deploy, pastikan endpoint keluar JSON array, bukan 404/HTML.
