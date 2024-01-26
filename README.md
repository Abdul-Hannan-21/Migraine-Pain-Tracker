# Migraine Pain Tracker


## Description

Migraine Pain Tracker is a web application designed to assist users in tracking their migraine pain levels over time. The application provides insightful visualizations, including a line chart and a bar chart, to help users monitor changes in their pain levels and identify patterns.

---

## Key Features

1. **Data Visualization:** Utilizes D3.js to create interactive line and bar charts for visualizing pain levels over time.
2. **Average Pain Display:** The bar chart displays the average pain level, providing users with a quick overview of their pain trends.
3. **Pain Summary:** A pain summary feature allows users to view a comprehensive overview of their pain records, including dates, pain levels, and any associated diseases.
4. **Data Exchange Format:** Pain records are stored and retrieved in JSON format, allowing for standardized data exchange.
5. **Two-Tier Web Application:** Implements a backend and frontend architecture, enabling seamless data management and visualization.
6. **GitHub Codespaces Integration:** The application is built to run in GitHub Codespaces, providing a clickable development version accessible via a single command.

---

## How Requirements Are Met

- **Two-Tier Web App:** Implemented with a Flask backend serving as the API and a frontend built using HTML, CSS, and JavaScript.
- **Data Exchange Format:** Pain records are stored and retrieved in JSON format, allowing for standardized data exchange.
- **D3.js Usage:** D3.js is exclusively used for creating interactive data visualizations, meeting the requirement to use this framework.
- **GitHub Codespaces Integration:** The application is configured to run in GitHub Codespaces, providing a clickable development version accessible via a single command.

---

## API Endpoint: `/api/get-pain-data`

This API endpoint retrieves pain data in JSON format. It returns a list of pain entries, each containing the date, disease, and pain level.

### Method: `GET`

### Request

No request parameters are required. 

### Response

The response is a JSON object with a single key-value pair:

- **Key:** `painData`
- **Value:** An array of pain entries, where each entry contains the following fields:
  - `date`: The date of the pain entry (format: "YYYY-MM-DD").
  - `disease`: The type of disease associated with the pain entry.
  - `painLevel`: The severity of pain reported (range: 1-10).

### Example Response

json
{
    "painData": [
        {
            "date": "2024-01-25",
            "disease": "Chronic Migraine",
            "painLevel": "6"
        },
        {
            "date": "2024-01-26",
            "disease": "Chronic Migraine",
            "painLevel": "9"
        }
    ]
}



### Usage GitHub Codespaces

1. Open the project in GitHub Codespaces by clicking on the green "Code" button.
2. Select "Open with Codespaces."
3. Codespaces will automatically set up the development environment.
4. Once the environment is ready, run the Flask app using: `python app.py`.
5. Access the application in your browser at the provided URL.

**Note:** Ensure that you have Python ,Flask and Flask-CORS installed for both local and GitHub Codespaces development.

---

Feel free to reach out with any questions or feedback!

**Happy tracking!**
