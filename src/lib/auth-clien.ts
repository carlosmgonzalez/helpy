import { createAuthClient } from 'better-auth/svelte';
export const authClient = createAuthClient();

export const signInWithGoogle = async () => {
	await authClient.signIn.social({
		provider: 'google'
	});
};

interface PropsSignUpWithEmail {
	email: string;
	password: string;
	name: string;
	image: string;
	callbackURL: string;
}

export const signUpWithEmail = async ({
	email,
	password,
	name,
	image,
	callbackURL
}: PropsSignUpWithEmail) => {
	await authClient.signUp.email({
		email,
		password,
		name,
		image,
		callbackURL
	});
};
