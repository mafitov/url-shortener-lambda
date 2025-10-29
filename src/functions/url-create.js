import schema from '../schemas/url';
import dynamoDb from '../utils/dynamodb';
import response from '../utils/response';

exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);

        const validation = schema.validate(data);
        if (validation.error) {
            return response.validationError(validation.error.details[0].message);
        }

        const urlResult = await dynamoDb.createShortUrl(data.longUrl, data.ttl);

        return response.created({
            shortUrl: `https://${event.requestContext.domainName}/urls/${urlResult.Item.hash}`
        });
    } catch (error) {
        return response.serverError(error);
    }
};
