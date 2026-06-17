import { 
    FaHome, 
    FaThLarge, 
    FaBook, 
    FaInfoCircle, 
    FaPhone,
    FaBlog 
} from 'react-icons/fa';

export const navLinks = [
    {
        id: 1,
        title: "الرئيسية",
        link: "/",
        icon: FaHome
    },
    {
        id: 2,
        title: "التصنيفات",
        link: "/categories",
        icon: FaThLarge
    },
    {
        id: 3,
        title: "كافة الكتب",
        link: "/books",
        icon: FaBook
    },
    {
        id: 4,
        title: "المدونة",
        link: "/blogs",
        icon: FaBlog
    },
    {
        id: 5,
        title: "من نحن",
        link: "/aboutus",
        icon: FaInfoCircle
    },
    {
        id: 6,
        title: "اتصل بنا",
        link: "/contact",
        icon: FaPhone
    }
];