export type Product = {
    id: string;
    title: string;
    category: string;
    price: string;
    originalPrice?: string;
    image: string;
    hoverImage?: string;
    isPopular?: boolean;
    badge?: string;
    rating?: number;
    reviews?: number;
};

export type Category = {
    id: string;
    name: string;
    image: string;
    href: string;
};

export type Room = {
    id: string;
    name: string;
    image: string;
    productCount: number;
    href: string;
};

export const categories: Category[] = [
    { id: "c1", name: "Home Decor", image: "/images/categories/generated/home-decor.png", href: "/shop/home-decor" },
    { id: "c2", name: "Kitchen & Dining", image: "/images/categories/generated/kitchen-dining.png", href: "/shop/kitchen-dining" },
    { id: "c3", name: "Home Textile", image: "/images/categories/generated/home-textile.png", href: "/shop/home-textile" },
    { id: "c4", name: "Flowers & Greens", image: "/images/categories/generated/flowers-greens.png", href: "/shop/flowers-greens" },
    { id: "c5", name: "Bar & Drinkware", image: "/images/categories/generated/bar-drinkware.png", href: "/shop/bar-drinkware" },
    { id: "c6", name: "Bath Accessories", image: "/images/categories/generated/bath-accessories.png", href: "/shop/bath-accessories" },
    { id: "c7", name: "Gift Collection", image: "/images/categories/generated/gift-collection.png", href: "/shop/gift-collection" },
];

export const rooms: Room[] = [
    { id: "r1", name: "Living Room", image: "/images/rooms/living-room.png", productCount: 48, href: "/shop/living-room" },
    { id: "r2", name: "Dining Room", image: "/images/rooms/dining-room.png", productCount: 32, href: "/shop/dining-room" },
    { id: "r3", name: "Bedroom", image: "/images/rooms/bedroom.png", productCount: 27, href: "/shop/bedroom" },
    { id: "r4", name: "Workspace", image: "/images/rooms/workspace.png", productCount: 19, href: "/shop/workspace" },
];

export const products: Product[] = [
    {
        id: "1",
        title: "Artisan Ceramic Vase",
        category: "Home Decor",
        price: "₹1,499",
        image: "/images/categories/232015 1.png",
        hoverImage: "/images/categories/generated/home-decor.png",
        isPopular: true,
    },
    {
        id: "2",
        title: "Handloom Cotton Throw",
        category: "Home Textile",
        price: "₹2,999",
        image: "/images/categories/2151486605 1.png",
        hoverImage: "/images/categories/generated/home-textile.png",
    },
    {
        id: "3",
        title: "Faux Olive Tree",
        category: "Flowers & Greens",
        price: "₹1,899",
        image: "/images/categories/close-up-arrangement-modern-vase 1.png",
        hoverImage: "/images/categories/generated/flowers-greens.png",
    },
    {
        id: "4",
        title: "Gold Accent Tray",
        category: "Home Decor",
        price: "₹899",
        image: "/images/categories/generated/home-decor.png",
        hoverImage: "/images/categories/232015 1.png",
        badge: "New",
    },
    {
        id: "5",
        title: "Linen Table Runner",
        category: "Kitchen & Dining",
        price: "₹1,299",
        image: "/images/categories/generated/kitchen-dining.png",
        hoverImage: "/images/categories/2151486605 1.png",
    },
    {
        id: "6",
        title: "Marble Soap Dispenser",
        category: "Bath Accessories",
        price: "₹799",
        image: "/images/categories/generated/bath-accessories.png",
        hoverImage: "/images/categories/generated/gift-collection.png",
        isPopular: true,
    },
];

export const trendingProducts: Product[] = [
    {
        id: "t1",
        title: "Golden Geometric Candle Holder",
        category: "Home Decor",
        price: "₹1,299",
        originalPrice: "₹1,799",
        image: "/images/categories/232015 1.png",
        hoverImage: "/images/categories/generated/home-decor.png",
        badge: "Trending",
        rating: 4.8,
        reviews: 124,
    },
    {
        id: "t2",
        title: "Eucalyptus Stem Bundle",
        category: "Flowers & Greens",
        price: "₹599",
        image: "/images/categories/close-up-arrangement-modern-vase 1.png",
        hoverImage: "/images/categories/generated/flowers-greens.png",
        rating: 4.9,
        reviews: 89,
    },
    {
        id: "t3",
        title: "Velvet Cushion Set",
        category: "Home Textile",
        price: "₹2,499",
        originalPrice: "₹3,199",
        image: "/images/categories/2151486605 1.png",
        hoverImage: "/images/categories/generated/home-textile.png",
        badge: "Sale",
        rating: 4.7,
        reviews: 156,
    },
    {
        id: "t4",
        title: "Crystal Wine Glass Set",
        category: "Bar & Drinkware",
        price: "₹3,499",
        image: "/images/categories/generated/bar-drinkware.png",
        hoverImage: "/images/categories/generated/kitchen-dining.png",
        rating: 4.6,
        reviews: 73,
    },
];

export const bestSellers: Product[] = [
    {
        id: "b1",
        title: "Handcrafted Ceramic Planter",
        category: "Home Decor",
        price: "₹1,199",
        image: "/images/categories/232015 1.png",
        hoverImage: "/images/categories/generated/home-decor.png",
        rating: 4.9,
        reviews: 312,
        badge: "Best Seller",
    },
    {
        id: "b2",
        title: "Premium Scented Candle Trio",
        category: "Gift Collection",
        price: "₹1,899",
        originalPrice: "₹2,499",
        image: "/images/categories/generated/gift-collection.png",
        hoverImage: "/images/categories/generated/bath-accessories.png",
        rating: 4.8,
        reviews: 248,
    },
    {
        id: "b3",
        title: "Woven Cotton Throw Blanket",
        category: "Home Textile",
        price: "₹2,699",
        image: "/images/categories/2151486605 1.png",
        hoverImage: "/images/categories/generated/home-textile.png",
        rating: 4.7,
        reviews: 189,
    },
    {
        id: "b4",
        title: "Brass Table Lamp",
        category: "Home Decor",
        price: "₹4,999",
        image: "/images/categories/generated/home-decor.png",
        hoverImage: "/images/categories/232015 1.png",
        rating: 4.9,
        reviews: 96,
        badge: "Premium",
    },
];

export const newArrivals: Product[] = [
    {
        id: "n1",
        title: "Rattan Storage Basket",
        category: "Home Decor",
        price: "₹1,599",
        image: "/images/categories/generated/home-decor.png",
        badge: "New",
        rating: 5.0,
        reviews: 12,
    },
    {
        id: "n2",
        title: "Hammered Copper Vase",
        category: "Home Decor",
        price: "₹2,199",
        image: "/images/categories/232015 1.png",
        badge: "New",
        rating: 4.8,
        reviews: 8,
    },
    {
        id: "n3",
        title: "Organic Linen Napkin Set",
        category: "Kitchen & Dining",
        price: "₹999",
        image: "/images/categories/generated/kitchen-dining.png",
        badge: "New",
    },
    {
        id: "n4",
        title: "Marble & Gold Coaster Set",
        category: "Bar & Drinkware",
        price: "₹1,399",
        image: "/images/categories/generated/bar-drinkware.png",
        badge: "New",
    },
    {
        id: "n5",
        title: "Dried Pampas Arrangement",
        category: "Flowers & Greens",
        price: "₹1,799",
        image: "/images/categories/close-up-arrangement-modern-vase 1.png",
        badge: "New",
    },
    {
        id: "n6",
        title: "Luxury Bath Towel Set",
        category: "Bath Accessories",
        price: "₹3,299",
        image: "/images/categories/generated/bath-accessories.png",
        badge: "New",
    },
];

export const instagramImages = [
    "/images/instagram/ig-1.png",
    "/images/instagram/ig-2.png",
    "/images/instagram/ig-3.png",
    "/images/instagram/ig-4.png",
    "/images/instagram/ig-5.png",
    "/images/instagram/ig-6.png",
];

export const features = [
    {
        id: 1,
        title: "Free Shipping",
        description: "On orders over ₹999",
        icon: "truck",
    },
    {
        id: 2,
        title: "Secure Payment",
        description: "100% secure checkout",
        icon: "shield",
    },
    {
        id: 3,
        title: "Easy Returns",
        description: "30-day return policy",
        icon: "refresh",
    },
    {
        id: 4,
        title: "24/7 Support",
        description: "Dedicated assistance",
        icon: "headset",
    },
];
