const mongo = require('mongodb');
require('dotenv').config();
const Bull = require('bull');

exports.handler = async (event, context) => {
    console.log("Received event {}", JSON.stringify(event, 3));
    console.log("Request Headers: ", event.headers);
    console.log("event.field is:", event.field);

    let query = {};
    let result;

    const apiKeyQueue = new Bull(
        process.env.REDIS_BULL_KEY,
        {
            redis: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                username: process.env.REDIS_USERNAME,
                password: process.env.REDIS_PASSWORD,
                db: process.env.REDIS_DB_NUMBER,
            },
            prefix: process.env.REDIS_BULL_KEY,
            defaultJobOptions: {
                removeOnComplete: true,
            }
        }
    );
    apiKeyQueue.add({ apiKey: event.headers['x-api-key'] });

    let client;
    switch (event.arguments.chain_id) {
        case ChainId.euphoria:
        case ChainId.cosmoshub:
        case ChainId.osmosis:
            client = await connectToDB(process.env.DB_USERNAME_PROD, process.env.DB_PASSWORD_PROD, process.env.DB_HOST_PROD);
            break;
        default:
            client = await connectToDB(process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_HOST);
            break;
    }
    let db;
    switch (event.arguments.chain_id) {
        case ChainId.aura_testnet: db = client.db('horoscope_dev_auratestnet'); break;
        case ChainId.serenity: db = client.db('horoscope_dev_serenitytestnet001'); break;
        case ChainId.euphoria: db = client.db('horoscope_dev_euphoria1'); break;
        case ChainId.evmos_testnet: db = client.db('horoscope_dev_evmos90004'); break;
        case ChainId.theta: db = client.db('horoscope_dev_thetatestnet001'); break;
        case ChainId.cosmoshub: db = client.db('horoscope_prod_cosmoshub4'); break;
        case ChainId.osmosis: db = client.db('horoscope_prod_osmosis1'); break;
        default: db = client.db('horoscope_dev_auratestnet'); break;
    }
    const [
        accountInfoCollection,
        accountStatisticsCollection,
        blockCollection,
        codeIdCollection,
        communityPoolCollection,
        cw20AssetCollection,
        cw721AssetCollection,
        dailyTxStatisticsCollection,
        delayJobCollection,
        ibcDenomCollection,
        inflationCollection,
        paramCollection,
        poolCollection,
        proposalCollection,
        smartContractsCollection,
        supplyCollection,
        transactionCollection,
        validatorCollection,
        voteCollection
    ]
        = await Promise.all([
            db.collection("account_info"),
            db.collection("account_statistics"),
            db.collection("block"),
            db.collection("code_id"),
            db.collection("community_pool"),
            db.collection("cw20_asset"),
            db.collection("cw721_asset"),
            db.collection("daily_tx_statistics"),
            db.collection("delay_job"),
            db.collection("ibc_denom"),
            db.collection("inflation"),
            db.collection("param"),
            db.collection("pool"),
            db.collection("proposal"),
            db.collection("smart_contracts"),
            db.collection("supply"),
            db.collection("transaction"),
            db.collection("validator"),
            db.collection("vote")
        ]);

    if (event.arguments.address) {
        switch (event.field) {
            case Query.delay_job:
                query['content.address'] = event.arguments.address;
                break;
            default:
                query.address = event.arguments.address;
                break;
        }
    }
    if (event.arguments.hash) {
        switch (event.field) {
            case Query.transaction:
                query['tx_response.txhash'] = event.arguments.hash;
                break;
            case Query.block:
                query['block_id.hash'] = event.arguments.hash;
                break;
            case Query.ibc_denom:
                query.hash = event.arguments.hash;
                break;
        }
    }
    if (event.arguments.date) query.date = event.arguments.date;
    if (event.arguments.code_id) query.code_id = event.arguments.code_id;
    if (event.arguments.contract_type) query.contract_type = event.arguments.contract_type;
    if (event.arguments.status) query.status = event.arguments.status;
    if (event.arguments.contract_address) query.constract_address = event.arguments.contract_address;
    if (event.arguments.owner) query.owner = event.arguments.owner;
    if (event.arguments.module) query.module = event.arguments.module;
    if (event.arguments.proposal_id) query.proposal_id = event.arguments.proposal_id;
    if (event.arguments.type) {
        switch (event.arguments.field) {
            case Query.delay_job:
                query.type = event.arguments.type;
                break;
            default:
                query['tx.body.messages.@type'] = event.arguments.type;
                break;
        }
    }
    if (event.arguments.operator_address) query.operator_address = event.arguments.operator_address;
    if (event.arguments.jailed) query.jailed = event.arguments.jailed;
    if (event.arguments.contract_hash) query.contract_hash = event.arguments.contract_hash;
    if (event.arguments.creator_address) query.creator_address = event.arguments.creator_address;
    if (event.arguments.tx_hash) query.tx_hash = event.arguments.tx_hash;
    if (event.arguments.height) {
        switch (event.arguments.field) {
            case Query.transaction:
                query['indexes.height'] = event.arguments.height;
                break;
            case Query.smart_contracts:
                query.height = event.arguments.height;
                break;
        }
    }
    if (event.arguments.contract_name) query.contract_name = event.arguments.contract_name;
    if (event.arguments.voter_address) query.voter_address = event.arguments.voter_address;
    if (event.arguments.answer) query.answer = event.arguments.answer;
    const limit = (!event.arguments.take || event.arguments.take > 100) ? 100 : event.arguments.take;
    const skip = event.arguments.skip ? event.arguments.skip * limit : 0;
    console.log("query is:", query);
    console.log("page index is:", skip);
    console.log("page size is:", limit);

    switch (event.field) {
        case Query.account_info:
            result = await accountInfoCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.account_statistics:
            result = await accountStatisticsCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.block:
            result = await blockCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.code_id:
            result = await codeIdCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.community_pool:
            result = await communityPoolCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.cw20_asset:
            result = await cw20AssetCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.cw721_asset:
            result = await cw721AssetCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.daily_tx_statistics:
            result = await dailyTxStatisticsCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.delay_job:
            result = await delayJobCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.ibc_denom:
            result = await ibcDenomCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.inflation:
            result = await inflationCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.param:
            result = await paramCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.pool:
            result = await poolCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.proposal:
            result = await proposalCollection.find(query, { limit, skip }).toArray();
            result.map(res => {
                res.content.type = res.content['@type'];
                delete res.content['@type'];
            });
            break;
        case Query.supply:
            result = await supplyCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.smart_contracts:
            result = await smartContractsCollection.find(query, { limit, skip }).toArray();
            break;
        case Query.transaction:
            result = await transactionCollection.find(query, { limit, skip }).toArray();
            result.map(res => {
                res.tx.auth_info.signer_infos.map(signer => {
                    signer.public_key.type = signer.public_key['@type'];
                    delete signer.public_key['@type'];
                });
            });
            break;
        case Query.validator:
            result = await validatorCollection.find(query, { limit, skip }).toArray();
            result.map(res => {
                res.consensus_pubkey.type = res.consensus_pubkey['@type'];
                delete res.consensus_pubkey['@type'];
            });
            break;
        case Query.vote:
            result = await voteCollection.find(query, { limit, skip }).toArray();
            break;
    }
    client.close();
    return result;
};

async function connectToDB(username, password, host) {
    const DB_URL = `mongodb://${username}:${encodeURIComponent(password)}@${host}:${process.env.DB_PORT}`;

    let cacheClient = await mongo.MongoClient.connect(
        DB_URL,
    );
    return cacheClient;
};

const Query = {
    account_info: "getAccountInfo",
    account_statistics: "getAccountStatistics",
    block: "getBlock",
    code_id: "getCodeId",
    community_pool: "getCommunityPool",
    cw20_asset: "getCw20Asset",
    cw721_asset: "getCw721Asset",
    daily_tx_statistics: "getDailyTxStatistics",
    delay_job: "getDelayJob",
    ibc_denom: "getIbcDenom",
    inflation: "getInflation",
    param: "getParam",
    pool: "getPool",
    proposal: "getProposal",
    smart_contracts: "getSmartContracts",
    supply: "getSupply",
    transaction: "getTransaction",
    validator: "getValidator",
    vote: "getVote"
};

const ChainId = {
    aura_testnet: 'aura-testnet',
    serenity: 'serenity-testnet-001',
    euphoria: 'euphoria-1',
    evmos_testnet: 'evmos_9000-4',
    theta: 'theta-testnet-001',
    cosmoshub: 'cosmoshub-4',
    osmosis: 'osmosis-1',
}