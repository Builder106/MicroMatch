# MicroMatch

A micro-volunteering marketplace that pairs NGOs and community projects with bite-sized tasks and gives volunteers just-in-time learning to complete them. Built with SvelteKit for the Syrotech MVP Hackathon 2025.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- **Browse & Claim Tasks**: Volunteers can browse a feed of available tasks, view detailed descriptions, and claim a task to complete.
- **Just-in-Time Learning**: Tasks can be linked to learning resources from DataCamp & Educative to help volunteers skill up.
- **Proof of Work**: Volunteers can submit proof of their work (e.g., a URL or file upload).
- **Gamification**: Earn badges for completed tasks and track your experience points (XP) on a personal dashboard.
- **NGO Task Management**: NGOs can post new tasks and review submissions from volunteers.
- **Auto-Translation**: Task details are automatically translated to the user's language using Microsoft Azure Translator.
- **Public API**: A read-only public API for tasks, documented with Bump.sh.

## 🚀 Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **UI**: [Svelte Material UI](https://sveltematerialui.com/) & [Iconify](https://iconify.design/)
- **Backend**: [Appwrite](https://appwrite.io/) (Database, Auth, Storage, Functions)
- **Deployment**: [Heroku](https://www.heroku.com/) (SvelteKit SSR) & [DigitalOcean](https://www.digitalocean.com/) (Appwrite)
- **i18n**: [Microsoft Azure Translator](https://azure.microsoft.com/en-us/services/cognitive-services/translator/)
- **Observability**: [New Relic](https://newrelic.com/)
- **Secrets Management**: [1Password](https://1password.com/)
- **API Documentation**: [Bump.sh](https://bump.sh/)
- **Domain**: [Namecheap](https://www.namecheap.com/)

## 🏁 Getting Started

Follow these instructions to get the project running locally.

### Prerequisites

- [Bun](https://bun.sh/)
- [Git](https://git-scm.com/)
- An [Appwrite](https://appwrite.io/) instance (self-hosted or cloud)
- [Azure Translator](https://azure.microsoft.com/en-us/services/cognitive-services/translator/) API keys

### 1. Clone the repository

```bash
git clone https://github.com/your-username/micromatch.git
cd micromatch
```

### 2. Install dependencies

This project uses [Bun](https://bun.sh/) as the package manager.

```bash
bun install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project and add the following environment variables. You can find most of these in your Appwrite and Azure dashboards. Use 1Password to manage them securely.

```bash
# Appwrite Configuration
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
APPWRITE_DB_ID=
APPWRITE_TASKS_COL_ID=
APPWRITE_CLAIMS_COL_ID=
APPWRITE_BADGES_COL_ID=

# Azure Translator Configuration
AZURE_TRANSLATOR_ENDPOINT=
AZURE_TRANSLATOR_KEY=
AZURE_TRANSLATOR_REGION=

# New Relic Configuration (Optional)
NEW_RELIC_LICENSE_KEY=
NEW_RELIC_APP_NAME=micromatch-web
```

### 4. Run the development server

```bash
bun run dev
```

The application should now be running at [http://localhost:5173](http://localhost:5173).

## 📝 API Documentation

The public API for listing tasks is documented using OpenAPI and hosted on Bump.sh.

- **[View API Docs](https://bump.sh/link-to-your-docs)**

The relevant API route is `GET /api/tasks`.

## 📦 Data Model

The backend data is stored in Appwrite collections:

- `organizations`: Details about partner NGOs.
- `tasks`: The micro-volunteering tasks.
- `claims`: Submissions from volunteers for tasks.
- `badges`: Badges awarded to users upon successful task completion.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

This project was built for the Syrotech MVP Hackathon 2025 and leverages the generous offerings of our sponsors.
