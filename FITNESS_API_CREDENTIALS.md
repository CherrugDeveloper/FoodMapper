# Fitness API Credentials Guide

This document explains how to obtain backend API credentials for the four fitness providers supported by FoodMapper: **Google Fit**, **Apple Health**, **Strava**, and **Garmin Connect**.

---

## 1. Google Fit (Google Fitness API)

### Prerequisites
- Google Cloud Console account
- OAuth 2.0 client ID configured

### Steps

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Fitness API**
   - Navigate to **APIs & Services** → **Library**
   - Search for "Fitness API" and click **Enable**

3. **Configure OAuth Consent Screen**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** user type
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes:
     - `https://www.googleapis.com/auth/fitness.activity.read`
     - `https://www.googleapis.com/auth/fitness.body.read`
     - `https://www.googleapis.com/auth/fitness.heart_rate.read`
     - `https://www.googleapis.com/auth/fitness.sleep.read`
     - `https://www.googleapis.com/auth/fitness.location.read`
   - Add test users (your email) during development

4. **Create OAuth 2.0 Credentials**
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: Add your callback URL (e.g., `https://yourdomain.com/auth/google/callback`)
   - Save and note down **Client ID** and **Client Secret**

5. **Backend Implementation**
   - Use the Client ID/Secret on your backend to exchange authorization codes for access tokens
   - Store refresh tokens securely for offline access
   - Reference: https://developers.google.com/fit/rest/v1/get-started

---

## 2. Apple Health (HealthKit)

### Prerequisites
- Apple Developer Program membership ($99/year)
- Xcode with iOS/macOS development setup

### Steps

1. **Enable HealthKit Capability**
   - In Xcode, select your target → **Signing & Capabilities**
   - Click **+ Capability** → **HealthKit**
   - This adds `HealthKit` entitlement to your app

2. **Configure HealthKit Entitlements**
   - In `YourApp.entitlements`, ensure:
   ```xml
   <key>com.apple.developer.healthkit</key>
   <true/>
   ```

3. **Request Authorization in App**
   - Use `HKHealthStore` to request read/write permissions for specific data types:
   ```swift
   let healthStore = HKHealthStore()
   let readTypes: Set<HKObjectType> = [
       HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
       HKObjectType.quantityType(forIdentifier: .heartRate)!,
       HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!,
       HKObjectType.quantityType(forIdentifier: .stepCount)!,
       HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!
   ]
   
   healthStore.requestAuthorization(toShare: nil, read: readTypes) { success, error in
       // Handle result
   }
   ```

4. **Backend Integration (Optional)**
   - HealthKit is primarily on-device; no traditional OAuth backend
   - For server sync, implement a custom solution where the app sends data to your backend
   - Use `HKAnchoredObjectQuery` for incremental sync

5. **App Store Review**
   - Provide clear purpose strings in `Info.plist`:
   - `NSHealthShareUsageDescription`: "FoodMapper reads your workout and sleep data to provide personalized nutrition insights"
   - `NSHealthUpdateUsageDescription`: "FoodMapper may write workout summaries to HealthKit"

Reference: https://developer.apple.com/documentation/healthkit

---

## 3. Strava API

### Prerequisites
- Strava account
- Strava API application registration

### Steps

1. **Register Strava API Application**
   - Go to: https://www.strava.com/settings/api
   - Log in with your Strava account
   - Click **Create Your API Application**
   - Fill in:
     - **Application Name**: FoodMapper
     - **Website**: Your app URL
     - **Authorization Callback Domain**: Your domain (e.g., `yourdomain.com`)
     - **Category**: Health & Fitness
   - Agree to terms and submit

2. **Get Credentials**
   - After creation, you'll see:
     - **Client ID** (numeric)
     - **Client Secret** (alphanumeric)
   - Save these securely

3. **OAuth Flow**
   - **Authorization URL**: `https://www.strava.com/oauth/authorize`
   - **Token URL**: `https://www.strava.com/oauth/token`
   - **Scopes**: `read,activity:read,profile:read_all`
   - **Redirect URI**: Must match the domain registered in step 1

4. **Token Exchange (Backend)**
   ```bash
   POST https://www.strava.com/oauth/token
   client_id=YOUR_CLIENT_ID
   client_secret=YOUR_CLIENT_SECRET
   code=AUTHORIZATION_CODE
   grant_type=authorization_code
   ```

5. **Refresh Tokens**
   - Access tokens expire in 6 hours
   - Use refresh token to get new access token:
   ```bash
   POST https://www.strava.com/oauth/token
   client_id=YOUR_CLIENT_ID
   client_secret=YOUR_CLIENT_SECRET
   grant_type=refresh_token
   refresh_token=REFRESH_TOKEN
   ```

Reference: https://developers.strava.com/docs/getting-started/

---

## 4. Garmin Connect (Garmin Health API)

### Prerequisites
- Garmin Health API access (requires partnership application)
- Business/enterprise use case

### Steps

1. **Apply for Garmin Health API Access**
   - Visit: https://healthapi.garmin.com/
   - Click **Apply for Access** or **Contact Sales**
   - Fill out the partnership application with:
     - Company information
     - Use case description
     - Expected volume
     - Technical contact details
   - **Note**: Garmin Health API is primarily for B2B/enterprise. Individual developers may not qualify.

2. **Alternative: Garmin Connect IQ / Web API**
   - For consumer apps, consider **Garmin Connect Web API** (unofficial, community-driven)
   - Or use **Garmin Connect IQ** for on-device apps
   - No official public OAuth API for consumer apps as of 2024

3. **If Approved for Health API**
   - You'll receive:
     - **Client ID**
     - **Client Secret**
     - **API Key**
   - OAuth endpoints provided in documentation
   - Scopes: `daily`, `activities`, `sleep`, `heart_rate`, `user_profile`

4. **Implementation Notes**
   - Garmin uses OAuth 2.0 with PKCE
   - Token endpoint and scopes provided upon approval
   - Data available via REST API after user authorization

Reference: https://developer.garmin.com/health-api/

---

## Summary: Credentials Needed Per Provider

| Provider | Client ID | Client Secret | Additional | Notes |
|----------|-----------|---------------|------------|-------|
| **Google Fit** | ✅ | ✅ | OAuth redirect URI | Free, generous quotas |
| **Apple Health** | N/A | N/A | Apple Developer Account | On-device only, no backend OAuth |
| **Strava** | ✅ | ✅ | OAuth redirect URI | 6-hour token expiry, refresh tokens |
| **Garmin** | ✅* | ✅* | Partnership approval | *Requires enterprise partnership |

---

## Backend Architecture Recommendations

### Token Storage
```typescript
interface FitnessTokens {
  provider: 'google_fit' | 'strava' | 'garmin';
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
  scope: string;
  userId: string; // Your app's user ID
}
```

### Secure Storage
- Encrypt tokens at rest (AES-256)
- Use environment variables for Client Secrets
- Implement token rotation with refresh tokens
- Log audit trails for token access

### Sync Strategy
1. **Initial Sync**: Full history (respect rate limits)
2. **Incremental Sync**: Use `after` timestamps or anchors
3. **Webhooks** (where available): Strava supports webhooks for real-time updates
4. **Error Handling**: Exponential backoff, respect rate limits

### Rate Limits (Approximate)
- **Google Fit**: 10,000 requests/day/user
- **Strava**: 100 requests/15min, 1,000/day
- **Garmin**: Per partnership agreement
- **Apple Health**: No server-side limits (on-device)

---

## Testing Credentials

### Development Setup
1. Create separate OAuth apps for dev/staging/prod
2. Use `localhost` redirect URIs for local development:
   - Google: `http://localhost:3000/auth/google/callback`
   - Strava: `http://localhost:3000/auth/strava/callback`
3. Add test users to Google OAuth consent screen
4. Use Strava's sandbox environment for testing

### Environment Variables
```env
# Google Fit
GOOGLE_FIT_CLIENT_ID=your_client_id
GOOGLE_FIT_CLIENT_SECRET=your_client_secret
GOOGLE_FIT_REDIRECT_URI=https://yourdomain.com/auth/google/callback

# Strava
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REDIRECT_URI=https://yourdomain.com/auth/strava/callback

# Garmin (if approved)
GARMIN_CLIENT_ID=your_client_id
GARMIN_CLIENT_SECRET=your_client_secret
GARMIN_REDIRECT_URI=https://yourdomain.com/auth/garmin/callback
```

---

## Current FoodMapper Implementation Status

The current `useFitnessIntegration.ts` hook uses **mock implementations** for all providers. To enable real connections:

1. **Replace `connect()` function** with actual OAuth flow initiation
2. **Implement backend endpoints** for token exchange
3. **Add token storage** (database + encryption)
4. **Implement `syncWorkouts()`, `getActivityData()`, etc.** with real API calls
5. **Add webhook handlers** for Strava real-time updates
6. **Update `FITNESS_PROVIDERS` config** with real scopes and endpoints

### Files to Modify
- `src/hooks/useFitnessIntegration.tsx` - Main integration logic
- Backend API routes (not in this repo - needs separate implementation)
- Database schema for token storage

---

## Security Checklist

- [ ] Client Secrets stored in environment variables only
- [ ] Tokens encrypted at rest
- [ ] HTTPS enforced for all OAuth redirects
- [ ] State parameter used in OAuth flows (CSRF protection)
- [ ] PKCE implemented for public clients
- [ ] Token refresh handled gracefully
- [ ] User can revoke access (delete tokens)
- [ ] Audit logging for token operations
- [ ] Rate limiting respected
- [ ] Minimal scopes requested

---

## Support Links

- **Google Fit**: https://developers.google.com/fit
- **Apple HealthKit**: https://developer.apple.com/documentation/healthkit
- **Strava API**: https://developers.strava.com/
- **Garmin Health**: https://developer.garmin.com/health-api/
- **OAuth 2.0 Spec**: https://tools.ietf.org/html/rfc6749
- **PKCE Spec**: https://tools.ietf.org/html/rfc7636

---

*Last updated: 2024*
*FoodMapper Fitness Integration*