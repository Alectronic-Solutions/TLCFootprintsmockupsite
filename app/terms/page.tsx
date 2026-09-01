import Link from "next/link";
import { PolicyPage } from "@/components/sections/PolicyPage";
import { BUSINESS } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms of Use",
  description:
    "Terms for using the T.L.C. Footprints Home Daycare website, including rates, availability, inquiry forms, and parent resources.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PolicyPage
      label="Terms of use"
      title="Terms for using this website"
      subtitle="These terms cover the website itself. Child care is governed by the enrollment agreement you sign, not by this page."
      updated="August 31, 2026"
    >
      <h2>Acceptance of these terms</h2>
      <p>
        By using this website, you agree to these Terms of Use and the{" "}
        <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please do not use the
        site. These terms apply only to the website and do not replace any signed
        enrollment agreement, parent handbook, or other child care policy.
      </p>

      <h2>What this site is</h2>
      <p>
        This website provides information about {BUSINESS.name}, a licensed California
        Family Child Care Home in {BUSINESS.city}, {BUSINESS.state}, license{" "}
        <a href={BUSINESS.licenseRecordUrl} target="_blank" rel="noopener noreferrer">
          #{BUSINESS.license}
        </a>
        . The site is informational. Nothing on it creates an enrollment agreement,
        guarantees a child care space, or confirms a tour.
      </p>

      <h2>Rates and availability</h2>
      <p>
        Published rates and openings are kept as current as reasonably possible, but they
        can change, and openings can be filled between updates. The enrollment status on
        the site includes its last-updated date. Confirm current rates, schedules, deposit
        terms, and availability directly before making a decision or payment.
      </p>

      <h2>Tour and availability forms</h2>
      <p>
        The online forms send the details you provide to {BUSINESS.name} so the program
        can respond to your inquiry. A submitted form does not guarantee a response,
        confirm current availability, or confirm a tour. No tour is confirmed until
        {BUSINESS.owner} replies and agrees to a date and time.
      </p>
      <p>
        A tour request or conversation does not reserve a space. A space is reserved only
        after the required enrollment steps and deposit are complete under the applicable
        enrollment agreement.
      </p>

      <h2>No emergency or professional service</h2>
      <p>
        This website is not monitored for emergencies. Call 911 for an emergency. Do not
        use the website or a routine email or text to request urgent medical help, report
        an immediate safety concern, or deliver time-sensitive care instructions.
      </p>

      <h2>Parent resource articles</h2>
      <p>
        The resource articles provide general educational information to help families ask
        questions and make decisions. They are not legal, medical, financial, or licensing
        advice and are not a substitute for advice from a qualified professional. Rules,
        forms, and program requirements can change.
      </p>
      <p>
        The California Department of Social Services, California Department of Public
        Health, Child Action, and other agencies are the authorities on their own current
        requirements. Check the linked official source before relying on an article for a
        time-sensitive decision.
      </p>

      <h2>Permitted use</h2>
      <p>
        You may use this site for personal, noncommercial purposes related to learning
        about {BUSINESS.name} or child care. Do not misuse the site, attempt to interfere
        with its operation or security, submit unlawful or harmful material, impersonate
        another person, or use automated means to overload the site.
      </p>

      <h2>Content and intellectual property</h2>
      <p>
        Unless otherwise stated, the original text, logo, illustrations, and site design
        belong to {BUSINESS.name} or are used with permission. You may print or save a
        reasonable copy for personal use. Do not reproduce, publish, sell, or create a
        commercial derivative of the content without permission. Government forms and
        other third-party materials remain the property of their respective owners.
      </p>

      <h2>Links to other sites</h2>
      <p>
        This site links to independent government, agency, and business websites for
        convenience. {BUSINESS.name} does not control those sites and is not responsible
        for their content, availability, security, accessibility, or privacy practices. A
        link does not imply endorsement unless the site expressly says so.
      </p>

      <h2>Availability of the website</h2>
      <p>
        Reasonable efforts are made to keep the site accurate and available, but continuous
        or error-free access is not guaranteed. Content may be corrected, updated, moved,
        or removed without notice. To the extent permitted by law, {BUSINESS.name} is not
        liable for losses caused solely by reliance on outdated website information or by
        temporary website unavailability.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        These terms may be updated when the site&apos;s content, services, or legal
        requirements change. The revised terms will be posted here with a new effective
        date. Continued use of the site after an update means the revised terms apply to
        later use.
      </p>

      <h2>Governing law</h2>
      <p>
        These website terms are governed by California law, without regard to
        conflict-of-law principles. If one provision is found unenforceable, the remaining
        provisions continue to apply.
      </p>

      <h2>Effective date and contact</h2>
      <p>
        Effective August 31, 2026. Questions about these terms can be sent to{" "}
        <a href={BUSINESS.emailHref}>{BUSINESS.email}</a> or discussed by calling{" "}
        <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.
      </p>
    </PolicyPage>
  );
}
