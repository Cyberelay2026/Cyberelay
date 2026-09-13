export type Computer = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  cpu: string;
  ram: number;
  storage: number;
  storageType: string;
  gpu: string;
  display: string;
  os: string;
  condition: "Like New" | "Excellent" | "Good" | "Fair";
  batteryHealth: number;
  price: number;
  city: string;
  province: string;
  description: string;
  marketplaceUrl: string;
  image: string;
};

export const computers: Computer[] = [
  {
    id: 1001,
    slug: "dell-latitude-5420-i5-16gb-512gb-1001",
    brand: "Dell",
    model: "Latitude 5420",
    cpu: "Intel Core i5-1145G7",
    ram: 16,
    storage: 512,
    storageType: "NVMe SSD",
    gpu: "Intel Iris Xe",
    display: '14\" Full HD',
    os: "Windows 11 Pro",
    condition: "Good",
    batteryHealth: 86,
    price: 399,
    city: "Calgary",
    province: "AB",
    description: "Fully tested business-class laptop with minor cosmetic wear. Charger included.",
    marketplaceUrl: "https://www.facebook.com/marketplace/",
    image: "/laptop-placeholder.svg"
  },
  {
    id: 1002,
    slug: "lenovo-thinkpad-t14-gen-2-i7-16gb-512gb-1002",
    brand: "Lenovo",
    model: "ThinkPad T14 Gen 2",
    cpu: "Intel Core i7-1165G7",
    ram: 16,
    storage: 512,
    storageType: "NVMe SSD",
    gpu: "Intel Iris Xe",
    display: '14\" Full HD',
    os: "Windows 11 Pro",
    condition: "Excellent",
    batteryHealth: 90,
    price: 449,
    city: "Calgary",
    province: "AB",
    description: "Clean ThinkPad in excellent working condition. Great for work, school and everyday use.",
    marketplaceUrl: "https://www.facebook.com/marketplace/",
    image: "/laptop-placeholder.svg"
  },
  {
    id: 1003,
    slug: "hp-elitebook-840-g8-i5-8gb-256gb-1003",
    brand: "HP",
    model: "EliteBook 840 G8",
    cpu: "Intel Core i5-1135G7",
    ram: 8,
    storage: 256,
    storageType: "NVMe SSD",
    gpu: "Intel Iris Xe",
    display: '14\" Full HD',
    os: "Windows 11 Pro",
    condition: "Good",
    batteryHealth: 82,
    price: 299,
    city: "Calgary",
    province: "AB",
    description: "Dependable and compact business laptop. Fully functional with normal signs of use.",
    marketplaceUrl: "https://www.facebook.com/marketplace/",
    image: "/laptop-placeholder.svg"
  }
];
