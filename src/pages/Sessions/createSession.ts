import moment from 'moment';
import Component from '../../Base';
import Protected from '../../Authorization/Protected';
import Restricted from '../../Authorization/Restricted';
import Navbar from '../../components/Navbar';
import { navigateTo } from '../../main';

class CreateSession extends Component {
	constructor(params: Record<string, any>) {
		super(params);

		this.setTitle('Studio');
	}

	scripts() {
		const userObject = window.localStorage.getItem('user');

		const merchant = JSON.parse(userObject as string);

		const sessionForm = document.querySelector('#session-form')!;

		document.querySelector('#startsAt')!.addEventListener('change', () => {
			const startsAt = new Date().toDateString() + ' ' + (<HTMLInputElement>document.querySelector('#startsAt'))!.value;

			const duration = (<HTMLSelectElement>document.querySelector('#duration'))!.value;

			// @ts-ignore
			const endsAt = moment(new Date(startsAt)).add(duration, 'm').toDate();

			const endTime = new Date(endsAt).toLocaleTimeString();

			document.querySelector('#endsAt')!.setAttribute('value', endTime);
		});

		sessionForm.addEventListener('submit', (event) => {
			event.preventDefault();
			const dayType = (<HTMLSelectElement>document.querySelector('#day-type'))!.value;
			const startsAt = (<HTMLInputElement>document.querySelector('#startsAt'))!.value;
			const endsAt = (<HTMLInputElement>document.querySelector('#endsAt'))!.value;

			const data = { type: dayType, startsAt, endsAt };

			const options = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			};

			fetch(`https://stoplight.io/mocks/pipeline/pipelinev2-projects/111233856/studios/${merchant.token}`, options)
				.then((response) => response.json())
				.then(() => {
					navigateTo('/merchant');
				})
				.catch((err) => console.error(err));
		});
	}

	async render() {
		new Protected();

		new Restricted('MERCHANT');

		return `
			<main class="pb-24">
				${Navbar()}
				<section class="mt-16">
					<div class="max-w-3xl mx-auto">
							<h3 class="text-center text-2xl font-bold text-slate-800">Create New Session</h3>

							<form id="session-form" class="max-w-sm mx-auto mt-12">
								<div class="flex flex-col gap-1">
									<label class="text-sm text-gray-700">Session Type</label>
									<select name="type" id="day-type" class="w-full p-3 border rounded-lg form__input">
										<option value="WeekEnd">WeekEnd</option>
										<option value="WeekDay">WeekDay</option>
									</select>
								</div>
								<div class="mt-4 flex flex-col gap-1">
									<label class="text-sm text-gray-700">Duration</label>
									<select name="duration" id="duration" class="w-full p-3 border rounded-lg form__input">
										<option value="45">45 Minutes</option>
										<option value="60">60 Minutes</option>
										<option value="90">90 Minutes</option>
									</select>
								</div>
								<div class="mt-4 flex flex-col gap-1">
									<label for="startsAt" class="text-sm text-gray-800">Starts At</label>
									<input type="time" step="1" min="09:00" max="20:00" name="startsAt" id="startsAt" class="w-full p-3 border rounded-lg form__input" data-startsat />
									<span class="form__input-error-message text-red-500 text-sm"></span>
								</div>
								<div class="mt-4 flex flex-col gap-[1px]">
									<label for="endsAt" class="text-sm text-gray-800">Ends At</label>
									<input type="time" step="1" disabled name="endsAt" id="endsAt" class="w-full p-3 border rounded-lg form__input" data-endsat />
									<span class="form__input-error-message text-red-500 text-sm"></span>
								</div>
								<div class="mt-6">
									<button type="submit" class="w-full bg-blue-600 p-3 text-base text-white rounded-lg">
										Save
									</button>
								</div>
							</form>
					</div>
				</section>
			</main>
    `;
	}
}

export default CreateSession;
