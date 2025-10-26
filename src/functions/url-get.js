import dynamoDb from '../utils/dynamodb';
import response from '../utils/response';

exports.handler = async (event) => {
    try {
        const hash = event.pathParameters.hash;

        const urlResult = await dynamoDb.getLongURL(hash);
        if (!urlResult.Item) {
            return response.notFoundError('URL not found');
        }

        return response.redirect(urlResult.Item.longUrl);
    } catch (error) {
        return response.serverError(error);
    }
};
