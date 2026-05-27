document.addEventListener('DOMContentLoaded', async (e) => {
    // Data/state
    const response = await fetch("./data/data.json");
    const availableJobs = await response.json();

    const selectedFilters = [];

    // DOM references
    const filtersSection = document.querySelector(".filters");
    const filterList = document.getElementById("filter-list");
    const clearBtn = document.getElementById("clear-btn");
    const jobsListContainer = document.getElementById("jobs-list");
    const jobCardTemplate = document.getElementById("job-card-template");

    // Helpers
    function getTags(job) {
        const { role, level, languages, tools } = job;

        return [
            role,
            level,
            ...languages,
            ...tools
        ];
    };

    function createUL(parentNode, className) {
        const ul = document.createElement("ul");
        ul.className = className;

        parentNode.appendChild(ul);

        return ul;
    };

    function createLI(textContent, list, clickHandler = null) {
        const li = document.createElement("li");
        li.textContent = textContent;

        if (clickHandler) {
            li.addEventListener("click", clickHandler);
        }

        list.appendChild(li);
    };

    // Actions
    function addFilter(filter) {
        if (selectedFilters.includes(filter)) return;
        
        selectedFilters.push(filter);

        createLI(filter, filterList, (e) => removeFilter(filter, e.currentTarget));

        renderJobCards();
    };

    function removeFilter(filter, filterElement) {
        const index = selectedFilters.indexOf(filter);

        if (index !== -1) {
            selectedFilters.splice(index, 1);
        }

        filterElement.remove();

        renderJobCards();
    };

    function clearFilters() {
        selectedFilters.length = 0;
        filterList.innerHTML = "";

        renderJobCards();
    };

    // Rendering
    function renderJobCards() {
        if (selectedFilters.length === 0) {
            filtersSection.classList.add("hidden");
        } else {
            filtersSection.classList.remove("hidden");
        }

        const filteredJobs = availableJobs.filter((availableJob) => {
            const tags = getTags(availableJob);

            return selectedFilters.every((selectedFilter) => {
                return tags.includes(selectedFilter);
            });
        });

        jobsListContainer.innerHTML = "";

        filteredJobs.forEach((job) => {
            const {
                logo,
                company,
                newJob,
                featured,
                position,
                postedAt,
                contract,
                location
            } = job;

            const jobCard = jobCardTemplate.content.cloneNode(true);

            const eyebrow = jobCard.querySelector(".job-card-eyebrow");
            const metaList = jobCard.querySelector(".job-card-meta");
            const tagsList = jobCard.querySelector(".job-card-tags");

            const tags = getTags(job);

            const logoImage = jobCard.querySelector(".job-card-logo");
            logoImage.src = logo;
            logoImage.alt = `${company} logo`;

            jobCard.querySelector(".job-card-company").textContent = company;

            if (newJob || featured) {
                const statusList = createUL(eyebrow, "job-card-status");

                if (newJob) createLI("new", statusList);
                if (featured) createLI("featured", statusList);
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

            tags.forEach((tag) => {
                createLI(tag, tagsList, () => addFilter(tag));
            });

            jobsListContainer.appendChild(jobCard);
        });
    };

    // Event listeners
    clearBtn.addEventListener("click", clearFilters);

    renderJobCards();
});