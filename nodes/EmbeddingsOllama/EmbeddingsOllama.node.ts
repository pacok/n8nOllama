/* eslint-disable n8n-nodes-base/node-dirname-against-convention */
import {
	NodeConnectionType,
	type IExecuteFunctions,
	type INodeType,
	type INodeTypeDescription,
	type SupplyData,
} from 'n8n-workflow';
import { OllamaEmbeddings } from '@langchain/ollama';
import { logWrapper } from '@n8n/n8n-nodes-langchain/dist/utils/logWrapper';
import { getConnectionHintNoticeField } from '@n8n/n8n-nodes-langchain/dist/utils/sharedFields';
import {
	ollamaDescription,
	ollamaModel,
	ollamaOptions,
} from '@n8n/n8n-nodes-langchain/dist/nodes/llms/LMOllama/description';

export class EmbeddingsOllama implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Embeddings Ollama test',
		name: 'embeddingsOllama',
		icon: 'file:ollama.svg',
		group: ['transform'],
		version: 1,
		description: 'Use Ollama Embeddings',
		defaults: {
			name: 'Embeddings Ollama',
		},
		...ollamaDescription,
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Embeddings'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsollama/',
					},
				],
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: [NodeConnectionType.AiEmbedding],
		outputNames: ['Embeddings'],

		properties: [
			// @ts-ignore
			getConnectionHintNoticeField(['ai_vectorStore']),
			// @ts-ignore
			ollamaModel,
			{
				...ollamaOptions,
				// @ts-ignore
				options: ollamaOptions.options?.filter((option) => option.name === 'numCtx'),
			},
		],
	};

	async supplyData(this: IExecuteFunctions, itemIndex: number): Promise<SupplyData> {
		this.logger.debug('Supply data for embeddings Ollama');
		const modelName = this.getNodeParameter('model', itemIndex) as string;
		const numCtx = this.getNodeParameter('options.numCtx', itemIndex) as string;
		const credentials = await this.getCredentials('ollamaApi');

		const embeddings = new OllamaEmbeddings({
			baseUrl: credentials.baseUrl as string,
			model: modelName,
			numCtx,
		});

		return {
			// @ts-ignore
			response: logWrapper(embeddings, this),
		};
	}
}
