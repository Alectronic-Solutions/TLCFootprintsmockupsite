import { DayBand } from "@/components/sections/DayBand";
import { Clause, Phrase } from "@/components/ui/Run";
import { BUSINESS } from "@/lib/constants";

/**
 * The full-bleed moment the About page otherwise lacks. A thin wrapper over
 * the shared DayBand - see that file for the markup this and its Home /
 * What to Expect siblings now share.
 *
 * HARD CONSTRAINT, from lib/constants.ts (the removed DAILY_RHYTHM note): no
 * daily schedule is published. No clock times beyond the open window, no nap
 * policy, no arrival or pickup moments. This band shows the open window -
 * BUSINESS.hours - and nothing else.
 */
export function AboutDayBand() {
  return (
    <DayBand
      side="clock-right"
      copyAlign="text-center"
      clockClassName="mx-auto max-w-sm"
      label="Hours and availability"
      title={
        <>
          <Clause>
            <Phrase>{BUSINESS.hours.days},</Phrase>
          </Clause>{" "}
          <Clause>
            {BUSINESS.hours.open} to {BUSINESS.hours.close}
          </Clause>
        </>
      }
      lead={<>{BUSINESS.hours.closed}.</>}
    />
  );
}
