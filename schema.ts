import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey(),
  cafeName: text("cafe_name").notNull().default("KINTOUN Coffee Malang Galunggung"),
  tagline: text("tagline").notNull().default("Coffee in hand, the world's at ease."),
  heroTitle: text("hero_title").notNull().default("KINTOUN Coffee"),
  heroSubtitle: text("hero_subtitle").notNull().default("Malang • Galunggung"),
  heroDescription: text("hero_description").notNull().default(""),
  heroImageUrl: text("hero_image_url").notNull().default(""),
  aboutTitle: text("about_title").notNull().default("Tentang KINTOUN"),
  aboutDescription: text("about_description").notNull().default(""),
  aboutImageUrl: text("about_image_url").notNull().default(""),
  address: text("address").notNull().default(""),
  phone: text("phone").notNull().default("0851-9989-0010"),
  whatsapp: text("whatsapp").notNull().default("6285199890010"),
  mapsUrl: text("maps_url").notNull().default(""),
  plusCode: text("plus_code").notNull().default(""),
  priceRange: text("price_range").notNull().default("Rp1–25.000 per orang"),
  hoursWeekday: text("hours_weekday").notNull().default(""),
  hoursWeekend: text("hours_weekend").notNull().default(""),
  hoursNote: text("hours_note").notNull().default("Tutup pukul 22.00 • Jam buka dikonfirmasi di lokasi"),
  instagramUrl: text("instagram_url").notNull().default(""),
  tiktokUrl: text("tiktok_url").notNull().default(""),
  facebookUrl: text("facebook_url").notNull().default(""),
  seoTitle: text("seo_title").notNull().default("KINTOUN Coffee Malang Galunggung — Coffee Shop di Malang"),
  seoDescription: text("seo_description").notNull().default(""),
  logoUrl: text("logo_url").notNull().default("/logo-kintoun.svg"),
  logoDarkUrl: text("logo_dark_url").notNull().default("/logo-kintoun-white.svg"),
  faviconUrl: text("favicon_url").notNull().default("/favicon.svg"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const menuCategories = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  price: integer("price").notNull().default(0),
  originalPrice: integer("original_price"),
  categoryId: integer("category_id"),
  categoryName: text("category_name").notNull().default("Coffee"),
  imageUrl: text("image_url").notNull().default(""),
  isAvailable: boolean("is_available").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  badge: text("badge").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  storagePath: text("storage_path").notNull().default(""),
  title: text("title").notNull().default(""),
  caption: text("caption").notNull().default(""),
  altText: text("alt_text").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  fileSize: integer("file_size").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
