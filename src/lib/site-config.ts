export const siteConfig = {
  eventTitle: 'UMD Garden Crawl',
  eventDates: 'October 9th - November 8th, 2026',
  // Compact form for chrome that has no room for the long sentence form:
  // the announcement strip and the footer.
  eventDatesShort: 'Oct. 9 - Nov. 8, 2026',
  audienceLine: 'Open to the UMD Campus Community',
  supportEmail: null as string | null,
  proofMode: { version: '{{not yet validated}}', verifiedOn: '{{pending walkthrough}}' },
  partners: [
    'Open Geospatial Consortium',
    'UMD Department of Geographical Sciences',
    'Astral',
    'Filecoin Foundation for the Decentralized Web',
    'Climate Collective',
    'International Center for Innovation in Geospatial Analytics & Earth Observation',
  ],
  gardenReferenceMapUrl:
    'https://uofmd.maps.arcgis.com/apps/instant/countdown/index.html?appid=8b4f00fdc9b04782a4738c473fcbb3a3',
};

export function resolveSubmissionsMapUrl(): { url: string | null; available: boolean } {
  const raw = import.meta.env.PUBLIC_SUBMISSIONS_MAP_URL ?? process.env.PUBLIC_SUBMISSIONS_MAP_URL;
  if (!raw) {
    return { url: null, available: false };
  }
  return { url: raw, available: true };
}

export function resolveGardenReferenceMapUrl(): { url: string | null; available: boolean } {
  const raw = import.meta.env.PUBLIC_GARDEN_REFERENCE_MAP_URL ?? process.env.PUBLIC_GARDEN_REFERENCE_MAP_URL;
  const url = raw || siteConfig.gardenReferenceMapUrl;
  if (!url) {
    return { url: null, available: false };
  }
  return { url, available: true };
}
