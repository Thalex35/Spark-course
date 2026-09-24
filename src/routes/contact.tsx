import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brand } from "@/lib/data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Book a Session — Serenity Studio" },
      {
        name: "description",
        content: "Ask a question about a course or book a one-to-one coaching session with our team.",
      },
      { property: "og:title", content: "Contact Serenity Studio" },
      { property: "og:description", content: "Questions about a course, or ready to book one-to-one?" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="section-x py-14">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Let's talk</h1>
        <p className="mt-4 text-muted-foreground">
          Questions about a course, or ready to book a one-to-one session? Send a note and we reply within
          one working day.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form
          className="space-y-4 rounded-2xl border bg-card p-6 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Thanks — your message is on its way (demo form).");
            e.currentTarget.reset();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ct-name">Your name</Label>
              <Input id="ct-name" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="ct-email">Email</Label>
              <Input id="ct-email" type="email" required className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="ct-topic">What's it about?</Label>
            <Select defaultValue="course">
              <SelectTrigger id="ct-topic" className="mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course">A course question</SelectItem>
                <SelectItem value="session">Booking a 1:1 session</SelectItem>
                <SelectItem value="corporate">Team or corporate programme</SelectItem>
                <SelectItem value="other">Something else</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ct-message">Message</Label>
            <Textarea id="ct-message" required className="mt-1.5 min-h-36" />
          </div>
          <Button type="submit" className="rounded-full">
            Send message
          </Button>
        </form>

        <aside className="space-y-4 rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Studio details</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <Mail width={16} height={16} className="mt-0.5 shrink-0 text-primary" />
              <a href={`mailto:${brand.email}`} className="hover:text-primary">
                {brand.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone width={16} height={16} className="mt-0.5 shrink-0 text-primary" />
              <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                {brand.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin width={16} height={16} className="mt-0.5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{brand.address}</span>
            </li>
          </ul>
          <p className="border-t pt-4 text-xs text-muted-foreground">
            These are sample contact details — swap them for your own in the demo content file.
          </p>
        </aside>
      </div>
    </div>
  );
}
