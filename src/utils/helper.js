import moment from "moment";

// CURRENCY CONVERTER / HELPER FORMATTER
export function currencyConverter(amount) {
	return Number(amount)
		.toFixed(2)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function numberConverter(amount) {
	return Number(amount)
		.toFixed(0)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function numberConverterSticker(amount) {
	return Number(amount)
		.toFixed(1)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function calcTotalAmount(amount) {
	let charges;
	const calcChargesAmount = (3 / 100) * amount;
	if (calcChargesAmount > 3000) {
		charges = 3000;
	} else {
		charges = calcChargesAmount;
	}
	console.log(charges, amount + charges);
	return amount + charges;
}

// DATE CONVERTER HELPER FUNCTION
// export function dateConverter(givenDate) {
// 	const currentDate = moment().startOf("day");
// 	const inputDate = moment(givenDate);

// 	if (inputDate.isSame(currentDate, "day")) {
// 		const diffInMins = moment().diff(inputDate, "minutes");
// 		if (diffInMins < 60) {
// 			return `${diffInMins} minute ago`;
// 		} else {
// 			return `Today, ${inputDate.format("h:mm A")}`;
// 		}
// 	} else if (inputDate.isSame(currentDate.clone().subtract(1, "day"), "day")) {
// 		return `Yesterday, ${inputDate.format("h:mm A")}`;
// 	} else if (inputDate.isSame(currentDate.clone().subtract(2, "day"), "day")) {
// 		return `Two days ago`;
// 	} else if (inputDate.isAfter(currentDate)) {
// 		const diffInDays = inputDate.diff(currentDate, "days");
// 		if (diffInDays === 1) {
// 			return `Tomorrow`;
// 		} else {
// 			return `In ${diffInDays} days`;
// 		}
// 	} else {
// 		return inputDate.format("MMM Do YYYY");
// 	}
// }


export function dateConverter(givenDate) {
	const currentDate = moment().startOf("day");
	const inputDate = moment(givenDate);

	const diffInSeconds = moment().diff(inputDate, "seconds");
	if (diffInSeconds === 0) {
		return "Just now";
	}
	if (diffInSeconds < 60) {
		return `${diffInSeconds} secs ago`;
	}

	const diffInMins = moment().diff(inputDate, "minutes");
	if (diffInMins < 60) {
		return `${diffInMins} mins. ago`;
	}
	if (inputDate.isSame(currentDate, "day")) {
		return `Today, ${inputDate.format("h:mm A")}`;
	} else if (inputDate.isSame(currentDate.clone().subtract(1, "day"), "day")) {
		return `Yesterday, ${inputDate.format("h:mm A")}`;
	} else if (inputDate.isSame(currentDate.clone().subtract(2, "day"), "day")) {
		return `Two days ago, ${inputDate.format("h:mm A")}`;
	} else {
		return inputDate.format("MMM Do YYYY");
	}
}

export function expectedDateFormatter(givenDate) {
	const currentDate = moment().startOf("day");
	const inputDate = moment(givenDate);

	if (inputDate.isSame(currentDate, "day")) {
		return "Today";
	} else if (inputDate.isBefore(currentDate)) {
		return "Date Passed";
	} else {
		const diffInDays = inputDate.diff(currentDate, "days", true);

		if (diffInDays >= 365) {
			const years = Math.floor(diffInDays / 365);
			return `In ${years} year${years > 1 ? "s" : ""}`;
		} else if (diffInDays >= 30) {
			const months = Math.floor(diffInDays / 30);
			return `In ${months} month${months > 1 ? "s" : ""}`;
		} else if (diffInDays >= 1) {
			return `In ${Math.floor(diffInDays)} day${diffInDays > 1 ? "s" : ""}`;
		} else {
			const diffInHours = inputDate.diff(currentDate, "hours", true);
			if (diffInHours >= 1) {
				return `In ${Math.floor(diffInHours)} hour${diffInHours > 1 ? "s" : ""}`;
			} else {
				const diffInMinutes = inputDate.diff(currentDate, "minutes", true);
				return `In ${Math.floor(diffInMinutes)} minute${diffInMinutes > 1 ? "s" : ""}`;
			}
		}
	}
}

export function calculatePercentage(totalAmount, accumulatedAmount) {
	if (accumulatedAmount === 0) {
		return 0;
	}
	if (accumulatedAmount >= totalAmount) {
		return 100;
	}
	const percentage = (accumulatedAmount / totalAmount) * 100;
	return percentage.toFixed(1);
}

export function formatDate(dateString) {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

export function capitalizeFirstLetter(string) {
    return string?.slice(0, 1)?.toUpperCase() + string?.slice(1);
}


export function getInitials(fullName) {
    const nameArray = fullName.split(' ');
    if (nameArray?.length > 1) {
		const firstInitial = nameArray[0].charAt(0);
        const secondInitial = nameArray[1].charAt(0);
        return `${firstInitial}${secondInitial}`;
    }
	if (nameArray?.length === 1) {
        return nameArray[0].charAt(0);
    }
}


export function truncate(input, num=30) {
    if (input?.length > num) {
        return input.substring(0, num) + "...";
    } else {
        return input;
    }
}
