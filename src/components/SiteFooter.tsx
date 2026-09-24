import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { brand, categories } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-secondary/40">
      <div className="section-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
              <Sparkles width={18} height={18} />
            </span>
            <span className="font-display text-lg font-semibold">{brand.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">{brand.tagline}</p>
        </div>

        <nav aria-label="Explore">
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/courses" className="hover:text-foreground">
                All courses
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                About us
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-foreground">
                Student dashboard
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Categories">
          <h2 className="text-sm font-semibold">Categories</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c}>
                <Link to="/courses" search={{ category: c }} className="hover:text-foreground">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Mail width={15} height={15} className="mt-0.5 shrink-0" />
              <a href={`mailto:${brand.email}`} className="hover:text-foreground">
                {brand.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone width={15} height={15} className="mt-0.5 shrink-0" />
              <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                {brand.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin width={15} height={15} className="mt-0.5 shrink-0" />
              <span>{brand.address}</span>
            </li>
          </ul>
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <a href={brand.socials.instagram} className="hover:text-foreground">
              Instagram
            </a>
            <a href={brand.socials.youtube} className="hover:text-foreground">
              YouTube
            </a>
            <a href={brand.socials.linkedin} className="hover:text-foreground">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="section-x flex flex-col gap-2 border-t py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {brand.name}. Demo template — all content is sample content.
        </p>
        <p>Built for coaches, teachers and practitioners.</p>
      </div>
    </footer>
  );
}
