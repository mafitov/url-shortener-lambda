import AWS from 'aws-sdk';
import ShortUniqueId from 'short-unique-id';

const client = new AWS.DynamoDB.DocumentClient();

export default {
    getLongURL: (hash) => {
        return client
            .get({
                TableName: process.env.URL_TABLE,
                Key: {
                    hash: hash
                }
            })
            .promise();
    },
    createShortUrl: async (longUrl, ttl) => {
        const hash = new ShortUniqueId({ length: 10 });
        const params = {
            TableName: process.env.URL_TABLE,
            Item: {
                hash: hash.rnd(),
                longUrl: longUrl,
                ttl: ttl
            }
        };
        await client.put(params).promise();
        return params;
    },
};
