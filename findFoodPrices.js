import  { foodPrices } from './foodPricesData.ts';

export function findFoodPrice(foodItem) {
    const originalPrice = foodPrices.filter(item => item.food === foodItem).totalPrice;
    const todayDate = new Date();
    const monthsSinceFebruary2026 = (todayDate.getFullYear() - 2026) * 12 + (todayDate.getMonth() - 1);
    const inflationRatePerMonth = 0.02;
    const adjustedPrice = originalPrice * Math.pow((1 + inflationRatePerMonth), monthsSinceFebruary2026);
    return adjustedPrice;

}

export function findFoodPrices(foodItems) {
    return foodItems.map(foodItem => ({
        food: foodItem,
        price: findFoodPrice(foodItem)
    }));
}