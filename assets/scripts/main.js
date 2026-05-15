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

            const eyebrow = jobCard.querySelector(".job-card-eyebrow");
            const metaList = jobCard.querySelector(".job-card-meta");
            const tagsList = jobCard.querySelector(".job-card-tags");

            const hasStatus = newJob || featured;
            const tags = [];

            function createUL(parentNode, className) {
                const ul = document.createElement("ul");
                ul.className = className;
                parentNode.appendChild(ul);
            };

            function createLI(textContent, list) {
                const li = document.createElement("li");
                li.textContent = textContent;
                list.appendChild(li);
            };

            jobCard.querySelector(".job-card-logo").src = logo;
            jobCard.querySelector(".job-card-logo").alt = `${company} logo`;

            jobCard.querySelector(".job-card-company").textContent = company;

            if (hasStatus) {
                const statuses = [
                    [newJob, "new"],
                    [featured, "featured"]
                ];

                createUL(eyebrow, "job-card-status");

                const statusList = jobCard.querySelector(".job-card-status");

                statuses.forEach(([status, text]) => {
                    if (status) {
                        createLI(text, statusList);
                    };
                });
            };

            jobCard.querySelector(".job-card-title a").textContent = position;

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