import { IUser } from '../types/authentication';

class Protected {
	constructor() {
		document.querySelector('#app')!.innerHTML = '';
		const user = localStorage.getItem('user');
		this.validateAuth(JSON.parse(user as string));
	}

	validateAuth(user: IUser) {
		if (user === null || !user.token || user.token === null) {
			window.location.replace('/login');
		}
		return;
	}

	logout() {
		localStorage.removeItem('user');
		window.location.replace('/login');
	}
}

export function navigateAwayFromAuth() {
	const user = JSON.parse(localStorage.getItem('user') as string);

	if (user && user.token !== null && user.token !== undefined) {
		window.location.replace(`/`);
	}
	return;
}

export default Protected;
