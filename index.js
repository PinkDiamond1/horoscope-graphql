const mongo = require('mongodb');
const fs = require('fs');
require('dotenv').config();

exports.handler = async (event, context) => {
    console.log("Received event {}", JSON.stringify(event, 3));
    console.log("event.field is:", event.field);

    let query = {};
    let result;

    let client = await connectToDB();
    const db = client.db('aura_indexer_dev');
    const [
        accountAuthCollection,
        accountBalancesCollection,
        accountSpendableBalancesCollection,
        accountDelegationsCollection,
        accountRedelegationsCollection,
        accountUnbondsCollection,
        blockCollection,
        codeIdCollection,
        communityPoolCollection,
        cw20AssetCollection,
        cw721AssetCollection,
        inflationCollection,
        paramCollection,
        poolCollection,
        proposalCollection,
        supplyCollection,
        transactionCollection,
        validatorCollection,
    ]
        = await Promise.all([
            db.collection("account_auth"),
            db.collection("account_balances"),
            db.collection("account_spendable_balances"),
            db.collection("account_delegations"),
            db.collection("account_redelegations"),
            db.collection("account_unbonds"),
            db.collection("block"),
            db.collection("code_id"),
            db.collection("community_pool"),
            db.collection("cw20_asset"),
            db.collection("cw721_asset"),
            db.collection("inflation"),
            db.collection("param"),
            db.collection("pool"),
            db.collection("proposal"),
            db.collection("supply"),
            db.collection("transaction"),
            db.collection("validator"),
        ]);

    if (event.arguments.address) query.address = event.arguments.address;
    if (event.arguments.hash) {
        switch (event.field) {
            case Query.transaction:
                query['tx_response.txhash'] = event.arguments.hash;
                break;
            case Query.block:
                query['block_id.hash'] = event.arguments.hash;
                break;
        }
    }
    if (event.arguments.code_id) query.code_id = event.arguments.code_id;
    if (event.arguments.contract_type) query.contract_type = event.arguments.contract_type;
    if (event.arguments.status) query.status = event.arguments.status;
    if (event.arguments.contract_address) query.constract_address = event.arguments.contract_address;
    if (event.arguments.owner) query.owner = event.arguments.owner;
    if (event.arguments.module) query.module = event.arguments.module;
    if (event.arguments.proposal_id) query.proposal_id = event.arguments.proposal_id;
    if (event.arguments.type) query['tx.body.messages.@type'] = event.arguments.type;
    if (event.arguments.operator_address) query.operator_address = event.arguments.operator_address;
    if (event.arguments.jailed) query.jailed = event.arguments.jailed;
    if (event.arguments.chain_id) query['custom_info.chain_id'] = event.arguments.chain_id;
    const limit = (!event.arguments.take || event.arguments.take > 100) ? 100 : event.arguments.take;
    const skip = event.arguments.skip ? event.arguments.skip * limit : 0;
    console.log("query is:", query);
    console.log("page index is:", skip);
    console.log("page size is:", limit);

    switch (event.field) {
        case Query.account_auth:
            result = await accountAuthCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.account_balances:
            result = await accountBalancesCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.account_spendable_balances:
            result = await accountSpendableBalancesCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.account_delegations:
            result = await accountDelegationsCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.account_redelegations:
            result = await accountRedelegationsCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.account_unbonds:
            result = await accountUnbondsCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.block:
            result = await blockCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.code_id:
            result = await codeIdCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.community_pool:
            result = await communityPoolCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.cw20_asset:
            result = await cw20AssetCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.cw721_asset:
            result = await cw721AssetCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.inflation:
            result = await inflationCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.param:
            result = await paramCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.pool:
            result = await poolCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.proposal:
            result = await proposalCollection.find(query, { limit, skip }).toArray();
            result.map(res => {
                res.content.type = res.content['@type'];
                delete res.content['@type'];
            });
            return result;
        case Query.supply:
            result = await supplyCollection.find(query, { limit, skip }).toArray();
            return result;
        case Query.transaction:
            result = await transactionCollection.find(query, { limit, skip }).toArray();
            result.map(res => {
                res.tx.auth_info.signer_infos.map(signer => {
                    signer.public_key.type = signer.public_key['@type'];
                    delete signer.public_key['@type'];
                });
            });
            return result;
        case Query.validator:
            result = await validatorCollection.find(query, { limit, skip }).toArray();
            result.map(res => {
                res.consensus_pubkey.type = res.consensus_pubkey['@type'];
                delete res.consensus_pubkey['@type'];
            });
            return result;
    }
};

async function connectToDB() {
    const DB_URL = `mongodb://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}`;

    let cacheClient = await mongo.MongoClient.connect(
        DB_URL,
    );
    return cacheClient;
};

const Query = {
    account_auth: "getAccountAuth",
    account_balances: "getAccountBalances",
    account_spendable_balances: "getAccountSpendableBalances",
    account_delegations: "getAccountDelegations",
    account_redelegations: "getAccountRedelegations",
    account_unbonds: "getAccountUnbonds",
    block: "getBlock",
    code_id: "getCodeId",
    community_pool: "getCommunityPool",
    cw20_asset: "getCw20Asset",
    cw721_asset: "getCw721Asset",
    inflation: "getInflation",
    param: "getParam",
    pool: "getPool",
    proposal: "getProposal",
    supply: "getSupply",
    transaction: "getTransaction",
    validator: "getValidator",
};