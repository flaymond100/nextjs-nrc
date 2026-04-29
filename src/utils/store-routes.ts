export function getDashboardStoreHref(storeName: string): string {
  switch (storeName) {
    case "endurance_store":
      return "/dashboard/4endurance-store";
    case "socks_store":
      return "/dashboard/apparel-store";
    case "vittoria_store":
      return "/dashboard/vittoria-store";
    default:
      return `/dashboard/store?store=${storeName}`;
  }
}
