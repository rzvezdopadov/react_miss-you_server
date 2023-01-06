export function getSignZodiac(birthday: number, monthofbirth: number) {
	birthday = Number(birthday);
	monthofbirth = Number(monthofbirth);

	if (!birthday && !monthofbirth) return 12;

	if (
		(birthday > 20 && monthofbirth === 3) ||
		(birthday < 21 && monthofbirth === 4)
	)
		return 0;
	if (
		(birthday > 20 && monthofbirth === 4) ||
		(birthday < 22 && monthofbirth === 5)
	)
		return 1;
	if (
		(birthday > 21 && monthofbirth === 5) ||
		(birthday < 22 && monthofbirth === 6)
	)
		return 2;
	if (
		(birthday > 21 && monthofbirth === 6) ||
		(birthday < 23 && monthofbirth === 7)
	)
		return 3;
	if (
		(birthday > 22 && monthofbirth === 7) ||
		(birthday < 22 && monthofbirth === 8)
	)
		return 4;
	if (
		(birthday > 21 && monthofbirth === 8) ||
		(birthday < 24 && monthofbirth === 9)
	)
		return 5;
	if (
		(birthday > 23 && monthofbirth === 9) ||
		(birthday < 24 && monthofbirth === 10)
	)
		return 6;
	if (
		(birthday > 23 && monthofbirth === 10) ||
		(birthday < 23 && monthofbirth === 11)
	)
		return 7;
	if (
		(birthday > 22 && monthofbirth === 11) ||
		(birthday < 23 && monthofbirth === 12)
	)
		return 8;
	if (
		(birthday > 22 && monthofbirth === 12) ||
		(birthday < 21 && monthofbirth === 1)
	)
		return 9;
	if (
		(birthday > 20 && monthofbirth === 1) ||
		(birthday < 20 && monthofbirth === 2)
	)
		return 10;
	if (
		(birthday > 19 && monthofbirth === 2) ||
		(birthday < 21 && monthofbirth === 3)
	)
		return 11;
}
