const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension)

module.exports.CampgroundSchema = joi
    .object({
        campground: {
            title: joi.string().required().escapeHTML(),
            location: joi.string().required().escapeHTML(),
            // image: joi.string().required(),
            price: joi.number().min(0).required(),
            description: joi.string().required().escapeHTML()
        },
        deleteImages: joi.array()
    }).required()

module.exports.ReviewSchema = joi
    .object({
        review: {
            rating: joi.number().min(0).required(),
            body: joi.string().required().escapeHTML(),
        },
    })
    .required();