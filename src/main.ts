import './style.css';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import User from './pages/User';
import Sessions from './pages/Sessions';
import Merchant from './pages/Merchant';
import CreateSession from './pages/Sessions/createSession';
import Book from './pages/Bookings/book';
import Bookings from './pages/Bookings/bookingList';
import MerchantBookings from './pages/Bookings/merchantBookings';

const pathToRegex = (path: string) => new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

const getParams = (match: { route: { path: string; component: any }; result: RegExpMatchArray | null }) => {
	const values = match!.result!.slice(1);
	const keys = Array.from(match!.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]);

	return Object.fromEntries(
		keys.map((key, i) => {
			return [key, values[i]];
		})
	);
};

export const navigateTo = (url: string | URL | null | undefined) => {
	history.pushState(null, '', url);
	router();
};

const router = async () => {
	const routes = [
		{ path: '/user', component: User },
		{ path: '/', component: HomePage },
		{ path: '/login', component: Login },
		{ path: '/signup', component: Signup },
		{ path: '/studio/:merchantId', component: Sessions },
		{ path: '/merchant', component: Merchant },
		{ path: '/session/create', component: CreateSession },
		{ path: '/session/:sessionId/book', component: Book },
		{ path: '/session/bookings', component: Bookings },
		{ path: '/merchant/bookings', component: MerchantBookings },
	];

	const potentialMatches = routes.map((route) => {
		return {
			route: route,
			result: location.pathname.match(pathToRegex(route.path)),
		};
	});

	let match = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);

	if (!match) {
		match = {
			route: routes[0],
			result: [location.pathname],
		};
	}

	const view = new match.route.component(getParams(match));

	document.querySelector<HTMLDivElement>('#app')!.innerHTML = await view.render();

	view.scripts();
};

/* It's listening for the popstate event, which is fired when the user navigates to a new page. */
window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
	document.body.addEventListener('click', (e) => {
		if ((<HTMLLinkElement>e.target!).matches('[data-link]')) {
			e.preventDefault();
			navigateTo((<HTMLLinkElement>e!.target!).href);
		}
	});

	router();
});

document.addEventListener('DOMContentLoaded', () => {
	const logoutBtn = document.querySelector<HTMLButtonElement>('#logout-btn')!;

	if (logoutBtn)
		logoutBtn!.addEventListener('click', () => {
			localStorage.removeItem('user');
			window.location.replace(`/login`);
		});
});
