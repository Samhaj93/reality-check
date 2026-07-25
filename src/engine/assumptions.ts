// Single source of truth for every regulatory / market constant.
// Rule 4 (CLAUDE.md): never inline a rate, fee, or percentage anywhere else.
//
// Provenance note: DLD fee and oqood/trustee fees are registry-grade (published
// DLD schedule). Management, vacancy, maintenance are our estimates and are
// surfaced to the user as such in the assumptions footer.
export const ASSUMPTIONS = {
  dldFeePct: 0.04, // DLD transfer fee, payable at booking
  fixedFeesAed: 1630, // oqood registration + trustee admin
  mgmtFeePct: 0.05, // letting management
  vacancyPct: 0.08, // ~1 month per year
  maintAed: 3000, // maintenance + insurance, annual
  agentCommPct: 0, // direct-from-developer purchase
} as const
