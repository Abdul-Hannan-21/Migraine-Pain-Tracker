document.addEventListener('DOMContentLoaded', () => {
    const serverURL = window.location.origin; 
    const painForm = document.getElementById('pain-form');
    const painLevelInput = document.getElementById('pain-level');
    const diseaseInput = document.getElementById('disease');
    const dateInput = document.getElementById('date');
    const painList = document.getElementById('pain-list');
    const lineChartContainer = document.getElementById('line-chart');
    const barChartContainer = document.getElementById('bar-chart');
    const pieChartContainer = document.getElementById('pie-chart');
    
    function addPainToList(painLevel, disease, date) {
        const listItem = document.createElement('li');
        listItem.textContent = `Pain Level ${painLevel}: ${disease}, Date: ${date}`;
        painList.appendChild(listItem);
    }

    function addPain(pain) {
        fetch(`${serverURL}/api/add-pain`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pain),
        })
        .then(response => response.json())
        .then(data => {
            addPainToList(data.painLevel, data.disease, data.date);
            fetchPainLevels();
        })
        .catch(error => console.error('Error:', error));
    }

    fetchPainLevels();

    painForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const painLevel = painLevelInput.value;
        const disease = diseaseInput.value;
        const date = dateInput.value;

        if (painLevel && disease && date) {
            addPain({ painLevel, disease, date });
            painLevelInput.value = '';
            diseaseInput.value = '';
            dateInput.value = '';
        } else {
            alert('Please enter all values.');
        }
    });

    function fetchPainLevels() {
        fetch(`${serverURL}/api/get-pain-data`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            painList.innerHTML = '';
            data.painData.forEach(pain => addPainToList(pain.painLevel, pain.disease, pain.date));
            renderCharts(data.painData);
        })
        .catch(error => console.error('Error:', error));
    }

    function renderCharts(painData) {
        renderLineChart(painData);
        renderBarChart(painData);
    }

    function renderLineChart(painData) {
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
    
        lineChartContainer.innerHTML = ''; // Clear existing chart
    
        const svg = d3.select('#line-chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
        const x = d3.scaleBand()
            .domain(painData.map(d => d.date))
            .range([0, width])
            .padding(0.1);
    
        const y = d3.scaleLinear()
            .domain([0, 10]) // Adjusted to cover the full range of pain levels
            .range([height, 0]);
    
        const lineColor = d3.scaleOrdinal(d3.schemeCategory10);
    
        svg.selectAll('.line')
            .data(painData)
            .enter().append('line')
            .attr('class', 'line')
            .style('stroke', (_, i) => lineColor(i)) // Assign color based on index
            .attr('x1', d => x(d.date) + x.bandwidth() / 2)
            .attr('x2', (d, i) => i < painData.length - 1 ? x(painData[i + 1].date) + x.bandwidth() / 2 : x(d.date) + x.bandwidth() / 2)
            .attr('y1', d => y(d.painLevel))
            .attr('y2', (d, i) => i < painData.length - 1 ? y(painData[i + 1].painLevel) : y(d.painLevel))
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2);
    
        svg.selectAll('.dot')
            .data(painData)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(d.date) + x.bandwidth() / 2)
            .attr('cy', d => y(d.painLevel))
            .attr('r', 8)
            .style('fill', (_, i) => lineColor(i)) // Assign color based on index
    
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));
    
        svg.append('g')
            .call(d3.axisLeft(y));
    
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
    
        svg.selectAll('.dot')
            .on('mouseover', function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(`Pain Level: ${d.painLevel}<br>Date: ${d.date}`)
                    .style('left', (event.pageX) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function (d) {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    }
    function renderBarChart(painData) {
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
    
        barChartContainer.innerHTML = ''; // Clear existing chart
    
        // Group the painData by date and calculate the average pain level for each date
        const aggregatedData = d3.group(painData, d => d.date);
        const averagePainData = Array.from(aggregatedData, ([date, pains]) => ({
            date: date,
            painLevel: d3.mean(pains, d => d.painLevel) // Calculate the average pain level for the date
        }));
    
        const svg = d3.select('#bar-chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
        const x = d3.scaleBand()
            .domain(averagePainData.map(d => d.date))
            .range([0, width])
            .padding(0.1);
    
        const y = d3.scaleLinear()
            .domain([0, 10]) // Set the domain to cover the full range of pain levels (1 to 10)
            .nice()
            .range([height, 0]);
    
        const color = d3.scaleOrdinal(d3.schemeCategory10);
    
        svg.selectAll('.bar')
            .data(averagePainData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.date))
            .attr('width', x.bandwidth())
            .attr('y', d => y(d.painLevel))
            .attr('height', d => height - y(d.painLevel))
            .style('fill', (_, i) => color(i)) // Assign color based on index
            .on('mouseover', function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(`Average Pain Level: ${d.painLevel.toFixed(2)}<br>Date: ${d.date}`)
                    .style('left', (event.pageX) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function (d) {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));
    
        svg.append('g')
            .call(d3.axisLeft(y));
    
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
    }
    
    
});
