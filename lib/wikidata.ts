const USER_AGENT = "SamuraiBlueFanHub/1.0 (https://github.com/youzaixushan-cpu/blue; fan site, non-commercial)";
const BIRTH_DATE_PROPERTY = "P569";
const MEMBER_OF_SPORTS_TEAM_PROPERTY = "P54";
const START_TIME_QUALIFIER = "P580";
const END_TIME_QUALIFIER = "P582";
// P54（所属チーム）にはクラブだけでなく代表チームも含まれるため、日本代表は「クラブ」候補から除外する
// （このサイトの選手は全員日本人のため、代表チームのQIDはこれ一つだけで十分）
const JAPAN_NATIONAL_TEAM_QID = "Q170566";

async function wikidataFetch(url: string): Promise<unknown> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Wikidata request failed: ${res.status} ${url}`);
  return res.json();
}

export interface WikidataSearchResult {
  id: string;
  label: string;
  description?: string;
}

export async function searchWikidataPerson(name: string): Promise<WikidataSearchResult[]> {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=ja&format=json&type=item&limit=5`;
  const data = (await wikidataFetch(url)) as {
    search?: { id: string; display?: { label?: { value: string } }; description?: string }[];
  };
  return (data.search ?? []).map((entry) => ({
    id: entry.id,
    label: entry.display?.label?.value ?? entry.id,
    description: entry.description,
  }));
}

interface WikibaseTimeValue {
  time: string; // e.g. "+2001-06-04T00:00:00Z"
}

interface WikibaseEntityIdValue {
  id: string;
}

interface Snak {
  datavalue?: { value: WikibaseTimeValue | WikibaseEntityIdValue };
}

interface Claim {
  mainsnak?: Snak;
  qualifiers?: Record<string, Snak[]>;
}

interface EntityData {
  entities: Record<string, { claims: Record<string, Claim[]> }>;
}

function parseWikidataDate(time: string): Date | null {
  // Wikidataは精度が「年のみ」等の場合、月日が "00" になる（例: "+2019-00-00T00:00:00Z"）。
  // そのままDateに渡すとInvalid Dateになるため、欠けている部分は01で補う。
  const match = time.replace(/^\+/, "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  const safeMonth = month === "00" ? "01" : month;
  const safeDay = day === "00" ? "01" : day;
  const parsed = new Date(`${year}-${safeMonth}-${safeDay}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export interface PlayerFacts {
  birthDate: Date | null;
  currentClubQid: string | null;
}

export async function fetchPlayerFacts(qid: string): Promise<PlayerFacts> {
  const data = (await wikidataFetch(
    `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`,
  )) as EntityData;
  const claims = data.entities[qid]?.claims ?? {};

  const birthClaim = claims[BIRTH_DATE_PROPERTY]?.[0]?.mainsnak?.datavalue?.value as
    | WikibaseTimeValue
    | undefined;
  const birthDate = birthClaim ? parseWikidataDate(birthClaim.time) : null;

  const teamClaims = claims[MEMBER_OF_SPORTS_TEAM_PROPERTY] ?? [];
  let currentClubQid: string | null = null;
  let latestStart: Date | null = null;
  for (const claim of teamClaims) {
    const teamId = (claim.mainsnak?.datavalue?.value as WikibaseEntityIdValue | undefined)?.id;
    if (!teamId || teamId === JAPAN_NATIONAL_TEAM_QID) continue;

    const hasEnded = Boolean(claim.qualifiers?.[END_TIME_QUALIFIER]?.[0]);
    if (hasEnded) continue;

    const startValue = claim.qualifiers?.[START_TIME_QUALIFIER]?.[0]?.datavalue?.value as
      | WikibaseTimeValue
      | undefined;
    const start = startValue ? parseWikidataDate(startValue.time) : null;

    // 開始日不明のエントリー同士では上書きしない（両方nullの場合に後勝ちで誤って
    // 選ばれるのを防ぐ）。開始日がある候補は、より新しい開始日のものを優先する。
    if (currentClubQid === null || (start && (!latestStart || start > latestStart))) {
      latestStart = start;
      currentClubQid = teamId;
    }
  }

  return { birthDate, currentClubQid };
}

export async function resolveEntityLabel(qid: string): Promise<string | null> {
  const data = (await wikidataFetch(
    `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=labels&languages=ja|en&format=json`,
  )) as { entities?: Record<string, { labels?: Record<string, { value: string }> }> };
  const labels = data.entities?.[qid]?.labels;
  return labels?.ja?.value ?? labels?.en?.value ?? null;
}
