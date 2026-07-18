"""
update_readme.py
Auto-updates README.md with live GitHub stats.
Called by profile-update.yml workflow.
"""

import os
import re
import requests
from datetime import datetime, timezone

GITHUB_TOKEN    = os.environ.get("GITHUB_TOKEN", "")
GITHUB_USERNAME = os.environ.get("GITHUB_USERNAME", "the-sadanand")
README_PATH     = "README.md"

HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}


def get_user_stats():
    """Fetch public stats from GitHub REST API."""
    url = f"https://api.github.com/users/{GITHUB_USERNAME}"
    r = requests.get(url, headers=HEADERS, timeout=10)
    r.raise_for_status()
    data = r.json()
    return {
        "public_repos": data.get("public_repos", 0),
        "followers":    data.get("followers", 0),
        "following":    data.get("following", 0),
    }


def get_latest_repos(limit=3):
    """Fetch most recently pushed repos."""
    url = (
        f"https://api.github.com/users/{GITHUB_USERNAME}/repos"
        f"?sort=pushed&per_page={limit}&type=owner"
    )
    r = requests.get(url, headers=HEADERS, timeout=10)
    r.raise_for_status()
    repos = r.json()
    return [
        {
            "name":        repo["name"],
            "description": repo.get("description") or "No description",
            "url":         repo["html_url"],
            "stars":       repo.get("stargazers_count", 0),
            "language":    repo.get("language") or "—",
        }
        for repo in repos
        if not repo.get("fork", False)
    ]


def update_readme(stats, repos):
    """Update dynamic sections inside README.md."""
    with open(README_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    # ── Replace <!-- LAST_UPDATED --> block ──
    last_updated_block = f"<!-- LAST_UPDATED -->\n> 🔄 Last auto-updated: **{now}**\n<!-- /LAST_UPDATED -->"
    content = re.sub(
        r"<!-- LAST_UPDATED -->.*?<!-- /LAST_UPDATED -->",
        last_updated_block,
        content,
        flags=re.DOTALL,
    )

    # ── Replace <!-- STATS --> block ──
    stats_block = (
        "<!-- STATS -->\n"
        f"| 📦 Public Repos | 👥 Followers | 🔗 Following |\n"
        f"|---|---|---|\n"
        f"| {stats['public_repos']} | {stats['followers']} | {stats['following']} |\n"
        "<!-- /STATS -->"
    )
    content = re.sub(
        r"<!-- STATS -->.*?<!-- /STATS -->",
        stats_block,
        content,
        flags=re.DOTALL,
    )

    with open(README_PATH, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"✅ README updated at {now}")
    print(f"   Repos: {stats['public_repos']} | Followers: {stats['followers']}")


if __name__ == "__main__":
    try:
        stats = get_user_stats()
        repos = get_latest_repos()
        update_readme(stats, repos)
    except requests.HTTPError as e:
        print(f"❌ GitHub API error: {e}")
        raise SystemExit(1)
    except FileNotFoundError:
        print(f"❌ {README_PATH} not found — run from repo root")
        raise SystemExit(1)
