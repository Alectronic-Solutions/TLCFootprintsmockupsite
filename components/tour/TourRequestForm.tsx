"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BUSINESS, PROGRAMS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/ui/AnimatedSection";

interface FormValues {
  parentName: string;
  childAge: string;
  phone: string;
  email: string;
  contactPreference: "phone" | "text" | "email";
  careType: string;
  schedule: "full-time" | "part-time";
  startDate: string;
  tourTimes: string;
  message: string;
  /** Honeypot. Real people never fill this in. */
  website: string;
}

/**
 * Fields are recessed rather than raised: an inset shadow reads as a slot cut
 * into the card, which is the opposite of the buttons and keeps the two from
 * competing. `focus:outline-none` is only safe because the ring below replaces
 * it; the ring is leaf-dark, the one focus colour legible on every surface
 * this site uses.
 */
const inputBase =
  "w-full min-h-[48px] rounded-xl border-hair bg-cream-deep px-4 py-3 text-cocoa " +
  "shadow-[inset_0_1px_2px_rgba(62,42,33,0.06)] " +
  "placeholder:text-cocoa-mid/60 " +
  "transition-[background-color,border-color,box-shadow] duration-200 " +
  "focus:bg-cream focus:outline-none " +
  "focus:shadow-[inset_0_1px_2px_rgba(62,42,33,0.04),0_0_0_3px_rgba(78,122,40,0.18)]";

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-cocoa">
      {children}
      {optional ? (
        <span className="ml-1.5 font-normal text-cocoa-mid">(optional)</span>
      ) : null}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm text-pink-dark">
      {/* An icon as well as colour, so the error is never signalled by colour alone. */}
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function TourRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const reduce = useReducedMotion();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { contactPreference: "phone", schedule: "full-time", careType: "" },
  });

  const onSubmit = async (data: FormValues) => {
    // Honeypot: silently accept and discard.
    if (data.website) {
      setSubmitted(true);
      return;
    }
    // Demo build. Nothing is transmitted. See README for wiring this to a real
    // endpoint at launch.
    await new Promise((r) => setTimeout(r, 700));
    setSubmitted(true);
  };

  const errClass = (name: keyof FormValues) =>
    errors[name] ? "border-pink-dark" : "border-cocoa/15 focus:border-leaf";

  return (
    <div className="rounded-2xl border-hair border-cocoa/10 bg-cream p-6 shadow-soft sm:p-8">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="done"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="py-6 text-center"
            role="status"
            aria-live="polite"
          >
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-light">
              <AlertCircle
                className="h-8 w-8 text-amber-dark"
                aria-hidden="true"
                strokeWidth={2.5}
              />
            </span>
            <h3 className="mt-5 text-h3">Nothing was sent.</h3>
            <p className="mx-auto mt-3 max-w-[38ch] text-cocoa-mid">
              This online form is still a preview. To request a tour, call or text{" "}
              <a className="font-semibold underline" href={BUSINESS.phoneHref}>
                {BUSINESS.phone}
              </a>{" "}
              or email{" "}
              <a className="font-semibold underline" href={BUSINESS.emailHref}>
                {BUSINESS.email}
              </a>
              .
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            initial={false}
            className="space-y-5"
          >
            <div
              role="note"
              className="rounded-xl border border-amber-dark/20 bg-amber-light/55 p-4 text-center text-sm text-cocoa"
            >
              <strong className="font-bold">Online requests are not live yet.</strong>{" "}
              This preview form does not send or store entries. Please call, text, or email
              instead.
            </div>

            <p className="text-center text-base text-cocoa-mid">
              <span className="block [text-wrap:balance]">
                Not ready to schedule a tour?
              </span>{" "}
              <span className="mt-1 block [text-wrap:balance]">
                <Link
                  href="/availability"
                  className="whitespace-nowrap font-semibold text-cocoa underline decoration-pink/45 underline-offset-4 transition-colors hover:text-pink-dark"
                >
                  Check current availability
                </Link>{" "}
                for your child&apos;s age and schedule.
              </span>
            </p>
            <p className="text-center text-base text-cocoa-mid">
              <span className="block [text-wrap:balance]">
                These fields preview the details needed to arrange a tour.
              </span>{" "}
              <span className="mt-1 block [text-wrap:balance]">
                To receive a response now, call, text, or email me instead.
              </span>
            </p>

            {/* Honeypot, hidden from people and from screen readers. */}
            <div aria-hidden="true" className="absolute left-[-9999px]">
              <label htmlFor="website">Do not fill this in</label>
              <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="parentName">Your name</Label>
                <input
                  id="parentName"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  aria-invalid={!!errors.parentName}
                  aria-describedby={errors.parentName ? "err-parentName" : undefined}
                  className={cn(inputBase, errClass("parentName"))}
                  {...register("parentName", {
                    required: "Please tell me your name.",
                    maxLength: { value: 100, message: "Please use 100 characters or fewer." },
                  })}
                />
                <FieldError id="err-parentName" message={errors.parentName?.message} />
              </div>

              <div>
                <Label htmlFor="childAge">Child&apos;s age</Label>
                <input
                  id="childAge"
                  type="text"
                  placeholder="14 months, or 3 years"
                  maxLength={40}
                  aria-invalid={!!errors.childAge}
                  aria-describedby={errors.childAge ? "err-childAge" : undefined}
                  className={cn(inputBase, errClass("childAge"))}
                  {...register("childAge", {
                    required: "Please add your child's age.",
                    maxLength: { value: 40, message: "Please use 40 characters or fewer." },
                  })}
                />
                <FieldError id="err-childAge" message={errors.childAge?.message} />
              </div>

              <div>
                <Label htmlFor="careType">Care needed</Label>
                <select
                  id="careType"
                  aria-invalid={!!errors.careType}
                  aria-describedby={errors.careType ? "err-careType" : undefined}
                  className={cn(inputBase, errClass("careType"))}
                  {...register("careType", { required: "Please choose a care type." })}
                >
                  <option value="">Choose one</option>
                  {PROGRAMS.map((p) => (
                    <option key={p.slug} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                  <option value="Not sure">Not sure yet</option>
                </select>
                <FieldError id="err-careType" message={errors.careType?.message} />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={30}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "err-phone" : undefined}
                  className={cn(inputBase, errClass("phone"))}
                  {...register("phone", {
                    required: "A phone number helps me reach you quickly.",
                    maxLength: { value: 30, message: "Please use 30 characters or fewer." },
                  })}
                />
                <FieldError id="err-phone" message={errors.phone?.message} />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-email" : undefined}
                  className={cn(inputBase, errClass("email"))}
                  {...register("email", {
                    required: "Please add an email address.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "That email address does not look right.",
                    },
                    maxLength: { value: 254, message: "Please use 254 characters or fewer." },
                  })}
                />
                <FieldError id="err-email" message={errors.email?.message} />
              </div>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-cocoa">
                Best way to reach you
              </legend>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["phone", "Call me"],
                    ["text", "Text me"],
                    ["email", "Email me"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className={cn(
                      "min-h-[44px] cursor-pointer select-none rounded-full border-hair",
                      "border-cocoa/15 bg-gradient-to-b from-white to-cream-deep px-4",
                      "inline-flex items-center text-sm font-semibold text-cocoa",
                      "shadow-[0_1px_0_0_rgba(62,42,33,0.08)]",
                      "transition-all duration-200",
                      "has-[:checked]:border-pink has-[:checked]:from-pink-light",
                      "has-[:checked]:to-pink-light has-[:checked]:text-pink-dark",
                      "has-[:checked]:shadow-[inset_0_1px_2px_rgba(194,43,75,0.15)]",
                      // The radio itself is sr-only, so the ring has to live on
                      // the label or keyboard users get no focus indicator.
                      "has-[:focus-visible]:outline has-[:focus-visible]:outline-2",
                      "has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-leaf-dark",
                    )}
                  >
                    <input
                      type="radio"
                      value={value}
                      className="sr-only"
                      {...register("contactPreference")}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="schedule">Care schedule needed</Label>
                <select
                  id="schedule"
                  className={cn(inputBase, "border-cocoa/15 focus:border-leaf")}
                  {...register("schedule")}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>

              <div>
                <Label htmlFor="startDate" optional>
                  Ideal start date
                </Label>
                <input
                  id="startDate"
                  type="text"
                  placeholder="September, or as soon as possible"
                  maxLength={80}
                  className={cn(inputBase, "border-cocoa/15 focus:border-leaf")}
                  {...register("startDate")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tourTimes" optional>
                Days or times that work for a tour
              </Label>
              <input
                id="tourTimes"
                type="text"
                placeholder="Share a few days and times that work for you"
                maxLength={200}
                className={cn(inputBase, "border-cocoa/15 focus:border-leaf")}
                {...register("tourTimes")}
              />
            </div>

            <div>
              <Label htmlFor="message" optional>
                Anything you want me to know
              </Label>
              <textarea
                id="message"
                rows={4}
                maxLength={2000}
                className={cn(inputBase, "resize-none border-cocoa/15 focus:border-leaf")}
                {...register("message")}
              />
            </div>

            <div className="pt-1">
              <Button type="submit" size="lg" disabled={isSubmitting} block>
                {isSubmitting ? "Reviewing…" : "Preview Request"}
              </Button>
              <p className="mt-3 text-center text-sm text-cocoa-mid">
                This preview form does not send or store your information.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
