const baseUrl = "https://www.themealdb.com/api/json/v1/1";

export default class ExternalServices {

  async fetchJSON(endpoint) {
    const response = await fetch(baseUrl + endpoint);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  async getCategories() {
    return this.fetchJSON("/categories.php");
  }

  async getMealsByCategory(category) {
    return this.fetchJSON(`/filter.php?c=${encodeURIComponent(category)}`);
  }

  async getMealById(id) {
    return this.fetchJSON(`/lookup.php?i=${encodeURIComponent(id)}`);
  }

}
