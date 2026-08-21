import { promises as fs } from "node:fs";
import path from "node:path";

export type ProviderStatus = "Draft" | "In review" | "Published";
export type ProviderRecord = {
  id: string; type: string; name: string; email: string; phone: string; website: string;
  city: string; state: string; country: string; address: string; established: string;
  accreditation: string; mode: string; programs: string; eligibility: string;
  feeMin: string; feeMax: string; intake: string; description: string; facilities: string;
  mediaNames: string[]; ownerRole: string; status: ProviderStatus; updatedAt: string;
};
export type CaseStudyRecord = {
  id: string; clientName: string; clientType: string; title: string; challenge: string;
  solution: string; outcome: string; metrics: string[]; image: string;
  associatePartner: boolean; published: boolean;
};
type Catalog = { providers: ProviderRecord[]; caseStudies: CaseStudyRecord[] };

const filePath = path.join(process.cwd(), "data", "catalog.json");
let writeQueue = Promise.resolve();

export async function readCatalog(): Promise<Catalog> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as Catalog;
}

export async function writeCatalog(data: Catalog) {
  writeQueue = writeQueue.then(() => fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8"));
  await writeQueue;
}

export function publicCatalog(data: Catalog) {
  return {
    providers: data.providers.filter(item => item.status === "Published"),
    caseStudies: data.caseStudies.filter(item => item.published),
  };
}
