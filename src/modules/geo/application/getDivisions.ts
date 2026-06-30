import { DIVISIONS_BY_COUNTRY, type DivisionNode } from '../data';

export interface DivisionItem {
	code: string;
	name: string;
	hasChildren: boolean;
}

export interface DivisionsResult {
	levels: string[];
	items: DivisionItem[];
}

function findNode(
	nodes: DivisionNode[],
	code: string,
): DivisionNode | undefined {
	for (const node of nodes) {
		if (node.code === code) return node;
		if (node.children) {
			const found = findNode(node.children, code);
			if (found) return found;
		}
	}
	return undefined;
}

/**
 * Returns the children of `parentCode` (or the top-level divisions when it is
 * omitted) for a country, as a flat list ready for a cascading select.
 */
export function getDivisions(
	country: string,
	parentCode?: string,
): DivisionsResult {
	const tree = DIVISIONS_BY_COUNTRY[country.toUpperCase()];
	if (!tree) return { levels: [], items: [] };

	const nodes = parentCode
		? (findNode(tree.divisions, parentCode)?.children ?? [])
		: tree.divisions;

	const items: DivisionItem[] = nodes.map((node) => ({
		code: node.code,
		name: node.name,
		hasChildren: !!node.children?.length,
	}));

	return { levels: tree.levels, items };
}
