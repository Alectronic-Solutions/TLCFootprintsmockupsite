import { PolicyPage } from "@/components/sections/PolicyPage";
import { BUSINESS } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Accessibility",
  description:
    "T.L.C. Footprints' accessibility approach, known limitations, contact options, and help available if a website barrier is encountered.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <PolicyPage
      label="Accessibility"
      title="Using this website"
      subtitle="T.L.C. Footprints wants parents and guardians to be able to get the information they need, including people who use assistive technology."
      updated="August 24, 2026"
    >
      <h2>Our approach</h2>
      <p>
        This website is designed with recognized accessibility practices in mind, using
        the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA as a design and
        testing goal. Accessibility is an ongoing effort rather than a one-time
        certification, particularly as content, photographs, forms, browsers, and
        assistive technologies change.
      </p>

      <h2>Measures used on this site</h2>
      <ul>
        <li>Semantic headings, lists, tables, labels, and page landmarks</li>
        <li>Visible keyboard focus and keyboard-operable primary navigation and controls</li>
        <li>Text alternatives for meaningful images and hidden treatment for decoration</li>
        <li>Color and non-color cues for form errors and important status information</li>
        <li>Support for browser zoom, text reflow, mobile layouts, and reduced motion</li>
        <li>Permanently visible form labels and descriptive validation messages</li>
        <li>Call, text, and email alternatives to the website&apos;s tour form</li>
      </ul>

      <h2>Known limitations</h2>
      <p>
        The tuition table scrolls horizontally on narrow screens; the same figures are
        also presented in the program descriptions so the information is not available
        only through that table. External websites linked from this site are controlled
        by their respective owners and may have different accessibility practices.
      </p>
      <p>
        Testing can reduce barriers but cannot guarantee identical operation with every
        browser, device, assistive-technology version, user setting, or future third-party
        service. Reported barriers will be reviewed and reasonable efforts will be made to
        correct problems in content or functionality controlled by {BUSINESS.name}.
      </p>

      <h2>If you encounter a barrier</h2>
      <p>
        Please describe the page, the task you were trying to complete, what happened,
        and, if you are comfortable sharing it, the browser, device, or assistive technology
        being used. Do not include sensitive information.
      </p>
      <p>
        Call or text <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>, or email{" "}
        <a href={BUSINESS.emailHref}>{BUSINESS.email}</a>. If a website feature is
        preventing access, {BUSINESS.owner} can provide the same daycare information or
        help arrange a tour through another communication method while the issue is
        reviewed.
      </p>

      <h2>Ongoing review</h2>
      <p>
        Accessibility will be reconsidered when major content, forms, navigation,
        photographs, or third-party services are added or changed. This statement will be
        updated when the approach or known limitations materially change.
      </p>

      <h2>Effective date</h2>
      <p>Effective August 24, 2026.</p>
    </PolicyPage>
  );
}
