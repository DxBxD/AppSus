export default {
    template: `
    <div class="label-modal">
        <h2>Select Labels</h2>
        <div class="button-container">
        <button
            v-for="label in labels"
            :key="label"
            :class="{
            [label.toLowerCase()]: label !== 'Cancel',
            'selected': selectedLabels.includes(label),
            'cancel': label === 'Cancel'
            }"
            @click="toggleLabel(label)"
        >
            {{ label }}
        </button>
        </div>
        <div class="confirm-container">
          <button class="cancel" @click="close">Cancel</button>
          <button class="confirm-button" @click="confirm">Confirm</button>
        </div>
    </div>
    `,
    props: ['mail'],
    data() {
        return {
            labels: ['Work', 'Personal', 'Friends', 'Important', 'Spam'],
            selectedLabels: this.mail.labels
        }
    },
    methods: {
        toggleLabel(label) {
            if (label === 'Cancel') {
                this.close()
            } else {
                const index = this.selectedLabels.indexOf(label)
                if (index !== -1) {
                    this.selectedLabels.splice(index, 1)
                } else {
                    this.selectedLabels.push(label)
                }
            }
        },
        confirm() {
            this.$emit('selected-labels', this.selectedLabels)
            this.close()
        },
        close() {
            this.$emit('close')
        }
    }
}