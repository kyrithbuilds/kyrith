/** Blog posts rendered by pages/BlogPost.jsx and listed on /blog. Keep each post in sync with its draft-blog-*.md file. */
export const BLOG_POSTS = [
  {
    "slug": "bubble-io-pricing",
    "path": "/blog/bubble-io-pricing",
    "title": "Bubble.io Pricing and Workload Costs | KyrithBuilds",
    "meta": "How Bubble.io pricing works, what workload units are, and when costs start to matter. Plans, overages and ways to keep an app within budget.",
    "h1": "Bubble.io Pricing: What It Costs Once Real Users Arrive",
    "date": "2026-10-11",
    "updated": "2026-10-11",
    "intro": "Bubble.io pricing looks simple: pick a plan and start building. The part that surprises founders is workload, the server usage that sits on top of the plan price. Here is how Bubble's plans work, what drives workload, and when the cost starts to matter.",
    "sections": [
      {
        "question": "How much does Bubble.io cost?",
        "answer": "Bubble's paid plans start at $59 a month on Starter, billed annually, and rise to $209 for Growth and $549 for Team, with a free plan and custom Enterprise pricing. Each plan includes a monthly workload allowance, and prices change, so check Bubble's [pricing page](https://bubble.io/pricing) before you budget.",
        "detail": "These are the figures shown on that page when we checked in October 2026. The page shows dollar amounts without naming a currency.",
        "table": {
          "head": [
            "Plan",
            "Price per month",
            "Workload units per month"
          ],
          "rows": [
            [
              "Free",
              "$0",
              "50K"
            ],
            [
              "Starter",
              "$59, billed annually",
              "175K"
            ],
            [
              "Growth",
              "$209, billed annually",
              "250K"
            ],
            [
              "Team",
              "$549, billed annually",
              "500K"
            ],
            [
              "Enterprise",
              "Contact Bubble",
              "Custom"
            ]
          ]
        }
      },
      {
        "question": "What are workload units in Bubble?",
        "answer": "Workload units (WU) are how Bubble measures the server resources your app uses to run. Bubble counts every page load, server-side workflow action and API call in WU, and that total is what your plan allowance covers.",
        "detail": "Bubble's [activity table](https://manual.bubble.io/help-guides/workload/understanding-workload/what-contributes-to-workload) gives examples: loading a page costs 0.15 WU, running a server-side workflow action costs 0.6 WU, and each outbound API call costs 0.1 WU.",
        "table": null
      },
      {
        "question": "What happens when I use more than my plan includes?",
        "answer": "Bubble emails you when your app reaches 75% of its workload units, and again at 100%, when overages begin. You can then buy a workload tier, pay for overages as you go, or disable overages so the app stays within your plan.",
        "detail": "Free apps cannot use tiers or overages, according to Bubble's [pricing page](https://bubble.io/pricing).",
        "table": null
      },
      {
        "question": "Why can a small Bubble app use so much workload?",
        "answer": "Anything that runs on a schedule or reacts to every data change adds workload, even when nobody is using the app. In our experience, access token renewal, email automations and calendar data fetching can use too many workload units, even for a single user.",
        "detail": "Bubble's own [backend workflow checklist](https://manual.bubble.io/help-guides/workload/optimizing-workload/optimization-checklist/backend-workflows) warns that recursive workflows run sequentially and reschedule themselves, which can add up, and that frequently changed data types can consume significant workload through database triggers.",
        "table": null
      },
      {
        "question": "At what point does Bubble get expensive?",
        "answer": "In our experience, workload becomes a bigger cost problem at roughly 100 to 500 users, depending on how often the product is used. An app people open daily reaches that point sooner than one they use once a month.",
        "detail": "Automation and complexity beyond what Bubble handles well is the other trigger. We tell you early when custom code is the better path, so you can plan for it. See our [MVP development services](/mvp-development) for how we scope that.",
        "table": null
      },
      {
        "question": "How can I keep Bubble costs down?",
        "answer": "Question every action, add conditions so work only runs when it needs to, and use as many constraints as you can in searches. Those are the main recommendations in Bubble's own [backend workflow checklist](https://manual.bubble.io/help-guides/workload/optimizing-workload/optimization-checklist/backend-workflows).",
        "detail": "We scope integrations early and watch usage as your user numbers grow, so the cost of scale does not surprise you. If you want a second pair of eyes, see our [Bubble developer](/bubble-developer) page.",
        "table": null
      },
      {
        "question": "Is Bubble still worth it for an MVP?",
        "answer": "Yes, when speed and validation matter more than custom code. Our Bubble MVPs usually go live in 3 to 4 weeks, or 5 to 6 weeks when external APIs are involved.",
        "detail": "The plan price is rarely the biggest cost of an MVP. Building only the core features and watching workload as you grow matters more.",
        "table": null
      }
    ],
    "ctaEnd": "Not sure what your app will cost to run? [Get in Touch](/contact), email [info@kyrithbuilds.com](mailto:info@kyrithbuilds.com) or message us on [WhatsApp](https://wa.me/917043062606), and we will give you an honest view.",
    "author": "Written by the KyrithBuilds team. We build Bubble apps, MVPs and workflow automations for clients worldwide, and we work remote-first.",
    "excerpt": "How Bubble's plans and workload units work, and the point where the cost starts to matter."
  }
]
