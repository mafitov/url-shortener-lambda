const Joi = require('joi');

const schema = Joi.object({
    longUrl: Joi.string().max(255).required(),
    ttl: Joi.number()
});

export default schema;
