'use strict';

/**
 * task controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
// import moment
const moment = require("moment")

module.exports = createCoreController('api::task.task', ({ strapi }) => ({
    async create(ctx) {
        const { data } = ctx.request.body;

        // convert to date with Moment
        const dateCreated = moment(new Date, "MM-DD-YYYY").toString();
        // convert to string
        data.dateCreated = dateCreated;

        // create or save task
        let newTask = await strapi.service('api::task.task').create({ data })
        const sanitizedEntity = await this.sanitizeOutput(newTask, ctx);
        return this.transformResponse(sanitizedEntity)
    }
}));
