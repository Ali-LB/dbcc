import type { CoffeeShop, Post } from "@/generated/prisma";

export type CoffeeShopWithPosts = CoffeeShop & {
  posts: Post[];
}; 