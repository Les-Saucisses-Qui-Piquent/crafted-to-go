import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { OrderItem } from "@/components/modals/OrderModal";

/**
 * Fusionne les items de commande avec les infos complètes des bières.
 * Si une bière n'est pas trouvée, elle affiche un warning et garde l'item sans enrichissement.
 *
 * @param orderItems - tableau d'items bruts (avec beer_id, quantity, etc.)
 * @param beers - liste complète des bières disponibles
 * @returns tableau d'items enrichis prêts à l'affichage
 */
export function mergeOrderItemsWithBeers(
  orderItems: OrderItem[],
  beers: BeerCardProps[],
): OrderItem[] {
  return orderItems.map((item) => {
    const beer = beers.find((b) => b.id === item.beer_id);
    if (!beer) {
      console.warn(`Bière introuvable pour beer_id ${item.beer_id}`);
      // Retourne quand même l'item avec total pour ne pas casser l'affichage
      return {
        ...item,
        total: (item.price * item.quantity).toFixed(2),
        name: "Bière inconnue",
        beer_style: { label: "Inconnu" },
        brewery: { name: "Inconnu" },
        color: "-",
        abv_rate: "-",
        price: item.price,
        image: "",
        description: "",
        breweryId: "",
        breweryName: "",
      };
    }
    return {
      ...item,
      ...beer,
      total: (item.price * item.quantity).toFixed(2),
    };
  });
}
