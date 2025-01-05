import { Search } from "./common";

export interface IUsersGetParams extends Search {
    filters?: {
        role?: string;
        year?: number;
        month?: number;
    }
}

export interface IPermissionsGetParams extends Search {
    filters?: {
        year?: number;
        month?: number;
    }
}

export interface IUserUpdateBody {
    data: {
        phoneNumber?: string;
        fullName?: string;
        identification?: string;
        role?: string;
        email?: string;
        zones?: string[];
        password?: string;
        schedules?: string[];
    }
}

export interface IPermissionBody {
    data: {
        name: string;
        action: string;
        description: string;
    }
}

export interface ILoginBody {
    data: {
        phoneNumber: string;
        password: string;
    }
}

export interface IRegisterBody {
    data: {
        phoneNumber: string;
        fullName: string;
        identification: string;
        password: string;
        email: string;
        role: string;
        schedules: string[];
        deactivated: boolean;
    }
}

export interface IUserPermissionsUpdateBody {
    data: {
        permissions: string[];
    }
}

export interface IUserChangePaswordBody {
    data: {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
    }
}

export interface IUserFilter {
    userId: string;
}
