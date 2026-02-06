import type { CoffeeShop, Post } from "@prisma/client";

export type CoffeeShopWithPosts = CoffeeShop & {
  posts: Post[];
}; 
