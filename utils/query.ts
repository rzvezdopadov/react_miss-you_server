export const conditionStr = (queryStr: string, param: any) => {
	return param
		? `(${queryStr} = ${param}) AND `
		: `((${queryStr} <> ${param}) OR (${queryStr} = 0)) AND `;
};
