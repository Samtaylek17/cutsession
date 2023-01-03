const Navbar = () => {
	const userObj = JSON.parse(localStorage.getItem('user') as string);
	const user = userObj?.accessType;
	console.log(user);
	return `
    <section class="bg-blue-800 pb-4">
      <div class="container mx-auto px-4 sm:px-8">
        <div class="flex flex-col gap-4 sm:justify-between sm:items-center py-4 sm:flex-row">
          <div>
            <a href="/" class="text-white text-3xl font-bold" data-link>cutsession.<span class="text-base">com</span></a>
          </div>
          ${
						user === undefined
							? `
            <div class="flex gap-8 items-center">
              <a href="/login" id="logout-btn" class="bg-white text-blue-700 px-8 py-2 rounded-md" data-link>Login</a>
              <a href="/signup" id="logout-btn" class="bg-white text-blue-700 px-8 py-2 rounded-md" data-link>Signup</a>
            </div>
          `
							: `
          
            <div class="flex gap-8 items-center">
              ${
								user === 'USER'
									? `<a href="/session/bookings" class="text-white text-base" data-link>Session Bookings</a>`
									: `<a href="/merchant/bookings" class="text-white text-base" data-link>Bookings</a>`
							}
              
              <button type="button" id="logout-btn" class="bg-white text-blue-700 px-8 py-2 rounded-md">Logout</button>
            </div>
          
          `
					}
        </div>
      </div>
    </section>
  `;
};

export default Navbar;
