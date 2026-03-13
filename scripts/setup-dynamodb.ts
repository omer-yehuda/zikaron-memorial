/**
 * Run once to create DynamoDB tables and seed soldier data.
 * Usage: npx tsx scripts/setup-dynamodb.ts
 *
 * Requires AWS credentials in environment (or ~/.aws/credentials).
 */
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  ResourceInUseException,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import soldiers from '../data/soldiers.json' assert { type: 'json' };

const REGION = process.env.AWS_REGION ?? 'us-east-1';
const SOLDIERS_TABLE = process.env.DYNAMODB_SOLDIERS_TABLE ?? 'ZikaronSoldiers';
const CANDLES_TABLE = process.env.DYNAMODB_CANDLES_TABLE ?? 'ZikaronCandles';

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

async function createTable(name: string, pk: string) {
  try {
    await client.send(
      new CreateTableCommand({
        TableName: name,
        KeySchema: [{ AttributeName: pk, KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: pk, AttributeType: 'S' }],
        BillingMode: 'PAY_PER_REQUEST', // free tier on-demand
      })
    );
    console.log(`✅ Created table: ${name}`);

    // Wait for table to become active
    let active = false;
    while (!active) {
      await new Promise((r) => setTimeout(r, 2000));
      const res = await client.send(new DescribeTableCommand({ TableName: name }));
      active = res.Table?.TableStatus === 'ACTIVE';
    }
    console.log(`✅ Table active: ${name}`);
  } catch (e) {
    if (e instanceof ResourceInUseException) {
      console.log(`⚠️  Table already exists: ${name}`);
    } else {
      throw e;
    }
  }
}

async function seedSoldiers() {
  console.log(`\nSeeding ${soldiers.length} soldiers…`);
  for (const soldier of soldiers) {
    await docClient.send(new PutCommand({ TableName: SOLDIERS_TABLE, Item: soldier }));
  }
  console.log('✅ Seeding complete');
}

async function main() {
  console.log(`\n🚀 Setting up DynamoDB tables in ${REGION}…\n`);
  await createTable(SOLDIERS_TABLE, 'id');
  await createTable(CANDLES_TABLE, 'soldier_id');
  await seedSoldiers();
  console.log('\n✅ All done. Add these env vars to Amplify:');
  console.log(`   DYNAMODB_SOLDIERS_TABLE=${SOLDIERS_TABLE}`);
  console.log(`   DYNAMODB_CANDLES_TABLE=${CANDLES_TABLE}`);
  console.log('   AWS_REGION=' + REGION);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
