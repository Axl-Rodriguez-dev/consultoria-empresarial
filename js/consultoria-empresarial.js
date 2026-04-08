document.addEventListener('DOMContentLoaded', () => {
    fetch('./data/consultoria_empresarial.json')
        .then(res => res.json())
        .then(data => {
            const srv = data.find(item => item.id === "service-1");
            if (srv) renderConsultoria(srv);
        })
        .catch(err => console.error("Error cargando consultoría:", err));
});

function renderConsultoria(srv) {
    document.getElementById('srv-category').textContent = srv.category;
    document.getElementById('srv-name').textContent = srv.name;
    document.getElementById('srv-accent').textContent = srv.titleAccent;
    document.getElementById('srv-lead').textContent = srv.lead;
    document.getElementById('srv-methodology').textContent = srv.methodology;

    const stackGrid = document.getElementById('srv-stack');
    srv.technologies.forEach(tech => {
        const item = document.createElement('span');
        item.className = 'stack-badge';
        item.textContent = tech;
        stackGrid.appendChild(item);
    });

    const featuresGrid = document.getElementById('srv-features');
    srv.features_detail.forEach(f => {
        featuresGrid.innerHTML += `
            <div class="feature-card">
                <span class="f-icon">${f.icon}</span>
                <div class="f-info">
                    <h4>${f.title}</h4>
                    <p>${f.desc}</p>
                </div>
            </div>`;
    });

    const processGrid = document.getElementById('srv-process');
    srv.process.forEach(p => {
        processGrid.innerHTML += `
            <div class="process-item">
                <span class="p-number">${p.step}</span>
                <div class="p-content">
                    <h5>${p.title}</h5>
                    <p>${p.text}</p>
                </div>
            </div>`;
    });
}