import AbstractView from '../../AbstractView';
import Protected from '../../Authorization/Protected';
import Restricted from '../../Authorization/Restricted';
import Navbar from '../../components/Navbar';

class User extends AbstractView {
	studios: Record<string, any>[];
	constructor(params: any) {
		super(params);

		this.setTitle('Studio');
		this.studios = [];
	}

	scripts() {
		const user = JSON.parse(localStorage.getItem('user') as string);
		const studioTemplate = document.querySelector<HTMLTemplateElement>('[data-studio-template]')!;
		const studioContainer = document.querySelector<HTMLDivElement>('[data-studios]')!;
		const searchInput = document.querySelector<HTMLInputElement>('[data-search]')!;

		searchInput.addEventListener('input', (e) => {
			const value = (e.target as HTMLInputElement).value.toLowerCase();
			this.studios.forEach((studio) => {
				const isVisible =
					studio.name.toLowerCase().includes(value) || studio.cityofoperation!.toLowerCase().includes(value);
				studio.element.classList.toggle('hidden', !isVisible);
			});
		});

		const options = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Prefer: 'code=200, dynamic=true' },
		};

		fetch(
			`https://stoplight.io/mocks/pipeline/pipelinev2-projects/111233856/clients?type=MERCHANT&limit=20&offset=1`,
			options
		)
			.then((response) => response.json())
			.then((response) => {
				this.studios = response.data.map(
					(studio: {
						name: string | null;
						email: string | null;
						cityOfOperation: string;
						cityOfResidence: string;
						phoneNumber: string | null;
					}) => {
						const card = (studioTemplate.content!.cloneNode(true) as HTMLElement).children[0];
						const name = card.querySelector('[data-name]')!;
						const email = card.querySelector('[data-email]')!;
						const cityofoperation = card.querySelector('[data-cityofoperation]')!;
						const phoneNumber = card.querySelector('[data-phonenumber]')!;
						name.textContent = studio.name;
						email.textContent = studio.email;
						cityofoperation.textContent = studio.cityOfOperation || studio.cityOfResidence;
						phoneNumber.textContent = studio.phoneNumber;
						card.setAttribute('href', `/studio/${user.token}`);
						studioContainer.append(card);
						return {
							name: studio.name,
							email: studio.email,
							cityofoperation: studio.cityOfOperation || studio.cityOfResidence,
							element: card,
						};
					}
				);
			})
			.catch((err) => console.error(err));
	}

	async render() {
		new Protected();

		new Restricted('USER');

		const navbar = await new Navbar(this.params).render();

		return `
      <section class="bg-blue-800 pb-8">
        <div class="container mx-auto px-4 sm:px-8">
          ${navbar}
					<div class="mt-4">
						<h3 class="text-white">Dashboard / Merchant</h3>
					</div>
        </div>
      </section>
			<section class="mt-16">
				<div class="max-w-3xl mx-auto px-4 sm:px-8">
          <form>
            <div class="flex gap-3">
              <input type="search" placeholder="Search studio by name/city" class="border border-slate-300 p-3 w-full rounded-md" data-search />
            </div>
          </form>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16" id="studios" data-studios>
						
          </div>
					<template data-studio-template>
						<a class="shadow-md p-4 rounded cursor-pointer flex flex-col gap-2" data-link>
								<div class="flex gap-2 items-center">
									<h6 class="capitalize truncate">Name:</h6>
									<p class="capitalize text-slate-600 text-sm italic truncate" data-name></p>
								</div>
								<div class="flex gap-2 items-center">
									<h6 class="capitalize truncate">Email:</h6>
									<p class="capitalize text-slate-600 text-sm italic truncate" data-email></p>
								</div>
								<div class="flex gap-2 items-center">
									<h6 class="capitalize truncate">City:</h6>
									<p class="capitalize text-slate-600 text-sm italic truncate" data-cityofoperation></p>
								</div>
								<div class="flex gap-2 items-center">
									<h6 class="capitalize truncate">PhoneNumber:</h6>
									<p class="capitalize text-slate-600 text-sm italic truncate" data-phonenumber></p>
								</div>
						</a>
					</template>
				</div>
			</section>
    `;
	}
}

export default User;
