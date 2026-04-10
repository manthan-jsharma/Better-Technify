import catalog from "./projects-blur.json";

export type WorkDiscipline =
  | "Product Design"
  | "Branding"
  | "Development"
  | "Animation"
  | "Web Design"
  | string;

export type Project = {
  id: string;
  title: string;
  image: string | null;
  aspectRatio: string | null;
  description?: string;
  blurDataURL: string | null;
  placeholderBackground: string | null;
  disciplines: WorkDiscipline[];
  categories: WorkDiscipline[];
  liveUrl?: string;
};

type CatalogEntry = {
  id: string;
  title: string;
  image?: string | null;
  aspectRatio?: string | null;
  description?: string;
  blurDataURL?: string | null;
  placeholderBackground?: string | null;
  disciplines?: WorkDiscipline[];
  categories?: WorkDiscipline[];
  liveUrl?: string;
};

function toProject(entry: CatalogEntry): Project {
  const baseDisciplines = entry.disciplines ?? entry.categories ?? [];
  const uniqueDisciplines = Array.from(new Set(baseDisciplines));
  const categories =
    entry.categories && entry.categories.length > 0
      ? Array.from(new Set(entry.categories))
      : uniqueDisciplines;

  return {
    id: entry.id,
    title: entry.title,
    image: entry.image ?? null,
    aspectRatio: entry.aspectRatio ?? null,
    description: entry.description,
    blurDataURL: entry.blurDataURL ?? null,
    placeholderBackground: entry.placeholderBackground ?? null,
    disciplines: uniqueDisciplines,
    categories,
    liveUrl: entry.liveUrl,
  };
}

export const projects: Project[] = (catalog as CatalogEntry[]).map(toProject);
