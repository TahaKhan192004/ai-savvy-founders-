# Content Globe Planner: setup guide

Turn the attached `content-globe-planner.html` into your own working Claude artifact. You fill in a brand brief, and Claude researches Reddit, plans a month of posts, writes every caption, and can schedule the posts for you.

## Before you start

| What you need | Required? | How to set it up |
|---|---|---|
| A Claude account that can make artifacts (claude.ai web or desktop app) | Required | Use a normal chat. Artifacts need to be turned on in your settings. |
| **Parallel Search** connector | Required for live Reddit research | Go to claude.ai, then Settings → Connectors → Browse, and add **Parallel Search**. Without it, the planner still works, but Claude brainstorms ideas without live Reddit threads. |
| **Composio** connector | Optional, only for scheduling posts | Go to Settings → Connectors → Add custom connector. Name it exactly **Composio**, use the URL `https://connect.composio.dev/mcp`, then sign in. To schedule LinkedIn or X posts, also connect a scheduling app (Buffer, Upload-Post, Postpone or Typefully) inside Composio. Facebook Pages can be scheduled without one. |

## Steps

1. Start a **new chat** in Claude.
2. Attach `content-globe-planner.html`.
3. Paste the prompt below and send it.
4. Open the artifact that Claude creates. When you first click **Generate**, allow the page to use Claude and Parallel Search. When you first schedule posts, allow it to use Composio.

---

## The prompt (copy everything in the box)

```
I've attached content-globe-planner.html. Publish it as my own private artifact, exactly as it is, and turn on the capabilities it needs. Don't redesign, rewrite or "improve" it. The page is finished and tested.

Do these steps in order:

1. Read the attached file in full so you know what you're publishing. It is a self-contained HTML page called "Content Globe Planner". You give it a brand brief, and it calls Claude (through the artifact's own Claude access) and the user's connectors to research Reddit, plan posts, write captions, and optionally schedule posts. Make no changes to it.

2. Publish the file as a NEW artifact, unchanged, using your artifact tools.
   - Title: "Content Globe Planner"
   - Icon: "calendar"
   - If you can publish from a file on disk, publish the attached file directly as index.html. Otherwise publish its complete contents as the page. Never publish a cut-down or partial copy.

3. Turn on (declare) these capabilities for the artifact, using exactly these names. Some platforms want capabilities declared after a new page is published; follow whatever order your artifact tools require.
   {
     "sample": {},
     "mcp": { "servers": [
       { "server": "Parallel Search", "tools": ["web_search", "web_fetch"] },
       { "server": "Composio", "tools": ["COMPOSIO_SEARCH_TOOLS", "COMPOSIO_GET_TOOL_SCHEMAS", "COMPOSIO_MANAGE_CONNECTIONS", "COMPOSIO_MULTI_EXECUTE_TOOL"] }
     ]},
     "downloads": true
   }
   - "sample" lets the page ask Claude to write.
   - "Parallel Search" is for Reddit and website research.
   - "Composio" is optional and only used to schedule posts.
   - "downloads" lets the page save .md, .csv and .json exports.
   Keep the server names exactly "Parallel Search" and "Composio", because the page looks for those names. If one of my connectors has a slightly different display name, tell me and ask whether to rename the connector or change the declaration. Don't edit the page's code.

4. Check my setup and report back in a short list:
   - The link to the new artifact.
   - Whether the Parallel Search connector is connected for me. If it isn't, tell me to add it in Settings → Connectors. The page still works without it, but ideas won't come from live Reddit threads.
   - Whether a connector named "Composio" is connected. If it isn't, say that's optional and only needed for the "Schedule posts" button. Setup is: Settings → Connectors → Add custom connector, name "Composio", URL https://connect.composio.dev/mcp.
   - A reminder that the first Generate click asks me to allow the page to use Claude and Parallel Search, the first scheduling run asks for Composio, and runs use my own Claude usage.

5. Don't run the planner yourself, don't generate sample content, and don't add features. Stop after step 4.

If your tools can't do part of this (for example, you can't declare capabilities in this chat), tell me plainly which step failed and what I should do. Don't fall back to rebuilding the page from scratch.
```

---

## Using the planner

- **Fill example brief** fills in a sample brand. **Watch a finished demo** replays a complete example without using any Claude usage.
- A typical run of 2 weeks on 2 platforms is about 12 posts and takes roughly 3–5 minutes. Each run is capped at 40 posts and 31 days.
- Click any calendar day to read, edit, copy or rewrite its posts.
- **Download .md / .csv / .json** exports the whole plan.
- **📅 Schedule posts** works only if Composio is connected. You review the times, confirm, and Claude schedules through Composio. The page blocks anything that would publish immediately or delete a post.

## Troubleshooting

| What you see | What to do |
|---|---|
| "Claude: not available in this view" | Open the artifact inside claude.ai, not as a downloaded file. |
| "Reddit research: connect Parallel Search…" | Add the Parallel Search connector, then reload the artifact. |
| "Scheduling: optional: add the Composio connector" | Add the connector with the exact name **Composio**, then reload. |
| A post shows **needs connection** | Click the "Connect … ↗" button that appears, sign in to that app inside Composio, then schedule again. |
| A post shows **needs media** | Instagram, TikTok and Shorts require an image or video, and the planner writes text only. Add media in your scheduling app. |
| "You have hit a usage or rate limit" | Wait a while, then run again. Posts that were already written are kept. |
