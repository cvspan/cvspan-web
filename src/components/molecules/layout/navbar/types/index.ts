export type NavLink = {
    id: number;
    text: string;
    link: string;
};

export type NavButton = {
    id: number;
    text: string;
};

export type SubNavbarList = {
    id: number;
    title: string;
    caption: string;
};

export type NavbarList = {
    id: number;
    title: string;
    list: SubNavbarList[];
};
