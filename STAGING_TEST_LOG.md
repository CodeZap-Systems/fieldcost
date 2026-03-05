HOW TO TEST PAYFAST ON SANDBOX:
1. Open staging URL, log in, go to /billing
2. Click "Upgrade Now"
3. You will be redirected to sandbox.payfast.co.za
4. Use these sandbox test card details:
   Card number: 4000000000000002
   Expiry: any future date
   CVV: any 3 digits
5. Complete the payment
6. You should be redirected to /billing/success
7. PayFast will call /api/billing/notify (ITN) automatically
8. Check your Supabase profiles table — subscription_tier should change to 'growth'
9. Go back to a project and confirm /projects/[id]/wip is now accessible

NOTE ON LOCAL TESTING:
PayFast ITN cannot reach localhost (it needs a public URL).
Always test billing on the staging Vercel URL, not http://localhost:3000.
The staging URL must be set correctly in NEXT_PUBLIC_APP_URL.
