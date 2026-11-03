export function formatarSelo(value: string): string {
	if (!value) return "";

	// Keep only alphanumeric characters
	const cleaned = value.replace(/[^a-zA-Z0-9]/g, "");

	let part1 = ""; // first 3 digits
	let part2 = ""; // next 6 digits
	let suffix = ""; // up to 10 alphanumeric

	for (const ch of cleaned) {
		if (part1.length < 3) {
			// Only digits allowed in part1
			if (/\d/.test(ch)) part1 += ch;
			continue;
		}
		if (part2.length < 6) {
			// Only digits allowed in part2
			if (/\d/.test(ch)) part2 += ch;
			continue;
		}
		// Suffix accepts alphanumeric, up to 10, preserving case
		if (suffix.length < 10) suffix += ch;
	}

	let formatted = "";
	if (part1.length > 0) {
		formatted += part1;
		if (part1.length === 3 && (part2.length > 0 || suffix.length > 0)) formatted += "/";
	}
	if (part2.length > 0) {
		formatted += part2;
		if (part2.length === 6 && suffix.length > 0) formatted += "-";
	}
	if (suffix.length > 0) {
		formatted += suffix;
	}
	return formatted;
} 