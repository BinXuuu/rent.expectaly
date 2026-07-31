import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { cityRepository, listingRepository } from "@/lib/repositories";
import { filterPubliclyVisibleListings } from "@/lib/services/listing-lifecycle-service";

const STATIC_ROUTES = ["", "/listings", "/cities", "/about", "/faq"];

const LEGAL_SLUGS = [
  "user-agreement",
  "privacy-policy",
  "disclaimer",
  "content-guidelines",
  "report-handling-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listingsRes, citiesRes] = await Promise.all([
    listingRepository.findAll(),
    cityRepository.findAll(),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.6,
  }));

  const listings = filterPubliclyVisibleListings(listingsRes.ok ? listingsRes.data : []);
  const listingEntries: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${siteConfig.url}/listings/${l.id}`,
    lastModified: new Date(l.updatedAt),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const cities = (citiesRes.ok ? citiesRes.data : []).filter((c) => c.isVisible);
  const cityEntries: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${siteConfig.url}/cities/${c.slug}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const legalEntries: MetadataRoute.Sitemap = LEGAL_SLUGS.map((slug) => ({
    url: `${siteConfig.url}/legal/${slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.2,
  }));

  return [...staticEntries, ...listingEntries, ...cityEntries, ...legalEntries];
}
