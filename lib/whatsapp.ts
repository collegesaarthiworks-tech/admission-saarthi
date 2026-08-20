export const counsellors = {
  "Lucknow / Bangalore": { name: "Shivank Yadav", phone: "919305345701" },
  "Uttarakhand / Dehradun": { name: "Akash Dhiman", phone: "919193706392" },
  Unnao: { name: "Abhay", phone: "919608964877" },
} as const;

export function whatsappUrl(region: keyof typeof counsellors, intent: string, source: string) {
  const owner = counsellors[region];
  const message = `${intent}\n\nSource: ${source}\nRegion: ${region}`;
  return `https://wa.me/${owner.phone}?text=${encodeURIComponent(message)}`;
}
