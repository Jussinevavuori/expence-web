import React from "react"
import { SettingsView } from "./SettingsView"
import { useStoreState, useStoreActions } from "../../store"
import { useRedirect } from "../../hooks/useRedirect"
import { useBooleanQueryState } from "../../hooks/useBooleanQueryState"

export type SettingsProps = {

}

export function Settings(props: SettingsProps) {
	const user = useStoreState(_ => _.auth.user)
	const logout = useStoreActions(_ => _.auth.logout)

	const [uploaderOpen, setUploaderOpen] = useBooleanQueryState("uploader", "open")

	const redirect = useRedirect()

	async function handleLogout() {
		const result = await logout()
		if (result.isSuccess()) {
			redirect(_ => _.login)
		}
	}

	if (!user) return null

	return <SettingsView
		uploaderOpen={uploaderOpen}
		onUploaderClose={() => setUploaderOpen(false)}
		onUploaderOpen={() => setUploaderOpen(true)}
		user={user}
		handleLogout={handleLogout}
	/>
}