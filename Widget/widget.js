const CALENDAR_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 absolute">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
`;

const CLOSE_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
`;

const widgetContainerClass = ['fixed', 'bottom-8', 'right-8'];
// bg-blue-800 h-14 w-14 rounded-[50%] inline-flex justify-center items-center text-white
const buttonContainerClass = [
	'bg-blue-800',
	'h-14',
	'w-14',
	'rounded-[50%]',
	'inline-flex',
	'justify-center',
	'items-center',
	'text-white',
];

// shadow-2xl w-[600px] overflow-auto -right-6 bottom-20 max-h-[450px] absolute bg-white p-4
const sessionContainerClass = [
	'shadow-2xl',
	'sm:w-[600px]',
	'overflow-auto',
	'-right-6',
	'bottom-20',
	'max-h-[450px]',
	'absolute',
	'bg-white',
	'p-4',
];

// w-6 h-6 absolute
const buttonIconClass = ['w-6', 'h-6', 'absolute'];

async function fetchSessions(merchantId) {
	try {
		const response = await fetch(
			`https://stoplight.io/mocks/pipeline/pipelinev2-projects/111233856/studios/${merchantId}`,
			{
				headers: {
					Prefer: 'code=200, dynamic=true',
				},
			}
		);

		if (response.ok) {
			const data = await response.json();
			console.log(data);
			return data;
		} else {
			const error = await response.json();
			return error;
		}
	} catch (error) {
		console.log(error);
	}
}

class Sessions {
	viewSession;
	closeSession;
	sessions;
	sessionContainer;
	merchantId;

	constructor({ merchantId }) {
		if (!merchantId) {
			throw new Error('Merchant ID is missing!');
		}

		this.merchantId = merchantId;
		this.initializeWidget();
	}

	async initializeWidget() {
		const widgetContainer = document.createElement('div');
		widgetContainer.classList.add(...widgetContainerClass);
		document.body.appendChild(widgetContainer);

		const buttonContainer = document.createElement('button');
		buttonContainer.classList.add(...buttonContainerClass);

		const viewSession = document.createElement('span');
		viewSession.innerHTML = CALENDAR_ICON;
		viewSession.classList.add(...buttonIconClass);
		this.viewSession = viewSession;

		const closeSession = document.createElement('span');
		closeSession.innerHTML = CLOSE_ICON;
		closeSession.classList.add('scale-0', ...buttonIconClass);
		this.closeSession = closeSession;

		buttonContainer.appendChild(this.viewSession);
		buttonContainer.appendChild(this.closeSession);
		buttonContainer.addEventListener('click', this.toggleSessions.bind(this));

		this.sessionContainer = document.createElement('div');
		this.sessionContainer.classList.add('scale-0', ...sessionContainerClass);

		const sessions = await fetchSessions(this.merchantId);
		this.sessions = sessions;
		this.appendSessionContents(sessions);

		widgetContainer.appendChild(this.sessionContainer);
		widgetContainer.appendChild(buttonContainer);
	}

	appendSessionContents(sessions) {
		this.sessionContainer.innerHTML = '';

		const weekDaySessions = sessions.filter((session) => session.type === 'WeekDay');
		const weekEndSessions = sessions.filter((session) => session.type === 'WeekEnd');
		const content = document.createElement('div');

		content.innerHTML = `
		<div class="max-w-3xl w-full mx-auto">
			<div class="relative rounded-md overflow-auto">
				<div class="my-8">
					<div class="overflow-auto">
						<h2 class="mb-4 font-medium">Sessions available during weekdays.</h2>
						<table class="border-collapse w-full border border-slate-400 mt-4 dark:border-slate-500 bg-white text-sm shadow-sm">
							<thead class="bg-slate-50">
								${renderSessionHeaders()}
							</thead>
							<tbody id="studio-sessions">
								${renderSessionBody(weekDaySessions)}
							</tbody>
						</table>
					</div>

					<div class="overflow-auto mt-8">
						<h2 class="mb-4 font-medium">Sessions available during weekdays.</h2>
						<table class="border-collapse w-full border border-slate-400 mt-4 dark:border-slate-500 bg-white text-sm shadow-sm">
							<thead class="bg-slate-50">
								${renderSessionHeaders()}
								
							</thead>
							<tbody id="studio-sessions">
								${renderSessionBody(weekEndSessions)}
								
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		`;

		this.sessionContainer.appendChild(content);
	}

	toggleSessions() {
		this.open = !this.open;
		if (this.open) {
			this.viewSession.classList.add('scale-0');
			this.closeSession.classList.remove('scale-0');
			this.sessionContainer.classList.remove('scale-0');
		} else {
			this.appendSessionContents(this.sessions);
			this.viewSession.classList.remove('scale-0');
			this.closeSession.classList.add('scale-0');
			this.sessionContainer.classList.add('scale-0');
		}
	}
}

function renderSessionHeaders() {
	return `
		<tr>
			<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">S/N</th>
			<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Type</th>
			<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Starts At</th>
			<th class="w-1/2 border border-slate-300  font-semibold p-4 text-slate-900  text-left">Ends At</th>
		</tr>
	`;
}

function renderSessionBody(sessions) {
	return sessions
		.map(
			(session, i) => `
		<tr>
			<td class="border border-slate-300 p-4 text-slate-500 ">${i + 1}</td>
			<td class="border border-slate-300 p-4 text-slate-500 ">${session.type}</td>
			<td class="border border-slate-300 p-4 text-slate-500 ">${session.startsAt}</td>
			<td class="border border-slate-300 p-4 text-slate-500">${session.endsAt}</td>
		</tr>
	`
		)
		.join('')
		.toString();
}

function launchWidget() {
	const script = document.querySelector('script[data-widget]');
	const merchantId = script?.getAttribute('data-merchant') || '';

	if (!merchantId) {
		throw new Error('Missing Merchant ID');
	}

	return new Sessions({
		merchantId,
	});
}

launchWidget();
