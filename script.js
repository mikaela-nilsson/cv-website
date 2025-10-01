const app = Vue.createApp({
    data() {
        return {
            cv: {},
            active: 'summary',
            lang: 'en',
            tabKeys: ['summary', 'skills', 'experience', 'education', 'contact'],
            windowWidth: window.innerWidth
        };
    },

    mounted() {
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth;
        });
    },

    computed: {
        currentContent() {
            return this.cv[this.lang] || {};
        },
        currentTabs() {
            return this.cv[this.lang]?.tabs || [];
        },
        currentTabKey() {
	        const index = this.currentTabs.findIndex(
            t => t.toLowerCase() === this.active.toLowerCase());
            return this.tabKeys[index] || 'summary';
}
    },
    created () {
        fetch('details.json')
        .then(response => response.json())
        .then(data => {
            this.cv = data
            this.active = data[this.lang]?.tabs?.[0]?.toLowerCase() || 'summary';
        })
        .catch(error => console.error("Error loading JSON:", error));
    },
    methods: {
        activeTab(tab)
        {
            this.active = tab.toLowerCase();
        },
        nextTab(direction)
        {
            let currentIndex = this.currentTabs.findIndex(t => t.toLowerCase() === this.active);
            let newIndex = (currentIndex + direction + this.currentTabs.length) % this.currentTabs.length;
            this.active = this.currentTabs[newIndex].toLowerCase();
        },
        toggleLang()
        {
            this.lang = this.lang === 'en' ? 'sv' : 'en';
            this.active = this.cv[this.lang]?.tabs?.[0]?.toLowerCase() || 'summary';
        }
    }
});

app.mount('#app');

// Arrow key navigation for tabs
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        app._instance.proxy.nextTab(1);
    }
    else if (event.key === 'ArrowLeft') {
        app._instance.proxy.nextTab(-1);
    }
});