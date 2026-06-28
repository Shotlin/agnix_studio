import type { Metadata } from "next";
import { Cinzel, Raleway } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.agnixstudio.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Agnix Studio",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/agnix-logo-transparent.png`,
      },
      description:
        "Agnix Studio is an independent Indian creative production studio developing original games, cinematic stories, animation, comics and connected fictional universes.",
      sameAs: ["https://www.instagram.com/agnixstudio_official"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Agnix Studio",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "VideoGame",
      "@id": `${SITE_URL}/antar-the-last-flame/#game`,
      name: "ANTAR — The Last Flame",
      url: `${SITE_URL}/antar-the-last-flame/`,
      description:
        "A cinematic mythological action-platformer about memory, courage, compassion and sacred fire.",
      genre: ["Action", "Platformer", "Mythological Fantasy", "Narrative Adventure"],
      gamePlatform: ["PC"],
      productionCompany: { "@id": `${SITE_URL}/#organization` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      image: `${SITE_URL}/images/antar-social-cover.jpg`,
      inLanguage: "en",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ANTAR — The Last Flame | Indian Mythology Game by Agnix Studio",
    template: "%s | Agnix Studio",
  },
  description:
    "Discover ANTAR — The Last Flame, a cinematic Indian mythological action-platformer about memory, courage and sacred fire, created by Agnix Studio.",
  keywords: [
    "ANTAR The Last Flame",
    "Agnix Studio",
    "Indian mythology game",
    "Indian mythological game",
    "mythological action-platformer",
    "Indian indie game",
    "story-driven mythology game",
    "cinematic action-platformer",
    "Indian fantasy game",
    "upcoming Indian game",
    "Indian game studio",
    "independent game studio India",
  ],
  authors: [{ name: "Agnix Studio", url: SITE_URL }],
  creator: "Agnix Studio",
  publisher: "Agnix Studio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Agnix Studio",
    title: "ANTAR — The Last Flame | Coming Soon",
    description:
      "A cinematic mythological action-platformer forged from memory, courage and sacred fire.",
    url: SITE_URL,
    images: [
      {
        url: "/images/antar-social-cover.jpg",
        width: 1200,
        height: 630,
        alt: "ANTAR — The Last Flame official key art",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANTAR — The Last Flame | Coming Soon",
    description: "A cinematic mythological action-platformer by Agnix Studio.",
    images: ["/images/antar-social-cover.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${raleway.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
