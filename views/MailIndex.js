import NavBar from '../apps/mail/cmps/NavBar.js';
import MailMenu from '../apps/mail/cmps/MailMenu.js';
import MailSort from '../apps/mail/cmps/MailSort.js';
import MailList from '../apps/mail/cmps/MailList.js';

export default {
	template: `
        <section class="mail-page">
            <NavBar />
            <div class="mail-main">
                <MailMenu />
                <div class="mail-content">
                    <MailSort />
                    <MailList @click.native="openMail" />
                </div>
            </div>
        </section>
    `,
    components: {
        NavBar,
        MailMenu,
        MailList,
        MailSort,
    },
    methods: {
        openMail() {
        }
    }
}