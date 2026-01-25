import { ClassName } from "./admininstration.schema";
import * as AdministrationDto from "./administration.dto";


export const createClassName = async (data: AdministrationDto.IClassNameCreate) => {
    const result = await ClassName.create(data);
    return result;
};

export const updateClassName = async (id: string, data: Partial<AdministrationDto.IClassName>) => {
    const result = await ClassName.findByIdAndUpdate(id, data, { new: true });
    return result;
};

export const getAllClassNames = async (isActive?: boolean) => {
    const filter: any = {};
    if (isActive) {
        filter.isActive = isActive;
    } else {
        filter.isActive = true;
    }
    const result = await ClassName.find(filter).sort({ order: 1 });
    return result;
};