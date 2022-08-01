# How to use HoroscopeGraphQL
Generate code files that you can use in your application.

## I. Integrate with your JavaScript app
To get started with AWS AppSync in your JavaScript, TypeScript, or Flow application, use the AWS Amplify toolchain. First install the AWS Amplify CLI:
```
npm install -g @aws-amplify/cli
```
After installing the CLI, navigate into the root of your JavaScript, TypeScript, or Flow project directory and run:
```
amplify init
```
Add the codegen category to your project.
```
amplify add codegen --apiId <api-id>
```
This will automatically generate GraphQL documents (queries, mutations, and subscriptions) and generate types for your JavaScript, TypeScript, or Flow application. If you modify the generated documents or your API's schema, you can regenerate the client code anytime with:
```
amplify codegen
```
Drag the `aws-exports.js` file and the generated JavaScript, TypeScript or Flow file into the `./src` directory of your project.

Alternatively, you can download the `aws-exports.js` file [here](./config/aws-exports.js).

## II. Integrate with your Android app
To get started with AWS AppSync in your Android application, use the AWS Amplify toolchain. First install the AWS Amplify CLI:
```
npm install -g @aws-amplify/cli
```
After installing the CLI, navigate into the root of your Android Studio project directory and run:
```
amplify init
```
Add the codegen category to your project.
```
amplify add codegen --apiId <api-id>
```
Next modify your Android project's Gradle setup as described here:

[Modify your Android project's Gradle setup](https://docs.amplify.aws/start/q/integration/android/)

This will automatically generate GraphQL documents (queries, mutations, and subscriptions) and generate types for your Android application when you run a gradle build.

Drag the `awsconfiguration.json` file into the `./src/main/res/raw` directory of your Android Studio project.

Alternatively, you can download the `awsconfiguration.json` file [here](./config/awsconfiguration.json).

## III. Integrate with your iOS app
To get started with AWS AppSync in your iOS application, use the AWS Amplify toolchain. First install the AWS Amplify CLI:
```
npm install -g @aws-amplify/cli
```
After installing the CLI, navigate into the root of your Xcode project directory and run:
```
amplify init
```
Add the codegen category to your project.
```
amplify add codegen --apiId <api-id>
```
This will automatically generate GraphQL documents (queries, mutations, and subscriptions) and generate types for your iOS application. If you modify the generated documents or your API's schema, you can regenerate the client code anytime with:
```
amplify codegen
```
Drag the `awsconfiguration.json` file and the generated Swift class file into your Xcode project.

Alternatively, you can download the `awsconfiguration.json` file [here](./config/awsconfiguration.json).

> To connect AppSync with your app, you will need to add the generated code into your project and initialize the client. See examples in the following guide:
https://docs.aws.amazon.com/appsync/latest/devguide/building-a-client-app.html <br>
To learn more about building a client application with AWS Amplify and AppSync please visit: <br>
https://aws-amplify.github.io

## IV. Client Samples
**An iOS application that uses the events sample API** <br>
[See the iOS project](https://github.com/aws-samples/aws-mobile-appsync-events-starter-ios)

**An Android application that uses the events sample API** <br>
[See the Android project](https://github.com/amazon-archives/aws-mobile-appsync-events-starter-android)

**A React application that uses the events sample API** <br>
[See the React project](https://github.com/amazon-archives/aws-mobile-appsync-events-starter-react)

**An Angular application that uses the chat sample API** <br>
[See the Angular project](https://github.com/aws-samples/aws-mobile-appsync-chat-starter-angular)

**A React Native application that uses the events sample API** <br>
[See the React Native project](https://github.com/amazon-archives/aws-mobile-appsync-events-starter-react-native)

## V. Data provided by HoroscopeGraphQL

**Information about request parameters and response data can be found [here](./config/schema.graphql#L6).**

### 1. Account Auth
Auth queries the auth information of an account.
```
{
	_id: String,
	address: String,
	account: {
		height: String,
		result: {
			type: String,
			value: {
				address: String,
				public_key: {
					type: String,
					value: String,
				},
				account_number: String,
				sequence: String,
			}
		}
	},
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 2. Account Balances
AllBalances queries the balance of all coins for a single account.
```
{
    _id: String,
    address: String,
    balances: [
		{
			denom: String,
			amount: String,
		},
	],
    custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 3. Account Spendable Balances
SpendableBalances queries the spenable balance of all coins for a single account.
```
{
	_id: String,
	address: String,
	spendable_balances: [
		{
			denom: String,
			amount: String,
		},
	],
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 4. Account Delegations
DelegatorDelegations queries all delegations of a given delegator address.
```
{
	_id: String,
	address: String,
	delegation_responses: [
		{
			delegation: {
				delegator_address: String,
				validator_address: String,
				shares: String,
			},
			balance: {
				denom: String,
				amount: String,
			},
		},
	],
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 5. Account Redelegations
Redelegations queries redelegations of given address.
```
{
	_id: String,
	address: String,
	redelegation_responses: [
		{
			redelegation: {
				delegator_address: String,
				validator_src_address: String,
				validator_dst_address: String,
				entries: [
					{
						creation_height: String,
						completion_time: String,
						initial_balance: String,
						shares_dst: String,
					},
				],
			},
			entries: [
				{
					redelegation_entry: {
						creation_height: String,
						completion_time: String,
						initial_balance: String,
						shares_dst: String,
					},
					balance: String,
				},
			],
		},
	],
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 6. Account Unbonds
DelegatorUnbondingDelegations queries all unbonding delegations of a given delegator address.
```
{
	_id: String,
	address: String,
	unbonding_responses: [
		{
			delegator_address: String,
			validator_address: String,
			entries: [
				{
					creation_height: String,
					completion_time: String,
					initial_balance: String,
					balance: String,
				},
			],
		},
	],
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 7. Block
Block queries block data based on given requirements.
```
{
	_id: String,
	block_id: {
		hash: String, 
		parts: {
			total: Number,
			hash: String,
		},
	},
	block: {
		header: {
			version: {
				block: Number,
			},
			chain_id: String,
			height: Number,
			time: Date,
			last_block_id: {
				hash: String,
				parts: {
					total: Number,
					hash: String,
				},
			},
			last_commit_hash: String,
			data_hash: String,
			validators_hash: String,
			next_validators_hash: String,
			consensus_hash: String,
			app_hash: String,
			last_results_hash: String,
			evidence_hash: String,
			proposer_address: String,
		},
		data: {
			txs: [String],
		},
		evidence: {
			evidence: [Object],
		},
		last_commit: {
			height: Number,
			round: Number,
			block_id: {
				hash: String,
				parts: {
					total: Number,
					hash: String,
				},
			},
			signatures: [
				{
					block_id_flag: Number,
					validator_address: String,
					timestamp: String,
					signature: String,
				},
			],
		},
	},
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 8. Code Id
Code Id queries code ids exist on network.
```
{
	_id: String,
	code_id: String,
	status: {
		type: String,
		enum: String,
	},
	contract_type: String,
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 9. Community Pool
CommunityPool queries the community pool coins.
```
{
	_id: String,
	pool: [
		{
			denom: String,
			amount: String,
		},
	],
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 10. CW20 Asset
CW20Asset queries tokens based on given requirements.
```
{
	_id: String,
	asset_id: String,
	code_id: String,
	asset_info: {
		data: {
			name: String,
			symbol: String,
			decimals:Number,
			total_supply: String,
		}
	},
	constract_address: String,
	token_id: String,
	balance: String,
	owner: String,
	history: {
		type: [String]
	},
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 11. CW721 Asset
CW721Asset queries NFTs based on given requirements.
```
{
	_id: String,
	asset_id: String,
	code_id: String,
	asset_info: {
		data: {
			access: {
				owner: String,
				approvals: []
			},
			info: {
				token_uri: String,
				extension: {}
			}
		}
	},
	constract_address: String,
	token_id: String,
	owner: String,
	history: {
		type: [String]
	},
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 12. Inflation
Inflation queries the inflation.
```
{
	_id: String,
	inflation: String,
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 13. Param
Params queries the all type of params.
```
{
	_id: String,
	module: String,
	params: {},
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 14. Pool
Pool queries the pool info.
```
{
	_id: String,
	not_bonded_tokens: String,
	bonded_tokens: String,
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 15. Proposal
Proposals queries all proposals based on given requirements.
```
{
	_id: String
	proposal_id: {
		type: Number,
	},
	content: {
		type: String,
		title: String,
		description: String,
		changes: [
			{
				subspace: String,
				key: String,
				value: String,
			},
		],
	},
	status: String,
	tally: {
		yes: String,
		no: String,
		abstain: String,
		no_with_veto: String,
	},
	final_tally_result: {
		yes: String,
		no: String,
		abstain: String,
		no_with_veto: String,
	},
	submit_time: Date,
	deposit_end_time: Date,
	deposit: [
		{
			depositor: String,
			amount: [
				{
					denom: String,
					amount: String,
				},
			],
		},
	],
	total_deposit: [
		{
			denom: String,
			amount: String,
		},
	],
	voting_start_time: Date,
	voting_end_time: Date,
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 16. Supply
TotalSupply queries the total supply of all coins.
```
{
	_id: String,
	supply: [
		{
			amount: String,
			denom: String,
		},
	],
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 17. Transacion
Transaction queries tx data based on given requirements.
```
{
	_id: String,
	tx: {
		body: {
			messages: [Object],
			memo: String,
			timeout_height: String,
			extension_options: [Object],
			non_critical_extension_options: [Object],
		},
		auth_info: {
			signer_infos: [
				{
					public_key: {
						type: String,
						key: String,
					},
					mode_info: {
						single: {
							mode: String,
						},
					},
					sequence: String,
				},
			],
			fee: {
				amount: [
					{
						amount: String,
						denom: String,
					},
				],
				gas_limit: String,
				payer: String,
				granter: String,
			},
		},
		signatures: [String],
	},
	tx_response: {
		height: Number,
		txhash: String,
		codespace: String,
		code: String,
		data: String,
		raw_log: String,
		logs: [
			{
				msg_index: Number,
				log: String,
				events: [
					{
						type: String,
						attributes: [
							{
								key: String,
								value: String,
							},
						],
					},
				],
			},
		],
		info: String,
		gas_wanted: String,
		gas_used: String,
		tx: Object,
		timestamp: Date,
		events: [
			{
				type: String,
				attributes: [
					{
						key: String,
						value: String,
						index: Boolean,
					},
				],
			},
		],
	},
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```
### 18. Validator
Validator queries all validators based on given requirements.
```
{
	_id: String,
	operator_address: String,
	consensus_pubkey: {
		type: String,
		key: String,
	},
	consensus_hex_address: String,
	jailed: Boolean,
	status: String,
	tokens: String,
	delegator_shares: String,
	description: {
		moniker: String,
		identity: String,
		website: String,
		details: String,
		security_contact: String,
	},
	unbonding_height: String,
	unbonding_time: String,
	commission: {
		commision_rates: {
			rate: String,
			max_rate: String,
			max_change_rate: String,
		},
		update_time: String,
	},
	min_self_delegation: String,
	val_signing_info: {
		address: String,
		start_height: String,
		index_offset: String,
		jailed_until: String,
		tombstoned: Boolean,
		missed_blocks_counter: String,
	},
	custom_info: {
		chain_id: String,
		chain_name: String,
	},
}
```