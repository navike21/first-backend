export const PORTFOLIO_STATUSES = [
	'draft',
	'published',
	'archived',
] as const;

export type PortfolioStatus = (typeof PORTFOLIO_STATUSES)[number];
export const PORTFOLIO_STATUSES_ARRAY: [PortfolioStatus, ...PortfolioStatus[]] =
	[...PORTFOLIO_STATUSES];
