import AbstractView from '../../AbstractView';
import Protected from '../../Authorization/Protected';
import Restricted from '../../Authorization/Restricted';
import Navbar from '../../components/Navbar';

class User extends AbstractView {
	studios: never[];
	constructor(params: any) {
		super(params);

		this.setTitle('Studio');
		this.studios = [];
	}

	handleSearch(event: { preventDefault: () => void; target: { elements: { [x: string]: { value: any } } } }) {
		event.preventDefault();

		const searchTerm = event.target.elements['search'].value;

		const tokens = searchTerm
			.toLowerCase()
			.split(' ')
			.filter((token: string) => token.trim() !== '');

		if (tokens.length) {
			const searchTermRegex = new RegExp(tokens.join('|'), 'gim');
			// const filteredList =
		}
	}

	scripts() {
		const user = JSON.parse(localStorage.getItem('user') as string);

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
				this.studios = response.data;
				const merchants = response.data
					.map((merchant: any) => {
						return `
							<a href="/studio/${
								merchant.merchantId || merchant.userId
							}" class="hover:shadow-md p-4 rounded cursor-pointer flex flex-col gap-2" data-link>
                <div class="flex justify-between">
                  <h6 class="capitalize">${merchant.name}</h6>
                  <h6 class="capitalize">${merchant.cityOfOperation}</h6>
                </div>
                <div class="flex flex-col sm:flex-row justify-between">
                  <p class="capitalize text-slate-600 text-sm italic truncate">${merchant.email}</p>
                  <p class="capitalize text-slate-600 text-sm italic">${merchant.phoneNumber}</p>
                </div>
              </a>
					`;
					})
					.join('');

				document.getElementById('studios')!.innerHTML = merchants;
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
              <input type="search" placeholder="Search studio by name/city" class="border border-slate-300 p-3 w-full rounded-md" />
              <button type="submit" class="bg-blue-800 text-white py-3 px-6 rounded-md">Search</button>
            </div>
          </form>
          <div class="flex flex-col gap-8 mt-16" id="studios">

          </div>
				</div>
			</section>
    `;
	}
}

export default User;
