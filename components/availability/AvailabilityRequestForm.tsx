"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BUSINESS, PROGRAMS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/ui/AnimatedSection";

interface FormValues {
  parentName: string;
  childAge: string;
  careType: string;
  schedule: "full-time" | "part-time" | "not-sure";
  daysNeeded: string;
  startDate: string;
  phone: string;
  email: string;
  contactPreference: "phone" | "text" | "email";
  message: string;
  /** Honeypot. Real people never fill this in. */
  website: string;
}

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
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function AvailabilityRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const reduce = useReducedMotion();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      careType: "",
      schedule: "full-time",
      contactPreference: "phone",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (data.website) {
      setSubmitted(true);
      return;
    }

    // Demo build. Nothing is transmitted. See README for wiring this to a
    // real endpoint before launch.
    await new Promise((resolve) => setTimeout(resolve, 700));
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
            className="py-8 text-center"
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
            <p className="mx-auto mt-3 max-w-[40ch] text-cocoa-mid">
              This online form is still a preview. To check availability, call or text{" "}
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
              These fields preview the details needed to check current openings. To
              receive a response now, call, text, or email me instead.
            </p>

            <div aria-hidden="true" className="absolute left-[-9999px]">
              <label htmlFor="availability-website">Do not fill this in</label>
              <input
                id="availability-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="availability-parent-name">Your name</Label>
                <input
                  id="availability-parent-name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  aria-invalid={!!errors.parentName}
                  aria-describedby={errors.parentName ? "availability-error-parent-name" : undefined}
                  className={cn(inputBase, errClass("parentName"))}
                  {...register("parentName", {
                    required: "Please tell me your name.",
                    maxLength: { value: 100, message: "Please use 100 characters or fewer." },
                  })}
                />
                <FieldError
                  id="availability-error-parent-name"
                  message={errors.parentName?.message}
                />
              </div>

              <div>
                <Label htmlFor="availability-child-age">
                  Child&apos;s age or date of birth
                </Label>
                <input
                  id="availability-child-age"
                  type="text"
                  placeholder="Birth to 5"
                  maxLength={40}
                  aria-invalid={!!errors.childAge}
                  aria-describedby={errors.childAge ? "availability-error-child-age" : undefined}
                  className={cn(inputBase, errClass("childAge"))}
                  {...register("childAge", {
                    required: "Please add your child's age or date of birth.",
                    maxLength: { value: 40, message: "Please use 40 characters or fewer." },
                  })}
                />
                <FieldError
                  id="availability-error-child-age"
                  message={errors.childAge?.message}
                />
              </div>

              <div>
                <Label htmlFor="availability-care-type">Care needed</Label>
                <select
                  id="availability-care-type"
                  aria-invalid={!!errors.careType}
                  aria-describedby={errors.careType ? "availability-error-care-type" : undefined}
                  className={cn(inputBase, errClass("careType"))}
                  {...register("careType", { required: "Please choose a care type." })}
                >
                  <option value="">Choose one</option>
                  {PROGRAMS.map((program) => (
                    <option key={program.slug} value={program.name}>
                      {program.name}
                    </option>
                  ))}
                  <option value="Not sure">Not sure yet</option>
                </select>
                <FieldError
                  id="availability-error-care-type"
                  message={errors.careType?.message}
                />
              </div>

              <div>
                <Label htmlFor="availability-schedule">Care schedule needed</Label>
                <select
                  id="availability-schedule"
                  className={cn(inputBase, "border-cocoa/15 focus:border-leaf")}
                  {...register("schedule")}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="not-sure">Not sure yet</option>
                </select>
              </div>

              <div>
                <Label htmlFor="availability-days-needed" optional>
                  Days needed
                </Label>
                <input
                  id="availability-days-needed"
                  type="text"
                  placeholder="Monday to Friday, or specific days"
                  maxLength={120}
                  className={cn(inputBase, "border-cocoa/15 focus:border-leaf")}
                  {...register("daysNeeded")}
                />
              </div>

              <div>
                <Label htmlFor="availability-start-date">When do you need care?</Label>
                <input
                  id="availability-start-date"
                  type="text"
                  placeholder="ASAP, or in the next few months"
                  maxLength={80}
                  aria-invalid={!!errors.startDate}
                  aria-describedby={errors.startDate ? "availability-error-start-date" : undefined}
                  className={cn(inputBase, errClass("startDate"))}
                  {...register("startDate", {
                    required: "Please share your preferred start date.",
                    maxLength: { value: 80, message: "Please use 80 characters or fewer." },
                  })}
                />
                <FieldError
                  id="availability-error-start-date"
                  message={errors.startDate?.message}
                />
              </div>

              <div>
                <Label htmlFor="availability-phone">Phone</Label>
                <input
                  id="availability-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={30}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "availability-error-phone" : undefined}
                  className={cn(inputBase, errClass("phone"))}
                  {...register("phone", {
                    required: "A phone number helps me reach you quickly.",
                    maxLength: { value: 30, message: "Please use 30 characters or fewer." },
                  })}
                />
                <FieldError id="availability-error-phone" message={errors.phone?.message} />
              </div>

              <div>
                <Label htmlFor="availability-email">Email</Label>
                <input
                  id="availability-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "availability-error-email" : undefined}
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
                <FieldError id="availability-error-email" message={errors.email?.message} />
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
                      "inline-flex min-h-[44px] cursor-pointer select-none items-center rounded-full border-hair",
                      "border-cocoa/15 bg-gradient-to-b from-white to-cream-deep px-4",
                      "text-sm font-semibold text-cocoa shadow-[0_1px_0_0_rgba(62,42,33,0.08)]",
                      "transition-all duration-200 has-[:checked]:border-pink",
                      "has-[:checked]:from-pink-light has-[:checked]:to-pink-light",
                      "has-[:checked]:text-pink-dark",
                      "has-[:checked]:shadow-[inset_0_1px_2px_rgba(194,43,75,0.15)]",
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

            <div>
              <Label htmlFor="availability-message" optional>
                Anything else I should know
              </Label>
              <textarea
                id="availability-message"
                rows={4}
                maxLength={2000}
                placeholder="Share schedule details, questions, or anything that would help me understand your needs."
                className={cn(inputBase, "resize-none border-cocoa/15 focus:border-leaf")}
                {...register("message")}
              />
            </div>

            <div className="pt-1">
              <Button type="submit" size="lg" disabled={isSubmitting} block>
                {isSubmitting ? "Reviewing…" : "Preview Request"}
                {!isSubmitting ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
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
