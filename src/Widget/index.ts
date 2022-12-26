export function sessionWidgets() {
	document.addEventListener('DOMContentLoaded', () => {
		const merchant = document.querySelector<HTMLDivElement>('[data-merchant]')!;

		if (merchant === null) {
			throw new Error('Missing Merchant ID');
		}

		const merchantId = merchant.getAttribute('data-merchant');

		if (merchantId === null || merchantId === '') {
			merchant.innerHTML = `
        <div class="mx-auto max-w-sm my-8">
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-flex text-red-500 text-center">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>  
          </div>

          <h1 class="text-center">Missing Merchant Id</h1>
          <p class="text-center text-red-500">You need to pass in your merchant Id</p>
        </div>
      `;

			return;
		}

		const options = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Prefer: 'code=200, dynamic=true' },
		};

		fetch(`https://stoplight.io/mocks/pipeline/pipelinev2-projects/111233856/studios/${merchantId}`, options)
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
			})
			.catch((err) => console.error(err));
	});
}
