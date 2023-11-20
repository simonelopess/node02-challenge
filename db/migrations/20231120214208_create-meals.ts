import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTable('meal', (table) => {
        table.text('name').notNullable()
        table.text('description').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.boolean('isFit').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meal')
}

