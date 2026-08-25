import { PolicyPage } from "@/components/sections/PolicyPage";
import { BUSINESS } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms of Use",
  description:
    "Terms for using the T.L.C. Footprints Home Daycare website, including how published rates and availability should be read.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PolicyPage
      label="Terms of use"
      title="Terms for using this website"
      subtitle="These cover the website itself. Care is governed by the enrollment agreement you sign, not by this page."
      updated="August 2026"
    >
      <h2>What this site is</h2>
      <p>
        This website provides information about {BUSINESS.name}, a licensed California
        Family Child Care Home in {BUSINESS.city}, {BUSINESS.state}, license{" "}
        <a href={BUSINESS.licenseRecordUrl} target="_blank" rel="noopener noreferrer">
          #{BUSINESS.license}
        </a>
        . It is informational. Nothing on it creates an enrollment
        agreement or guarantees a space.
      </p>

      <h2>Rates and availability</h2>
      <p>
        Published rates and openings are kept current, but they can change and openings
        can be filled between updates. The date the enrolling status was last updated is
        shown beside it on the home page. Confirm current rates and availability directly
        before relying on them.
      </p>

      <h2>Tour requests</h2>
      <p>
        Sending a tour request does not reserve a space or confirm an appointment. A tour
        is confirmed only when {BUSINESS.owner} replies to arrange a time. Spaces are
        reserved only once enrollment paperwork and the deposit are complete.
      </p>

      <h2>The resource articles</h2>
      <p>
        The parent resource articles are general information written to help families
        make decisions. They are not legal, medical, or financial advice. Rules for
        licensing and subsidy programs are set by the State of California and by Child
        Action, and those agencies are the authority on their own current requirements.
      </p>

      <h2>Links to other sites</h2>
      <p>
        This site links to government and agency websites, including the California
        Department of Social Services. Those sites are not controlled by{" "}
        {BUSINESS.name} and are governed by their own terms.
      </p>

      <h2>Content</h2>
      <p>
        The text, logo, and illustrations on this site belong to {BUSINESS.name}. Please
        do not reproduce them without permission.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can go to{" "}
        <a href={BUSINESS.emailHref}>{BUSINESS.email}</a> or{" "}
        <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.
      </p>
    </PolicyPage>
  );
}
