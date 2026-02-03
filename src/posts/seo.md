---
title: SEO checklist for early startups
date: "2026-02-03"
slug: seo-checklist
tags: seo, startup
---

The past month I have been building [Tableport](https://tableport.gg) as a contractor/CTO as a service (CaaS). We have been moving fast  but today I noticed that our SEO is crap. Now, SEO has never been my most favourite part, but for an early stage startup it is essential to get as many eye pairs on your application as soon as possible, and as in any startup it is usually up to the founders  to set it up. I try to keep it simple and at the moment I am not using any paid tools, for me Google Search Console provides all the data for me to be happy.

[ ] Create a sitemap.xml file
[ ] Create a robots.txt file
[ ] Create a llms.txt file
[ ] Add site to Google Search console
	[ ]  Check that the site is indexed
	[ ]  Resolve any potential issues
	[ ]  Add your sitemap.xml
[ ] Add site to Bing Webmaster tools (I usually import from google search)
	 [ ] Check that the site is indexed
	 [ ] Add your sitemap.xml
[ ] Setup an analytics platform*
[ ] Add metadata to your relevant pages (meta titles and descriptions JSON-LD and OpenGraph cards)
[ ] Setup Google Lighthouse review**

\* For analytics platforms I have previously gone the route of Google Analytics and Posthog. But more recently I have tried out more light weighted self-hosted solutions, mainly Plausible CE and Umami. Both of them are cookie-less and do not require explicit consent as per GDPR. I have settled with Umami since it provides better and easier user management compared to Plausible. Also its server footprint is a lot smaller than with Plausible, because plausible uses ClickHouse as its analytical database, which can easily take 500 MB of RAM. It does not sound like much but I try to run most of my services on a single instance and RAM is usually the primary limiting factor.

\** I have google lighthouse installed as a global npm package. I run it from time to time. In my opinion it would be a bit overkill to have it run as a part of the CI/CD pipeline.
