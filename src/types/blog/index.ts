export type TUserType = 'admin' | 'author';

export interface IUser {
    id?: string;
    first_name?: string;
    last_name?: string;
    profession?: string;
    bio?: string;
    country?: string;
    portfolio_url?: string;
    avatar?: string;

    email?: string;
    verified_email?: boolean;
    password?: string;

    user_type?: TUserType;
    company_id?: string;
    last_login?: string;
    suspended?: boolean;
}

export interface INotification {
    id?: string;
    user_id: string;
    title?: string;
    message?: string;
    link?: string;
    read?: boolean;
}

export interface Post {}
export interface Post {}
