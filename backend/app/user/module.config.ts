import { ModuleName, SubModuleName } from "../common/utils/enum";


export interface IModule {
    name: ModuleName;
    subModules?: {
        name: SubModuleName;
    }[];
}

export const MODULES_CONFIG: IModule[] = [
    {
        name: ModuleName.DASHBOARD,
        subModules: []
    },
    {
        name: ModuleName.SESSION,
        subModules: []
    },
    {
        name: ModuleName.CLASSES,
        subModules: [
            { name: SubModuleName.CLASS },
            { name: SubModuleName.SECTION },
            { name: SubModuleName.SUBJECTS },
            { name: SubModuleName.TIMETABLE }
        ]
    },
    {
        name: ModuleName.STUDENTS,
        subModules: []
    },
    {
        name: ModuleName.Employee,
        subModules: []
    },
    {
        name: ModuleName.TOOLS,
        subModules: [
            { name: SubModuleName.ROLES },
            { name: SubModuleName.PERMISSIONS }
        ]
    },
];
