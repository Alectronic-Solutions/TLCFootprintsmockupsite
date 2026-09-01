import { PolicyPage } from "@/components/sections/PolicyPage";
import { BUSINESS } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Accessibility",
  description:
    "T.L.C. Footprints' accessibility approach, current limitations, contact options, and help available if a website barrier is encountered.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <PolicyPage
      label="Accessibility"
      title="Using this website"
      subtitle="T.L.C. Footprints wants parents and guardians to be able to get the information they need, including people who use assistive technology."
      updated="August 31, 2026"
    >
      <h2>Our commitment</h2>
      <p>
        {BUSINESS.name} is committed to providing a website that people with disabilities
        can use. The{" "}
        <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener noreferrer">
          Web Content Accessibility Guidelines (WCAG) 2.2 Level AA
        </a>{" "}
        are used as the design and testing goal for this site. This is a goal, not a claim
        that every page has been independently certified as conformant.
      </p>

      <h2>Measures used on this site</h2>
      <ul>
        <li>Semantic headings, lists, tables, form labels, and page landmarks</li>
        <li>Visible keyboard focus and keyboard-operable navigation and controls</li>
        <li>A skip link that moves directly to the main content</li>
        <li>Text alternatives for meaningful images and hidden treatment for decoration</li>
        <li>Color and non-color cues for form errors and important status information</li>
        <li>Support for browser zoom, text reflow, mobile layouts, and reduced motion</li>
        <li>Permanently visible form labels and descriptive validation messages</li>
        <li>Call, text, and email alternatives to the website&apos;s inquiry forms</li>
      </ul>

      <h2>Current limitations</h2>
      <p>
        The tour and availability forms validate entries and send submitted inquiries to
        {" "}{BUSINESS.name}. Call, text, and email options are also provided on both pages
        so the same inquiry can be made without using a form.
      </p>
      <p>
        One resource article contains a rate table that scrolls horizontally on narrow
        screens. The same rates are also available as responsive cards on the Programs and
        Rates page, and a visible instruction explains how to view every table column on a
        small screen.
      </p>
      <p>
        Some pages contain optional motion or visual interactions, such as animated
        illustrations and a puzzle. The essential child care information is also provided
        as text, and the content does not depend on completing an interaction. External
        websites linked from this site are controlled by their respective owners and may
        have different accessibility practices.
      </p>

      <h2>Testing and ongoing review</h2>
      <p>
        Accessibility is reviewed when navigation, forms, content, photographs, or major
        interactions change. Checks include responsive layouts, keyboard use, reduced
        motion, labels, headings, and text alternatives. Testing can reduce barriers but
        cannot guarantee identical operation with every browser, device,
        assistive-technology version, or user setting.
      </p>
      <p>
        Reported barriers will be reviewed, and reasonable efforts will be made to correct
        problems in content or functionality controlled by {BUSINESS.name}. This statement
        will be updated when the approach or known limitations materially change.
      </p>

      <h2>If you encounter a barrier</h2>
      <p>
        Please describe the page, the task you were trying to complete, what happened, and,
        if you are comfortable sharing it, the browser, device, or assistive technology
        being used. Do not include sensitive information.
      </p>
      <p>
        Call or text <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>, or email{" "}
        <a href={BUSINESS.emailHref}>{BUSINESS.email}</a>. If a website feature is
        preventing access, {BUSINESS.owner} can provide the same child care information or
        help arrange a tour through another communication method while the issue is
        reviewed.
      </p>

      <h2>Effective date</h2>
      <p>Effective August 31, 2026.</p>
    </PolicyPage>
  );
}
