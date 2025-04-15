import { BaseSchema } from "../common/dto/base.dto";
import { SessionStatus } from "./session.schema";


export interface ISession extends BaseSchema {
    session: string;
    startDate: Date;
    endDate: Date;
    sessionStatus: SessionStatus;
    deleted: boolean;
}

export type ISessionCreate = Omit<ISession, '_id' | 'createdAt' | 'updatedAt'>;