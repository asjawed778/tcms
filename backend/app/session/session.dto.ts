import { SessionStatus } from "../common/constant/enum";
import { BaseSchema } from "../common/dto/base.dto";


export interface ISession extends BaseSchema {
    session: string;
    startDate: Date;
    endDate: Date;
    sessionStatus: SessionStatus;
    deleted: boolean;
}

export type ISessionCreate = Omit<ISession, '_id' | 'createdAt' | 'updatedAt'>;