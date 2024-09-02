export type NavLink = {
    id: number;
    text: string;
    link: string;
};

export type SubNavbarList = {
    id: number;
    title: string;
    caption: string;
    link: string;
    icon: string
};

export type NavbarList = {
    id: number;
    title: string;
    list: SubNavbarList[];
};

export type NavButton = {
    id: number;
    text: string;
    links: NavbarList[];
};
