
# Plan for Integrating Google Gemini

This document outlines a strategic approach for integrating the Google Gemini API into the Aesyros Suite to power the proposed AI-driven features.

## 1. Architectural Approach: Centralized AI Service

To ensure security, scalability, and maintainability, we will not call the Gemini API directly from the frontend applications. Instead, we will create a dedicated backend service to act as a secure intermediary.

*   **Create a `gemini-service`:** Inside the `services` directory, we will create a new Node.js service (e.g., `gemini-service`). This service will be responsible for:
    *   Securely storing and using the Google Gemini API key (via environment variables).
    *   Containing all the logic for interacting with the Gemini API (prompt engineering, request/response handling, error management).
    *   Exposing a set of internal API endpoints that the frontend applications (`align`, `foresight`, `pulse`, etc.) can call.
*   **Update the `gateway`:** The existing `gateway` service will be updated to route requests from the frontend apps to the new `gemini-service`. This maintains a single point of entry for all services.

This approach prevents the API key from being exposed in the frontend code and allows us to centralize and reuse AI logic across multiple applications.

## 2. Setup and Prerequisites

1.  **Obtain a Gemini API Key:** You will need to go to the Google AI Studio to generate an API key.
2.  **Secure API Key Storage:** The new API key should be stored in the `.env` file at the root of the `aesyros-suite` project, similar to other environment variables.
    *   Example: `GEMINI_API_KEY=your_api_key_here`
3.  **Install Google Gemini SDK:** The new `gemini-service` will need the official Google Gemini SDK for Node.js. We will add `@google/generative-ai` to its `package.json`.

## 3. Feature Implementation Examples

Here’s how we can implement some of the specific AI features using this architecture.

### A. Feature: AI Goal-Setting Coach (`Aesyros Align`)

*   **User Action:** A user types a goal into a text field in the `align` app and clicks "Get Feedback."
*   **Frontend (`align`):**
    1.  Makes a POST request to the `gateway`'s endpoint (e.g., `/api/gemini/validate-goal`).
    2.  The request body contains the user's goal text: `{ "goal": "Improve app performance." }`.
*   **Backend (`gemini-service`):**
    1.  Receives the request from the `gateway`.
    2.  Constructs a detailed prompt for the Gemini API.
        *   **Prompt Example:** *"You are an expert business consultant specializing in the SMART framework. Analyze the following goal and provide actionable suggestions to make it more Specific, Measurable, Achievable, Relevant, and Time-bound. Format your response as a list of suggestions. Goal: 'Improve app performance.'"*
    3.  Sends the prompt to the Gemini API.
    4.  Receives the response from Gemini and forwards it back to the `align` app through the `gateway`.
*   **Frontend (`align`):** Displays the AI-generated suggestions to the user.

### B. Feature: Natural Language Scenario Creation (`Aesyros Foresight`)

*   **User Action:** A user types a "what-if" scenario into the `foresight` app.
*   **Frontend (`foresight`):**
    1.  Makes a POST request to `/api/gemini/parse-scenario`.
    2.  The request body contains the natural language text: `{ "text": "What if our user base grows by 30% in the next 6 months, but our server costs also increase by 20%?" }`.
*   **Backend (`gemini-service`):**
    1.  Receives the request.
    2.  Constructs a prompt designed to extract structured data.
        *   **Prompt Example:** *"Analyze the following text and extract the key variables, their change, the magnitude of the change, and the timeframe. Return the output as a JSON object with the keys 'variable', 'change', 'magnitude', and 'timeframe'. Text: 'What if our user base grows by 30% in the next 6 months, but our server costs also increase by 20%?'"*
    3.  Sends the prompt to the Gemini API.
    4.  Parses the JSON response from Gemini and sends the structured data back to the `foresight` app.
*   **Frontend (`foresight`):** Uses the structured data to automatically populate the fields of the scenario model.

### C. Feature: AI-Powered KPI Suggestions (`Aesyros Pulse`)

*   **User Action:** A user creating a new dashboard in the `pulse` app provides their role (e.g., "Head of Marketing").
*   **Frontend (`pulse`):**
    1.  Makes a POST request to `/api/gemini/suggest-kpis`.
    2.  The request body contains the user's role: `{ "role": "Head of Marketing" }`.
*   **Backend (`gemini-service`):**
    1.  Receives the request.
    2.  Constructs a prompt asking for relevant metrics.
        *   **Prompt Example:** *"List the top 5 most important Key Performance Indicators (KPIs) for a 'Head of Marketing' at a B2B SaaS company. Provide a brief description for each KPI. Return the output as a JSON array of objects, each with 'kpi_name' and 'description' keys."*
    3.  Sends the prompt to the Gemini API.
    4.  Returns the structured list of suggested KPIs to the `pulse` app.
*   **Frontend (`pulse`):** Displays the suggested KPIs, allowing the user to add them to their new dashboard with a single click.
