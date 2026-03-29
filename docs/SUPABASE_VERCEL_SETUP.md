# 🔧 Supabase + Vercel Configuration Guide

## 🚨 **Current Issue: Password Recovery Redirects to Localhost**

When users request password recovery, Supabase sends emails with links that redirect to `localhost:5177` instead of the Vercel production domain.

## ✅ **Solution: Update Supabase Site URLs**

### **1. Supabase Dashboard Configuration**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `arhcbrvdtehxyeuplvpt`
3. Navigate to: **Authentication → Settings**

### **2. Update Site URLs**

In the **Site URL** section, add these URLs:

```
http://localhost:5177
https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app
```

### **3. Update Redirect URLs**

In the **Redirect URLs** section, add:

```
http://localhost:5177/auth/callback
https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app/auth/callback
```

## 🌐 **Vercel Domains**

### **Production Domain**
```
https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app
```

### **Preview Domains**
```
https://3dcustomicerdefinitivo-ad4nhqqdf-davids-projects-5c176cd5.vercel.app
https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app
```

## 🔄 **Environment Variables**

### **Development (.env.local)**
```bash
VITE_SUPABASE_URL=https://arhcbrvdtehxyeuplvpt.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### **Production (Vercel Environment Variables)**
```bash
VITE_SUPABASE_URL=https://arhcbrvdtehxyeuplvpt.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🧪 **Testing the Fix**

1. **Deploy to Vercel**: `vercel --prod`
2. **Test Password Recovery**:
   - Go to your Vercel app
   - Click "Forgot Password"
   - Check email link redirects to Vercel domain
3. **Test Login**: Verify login works on both localhost and Vercel

## 🚨 **Common Issues**

### **Issue: Still redirecting to localhost**
- **Solution**: Clear browser cache and cookies
- **Solution**: Wait 5-10 minutes for Supabase changes to propagate

### **Issue: "Invalid redirect URI" error**
- **Solution**: Verify exact URL format in Supabase dashboard
- **Solution**: Check for trailing slashes

### **Issue: Authentication not working on Vercel**
- **Solution**: Verify environment variables are set in Vercel dashboard
- **Solution**: Check Vercel deployment logs

## 📞 **Support**

If issues persist:
1. Check Supabase logs in dashboard
2. Check Vercel deployment logs
3. Verify environment variables in Vercel dashboard
4. Test with different browser/incognito mode

## 🔄 **Future Updates**

When deploying new versions:
1. Always verify Supabase Site URLs include current Vercel domains
2. Test authentication flow after each deployment
3. Update this documentation with new domains if needed 