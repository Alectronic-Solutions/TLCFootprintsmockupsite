# T.L.C. Footprints Home Daycare

The website for T.L.C. Footprints Home Daycare, a licensed California Family Child Care Home in Elk Grove, CA. License #394501929.

Built with Next.js and exported as a static site.

---

## Part 1: For LaTrell

This section covers the four things you will actually want to change. You do not need to understand the rest of the file.

Every one of these is a small edit to a single file. If you are not comfortable making them yourself, send Alec the new numbers and he will do it in a few minutes.

### Update your enrolment status

**File:** `lib/constants.ts`
**Look for:** `AVAILABILITY`

```ts
export const AVAILABILITY = {
  status: "limited",
  updated: "August 2026",
};
```

Set `status` to one of `"open"`, `"limited"` or `"full"`. It changes two things,
in the two places a parent sees first:

- the green bar across the very top of every page - `"open"` reads "Now
  enrolling · openings available", `"limited"` reads "Now enrolling · limited
  openings", and `"full"` reads "Currently full" with no link to a tour
- the "Now enrolling" tile in the row of four under the home page hero, which
  carries the `updated` date - so change that date in the same edit

The site deliberately publishes **no opening counts** and no per-age-group
breakdown. Your brief gives one enrolling statement for the home and no
numbers, and there is no wait-list, so any grid of counts would have been
invented. A number is also stale the day after one child enrols, on the
section most likely to make a parent book a tour. If you ever want counts
published, send Alec the real ones and he will wire them up.

**Always change `updated` too.** The site shows that date to parents so it reads as maintained. A stale date is worse than no date.

### Change a rate

**File:** `lib/constants.ts`
**Look for:** `PROGRAMS`

There are two rate tiers, `Infant Care` and `Toddler + Preschool-Age Care`, matching how your brief prices them. Each has a `fullTime` and a `partTime` number. Change those and the rate updates everywhere on the site at once: the home page cards, the rate table, the programs page, and the structured data Google reads. You never have to update a price in more than one place.

The deposit is just below, in `TUITION`, as `depositAmount`.

### Change your phone, email, or hours

**File:** `lib/constants.ts`
**Look for:** `BUSINESS` at the very top

Everything about the business lives here. If you change the phone number, change it in both `phone` and `phoneHref`. The second one is the version phones use to actually dial, so it needs the `+1` and no dashes:

```ts
phone: "510-434-4834",
phoneHref: "tel:+15104344834",
smsHref: "sms:+15104344834",
```

### Add or edit a resource article

**Folder:** `content/resources/`

Each article is one file ending in `.mdx`. To edit one, open it and change the text. To add a new one, copy an existing file, rename it, and change the section at the top:

```
---
title: "The headline parents will see"
summary: "One or two sentences describing it."
seoTitle: "Optional shorter search-result title"
seoDescription: "Optional shorter search-result description."
keywords:
  - what people might search for
updated: "August 2026"
related:
  - slug-of-another-article
---
```

The file name becomes the web address. `what-to-pack-for-home-daycare.mdx` becomes `/resources/what-to-pack-for-home-daycare`. Use lowercase words with dashes and no spaces.

New articles appear on the Resources page and in the sitemap automatically.

**The articles are drafts for you to review.** They were written from your brief so the site would launch complete, but you are the expert. Please read them and change anything that does not sound like you or is not accurate to how you actually run things.

### Adding your photos

Two steps, and the second one is the one people forget:

1. Drop the file into `public/photos/`
2. Open `lib/photos.ts` and put the filename in that slot's `src`

```ts
heroRoom: {
  src: "play-room.jpg",     // was null
  alt: "The main play room at T.L.C. Footprints, with low shelves and floor cushions",
  ratio: "16/9",
  spec: "The main play room, wide, daylight. Subject right of center, quiet left third. 2400 x 1350",
},
```

Until step 2 is done the site shows a labelled placeholder rather than the photo. That is deliberate: a slot that is empty on purpose should not look like a slot that is broken.

Then run `npm run optimize-images` to shrink new files in `public/photos/` for
the web. The command converts JPG and PNG photo uploads to WebP and replaces the
original uploads. The site's illustrated heroes are already stored as optimized
WebP files in `public/`.

The five slots, and what each one wants:

| Slot | Where it appears | Shape | Roughly |
| --- | --- | --- | --- |
| `heroRoom` | Home page, behind the whole hero | Wide landscape, 16:9 | 2400 x 1350 |
| `dayPlay` | Home page, behind "Hours and meals" | Wide landscape, 3:2 | 2000 x 1333 |
| `outdoor` | What to expect, behind the hours clock | Wide landscape, 3:2 | 2000 x 1333 |
| `portrait` | About, "Meet LaTrell" | Portrait, 4:5 | 1200 x 1500 |
| `meals` | What to expect, meals | Square, 1:1 | 1200 x 1200 |

`heroRoom`, `dayPlay`, and `outdoor` all run full-bleed with copy over them, so each one needs a quiet area for the words to sit on: the **left** third for `heroRoom`, the **right** third for the other two.

`heroRoom` is the one that runs behind an entire hero: it is the background of the entire hero, not a card beside the headline, so it gets cropped hard and unpredictably - tall on a phone, very wide on a desktop. Shoot it with the subject right of center and quiet floor or wall on the left, because that left third is where the headline and buttons land. It carries a cream scrim over it either way, so a slightly bright frame is fine; a busy left third is not.

**Photograph the space, not children.** Rooms, shelves, the yard, the table set for lunch. Empty rooms need no consent paperwork, and parents read them as "this is the room my child would be in". Daylight, no flash: the whole site is warm cream and a cool flash-lit photo will look pasted on.

**Never publish a photo showing another family's child without written permission from that family.**

Changing the `ratio` in `lib/photos.ts` changes the shape of the slot everywhere it appears, with no layout shift when the file loads, because the ratio is declared rather than measured.

---

## Part 2: Running the site locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export into out/
```

Node 20 or newer.

**If the site will not load,** the usual cause is an old dev server still holding port 3000. Stop any running server, delete the `.next` folder, and run `npm run dev` again.

Do not run `npm run build` while `npm run dev` is running. They both write to `.next` and it will break the dev server until you delete that folder.

---

## Part 3: Structure

```
app/                  One folder per page
  resources/[slug]/   Renders each article from content/resources
  layout.tsx          Shared shell, fonts, LocalBusiness structured data
  globals.css         Design tokens and base styles
components/
  brand/              Hand-drawn SVG logo motifs, the watercolor branches, and the hero embrace.
  effects/            Cursor footprint trail. Decoration only, safe to delete.
  media/              Photo slot. Renders a placeholder until lib/photos.ts
                      has a filename for it.
  layout/             Navbar, Footer, Logo, mobile action bar
  home/               Home page sections
  sections/           Reusable page shells
  ui/                 Buttons, cards, accordion, form pieces
  tour/               The tour request form
content/resources/    The articles, as .mdx files
lib/
  constants.ts        Every fact about the business. Single source of truth.
  photos.ts           Every photo slot: filename, alt text, crop, shot spec.
  seo.ts              Page metadata and structured data
  mdx.ts              Reads the article files
public/               Icons, OG image, photos
```

**The rule that keeps this maintainable:** no text about the business is typed directly into a component. It all comes from `lib/constants.ts`. That is why changing a rate in one place changes it everywhere, and it is what will make a Spanish translation an addition rather than a rewrite.

---

## Part 3b: Motion and depth

Everything in this section lives in the "MOTION AND DEPTH" block at the bottom of `app/globals.css`, plus one component. All of it switches itself off for anyone whose device asks for less motion, and none of it prints.

### What moves, and why

| Effect | Where | Notes |
| --- | --- | --- |
| Cursor footprint trail | Every page | `components/effects/FootprintTrail.tsx`. Mouse only. |
| Wind in the branches | Every sprig | `.sprig-sway` + `.leaf-sway` on `WatercolorBranch`. |
| Button sheen and lift | Every button | `.btn-shine` in `globals.css`, physics in `Button.tsx`. |
| Card lift + rainbow rule | Card grids | `.card-lift` and `.card-rule`. |
| Read progress | Navbar | The logo's three arcs, unrolled into a line. |
| Openings count-up | Home page | `components/ui/CountUp.tsx`. |
| Rainbow draw-in | Home hero | `.arc-draw`, once on load. |
| Branches swinging in | Section edges | `components/brand/ScrollSprig.tsx`. |
| The hero embrace | Home hero | `components/brand/EmbraceBranches.tsx`. Four arms reach out on load, then close as you scroll. |
| Drifting hearts | Home hero | Same file. Each parallaxes at its own rate, so the hero has depth rather than one flat plane. |
| Raised headings | Section openers | `.text-3d`, `.text-3d-hero`, `.text-3d-light`. |

### The rules these follow

**Nothing moves that a parent needs to read.** Motion is on decoration, on controls, and on one number. Never on body copy.

**Every effect has an off switch, and the OS is holding it.** `prefers-reduced-motion: reduce` zeroes every animation on the site in one rule. The trail and the count-up check the same preference in JavaScript and simply do not run.

**Hover effects are gated behind a real pointer.** They sit inside `@media (hover: hover) and (pointer: fine)`. A phone that fires `:hover` on tap would otherwise leave a button stuck mid-sheen until you tapped something else.

**Depth is consistent, not decorative.** Every raised object on the site (buttons, number discs, chips, the copy button) uses the same model: a hard offset shadow beneath it in a darker shade of its own color, growing on hover and collapsing on press. Form fields invert it: an inset shadow, so a field reads as a slot cut into the card rather than a button you can press.

### Turning things down

- **One branch is too busy:** pass `still` to that `BotanicalSprig`.
- **The hero is too leafy:** drop an entry from `ARMS` in `EmbraceBranches.tsx`, or lower its `opacity`. The four are independent; nothing else reads that list.
- **The hug closes too far:** lower `close` (degrees), `drift` (px sideways) or `lift` (px vertical) on that arm. Its resting angle is `baseClass`, which is Tailwind classes rather than a number because the angle changes at `lg`: a phone hero is tall and takes a near-vertical branch, a desktop hero is short and takes one laid over near-horizontal.
- **Two branches are swaying in lockstep:** give one a different `windScale` (a multiplier; above 1 is slower).
- **A branch swings too far:** lower `distance` on that `ScrollSprig` (pixels of travel), or `turn` (degrees of rotation). Set its resting angle with `tilt`, never with a Tailwind `rotate-*` class: the scroll transform writes an inline `transform` that would silently beat the utility.
- **A heading is too heavy:** drop `text-3d` from it. The class is for headings that *open* a section; a heading inside a raised panel already has one depth cue and does not want a second.
- **Kill the cursor trail:** delete the `<FootprintTrail />` line in `app/layout.tsx`. Nothing else depends on it.
- **Kill the read-progress bar:** delete the block marked `Read progress` in `components/layout/Navbar.tsx`.

### On photos and video

The site currently includes illustrated hero images plus five real-photo slots. The photo slots are wired and waiting, and nothing breaks while they are empty. Filling them with approved, optimized photography is the single biggest visual upgrade left.

**Do not ship stock photography to the live site.** For a childcare provider trust is the entire product, and a parent who reverse-image-searches one photo and finds it on three other daycare sites is gone. Stock is fine in a mock-up to show LaTrell what the layout looks like populated; swap it before launch.

**Video can wait.** A short silent clip of the space would work in the hero eventually, but it costs a large file on a static host, needs a poster image and a reduced-motion fallback anyway, and does nothing the photos will not do first.

---

## Part 4: Going live on tlcfootprints.com

The same repository supports both deployment stages without editing source files.

### GitHub Pages client preview

The included workflow sets:

```text
DEPLOY_TARGET=github-pages
NEXT_PUBLIC_SITE_URL=https://alectronic-solutions.github.io/TLCFootprints2
```

This adds the `/TLCFootprints2` path automatically. Preview pages also receive
`noindex`, so the temporary copy cannot compete with the final domain in search.

### Cloudflare Pages final site

Create a Cloudflare Pages project from the same GitHub repository and use:

```text
Build command: npm run build
Output directory: out
DEPLOY_TARGET=cloudflare
NEXT_PUBLIC_SITE_URL=https://tlcfootprints.com
```

The Cloudflare build removes the repository path, enables indexing, generates
custom-domain canonicals and sitemap URLs, and applies the response headers in
`public/_headers`. Then connect the client's custom domain in Cloudflare, wire
the form endpoint, submit `https://tlcfootprints.com/sitemap.xml` in Google
Search Console, and create or claim the Google Business Profile with a hidden
home address.

### Wiring up the tour form

The form validates properly and shows a simple thank-you state, but **it does not send anything yet**. It is presentation-only until a form endpoint is connected.

For production, prefer a Cloudflare Pages Function so validation, rate limiting,
Turnstile verification, and delivery credentials stay server-side. In
`components/tour/TourRequestForm.tsx`, replace the simulated delay in `onSubmit`
with a request to that function.

The honeypot field is already in place. Leave it, because form endpoints on public sites start receiving spam within weeks.

### The thing that matters most for being found

The site is built for local search: structured data, an FAQ marked up for Google, and articles targeting what Elk Grove parents actually search for.

But in the first year, **the Google Business Profile will do more than the website will.** Do not automatically configure it as a hidden-address service-area business: families are served at the daycare home, while Google reserves hidden addresses for businesses that do not serve customers at their address. LaTrell should decide whether she is comfortable publishing the address and confirm Google's current home-business and signage requirements before creating the profile. Then claim accurate directory listings that link back to tlcfootprints.com.

---

## Part 5: Still outstanding

Use `CLIENT-SIGNOFF.md` as the client-facing approval record. It separates
confirmed facts, open policy decisions, content approval, photo permission,
privacy operations, and final launch authorization. Do not publish invented
placeholder facts while decisions are pending.

### Questions for LaTrell

1. Your background: years in childcare, what you did before, why you started.
2. ECE units, a Child Development Permit, or other credentials beyond CPR.
3. **Where infant rates end and toddler rates begin.** Your brief prices two tiers but never says at what age a child moves from the $305 tier to the $285 one. Nothing on the site claims a boundary until you confirm it: the tiers are named, and the site states "birth through 5 years" for the home overall. A parent with an 18-month-old currently cannot tell which rate applies to them, so this is worth answering.
4. **Your licensed capacity, small (8) or large (14).** Nothing on the site claims a number until this is confirmed. It currently says "a small home setting", which is accurate either way.
5. Whether there is an assistant or second adult in the home.
6. Your outdoor play space: yard, equipment, shade.
7. Pets in the home, and whether the home is smoke-free. Parents ask every time and it is allergy-relevant.
8. Facebook or Instagram handles, if you have them.
9. Approved photos of the space.
10. Confirmation that "Opening August 3rd" from the flyers is superseded by "now enrolling". The site says now enrolling everywhere.
11. Your review of the nine resource articles.
12. Whether you speak Spanish. Elk Grove is one of the most diverse cities in the country and almost no competitor advertises bilingual care, so it would be a real advantage.
13. **Your actual daily routine.** This is the big one. The site had a full
    hour-by-hour schedule on it that nobody gave us: arrival, play blocks,
    outdoor time, a 1:00 rest, a 5:00 pickup. It has been removed. What the day
    now shows is your open window, 7:30 to 6:00, and nothing else. Send the real
    shape of your day and it can go back.
14. **Whether you have a nap or rest policy**, and how you would want it worded.
    Nothing about naps or rest is published anywhere right now.
15. **How meals work for infants** - at what point a baby moves onto the
    breakfast-and-snacks arrangement, and what families send in the meantime.
16. Your ZIP code, and whether you are comfortable with the site publishing it.
    It is currently not published anywhere, including in the structured data.
17. Whether to publish approximate map coordinates. Google can place a business
    without them, so the site publishes none.
18. **How families can pay you** besides Child Action. Cash and check were listed
    in the structured data on an assumption and have been removed.
19. Which Elk Grove areas you want named as places you serve, if any. The site
    now claims Elk Grove and nothing more specific.
20. How quickly you actually want to promise to reply. The tour form said "within
    one business day" on an assumption; it now just says you will get back to
    them.

### Deliberately left off the site

At LaTrell's request: the potty-training policy, the tour cancellation and rescheduling policy, any wait-list, and testimonials. Testimonials can be added once families enroll and give written permission.

### Unverified claims still on the site

Everything factual on the site traces to LaTrell's brief, with one category of
exception: prose written *from* her brief that elaborates on it. Those sentences
are reasonable, they are in her voice, and she has not read them. They are worth
her eye before launch, in rough order of how load-bearing they are:

- `app/about/page.tsx` - the whole "Meet LaTrell" bio. Flagged in the code; the
  callout that used to say so on the public page has been removed.
- `components/home/ThelmaStory.tsx` - the grandmother passage. The brief gives
  the name origin; the story around it was written.
- `lib/constants.ts` `EXPECTATIONS` - she supplied thirteen bare phrases. Every
  `detail` line under them was written.
- `lib/constants.ts` `PROGRAMS` - the `detail` and `highlights` for both tiers,
  including the activity list and the infant communication commitments.
- `lib/constants.ts` `FAQS` - the sick-child answer and the what-to-bring answer
  are policies she never stated. Both are also emitted as FAQPage structured data.
- `lib/constants.ts` `ENROLLMENT_STEPS` - the paperwork list and the first-week
  ease-in.
- `app/tour/page.tsx` - the note that the address is shared when a tour is
  confirmed.
- All nine `content/resources/*.mdx` articles, already listed as question 11.
  Their unsupported first-person claims have been stripped, but the general
  parenting and industry statistics in them are unsourced: "most babies take one
  to three weeks to settle", "almost every family is fine by week three", the
  Child Action income threshold, and the Child Action phone number all need
  checking against a source.

Anything she corrects should be corrected in `lib/constants.ts` where possible,
not in a component.

### Before launch

- Add the Cloudflare Web Analytics token. It is cookieless, so the site needs no cookie banner, which matters on a site where parents type a child's name. **The privacy page currently states that the site uses no analytics and sets no cookies, which is true today - update that paragraph when analytics go in.**
- Add the Google Search Console verification tag in `app/layout.tsx`.
- Confirm the license lookup resolves for #394501929 at the California Department of Social Services facility search.
