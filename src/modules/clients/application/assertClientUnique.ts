import ClientModel from '../infrastructure/ClientModel';
import { ClientDuplicateDocumentError } from '../domain/errors/ClientErrors';
import type { CreateClientInput } from '../schemas/client.schema';

export type ClientDocumentKey = Pick<
	CreateClientInput,
	'documentType' | 'documentNumber' | 'country'
>;

/**
 * Pre-check for the client document uniqueness key. UX-only: the partial unique
 * index on (documentType, documentNumber, country) is the real source of truth.
 * Skipped when there is no document number (those clients are not de-duplicated).
 */
export async function assertClientUnique(
	fields: ClientDocumentKey,
	excludeId?: string,
): Promise<void> {
	if (!fields.documentNumber) return;

	const query: Record<string, unknown> = {
		documentType: fields.documentType ?? null,
		documentNumber: fields.documentNumber,
		country: fields.country,
		deletedAt: null,
	};
	if (excludeId) query.id = { $ne: excludeId };

	const existing = await ClientModel.findOne(query).lean();
	if (existing) throw new ClientDuplicateDocumentError();
}
