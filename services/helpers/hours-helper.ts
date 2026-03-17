interface OpeningHoursPeriod {
    open: {
        day: number;  // 0-6 (Sunday=0)
        hour: number;
        minute: number;
        date?: {
            year: number;
            month: number;
            day: number;
        }
    };
    close: {
        day: number;
        hour: number;
        minute: number;
        date?: {
            year: number;
            month: number;
            day: number;
        }
    };
}

interface OpeningHoursResponse {
    openNow?: boolean;
    periods?: OpeningHoursPeriod[];
    weekdayDescriptions?: string[];
    nextCloseTime?: string;
}

interface HoursResult {
    isOpen: boolean;
    hoursUntilClose?: number;
    hoursUntilOpen?: number;
    nextCloseTime?: string;
    nextOpenTime?: string | null;
    status: 'open' | 'closed' | 'unknown';
    message: string;
}

/**
 * Determines if a store is open based on current time and Google Places API hours data
 * @param currentDateTime Current date and time
 * @param hoursData The regularOpeningHours or currentOpeningHours object from Google Places API
 * @returns Object with open status and time information
 */
export const determineStoreHours = (
    currentDateTime: Date,
    hoursData: OpeningHoursResponse | null | undefined
): HoursResult => {
    // Default response if no hours data available
    if (!hoursData || !hoursData.periods || hoursData.periods.length === 0) {
        return {
            isOpen: false,
            status: 'unknown',
            message: 'Hours not available'
        };
    }

    // If openNow is provided, use it (most reliable)
    if (hoursData.openNow !== undefined) {
        // If we have nextCloseTime, calculate hours until close
        if (hoursData.openNow && hoursData.nextCloseTime) {
            const nextClose = new Date(hoursData.nextCloseTime);
            const hoursUntilClose = (nextClose.getTime() - currentDateTime.getTime()) / (1000 * 60 * 60);

            return {
                isOpen: true,
                hoursUntilClose: Math.max(0, hoursUntilClose),
                nextCloseTime: hoursData.nextCloseTime,
                status: 'open',
                message: `Open - Closes in ${formatHours(hoursUntilClose)}`
            };
        }

        // If closed, we need to find next open time
        if (!hoursData.openNow) {
            const nextOpenInfo = findNextOpenTime(currentDateTime, hoursData.periods);

            return {
                isOpen: false,
                hoursUntilOpen: nextOpenInfo.hoursUntil,
                nextOpenTime: nextOpenInfo.nextTime,
                status: 'closed',
                message: `Closed - Opens ${nextOpenInfo.nextTime ? 'in ' + formatHours(nextOpenInfo.hoursUntil) : 'later'}`
            };
        }
    }

    // If openNow not provided, calculate from periods
    return calculateFromPeriods(currentDateTime, hoursData.periods);
};

/**
 * Calculate open/closed status from periods array
 */
const calculateFromPeriods = (
    currentDateTime: Date,
    periods: OpeningHoursPeriod[]
): HoursResult => {
    const currentDay = currentDateTime.getDay(); // 0-6 (Sunday=0)
    const currentHour = currentDateTime.getHours();
    const currentMinute = currentDateTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Check if currently open by looking at all periods
    for (const period of periods) {
        // Handle regular weekly hours (no date)
        if (!period.open.date) {
            if (period.open.day === currentDay) {
                const openMinutes = period.open.hour * 60 + period.open.minute;
                const closeMinutes = period.close.hour * 60 + period.close.minute;

                // Handle overnight hours (close day > open day)
                if (period.close.day > period.open.day) {
                    // Currently in overnight period
                    if (currentTimeInMinutes >= openMinutes) {
                        // Calculate hours until close (might be next day)
                        const minutesUntilClose = (24 * 60 - currentTimeInMinutes) + closeMinutes;
                        return {
                            isOpen: true,
                            hoursUntilClose: minutesUntilClose / 60,
                            status: 'open',
                            message: 'Open (overnight hours)'
                        };
                    }
                }
                // Regular same-day hours
                else if (currentTimeInMinutes >= openMinutes && currentTimeInMinutes < closeMinutes) {
                    const minutesUntilClose = closeMinutes - currentTimeInMinutes;
                    return {
                        isOpen: true,
                        hoursUntilClose: minutesUntilClose / 60,
                        status: 'open',
                        message: 'Open'
                    };
                }
            }
        }
        // Handle special hours (with specific dates)
        else {
            if(period.close.date === undefined || period.open.date === undefined) {
                continue; // Skip if date information is missing
            }
            const openDate = new Date(
                period.open.date.year,
                period.open.date.month - 1, // Month is 0-indexed in JS
                period.open.date.day,
                period.open.hour,
                period.open.minute
            );

            const closeDate = new Date(
                period.close.date.year,
                period.close.date.month - 1,
                period.close.date.day,
                period.close.hour,
                period.close.minute
            );

            if (currentDateTime >= openDate && currentDateTime < closeDate) {
                const minutesUntilClose = (closeDate.getTime() - currentDateTime.getTime()) / (1000 * 60);
                return {
                    isOpen: true,
                    hoursUntilClose: minutesUntilClose / 60,
                    nextCloseTime: closeDate.toISOString(),
                    status: 'open',
                    message: 'Open (special hours)'
                };
            }
        }
    }

    // If not open, find next opening time
    const nextOpenInfo = findNextOpenTime(currentDateTime, periods);

    return {
        isOpen: false,
        hoursUntilOpen: nextOpenInfo.hoursUntil,
        nextOpenTime: nextOpenInfo.nextTime,
        status: 'closed',
        message: `Closed - Opens ${nextOpenInfo.nextTime ? 'in ' + formatHours(nextOpenInfo.hoursUntil) : 'later'}`
    };
};

/**
 * Find the next time the store opens
 */
const findNextOpenTime = (
    currentDateTime: Date,
    periods: OpeningHoursPeriod[]
): { hoursUntil: number; nextTime: string | null } => {
    const now = currentDateTime.getTime();
    let nextOpenTime: Date | null = null;

    for (const period of periods) {
        // Handle regular weekly hours
        if (!period.open.date) {
            const nextDate = getNextDateForDay(currentDateTime, period.open.day);
            nextDate.setHours(period.open.hour, period.open.minute, 0, 0);

            if (nextDate.getTime() > now) {
                if (!nextOpenTime || nextDate < nextOpenTime) {
                    nextOpenTime = nextDate;
                }
            }
        }
        // Handle special hours with dates
        else {
            const openDate = new Date(
                period.open.date.year,
                period.open.date.month - 1,
                period.open.date.day,
                period.open.hour,
                period.open.minute
            );

            if (openDate.getTime() > now) {
                if (!nextOpenTime || openDate < nextOpenTime) {
                    nextOpenTime = openDate;
                }
            }
        }
    }

    if (nextOpenTime) {
        const hoursUntil = (nextOpenTime.getTime() - now) / (1000 * 60 * 60);
        return { hoursUntil, nextTime: nextOpenTime.toISOString() };
    }

    return { hoursUntil: 0, nextTime: null };
};

/**
 * Helper to get the next occurrence of a specific day
 */
const getNextDateForDay = (currentDate: Date, targetDay: number): Date => {
    const result = new Date(currentDate);
    const currentDay = currentDate.getDay();
    let daysToAdd = targetDay - currentDay;

    if (daysToAdd <= 0) {
        daysToAdd += 7; // Next week
    }

    result.setDate(result.getDate() + daysToAdd);
    return result;
};

/**
 * Format hours in a human-readable way
 */
const formatHours = (hours: number): string => {
    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    if (hours < 24) {
        return `${Math.round(hours * 10) / 10} hour${Math.round(hours) !== 1 ? 's' : ''}`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = Math.round((hours % 24) * 10) / 10;
    return `${days} day${days !== 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours} hours` : ''}`;
};

/**
 * Simplified version if you just need basic open/closed status
 */
export const isStoreOpen = (
    currentDateTime: Date,
    hoursData: OpeningHoursResponse | null | undefined
): boolean => {
    if (!hoursData) return false;

    // Use openNow if available
    if (hoursData.openNow !== undefined) {
        return hoursData.openNow;
    }

    // Otherwise calculate from periods
    const result = determineStoreHours(currentDateTime, hoursData);
    return result.isOpen;
};