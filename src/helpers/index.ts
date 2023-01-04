/**
 * "Set the form message element's text content to the message argument, remove the success and error
 * classes from the message element, and add the type argument as a class to the message element."
 *
 * The function takes three arguments:
 *
 * formElement: The form element.
 * type: The type of message.
 * message: The message to display.
 * The function uses the formElement argument to get the form message element. It then sets the
 * message element's text content to the message argument
 * @param {Element | null} formElement - The form element that we want to set the message for.
 * @param {string} type - The type of message to display. This can be either 'success' or 'error'.
 * @param {any} message - The message to display.
 */
export function setFormMessage(formElement: Element | null, type: string, message: any) {
	const messageElement = formElement!.querySelector('.form__message');

	messageElement!.textContent = message;

	messageElement!.classList.remove('form__message--success', 'form__message--error');
	messageElement!.classList.add(`form__message--${type}`);
}

/**
 * It adds a class to the input element and sets the error message
 * @param inputElement - The input element that you want to set the error message for.
 * @param {any} message - The error message that will be displayed.
 */
export function setInputError(
	inputElement: any,
	message: string
	/* It's an array of objects that contain the path and the view. */
) {
	inputElement.classList.add('text-red-500');
	inputElement.parentElement.querySelector('.form__input-error-message').textContent = message;
}

/**
 * It removes the red border and error message from an input element
 * @param {Element} inputElement - The input element that we want to clear the error message from.
 */
export function clearInputError(inputElement: Element) {
	inputElement!.classList.remove('text-red-500');
	inputElement!.parentElement!.querySelector('.form__input-error-message')!.textContent = '';
}
