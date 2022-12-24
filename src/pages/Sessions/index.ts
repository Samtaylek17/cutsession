import AbstractView from '../../AbstractView';
import Protected from '../../Authorization/Protected';
import Restricted from '../../Authorization/Restricted';
import Navbar from '../../components/Navbar';

class User extends AbstractView {
	constructor(params: any) {
		super(params);

		this.setTitle('Studio');
	}

	scripts() {
		const user = JSON.parse(localStorage.getItem('user') as string);

		const options = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Prefer: 'code=200, dynamic=true' },
		};

		fetch(`https://stoplight.io/mocks/pipeline/pipelinev2-projects/111233856/studios/${user.token}`, options)
			.then((response) => response.json())
			.then((response) => {
				const sessions = response
					.map((session: any) => {
						return `
							<tr>
								<td class="border border-slate-300 p-4 text-slate-500 ">${session.type}</td>
								<td class="border border-slate-300 p-4 text-slate-500 ">${session.startsAt}</td>
								<td class="border border-slate-300 p-4 text-slate-500">${session.endsAt}</td>
								<td class="border border-slate-300 p-4 text-slate-500">
                  <a href="/session/${session.id}/book" class="bg-blue-800 py-2 px-6 rounded-md text-white text-xs" data-link>Book</a>
                </td>
							</tr>
					`;
					})
					.join('');

				document.getElementById('studio-sessions')!.innerHTML = sessions;
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
					<div class="flex mt-8 gap-8 justify-between flex-col-reverse sm:flex-row">
						<h3 class="text-2xl">All Sessions</h3>
					</div>
					<div class="overflow-auto">
						<table class="border-collapse w-full border border-slate-400 mt-16 dark:border-slate-500 bg-white text-sm shadow-sm">
							<thead class="bg-slate-50">
								<tr>
									<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Type</th>
									<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Starts At</th>
									<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Ends At</th>
									<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Action</th>
								</tr>
							</thead>
							<tbody id="studio-sessions">

							</tbody>
						</table>
					</div>
				</div>
			</section>
    `;
	}
}

export default User;
