# Lotus HR Dashboard

A bilingual (Arabic/English) web dashboard for **Lotus Pharmacies** HR department to manage job applicants and candidates.

## Features

- **HR Dashboard** — Overview stats, candidate cards, search & filter
- **Candidate Cards** — Full application data matching the official Lotus job application form
- **One-Time Application Links** — Generate secure links for candidates to fill their application once
- **Bilingual UI** — Full Arabic (RTL) and English (LTR) support with language switcher
- **Role-Based Access** — Admin, HR, and Viewer roles with permissions
- **Lotus Branding** — Colors and animations matching lotusonline.com (#083F23 green, #8DC63F lime)

## Default Login

| Username | Password | Role  |
|----------|----------|-------|
| admin    | admin    | Admin |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## User Roles

| Role   | Permissions                                              |
|--------|----------------------------------------------------------|
| Admin  | Full access — manage users, candidates, links, interviews |
| HR     | View/edit candidates, create links, record interviews     |
| Viewer | View candidates only                                      |

## Workflow

1. **Login** as admin or HR user
2. Go to **Application Links** and create a link for a position
3. **Copy the link** and send it to the candidate
4. Candidate fills the **one-time application form** (Arabic/English)
5. HR reviews the **candidate card** in the dashboard
6. Record **interview results** in the HR section

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- JSON file storage (no database server required)
- JWT Authentication

## Deploy on VPS (port 16310)

### Step 1 — Push code to GitHub

```bash
git add .
git commit -m "Add Lotus HR Dashboard with VPS deployment"
git push -u origin main
```

### Step 2 — Open firewall port in Hostinger

hPanel → VPS → **Security** → **Firewall rules** → Add rule:
- **Port:** `16310`
- **Protocol:** TCP
- **Action:** Accept

### Step 3 — SSH into VPS and deploy

```bash
ssh root@187.124.15.14
```

**Docker (recommended):**

```bash
git clone https://github.com/Refaat1942/Lotus-HR-Dashboard.git /opt/lotus-hr-dashboard
cd /opt/lotus-hr-dashboard
cp .env.example .env
# Edit JWT_SECRET in .env
docker compose up -d --build
```

**Or one-line deploy script:**

```bash
curl -fsSL https://raw.githubusercontent.com/Refaat1942/Lotus-HR-Dashboard/main/deploy/vps-deploy.sh | bash
```

### Access

- **URL:** http://187.124.15.14:16310
- **Login:** admin / admin

### Manage

```bash
docker compose logs -f      # View logs
docker compose restart      # Restart app
docker compose down && docker compose up -d --build   # Rebuild after updates
```
