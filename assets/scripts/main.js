document.addEventListener('DOMContentLoaded', async (e) => {
    async function renderJobCards() {
        const response = await fetch('./data/data.json');
        const availableJobs = await response.json();

        const jobsListContainer = document.getElementById("jobs-list");
        const jobCardTemplate = document.getElementById("job-card-template");

        availableJobs.forEach((job) => {
            const {
                logo,
                company,
                newJob,
                featured,
                position,
                postedAt,
                contract,
                location,
                role,
                level,
                languages,
                tools
            } = job;

            const jobCard = jobCardTemplate.content.cloneNode(true);

            const statusList = jobCard.getElementById("job-card-status");
            const metaList = jobCard.getElementById("job-card-meta");
            const tagsList = jobCard.getElementById("job-card-tags");
            
            const tags = [];

            function createLI(textContent, list) {
                const li = document.createElement("li");
                li.textContent = textContent;
                list.appendChild(li);
            };

            jobCard.getElementById("job-card-logo").src = logo;
            jobCard.getElementById("job-card-logo").alt = `${company} logo`;

            jobCard.getElementById("job-card-company").textContent = company;

            [
                [newJob, "new"],
                [featured, "featured"]
            ].forEach(([status, text]) => {
                if (status) {
                    createLI(text, statusList);
                };
            });

            jobCard.querySelector("#job-card-title a").textContent = position;

            [
                postedAt,
                contract,
                location
            ].forEach((item) => {
                if (item.length > 0) {
                    createLI(item, metaList);
                };
            });

            [
                role,
                level,
                languages,
                tools
            ].forEach((item) => {
                if (Array.isArray(item)) {
                    item.forEach((i) => tags.push(i));
                } else {
                    tags.push(item);
                }
            });

            tags.forEach((tag) => {
                createLI(tag, tagsList);
            });

            jobsListContainer.appendChild(jobCard);
        });
    };

    renderJobCards();
});