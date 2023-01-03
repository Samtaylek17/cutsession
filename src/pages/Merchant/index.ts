import Component from '../../Base';
import Protected from '../../Authorization/Protected';
import Restricted from '../../Authorization/Restricted';
import Navbar from '../../components/Navbar';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

class Merchant extends Component {
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

		const openBtn = document.querySelector<HTMLButtonElement>('[data-widget]')!;
		const closeBtn = document.querySelector<HTMLButtonElement>('[data-close]');
		const modal = document.querySelector<HTMLDivElement>('[data-modal]')!;

		openBtn.addEventListener('click', function () {
			modal.classList.remove('hidden');
			document.querySelector('[data-body]')!.innerHTML = `
				<div class="mt-8">
					<h2 class="text-xl font-bold">Embed Widget</h2>
					<p class="mt-5">Copy the script below and add to the body of your html page to include an embeddable widget in your website</p>
					<blockquote class="bg-gray-800 px-4 py-6 flex  items-center justify-center mt-8 relative">
						<button class="text-slate-100 absolute top-2 right-4 bg-slate-600 py-1 px-3 rounded-md" data-copy-js>Copy</button>
						<div class="flex py-4 flex-shrink-0 overflow-x-scroll max-w-full">
							<code class="flex-none">
								${
									hljs.highlight(
										`
										<script data-widget data-merchant="<your-merchant-id>" src="./Widget/widget.js"></script>
							`,
										{ language: 'xml' }
									).value
								}
							
							</code>
						</div>
					</blockquote>
					<p class="mt-5">The widget is designed to integrate beautifully with Tailwind css.</p>
					<p>Add the script below to the head of your html page</p>
					<blockquote class="bg-gray-800 p-4 flex  items-center justify-center mt-8 relative">
						<button class="text-slate-100 absolute top-2 right-4 bg-slate-600 py-1 px-3 rounded-md" data-copy-css>Copy</button>
						<div class="flex py-4 flex-shrink-0 overflow-x-scroll max-w-full">
							<code class="flex-none">
								${
									hljs.highlight(
										`
											<script src="https://cdn.tailwindcss.com"></script>
							`,
										{ language: 'xml' }
									).value
								}
							
							</code>
						</div>
					</blockquote>
				</div>
			`;

			const jsBtn = document.querySelector<HTMLButtonElement>('[data-copy-js]')!;
			const cssBtn = document.querySelector<HTMLButtonElement>('[data-copy-css]')!;

			jsBtn.addEventListener('click', () => {
				navigator.clipboard.writeText(
					`<script data-widget data-merchant="<your-merchant-id>" src="./Widget/widget.js"></script>`
				);
				jsBtn.textContent = 'Copied';

				setTimeout(() => {
					jsBtn.textContent = 'Copy';
				}, 2000);
			});

			cssBtn.addEventListener('click', () => {
				navigator.clipboard.writeText(`<script src="https://cdn.tailwindcss.com"></script>`);
				cssBtn.textContent = 'Copied';

				setTimeout(() => {
					cssBtn.textContent = 'Copy';
				}, 2000);
			});
		});

		closeBtn?.addEventListener('click', () => {
			modal.classList.add('hidden');
		});

		window.onclick = function (event) {
			if (event.target == modal) {
				modal.classList.add('hidden');
			}
		};
	}

	async render() {
		new Protected();

		new Restricted('MERCHANT');

		return `
			<main class="pb-24">
				${Navbar()}
				<section class="mt-16">
					<div class="max-w-3xl mx-auto px-4 sm:px-8">
						<div class="flex justify-between">
							<a href="/session/create" class="bg-blue-800 text-white px-8 py-2 rounded-md" data-link>Create Session</a>
							<button data-widget class="border-blue-800 border  text-blue-800  px-8 py-2 rounded-md">Embed widget</button>
						</div>
						<div class="flex mt-8 gap-8 justify-between flex-col-reverse sm:flex-row">
							<h3 class="text-2xl">All Sessions</h3>
						</div>
						<table class="border-collapse w-full border border-slate-400 mt-8 dark:border-slate-500 bg-white text-sm shadow-sm">
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

					</div>
				</section>
			</main>
    `;
	}
}

export default Merchant;
