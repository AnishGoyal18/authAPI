export interface UserModelInterface {
    name: string;
    username: string;
    bio: string;
    age: number;
    password: string;
    deletedAt?: Date;
}

export interface RegistrationInterface {
    name: string;
    username: string;
    bio: string;
    age: number;
    password: string;
}

export interface LoginInterface {
    username: string;
    password: string;
}

export interface UpdateUserInterface {
    name: string;
    username: string;
    bio: string;
    age: number;
}

export interface ResetPasswordInterface { 
    oldPassword: string; 
    newPassword: string;
}
