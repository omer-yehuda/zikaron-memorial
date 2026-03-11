# AWS DynamoDB — Candle Counts Setup Guide

For: Zikaron Memorial candle counts storage
Cost: **Permanently free** (DynamoDB free tier has no 12-month limit)
Time: ~10 minutes

---

## Why DynamoDB Instead of RDS

| | DynamoDB | RDS PostgreSQL |
|---|---|---|
| Network | HTTPS/443 (no security group) | TCP/5432 (requires 0.0.0.0/0 with Vercel) |
| Free tier | Permanent | 12 months only |
| Setup | IAM credentials only | VPC + subnet + security group + parameter group |
| Vercel compatible | ✅ No open ports | ⚠️ AWS warns about 0.0.0.0/0 |

---

## Step 1 — Create the DynamoDB Table

1. Open **AWS Console** → search `DynamoDB` → click **DynamoDB**
2. Click **Create table**
3. Fill in:
   - **Table name:** `ZikaronMemorial`
   - **Partition key:** `PK` — type `String`
   - Leave sort key empty
4. Under **Table settings** → select **Customize settings**
5. **Capacity mode:** `On-demand` (no capacity planning, pay per request — free tier covers it)
6. **Encryption:** `Owned by Amazon DynamoDB` (free, default)
7. Click **Create table**

---

## Step 2 — Enable TTL (Auto-delete old vote records)

TTL lets DynamoDB automatically delete yesterday's vote records for free.

1. Click on your new `ZikaronMemorial` table
2. Left menu → **Additional settings**
3. Under **Time to Live (TTL)** → click **Enable**
4. **TTL attribute name:** `ttl`
5. Click **Enable TTL**

---

## Step 3 — Create a Minimal-Privilege IAM User

Never use root credentials. Create a dedicated user with only the permissions the app needs.

1. Open **AWS Console** → search `IAM` → click **IAM**
2. Left menu → **Users** → **Create user**
3. Fill in:
   - **User name:** `zikaron-app`
4. Click **Next** → **Next** → **Create user**
5. Click on the new `zikaron-app` user
6. Tab: **Permissions** → **Add permissions** → **Create inline policy**
7. Switch to **JSON** editor and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ZikaronCandleAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:*:table/ZikaronMemorial"
    }
  ]
}
```

> Replace `us-east-1` with your actual region if different.

8. Click **Next** → **Policy name:** `ZikaronCandlePolicy` → **Create policy**

---

## Step 4 — Generate Access Keys

1. Still on the `zikaron-app` user page
2. Tab: **Security credentials**
3. Scroll to **Access keys** → **Create access key**
4. **Use case:** `Application running outside AWS`
5. Click **Next** → **Create access key**
6. **Copy both keys now** — the secret key is only shown once
   - `Access key ID` → this is `AWS_ACCESS_KEY_ID`
   - `Secret access key` → this is `AWS_SECRET_ACCESS_KEY`
7. Click **Done**

---

## Step 5 — Add to Vercel

1. Open your Vercel project → **Settings** → **Environment Variables**
2. Add these four variables:

| Key | Value | Environments |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | your access key ID | Production, Preview |
| `AWS_SECRET_ACCESS_KEY` | your secret access key | Production, Preview |
| `AWS_REGION` | `us-east-1` (or your region) | Production, Preview |
| `DYNAMO_TABLE` | `ZikaronMemorial` | Production, Preview |

3. Click **Save** for each
4. **Redeploy** the project (Deployments → ⋯ → Redeploy)

---

## Step 6 — Local Development

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
DYNAMO_TABLE=ZikaronMemorial
```

> `.env.local` is in `.gitignore` — never committed.
> Without these vars, the app falls back to in-memory counts (resets on restart).

---

## Step 7 — Verify

After redeploy, open your live site, navigate to any soldier profile, and click
**הדלק נר לזכרו/ה**. The candle count should persist across page refreshes and
after redeployments — confirming DynamoDB is live.

---

## Data Model

Single-table design — all records in `ZikaronMemorial`:

| PK | Purpose | TTL |
|---|---|---|
| `COUNT#IDF-001` | Total candle count for soldier IDF-001 | never expires |
| `VOTE#IDF-001#<ip-hash>#2024-10-07` | Records that this IP voted today | tomorrow (auto-deleted) |

The app hashes raw IP addresses with SHA-256 before storing — no plaintext IPs (GDPR).

---

## Security Checklist

| Control | Status | Notes |
|---|---|---|
| No open TCP ports | ✅ | DynamoDB uses HTTPS/443 only |
| Minimal IAM permissions | ✅ | GetItem, PutItem, UpdateItem only — no DeleteItem, Scan, Query |
| No plaintext IPs stored | ✅ | SHA-256 hash only |
| TTL auto-cleanup | ✅ | Vote deduplication records auto-deleted after 24h |
| Atomic vote guard | ✅ | `ConditionExpression: attribute_not_exists(PK)` prevents double-counting |
| Credentials not in code | ✅ | Environment variables only |

---

## Estimated Monthly Cost

| Resource | Free Tier | Notes |
|---|---|---|
| DynamoDB reads | 25 GB storage + 200M requests/month | **Permanent** free tier |
| DynamoDB writes | included above | **Permanent** free tier |
| Data transfer | 1 GB/month free | Memorial site well within limits |

**Total: $0/month** — DynamoDB free tier does not expire after 12 months.
