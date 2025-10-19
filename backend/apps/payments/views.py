from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone
import json
from decimal import Decimal
from apps.companies.models import Companies, CompanyAd
from .models import CompanyAdPayments


@csrf_exempt
@transaction.atomic
def company_ad_payment(request):
    """Process a company ad payment and persist both the ad and the payment.
    This endpoint expects a JSON body with two top-level keys:
      - ad: the ad payload (same as used by create_company_ad) with company_id
      - payment: { payment_method, email, amount? }
    It will create the ad (status='active') and a payment row.
    """
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Only POST method allowed'}, status=405)

    try:
        data = json.loads(request.body)
        ad_data = data.get('ad') or {}
        pay_data = data.get('payment') or {}

        company_id = ad_data.get('company_id')
        if not company_id:
            return JsonResponse({'success': False, 'message': 'company_id is required'}, status=400)

        try:
            company = Companies.objects.get(company_id=company_id)
        except Companies.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Company not found'}, status=404)

        # Create ad first
        from datetime import datetime

        def parse_date(val):
            if not val:
                return None
            if isinstance(val, str):
                return datetime.fromisoformat(val).date()
            return val

        ad = CompanyAd.objects.create(
            company=company,
            title=ad_data.get('title', '').strip(),
            description=ad_data.get('description', '').strip(),
            category=ad_data.get('category', ''),
            target_audience=ad_data.get('target_audience', ''),
            budget=Decimal(str(ad_data.get('budget', 0) or 0)),
            duration=int(ad_data.get('duration', 0) or 0),
            ad_type=ad_data.get('ad_type', ''),
            image_url=ad_data.get('image_url', ''),
            video_url=ad_data.get('video_url', ''),
            website_url=ad_data.get('website_url', ''),
            contact_email=ad_data.get('contact_email', ''),
            start_date=parse_date(ad_data.get('start_date')),
            end_date=parse_date(ad_data.get('end_date')),
            keywords=ad_data.get('keywords', ''),
            status='active'  # activate on successful payment
        )

        # Record payment (simulate success)
        amount = Decimal(str(pay_data.get('amount', ad.budget or 0)))
        payment = CompanyAdPayments.objects.create(
            ad=ad,
            amount=amount,
            payment_method=pay_data.get('payment_method', 'credit-card'),
            transaction_id=pay_data.get('transaction_id'),
            status='success',
            paid_at=timezone.now(),
        )

        return JsonResponse({'success': True, 'ad_id': ad.ad_id, 'payment_id': payment.payment_id})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


# Create your views here.
