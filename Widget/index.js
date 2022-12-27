async function handleFetchSessions(merchantId) {
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
			return data;
		} else {
			const error = await response.json();
			return error;
		}
	} catch (error) {
		console.log(error);
	}
}

const CALENDAR_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#FFFFFF"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
  <line x1="16" y1="2" x2="16" y2="6"></line>
  <line x1="8" y1="2" x2="8" y2="6"></line>
  <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
`;

const CLOSE_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="#FFFFFF" stroke="#FFFFFF"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
`;

class CutSession {
	position = {};
	sessions;
	open = false;
	merchantId;
	viewSessionsIcon;
	closeIcon;
	sessionContainer;

	constructor({ merchantId, position = 'bottom-right' }) {
		if (!merchantId) {
			throw new Error('Merchant ID is required for initialisation');
		}

		this.merchantId = merchantId;
		this.position = this.getPosition(position);
		this.open = false;
		this.initialise();
		this.createStyles();
	}

	getPosition(position) {
		const [vertical, horizontal] = position.split('-');
		return {
			[vertical]: '30px',
			[horizontal]: '30px',
		};
	}

	async initialise() {
		const container = document.createElement('div');
		container.style.position = 'fixed';
		Object.keys(this.position).forEach((key) => (container.style[key] = this.position[key]));
		document.body.appendChild(container);

		const buttonContainer = document.createElement('button');
		buttonContainer.classList.add('button__container');

		const viewSessionsIcon = document.createElement('span');
		viewSessionsIcon.innerHTML = CALENDAR_SVG;
		viewSessionsIcon.classList.add('widget__icon');
		this.viewSessionsIcon = viewSessionsIcon;

		const closeIcon = document.createElement('span');
		closeIcon.innerHTML = CLOSE_SVG;
		closeIcon.classList.add('widget__icon', 'widget__hidden');
		this.closeIcon = closeIcon;

		buttonContainer.appendChild(this.viewSessionsIcon);
		buttonContainer.appendChild(this.closeIcon);
		buttonContainer.addEventListener('click', this.toggleOpen.bind(this));

		this.sessionContainer = document.createElement('div');
		this.sessionContainer.classList.add('widget__hidden', 'session__container');

		const sessions = await handleFetchSessions(this.merchantId);
		this.sessions = sessions;
		this.createSessionContainerContent(sessions);

		container.appendChild(this.sessionContainer);
		container.appendChild(buttonContainer);
	}

	createSessionContainerContent(sessions) {
		this.sessionContainer.innerHTML = '';

		const weekDaySessions = sessions.filter((session) => session.type === 'WeekDay');
		const weekEndSessions = sessions.filter((session) => session.type === 'WeekEnd');
		const content = document.createElement('div');

		content.innerHTML = `
      <div class="content max-w-3xl w-full mx-auto">
        <div class="relative rounded-xl overflow-auto">
          <div class="shadow-sm overflow-hidden my-8">
            <div>
              <h2 class="mb-4 font-medium">Sessions available during weekdays.</h2>
              <table
                class="border-collapse border border-solid border-slate-900 table-auto w-full text-sm"
              >
                <thead>
                  ${renderTableHeaders()}
                </thead>
                <tbody>
                  ${renderTableRows(weekDaySessions)}
                </tbody>
              </table>
            </div>


            <div class="mt-12">
              <h2 class="mb-4 font-medium">Sessions available during weekend.</h2>

              <table
                class="border-collapse border border-solid border-slate-900 table-auto w-full text-sm"
              >
                <thead>
                  ${renderTableHeaders()}
                </thead>
                <tbody>
                  ${renderTableRows(weekEndSessions)}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    `;

		this.sessionContainer.appendChild(content);
	}

	createStyles() {
		const styleTag = document.createElement('style');
		styleTag.innerHTML = `
        .widget__icon {
          cursor: pointer;
          width: 60%;
          position: absolute;
          top: 18px;
          left: 18px;
          transition: transform .3s ease;
        }
        .widget__hidden {
            transform: scale(0);
        }
        .button__container {
            border: none;
            background-color: #0f172a;
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }
        .session__container {
            box-shadow: 0 0 18px 8px rgba(0, 0, 0, 0.1), 0 0 32px 32px rgba(0, 0, 0, 0.08);
            width: 600px;
            overflow: auto;
            right: -25px;
            bottom: 75px;
            max-height: 400px;
            position: absolute;
            transition: max-height .2s ease;
            font-family: Helvetica, Arial ,sans-serif;
        }
        .session__container.hidden {
            max-height: 0px;
        }
        .session__container h2 {
            margin: 0;
            padding: 20px 20px;
            color: #fff;
            background-color: #0f172a;
        }
        .session__container .content {
            border: 1px solid #dbdbdb;
            padding: 30px 10px;
            display: flex;
            background-color: #fff;
            flex-direction: column;
        }
    `.replace(/^\s+|\n/gm, '');
		document.head.appendChild(styleTag);
	}

	toggleOpen() {
		this.open = !this.open;
		if (this.open) {
			this.viewSessionsIcon.classList.add('widget__hidden');
			this.closeIcon.classList.remove('widget__hidden');
			this.sessionContainer.classList.remove('widget__hidden');
		} else {
			this.createSessionContainerContent(this.sessions);
			this.viewSessionsIcon.classList.remove('widget__hidden');
			this.closeIcon.classList.add('widget__hidden');
			this.sessionContainer.classList.add('widget__hidden');
		}
	}
}

function renderTableHeaders() {
	return `
      <tr>
        <th class="border-b border-slate-900 font-medium p-4 pl-8 pt-4 pb-3 text-black text-left">
          S/N
        </th>
        <th
          class="border-b border-slate-900 font-medium p-4 pl-8 pt-4 pb-3 text-black text-left"
        >
          Type
        </th>
        <th
          class="border-b border-slate-900 font-medium p-4 pt-4 pb-3 text-black text-left"
        >
          Starts At
        </th>
        <th
          class="border-b border-slate-900 font-medium p-4 pr-8 pt-4 pb-3 text-black text-left"
        >
          Ends At
        </th>
      </tr>
    `;
}

function renderTableRows(data) {
	return data
		.map(
			(session, i) => `
      <tr>
        <td class="border-b border-slate-900 p-4 pl-8 text-black">${i + 1}</td>
        <td class="border-b border-slate-900 p-4 pl-8 text-black">
          ${session.type}
        </td>
        <td class="border-b border-slate-900 p-4 text-black">${session.startsAt}</td>
        <td class="border-b border-slate-900 p-4 pr-8 text-black">
          ${session.endsAt}
        </td>
      </tr>
    `
		)
		.join('')
		.toString();
}

function initializeWidget() {
	const script = document.querySelector('script[data-widget]');
	const merchantId = script?.getAttribute('data-merchantId');

	if (!merchantId) {
		throw new Error('Merchant ID missing!');
	}

	return new CutSession({
		merchantId,
		position: 'bottom-right',
	});
}

initializeWidget();
