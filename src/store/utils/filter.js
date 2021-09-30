export const correctSuggestions = (array, input, filterBy) => array.filter((suggestion) =>
    suggestion?.[filterBy]?.toLowerCase().includes(input.toLowerCase()))

export const filterByIssues = (array, min, max) => array.filter(suggestion => suggestion.open_issues >= min && suggestion.open_issues <= max)

export const sort = ({ array, sortBy, type }) => Array.from(array).sort((a, b) => {
    if (type === "ascending") {
        if (a?.[sortBy] > b?.[sortBy]) {
            return -1;
        }
        if (b?.[sortBy] < a?.[sortBy]) {
            return 1;
        }
        return 0;
    } else {
        if (a?.[sortBy] < b?.[sortBy]) {
            return -1;
        }
        if (b?.[sortBy] > a?.[sortBy]) {
            return 1;
        }
        return 0;
    }
})