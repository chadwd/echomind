# ACV MAX Auctions: Consignment Optimizer

**Author:** Product Management — ACV MAX Dealer Tools
**Status:** Draft for stakeholder review
**Last updated:** 2026-05-05

---

## Problem Statement

Dealer GMs today decide which units to send to auction versus retail using a combination of gut feel, aging reports pulled from their DMS, and informal conversation with their sales manager. This process is manual, inconsistent, and typically happens too late — units sit on the lot 30–45 days before a disposition decision is made. ACV MAX captures rich market data, lane velocity signals, and historical sell-through rates that could inform this decision, but nothing surfaces that intelligence at the moment the GM is making the call. The result: dealers are leaving money on the floor by retailing units that would clear better at auction, and running aging inventory through the lanes that tanks their sell-through metrics. A smarter consignment recommendation, baked into the daily workflow, would tighten lot turn and reduce holding cost without requiring the GM to change their existing routine.

## Target User

The primary user is the **dealer General Manager** at a franchise or independent rooftop running ACV MAX as their inventory management platform. This is someone who manages both retail and wholesale performance simultaneously — they're accountable to the OEM for retail CSI scores and to the dealer principal for wholesale margin. They start every morning reviewing aged inventory and end every day measuring turn. They are time-constrained, skeptical of new software, and will adopt a tool only if it saves clicks, not adds them. Secondary users are used-car directors at multi-rooftop buying groups who need to coordinate consignment decisions across stores.

## Proposed Solution

The Consignment Optimizer is a new module within ACV MAX Inventory that surfaces a **disposition score** (1–10) for each unit on the lot. The score is computed from days-on-lot, regional market velocity, ACV auction lane demand signals, and the unit's book-to-trade spread. A score of 7 or above triggers an "Auction Ready" badge in the inventory list. GMs can view the badge on the inventory list and click into each unit's detail card to see the full disposition score, the inputs that drove it, and a one-click option to schedule the unit for consignment to their nearest ACV auction.

The optimizer runs nightly and refreshes scores each morning so the GM sees updated recommendations when they start their day.

## Proposed Flow

1. GM opens ACV MAX Inventory on desktop or mobile.
2. Inventory list renders with an "Auction Ready" badge on units whose disposition score is 7 or above.
3. GM scans the list, sees which units are badged, and decides which to investigate further.
4. GM taps or clicks on a specific unit to open its detail card.
5. Detail card shows the disposition score (e.g., "8/10 — Auction Ready"), the contributing factors (days-on-lot: 42, regional demand index: high, book-to-trade spread: -$1,200), and a "Schedule for Consignment" button.
6. GM clicks "Schedule for Consignment," selects the next available ACV auction event, and confirms.
7. Unit is flagged in the inventory system as consigned-pending and removed from the retail pricing queue.

## Success Metrics

- **Reduce time-to-disposition** for units that pass through the optimizer workflow.
- Increase the percentage of consigned units that sell at auction on first entry (sell-through rate).
- Reduce average days-on-lot across the dealer's inventory by 10% within 90 days of adoption.

## Open Questions

1. **Threshold calibration:** Is 7/10 the right cutoff for the "Auction Ready" badge, or should the threshold be configurable per rooftop based on the dealer's risk tolerance and retail margin targets?
2. **Wholesale vs. auction channel:** Some dealers prefer to wholesale units to other dealers directly rather than running them through the lane. Does the disposition score differentiate between "sell at auction" and "wholesale to dealer network," or is it a single recommendation?
3. **DMS write-back:** When a GM schedules a unit for consignment, should the status change write back to their DMS (CDK, Reynolds) automatically, or is this a manual step the used-car manager handles on their side?
