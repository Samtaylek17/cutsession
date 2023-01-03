import Component from '../../Base';
import Navbar from '../../components/Navbar';

class HomePage extends Component {
	constructor(params: Record<string, any>) {
		super(params);
		this.setTitle('Cutsession | Home');
	}

	scripts() {}

	async render() {
		return `
      <main class="pb-24">
        ${Navbar()}
      </main>
    `;
	}
}

export default HomePage;
