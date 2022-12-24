import AbstractView from '../../AbstractView';
import { setInputError, setFormMessage, clearInputError } from '../../helpers';

export default class extends AbstractView {
	constructor(params: Record<string, any>) {
		super(params);
		this.setTitle('Signup');
	}

	scripts() {
		const userForm = <HTMLFormElement>document.querySelector('#register');

		const phoneNumber = document.querySelector('#phone');

		phoneNumber!.addEventListener('input', (event: any) => {
			const newValue = event!.target!.value.replace(new RegExp(/[^\d]/, 'ig'), '');
			event!.target!.value = newValue;
		});

		const accessTypes: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="accessType"]');

		let accessType: HTMLInputElement;

		for (accessType of accessTypes) {
			(<HTMLInputElement>accessType)!.addEventListener('change', (event: any) => {
				if (event!.target!.value === 'MERCHANT') {
					document.querySelector('#dob-container')!.classList.add('hidden');
					document.querySelector('#residence-container')!.classList.add('hidden');
					document.querySelector('#operation-container')!.classList.remove('hidden');
					document.querySelector('#operation-container')!.classList.add('flex');
					document.querySelector('#form-title')!.innerHTML = 'Merchant Signup';
				}
				if (event!.target!.value === 'USER') {
					document.querySelector('#dob-container')!.classList.remove('hidden');
					document.querySelector('#residence-container')!.classList.remove('hidden');
					document.querySelector('#operation-container')!.classList.add('hidden');
					document.querySelector('#form-title')!.innerHTML = 'User Signup';
				}
			});
		}

		userForm!.addEventListener('submit', (e) => {
			e.preventDefault();

			const name = (<HTMLInputElement>document.querySelector('#name'))!.value;
			const email = (<HTMLInputElement>document.querySelector('#email'))!.value;
			const cityOfResidence = (<HTMLInputElement>document.querySelector('#cityofresidence'))!.value;
			const cityOfOperation = (<HTMLInputElement>document.querySelector('#cityofoperation'))!.value;
			const phoneNumber = (<HTMLInputElement>document.querySelector('#phone'))!.value;
			const dob = (<HTMLInputElement>document.querySelector('#date'))!.value;
			const username = (<HTMLInputElement>document.querySelector('#username'))!.value;
			const password = (<HTMLInputElement>document.querySelector('#password'))!.value;
			const userType = (<HTMLInputElement>document.querySelector('input[name="accessType"]:checked'))!.value;
			const metadata = {};

			document.querySelectorAll('.form__input').forEach((inputElement: any) => {
				if (inputElement.value.length === 0) {
					setInputError(inputElement, 'Required');
				}
			});

			if (userType === 'USER') {
				const data = { name, email, cityOfResidence, dob, phoneNumber, username, password, metadata };

				// Perform your Fetch signup
				const options = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				};

				fetch('https://stoplight.io/mocks/pipeline/pipelinev2-projects/111233856/register/users', options)
					.then((response) => response.json())
					.then((response) => {
						if (response.userId) {
							window.location.replace('/login');
						}
						setFormMessage(userForm, 'error', response.message);
					})
					.catch((err) => {
						console.log(err);
						setFormMessage(userForm, 'error', err.response.message);
					});

				userForm!.reset();
			} else {
				const data = { name, email, cityOfOperation, phoneNumber, username, password, metadata };

				const options = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				};

				fetch('https://stoplight.io/mocks/pipeline/pipelinev2-projects/111233856/register/merchants', options)
					.then((response) => response.json())
					.then((response) => {
						if (response.userId) {
							window.location.replace('/login');
						}
						setFormMessage(userForm, 'error', response.message);
					})
					.catch((err) => {
						console.log(err);
						setFormMessage(userForm, 'error', err.response.message);
					});
			}
		});

		document.querySelectorAll('.form__input').forEach((inputElement: any) => {
			inputElement.addEventListener('blur', (e: any) => {
				if (e!.target!.id === 'password' && e!.target?.value!.length > 0 && e.target.value.length < 6) {
					setInputError(inputElement, 'Password must be at least 8 characters in length');
				}

				if ((e!.target!.id === 'name' && e!.target!.value.length <= 2) || e!.target!.value.length >= 25) {
					setInputError(inputElement, 'Name must be more than two characters and less than 25 characters');
				}

				if (e!.target!.id === 'email' && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e!.target.value)) {
					setInputError(inputElement, 'Please enter a valid email address');
				}

				if (e.target.id === 'cityofresidence' && e.target.value.length >= 25) {
					setInputError(inputElement, 'City cannot be 25 characters or more');
				}

				if (e.target.id === 'cityofoperation' && e.target.value.length >= 25) {
					setInputError(inputElement, 'City cannot be 25 characters or more');
				}

				return;
			});

			inputElement.addEventListener('input', () => {
				clearInputError(inputElement);
			});
		});
	}

	async render() {
		return `
      <section class="bg-blue-400 min-h-screen py-16 flex justify-center items-center px-4">
        <form id="register" class="userForm bg-white max-w-md w-full mx-auto px-4 py-8 rounded-xl sm:px-8">
          <h1 class="text-2xl text-center" id="form-title">User Signup</h1>
          <div class="text-red-500 mt-4 form__message form__message--error"></div>
          <div class="mt-4 flex flex-col gap-[1px]">
            <label for="name" class="text-sm text-gray-800 mb-4">Full Name</label>
            <input type="text" name="name" id="name" placeholder="John Doe" class="w-full p-3 border rounded-lg form__input" data-name />
            <span class="form__input-error-message text-red-500 text-sm"></span>
          </div>
          <div class="mt-4 flex flex-col gap-[1px]">
            <label for="email" class="text-sm text-gray-800 mb-4">Email</label>
            <input type="text" name="email" id="email" placeholder="greg@example.com" class="w-full p-3 border rounded-lg form__input" data-email />
            <span class="form__input-error-message text-red-500 text-sm"></span>
          </div>
          <div class="mt-4 flex flex-col gap-[1px]" id="dob-container">
            <label for="dob" class="text-sm text-gray-800 mb-4">Date of birth</label>
            <input type="date" name="dob" id="date" placeholder="John Doe" class="w-full p-3 border rounded-lg form__input" data-dob />
            <span class="form__input-error-message text-red-500 text-sm"></span>
          </div>
          <div class="mt-4 flex flex-col gap-[1px]" id="residence-container">
            <label for="cityofresidence" class="text-sm text-gray-800 mb-4">City of residence</label>
            <input type="text" name="cityofresidence" id="cityofresidence" class="w-full p-3 border rounded-lg form__input" data-cityofresidence />
            <span class="form__input-error-message text-red-500 text-sm"></span>
          </div>
          <div class="mt-4 flex-col gap-[1px] hidden" id="operation-container">
            <label for="cityofoperation" class="text-sm text-gray-800 mb-4">City of Operation</label>
            <input type="text" name="cityofoperation" id="cityofoperation" class="w-full p-3 border rounded-lg form__input" data-cityofoperation />
            <span class="form__input-error-message text-red-500 text-sm"></span>
          </div>
          <div class="mt-4 flex flex-col gap-[1px]">
            <label for="phone" class="text-sm text-gray-800 mb-4">Phone Number</label>
            <input type="text" name="phone" id="phone" placeholder="09056363639" class="w-full p-3 border rounded-lg form__input" data-phonenumber />
            <span class="form__input-error-message text-red-500 text-sm"></span>
          </div>
          <div class="mt-4 flex flex-col gap-[1px]">
            <label for="username" class="text-sm text-gray-800 mb-4">Username</label>
            <input type="text" name="username" id="username" placeholder="username" class="w-full p-3 border rounded-lg form__input" data-username />
            <span class="form__input-error-message text-red-500 text-sm"></span>
          </div>
          <div class="mt-4 flex flex-col gap-[1px]">
            <label for="password" class="text-sm text-gray-800 mb-4">Password</label>
            <input type="password" name="password" id="password" placeholder="password" class="w-full p-3 border rounded-lg form__input" data-password />
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
            <button type="submit" id="submit-btn" class="w-full bg-blue-600 disabled:cursor-not-allowed p-3 text-base text-white rounded-lg">
              Signup
            </button>
          </div>
          
          <div class="mt-6">
            <p class="text-center">Already have an account?
              <a class="text-blue-500" href="/login" data-link>Login here</a>
            </p>
          </div>
        </form>
        
      </section> 
    `;
	}
}
