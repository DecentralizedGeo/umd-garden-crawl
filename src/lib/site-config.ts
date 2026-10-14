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
    { name: 'Decentralized Geospatial Collaborative', logo: '/logos/decentralized-geo.png', url: 'https://decentralizedgeo.org/' },
    { name: 'EASIER Data Initiative', logo: '/logos/easier-data.png', url: 'https://easierdata.org/' },
    { name: 'UMD Department of Geographical Sciences', logo: '/logos/UMD_Geog.png', url: 'https://geog.umd.edu/' },
    { name: 'Astral', logo: '/logos/astral.svg', url: 'https://www.astral.global/' },
    { name: 'Filecoin Foundation for the Decentralized Web', logo: '/logos/FFDW.png', url: 'https://ffdweb.org/' },
    { name: 'Guardian Project', logo: '/logos/guardian-project.svg', url: 'https://guardianproject.info/' },
    { name: 'Open Geospatial Consortium', logo: '/logos/OGC.png', url: 'https://www.ogc.org/' },
    { name: 'Climate Collective', logo: '/logos/climate-collective.gif', url: 'https://climatecollective.org/' },
    {
      name: 'International Center for Innovation in Geospatial Analytics & Earth Observation',
      logo: '/logos/intgeocenter.png',
      url: 'https://intgeocenter.org/',
    },
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
