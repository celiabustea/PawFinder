import axios from "axios";

const api = axios.create({
    baseURL: "https://api.deepseek.com/v1",
    headers: {
        Authorization: `Bearer sk-7066fb6aafbf4263a0385d5f7771ba0c`,
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

export const interpretUserInput = async (input) => {
    try {
        console.log("📡 Sending request to DeepSeek API...");

        const response = await api.post("/chat/completions", {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "You are a friendly and helpful assistant that helps users find their lost pets or report found pets. Ask for details like type, breed, color, and location in a conversational way. Respond in JSON format with extracted details. Ensure that the response is ONLY valid JSON and does not include any additional text. Also, include a field 'intent' with the value 'lost' if the user lost a pet or 'found' if the user found a pet.",
                },
                {
                    role: "user",
                    content: input,
                },
            ],
        });

        console.log("📝 Raw API Response:", response.data);

        if (!response.data?.choices?.[0]?.message?.content) {
            throw new Error("Invalid API response format: Missing content.");
        }

        // Extract and clean the content
        const content = response.data.choices[0].message.content;
        console.log("📄 Parsed Content:", content);

        let details;
        try {
            // Remove surrounding ```json ... ``` if present
            const cleanedContent = content.replace(/^```json\s*|\s*```$/g, "").trim();

            // Parse the cleaned content as JSON
            details = JSON.parse(cleanedContent);
        } catch (err) {
            throw new Error("API response is not valid JSON. Raw content: " + content);
        }

        console.log("🔍 Extracted Details:", details);

        // Ensure required fields are present
        if (!details.type || !details.intent) {
            console.warn("⚠️ Incomplete details received:", details);
            details.type = details.type || "necunoscut";
            details.intent = details.intent || "lost"; // Default to "lost" if intent is missing
        }

        return details;
    } catch (error) {
        console.error("🚨 API Error:", error);
        throw new Error(error.response?.data?.message || "DeepSeek API request failed. Please check your input and try again.");
    }
};