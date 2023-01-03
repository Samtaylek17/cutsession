import Component from '../../Base';
import Protected from '../../Authorization/Protected';
import Restricted from '../../Authorization/Restricted';
import Navbar from '../../components/Navbar';

class Bookings extends Component {
	merchants: Record<string, any>[];
	url: string;
	constructor(params: Record<string, any>) {
		super(params);

		this.setTitle('Bookings');
		this.merchants = [];
		this.url = `https://stoplight.io/mocks/pipeline/pipelinev2-projects/111233856`;
	}

	scripts() {
		const options = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Prefer: 'code=200, dynamic=true' },
		};

		fetch(`${this.url}/clients?type=MERCHANT&limit=20&offset=1`, options)
			.then((response) => response.json())
			.then((response) => {
				const merchants = response.data
					.filter((client: { merchantId: any }) => client.merchantId)
					.map((client: { name: any }) => {
						return `<option value="${client.name}">${client.name}</option>`;
					});

				document.querySelector<HTMLSelectElement>('#merchant')!.innerHTML += merchants;
			});

		const form = document.querySelector<HTMLFormElement>('#search-bookings')!;
		const period = document.querySelector<HTMLSelectElement>('[data-period]')!;

		period.addEventListener('change', (event) => {
			if ((event!.target! as HTMLSelectElement).value === 'single') {
				document.querySelector('#single-container')!.classList.remove('hidden');
				document.querySelector('#from-container')!.classList.add('hidden');
				document.querySelector('#to-container')!.classList.add('hidden');
			}
			if ((event!.target! as HTMLSelectElement).value === 'range') {
				document.querySelector('#single-container')!.classList.add('hidden');
				document.querySelector('#from-container')!.classList.remove('hidden');
				document.querySelector('#to-container')!.classList.remove('hidden');
			}
		});

		form.addEventListener('submit', (event) => {
			event.preventDefault();

			const city = document.querySelector<HTMLInputElement>('[data-city]')!.value;
			const merchant = document.querySelector<HTMLSelectElement>('[data-merchant]')!.value;
			const startDate = document.querySelector<HTMLInputElement>('[data-startdate]')!.value;
			const endDate = document.querySelector<HTMLInputElement>('[data-enddate]')!.value;
			const singleDate = document.querySelector<HTMLInputElement>('[data-singledate]')!.value;

			let data: { city: string; merchant: string; period?: string } = { city: city, merchant };

			if (period.value === 'single') {
				data.period = singleDate;
			}

			if (period.value === 'range') {
				data.period = `${startDate}:${endDate}`;
			}

			const options = {
				method: 'GET',
				headers: { 'Content-Type': 'application/json', Prefer: 'code=200, dynamic=true' },
			};

			fetch(
				`https://stoplight.io/mocks/pipeline/pipelinev2-projects/111233856/bookings?limit=20&offset=1&city=${data.city}&merchant=${data.merchant}&period=${data.period}`,
				options
			)
				.then((response) => response.json())
				.then((response) => {
					const bookings = response.data
						.map((booking: { bookingRef: any; startsAt: any; endsAt: any; bookingId: any }, index: number) => {
							return `
              <tr data-bookingid="${booking.bookingId}">
								<td class="border border-slate-300 p-4 text-slate-500 ">${index + 1}</td>
								<td class="border border-slate-300 p-4 text-slate-500 ">${booking.bookingRef}</td>
								<td class="border border-slate-300 p-4 text-slate-500 ">${booking.startsAt}</td>
								<td class="border border-slate-300 p-4 text-slate-500">${booking.endsAt}</td>
								<td class="border border-slate-300 p-4 text-slate-500">
                  <button class="bg-blue-800 p-2 text-sm text-white rounded-md" data-open="${
										booking.bookingId
									}">View details</button>
                </td>
							</tr>
              
              `;
						})
						.join('');

					document.querySelector<HTMLTableElement>('#bookings')!.innerHTML = bookings;

					const openBtns = document.querySelectorAll<HTMLButtonElement>('[data-open]')!;
					const closeBtns = document.querySelectorAll<HTMLButtonElement>('[data-close]')!;
					const modal = document.querySelector<HTMLDivElement>('[data-modal]')!;

					for (const btn of openBtns) {
						btn.addEventListener('click', (event) => {
							const res = response.data.filter(
								(e: { bookingId: string | undefined }) =>
									e.bookingId === (event.target as HTMLButtonElement).dataset.open
							)[0];
							modal.classList.remove('hidden');
							document.querySelector('[data-body]')!.innerHTML = `
                <h4 class="text-lg font-bold mt-4">Booking Details</h4>
                <hr class="my-2" />
                <div class="flex flex-col gap-4">
                    <h5 class="text-base font-bold">Booking Ref: <span class="font-normal">${res.bookingRef}</span></h5>
                    <h5 class="text-base font-bold">Title: <span class="font-normal">${res.title}</span></h5>
                    <h5 class="text-base font-bold">Notes: <span class="font-normal">${res.notes}</span></h5>
                    <h5 class="text-base font-bold">Starts At: <span class="font-normal">${res.startsAt}</span></h5>
                    <h5 class="text-base font-bold">Ends At: <span class="font-normal">${res.endsAt}</span></h5>
                    <h5 class="text-base font-bold">Date: <span class="font-normal">${res.date}</span></h5>
                </div>
              `;
						});
					}

					for (const btn of closeBtns) {
						btn.addEventListener('click', () => {
							modal.classList.add('hidden');
						});
					}

					window.onclick = function (event) {
						if (event.target == modal) {
							modal.classList.add('hidden');
						}
					};
				})
				.catch((err) => console.error(err));
		});
	}

	async render() {
		new Protected();

		new Restricted('USER');

		// const navbar = await new Navbar(this.params).render();

		return `
      <main class="pb-24">
				${Navbar()}
        <section>
          <div class="max-w-5xl mx-auto px-4 sm:px-8">
            <h5 class="mt-8 text-xl">Search Bookings</h5>
            <form id="search-bookings">
              <div class="grid grid-cols-1 items-end sm:grid-cols-3 sm:gap-4">
                <div class="mt-4 flex flex-col gap-[1px] w-full">
                  <label for="city" class="text-sm text-gray-800">City</label>
                  <input type="text" name="city" id="city" placeholder="Enter city" class="w-full p-3 border rounded-lg form__input" data-city />
                  <span class="form__input-error-message text-red-500 text-sm"></span>
                </div>
                <div class="mt-4 flex flex-col gap-1 w-full">
                  <label class="text-sm text-gray-700">Merchant</label>
                  <select name="merchant" id="merchant" class="w-full p-3 border rounded-lg form__input" data-merchant>
                    <option value hidden>Select Merchant</option>
                  </select>
                </div>
                <div class="mt-4 flex flex-col gap-1 w-full">
                  <label class="text-sm text-gray-700">Period</label>
                  <select name="period" id="period" class="w-full p-3 border rounded-lg form__input" data-period>
                    <option value hidden>Select Period</option>
                    <option value="single">Single Date</option>
                    <option value="range">Date Range</option>
                  </select>
                </div>
                <div class="mt-4 flex-col gap-[1px] hidden" id="single-container">
                  <label for="single-date" class="text-sm text-gray-800">Date</label>
                  <input type="date" name="single-date" id="single-date" class="w-full p-3 border rounded-lg form__input" data-singledate />
                  <span class="form__input-error-message text-red-500 text-sm"></span>
                </div>
                <div class="mt-4 flex-col gap-[1px] w-full hidden" id="from-container">
                  <label for="single-date" class="text-sm text-gray-800">Date From</label>
                  <input type="date" name="single-date" id="single-date" class="w-full p-3 border rounded-lg form__input" data-startdate />
                  <span class="form__input-error-message text-red-500 text-sm"></span>
                </div>
                <div class="mt-4  flex-col gap-[1px] w-full hidden" id="to-container">
                  <label for="single-date" class="text-sm text-gray-800">Date To</label>
                  <input type="date" name="single-date" id="single-date" class="w-full p-3 border rounded-lg form__input" data-enddate />
                  <span class="form__input-error-message text-red-500 text-sm"></span>
                </div>
                <div class="mt-4">
                  <button type="submit" id="submit-btn" class="w-full flex-none bg-blue-800 disabled:cursor-not-allowed p-3 text-base text-white rounded-lg">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
        <section>
          <div class="max-w-5xl mx-auto px-4 sm:px-8">
            <h3 class="mt-8 text-xl">All Bookings</h3>

            <div class="overflow-auto mt-4">
							<table class="table-auto border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white text-sm shadow-sm sm:table-fixed">
								<thead class="bg-slate-50">
									<tr>
										<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">S/N</th>
										<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Booking Ref</th>
										<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Starts At</th>
										<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Ends At</th>
										<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Action</th>
									</tr>
								</thead>
								<tbody id="bookings">

								</tbody>
							</table>
						</div>
          </div>
        </section>
        <div data-modal="booking-modal" class="hidden fixed z-10 pt-32 left-0 top-0 w-full h-full overflow-auto bg-[rgba(0,0,0,0.4)]">
          <div class="bg-[#fefefe] m-auto p-5 w-full sm:w-1/2 shadow-2xl shadow-slate-700 rounded-md">
            <button class="inline-flex float-right cursor-pointer" data-close="close">
              <span class="close">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </button>
            <div data-body>
            
            </div>
          </div>
        </div>
      </main>
    `;
	}
}

export default Bookings;
