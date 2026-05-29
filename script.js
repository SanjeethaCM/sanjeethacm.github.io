document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Reveal Animations on Load
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(reveal => {
        // Run immediately since elements are now on separate pages
        setTimeout(() => {
            reveal.classList.add('active');
        }, 150);
    });

    // 2. Subtle blob movement (parallax effect)
    const blobs = document.querySelectorAll('.blob');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (window.innerWidth / 2 - e.pageX) / speed;
            const yOffset = (window.innerHeight / 2 - e.pageY) / speed;
            blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    // 3. Dynamic GitHub Repositories Fetching (Only runs on Projects page)
    const dynamicProjects = document.getElementById('dynamic-projects');
    if (dynamicProjects) {
        // Fetch all repos sorted by newest updates
        fetch('https://api.github.com/users/sanjeethacm/repos?sort=updated')
            .then(response => response.json())
            .then(repos => {
                dynamicProjects.innerHTML = ''; // Remove loading text
                
                if (repos.length === 0) {
                    dynamicProjects.innerHTML = '<p>No repositories found.</p>';
                    return;
                }

                repos.forEach(repo => {
                    const description = repo.description || "No description provided.";
                    const language = repo.language || "Multiple";
                    const updatedDate = new Date(repo.updated_at).toLocaleDateString();

                    // Create the HTML card structure for each repo dynamically
                    const card = document.createElement('div');
                    card.className = 'project-card glass-card hover-lift reveal active';
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                    
                    card.innerHTML = `
                        <div class="project-content">
                            <div class="project-header">
                                <h3>${repo.name.replace(/-/g, ' ')}</h3>
                                <span class="pill">${language}</span>
                            </div>
                            <p class="business-problem">${description}</p>
                            <div class="repo-stats" style="margin-top:auto; padding-top: 15px;">
                                <span style="color:var(--text-secondary); font-size: 0.85rem;">
                                    ⭐ ${repo.stargazers_count} &nbsp;|&nbsp; 🔄 Updated: ${updatedDate}
                                </span>
                            </div>
                            <a href="${repo.html_url}" target="_blank" class="project-link">View Repository &rarr;</a>
                        </div>
                    `;
                    dynamicProjects.appendChild(card);
                });
            })
            .catch(error => {
                console.error("Error fetching GitHub repos:", error);
                dynamicProjects.innerHTML = '<p style="color:#ef4444; text-align:center;">Failed to load projects from GitHub automatically. Please check your connection.</p>';
            });
    }
});
