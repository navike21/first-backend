export const urlValidate = (url: string): boolean => {
	const urlPattern = new RegExp(
		String.raw`^(https?:\/\/)?` + // protocol
			String.raw`((([a-z0-9-]+\.)+[a-z]{2,})|` + // domain name
			String.raw`((\d{1,3}\.){3}\d{1,3}))`, // OR ip (v4) address
		'i',
	);
	return urlPattern.test(url);
};
