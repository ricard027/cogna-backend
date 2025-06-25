/**
 * @fileoverview Script to seed the database with initial product data
 */

const database = require("../src/config/database");
const Product = require("../src/models/product");

const sampleProducts = [
  {
    name: "Smartphone Galaxy Pro",
    price: 2499.99,
    description:
      "Smartphone premium com câmera de 108MP e tela AMOLED de 6.7 polegadas",
    image: "/placeholder.svg?height=400&width=400",
    category: "Eletrônicos",
    inStock: true,
    rating: 4.8,
    reviews: 1247,
    specifications: {
      display: '6.7" AMOLED',
      camera: "108MP + 12MP + 12MP",
      battery: "5000mAh",
      storage: "256GB",
      ram: "12GB",
    },
  },
  {
    name: "Notebook UltraBook Air",
    price: 3299.99,
    description: "Notebook ultrafino com processador Intel i7 e 16GB de RAM",
    image: "/placeholder.svg?height=400&width=400",
    category: "Computadores",
    inStock: true,
    rating: 4.6,
    reviews: 892,
    specifications: {
      processor: "Intel Core i7",
      ram: "16GB DDR4",
      storage: "512GB SSD",
      display: '14" Full HD',
      weight: "1.2kg",
    },
  },
  {
    name: "Headphone Wireless Pro",
    price: 899.99,
    description: "Fone de ouvido sem fio com cancelamento de ruído ativo",
    image: "/placeholder.svg?height=400&width=400",
    category: "Áudio",
    inStock: false,
    rating: 4.9,
    reviews: 2156,
    specifications: {
      connectivity: "Bluetooth 5.0",
      battery: "30h com ANC",
      drivers: "40mm",
      weight: "250g",
      features: "ANC, Quick Charge",
    },
  },
  {
    name: "Smart TV 4K OLED",
    price: 4599.99,
    description: "Smart TV 55 polegadas com tecnologia OLED e HDR10+",
    image: "/placeholder.svg?height=400&width=400",
    category: "TV & Home",
    inStock: true,
    rating: 4.7,
    reviews: 634,
    specifications: {
      size: "55 polegadas",
      resolution: "4K OLED",
      hdr: "HDR10+, Dolby Vision",
      os: "Android TV",
      connectivity: "Wi-Fi, Bluetooth, 4x HDMI",
    },
  },
  {
    name: "Câmera Mirrorless Alpha",
    price: 5299.99,
    description: "Câmera mirrorless profissional com sensor full-frame de 24MP",
    image: "/placeholder.svg?height=400&width=400",
    category: "Fotografia",
    inStock: true,
    rating: 4.9,
    reviews: 445,
    specifications: {
      sensor: "24MP Full-Frame",
      video: "4K 60fps",
      iso: "100-51200",
      stabilization: "5-axis IBIS",
      mount: "E-mount",
    },
  },
  {
    name: 'Tablet Pro 12.9"',
    price: 1899.99,
    description:
      "Tablet profissional com tela Liquid Retina e suporte a Apple Pencil",
    image: "/placeholder.svg?height=400&width=400",
    category: "Tablets",
    inStock: true,
    rating: 4.8,
    reviews: 1089,
    specifications: {
      display: '12.9" Liquid Retina',
      chip: "M2",
      storage: "128GB",
      connectivity: "Wi-Fi 6E",
      accessories: "Apple Pencil, Magic Keyboard",
    },
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    await database.connect();

    const collection = database.getDb().collection("products");
    await collection.deleteMany({});
    console.log("🗑️  Cleared existing products");

    const result = await collection.insertMany(sampleProducts);
    console.log(`✅ Inserted ${result.insertedCount} products`);

    const products = await collection.find({}).toArray();
    console.log("\n📦 Products in database:");
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - R$ ${product.price}`);
    });

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
  } finally {
    await database.close();
    process.exit(0);
  }
}

// Run seeding
seedDatabase();
