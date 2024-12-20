import { Search } from "./common";

export interface IUsersGetParams extends Search {
    filters?: {
        role?: string;
        year?: string;
        month?: string;
    }
}

export interface IPermissionsGetParams extends Search {
    filters?: {
        year?: string;
        month?: string;
    }
}

export interface IUserUpdateBody {
    data: {
        username?: string;
        phoneNumber?: string;
        fullName?: string;
        role?: string;
        email?: string;
        zones?: string[];
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
        password: string;
        email: string;
        role: string;
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
