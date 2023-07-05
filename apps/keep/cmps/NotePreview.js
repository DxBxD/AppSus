export default {
    props: ['note'],
    template: `
        <section class="note-preview">
            <article class="note">
                <p> {{ note.info.txt }} </p>
            </article>
        </section>`,
}
