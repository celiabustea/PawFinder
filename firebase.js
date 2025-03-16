import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Helper function to normalize text (remove diacritics and convert to lowercase)
const normalizeText = (text) => {
    if (text === null || text === undefined) {
        return ""; // Return an empty string for null or undefined values
    }
    return text
        .normalize("NFD") // Normalize diacritics
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .toLowerCase(); // Convert to lowercase
};

// Map English keywords to Romanian equivalents
const keywordMap = {
    "cat": ["pisica", "pisică", "motan"],
    "black": ["negru", "neagră"],
    "unknown": ["necunoscut", "necunoscută"],
};

// Translate details to Romanian keywords
const translateDetails = (details) => {
    const translatedDetails = {};
    for (const [key, val] of Object.entries(details)) {
        if (val === null || val === undefined) {
            translatedDetails[key] = []; // Skip null or undefined values
        } else if (keywordMap[val]) {
            translatedDetails[key] = keywordMap[val];
        } else {
            translatedDetails[key] = [val]; // Use the original value if no translation exists
        }
    }
    return translatedDetails;
};

export const searchLostAnimals = async (details) => {
    try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const posts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            author: doc.data().author || "",
            content: doc.data().content || "",
            imageurl: doc.data().imageurl || "",
            timestamp: doc.data().timestamp || "",
            title: doc.data().title || "",
            type: doc.data().type || "", // Use the existing "type" field (e.g., "Lost" or "Found")
        }));

        // Translate details to Romanian keywords
        const translatedDetails = translateDetails(details);

        const filteredPosts = posts.filter((post) => {
            // Filter by intent
            if (details.intent === "lost" && post.type !== "Found") {
                return false; // Skip posts that are not "Lost"
            }
            if (details.intent === "found" && post.type !== "Lost") {
                return false; // Skip posts that are not "Found"
            }

            const content = normalizeText(post.content);

            // Check if the post content includes any of the translated details
            return Object.entries(translatedDetails).some(([key, values]) => {
                // Skip invalid values
                if (!values || values.length === 0) {
                    return false;
                }

                // Check if the post content contains any of the translated values
                return values.some((val) => content.includes(normalizeText(val)));
            });
        });

        return filteredPosts;
    } catch (error) {
        console.error("Firebase Error:", error);
        throw error;
    }
};
