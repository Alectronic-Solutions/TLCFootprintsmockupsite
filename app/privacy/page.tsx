import { PolicyPage } from "@/components/sections/PolicyPage";
import { BUSINESS } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy",
  description:
    "How T.L.C. Footprints Home Daycare collects, uses, protects, retains, and shares information submitted through this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PolicyPage
      label="Privacy policy"
      title="How information is handled"
      subtitle="This policy explains what this website collects, why it is needed, and the choices available to you."
      updated="August 24, 2026"
    >
      <h2>The short version</h2>
      <p>
        {BUSINESS.name} does not sell personal information, use it for behavioral
        advertising, or add tour enquiries to a marketing list. Information submitted by
        a parent or guardian is used to answer the enquiry, discuss care, and manage a
        possible enrollment.
      </p>
      <p>
        <strong>Current preview:</strong> the tour form presently demonstrates the
        submission experience but is not connected to a delivery or storage system. It
        validates entries in the browser and then displays a thank-you message. This
        policy must be updated with the selected form and email providers before that
        connection is activated for the public.
      </p>

      <h2>Who operates this website</h2>
      <p>
        This website is operated for {BUSINESS.name}, a California Family Child Care Home
        owned by {BUSINESS.owner} in {BUSINESS.city}, {BUSINESS.state}. Privacy questions
        can be sent to <a href={BUSINESS.emailHref}>{BUSINESS.email}</a> or discussed by
        calling <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.
      </p>

      <h2>Information you choose to provide</h2>
      <p>When the live tour form is connected, it will ask an adult for:</p>
      <ul>
        <li>The parent or guardian&apos;s name, phone number, and email address</li>
        <li>The child&apos;s age, but not the child&apos;s name or full birth date</li>
        <li>The type of care, schedule, anticipated start date, and possible tour times</li>
        <li>Contact preference and anything voluntarily written in the message field</li>
      </ul>
      <p>
        Please do not submit Social Security numbers, medical records, financial account
        numbers, government identification numbers, or other sensitive records through
        the tour form. Required enrollment records are handled separately after a family
        decides to enroll.
      </p>

      <h2>Technical information</h2>
      <p>
        The website&apos;s hosting and security provider may automatically process ordinary
        technical information needed to deliver and protect the site, such as an IP
        address, browser and device type, requested pages, referring page, date and time,
        and security signals. This information is used for delivery, reliability, abuse
        prevention, and troubleshooting rather than advertising.
      </p>

      <h2>How information is used</h2>
      <ul>
        <li>To answer questions and respond to tour requests</li>
        <li>To discuss availability, programs, schedules, and possible enrollment</li>
        <li>To protect the website, prevent spam or abuse, and diagnose technical issues</li>
        <li>To maintain reasonable business records and comply with legal obligations</li>
      </ul>
      <p>
        Contact information is not used for promotional email unless the person separately
        and clearly asks to receive it.
      </p>

      <h2>How information may be shared</h2>
      <p>
        Personal information is not sold, rented, or shared for cross-context behavioral
        advertising. It may be provided only to:
      </p>
      <ul>
        <li>
          Hosting and security providers, including Cloudflare, acting to deliver and
          protect the website
        </li>
        <li>
          A form-delivery or email provider selected before launch, acting to deliver the
          enquiry to {BUSINESS.owner}
        </li>
        <li>
          Professional advisers or government authorities when reasonably necessary to
          comply with law, protect rights or safety, or respond to a valid legal request
        </li>
      </ul>
      <p>
        Service providers receive only the information reasonably needed for their role
        and operate under their own terms and privacy commitments.
      </p>

      <h2>Cookies, analytics, and privacy signals</h2>
      <p>
        This site does not currently use advertising cookies or analytics. Hosting and
        security services may use essential technical measures to serve the site and
        detect abuse. If analytics or other nonessential technologies are added, this
        policy will be updated before they are enabled and any legally required choice
        will be provided.
      </p>
      <p>
        Because the site does not sell personal information or track visitors over time
        across unrelated websites, browser Do Not Track and Global Privacy Control signals
        do not change the site&apos;s current behavior.
      </p>

      <h2>Retention</h2>
      <p>
        Tour enquiries are kept only while reasonably needed to respond, evaluate a
        possible enrollment, maintain necessary business records, resolve a dispute, or
        comply with law. Information that is no longer needed is deleted or securely
        disposed of. A person may request earlier deletion using the contact information
        below, subject to records that must legally be retained.
      </p>
      <p>
        Records for enrolled children, including forms required of licensed providers,
        are maintained separately from this website and governed by the enrollment
        agreement and applicable childcare recordkeeping requirements.
      </p>

      <h2>Your choices</h2>
      <p>
        You may ask what personal information from a website enquiry is maintained, ask
        for inaccurate information to be corrected, or request deletion. Email{" "}
        <a href={BUSINESS.emailHref}>{BUSINESS.email}</a> or call{" "}
        <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>. Identity may need to be
        reasonably verified before information is disclosed, changed, or deleted.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        This website is intended for parents, guardians, and other adults. It does not ask
        children to submit information. Information about a child in a tour enquiry is
        provided by the child&apos;s parent or guardian. If you believe a child submitted
        personal information directly, contact {BUSINESS.owner} so it can be reviewed and
        deleted as appropriate.
      </p>

      <h2>Security</h2>
      <p>
        Reasonable administrative and technical safeguards are used to protect submitted
        information. No website, email system, or method of internet transmission can be
        guaranteed completely secure, so sensitive enrollment documents should not be
        sent through the tour form.
      </p>

      <h2>Other websites</h2>
      <p>
        This site links to government agencies and other independent websites. Their own
        privacy policies apply after you leave this website.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        Changes will be posted on this page with a revised effective date. If a change
        materially affects how previously submitted information is used, a more prominent
        notice will be provided when reasonably appropriate.
      </p>

      <h2>Effective date and contact</h2>
      <p>
        Effective August 24, 2026. Questions or requests may be sent to{" "}
        <a href={BUSINESS.emailHref}>{BUSINESS.email}</a> or made by calling{" "}
        <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.
      </p>
    </PolicyPage>
  );
}
