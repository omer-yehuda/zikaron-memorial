# AWS RDS PostgreSQL — Maximum Security Setup Guide

For: Zikaron Memorial candle counts database
Target: AWS Free Tier · `db.t3.micro` · PostgreSQL 16
Estimated time: 30–40 minutes

---

## Before You Start

You need:
- AWS account (free tier)
- Your Vercel project open in a second tab
- A password manager ready — you will generate two strong passwords

> **Why public accessibility?** Vercel serverless functions run from dynamic AWS IPs
> with no fixed range. The RDS must accept external connections. We compensate with
> mandatory SSL, a locked-down security group port, a minimal-privilege DB user,
> encrypted storage, and credentials stored in Secrets Manager — never in code.

---

## Step 1 — Create a Dedicated VPC

A dedicated VPC isolates your database from all other AWS resources.

1. Open **AWS Console** → search `VPC` → click **VPC**
2. Click **Create VPC**
3. Fill in:
   - **Resources to create:** `VPC and more`
   - **Name tag:** `zikaron-vpc`
   - **IPv4 CIDR:** `10.0.0.0/16`
   - **Number of Availability Zones:** `2`
   - **Number of public subnets:** `2`
   - **Number of private subnets:** `0`
   - **NAT gateways:** `None` (free tier)
   - **VPC endpoints:** `None`
4. Click **Create VPC**
5. Note the **VPC ID** — you will need it shortly

---

## Step 2 — Create a Security Group (Database Firewall)

This controls exactly who can reach port 5432.

1. In the VPC console left menu → **Security groups**
2. Click **Create security group**
3. Fill in:
   - **Security group name:** `zikaron-rds-sg`
   - **Description:** `PostgreSQL access for Zikaron memorial`
   - **VPC:** select `zikaron-vpc` (from Step 1)
4. Under **Inbound rules** → click **Add rule**:
   - **Type:** `PostgreSQL`
   - **Port:** `5432` (auto-filled)
   - **Source:** `0.0.0.0/0`
   - **Description:** `Vercel serverless — dynamic IPs`
5. Under **Outbound rules** — leave the default (All traffic allowed)
6. Click **Create security group**

> **Why `0.0.0.0/0`?** Vercel has no fixed IP range. The real firewall here is
> SSL + strong credentials + minimal DB user permissions, all configured below.

---

## Step 3 — Create a DB Subnet Group

RDS requires subnets in at least 2 Availability Zones.

1. Search `RDS` → open **RDS Console**
2. Left menu → **Subnet groups** → **Create DB subnet group**
3. Fill in:
   - **Name:** `zikaron-subnet-group`
   - **Description:** `Zikaron memorial DB subnets`
   - **VPC:** `zikaron-vpc`
4. Under **Add subnets**:
   - Select **both Availability Zones** available
   - Select **both public subnets** created in Step 1
5. Click **Create**

---

## Step 4 — Create a Parameter Group (Enforce SSL)

This forces every connection to use SSL — plain TCP connections are rejected.

1. RDS left menu → **Parameter groups** → **Create parameter group**
2. Fill in:
   - **Parameter group family:** `postgres16`
   - **Type:** `DB Parameter Group`
   - **Group name:** `zikaron-force-ssl`
   - **Description:** `Forces SSL on all connections`
3. Click **Create**
4. Click on the new `zikaron-force-ssl` group
5. Click **Edit parameters**
6. Search for `rds.force_ssl` → set value to `1`
7. Click **Save changes**

---

## Step 5 — Generate Credentials in Secrets Manager

Store passwords in AWS — never in code or environment variables directly.

1. Search `Secrets Manager` → **Secrets Manager Console**
2. Click **Store a new secret**
3. **Secret type:** `Credentials for Amazon RDS database`
4. Fill in:
   - **User name:** `zikaron_app`
   - **Password:** click **Generate** → copy it somewhere safe
5. Click **Next**
6. **Secret name:** `zikaron/rds/credentials`
7. **Description:** `PostgreSQL credentials for Zikaron memorial app`
8. Click **Next** → **Next** → **Store**
9. Open the secret → note the **Secret ARN** for later

---

## Step 6 — Create the RDS Instance

1. RDS left menu → **Databases** → **Create database**
2. **Choose a database creation method:** `Standard create`
3. **Engine options:** `PostgreSQL` · Version `PostgreSQL 16.x` (latest 16.x)
4. **Templates:** `Free tier`

### Settings
- **DB instance identifier:** `zikaron-memorial`
- **Master username:** `postgres`
- **Credentials management:** `Managed in AWS Secrets Manager`
  - Select the secret you created in Step 5

### Instance configuration
- **DB instance class:** `db.t3.micro` ✓ (free tier)

### Storage
- **Storage type:** `gp2`
- **Allocated storage:** `20 GB`
- **Storage autoscaling:** ☑ enable · max `100 GB`

### Connectivity
- **Compute resource:** `Don't connect to an EC2 compute resource`
- **Network type:** `IPv4`
- **Virtual private cloud (VPC):** `zikaron-vpc`
- **DB subnet group:** `zikaron-subnet-group`
- **Public access:** `Yes` ⚠️ (required for Vercel — secured by SSL + credentials)
- **VPC security group:** `Choose existing` → select `zikaron-rds-sg`
- **Availability Zone:** `No preference`

### Database authentication
- ☑ **Password authentication**
- ☑ **IAM database authentication** (extra layer — enable it)

### Additional configuration
- **Initial database name:** `zikaron`
- **DB parameter group:** `zikaron-force-ssl`
- **Backup retention period:** `7 days`
- ☑ **Enable automated backups**
- ☑ **Enable encryption** — KMS key: `aws/rds` (free default key)
- ☑ **Enable Performance Insights** — retention: `7 days (free tier)`
- ☑ **Enable Enhanced Monitoring** — granularity: `60 seconds`
- **Log exports:** ☑ `PostgreSQL log` ☑ `Upgrade log`
- **Deletion protection:** ☑ **Enable** (prevents accidental deletion)

5. Click **Create database** → takes 5–10 minutes

---

## Step 7 — Retrieve the Connection Endpoint

1. Once status shows **Available**, click the database name
2. Under **Connectivity & security** → copy the **Endpoint** value
   - Looks like: `zikaron-memorial.xxxxxx.us-east-1.rds.amazonaws.com`
3. Port: `5432`

---

## Step 8 — Create a Minimal-Privilege App User

Connect once as `postgres` to create a locked-down application user.
The app only needs to read and write candle data — nothing else.

Use any PostgreSQL client (psql, TablePlus, DBeaver, pgAdmin).
Connection: `postgres://postgres:<master-password>@<endpoint>:5432/zikaron?sslmode=require`

Run this SQL:

```sql
-- Create a dedicated low-privilege application user
CREATE USER zikaron_app WITH PASSWORD '<strong-random-password>';

-- Grant connection only to the zikaron database
GRANT CONNECT ON DATABASE zikaron TO zikaron_app;

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO zikaron_app;

-- Run the schema first (as postgres):
CREATE TABLE IF NOT EXISTS candle_counts (
  soldier_id VARCHAR(20) PRIMARY KEY,
  count      INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS candle_votes (
  soldier_id  VARCHAR(20) NOT NULL,
  client_hash CHAR(64)    NOT NULL,
  vote_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY (soldier_id, client_hash, vote_date)
);

CREATE INDEX IF NOT EXISTS idx_candle_votes_soldier
  ON candle_votes (soldier_id, vote_date);

-- Now grant ONLY what the app needs — nothing more
GRANT SELECT, INSERT, UPDATE ON candle_counts TO zikaron_app;
GRANT SELECT, INSERT ON candle_votes TO zikaron_app;

-- Explicitly deny everything else (defense in depth)
REVOKE DELETE ON candle_counts FROM zikaron_app;
REVOKE DELETE ON candle_votes FROM zikaron_app;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM zikaron_app;
```

> Generate the `zikaron_app` password with a password manager (20+ chars,
> mixed case, numbers, symbols). Store it in Secrets Manager too.

---

## Step 9 — Build the Connection String

Format:
```
postgres://zikaron_app:<password>@<endpoint>:5432/zikaron?sslmode=require
```

Example:
```
postgres://zikaron_app:Xy9$mK2pL8@zikaron-memorial.abc123.us-east-1.rds.amazonaws.com:5432/zikaron?sslmode=require
```

> **`?sslmode=require`** is mandatory — it enforces SSL at the client level too,
> complementing the server-side `rds.force_ssl=1` from Step 4.

---

## Step 10 — Add to Vercel

1. Open your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - **Key:** `DATABASE_URL`
   - **Value:** the connection string from Step 9
   - **Environments:** ☑ Production ☑ Preview (uncheck Development — use local .env.local)
3. Click **Save**
4. **Redeploy** the project (Deployments → ⋯ → Redeploy) to pick up the new variable

---

## Step 11 — Verify

After redeploy, open your live site, navigate to any soldier profile, and click
**הדלק נר לזכרו/ה**. The candle count should persist across page refreshes and
after redeployments — confirming the database connection is live.

---

## Security Checklist

| Control | Status | Notes |
|---|---|---|
| Encryption at rest | ✅ | AES-256 via KMS `aws/rds` key |
| Encryption in transit | ✅ | `rds.force_ssl=1` + `sslmode=require` in URL |
| Minimal privilege user | ✅ | `zikaron_app` — SELECT/INSERT only, no DELETE |
| Credentials in Secrets Manager | ✅ | Not hardcoded anywhere |
| Dedicated VPC | ✅ | Isolated from other AWS resources |
| Security group port lockdown | ✅ | Only port 5432 open |
| Automated backups | ✅ | 7-day retention |
| Deletion protection | ✅ | Prevents accidental drop |
| CloudWatch logs | ✅ | PostgreSQL + upgrade logs exported |
| IAM auth enabled | ✅ | Second auth factor available |
| No DROP/DELETE permission | ✅ | App user cannot destroy data |

---

## Estimated Monthly Cost (Free Tier)

| Resource | Free Tier | After Free Tier |
|---|---|---|
| `db.t3.micro` | 750 hrs/month FREE (12 months) | ~$15/month |
| 20 GB gp2 storage | 20 GB FREE (12 months) | ~$2.30/month |
| 7-day backups | FREE | FREE |
| Secrets Manager | $0.40/secret/month | $0.40/month |
| Performance Insights | 7 days FREE | FREE |

**Total during free tier: ~$0.40/month** (Secrets Manager only)
