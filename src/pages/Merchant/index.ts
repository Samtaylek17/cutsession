import AbstractView from '../../AbstractView';
import Protected from '../../Authorization/Protected';
import Restricted from '../../Authorization/Restricted';
import Navbar from '../../components/Navbar';

class Merchant extends AbstractView {
	sessions: Record<string, any>[];
	constructor(params: any) {
		super(params);

		this.setTitle('Studio');
		this.sessions = [];
	}

	scripts() {
		const user = JSON.parse(localStorage.getItem('user') as string);
		const sessionTemplate = document.querySelector<HTMLTemplateElement>('[data-session-template]')!;
		const sessionContainer = document.querySelector('[data-session-container]')!;

		const options = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Prefer: 'code=200, dynamic=true' },
		};

		fetch(`https://stoplight.io/mocks/pipeline/pipelinev2-projects/111233856/studios/${user.token}`, options)
			.then((response) => response.json())
			.then((response) => {
				this.sessions = response.forEach(
					(session: { type: string | null; startsAt: string | null; endsAt: string | null }) => {
						const row = (sessionTemplate.content!.cloneNode(true) as HTMLElement).children[0];
						const type = row.querySelector('[data-type]')!;
						const startsAt = row.querySelector('[data-startsat]')!;
						const endsAt = row.querySelector('[data-endsat]')!;
						type.textContent = session.type;
						startsAt.textContent = session.startsAt;
						endsAt.textContent = session.endsAt;
						sessionContainer.append(row);
					}
				);
			})
			.catch((err) => console.error(err));
	}

	async render() {
		new Protected();

		new Restricted('MERCHANT');

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
					<div class="flex mt-8 gap-8 justify-between flex-col-reverse sm:flex-row">
						<h3 class="text-2xl">All Sessions</h3>
						<a href="/session/create" class="bg-blue-800 text-white px-8 py-2 rounded-md" data-link>Create Session</a>
					</div>
					<table class="border-collapse w-full border border-slate-400 mt-16 dark:border-slate-500 bg-white text-sm shadow-sm">
						<thead class="bg-slate-50">
							<tr>
								<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Type</th>
								<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Starts At</th>
								<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Ends At</th>
							</tr>
						</thead>
						<tbody data-session-container>

						</tbody>
					</table>
          <template data-session-template>
            <tr>
              <td class="border border-slate-300 p-4 text-slate-500" data-type></td>
              <td class="border border-slate-300 p-4 text-slate-500" data-startsat></td>
              <td class="border border-slate-300 p-4 text-slate-500" data-endsat></td>
            </tr>
          </template>
				</div>
			</section>
    `;
	}
}

export default Merchant;
