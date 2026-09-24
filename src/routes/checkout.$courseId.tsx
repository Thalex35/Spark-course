import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Loader2, Lock, ShieldCheck, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseLessons, getCourse, getInstructor } from "@/lib/data";
import { formatPrice, useApp } from "@/lib/store";

export const Route = createFileRoute("/checkout/$courseId")({
  loader: ({ params }) => {
    const course = getCourse(params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `Checkout: ${loaderData.course.title} — Serenity Studio` : "Checkout" },
      { name: "description", content: "Complete your enrollment with a secure checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const PROMO = { code: "CALM20", percent: 20 };

function Checkout() {
  const { course } = Route.useLoaderData();
  const navigate = useNavigate();
  const { enroll, user, isEnrolled } = useApp();
  const [promoInput, setPromoInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);

  const total = Math.max(0, Math.round(course.price * (1 - discount / 100) * 100) / 100);

  function applyPromo() {
    if (promoInput.trim().toUpperCase() === PROMO.code) {
      setDiscount(PROMO.percent);
      toast.success(`${PROMO.code} applied — ${PROMO.percent}% off`);
    } else {
      toast.error("That promo code isn't valid. Try CALM20.");
    }
  }

  function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      navigate({ to: "/auth", search: { mode: "signup", redirect: `/checkout/${course.id}` } });
      return;
    }
    setProcessing(true);
    // Mock payment: swap this timeout for your real payment provider.
    setTimeout(() => {
      enroll(course.id);
      setProcessing(false);
      toast.success("Payment successful — you're enrolled!");
      navigate({ to: "/learn/$courseId", params: { courseId: course.id } });
    }, 1400);
  }

  return (
    <div className="section-x py-12">
      <h1 className="font-display text-4xl font-semibold">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Demo checkout — no card is charged and no data leaves this page.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <form onSubmit={pay} className="space-y-6">
          <section className="rounded-2xl border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Your details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="co-name">Full name</Label>
                <Input id="co-name" required defaultValue={user?.name ?? ""} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="co-email">Email</Label>
                <Input id="co-email" type="email" required defaultValue={user?.email ?? ""} className="mt-1.5" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <CreditCard width={18} height={18} className="text-primary" /> Payment method
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Card details are collected but never sent.</p>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="co-card">Card number</Label>
                <Input id="co-card" inputMode="numeric" placeholder="4242 4242 4242 4242" className="mt-1.5" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="co-exp">Expiry</Label>
                  <Input id="co-exp" placeholder="MM / YY" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="co-cvc">CVC</Label>
                  <Input id="co-cvc" placeholder="123" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="co-country">Country</Label>
                  <Select defaultValue="us">
                    <SelectTrigger id="co-country" className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="gb">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          <Button type="submit" size="lg" className="w-full rounded-full" disabled={processing}>
            {processing ? <Loader2 className="animate-spin" /> : <Lock />}
            {processing ? "Processing payment…" : `Complete purchase · ${formatPrice(total)}`}
          </Button>

          <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <li className="inline-flex items-center gap-1.5">
              <Lock width={13} height={13} /> SSL encrypted
            </li>
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck width={13} height={13} /> 30-day refund guarantee
            </li>
            <li className="inline-flex items-center gap-1.5">
              <CreditCard width={13} height={13} /> Secure card processing
            </li>
          </ul>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
            <img
              src={course.image}
              alt={`${course.title} course cover`}
              width={1200}
              height={800}
              loading="lazy"
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="space-y-4 p-6">
              <div>
                <h2 className="text-base font-semibold">{course.title}</h2>
                <p className="text-sm text-muted-foreground">{getInstructor(course.instructorId)?.name}</p>
              </div>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>{course.modules.length} modules · {courseLessons(course).length} lessons</li>
                <li>Lifetime access on every device</li>
                <li>Certificate on completion</li>
              </ul>

              <div className="border-t pt-4">
                <Label htmlFor="promo" className="text-xs">
                  Promo code
                </Label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    id="promo"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="CALM20"
                  />
                  <Button type="button" variant="outline" onClick={applyPromo}>
                    <Tag /> Apply
                  </Button>
                </div>
              </div>

              <dl className="space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Course price</dt>
                  <dd>{formatPrice(course.price)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <dt>Discount ({discount}%)</dt>
                    <dd>−{formatPrice(Math.round(course.price * discount) / 100)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>

              {isEnrolled(course.id) && (
                <p className="text-xs text-success">
                  You're already enrolled —{" "}
                  <Link to="/learn/$courseId" params={{ courseId: course.id }} className="underline">
                    jump back in
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
