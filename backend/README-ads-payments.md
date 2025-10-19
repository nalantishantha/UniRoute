# Company Ads Publish Backend

Endpoints added:

- POST /api/companies/company-ads/upload/ — multipart upload for image/video, returns { url }
- GET /api/companies/company-ads/?company_id=ID — list company ads
- POST /api/companies/company-ads/create/ — create ad (pending)
- PUT /api/companies/company-ads/{ad_id}/update/ — update ad
- DELETE /api/companies/company-ads/{ad_id}/delete/ — delete ad
- POST /api/payments/company-ad/pay/ — create ad and payment in single transaction; returns { ad_id, payment_id }

Notes:

- Media is saved under MEDIA_ROOT/ad_uploads and served in DEBUG via MEDIA_URL.
- Payment endpoint simulates successful payment and sets ad.status='active'. Integrate with a gateway later.

Run server (example):

- Ensure .env has DB connection and SECRET_KEY/DEBUG.
- python manage.py migrate (models use managed=True and map to existing tables; migration may be no-op if tables exist).
- python manage.py runserver

Frontend wiring: `src/pages/Company/AdPublish.jsx` calls the above endpoints via `src/services/adService.js`.
