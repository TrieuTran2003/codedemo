document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    document.getElementById('refreshButton').addEventListener('click', () => {
        socket.emit('requestSensorData');
    });

    socket.emit('requestSensorData');

    const ctx = document.getElementById('sensorChart').getContext('2d');
    const sensorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Smoke Value',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Fire Value',
                    data: [],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'second',
                        tooltipFormat: 'HH:mm:ss', // Format for tooltip
                        displayFormats: {
                            minute: 'HH:mm' // Format for x-axis labels
                        }
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    socket.on('sensorData', (data) => {
        document.getElementById('lastUpdateTime').innerText = data.lastUpdateTime;
        document.getElementById('smokeValue').innerText = data.smoke_value;
        document.getElementById('fireValue').innerText = data.fire_value;
        document.getElementById('pumpState').innerText = data.pump_state ? 'On' : 'Off';
        document.getElementById('buzzerState').innerText = data.buzzer_state ? 'On' : 'Off';

        const smokeThreshold = 400;
        const fireThreshold = 400;
        const smokeDefValue = 0;
        const fireDefValue = 4095;

        if (Math.abs(data.smoke_value - smokeDefValue) > smokeThreshold) {
            document.getElementById('smokeValue').classList.add('high');
        } else {
            document.getElementById('smokeValue').classList.remove('high');
        }

        if (Math.abs(data.fire_value - fireDefValue) > fireThreshold) {
            document.getElementById('fireValue').classList.add('high');
        } else {
            document.getElementById('fireValue').classList.remove('high');
        }

        if (Math.abs(data.smoke_value - smokeDefValue) > smokeThreshold) {
            document.getElementById('smokeValue').classList.add('high');
        } else {
            document.getElementById('smokeValue').classList.remove('high');
        }

        if (Math.abs(data.fire_value - fireDefValue) > fireThreshold) {
            document.getElementById('fireValue').classList.add('high');
        } else {
            document.getElementById('fireValue').classList.remove('high');
        }

        const pumpStateElement = document.getElementById('pumpState');
        if (data.pump_state) {
            pumpStateElement.classList.add('high');
        } else {
            pumpStateElement.classList.remove('high');
        }

        const buzzerStateElement = document.getElementById('buzzerState');
        if (data.buzzer_state) {
            buzzerStateElement.classList.add('high');
        } else {
            buzzerStateElement.classList.remove('high');
        }
    });

    socket.on('updateDatabase', (data) => {
        const tableBody = document.querySelector('#databaseTable tbody');
        if (tableBody) {
            tableBody.innerHTML = ''; // Clear existing rows

            data.sensorDataList.forEach(sensorData => {
                const row = document.createElement('tr');
                const formattedDate = new Date(sensorData.lastUpdateTime).toLocaleString('vi-VN', { hour12: false }).replace(',', '');
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${sensorData.smoke_value}</td>
                    <td>${sensorData.fire_value}</td>
                    <td class="${sensorData.pump_state ? 'high' : ''}">${sensorData.pump_state ? 'On' : 'Off'}</td>
                    <td class="${sensorData.buzzer_state ? 'high' : ''}">${sensorData.buzzer_state ? 'On' : 'Off'}</td>
                `;
                tableBody.appendChild(row);
            });

            const pagination = document.getElementById('pagination');
            pagination.innerHTML = ''; // Clear existing pagination

            for (let i = 1; i <= data.totalPages; i++) {
                const pageLink = document.createElement('a');
                pageLink.href = '#';
                pageLink.className = `page-link ${i === data.page ? 'active' : ''}`;
                pageLink.dataset.page = i;
                pageLink.innerText = i;
                pagination.appendChild(pageLink);
            }
        } else {
            console.error('Table body element not found');
        }
    });

    socket.on('updateChart', (data) => {
        const newLabels = data.map(d => new Date(d.lastUpdateTime));
        const newSmokeData = data.map(d => d.smoke_value);
        const newFireData = data.map(d => d.fire_value);

        if (JSON.stringify(sensorChart.data.labels) !== JSON.stringify(newLabels) ||
            JSON.stringify(sensorChart.data.datasets[0].data) !== JSON.stringify(newSmokeData) ||
            JSON.stringify(sensorChart.data.datasets[1].data) !== JSON.stringify(newFireData)) {
            sensorChart.data.labels = newLabels;
            sensorChart.data.datasets[0].data = newSmokeData;
            sensorChart.data.datasets[1].data = newFireData;
            sensorChart.update();
            console.log('Chart updated');
        }
    });

    document.getElementById('pagination').addEventListener('click', (event) => {
        if (event.target.classList.contains('page-link')) {
            const page = event.target.dataset.page;
            socket.emit('changePage', { page });
        }
    });
});