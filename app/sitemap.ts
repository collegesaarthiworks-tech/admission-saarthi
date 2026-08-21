import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/institutions", "/events", "/career", "/study-abroad"].map(path => ({ url: `https://admissionsaarthi.com${path}`, lastModified: new Date() })); }
