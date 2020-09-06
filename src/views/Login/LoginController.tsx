import React from 'react';
import { LoginView } from './LoginView';
import * as yup from "yup"
import { useStoreActions } from '../../store';
import { useRedirect } from '../../hooks/useRedirect';

export const loginValidationSchema = yup.object({
	email: yup.string().defined().min(3).max(255).email(),
	password: yup.string().defined().min(3).max(255),
}).defined()

export type LoginFormType = yup.InferType<typeof loginValidationSchema>

export const LoginController: React.FC<{}> = () => {

	const redirect = useRedirect()

	const loginWithGoogle = useStoreActions(_ => _.auth.loginWithGoogle)
	const loginWithEmailPassword = useStoreActions(_ => _.auth.loginWithEmailPassword)
	const forgotPassword = useStoreActions(_ => _.auth.forgotPassword)

	async function handleSubmit(values: LoginFormType) {
		try {
			await loginWithEmailPassword(values)
			redirect(routes => routes.dashboard)
		} catch (error) {
			console.error(error)
		}
	}

	async function handleGoogleSubmit() {
		loginWithGoogle()
	}

	async function handleForgotPassword(values: Pick<LoginFormType, "email">) {
		try {
			await forgotPassword(values)
		} catch (error) {
			console.error(error)
		}
	}

	async function handleCreateAccount() {
		redirect(_ => _.register)
	}

	return <LoginView {...{
		handleGoogleSubmit,
		handleSubmit,
		handleForgotPassword,
		handleCreateAccount
	}} />
}