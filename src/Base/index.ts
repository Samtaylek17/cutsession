export default class Component {
	params: Record<string, any>;
	constructor(params: Record<string, any>) {
		this.params = params;
	}

	setTitle(title: string) {
		document.title = title;
	}

	async render() {
		return ``;
	}
}
