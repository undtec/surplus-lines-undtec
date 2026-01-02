import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SurplusLinesApi implements ICredentialType {
	name = 'surplusLinesApi';
	displayName = 'Surplus Lines API';
	documentationUrl = 'https://surpluslinesapi.com/docs/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Surplus Lines API key from Underwriters Technologies. Get one at https://app.surpluslinesapi.com (includes 100 free calls). Try free calculator: https://sltax.undtec.com',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.surpluslinesapi.com',
			url: '/v1/calculate',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				state: 'Texas',
				premium: 100,
			}),
		},
	};
}
