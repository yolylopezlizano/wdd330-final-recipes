// src/js/nutrition.js

const API_KEY = "oE1FY3Zlhl+T5adRLjQR5g==UQYW75uyleUcO174";   // pega tu key sin espacios ni saltos

export async function getNutrition(ingredient) {
  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(ingredient)}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      return { calories:"N/A", protein_g:"N/A", fat_total_g:"N/A", carbohydrates_total_g:"N/A" };
    }

    return data[0]; // returns result for the first ingredient

  } catch (error) {
    console.error("Nutrition API error:", error);
    return { calories:"N/A", protein_g:"N/A", fat_total_g:"N/A", carbohydrates_total_g:"N/A" };
  }
}


