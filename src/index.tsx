import "./styles/index.scss"
import "./styles/main.scss"
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { store } from './store';
import { StoreProvider } from 'easy-peasy';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "@material-ui/core";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { theme } from "./styles/theme";
import { LocalizedUtils } from "./utils/LocaleUtils/CustomLocale";
import ReactGA from "react-ga";

document.head.prepend((() => {
	const el = document.createElement("script")
	el.innerHTML = `
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag("js", new Date());
		gtag("config", "G-LVM2P76WDY");
	`
	return el
})())

// Initialize Google Analytics
export const GOOGLE_ANALYTICS_TRACKING_ID = "G-LVM2P76WDY";
ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_ID, { debug: true });

ReactDOM.render(
	<React.StrictMode>
		<StoreProvider store={store}>
			<ThemeProvider theme={theme}>
				<MuiPickersUtilsProvider
					utils={LocalizedUtils}
					locale={LocalizedUtils.Locale}
				>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</MuiPickersUtilsProvider>
			</ThemeProvider>
		</StoreProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

serviceWorker.register();
