# 🚀 Simple Edge Function Deployment

Since you've already added the OpenAI API key through the Supabase website, here are the final steps:

## Step 1: Login to Supabase CLI
```bash
supabase login
```
This will open your browser for authentication.

## Step 2: Link to your project
```bash
supabase link --project-ref aehiilyyexblskkzzplo
```

## Step 3: Deploy the Edge Function
```bash
supabase functions deploy generate-response
```

## Step 4: Verify deployment
```bash
supabase functions list
```

## Alternative: Use Supabase Dashboard

If CLI doesn't work, you can also deploy through the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** in the sidebar
3. Click **Create Function**
4. Name it `generate-response`
5. Copy the code from `/supabase/functions/generate-response/index.ts`
6. Paste it into the function editor
7. Click **Deploy**

## Test Your Deployment

Once deployed, your app will automatically use the secure Edge Function! 

The endpoint will be:
`https://aehiilyyexblskkzzplo.supabase.co/functions/v1/generate-response`

## ✅ Security Benefits After Deployment

- OpenAI API key is secure (server-side only)
- No key exposure in frontend code
- Built-in rate limiting
- Proper error handling and CORS

Your Coaching Platform is now production-ready! 🎉