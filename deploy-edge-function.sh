#!/bin/bash

echo "🚀 Deploying Supabase Edge Function..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   brew install supabase/tap/supabase"
    exit 1
fi

# Login to Supabase (you'll need to do this manually)
echo "📋 Step 1: Login to Supabase"
echo "Please run: supabase login"
echo "Then come back and run this script again."
read -p "Have you logged in? (y/n): " logged_in

if [[ $logged_in != "y" ]]; then
    echo "Please login first and try again."
    exit 1
fi

# Link to your project
echo "🔗 Step 2: Linking to your Supabase project..."
supabase link --project-ref aehiilyyexblskkzzplo

# Deploy the Edge Function
echo "🚀 Step 3: Deploying Edge Function..."
supabase functions deploy generate-response

# Check deployment status
echo "✅ Checking deployment..."
supabase functions list

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Your Edge Function is now deployed at:"
echo "https://aehiilyyexblskkzzplo.supabase.co/functions/v1/generate-response"
echo ""
echo "The OpenAI API key you added through the website should now be working."
echo "You can test your app - it will use the secure Edge Function instead of direct API calls!"