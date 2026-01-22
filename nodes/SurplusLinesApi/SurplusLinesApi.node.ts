import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

export class SurplusLinesApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Surplus Lines API',
		name: 'surplusLinesApi',
		icon: 'file:surpluslines.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Calculate surplus lines taxes for all U.S. states by Underwriters Technologies. Free calculator: sltax.undtec.com',
		defaults: {
			name: 'Surplus Lines API',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'surplusLinesApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.surpluslinesapi.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Calculate Tax',
						value: 'calculate',
						description: 'Calculate surplus lines tax for a state and premium',
						action: 'Calculate surplus lines tax',
					},
					{
						name: 'Get Rates',
						value: 'getRates',
						description: 'Get current tax rates for all states',
						action: 'Get current tax rates',
					},
					{
						name: 'Get States',
						value: 'getStates',
						description: 'Get list of all supported states',
						action: 'Get list of states',
					},
				],
				default: 'calculate',
			},
			// Calculate Tax parameters
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						operation: ['calculate'],
					},
				},
				options: [
					{ name: 'Alabama', value: 'Alabama' },
					{ name: 'Alaska', value: 'Alaska' },
					{ name: 'Arizona', value: 'Arizona' },
					{ name: 'Arkansas', value: 'Arkansas' },
					{ name: 'California', value: 'California' },
					{ name: 'Colorado', value: 'Colorado' },
					{ name: 'Connecticut', value: 'Connecticut' },
					{ name: 'Delaware', value: 'Delaware' },
					{ name: 'District of Columbia', value: 'District of Columbia' },
					{ name: 'Florida', value: 'Florida' },
					{ name: 'Georgia', value: 'Georgia' },
					{ name: 'Hawaii', value: 'Hawaii' },
					{ name: 'Idaho', value: 'Idaho' },
					{ name: 'Illinois', value: 'Illinois' },
					{ name: 'Indiana', value: 'Indiana' },
					{ name: 'Iowa', value: 'Iowa' },
					{ name: 'Kansas', value: 'Kansas' },
					{ name: 'Kentucky', value: 'Kentucky' },
					{ name: 'Louisiana', value: 'Louisiana' },
					{ name: 'Maine', value: 'Maine' },
					{ name: 'Maryland', value: 'Maryland' },
					{ name: 'Massachusetts', value: 'Massachusetts' },
					{ name: 'Michigan', value: 'Michigan' },
					{ name: 'Minnesota', value: 'Minnesota' },
					{ name: 'Mississippi', value: 'Mississippi' },
					{ name: 'Missouri', value: 'Missouri' },
					{ name: 'Montana', value: 'Montana' },
					{ name: 'Nebraska', value: 'Nebraska' },
					{ name: 'Nevada', value: 'Nevada' },
					{ name: 'New Hampshire', value: 'New Hampshire' },
					{ name: 'New Jersey', value: 'New Jersey' },
					{ name: 'New Mexico', value: 'New Mexico' },
					{ name: 'New York', value: 'New York' },
					{ name: 'North Carolina', value: 'North Carolina' },
					{ name: 'North Dakota', value: 'North Dakota' },
					{ name: 'Ohio', value: 'Ohio' },
					{ name: 'Oklahoma', value: 'Oklahoma' },
					{ name: 'Oregon', value: 'Oregon' },
					{ name: 'Pennsylvania', value: 'Pennsylvania' },
					{ name: 'Puerto Rico', value: 'Puerto Rico' },
					{ name: 'Rhode Island', value: 'Rhode Island' },
					{ name: 'South Carolina', value: 'South Carolina' },
					{ name: 'South Dakota', value: 'South Dakota' },
					{ name: 'Tennessee', value: 'Tennessee' },
					{ name: 'Texas', value: 'Texas' },
					{ name: 'Utah', value: 'Utah' },
					{ name: 'Vermont', value: 'Vermont' },
					{ name: 'Virgin Islands', value: 'Virgin Islands' },
					{ name: 'Virginia', value: 'Virginia' },
					{ name: 'Washington', value: 'Washington' },
					{ name: 'West Virginia', value: 'West Virginia' },
					{ name: 'Wisconsin', value: 'Wisconsin' },
					{ name: 'Wyoming', value: 'Wyoming' },
				],
				default: 'Texas',
				description: 'The U.S. state for tax calculation',
			},
			{
				displayName: 'Premium',
				name: 'premium',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['calculate'],
					},
				},
				default: 10000,
				description: 'Premium amount in USD (must be positive)',
				typeOptions: {
					minValue: 0.01,
				},
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['calculate'],
					},
				},
				options: [
					{
						displayName: 'Wet Marine',
						name: 'wet_marine',
						type: 'boolean',
						default: false,
						description: 'Whether this is wet marine coverage (affects Alaska)',
					},
					{
						displayName: 'Fire Insurance',
						name: 'fire_insurance',
						type: 'boolean',
						default: false,
						description: 'Whether this is fire insurance (affects SD, MT)',
					},
					{
						displayName: 'Electronic Filing',
						name: 'electronic_filing',
						type: 'boolean',
						default: false,
						description: 'Whether using electronic filing (affects MT stamping fee)',
					},
					{
						displayName: 'Fire Marshal Rate',
						name: 'fire_marshal_rate',
						type: 'number',
						default: 0,
						description: 'Fire marshal tax rate 0-1% (Illinois only)',
						typeOptions: {
							minValue: 0,
							maxValue: 1,
						},
					},
					{
						displayName: 'Medical Malpractice',
						name: 'medical_malpractice',
						type: 'boolean',
						default: false,
						description: 'Whether this is medical malpractice coverage (exempt in PR)',
					},
					{
						displayName: 'Workers Comp',
						name: 'workers_comp',
						type: 'boolean',
						default: false,
						description: 'Whether this is workers comp coverage (exempt in VA)',
					},
					{
						displayName: 'Year',
						name: 'year',
						type: 'number',
						default: new Date().getFullYear(),
						description: 'Tax year (affects Iowa rates 2024-2027)',
					},
					{
						displayName: 'New Business',
						name: 'new_business',
						type: 'boolean',
						default: true,
						description: 'Whether this is a new/renewal policy (affects Oregon $10 fee)',
					},
				],
			},
			// Get Rates parameters
			{
				displayName: 'State Filter',
				name: 'stateFilter',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getRates'],
					},
				},
				default: '',
				placeholder: 'e.g., Texas',
				description: 'Optional: Filter rates for a specific state. Leave empty for all states.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				if (operation === 'calculate') {
					const state = this.getNodeParameter('state', i) as string;
					const premium = this.getNodeParameter('premium', i) as number;
					const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

					const body: IDataObject = {
						state,
						premium,
					};

					// Add optional parameters if provided
					if (additionalOptions.wet_marine !== undefined) {
						body.wet_marine = additionalOptions.wet_marine;
					}
					if (additionalOptions.fire_insurance !== undefined) {
						body.fire_insurance = additionalOptions.fire_insurance;
					}
					if (additionalOptions.electronic_filing !== undefined) {
						body.electronic_filing = additionalOptions.electronic_filing;
					}
					if (additionalOptions.fire_marshal_rate !== undefined && additionalOptions.fire_marshal_rate !== 0) {
						body.fire_marshal_rate = additionalOptions.fire_marshal_rate;
					}
					if (additionalOptions.medical_malpractice !== undefined) {
						body.medical_malpractice = additionalOptions.medical_malpractice;
					}
					if (additionalOptions.workers_comp !== undefined) {
						body.workers_comp = additionalOptions.workers_comp;
					}
					if (additionalOptions.year !== undefined) {
						body.year = additionalOptions.year;
					}
					if (additionalOptions.new_business !== undefined) {
						body.new_business = additionalOptions.new_business;
					}

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'surplusLinesApi',
						{
							method: 'POST',
							url: 'https://api.surpluslinesapi.com/v1/calculate',
							body,
							json: true,
						},
					);

					returnData.push({
						json: response as IDataObject,
						pairedItem: { item: i },
					});
				} else if (operation === 'getRates') {
					const stateFilter = this.getNodeParameter('stateFilter', i, '') as string;

					let url = 'https://api.surpluslinesapi.com/v1/rates';
					if (stateFilter) {
						url += `?state=${encodeURIComponent(stateFilter)}`;
					}

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'surplusLinesApi',
						{
							method: 'GET',
							url,
							json: true,
						},
					);

					returnData.push({
						json: response as IDataObject,
						pairedItem: { item: i },
					});
				} else if (operation === 'getStates') {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'surplusLinesApi',
						{
							method: 'GET',
							url: 'https://api.surpluslinesapi.com/v1/states',
							json: true,
						},
					);

					returnData.push({
						json: response as IDataObject,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}