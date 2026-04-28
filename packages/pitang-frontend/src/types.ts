export interface LoggedUser {
    address: Address;
    age: number;
    bank: Bank;
    birthDate: string;
    bloodGroup: string;
    company: Company;
    crypto: Crypto;
    ein: string;
    email: string;
    eyeColor: string;
    firstName: string;
    gender: string;
    hair: Hair;
    height: number;
    id: number;
    image: string;
    ip: string;
    lastName: string;
    macAddress: string;
    maidenName: string;
    password: string;
    phone: string;
    role: string;
    ssn: string;
    university: string;
    userAgent: string;
    username: string;
    weight: number;
}

export interface Hair {
    color: string;
    type: string;
}

export interface Address {
    address: string;
    city: string;
    coordinates: Coordinates;
    country: string;
    postalCode: string;
    state: string;
    stateCode: string;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Bank {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
}

export interface Company {
    address: Address2;
    department: string;
    name: string;
    title: string;
}

export interface Address2 {
    address: string;
    city: string;
    coordinates: Coordinates2;
    country: string;
    postalCode: string;
    state: string;
    stateCode: string;
}

export interface Coordinates2 {
    lat: number;
    lng: number;
}

export interface Crypto {
    coin: string;
    network: string;
    wallet: string;
}

export interface Review {
    comment: string;
    date: string;
    rating: number;
    reviewerEmail: string;
    reviewerName: string;
}

export interface Dimensions {
    depth: number;
    height: number;
    width: number;
}

export interface Meta {
    barcode: string;
    createdAt: string;
    qrCode: string;
    updatedAt: string;
}

export interface Product {
    availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
    brand: string;
    category: string;
    description: string;
    dimensions: Dimensions;
    discountPercentage: number;
    id: number;
    images: string[];
    meta: Meta;
    minimumOrderQuantity: number;
    price: number;
    rating: number;
    returnPolicy: string;
    reviews: Review[];
    shippingInformation: string;
    sku: string;
    stock: number;
    tags: string[];
    thumbnail: string;
    title: string;
    warrantyInformation: string;
    weight: number;
}

// export interface ProductsResponse {
//   products: Product[];
//   total: number;
//   skip: number;
//   limit: number;
// }

export interface Post {
    body: string;
    id: number;
    reactions: Reactions;
    tags: string[];
    title: string;
    userId: number;
    views: number;
}

export interface Reactions {
    dislikes: number;
    likes: number;
}

export type ApiResponse<T, K extends string> = {
    [key in K]: T[];
} & {
    total: number;
    skip: number;
    limit: number;
};
