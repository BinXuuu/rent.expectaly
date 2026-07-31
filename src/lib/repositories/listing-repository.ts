import type { Listing, ListingImage, ListingStatus, Result } from "@/types";
import { ok } from "@/types";
import { mockListingImages, mockListings } from "@/data/mock";
import { createInMemoryRepository } from "./base";

export const listingRepository = {
  ...createInMemoryRepository<Listing>(() => mockListings),

  async findByPublisher(publisherId: string): Promise<Result<Listing[]>> {
    return ok(mockListings.filter((l) => l.publisherId === publisherId && !l.deletedAt));
  },

  async findByStatus(status: ListingStatus): Promise<Result<Listing[]>> {
    return ok(mockListings.filter((l) => l.status === status && !l.deletedAt));
  },

  async findByCity(cityId: string): Promise<Result<Listing[]>> {
    return ok(mockListings.filter((l) => l.cityId === cityId && !l.deletedAt));
  },
};

export const listingImageRepository = {
  ...createInMemoryRepository<ListingImage>(() => mockListingImages),

  async findByListing(listingId: string): Promise<Result<ListingImage[]>> {
    return ok(
      mockListingImages
        .filter((i) => i.listingId === listingId && !i.deletedAt)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    );
  },
};
