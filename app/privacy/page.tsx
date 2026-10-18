import { PolicyPage } from "@/components/sections/PolicyPage";
import { BUSINESS } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";
import { DEPLOY_TARGET } from "@/lib/site";

export const metadata = pageMeta({
  title: "Privacy",
  description:
    "How T.L.C. Footprints Home Daycare collects, uses, protects, retains, and shares information connected with this website.",
  path: "/privacy",
});

const hostingProvider =
  DEPLOY_TARGET === "cloudflare"
    ? { name: "Cloudflare", privacyUrl: "https://www.cloudflare.com/privacypolicy/" }
    : {
        name: "GitHub Pages",
        privacyUrl: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement",
      };

export default function PrivacyPage() {
  return (
    <PolicyPage
      label="Privacy policy"
      title="How information is handled"
      subtitle="This policy explains what this website collects, what it does not collect, and the choices available to you."
      updated="October 18, 2026"
    >
      <h2>The short version</h2>
      <p>
        {BUSINESS.name} does not sell personal information, use it for behavioral
        advertising, or add inquiries to a marketing list. The site does not currently
        use analytics or third-party advertising trackers.
      </p>
      <p>
        The online tour and availability forms send the details you provide to
        {" "}{BUSINESS.name} by email so the program can respond to your inquiry. The
        forms are for adults seeking child care information; please do not include
        sensitive information.
      </p>

      <h2>Who operates this website</h2>
      <p>
        This website is operated by {BUSINESS.name}, a licensed California Family Child Care
        Home owned by {BUSINESS.owner} in {BUSINESS.city}, {BUSINESS.state}. Privacy questions
        can be sent to <a href={BUSINESS.emailHref}>{BUSINESS.email}</a> or discussed by
        calling <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.
      </p>

      <h2>Information entered in the inquiry forms</h2>
      <p>The tour and availability forms ask an adult for:</p>
      <ul>
        <li>The parent or guardian&apos;s name, phone number, and email address</li>
        <li>The child&apos;s age or date of birth, but not the child&apos;s name</li>
        <li>The type of care, schedule, anticipated start date, and relevant days or times</li>
        <li>Contact preference and anything voluntarily written in the message field</li>
      </ul>
      <p>
        When you submit either form, these details are sent to a form service that runs on
        Cloudflare. It checks the spam protection described below and then delivers the
        inquiry to {BUSINESS.name} by email. The details are used to
        respond to your inquiry and discuss possible care. Please do not enter Social
        Security numbers, medical records, financial account numbers, government
        identification numbers, or other sensitive records. Required enrollment records
        are handled separately after a family decides to enroll.
      </p>

      <h2>Calls, texts, and emails</h2>
      <p>
        If you contact {BUSINESS.name} by phone, text, or email, the information you choose
        to share is processed by the phone carrier, messaging service, or email provider
        used by you and {BUSINESS.name}. It may include your contact details, information
        about the care you need, and the content of your message.
      </p>

      <h2>Brightwheel</h2>
      <p>
        {BUSINESS.name} uses Brightwheel, a third-party child care platform, with families.
        The Join the Interest List and Brightwheel Sign-In links on this site open
        Brightwheel&apos;s own website, which may ask you to sign in or create an account.
        Anything you enter there is collected by Brightwheel, shared with {BUSINESS.name},
        and handled under{" "}
        <a href="https://mybrightwheel.com/privacy/" target="_blank" rel="noopener noreferrer">
          Brightwheel&apos;s privacy policy
        </a>
        .
      </p>

      <h2>Technical information</h2>
      <p>
        The site is delivered through{" "}
        <a href={hostingProvider.privacyUrl} target="_blank" rel="noopener noreferrer">
          {hostingProvider.name}
        </a>
        . That provider may automatically process ordinary technical information needed to
        deliver and protect the site, such as an IP address, browser and device type,
        requested pages, referring page, date and time, and security signals. This
        information is used for delivery, reliability, abuse prevention, and
        troubleshooting rather than advertising by {BUSINESS.name}.
      </p>

      <h2>How information is used</h2>
      <ul>
        <li>To answer questions and inquiries received through the forms, phone, text, or email</li>
        <li>To discuss availability, programs, schedules, tours, and possible enrollment</li>
        <li>To protect the website, prevent abuse, and diagnose technical issues</li>
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
        <li>The hosting, security, and form-processing providers that deliver and protect the website</li>
        <li>Email-delivery providers used to send form inquiries to {BUSINESS.name}</li>
        <li>
          Phone, mobile carrier, messaging, and email providers involved when a person
          chooses to call, text, or email
        </li>
        <li>
          Professional advisers or government authorities when reasonably necessary to
          comply with law, protect rights or safety, or respond to a valid legal request
        </li>
      </ul>

      <h2>Cookies, analytics, and privacy signals</h2>
      <p>
        {BUSINESS.name} does not currently use analytics, include embedded social media
        widgets, or use advertising trackers on this site. The online inquiry forms use{" "}
        <a
          href="https://www.cloudflare.com/turnstile-privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cloudflare Turnstile
        </a>{" "}
        spam protection, which may process essential technical information and use
        necessary browser storage or cookies to detect and prevent automated submissions.
        The hosting and security provider may also use essential technical measures to
        serve the site and detect abuse.
      </p>
      <p>
        The checklists in the parent resource articles remember the items you tick by
        saving them in your own browser&apos;s local storage. That information stays on
        your device and is never sent to {BUSINESS.name}. Unticking the items, or clearing
        this site&apos;s data in your browser settings, removes it.
      </p>
      <p>
        Because the site does not sell personal information or track visitors over time
        across unrelated websites, browser Do Not Track and Global Privacy Control signals
        do not change the site&apos;s current behavior. If analytics or another nonessential
        technology is added, this policy will be updated before it is enabled, and any
        legally required choice will be provided.
      </p>

      <h2>Retention</h2>
      <p>
        Information received through the inquiry forms, phone, text, or email is kept only
        as long as reasonably needed to respond, evaluate a possible enrollment, maintain
        necessary business records, resolve a dispute, or comply with law. Information
        that is no longer needed is deleted or securely disposed of when reasonably
        practicable.
      </p>
      <p>
        Records for enrolled children, including forms required of licensed providers,
        are maintained separately from this website and are governed by the enrollment
        agreement and applicable child care recordkeeping requirements.
      </p>

      <h2>Your choices</h2>
      <p>
        You may ask what personal information from a direct inquiry is maintained, ask for
        inaccurate information to be corrected, or request deletion. Email{" "}
        <a href={BUSINESS.emailHref}>{BUSINESS.email}</a> or call{" "}
        <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>. Identity may need to be
        reasonably verified before information is disclosed, changed, or deleted. Some
        records may be retained when required by law or reasonably needed for a dispute.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        This website is intended for parents, guardians, and other adults. It does not ask
        children to submit information. Any information about a child is expected to be
        provided by the child&apos;s parent or guardian. If you believe a child submitted
        personal information directly, contact {BUSINESS.owner} so it can be reviewed and
        deleted as appropriate.
      </p>

      <h2>Security</h2>
      <p>
        Reasonable administrative and technical safeguards are used for information under{" "}
        {BUSINESS.name}&apos;s control. No website, email system, text-message service,
        or method of internet transmission can be guaranteed completely secure. Do not
        send sensitive enrollment documents through a routine email or text unless a safe
        method has been agreed on.
      </p>

      <h2>Other websites</h2>
      <p>
        This site links to government agencies, Brightwheel, the program&apos;s Instagram
        and TikTok profiles, and other independent websites. Their own privacy policies
        apply after you leave this website.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        Changes will be posted on this page with a revised effective date. The policy will
        be updated before analytics or other nonessential tracking is enabled, or when a
        material change is made to how inquiry information is handled.
      </p>

      <h2>Effective date and contact</h2>
      <p>
        Effective October 18, 2026. Questions or requests may be sent to{" "}
        <a href={BUSINESS.emailHref}>{BUSINESS.email}</a> or made by calling{" "}
        <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.
      </p>
    </PolicyPage>
  );
}
