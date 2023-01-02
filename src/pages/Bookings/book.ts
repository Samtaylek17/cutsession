import Component from '../../Base';
import Protected from '../../Authorization/Protected';
import Restricted from '../../Authorization/Restricted';
import Navbar from '../../components/Navbar';

class Book extends Component {
	form: HTMLFormElement;
	constructor(params: Record<string, any>) {
		super(params);

		this.form = <HTMLFormElement>document.querySelector('#book-form');

		this.setTitle('Booking');
	}

	scripts() {
		const bookForm = <HTMLFormElement>document.querySelector('#book-form');

		const userObject = localStorage.getItem('user');

		const user = JSON.parse(userObject as string);

		bookForm!.addEventListener('submit', (event) => {
			event.preventDefault();
			const title = (<HTMLInputElement>document.querySelector('input[data-title]'))!.value;
			const date = (<HTMLInputElement>document.querySelector('input[data-date]'))!.value;
			const notes = (<HTMLTextAreaElement>document.querySelector('textarea[data-notes]'))!.value;
			const sessionId = (<HTMLInputElement>document.querySelector('input[data-session-id]'))!.value;

			const data = { title, date, notes, userId: user.token, sessionId };

			const options = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			};

			fetch('https://stoplight.io/mocks/pipeline/pipelinev2-projects/111233856/bookings', options)
				.then((response) => response.json())
				.then((response) => console.log(response))
				.catch((err) => console.error(err));
		});
	}

	async render() {
		new Protected();

		new Restricted('USER');

		return `
			<main class="pb-24">
				${Navbar()}
				<section class="mt-16">
					<div class="max-w-3xl mx-auto px-4 sm:px-8">
						<div class="mt-8 gap-8">
							<h3 class="text-center text-2xl font-bold">Book A Session</h3>
						</div>
						
						<form id="book-form" class="max-w-sm mx-auto mt-12">
								<div class="flex flex-col gap-1">
									<label class="text-sm text-gray-700">Title</label>
									<input type="text" name="title" class="w-full p-3 border rounded-lg form__input" data-title />
								</div>
								<div class="mt-4 flex flex-col gap-1">
									<label class="text-sm text-gray-700">Date</label>
									<input type="date" name="date" id="date" class="w-full p-3 border rounded-lg form__input" data-date />
								</div>
								<div class="mt-4 flex flex-col gap-1">
									<label for="note" class="text-sm text-gray-800">Notes</label>
									<textarea name="notes" rows="8" class="w-full p-3 border rounded-lg form__input" data-notes></textarea>
									<span class="form__input-error-message text-red-500 text-sm"></span>
								</div>

								<input type="hidden" value="${this.params.sessionId}" data-session-id />
						
								<div class="mt-6">
									<button  class="w-full bg-blue-600 p-3 text-base text-white rounded-lg">
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

export default Book;
