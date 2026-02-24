//Calculate price of a food item based on its name and quantity from local food_prices.ts json data file
import { foodPrices } from "../../data/foods_prices";

export const calculateFoodPrice = (foodName: string, quantity: number): number => {
    const foodItem = foodPrices.find(item => item.food.toLowerCase() === foodName.toLowerCase());
    if (!foodItem) {
        throw new Error(`Food item "${foodName}" not found in price list.`);
    }
    return foodItem.unit_price * quantity;
}
