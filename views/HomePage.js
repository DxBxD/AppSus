export default {
    template: `
        <section class="home-page">
            <h1>Welcome Home!</h1>
            <div class="services">
                <div class="service mail-service">
                <router-link to="/mail">
                <h2>Mister Email</h2>
                <p>Stay connected with your peers through our secured mail service.</p>
            </router-link>
            </div>
                <div class="service note-service">
                <router-link to="/keep">
                <h2>Miss Keep</h2>
                <p>Keep track of your thoughts and ideas with our intuitive note service.</p>
                </router-link>
            </div>
            </div>
        </section>
    `,
}