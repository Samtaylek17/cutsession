import AbstractView from '../../AbstractView';
import { setFormMessage } from '../../helpers';

export default class extends AbstractView {
	constructor(params: Record<string, any>) {
		super(params);
		this.setTitle('Login');
	}

	scripts() {
		const loginForm = document.querySelector('#loginForm');

		/* The above code is a login form that is using the fetch API to send a POST request to the server. */
		loginForm!.addEventListener('submit', (e) => {
			e.preventDefault();

			const username = (<HTMLInputElement>document.querySelector('#username'))!.value;
			const password = (<HTMLInputElement>document.querySelector('#password'))!.value;
			const accessType = (<HTMLInputElement>document.querySelector('input[name="accessType"]:checked'))!.value;

			console.log(accessType);
			const data = { username, password, accessType };

			const options = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Prefer: 'code=200, dynamic=true' },
				body: JSON.stringify(data),
			};

			fetch('https://stoplight.io/mocks/pipeline/pipelinev2-projects/111233856/sign-in', options)
				.then((response) => response.json())
				.then((response) => {
					if (response.token) {
						const userData = JSON.stringify({ accessType, ...response });
						window.localStorage.setItem('user', userData);
						const url = new URL(window.location.href);
						if (accessType === 'USER') {
							const nextRoute = url.searchParams.get('redirect') || '/';
							window.location.replace(nextRoute);
						} else {
							const nextRoute = url.searchParams.get('redirect') || '/merchant';
							window.location.replace(nextRoute);
						}
					} else {
						setFormMessage(loginForm, 'error', response.message);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		});
	}

	async render() {
		return `
      <section class="bg-blue-400 min-h-screen py-16 flex justify-center items-center px-4">
        <form id="loginForm" class="userForm bg-white max-w-md w-full mx-auto px-4 py-8 rounded-xl sm:px-8">
          <h1 class="text-2xl text-center">Login</h1>
          <div class="text-red-500 mt-4 form__message form__message--error"></div>
          <div class="mt-4 flex flex-col gap-[1px]">
            <label for="username" class="text-sm text-gray-800 mb-4">Username</label>
            <input type="text" name="username" id="username" placeholder="username" class="w-full p-3 border rounded-lg form__input" data-username />
            <span class="form__input-error-message text-red-500 text-sm"></span>
          </div>
          <div class="mt-4 flex flex-col gap-[1px]">
            <label for="password" class="text-sm text-gray-800 mb-4">Password</label>
            <input type="password" name="password" id="password" placeholder="......." class="w-full p-3 border rounded-lg form__input placeholder:text-3xl" data-password />
            <span class="form__input-error-message text-red-500 text-sm"></span>
          </div>
          <div class="mt-4">
            <h5 class="text-sm text-gray-800">Access Type</h5>
            <div class="flex gap-8 mt-3">
              <label class="flex gap-3 text-gray-800 text-sm cursor-pointer">
                <input type="radio" name="accessType" value="USER" checked />
                User
              </label>
              <label class="flex gap-3 text-gray-800 text-sm cursor-pointer">
                <input type="radio" name="accessType" value="MERCHANT" />
                Merchant
              </label>
            </div>
          </div>
          <div class="mt-6">
            <button type="submit" class="w-full bg-blue-600 p-3 text-base text-white rounded-lg">
              Login
            </button>
          </div>
          <div class="mt-6">
            <p class="text-center">Don't have an account?
              <a class="text-blue-500" href="/signup" data-link>Signup here</a>
            </p>
          </div>
        </form>
      </section> 
    `;
	}
}
