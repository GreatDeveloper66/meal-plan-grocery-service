//Given: current date and time, and the operating hours of a grocery store, determine if the store is currently open or closed and if open the hours left till closing time, if closed the hours until opening time.
export const determineOpenOrClosedBasedOnCurrentTimeAndOperatingHours = (
    currentDateTime: Date,
    operatingHours: { open: Date; close: Date }[]
): { isOpen: boolean; hoursUntilClose?: number; hoursUntilOpen?: number } => {
    const currentTime = currentDateTime.getHours() + currentDateTime.getMinutes() / 60;
    //determine if current time is within any of the operating hours
    for (const hours of operatingHours) {
        const openTime = hours.open.getHours() + hours.open.getMinutes() / 60;
        const closeTime = hours.close.getHours() + hours.close.getMinutes() / 60;
        if (currentTime >= openTime && currentTime < closeTime) {
            //store is open, calculate hours until close
            const hoursUntilClose = closeTime - currentTime;
            return { isOpen: true, hoursUntilClose };
        }
        if (currentTime < openTime) {
            //store is closed, calculate hours until open
            const hoursUntilOpen = openTime - currentTime;
            return { isOpen: false, hoursUntilOpen };
        }
    }
    //if current time is after all operating hours, calculate hours until next open time
    const nextOpenTime = operatingHours[0].open.getHours() + operatingHours[0].open.getMinutes() / 60;
    const hoursUntilNextOpen = (24 - currentTime) + nextOpenTime;
    return { isOpen: false, hoursUntilOpen: hoursUntilNextOpen };
}

