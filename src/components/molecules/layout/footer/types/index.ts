export type THIRD_PARTY_LINK = {
    id: number;
    text: string;
    link: string;
    comingSoon?: boolean;
    disabled?: boolean;
};

export type FooterLink = {
    id: number;
    text: string;
    links: THIRD_PARTY_LINK[];
};

export type Social = {
    id: number;
    name: string;
    asset: string;
};

export type Address = {
    id: number;
    region: string;
    address: string;
    phone: string;
};
