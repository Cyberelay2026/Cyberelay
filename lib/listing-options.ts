export const brands = [
  "Acer",
  "Apple",
  "ASUS",
  "Dell",
  "Framework",
  "HP",
  "Lenovo",
  "LG",
  "Microsoft",
  "MSI",
  "Razer",
  "Samsung",
  "Toshiba",
] as const;

export const cpuFamilies = {
  Intel: ["Core i3", "Core i5", "Core i7", "Core i9", "Core Ultra 5", "Core Ultra 7", "Core Ultra 9", "Celeron", "Pentium", "Xeon"],
  AMD: ["Ryzen 3", "Ryzen 5", "Ryzen 7", "Ryzen 9", "Ryzen AI 5", "Ryzen AI 7", "Ryzen AI 9", "Athlon"],
  Apple: ["M1", "M1 Pro", "M1 Max", "M1 Ultra", "M2", "M2 Pro", "M2 Max", "M2 Ultra", "M3", "M3 Pro", "M3 Max", "M3 Ultra", "M4", "M4 Pro", "M4 Max", "M5", "M5 Pro", "M5 Max", "M5 Ultra", "M6"],
  Qualcomm: ["Snapdragon X", "Snapdragon X Plus", "Snapdragon X Elite"],
} as const;

export const cpuBrands = Object.keys(cpuFamilies) as Array<keyof typeof cpuFamilies>;
export const ramOptions = [4, 8, 16, 32, 64, 128] as const;
export const storageOptions = [64, 128, 256, 512, 1024, 2048, 4096] as const;
export const storageTypes = [
  ["hdd", "HDD"],
  ["sata_ssd", "SATA SSD"],
  ["nvme_ssd", "NVMe SSD"],
  ["emmc", "eMMC"],
  ["other", "Other"],
] as const;
export const gpuTypes = [
  ["integrated", "Integrated"],
  ["dedicated", "Dedicated"],
  ["other", "Other"],
] as const;
export const gpuBrands = ["Intel", "AMD", "NVIDIA", "Apple", "Qualcomm", "Other"] as const;
export const screenSizes = [11.6, 12, 12.3, 13, 13.3, 13.6, 14, 14.2, 15, 15.6, 16, 16.2, 17, 17.3, 18] as const;
export const resolutions = [
  ["1366x768", "1366 × 768"],
  ["1920x1080", "1920 × 1080 (Full HD)"],
  ["1920x1200", "1920 × 1200"],
  ["2560x1440", "2560 × 1440 (QHD)"],
  ["2560x1600", "2560 × 1600"],
  ["2880x1800", "2880 × 1800"],
  ["3024x1964", "3024 × 1964"],
  ["3840x2160", "3840 × 2160 (4K)"],
] as const;
export const osFamilies = ["Windows", "macOS", "ChromeOS", "Linux", "None", "Other"] as const;
export const conditions = [
  ["new", "New"],
  ["like_new", "Like New"],
  ["excellent", "Excellent"],
  ["good", "Good"],
  ["fair", "Fair"],
  ["poor", "Poor"],
] as const;
export const provinces = [
  ["AB", "Alberta"], ["BC", "British Columbia"], ["MB", "Manitoba"],
  ["NB", "New Brunswick"], ["NL", "Newfoundland and Labrador"],
  ["NS", "Nova Scotia"], ["NT", "Northwest Territories"], ["NU", "Nunavut"],
  ["ON", "Ontario"], ["PE", "Prince Edward Island"], ["QC", "Quebec"],
  ["SK", "Saskatchewan"], ["YT", "Yukon"],
] as const;
