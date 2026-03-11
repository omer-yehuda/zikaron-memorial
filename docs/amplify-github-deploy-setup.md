# Amplify + GitHub Actions Deploy Setup

No long-lived AWS keys anywhere. GitHub proves its identity to AWS via OIDC,
assumes a role, and triggers an Amplify deployment on every PR merge to master.

Estimated time: 20 minutes

---

## Part 1 — AWS: Add GitHub as an OIDC Identity Provider

This lets AWS trust tokens issued by GitHub Actions.

1. Open **AWS Console** → search `IAM` → click **IAM**
2. Left menu → **Identity providers** → **Add provider**
3. Fill in:
   - **Provider type:** `OpenID Connect`
   - **Provider URL:** `https://token.actions.githubusercontent.com`
   - Click **Get thumbprint**
   - **Audience:** `sts.amazonaws.com`
4. Click **Add provider**

---

## Part 2 — AWS: Create the IAM Role

This is the role GitHub Actions will assume.

1. IAM left menu → **Roles** → **Create role**
2. **Trusted entity type:** `Web identity`
3. Fill in:
   - **Identity provider:** `token.actions.githubusercontent.com`
   - **Audience:** `sts.amazonaws.com`
   - **GitHub organization:** `omer-yehuda`
   - **GitHub repository:** `zikaron-memorial`
   - **GitHub branch:** `master`
4. Click **Next**

---

## Part 3 — AWS: Attach Permissions to the Role

### 3a — Create the deploy policy

1. Click **Create policy** (opens a new tab)
2. Switch to **JSON** tab and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AmplifyDeploy",
      "Effect": "Allow",
      "Action": "amplify:StartJob",
      "Resource": "*"
    }
  ]
}
```

3. Click **Next**
4. **Policy name:** `ZikaronAmplifyDeploy`
5. Click **Create policy**
6. Close this tab and go back to the role creation tab

### 3b — Attach the policy

1. Click the refresh button next to the search box
2. Search `ZikaronAmplifyDeploy` → check the box
3. Click **Next**
4. **Role name:** `ZikaronGitHubDeploy`
5. **Description:** `Assumed by GitHub Actions to deploy Zikaron memorial to Amplify`
6. Click **Create role**

---

## Part 4 — AWS: Copy the Role ARN

1. IAM → **Roles** → click `ZikaronGitHubDeploy`
2. At the top, copy the **ARN** — looks like:
   ```
   arn:aws:iam::123456789012:role/ZikaronGitHubDeploy
   ```
3. Save it — you'll add it to GitHub in Part 6

---

## Part 5 — AWS: Create the Amplify App

1. Open **AWS Console** → search `Amplify` → click **AWS Amplify**
2. Click **Create new app**
3. **Host your web app** → **GitHub** → click **Authorize**
4. **Repository:** `omer-yehuda/zikaron-memorial`
5. **Branch:** `master`
6. Amplify will detect `amplify.yml` automatically — review and click **Next**
7. **Environment variables** — add all four:

   | Variable | Value |
   |---|---|
   | `AWS_ACCESS_KEY_ID` | *(leave empty — app uses Amplify service role)* |
   | `AWS_SECRET_ACCESS_KEY` | *(leave empty)* |
   | `AWS_REGION` | `us-east-1` |
   | `DYNAMO_TABLE` | `ZikaronMemorial` |

   > **Wait** — actually for DynamoDB access at runtime, see Part 5b below first.

8. Click **Next** → **Save and deploy**

> The first deploy will run immediately from the Amplify console.
> Future deploys will be triggered by GitHub Actions only (after Part 7).

### 5b — Grant Amplify Runtime Access to DynamoDB

The Amplify app needs its own IAM role to access DynamoDB at runtime
(separate from the GitHub deploy role).

1. IAM → **Roles** → search `amplify`
2. Find the role named something like `amplifyconsole-backend-role` or `AmplifySSRLoggingRole`
   — or go to Amplify Console → App settings → **General** → note the **Service role**
3. If no service role exists:
   - Amplify Console → App settings → **General** → **Edit**
   - **Service role** → **Create and use a new service role** → **Save**
4. Click on the service role in IAM
5. **Add permissions** → **Create inline policy** → JSON:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ZikaronDynamoDB",
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

6. **Policy name:** `ZikaronDynamoAccess` → **Create policy**
7. Now **remove** `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from Amplify env vars
   — the app will use the service role automatically (more secure, no keys)

---

## Part 6 — GitHub: Add Secrets

1. Go to `github.com/omer-yehuda/zikaron-memorial`
2. **Settings** → left menu → **Secrets and variables** → **Actions**
3. Click **New repository secret** — add these two:

   | Name | Value |
   |---|---|
   | `AWS_ROLE_ARN` | the ARN from Part 4 |
   | `AMPLIFY_APP_ID` | Amplify Console → App settings → General → **App ID** (e.g. `d1abc123xyz`) |

---

## Part 7 — GitHub: Protect the master Branch

No one (including you) can push directly to master — all changes go through PRs.

1. GitHub repo → **Settings** → left menu → **Branches**
2. Click **Add branch protection rule** (or **Add classic branch protection rule**)
3. Fill in:
   - **Branch name pattern:** `master`
   - ☑ **Require a pull request before merging**
   - ☑ **Require approvals** → set to `1`
   - ☑ **Require status checks to pass before merging**
   - ☑ **Do not allow bypassing the above settings**
4. Click **Create**

---

## How It Works End-to-End

```
Developer → creates feature branch
         → opens PR to master
         → PR is reviewed and approved
         → PR is merged
         → GitHub Actions triggers deploy.yml
         → GitHub gets OIDC token from GitHub's token service
         → AWS verifies token → grants temporary credentials for ZikaronGitHubDeploy role
         → aws amplify start-job fires
         → Amplify pulls latest master and deploys
```

No access keys stored anywhere. Credentials are temporary (1 hour) and scoped to
a single action (`amplify:StartJob`).

---

## Verification

After merging a PR:
1. GitHub → **Actions** tab → watch the `Deploy to AWS Amplify` workflow run
2. AWS Amplify Console → check the deployment status
3. Visit your live app — candle counts should persist via DynamoDB
