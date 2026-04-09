import { navigation } from "@/constants";
import Link from "next/link";
import { JSX } from "react";
import { IconType } from "react-icons";

type BaseLink = {
  href: string;
};

type TextLink = BaseLink & {
  title: string;
};

type JSXLink = BaseLink & {
  title: JSX.Element;
};

type IconLink = BaseLink & {
  title: string;
  icon: IconType;
};

type LinkItem = TextLink | JSXLink | IconLink;

type NavigationItem = {
  title: string;
  links: LinkItem[];
};

const FooterNavigation = () => {
  return (
    <nav>
      <ul role="list" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        {(navigation as NavigationItem[]).map((item) => (
          <li key={item.title}>
            <div className="font-display text-sm font-semibold tracking-wider text-neutral-950">
              {item.title}
            </div>
            <ul role="list" className="mt-4 text-sm text-neutral-700">
              {item.links.map((link) => (
                <li key={link.href} className="mt-4">
                  {("icon" in link && link.icon) ? (
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 transition hover:text-neutral-950"
                    >
                      <link.icon />
                      {link.title}
                    </Link>
                  ) : (
                    <Link
                      href={link.href}
                      className="transition hover:text-neutral-950"
                    >
                      {link.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FooterNavigation;
