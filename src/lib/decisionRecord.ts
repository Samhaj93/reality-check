// Renders a DecisionRecord as plain text for the clipboard (RC-13).
// Presentation, not engine: this is where the record gets its words and its
// number formatting. Mirrors lib/summary.ts.
import type { DecisionRecord, DriverMetric, Position } from '../engine/decision'
import { ASSUMPTIONS as A } from '../engine/assumptions'
import { agentQuestions } from '../engine/questions'
import { netYield, grossYield } from '../engine/calc'
import { aed, pct } from './format'

const POSITION_LABEL: Record<Position, string> = {
  proceed: 'Proceed',
  hold: 'Hold — questions first',
  walk: 'Walk away',
}

const METRIC_LABEL: Record<DriverMetric, string> = {
  netYield: 'net yield',
  rentCushion: 'rent cushion',
  cashBeforeFirstRent: 'cash before first rent',
  acquisitionCost: 'acquisition cost',
}

// Yields and cushions are rates; the other two are money.
const formatDriverValue = (metric: DriverMetric, value: number): string =>
  metric === 'netYield' || metric === 'rentCushion' ? pct(value) : aed(value)

export function buildDecisionRecord(record: DecisionRecord): string {
  const { position, driver, changeMind, ranked, target, takenAt } = record

  const lines: string[] = [
    'Reality Check — decision record',
    takenAt.toISOString(),
    '',
    `Position: ${POSITION_LABEL[position]}`,
    `Target net yield: ${pct(target)}`,
    '',
    'The one number that decided it',
    `  ${driver.propertyName} — ${METRIC_LABEL[driver.metric]}: ${formatDriverValue(driver.metric, driver.value)} [${driver.provenance}]`,
    '',
    'What would change my mind',
    `  ${changeMind}`,
    '',
  ]

  if (record.belowOwnTarget) {
    lines.push(
      `Note: this unit's net yield sits below the ${pct(target)} target set above.`,
      '',
    )
  }

  lines.push('Shortlist as checked, ranked')
  ranked.forEach(({ property: p, verdict }, i) => {
    lines.push(
      `  ${i + 1}. ${p.name} — ${p.area} — ${verdict}`,
      `     Net yield (our rent): ${pct(netYield(p, p.estRent))}   Brochure gross: ${pct(grossYield(p, p.claimRent))}`,
    )
  })
  lines.push('')

  // Only a Hold is waiting on answers, so only a Hold carries the questions.
  if (position === 'hold') {
    lines.push('Questions to put to the agent before this becomes a yes')
    for (const { property: p } of ranked) {
      lines.push(`  ${p.name}`)
      for (const q of agentQuestions(p)) lines.push(`    - ${q.question}`)
    }
    lines.push('')
  }

  lines.push(
    'Assumptions in force',
    `  DLD transfer fee ${pct(A.dldFeePct, 0)} · oqood + trustee ${aed(A.fixedFeesAed)} [registry]`,
    `  Letting management ${pct(A.mgmtFeePct, 0)} · vacancy ${pct(A.vacancyPct, 0)} · maintenance ${aed(A.maintAed)}/yr [estimate]`,
    `  Agent commission ${pct(A.agentCommPct, 0)} — direct-from-developer purchase`,
    '',
    'Prototype with mock data. Every figure is labelled by provenance and no',
    'resale-price forecast is made anywhere in this tool. Nothing here is',
    'investment advice.',
  )

  return lines.join('\n')
}
