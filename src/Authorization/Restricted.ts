import { navigateTo } from '../main';
import { IUser } from '../types/authentication';

class Restricted {
	role: 'USER' | 'MERCHANT';
	constructor(role: 'USER' | 'MERCHANT') {
		this.role = role;
		const user = localStorage.getItem('user');
		this.authorizeUser(JSON.parse(user as string));
	}

	authorizeUser(user: IUser) {
		if (user.accessType !== this.role) {
			navigateTo(`/${user.accessType.toLowerCase()}`);
			window.location.replace(`/${user.accessType.toLowerCase()}`);
		}
		return;
	}
}

export default Restricted;
