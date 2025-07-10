import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const otp = url.searchParams.get('otp');
	return {
		otp
	};
};
