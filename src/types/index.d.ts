export interface IUser {
	merchantId: string;
	token: string;
	userId: string;
	accessType: 'USER' | 'MERCHANT';
}
