import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { BUSINESS, TUITION } from "@/lib/constants";

/**
 * Payment and enrollment terms, sitting beside the clipboard.
 *
 * Down to three facts from the four the old combined card carried.
 * Transportation moved to the clipboard's "not in the rate" list a few
 * inches to the left - stating it in both places was one of the four
 * near-identical checklists this redesign was built to remove.
 */
export function PaymentFacts() {
  return (
    <Card className="lg:sticky lg:top-28">
      <h2 className="text-h3">Payment and enrollment</h2>

      <dl className="mt-5 space-y-5">
        <div>
          <dt className="text-eyebrow font-bold uppercase text-leaf-dark">
            Enrollment deposit
          </dt>
          <dd className="tabular mt-1 font-display text-3xl font-semibold text-cocoa">
            ${TUITION.depositAmount}
          </dd>
          <dd className="mt-0.5 text-base text-cocoa-mid">{TUITION.depositNote}</dd>
        </div>
        <div>
          <dt className="text-eyebrow font-bold uppercase text-leaf-dark">
            Payment schedule
          </dt>
          <dd className="mt-1 text-base">{TUITION.schedule}</dd>
        </div>
        <div>
          <dt className="text-eyebrow font-bold uppercase text-leaf-dark">
            Subsidy assistance
          </dt>
          <dd className="mt-1 text-base">
            {TUITION.subsidy} Child Action administers subsidized child care in{" "}
            {BUSINESS.county}.
          </dd>
        </div>
      </dl>

      <div className="mt-7 border-t-hair border-cocoa/10 pt-6">
        <Link
          href="/resources/child-action-subsidy-sacramento"
          className="group inline-flex items-center gap-2 text-base font-semibold text-cocoa underline decoration-pink/50 underline-offset-4 transition-colors hover:text-pink-dark"
        >
          How Child Action subsidies work
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </Card>
  );
}
