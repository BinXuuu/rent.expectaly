import type { City, Result } from "@/types";
import { ok } from "@/types";
import { mockCities } from "@/data/mock";
import { createInMemoryRepository } from "./base";

export const cityRepository = {
  ...createInMemoryRepository<City>(() => mockCities),

  async findBySlug(slug: string): Promise<Result<City | null>> {
    return ok(mockCities.find((c) => c.slug === slug && !c.deletedAt) ?? null);
  },
};
