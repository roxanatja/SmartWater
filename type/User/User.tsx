type User = {
    _id: string,
    username: string,
    phoneNumber: string,
    password: string,
    role: string,
    fullName: string,
    email: string,
    updated: string,
    zones?: string[], // Optional parameter of type array of strings
    tokenFCM: string,
};

export type {User};