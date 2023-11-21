// eslint-disable-next-line
import { Knex} from "knex";

declare module 'knex/types/tables' {
  export interface Tables {
    user : {
      id: string
      name: string
    },
    meal: {
      id: string,
      name: string,
      description: string,
      isFit: boolean,
      created_at: string,
      session_id?: string
    }
  }
}
